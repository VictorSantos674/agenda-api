import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5018'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use( // Interceptor para adicionar token automaticamente
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use( // Interceptor para tratar errors de autenticação
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/registrar', userData)
    return response.data
  },

  async getUserInfo() {
    const response = await api.get('/auth/usuario')
    return response.data
  }
}

export const contatoService = {
  async getAll() {
    const response = await api.get('/contatos')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/contatos/${id}`)
    return response.data
  },

  async create(contato) {
    const response = await api.post('/contatos', contato)
    return response.data
  },

  async update(id, contato) {
    const response = await api.put(`/contatos/${id}`, contato)
    return response.data
  },

  async delete(id) {
    await api.delete(`/contatos/${id}`)
  },

  async search(term) {
    const response = await api.get('/contatos/search', {
      params: { term }
    })
    return response.data
  }
}

export default api