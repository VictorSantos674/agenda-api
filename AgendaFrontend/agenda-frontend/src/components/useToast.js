import { inject } from 'vue'

export const useToast = () => {
  const toast = inject('$toast')
  
  if (!toast) {
    throw new Error('Toast plugin not installed')
  }
  
  return toast
}

export default useToast