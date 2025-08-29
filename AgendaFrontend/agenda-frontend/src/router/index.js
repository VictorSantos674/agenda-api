import { createRouter, createWebHistory } from 'vue-router'
import ContatoListView from '../views/ContatoListView.vue' 

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/contatos'
  },
  {
    path: '/contatos',
    name: 'contatos',
    component: ContatoListView,
    meta: {
      title: 'Contatos - Agenda',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/contatos'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Update page title
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Agenda de Contatos'
  }
  
  next()
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router