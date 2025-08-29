<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('close')" 
    header="Detalhes do Contato" 
    :modal="true"
    :style="{ width: '500px' }" 
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
  >
    <div class="field">
      <label for="nome" class="block text-900 font-medium mb-2">Nome</label>
      <InputText 
        id="nome" 
        v-model="localContato.nome" 
        class="w-full" 
        placeholder="Digite o nome"
      />
    </div>

    <div class="field mt-3">
      <label for="email" class="block text-900 font-medium mb-2">Email</label>
      <InputText 
        id="email" 
        v-model="localContato.email" 
        class="w-full" 
        placeholder="email@exemplo.com"
        type="email"
      />
    </div>

    <div class="field mt-3">
      <label for="telefone" class="block text-900 font-medium mb-2">Telefone</label>
      <InputText 
        id="telefone" 
        v-model="localContato.telefone" 
        class="w-full" 
        placeholder="(11) 99999-9999"
        v-mask="'(##) #####-####'"
      />
    </div>

    <template #footer>
      <Button 
        label="Cancelar" 
        icon="pi pi-times" 
        @click="$emit('close')" 
        class="p-button-text" 
      />
      <Button 
        label="Salvar" 
        icon="pi pi-check" 
        @click="save" 
        class="p-button-success" 
        :disabled="!isFormValid"
      />
    </template>
  </Dialog>
</template>