import axios from 'axios'
import { refreshAccessToken } from './authUtils'

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // o la URL de tu backend
})

// Interceptor de request: agrega access token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de response: intenta renovar token si devuelve 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest) // Reintenta la petición original
      }
    }
    return Promise.reject(error)
  }
)

export default api
