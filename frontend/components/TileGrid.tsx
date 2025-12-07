'use client'

import { useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { tileApi, Tile } from '@/lib/api'
import { TileCard } from './TileCard'
import { AddTileButton } from './AddTileButton'

interface TileGridProps {
  userId: string
}

export function TileGrid({ userId }: TileGridProps) {
  const { instance, accounts } = useMsal()
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState(true)
  const [catalog, setCatalog] = useState<Tile[]>([])

  useEffect(() => {
    loadTiles()
  }, [userId])

  const getAccessToken = async () => {
    const account = accounts[0]
    if (!account) return null

    const response = await instance.acquireTokenSilent({
      scopes: ['User.Read'],
      account,
    })

    return response.accessToken
  }

  const loadTiles = async () => {
    try {
      const token = await getAccessToken()
      if (!token) return

      const [userTiles, catalogTiles] = await Promise.all([
        tileApi.getUserTiles(token, userId),
        tileApi.getCatalog(token),
      ])

      setTiles(userTiles.sort((a, b) => a.order - b.order))
      setCatalog(catalogTiles)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load tiles:', error)
      setLoading(false)
    }
  }

  const handleAddTile = async (tileId: string) => {
    try {
      const token = await getAccessToken()
      if (!token) return

      await tileApi.addTile(token, userId, tileId)
      await loadTiles()
    } catch (error) {
      console.error('Failed to add tile:', error)
    }
  }

  const handleRemoveTile = async (tileId: string) => {
    try {
      const token = await getAccessToken()
      if (!token) return

      await tileApi.removeTile(token, userId, tileId)
      await loadTiles()
    } catch (error) {
      console.error('Failed to remove tile:', error)
    }
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

