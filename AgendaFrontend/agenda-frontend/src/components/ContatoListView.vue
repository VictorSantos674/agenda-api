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
              v-if="contatos.length" 
              :value="contatos.length" 
              class="ml-2" 
            />
          </div>
        </template>
        <template #content>
          <div v-if="loading" class="loading-state">
            <i class="pi pi-spin pi-spinner mr-2"></i>
            Carregando contatos...
          </div>
          <ContatoList 
            v-else
            :contatos="contatos" 
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

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
    const contatos = ref([])
    const loading = ref(false)
    const formLoading = ref(false)
    const displayDialog = ref(false)
    const selectedContato = ref(null)

    const loadContatos = async () => {
      loading.value = true
      try {
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 1000))
        contatos.value = [
          { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '11999999999' },
          { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11999999998' }
        ]
      } catch (error) {
        toast.value.showError('Erro ao carregar contatos')
      } finally {
        loading.value = false
      }
    }

    const saveContato = async (contato) => {
      formLoading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.value.showSuccess('Contato salvo com sucesso!')
        displayDialog.value = false
        await loadContatos() // Recarregar lista
      } catch (error) {
        toast.value.showError('Erro ao salvar contato')
      } finally {
        formLoading.value = false
      }
    }

    onMounted(() => {
      loadContatos()
    })

    return {
      contatos,
      loading,
      formLoading,
      displayDialog,
      selectedContato,
      loadContatos,
      saveContato
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
</style>