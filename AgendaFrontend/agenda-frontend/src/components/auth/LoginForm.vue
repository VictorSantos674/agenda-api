<template>
  <div class="login-container">
    <Card class="login-card">
      <template #title>
        <div class="text-center">
          <i class="pi pi-user text-4xl mb-3"></i>
          <h2>Login</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <label for="email">Email</label>
            <InputText 
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="Seu email"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <Password 
              id="password"
              v-model="credentials.password"
              placeholder="Sua senha"
              class="w-full"
              :class="{ 'p-invalid': errors.password }"
              toggleMask
              :feedback="false"
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <Button 
            type="submit" 
            label="Entrar" 
            class="w-full" 
            :loading="loading"
            :disabled="loading"
          />

          <Divider />

          <div class="text-center">
            <p>Não tem conta? <router-link to="/register" class="text-primary">Registrar</router-link></p>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const credentials = reactive({
      email: '',
      senha: ''  // ← ALTERADO de 'password' para 'senha'
    })

    const errors = reactive({})
    const loading = ref(false)

    const validateForm = () => {
      errors.email = !credentials.email ? 'Email é obrigatório' : ''
      errors.senha = !credentials.senha ? 'Senha é obrigatória' : ''  // ← ALTERADO
      return !errors.email && !errors.senha  // ← ALTERADO
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await authStore.login(credentials)
        
        toast.add({
          severity: 'success',
          summary: 'Login realizado!',
          detail: 'Bem-vindo de volta!',
          life: 3000
        })

        router.push('/contatos')
      } catch (error) {
        // MELHORIA: Log detalhado do erro
        console.error('Erro completo no login:', error)
        
        let errorMessage = 'Credenciais inválidas'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'Servidor indisponível. Verifique se o backend está rodando.'
        }
        
        toast.add({
          severity: 'error',
          summary: 'Erro no login',
          detail: errorMessage,
          life: 5000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      credentials,
      errors,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>