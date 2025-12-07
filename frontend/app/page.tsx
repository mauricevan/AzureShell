'use client'

import { useAuth } from '@/lib/useAuth'
import { TileGrid } from '@/components/TileGrid'

export default function Home() {
  const { isAuthenticated, userDetails, isLoading } = useAuth()

  const handleLogin = () => {
    window.location.href = '/.auth/login/aad'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
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
            <span className="text-gray-600">{userDetails?.name}</span>
            <button
              onClick={() => (window.location.href = '/.auth/logout')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <TileGrid userId={userDetails?.userId || ''} />
    </div>
  )
}
