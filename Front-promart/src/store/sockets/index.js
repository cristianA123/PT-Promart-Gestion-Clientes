export default {
  namespaced: true,
  state: {
    pusher: new window.Pusher(process.env.VUE_APP_KEY_PUSHER, {
      cluster: 'us2'
    })
  },
  getters: {
  },
  mutations: {
    setConnect(state) {
      state.pusher = new window.Pusher(process.env.VUE_APP_KEY_PUSHER, {
        cluster: 'us2'
      })
    }
  },
  actions: {
    onConnect({ commit }) {
      commit('setConnect')
    }
  }
}