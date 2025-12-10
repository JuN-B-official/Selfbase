// Selfbase: Self-hosted sign-in page - uses DASHBOARD_USERNAME/PASSWORD env vars
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Eye, EyeOff } from 'lucide-react'

import { AuthenticationLayout } from 'components/layouts/AuthenticationLayout'
import { BASE_PATH } from 'lib/constants'
import type { NextPageWithLayout } from 'types'
import { Button, Input_Shadcn_ } from 'ui'

const SignInPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordHidden, setPasswordHidden] = useState(true)

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('selfbase_session')
    if (token) {
      router.push('/organizations')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Selfbase: Authenticate against environment variables via API
      const response = await fetch('/api/selfbase/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store session token
        localStorage.setItem('selfbase_session', data.token)
        localStorage.setItem('selfbase_user', JSON.stringify(data.user))
        router.push('/organizations')
      } else {
        setError(data.error || 'Invalid username or password')
        setLoading(false)
      }
    } catch (err) {
      setError('Authentication failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-alternative">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={
              resolvedTheme?.includes('dark')
                ? `${BASE_PATH}/img/selfbase-dark.svg`
                : `${BASE_PATH}/img/selfbase-light.svg`
            }
            alt="Selfbase Logo"
            className="h-[24px]"
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Welcome to Selfbase</h1>
          <p className="text-sm text-foreground-light">Sign in to your self-hosted dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <Input_Shadcn_
              type="text"
              placeholder="selfbase"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Input_Shadcn_
                type={passwordHidden ? 'password' : 'text'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="default"
                className="absolute right-1 top-1 px-1.5"
                icon={passwordHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                onClick={() => setPasswordHidden((prev) => !prev)}
              />
            </div>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}

SignInPage.getLayout = (page) => (
  <AuthenticationLayout>
    {page}
  </AuthenticationLayout>
)

export default SignInPage
