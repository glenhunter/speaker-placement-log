// localStorage keys
export const STORAGE_KEYS = {
  MEASUREMENTS: 'distance-measurements',
  BASELINE: 'speaker-baseline',
  MIGRATION_FLAG: 'supabase-migrated',
}

// Auth error messages - map technical errors to user-friendly messages
export const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'Invalid email or password',
  'User not found': 'Invalid email or password',
  'Email not confirmed': 'Please confirm your email address',
  'Invalid email': 'Please enter a valid email address',
  'Password should be at least 6 characters': 'Password must be at least 6 characters',
  'User already registered': 'An account with this email already exists',
}

// Get user-friendly error message
export const getErrorMessage = (error) => {
  if (!error) return 'An error occurred'

  const message = error.message || error.toString()

  // Check for known error messages
  for (const [technical, friendly] of Object.entries(AUTH_ERROR_MESSAGES)) {
    if (message.includes(technical)) {
      return friendly
    }
  }

  // Default to generic message for unknown errors
  return 'An error occurred. Please try again.'
}

// Environment helpers
export const getBaseUrl = () => {
  if (typeof window === 'undefined') return ''
  return import.meta.env.MODE === 'production'
    ? '/speaker-placement-log'
    : ''
}
