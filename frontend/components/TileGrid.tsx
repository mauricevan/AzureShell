'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import { tileApi, Tile } from '@/lib/api'
import { TileCard } from './TileCard'
import { AddTileButton } from './AddTileButton'

interface TileGridProps {
  userId: string
}

export function TileGrid({ userId }: TileGridProps) {
  const { accessToken } = useAuth()
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState(true)
  const [catalog, setCatalog] = useState<Tile[]>([])

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    if (accessToken) {
      loadTiles()
    } else {
      // If no token available, try to get it from /.auth/me
      fetchAccessToken()
    }
  }, [userId, accessToken])

  const fetchAccessToken = async () => {
    try {
      const response = await fetch('/.auth/me')
      if (response.ok) {
        const data = await response.json()
        console.log('Auth data:', data) // Debug log
        
        // Azure Static Web Apps provides accessToken or idToken
        const token = data.accessToken || data.idToken || 
                     (data.clientPrincipal?.claims?.find((c: any) => c.typ === 'id_token')?.val)
        
        if (token) {
          // Token is available, reload tiles
          loadTilesWithToken(token)
        } else {
          console.error('No token found in auth response:', data)
          setLoading(false)
        }
      } else {
        console.error('Failed to fetch auth:', response.status, response.statusText)
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch access token:', error)
      setLoading(false)
    }
  }

  const loadTilesWithToken = async (token: string) => {
    try {
      console.log('Loading tiles with token for userId:', userId)
      const [userTiles, catalogTiles] = await Promise.all([
        tileApi.getUserTiles(token, userId),
        tileApi.getCatalog(token),
      ])

      setTiles(userTiles.sort((a, b) => a.order - b.order))
      setCatalog(catalogTiles)
      setLoading(false)
    } catch (error: any) {
      console.error('Failed to load tiles:', error)
      if (error.response) {
        console.error('API Error:', error.response.status, error.response.data)
      }
      setLoading(false)
    }
  }

  const loadTiles = async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }
    await loadTilesWithToken(accessToken)
  }

  const handleAddTile = async (tileId: string) => {
    try {
      const token = accessToken || await getTokenFromAuth()
      if (!token) {
        console.error('No access token available')
        return
      }

      await tileApi.addTile(token, userId, tileId)
      await loadTilesWithToken(token)
    } catch (error) {
      console.error('Failed to add tile:', error)
    }
  }

  const handleRemoveTile = async (tileId: string) => {
    try {
      const token = accessToken || await getTokenFromAuth()
      if (!token) {
        console.error('No access token available')
        return
      }

      await tileApi.removeTile(token, userId, tileId)
      await loadTilesWithToken(token)
    } catch (error) {
      console.error('Failed to remove tile:', error)
    }
  }

  const getTokenFromAuth = async (): Promise<string | null> => {
    try {
      const response = await fetch('/.auth/me')
      if (response.ok) {
        const data = await response.json()
        return data.accessToken || null
      }
    } catch (error) {
      console.error('Failed to get token:', error)
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading tiles...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Portal</h1>
        <AddTileButton catalog={catalog} tiles={tiles} onAddTile={handleAddTile} />
      </div>

      {tiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tiles yet. Add your first tile to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiles.map((tile) => (
            <TileCard
              key={tile.id}
              tile={tile}
              onRemove={() => handleRemoveTile(tile.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}


