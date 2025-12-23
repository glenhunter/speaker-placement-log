import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Migrate localStorage data on first login
      if (session?.user) {
        migrateLocalStorageData(session.user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const migrateLocalStorageData = async (userId) => {
    // Check if already migrated
    const migrated = localStorage.getItem('supabase-migrated')
    if (migrated) return

    try {
      // Retrieve localStorage data
      const measurements = JSON.parse(
        localStorage.getItem('distance-measurements') || '[]'
      )
      const baseline = JSON.parse(
        localStorage.getItem('speaker-baseline') || 'null'
      )

      // Upload measurements to Supabase with user_id
      if (measurements.length > 0) {
        const measurementsWithUser = measurements.map((m) => ({
          distance_from_front_wall: m.distanceFromFrontWall,
          distance_from_side_wall: m.distanceFromSideWall,
          listening_position: m.listeningPosition,
          bass: m.bass,
          treble: m.treble,
          vocals: m.vocals,
          soundstage: m.soundstage,
          is_favorite: m.isFavorite,
          user_id: userId,
        }))

        await supabase.from('measurements').insert(measurementsWithUser)
      }

      // Upload baseline to Supabase with user_id
      if (baseline) {
        await supabase.from('baselines').insert({
          calculation_type: baseline.calculationType || 'unknown',
          method_name: baseline.methodName,
          speaker_type: baseline.speakerType || 'conventional',
          values: baseline.values,
          user_id: userId,
        })
      }

      // Mark as migrated
      localStorage.setItem('supabase-migrated', 'true')
    } catch (error) {
      console.error('Error migrating localStorage data:', error)
    }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Migrate localStorage data on first successful login
    if (data.user) {
      await migrateLocalStorageData(data.user.id)
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/speaker-placement-log/reset-password`,
    })

    if (error) throw error
    return data
  }

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
    return data
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
