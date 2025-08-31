import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Importações diretas para evitar problemas de lazy loading inicial
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ContatoListView from '../views/ContatoListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/contatos'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false, hideHeader: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
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
      return { top: 0 }
    }
  }
})

// Guard global de autenticação
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'contatos' })
  } else {
    next()
  }
})

// Atualizar título da página
router.afterEach((to) => {
  const title = to.meta.title || 'Agenda Blue Technology'
  document.title = title
})

export default router