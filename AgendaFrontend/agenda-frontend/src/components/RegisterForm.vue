<template>
  <div class="register-container">
    <Card class="register-card">
      <template #title>
        <div class="text-center">
          <i class="pi pi-user-plus text-4xl mb-3"></i>
          <h2>Criar Conta</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="field">
            <label for="name">Nome</label>
            <InputText 
              id="name"
              v-model="userData.name"
              placeholder="Seu nome completo"
              class="w-full"
              :class="{ 'p-invalid': errors.name }"
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="field">
            <label for="email">Email</label>
            <InputText 
              id="email"
              v-model="userData.email"
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
              v-model="userData.password"
              placeholder="Sua senha"
              class="w-full"
              :class="{ 'p-invalid': errors.password }"
              toggleMask
              :feedback="true"
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <div class="field">
            <label for="confirmPassword">Confirmar Senha</label>
            <Password 
              id="confirmPassword"
              v-model="userData.confirmPassword"
              placeholder="Confirme sua senha"
              class="w-full"
              :class="{ 'p-invalid': errors.confirmPassword }"
              toggleMask
              :feedback="false"
            />
            <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
          </div>

          <Button 
            type="submit" 
            label="Criar Conta" 
            class="w-full" 
            :loading="loading"
            :disabled="loading"
          />

          <Divider />

          <div class="text-center">
            <p>Já tem conta? <router-link to="/login" class="text-primary">Fazer login</router-link></p>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'RegisterForm',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const toast = useToast()

    const userData = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const errors = reactive({})
    const loading = ref(false)

    const validateForm = () => {
      errors.name = !userData.name ? 'Nome é obrigatório' : ''
      errors.email = !userData.email ? 'Email é obrigatório' : ''
      errors.password = !userData.password ? 'Senha é obrigatória' : userData.password.length < 6 ? 'Senha deve ter pelo menos 6 caracteres' : ''
      errors.confirmPassword = userData.password !== userData.confirmPassword ? 'Senhas não coincidem' : ''
      
      return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await authStore.register({
          nome: userData.name,
          email: userData.email,
          senha: userData.password
        })
        
        toast.add({
          severity: 'success',
          summary: 'Conta criada!',
          detail: 'Sua conta foi criada com sucesso!',
          life: 3000
        })

        router.push('/login')
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Erro no registro',
          detail: error.response?.data?.message || 'Erro ao criar conta',
          life: 5000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      userData,
      errors,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.register-card {
  width: 100%;
  max-width: 400px;
}

.register-form {
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