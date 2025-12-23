import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { resetPassword, updatePassword } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if this is a password update from email link
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (hashParams.get('type') === 'recovery') {
      setIsUpdating(true)
    }
  }, [])

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await resetPassword(email)
      setMessage('Password reset email sent. Check your inbox.')
      setEmail('')
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await updatePassword(newPassword)
      setMessage('Password updated successfully!')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6 bg-gray-800 border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {isUpdating ? 'Update Password' : 'Reset Password'}
        </h1>

        {isUpdating ? (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <Label htmlFor="newPassword" className="text-white">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-500 text-sm bg-green-900/20 p-3 rounded">
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-white"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-500 text-sm bg-green-900/20 p-3 rounded">
                {message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Back to Sign In
          </button>
        </div>
      </Card>
    </div>
  )
}
