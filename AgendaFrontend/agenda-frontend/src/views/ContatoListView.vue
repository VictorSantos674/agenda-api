<template>
  <div class="contato-list-view">
    <ProgressSpinner 
      v-if="loading" 
      class="overlay-spinner" 
      strokeWidth="4"
    />
    
    <Toolbar class="toolbar">
      <template #start>
        <span class="text-2xl font-bold text-white">📒 Agenda de Contatos</span>
      </template>
      <template #end>
        <span class="text-white mr-3" v-if="authStore.user">
          <i class="pi pi-user mr-1"></i>
          {{ authStore.user.nome }}
        </span>
        <Button 
          icon="pi pi-plus" 
          label="Novo Contato" 
          @click="openNew" 
          class="p-button-success mr-2" 
          :disabled="loading"
        />
        <Button 
          icon="pi pi-refresh" 
          class="p-button-rounded p-button-text text-white" 
          @click="loadContatos"
          :loading="loading"
          v-tooltip.top="'Recarregar contatos'"
        />
      </template>
    </Toolbar>

    <div class="layout-content">
      <Card class="main-card">
        <template #title>
          <div class="flex align-items-center">
            <i class="pi pi-users mr-2"></i>
            Lista de Contatos
            <Badge 
              v-if="filteredContatos.length" 
              :value="filteredContatos.length" 
              class="ml-2" 
            />
          </div>
        </template>
        <template #content>
          <!-- Filtros Section -->
          <div class="filters-section mb-4">
            <div class="grid">
              <div class="col-12 md:col-4">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText 
                    v-model="filters.search" 
                    placeholder="Buscar contatos..." 
                    class="w-full"
                    @input="handleSearch"
                  />
                </span>
              </div>
              <div class="col-12 md:col-4">
                <Dropdown 
                  v-model="filters.sortBy" 
                  :options="sortOptions" 
                  optionLabel="label"
                  placeholder="Ordenar por..." 
                  class="w-full"
                  @change="handleFilterChange"
                />
              </div>
              <div class="col-12 md:col-4">
                <Button 
                  icon="pi pi-filter-slash" 
                  label="Limpar filtros" 
                  class="p-button-outlined w-full"
                  @click="clearFilters"
                  :disabled="!hasActiveFilters"
                />
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <i class="pi pi-spin pi-spinner mr-2"></i>
            Carregando contatos...
          </div>

          <!-- Empty State -->
          <div v-else-if="!filteredContatos.length" class="empty-state">
            <i class="pi pi-inbox text-4xl mb-3"></i>
            <p class="text-color-secondary">
              {{ hasActiveFilters ? 'Nenhum contato encontrado com os filtros aplicados' : 'Nenhum contato cadastrado' }}
            </p>
            <Button 
              v-if="hasActiveFilters"
              icon="pi pi-filter-slash" 
              label="Limpar filtros" 
              class="p-button-text mt-3"
              @click="clearFilters"
            />
          </div>

          <!-- Data Table -->
          <ContatoList 
            v-else
            :contatos="filteredContatos" 
            :loading="loading"
            @edit="editContato" 
            @delete="confirmDelete" 
          />
        </template>
      </Card>
    </div>

    <ContatoForm 
      :visible="displayDialog" 
      :contato="selectedContato" 
      :loading="formLoading"
      @save="saveContato" 
      @close="closeDialog" 
    />

    <NotificationToast ref="toast" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContatoStore } from '../stores/contatoStore'
import { useAuthStore } from '../stores/authStore' // ← Importar auth store

