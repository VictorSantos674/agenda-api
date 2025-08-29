<template>
  <div class="contato-list-view">
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
        />
        <Button 
          icon="pi pi-info-circle" 
          class="p-button-rounded p-button-text text-white" 
          @click="$router.push('/sobre')"
          v-tooltip.top="'Sobre o sistema'"
        />
      </template>
    </Toolbar>

    <div class="layout-content">
      <Card class="main-card">
        <template #title>
          <div class="flex align-items-center">
            <i class="pi pi-users mr-2"></i>
            Lista de Contatos
          </div>
        </template>
        <template #content>
          <ContatoList 
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
      @save="saveContato" 
      @close="closeDialog" 
    />

    <NotificationToast ref="toast" />
  </div>
</template>

<script>
import { ref } from 'vue'
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
    const displayDialog = ref(false)
    const selectedContato = ref(null)

    const openNew = () => {
      selectedContato.value = {}
      displayDialog.value = true
    }

    const editContato = (contato) => {
      selectedContato.value = { ...contato }
      displayDialog.value = true
    }

    const saveContato = async (contato) => {
      try {
        // Lógica para salvar contato
        toast.value.showSuccess('Contato salvo com sucesso!')
        displayDialog.value = false
      } catch (error) {
        toast.value.showError('Erro ao salvar contato')
      }
    }

    return {
      contatos,
      displayDialog,
      selectedContato,
      openNew,
      editContato,
      saveContato,
      toast
    }
  }
}
</script>