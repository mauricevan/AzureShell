'use client'

import { useState, useEffect } from 'react'

interface UserDetails {
  userId: string
  name: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAuth() {
      try {
        const response = await fetch('/.auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.clientPrincipal) {
            setIsAuthenticated(true)
            setUserDetails({
              userId: data.clientPrincipal.userId,
              name: data.clientPrincipal.userDetails,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching auth details:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAuth()
  }, [])

  return { isAuthenticated, userDetails, isLoading }
}

