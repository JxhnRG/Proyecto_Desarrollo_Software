import axios from 'axios'

// Intenta renovar el token usando el refresh token
export const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem('refreshToken') // ✅ debe coincidir exactamente

    if (!refresh) throw new Error('No hay refresh token')

    const response = await axios.post('/api/token/refresh/', { refresh })
    const newAccess = response.data.access

    localStorage.setItem('accessToken', newAccess) // ✅ corregido

    return newAccess
  } catch (error) {
    console.error('Error al renovar token:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return null
  }
}
