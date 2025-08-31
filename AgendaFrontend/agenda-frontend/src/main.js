import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

// ✅ CORREÇÃO: Importe os estilos DO SEU PRÓPRIO PROJETO
// Remova qualquer referência a unpkg.com ou CDN externo
import '@/styles/primevue-styles.css'  // Criaremos este arquivo

// ✅ Importe os componentes PrimeVue individualmente
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

// ✅ Registro manual de componentes (evita auto-import)
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

app.mount('#app')