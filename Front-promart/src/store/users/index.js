import axios from 'axios'
import store from '../../store'
import router from '../../router'

export default {
  state: {
    userRegistration: null,
    userRegistrationMode: 'Create',
    myUser: null
  },
  getters: {
  },
  mutations: {
    setUserRegistration(state, payload) {
      state.userRegistration = payload.user
      state.userRegistrationMode = payload.mode
      state.myUser = payload.myUser
    }
  },
  actions: {
    userRegistration ({ commit }, data) {
      console.log(data)
      store.commit('setUserRegistration', data)
      router.push({ name:'register-user' })
    }
  }
}