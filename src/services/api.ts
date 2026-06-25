import axios from 'axios'
import { Notify } from 'quasar'

const api = axios.create({
  baseURL: process.env.API_URL || 'https://orus-api-zsoq.onrender.com/api',
  timeout: 15000,
})

// Injeta o token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Trata erros globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response && err.response.status
    const msg = (err.response && err.response.data && err.response.data.message) || 'Erro inesperado.'

    if (status === 401 || status === 403) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
      return Promise.reject(err)
    }

    Notify.create({ type: 'negative', message: msg, position: 'top-right' })
    return Promise.reject(err)
  }
)

export default api
