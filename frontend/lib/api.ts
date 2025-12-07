import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
})

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Token will be added by useAuth hook in components
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface Tile {
  id: string
  name: string
  url: string
  icon?: string
  type: 'link' | 'sharepoint' | 'app'
  order: number
  pinned: boolean
}

export const tileApi = {
  getCatalog: async (token: string) => {
    const response = await api.get<Tile[]>('/api/tiles/catalog', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  getUserTiles: async (token: string, userId: string) => {
    const response = await api.get<Tile[]>(`/api/users/${userId}/tiles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  },

  addTile: async (token: string, userId: string, tileId: string) => {
    const response = await api.post(
      `/api/users/${userId}/tiles`,
      { tileId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  },

  removeTile: async (token: string, userId: string, tileId: string) => {
    await api.delete(`/api/users/${userId}/tiles/${tileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  updateTileOrder: async (token: string, userId: string, tileId: string, order: number) => {
    await api.put(
      `/api/users/${userId}/tiles/${tileId}`,
      { order },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  },
}

export default api

