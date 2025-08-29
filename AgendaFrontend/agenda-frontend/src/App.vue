<template>
  <div id="app">
    <!-- Toast global para notificações -->
    <Toast position="top-right" group="agenda" />
    
    <!-- Componente de loading global -->
    <ProgressSpinner 
      v-if="globalLoading" 
      class="global-spinner" 
      strokeWidth="4"
    />
    
    <!-- Layout wrapper principal -->
    <div class="layout-wrapper">
      <!-- Header global -->
      <header class="app-header">
        <Toolbar class="toolbar">
          <template #start>
            <router-link to="/" class="logo-link">
              <span class="text-2xl font-bold text-white">📒 Agenda de Contatos</span>
            </router-link>
          </template>
          <template #end>
            <nav class="nav-links">
              <router-link to="/contatos" class="nav-link">
                <i class="pi pi-users mr-2"></i>
                Contatos
              </router-link>
              <Button 
                icon="pi pi-cog" 
                class="p-button-text text-white ml-3" 
                v-tooltip.top="'Configurações'"
              />
            </nav>
          </template>
        </Toolbar>
      </header>

      <!-- Conteúdo principal - onde as páginas são renderizadas -->
      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer global (opcional) -->
      <footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 Agenda de Contatos. Desenvolvido com Vue.js e .NET</p>
        </div>
      </footer>
    </div>

    <!-- Notification Toast component -->
    <NotificationToast ref="toast" />
  </div>
</template>

<script>
import { ref, onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import NotificationToast from './components/NotificationToast.vue'

export default {
  name: 'App',
  components: {
    NotificationToast
  },
  setup() {
    const router = useRouter()
    const toast = ref()
    const globalLoading = ref(false)

    // Fornecer métodos globais para todos os componentes filhos
    provide('showToast', {
      success: (message, title = 'Sucesso!') => {
        if (toast.value) toast.value.showSuccess(message, title)
      },
      error: (message, title = 'Erro!') => {
        if (toast.value) toast.value.showError(message, title)
      },
      showGlobalLoading: () => { globalLoading.value = true },
      hideGlobalLoading: () => { globalLoading.value = false }
    })

    // Lifecycle
    onMounted(() => {
      console.log('App mounted - Router ready')
    })

    return {
      globalLoading,
      toast
    }
  }
}
</script>

<style>
/* Estilos globais */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.toolbar {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Main content */
.app-main {
  flex: 1;
  padding: 0;
}

/* Footer */
.app-footer {
  background: var(--surface-100);
  padding: 1rem;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  color: var(--text-color-secondary);
}

/* Global spinner */
.global-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

/* Transições de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-links {
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .app-main {
    padding: 0.5rem;
  }
}
</style>