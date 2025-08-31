<template>
  <div>
    <RegisterForm />
    <NotificationToast />
  </div>
</template>

<script>
import RegisterForm from '../components/auth/RegisterForm.vue'
import NotificationToast from '../components/shared/NotificationToast.vue'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm,
    NotificationToast
  }
}
</script>