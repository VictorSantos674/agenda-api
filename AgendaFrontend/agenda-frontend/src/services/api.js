import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5018'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Estado global para controle de refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor para adicionar token automaticamente
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

// Interceptor principal para tratamento de errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Se for error 401 (Unauthorized) e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Se já está fazendo refresh, adicionar à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        
        // Se tem refresh token, tentar renovar
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, 
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json'
              },
              // Não usar interceptor para evitar loop
              transformRequest: [(data) => JSON.stringify(data)]
            }
          )
          
          const newToken = response.data.token
          const newRefreshToken = response.data.refreshToken
          
          // Atualizar tokens
          localStorage.setItem('authToken', newToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }
          
          // Atualizar header da requisição original
          api.defaults.headers.Authorization = 'Bearer ' + newToken
          originalRequest.headers.Authorization = 'Bearer ' + newToken
          
          // Processar fila de requisições pendentes
          processQueue(null, newToken)
          
          return api(originalRequest)
        } else {
          // Não tem refresh token, fazer logout
          throw new Error('No refresh token available')
        }
      } catch (refreshError) {
        // Erro no refresh, fazer logout completo
        processQueue(refreshError, null)
        clearAuthData()
        window.location.href = '/login?error=session_expired'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Se for outro error 401 ou já tentou refresh, fazer logout
    if (error.response?.status === 401) {
      clearAuthData()
      window.location.href = '/login?error=unauthorized'
    }

    return Promise.reject(error)
  }
)

// Função para limpar dados de autenticação
const clearAuthData = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
  delete api.defaults.headers.Authorization
}

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, refreshToken, usuario } = response.data
      
      // Salvar tokens e dados do usuário
      localStorage.setItem('authToken', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      localStorage.setItem('userData', JSON.stringify(usuario))
      
      // Configurar header padrão
      api.defaults.headers.Authorization = `Bearer ${token}`
      
      return response.data
    } catch (error) {
      // Limpar dados em caso de erro no login
      clearAuthData()
      throw error
    }
  },

  async register(userData) {
    const response = await api.post('/auth/registrar', userData)
    return response.data
  },

  async getUserInfo() {
    const response = await api.get('/auth/usuario')
    return response.data
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, 
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        // Não usar interceptor para evitar loop
        transformRequest: [(data) => JSON.stringify(data)]
      }
    )
    
    const { token, newRefreshToken } = response.data
    
    // Atualizar tokens
    localStorage.setItem('authToken', token)
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken)
    }
    
    // Atualizar header padrão
    api.defaults.headers.Authorization = `Bearer ${token}`
    
    return response.data
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.warn('Logout API error:', error)
    } finally {
      clearAuthData()
    }
  },

  // Verificar se está autenticado (token válido)
  isAuthenticated() {
    const token = localStorage.getItem('authToken')
    if (!token) return false

    // Verificar expiração do token (se for JWT)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      return !isExpired
    } catch {
      return false
    }
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

// Função utilitária para verificar conexão
export const checkConnection = async () => {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 5000 })
    return true
  } catch {
    return false
  }
}

export default api