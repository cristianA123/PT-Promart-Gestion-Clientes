import Vue from 'vue'
import Router from 'vue-router'
import BackendApi from '@/services/backend.service'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    redirect: '/client'
  },
  {
    path: '/auth/signin',
    name: 'auth-signin',
    component: () => import(/* webpackChunkName: "auth-signin" */ '@/pages/auth/SigninPage.vue'),
    meta: {
      layout: 'auth'
    }
  },
  {
    path: '/client',
    name: 'client',
    component: () => import('@/pages/Client/Client.vue')
  },
  {
    path: '/client/detai',
    name: 'detail-client',
    component: () => import('@/pages/Client/DetailClient.vue')
  },
  {
    path: '/blank',
    name: 'blank',
    component: () => import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
      layout: 'error'
    }
  }]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
router.beforeEach((to, from, next) => {
  if (to.name === 'auth-signin') {

    return next()
  } else {
    let isAuthenticated = false

    BackendApi.get('/auth/me').then((response) => {
      isAuthenticated = response.data.success
      if (isAuthenticated) {
        $cookies.set('user', response.data.data.user)

        return next()
      } else {

        return next({ name: 'auth-signin' })
      }
    }).catch((error) => {
      console.log(error)

      return next({ name: 'auth-signin' })
    })
  }
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
})

export default router
