import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getErrorMessage } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

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

    // Client-side validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      await resetPassword(email)
      setMessage('Password reset email sent. Check your inbox.')
      setEmail('')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Client-side validation
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
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
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10 bg-sky_blue_light-900">
        <div className="w-full max-w-sm">
        <Card className="p-6 border-2 border-sky_blue_light-700 shadow-lg">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-deep_space_blue">
                {isUpdating ? 'Update your password' : 'Reset your password'}
              </h1>
              <p className="text-sm text-sky_blue_light-400">
                {isUpdating
                  ? 'Enter your new password below'
                  : 'Enter your email to receive a password reset link'}
              </p>
            </div>

            {isUpdating ? (
              <form onSubmit={handleUpdatePassword} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                    {message}
                  </div>
                )}

                <Button type="submit" className="w-full btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update password'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRequestReset} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                    {message}
                  </div>
                )}

                <Button type="submit" className="w-full btn-primary" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset email'}
                </Button>
              </form>
            )}

            <div className="text-center text-sm text-sky_blue_light-400">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="underline underline-offset-4 hover:text-princeton_orange-600 active:text-princeton_orange-700 text-princeton_orange font-medium transition-colors"
              >
                Back to sign in
              </button>
            </div>
          </div>
        </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
