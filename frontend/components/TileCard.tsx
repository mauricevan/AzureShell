'use client'

import { Tile } from '@/lib/api'

interface TileCardProps {
  tile: Tile
  onRemove: () => void
}

export function TileCard({ tile, onRemove }: TileCardProps) {
  const handleClick = () => {
    window.open(tile.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="tile group relative">
      <div onClick={handleClick} className="cursor-pointer">
        <div className="flex items-center justify-center mb-4 h-16 w-16 mx-auto bg-primary-100 rounded-lg">
          {tile.icon ? (
            <img src={tile.icon} alt={tile.name} className="h-10 w-10" />
          ) : (
            <div className="text-2xl">📌</div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-center mb-2">{tile.name}</h3>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-700"
        aria-label="Remove tile"
      >
        ×
      </button>
    </div>
  )
}

