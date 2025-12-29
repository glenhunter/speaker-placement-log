import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { STORAGE_KEYS, getBaseUrl, getErrorMessage } from '@/lib/constants'
import { devError } from '@/lib/utils'

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
  const [migrating, setMigrating] = useState(false)
  const migrationAttempted = useRef(false)

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)

      // Migrate localStorage data on first login (only on mount, not on every login)
      if (session?.user && !migrationAttempted.current) {
        migrationAttempted.current = true
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
    const migrated = localStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG)
    if (migrated) return

    setMigrating(true)

    try {
      let measurements = []
      let baseline = null

      // Safely parse localStorage data
      try {
        const measurementsData = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS)
        if (measurementsData) {
          measurements = JSON.parse(measurementsData)
        }
      } catch (parseError) {
        devError('Failed to parse measurements from localStorage:', parseError)
      }

      try {
        const baselineData = localStorage.getItem(STORAGE_KEYS.BASELINE)
        if (baselineData) {
          baseline = JSON.parse(baselineData)
        }
      } catch (parseError) {
        devError('Failed to parse baseline from localStorage:', parseError)
      }

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
      localStorage.setItem(STORAGE_KEYS.MIGRATION_FLAG, 'true')
    } catch (error) {
      devError('Error migrating localStorage data:', error)
      // Don't block login if migration fails
    } finally {
      setMigrating(false)
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

    // Migration will be handled by onAuthStateChange or session restore
    // Don't duplicate migration here to avoid race condition

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email) => {
    const baseUrl = getBaseUrl()
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${baseUrl}/reset-password`,
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
    migrating,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
