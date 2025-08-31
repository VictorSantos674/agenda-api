<template>
  <div v-if="visible" class="loading-overlay">
    <div class="loading-content">
      <ProgressSpinner 
        strokeWidth="4" 
        animationDuration=".5s"
        class="spinner"
      />
      <p class="loading-text">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Carregando...'
    }
  }
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.spinner {
  width: 50px;
  height: 50px;
}

.loading-text {
  margin-top: 1rem;
  color: #666;
  font-weight: 500;
}
</style>