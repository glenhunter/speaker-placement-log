import { supabase } from './supabase'

export const storage = {
  getAll: async () => {
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

  update: async (id, updates) => {
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

    return storage.getAll()
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('measurements')
      .delete()
      .eq('id', id)

    if (error) throw error

    return storage.getAll()
  },

  clear: async () => {
    const { error } = await supabase
      .from('measurements')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw error
  },
}

export const baselineStorage = {
  get: async () => {
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

  clear: async () => {
    const { error } = await supabase
      .from('baselines')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw error
  },
}
