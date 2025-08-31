<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          <i class="pi pi-bookmark text-2xl"></i>
          <span class="logo-text">Agenda Profissional</span>
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <template v-if="authStore.isAuthenticated">
          <span class="user-welcome">
            <i class="pi pi-user mr-2"></i>
            Olá, {{ authStore.user.nome }}
          </span>
          <Button 
            icon="pi pi-sign-out" 
            label="Sair" 
            class="p-button-text p-button-danger" 
            @click="handleLogout"
            v-tooltip="'Sair da conta'"
          />
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">
            <i class="pi pi-sign-in mr-2"></i>
            Entrar
          </router-link>
          <router-link to="/register" class="nav-link">
            <i class="pi pi-user-plus mr-2"></i>
            Registrar
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    const router = useRouter()

    const handleLogout = async () => {
      try {
        await authStore.logout()
        toast.add({
          severity: 'success',
          summary: 'Logout realizado',
          detail: 'Você saiu da sua conta com sucesso',
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
      }
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-text {
  margin-left: 0.5rem;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-welcome {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 0.5rem;
  }
  
  .logo-text {
    display: none;
  }
  
  .user-welcome {
    display: none;
  }
  
  .nav-link span {
    display: none;
  }
}
</style>