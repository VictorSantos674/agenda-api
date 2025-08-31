<template>
  <Card class="contato-card">
    <template #title>
      <div class="contato-header">
        <span class="contato-nome">{{ contato.nome }}</span>
        <div class="contato-actions">
          <Button 
            icon="pi pi-eye" 
            class="p-button-rounded p-button-text p-button-info"
            @click="$emit('view', contato)"
            v-tooltip="'Ver detalhes'"
          />
          <Button 
            icon="pi pi-pencil" 
            class="p-button-rounded p-button-text p-button-success"
            @click="$emit('edit', contato)"
            v-tooltip="'Editar contato'"
          />
          <Button 
            icon="pi pi-trash" 
            class="p-button-rounded p-button-text p-button-danger"
            @click="$emit('delete', contato)"
            v-tooltip="'Excluir contato'"
          />
        </div>
      </div>
    </template>
    <template #content>
      <div class="contato-info">
        <div class="contato-field">
          <i class="pi pi-envelope"></i>
          <a :href="`mailto:${contato.email}`" class="contato-link">
            {{ contato.email || 'Não informado' }}
          </a>
        </div>
        <div class="contato-field">
          <i class="pi pi-phone"></i>
          <a :href="`tel:${contato.telefone}`" class="contato-link">
            {{ formatTelefone(contato.telefone) || 'Não informado' }}
          </a>
        </div>
        <div class="contato-field" v-if="contato.createdAt">
          <i class="pi pi-calendar"></i>
          <span>Cadastrado em: {{ formatDate(contato.createdAt) }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
export default {
  name: 'ContatoCard',
  props: {
    contato: {
      type: Object,
      required: true
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
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>
.contato-card {
  margin-bottom: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contato-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.contato-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contato-nome {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.contato-actions {
  display: flex;
  gap: 0.25rem;
}

.contato-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contato-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
}

.contato-field i {
  color: var(--primary-color);
  width: 16px;
}

.contato-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contato-link:hover {
  color: var(--primary-600);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .contato-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .contato-actions {
    align-self: flex-end;
  }
}
</style>