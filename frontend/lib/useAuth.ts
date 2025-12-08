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
            
            // Azure Static Web Apps provides accessToken in the response
            let token = data.accessToken
            if (!token && data.clientPrincipal.claims) {
              // Try to extract token from claims if available
              const tokenClaim = data.clientPrincipal.claims.find(
                (claim: any) => claim.typ === 'access_token' || claim.typ === 'id_token'
              )
              if (tokenClaim) {
                token = tokenClaim.val
              }
            }
            
            if (token) {
              setAccessToken(token)
              
              // Fetch user from backend to get the internal userId
              try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                const userResponse = await fetch(`${apiUrl}/api/users/me`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                })
                
                if (userResponse.ok) {
                  const userData = await userResponse.json()
                  setUserDetails({
                    userId: userData.id, // Internal database userId
                    name: userData.displayName || data.clientPrincipal.userDetails,
                  })
                } else {
                  // Fallback to Azure AD object ID if backend call fails
                  console.warn('Failed to fetch user from backend, using Azure AD object ID')
                  setUserDetails({
                    userId: data.clientPrincipal.userId,
                    name: data.clientPrincipal.userDetails,
                  })
                }
              } catch (error) {
                console.error('Error fetching user from backend:', error)
                // Fallback to Azure AD object ID
                setUserDetails({
                  userId: data.clientPrincipal.userId,
                  name: data.clientPrincipal.userDetails,
                })
              }
            } else {
              // No token available, use Azure AD object ID as fallback
              setUserDetails({
                userId: data.clientPrincipal.userId,
                name: data.clientPrincipal.userDetails,
              })
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

