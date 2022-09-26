import { loginApi } from '@/api/login'

export default {
  namespaced: true,

  state: {
    token: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      console.log(token)
      state.token = token
    }
  },
  actions: {
    async LOGIN_ACTION({ commit }, loginFrom) {
      const data = await loginApi(loginFrom)
      console.log(data)
      commit('SET_TOKEN', data)
    }
  }
}
