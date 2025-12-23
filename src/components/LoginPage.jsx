import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        navigate('/')
      } else {
        await signUp(email, password)
        setMessage(
          'Check your email for a confirmation link to complete signup.'
        )
        setEmail('')
        setPassword('')
      }
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
          {isLogin ? 'Sign In' : 'Sign Up'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setMessage('')
            }}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>

          {isLogin && (
            <div>
              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
