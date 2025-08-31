<template>
  <div>
    <LoginForm />
    <NotificationToast />
  </div>
</template>

<script>
import LoginForm from '../components/auth/LoginForm.vue'
import NotificationToast from '../components/shared/NotificationToast.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm,
    NotificationToast
  }
}
</script>