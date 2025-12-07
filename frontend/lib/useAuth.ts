'use client'

import { useState, useEffect } from 'react'

interface UserDetails {
  userId: string
  name: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
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
            // Azure Static Web Apps provides accessToken in the response
            if (data.accessToken) {
              setAccessToken(data.accessToken)
            } else if (data.clientPrincipal.claims) {
              // Try to extract token from claims if available
              const tokenClaim = data.clientPrincipal.claims.find(
                (claim: any) => claim.typ === 'access_token' || claim.typ === 'id_token'
              )
              if (tokenClaim) {
                setAccessToken(tokenClaim.val)
              }
            }
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

  return { isAuthenticated, userDetails, accessToken, isLoading }
}

