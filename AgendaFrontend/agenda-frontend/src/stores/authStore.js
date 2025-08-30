import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  const initAuth = () => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('userData')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      
      token.value = response.token
      user.value = response.usuario
      isAuthenticated.value = true

      // Salvar no localStorage
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userData', JSON.stringify(response.usuario))

      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      const userInfo = await authService.getUserInfo()
      user.value = userInfo
      return true
    } catch (error) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    initAuth,
    login,
    register,
    logout,
    checkAuth
  }
})