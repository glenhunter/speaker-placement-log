import { supabase } from './supabase'
import { STORAGE_KEYS } from './constants'
import { devError } from './utils'

export const storage = {
  getAll: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS)
        return data ? JSON.parse(data) : []
      } catch (error) {
        devError('Failed to parse measurements from localStorage:', error)
        return []
      }
    }

    // Use Supabase if logged in - filter by user_id for defense in depth
    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', userId)
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
      baselineMethodName: m.baseline_method_name,
      name: m.name,
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
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements))
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
        baseline_method_name: measurement.baselineMethodName,
        name: measurement.name || null,
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
      baselineMethodName: data.baseline_method_name,
      name: data.name,
    }
  },

  update: async (id, updates, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const measurements = await storage.getAll(null)
      const index = measurements.findIndex(m => m.id === id)
      if (index !== -1) {
        measurements[index] = { ...measurements[index], ...updates }
        localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurements))
        return measurements[index]
      }
      return null
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
    if ('baselineMethodName' in updates) dbUpdates.baseline_method_name = updates.baselineMethodName
    if ('name' in updates) dbUpdates.name = updates.name

    // Filter by both id and user_id for defense in depth
    const { data, error } = await supabase
      .from('measurements')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId)
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
      baselineMethodName: data.baseline_method_name,
      name: data.name,
    }
  },

  delete: async (id, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const measurements = await storage.getAll(null)
      const filtered = measurements.filter(m => m.id !== id)
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(filtered))
      return id
    }

    // Use Supabase if logged in - filter by user_id for defense in depth
    const { error } = await supabase
      .from('measurements')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    return id
  },

  clear: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      localStorage.removeItem(STORAGE_KEYS.MEASUREMENTS)
      return
    }

    // Use Supabase if logged in - explicitly filter by user_id for safety
    const { error } = await supabase
      .from('measurements')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
  },
}

export const baselineStorage = {
  /**
   * Gets all baselines for a user, ordered by most recent first.
   * For localStorage: Returns array (migrates single object if needed)
   * For Supabase: Returns all rows ordered by created_at desc
   */
  getAll: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.BASELINE)
        if (!data) return []

        const parsed = JSON.parse(data)

        // Migration: if old format (single object), convert to array
        if (parsed && !Array.isArray(parsed)) {
          const migrated = [{
            ...parsed,
            id: Date.now(),
            createdAt: new Date().toISOString(),
          }]
          localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(migrated))
          return migrated
        }

        return parsed || []
      } catch (error) {
        devError('Failed to parse baselines from localStorage:', error)
        return []
      }
    }

    // Use Supabase if logged in - filter by user_id for defense in depth
    const { data, error } = await supabase
      .from('baselines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(b => ({
      id: b.id,
      calculationType: b.calculation_type,
      methodName: b.method_name,
      speakerType: b.speaker_type,
      values: b.values,
      name: b.name,
      createdAt: b.created_at,
    }))
  },

  /**
   * Gets the most recent (active) baseline for a user.
   */
  get: async (userId) => {
    const all = await baselineStorage.getAll(userId)
    return all.length > 0 ? all[0] : null
  },

  /**
   * Saves a new baseline as the active one.
   * For localStorage: Prepends to array with id and timestamp
   * For Supabase: Inserts new row
   */
  save: async (baseline, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const all = await baselineStorage.getAll(null)
      const newBaseline = {
        ...baseline,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      }
      // Prepend new baseline (most recent first)
      const updated = [newBaseline, ...all]
      localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(updated))
      return newBaseline
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
      id: data.id,
      calculationType: data.calculation_type,
      methodName: data.method_name,
      speakerType: data.speaker_type,
      values: data.values,
      name: data.name,
      createdAt: data.created_at,
    }
  },

  /**
   * Updates a specific baseline by ID.
   */
  update: async (id, updates, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const all = await baselineStorage.getAll(null)
      const index = all.findIndex(b => b.id === id)
      if (index !== -1) {
        all[index] = { ...all[index], ...updates }
        localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(all))
        return all[index]
      }
      return null
    }

    // Use Supabase if logged in
    const dbUpdates = {}
    if ('name' in updates) dbUpdates.name = updates.name
    if ('calculationType' in updates) dbUpdates.calculation_type = updates.calculationType
    if ('methodName' in updates) dbUpdates.method_name = updates.methodName
    if ('speakerType' in updates) dbUpdates.speaker_type = updates.speakerType
    if ('values' in updates) dbUpdates.values = updates.values

    // Filter by both id and user_id for defense in depth
    const { data, error } = await supabase
      .from('baselines')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      calculationType: data.calculation_type,
      methodName: data.method_name,
      speakerType: data.speaker_type,
      values: data.values,
      name: data.name,
      createdAt: data.created_at,
    }
  },

  /**
   * Deletes a specific baseline by ID.
   */
  delete: async (id, userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      const all = await baselineStorage.getAll(null)
      const filtered = all.filter(b => b.id !== id)
      localStorage.setItem(STORAGE_KEYS.BASELINE, JSON.stringify(filtered))
      return id
    }

    // Use Supabase if logged in - filter by user_id for defense in depth
    const { error } = await supabase
      .from('baselines')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    return id
  },

  /**
   * Clears all baselines for a user.
   */
  clear: async (userId) => {
    // Use localStorage if not logged in
    if (!userId) {
      localStorage.removeItem(STORAGE_KEYS.BASELINE)
      return
    }

    // Use Supabase if logged in - explicitly filter by user_id for safety
    const { error } = await supabase
      .from('baselines')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
  },
}
