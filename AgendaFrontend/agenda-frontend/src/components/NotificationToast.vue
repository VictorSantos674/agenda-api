<template>
  <Toast
    position="top-right"
    :breakpoints="{
      '960px': { width: '100%', right: '0', left: '0' }
    }"
    group="agenda"
  >
    <template #message="slotProps">
      <div class="toast-content">
        <div class="toast-icon" :class="slotProps.message.severity">
          <i :class="getIcon(slotProps.message.severity)"></i>
        </div>
        <div class="toast-message">
          <div class="toast-title">{{ slotProps.message.summary }}</div>
          <div class="toast-detail">{{ slotProps.message.detail }}</div>
        </div>
        <Button
          icon="pi pi-times"
          class="p-button-text p-button-rounded toast-close"
          @click="slotProps.closeCallback"
        />
      </div>
    </template>
  </Toast>
</template>

<script>
import { useToast } from 'primevue/usetoast'

export default {
  name: 'NotificationToast',
  setup() {
    const toast = useToast()

    const showSuccess = (message, title = 'Sucesso!') => {
      toast.add({
        severity: 'success',
        summary: title,
        detail: message,
        life: 3000,
        group: 'agenda'
      })
    }

    const showError = (message, title = 'Erro!') => {
      toast.add({
        severity: 'error',
        summary: title,
        detail: message,
        life: 5000,
        group: 'agenda'
      })
    }

    const showWarning = (message, title = 'Atenção!') => {
      toast.add({
        severity: 'warn',
        summary: title,
        detail: message,
        life: 4000,
        group: 'agenda'
      })
    }

    const showInfo = (message, title = 'Informação') => {
      toast.add({
        severity: 'info',
        summary: title,
        detail: message,
        life: 3000,
        group: 'agenda'
      })
    }

    return {
      showSuccess,
      showError,
      showWarning,
      showInfo
    }
  },
  methods: {
    getIcon(severity) {
      const icons = {
        success: 'pi pi-check-circle',
        error: 'pi pi-times-circle',
        warn: 'pi pi-exclamation-triangle',
        info: 'pi pi-info-circle'
      }
      return icons[severity] || 'pi pi-info-circle'
    }
  }
}
</script>

<style scoped>
.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  min-width: 300px;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast-icon.success {
  background-color: var(--green-100);
  color: var(--green-700);
}

.toast-icon.error {
  background-color: var(--red-100);
  color: var(--red-700);
}

.toast-icon.warn {
  background-color: var(--yellow-100);
  color: var(--yellow-700);
}

.toast-icon.info {
  background-color: var(--blue-100);
  color: var(--blue-700);
}

.toast-message {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
  color: var(--text-color);
}

.toast-detail {
  font-size: 13px;
  color: var(--text-color-secondary);
  line-height: 1.4;
}

.toast-close {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: var(--text-color-secondary) !important;
}

.toast-close:hover {
  color: var(--text-color) !important;
  background-color: var(--surface-d) !important;
}

/* Responsividade */
@media screen and (max-width: 960px) {
  .toast-content {
    min-width: auto;
    margin: 0 16px;
  }
}
</style>