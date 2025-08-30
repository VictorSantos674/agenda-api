import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Importações lazy para melhor performance
const LoginForm = () => import('../components/LoginForm.vue')
const RegisterForm = () => import('../components/RegisterForm.vue')
const ContatoListView = () => import('../views/ContatoListView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/contatos'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginForm,
    meta: { requiresAuth: false, hideHeader: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterForm,
    meta: { requiresAuth: false, hideHeader: true }
  },
  {
    path: '/contatos',
    name: 'contatos',
    component: ContatoListView,
    meta: { requiresAuth: true, title: 'Contatos - Agenda' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/contatos'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Guard global de autenticação
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticação se necessário
  if (!authStore.isAuthenticated) {
    authStore.initAuth()
  }

  // Verificar se a rota requer autenticação
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Se a rota requer autenticação e o usuário não está autenticado
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } 
  // Se o usuário está autenticado e tenta acessar login/register
  else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    next({ name: 'contatos' })
  }
  // Caso contrário, permitir acesso
  else {
    next()
  }
})

// Atualizar título da página
router.afterEach((to) => {
  const title = to.meta.title || 'Agenda de Contatos'
  document.title = title
})

// Handler de errors de navegação
router.onError((error) => {
  console.error('Router error:', error)
})

export default router