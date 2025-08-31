import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// Theme and styles
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './styles/style.css'

// PrimeVue components
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Card from 'primevue/card'
import Toolbar from 'primevue/toolbar'
import ProgressSpinner from 'primevue/progressspinner'
import Badge from 'primevue/badge'
import Dropdown from 'primevue/dropdown'
import Password from 'primevue/password'
import Divider from 'primevue/divider'

const app = createApp(App)
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'filled'
})
app.use(ToastService)

// Directives
app.directive('tooltip', Tooltip)

// Global components
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Card', Card)
app.component('Toolbar', Toolbar)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Badge', Badge)
app.component('Dropdown', Dropdown)
app.component('Password', Password)
app.component('Divider', Divider)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

app.mount('#app')

// Export the app instance for potential use elsewhere
export default app