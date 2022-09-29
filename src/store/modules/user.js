import { loginApi } from '@/api/login'
import { getUserInfoApi, getUserDetailById } from '@/api/user'

export default {
  namespaced: true,

  state: {
    token: null,
    userInfo: {},
    loginTime: 0
  },
  mutations: {
    SET_TOKEN(state, token) {
      // console.log(token)
      state.token = token
    },
    SET_USERINFO(state, userInfo) {
      state.userInfo = userInfo
    },
    SET_LOGINGTIME(state, newTime) {
      state.loginTime = newTime
    },
    REMOVE_TOKEN(state) {
      state.token = null
    },
    REMOVE_USERINFO(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async LOGIN_ACTION({ commit }, loginFrom) {
      const data = await loginApi(loginFrom)
      console.log(data)
      commit('SET_TOKEN', data)
      commit('SET_LOGINGTIME', +new Date())
    },
    async USERINFO_ACTION({ commit }) {
      const res = await getUserInfoApi()
      const res1 = await getUserDetailById(res.userId)
      const result = { ...res, ...res1 }
      // console.log(res)
      commit('SET_USERINFO', result)
      // return JSON.parse(JSON.stringify(res))
    },
    logout({ commit }) {
      commit('REMOVE_TOKEN')
      commit('REMOVE_USERINFO')
    }
  }
}
