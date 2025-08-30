<template>
  <div id="app">
    <!-- Header apenas se não for página de auth -->
    <header v-if="!$route.meta.hideHeader" class="app-header">
      <Toolbar class="toolbar">
        <template #start>
          <router-link to="/" class="logo-link">
            <span class="text-2xl font-bold text-white">📒 Agenda de Contatos</span>
          </router-link>
        </template>
        <template #end>
          <nav class="nav-links">
            <span class="text-white mr-4" v-if="authStore.user">
              Olá, {{ authStore.user.nome }}
            </span>
            <Button 
              v-if="authStore.isAuthenticated"
              icon="pi pi-sign-out" 
              label="Sair" 
              class="p-button-text text-white" 
              @click="handleLogout"
              v-tooltip.top="'Sair da conta'"
            />
            <router-link 
              v-else
              to="/login" 
              class="nav-link"
            >
              <i class="pi pi-sign-in mr-2"></i>
              Entrar
            </router-link>
          </nav>
        </template>
      </Toolbar>
    </header>

    <!-- Conteúdo principal -->
    <main class="app-main" :class="{ 'auth-page': $route.meta.hideHeader }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Notification Toast -->
    <NotificationToast ref="toast" />

    <!-- Loading global -->
    <ProgressSpinner 
      v-if="globalLoading" 
      class="global-spinner" 
      strokeWidth="4"
    />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import { useToast } from 'primevue/usetoast'
import NotificationToast from './components/NotificationToast.vue'

export default {
  name: 'App',
  components: {
    NotificationToast
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()
    const globalLoading = ref(false)

    // Inicializar autenticação ao carregar o app
    onMounted(() => {
      authStore.initAuth()
      console.log('App mounted - Auth initialized')
    })

    // Observar mudanças na autenticação
    watch(() => authStore.isAuthenticated, (newVal) => {
      console.log('Auth state changed:', newVal)
    })

    const handleLogout = async () => {
      try {
        globalLoading.value = true
        authStore.logout()
        
        toast.add({
          severity: 'success',
          summary: 'Logout realizado!',
          detail: 'Você saiu da sua conta',
          life: 3000
        })

        router.push('/login')
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Erro no logout',
          detail: 'Não foi possível sair da conta',
          life: 5000
        })
      } finally {
        globalLoading.value = false
      }
    }

    return {
      authStore,
      globalLoading,
      handleLogout
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

.app-main.auth-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
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

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>