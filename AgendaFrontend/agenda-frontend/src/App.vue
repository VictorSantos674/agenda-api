<template>
  <div id="app">
    <Toast position="top-right" />
    
    <!-- Header apenas se não for página de auth -->
    <Navbar v-if="!$route.meta.hideNavbar" />
    
    <!-- Conteúdo principal -->
    <main class="app-main" :class="{ 'auth-layout': $route.meta.hideNavbar }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Loading global -->
    <ProgressSpinner 
      v-if="globalLoading" 
      class="global-spinner" 
      strokeWidth="4"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from './stores/authStore'
import Navbar from './components/shared/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const router = useRouter()
    const toast = useToast()
    const authStore = useAuthStore()
    const globalLoading = ref(false)

    const isAuthenticated = computed(() => {
      return authStore.isAuthenticated
    })

    // Inicializar autenticação ao carregar o app
    onMounted(() => {
      authStore.initAuth()
      
      // Redirecionar para login se não autenticado e tentando acessar rota protegida
      const requiresAuth = router.currentRoute.value.matched.some(record => record.meta.requiresAuth)
      if (!authStore.isAuthenticated && requiresAuth) {
        router.push('/login')
      }
    })

    const handleLogout = async () => {
      globalLoading.value = true
      try {
        await authStore.logout()
        
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
      isAuthenticated,
      globalLoading,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 80px);
  padding: 1rem;
}

.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 0;
}

.global-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
}

/* Animações */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>