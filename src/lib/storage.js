import { supabase } from './supabase'

const STORAGE_KEY = 'distance-measurements'

export const storage = {
  getAll: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    }

    // Use Supabase if logged in
    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(m => ({
      id: m.id,
      distanceFromFrontWall: m.distance_from_front_wall,
      distanceFromSideWall: m.distance_from_side_wall,
      listeningPosition: m.listening_position,
      bass: m.bass,
      treble: m.treble,
      vocals: m.vocals,
      soundstage: m.soundstage,
      isFavorite: m.is_favorite,
      createdAt: m.created_at,
    }))
  },

  save: async (measurement, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const measurements = await storage.getAll(null)
      const newMeasurement = {
        ...measurement,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isFavorite: false,
      }
      measurements.push(newMeasurement)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements))
      return newMeasurement
    }

    // Use Supabase if logged in
    const { data, error } = await supabase
      .from('measurements')
      .insert([{
        distance_from_front_wall: measurement.distanceFromFrontWall,
        distance_from_side_wall: measurement.distanceFromSideWall,
        listening_position: measurement.listeningPosition,
        bass: measurement.bass,
        treble: measurement.treble,
        vocals: measurement.vocals,
        soundstage: measurement.soundstage,
        is_favorite: false,
        user_id: userId,
      }])
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      distanceFromFrontWall: data.distance_from_front_wall,
      distanceFromSideWall: data.distance_from_side_wall,
      listeningPosition: data.listening_position,
      bass: data.bass,
      treble: data.treble,
      vocals: data.vocals,
      soundstage: data.soundstage,
      isFavorite: data.is_favorite,
      createdAt: data.created_at,
    }
  },

  update: async (id, updates, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const measurements = await storage.getAll(null)
      const index = measurements.findIndex(m => m.id === id)
      if (index !== -1) {
        measurements[index] = { ...measurements[index], ...updates }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements))
      }
      return measurements
    }

    // Use Supabase if logged in
    const dbUpdates = {}
    if ('distanceFromFrontWall' in updates) dbUpdates.distance_from_front_wall = updates.distanceFromFrontWall
    if ('distanceFromSideWall' in updates) dbUpdates.distance_from_side_wall = updates.distanceFromSideWall
    if ('listeningPosition' in updates) dbUpdates.listening_position = updates.listeningPosition
    if ('bass' in updates) dbUpdates.bass = updates.bass
    if ('treble' in updates) dbUpdates.treble = updates.treble
    if ('vocals' in updates) dbUpdates.vocals = updates.vocals
    if ('soundstage' in updates) dbUpdates.soundstage = updates.soundstage
    if ('isFavorite' in updates) dbUpdates.is_favorite = updates.isFavorite

    const { error } = await supabase
      .from('measurements')
      .update(dbUpdates)
      .eq('id', id)

    if (error) throw error

    return storage.getAll(userId)
  },

  delete: async (id, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const measurements = await storage.getAll(null)
      const filtered = measurements.filter(m => m.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      return filtered
    }

    // Use Supabase if logged in
    const { error } = await supabase
      .from('measurements')
      .delete()
      .eq('id', id)

    if (error) throw error

    return storage.getAll(userId)
  },

  clear: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    // Use Supabase if logged in
    const { error } = await supabase
      .from('measurements')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw error
  },
}

const BASELINE_KEY = 'speaker-baseline'

export const baselineStorage = {
  get: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const data = localStorage.getItem(BASELINE_KEY)
      return data ? JSON.parse(data) : null
    }

    // Use Supabase if logged in
    const { data, error } = await supabase
      .from('baselines')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    if (!data) return null

    return {
      calculationType: data.calculation_type,
      methodName: data.method_name,
      speakerType: data.speaker_type,
      values: data.values,
    }
  },

  save: async (baseline, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      localStorage.setItem(BASELINE_KEY, JSON.stringify(baseline))
      return baseline
    }

    // Use Supabase if logged in
    const { data, error } = await supabase
      .from('baselines')
      .insert([{
        calculation_type: baseline.calculationType,
        method_name: baseline.methodName,
        speaker_type: baseline.speakerType,
        values: baseline.values,
        user_id: userId,
      }])
      .select()
      .single()

    if (error) throw error

    return {
      calculationType: data.calculation_type,
      methodName: data.method_name,
      speakerType: data.speaker_type,
      values: data.values,
    }
  },

  clear: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      localStorage.removeItem(BASELINE_KEY)
      return
    }

    // Use Supabase if logged in
    const { error } = await supabase
      .from('baselines')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw error
  },
}
