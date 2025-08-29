<template>
  <div class="contato-list">
    <DataTable 
      :value="contatos" 
      :paginator="true" 
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} contatos"
      responsiveLayout="scroll"
      :loading="loading"
    >
      <Column field="nome" header="Nome" :sortable="true">
        <template #body="{ data }">
          <span class="font-semibold">{{ data.nome }}</span>
        </template>
      </Column>
      
      <Column field="email" header="Email" :sortable="true">
        <template #body="{ data }">
          <a :href="`mailto:${data.email}`" class="text-primary hover:underline">
            {{ data.email }}
          </a>
        </template>
      </Column>
      
      <Column field="telefone" header="Telefone">
        <template #body="{ data }">
          <a :href="`tel:${data.telefone}`" class="text-primary hover:underline">
            {{ formatTelefone(data.telefone) }}
          </a>
        </template>
      </Column>
      
      <Column header="Ações" :styles="{'width': '150px'}">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-success p-button-text" 
              @click="$emit('edit', slotProps.data)" 
              v-tooltip.top="'Editar contato'"
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-rounded p-button-danger p-button-text" 
              @click="$emit('delete', slotProps.data)" 
              v-tooltip.top="'Excluir contato'"
            />
          </div>
        </template>
      </Column>
      
      <template #empty>
        <div class="text-center py-4 text-color-secondary">
          <i class="pi pi-inbox text-4xl mb-2"></i>
          <p>Nenhum contato encontrado</p>
        </div>
      </template>
      
      <template #loading>
        <div class="text-center py-4">
          <i class="pi pi-spin pi-spinner text-2xl"></i>
          <p class="mt-2">Carregando contatos...</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
export default {
  name: 'ContatoList',
  props: {
    contatos: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatTelefone(telefone) {
      if (!telefone) return ''
      const cleaned = telefone.replace(/\D/g, '')
      if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
  }
}
</script>