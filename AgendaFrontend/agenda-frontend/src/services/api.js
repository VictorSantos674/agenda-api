import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

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