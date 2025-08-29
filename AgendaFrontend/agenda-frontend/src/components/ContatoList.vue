<template>
  <div class="contato-list">
    <DataTable 
      :value="contatos" 
      :paginator="true" 
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5,10,20]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} contatos"
      responsiveLayout="scroll"
    >
      <Column field="nome" header="Nome" :sortable="true"></Column>
      <Column field="email" header="Email" :sortable="true"></Column>
      <Column field="telefone" header="Telefone"></Column>
      <Column header="Ações" :styles="{'width': '150px'}">
        <template #body="slotProps">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              class="p-button-rounded p-button-success p-button-text" 
              @click="$emit('edit', slotProps.data)" 
            />
            <Button 
              icon="pi pi-trash" 
              class="p-button-rounded p-button-danger p-button-text" 
              @click="$emit('delete', slotProps.data)" 
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>