export default {
  name: 'ContatoListView',
  components: {
    ContatoList: () => import('../components/ContatoList.vue'),
    ContatoForm: () => import('../components/ContatoForm.vue'),
    NotificationToast: () => import('../components/NotificationToast.vue')
  },
  setup() {
    const router = useRouter()
    const toast = ref()
    const contatoStore = useContatoStore()
    const authStore = useAuthStore() // ← Inicializar auth store
    
    // Estados locais
    const formLoading = ref(false)
    const displayDialog = ref(false)
    const selectedContato = ref(null)
    
    // Filtros
    const filters = ref({
      search: '',
      sortBy: null
    })

    const sortOptions = ref([
      { label: 'Nome A-Z', value: 'nome-asc' },
      { label: 'Nome Z-A', value: 'nome-desc' },
      { label: 'Email A-Z', value: 'email-asc' },
      { label: 'Email Z-A', value: 'email-desc' }
    ])

    // Computed
    const filteredContatos = computed(() => {
      let result = [...contatoStore.contatos]
      
      // Filtro de busca local
      if (filters.value.search) {
        const searchLower = filters.value.search.toLowerCase()
        result = result.filter(contato =>
          contato.nome?.toLowerCase().includes(searchLower) ||
          contato.email?.toLowerCase().includes(searchLower) ||
          contato.telefone?.includes(searchLower)
        )
      }
      
      // Ordenação
      if (filters.value.sortBy) {
        const [field, order] = filters.value.sortBy.value.split('-')
        result.sort((a, b) => {
          const valueA = a[field]?.toLowerCase() || ''
          const valueB = b[field]?.toLowerCase() || ''
          
          return order === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA)
        })
      }
      
      return result
    })

    const hasActiveFilters = computed(() => {
      return filters.value.search !== '' || filters.value.sortBy !== null
    })

    const loading = computed(() => contatoStore.loading)

    // Métodos
    const loadContatos = async () => {
      try {
        await contatoStore.loadContatos()
      } catch (error) {
        if (toast.value) {
          const errorMsg = error.response?.data?.message || 'Erro ao carregar contatos'
          
          // Se for erro de autenticação, redirecionar para login
          if (error.response?.status === 401) {
            toast.value.showError('Sessão expirada. Faça login novamente.')
            authStore.logout()
            router.push('/login')
          } else {
            toast.value.showError(errorMsg)
          }
        }
      }
    }

    const saveContato = async (contatoData) => {
      formLoading.value = true
      try {
        if (contatoData.id) {
          await contatoStore.updateContato(contatoData.id, contatoData)
          if (toast.value) toast.value.showSuccess('Contato atualizado com sucesso!')
        } else {
          await contatoStore.addContato(contatoData)
          if (toast.value) toast.value.showSuccess('Contato criado com sucesso!')
        }
        displayDialog.value = false
        await loadContatos()
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Erro ao salvar contato'
        
        // Se for erro de autenticação, redirecionar para login
        if (error.response?.status === 401) {
          toast.value.showError('Sessão expirada. Faça login novamente.')
          authStore.logout()
          router.push('/login')
        } else {
          toast.value.showError(errorMsg)
        }
      } finally {
        formLoading.value = false
      }
    }

    const openNew = () => {
      selectedContato.value = {}
      displayDialog.value = true
    }

    const editContato = (contato) => {
      selectedContato.value = { ...contato }
      displayDialog.value = true
    }

    const confirmDelete = async (contato) => {
      try {
        if (confirm(`Tem certeza que deseja excluir ${contato.nome}?`)) {
          await contatoStore.deleteContato(contato.id)
          if (toast.value) toast.value.showSuccess('Contato excluído com sucesso!')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Erro ao excluir contato'
        
        // Se for erro de autenticação, redirecionar para login
        if (error.response?.status === 401) {
          toast.value.showError('Sessão expirada. Faça login novamente.')
          authStore.logout()
          router.push('/login')
        } else {
          toast.value.showError(errorMsg)
        }
      }
    }

    const handleSearch = async () => {
      if (filters.value.search) {
        try {
          await contatoStore.searchContatos(filters.value.search)
        } catch (error) {
          // Fallback para busca local
          console.log('Busca API falhou, usando filtro local')
        }
      } else {
        await loadContatos()
      }
    }

    const handleFilterChange = () => {
      // Ordenação aplicada via computed
    }

    const clearFilters = () => {
      filters.value = {
        search: '',
        sortBy: null
      }
      loadContatos()
    }

    const closeDialog = () => {
      displayDialog.value = false
      selectedContato.value = null
    }

    // Lifecycle
    onMounted(async () => {
      // Verificar autenticação antes de carregar contatos
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      await loadContatos()
    })

    return {
      // Refs
      formLoading,
      displayDialog,
      selectedContato,
      filters,
      sortOptions,
      toast,
      
      // Stores
      authStore, // ← Expor authStore para template
      
      // Computed
      filteredContatos,
      hasActiveFilters,
      loading,
      
      // Methods
      loadContatos,
      saveContato,
      openNew,
      editContato,
      confirmDelete,
      handleSearch,
      handleFilterChange,
      clearFilters,
      closeDialog
    }
  }
}
</script>

<style scoped>
.overlay-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.filters-section {
  background: var(--surface-50);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--surface-200);
}

/* Responsividade para nome do usuário */
@media (max-width: 768px) {
  .toolbar .text-white.mr-3 {
    display: none;
  }
}
</style>