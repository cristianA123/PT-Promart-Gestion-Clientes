import backendApi from '@/services/backend.service'
import store from '../../store'
import router from '../../router'

export default {
  state: {
    loadingAuth: false,
    errorMessages: null
  },
  getters: {
    loading: (state) => state.loadingAuth,
    errorMessages: (state) => state.errorMessages
  },
  mutations: {
    setLoadingAuth(state, payload) {
      state.loadingAuth = payload
    },
    setErrorMessages(state, payload) {
      state.errorMessages = payload
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('setLoadingAuth', true)
      
      backendApi.post('/auth/login', {
        email: user.email,
        password: user.password
      }).then((response) => {
        if (response.data.success) {
          // $cookies.set('user', response.data.data.user)
          $cookies.set('token', response.data.data.token)
          // $cookies.set('services', response.data.data.services)
          store.commit('setErrorMessages', null)
          router.push({ path:'/' })
        } else {
          commit('setLoadingAuth', false)
          store.commit('setUser', null)
          store.commit('setErrorMessages', response.data.message)
        }
      }).catch((error) => {
        let messageError = ''

        if (error.response.data.message) {
          messageError = error.response.data.message
        } else {
          messageError = 'No pudimos conectarnos con el servidor'
        }

        store.commit('setErrorMessages', messageError)
        commit('setLoadingAuth', false)
        
      })
    },
    logout() {
      $cookies.remove('user')
      $cookies.remove('token')
      $cookies.remove('services')
      router.push({ name: 'auth-signin' })
    }
  }
}