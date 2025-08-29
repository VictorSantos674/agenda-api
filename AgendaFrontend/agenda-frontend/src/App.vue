<template>
  <div id="app">
    <Toast />
    <div class="layout-wrapper">
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
    </div>
  </div>
</template>