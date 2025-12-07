'use client'

import { useState } from 'react'
import { Tile } from '@/lib/api'

interface AddTileButtonProps {
  catalog: Tile[]
  tiles: Tile[]
  onAddTile: (tileId: string) => void
}

export function AddTileButton({ catalog, tiles, onAddTile }: AddTileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const availableTiles = catalog.filter(
    (catalogTile) => !tiles.some((tile) => tile.id === catalogTile.id)
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        + Add Tile
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 p-4 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-3">Available Tiles</h3>
            {availableTiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No tiles available to add</p>
            ) : (
              <ul className="space-y-2">
                {availableTiles.map((tile) => (
                  <li key={tile.id}>
                    <button
                      onClick={() => {
                        onAddTile(tile.id)
                        setIsOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <div className="font-medium">{tile.name}</div>
                      {tile.type && (
                        <div className="text-xs text-gray-500">{tile.type}</div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}

