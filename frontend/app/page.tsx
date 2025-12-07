'use client'

import { useMsal } from '@azure/msal-react'
import { useIsAuthenticated } from '@azure/msal-react'
import { loginRequest } from '@/lib/msalConfig'
import { TileGrid } from '@/components/TileGrid'
import { useEffect, useState } from 'react'

export default function Home() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    if (isAuthenticated && accounts.length > 0) {
      setUserId(accounts[0].homeAccountId)
    }
  }, [isAuthenticated, accounts])

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error('Login failed:', e)
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Employee Portal</h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in with your work account to access your personalized portal
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Employee Portal</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{accounts[0]?.name}</span>
            <button
              onClick={() => instance.logoutPopup()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <TileGrid userId={userId} />
    </div>
  )
}

