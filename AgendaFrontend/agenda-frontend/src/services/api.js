import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5018'

const api = axios.create({
  baseURL: API_BASE_URL, // ✅ REMOVI o /api daqui - o backend já tem /api nos endpoints
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Debug: Log da configuração
console.log('🔄 API Configurada:', {
  baseURL: API_BASE_URL,
  env: import.meta.env.VITE_API_BASE_URL
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('authToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Token adicionado ao request:', token.substring(0, 20) + '...')
    }
    
    console.log('📤 Request para:', config.url)
    return config
  },
  (error) => {
    console.error('❌ Erro no request interceptor:', error)
    return Promise.reject(error)
  }
)

// Interceptor principal para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response recebido:', response.status, response.config.url)
    return response
  },
  async (error) => {
    console.error('❌ Erro na response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    })

    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Tentando refresh token...')
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await authStore.refreshToken()
        processQueue(null, newToken)
        originalRequest.headers.Authorization = 'Bearer ' + newToken
        return api(originalRequest)
      } catch (refreshError) {
        console.error('❌ Erro no refresh token:', refreshError)
        processQueue(refreshError, null)
        authStore.logout()
        window.location.href = '/login?error=session_expired'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 401) {
      console.log('🔒 Não autorizado - fazendo logout')
      authStore.logout()
      window.location.href = '/login?error=unauthorized'
    }

    // Melhor tratamento de erro de rede
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Timeout na conexão com a API')
      throw new Error('Timeout: Servidor não respondeu a tempo')
    }

    if (error.message === 'Network Error') {
      console.error('🌐 Erro de rede: Backend pode estar offline')
      throw new Error('Erro de conexão. Verifique se o backend está rodando.')
    }

    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials) {
    try {
      console.log('🔐 Tentando login com:', credentials)
      
      const response = await api.post('/api/Auth/login', credentials)
      console.log('✅ Login bem-sucedido:', response.data)
      
      const { token, usuario } = response.data
      const authStore = useAuthStore()
      
      // Atualiza a store
      authStore.token = token
      authStore.user = usuario
      authStore.isAuthenticated = true

      localStorage.setItem('authToken', token)
      localStorage.setItem('userData', JSON.stringify(usuario))
      
      return response.data
    } catch (error) {
      console.error('❌ Erro no authService.login:', error)
      throw error
    }
  },

  async register(userData) {
    try {
      console.log('👤 Tentando registrar:', userData)
      const response = await api.post('/api/Auth/registrar', userData)
      console.log('✅ Registro bem-sucedido:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro no registro:', error)
      throw error
    }
  },

  async getUserInfo() {
    try {
      const response = await api.get('/api/Auth/usuario')
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar info usuário:', error)
      throw error
    }
  },

  async logout() {
    try {
      const authStore = useAuthStore()
      if (authStore.token) {
        await api.post('/api/Auth/logout', { token: authStore.token })
      }
    } catch (error) {
      console.warn('⚠️ Erro no logout API (pode ser normal):', error)
    } finally {
      const authStore = useAuthStore()
      authStore.logout()
    }
  }
}

export const contatoService = {
  async getAll() {
    try {
      const response = await api.get('/api/Contato')
      console.log('📋 Contatos carregados:', response.data.length)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao carregar contatos:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/api/Contato/${id}`)
      return response.data
    } catch (error) {
      console.error(`❌ Erro ao buscar contato ${id}:`, error)
      throw error
    }
  },

  async create(contato) {
    try {
      const response = await api.post('/api/Contato', contato)
      console.log('✅ Contato criado:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao criar contato:', error)
      throw error
    }
  },

  async update(id, contato) {
    try {
      const response = await api.put(`/api/Contato/${id}`, contato)
      console.log('✅ Contato atualizado:', response.data)
      return response.data
    } catch (error) {
      console.error(`❌ Erro ao atualizar contato ${id}:`, error)
      throw error
    }
  },

  async delete(id) {
    try {
      await api.delete(`/api/Contato/${id}`)
      console.log('✅ Contato excluído:', id)
    } catch (error) {
      console.error(`❌ Erro ao excluir contato ${id}:`, error)
      throw error
    }
  },

  async search(term) {
    try {
      const response = await api.get('/api/Contato/search', { 
        params: { term } 
      })
      console.log('🔍 Resultados da busca:', response.data.length)
      return response.data
    } catch (error) {
      console.error('❌ Erro na busca:', error)
      throw error
    }
  }
}

// Função utilitária para verificar conexão
export const checkConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { 
      timeout: 3000 
    })
    console.log('🌐 Conexão com backend: OK')
    return true
  } catch (error) {
    console.error('❌ Backend offline:', error.message)
    return false
  }
}

// Função para debug da API
export const debugAPI = () => {
  return {
    baseURL: API_BASE_URL,
    env: import.meta.env.VITE_API_BASE_URL,
    hasToken: !!localStorage.getItem('authToken')
  }
}

export default api