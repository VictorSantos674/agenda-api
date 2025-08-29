import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { contatoService } from '../services/api'

export const useContatoStore = defineStore('contato', () => {
  const contatos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const filteredContatos = computed(() => contatos.value)

  const loadContatos = async () => {
    loading.value = true
    error.value = null
    try {
      contatos.value = await contatoService.getAll()
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar contatos'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addContato = async (contato) => {
    try {
      const newContato = await contatoService.create(contato)
      contatos.value.push(newContato)
      return newContato
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao criar contato'
      throw err
    }
  }

  const updateContato = async (id, contato) => {
    try {
      const updatedContato = await contatoService.update(id, contato)
      const index = contatos.value.findIndex(c => c.id === id)
      if (index !== -1) {
        contatos.value[index] = updatedContato
      }
      return updatedContato
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar contato'
      throw err
    }
  }

  const deleteContato = async (id) => {
    try {
      await contatoService.delete(id)
      contatos.value = contatos.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao deletar contato'
      throw err
    }
  }

  const searchContatos = async (term) => {
    if (!term) {
      await loadContatos()
      return
    }
    
    loading.value = true
    try {
      contatos.value = await contatoService.search(term)
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro na busca'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    contatos,
    filteredContatos,
    loading,
    error,
    loadContatos,
    addContato,
    updateContato,
    deleteContato,
    searchContatos
  }
})