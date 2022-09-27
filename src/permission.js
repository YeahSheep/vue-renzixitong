import router from '@/router'
import store from '@/store'
// 1,判断token是否存在
// 1.1存在 处于 登录状态是否去往登录页处于则去首页否则放行
// 1.2不存在 不处于 登录状态是否处于白名单处于则放行否则登录页
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  if (store.getters.token) {
    // 如果有token调用调用用户信息
    if (!store.state.user.userInfo.userId) {
      // 判断拿到用户信息后，路由跳转不再次调用
      // 否则每次路由跳转都会触发用户信息的接口调用
      await store.dispatch('user/USERINFO_ACTION')
    }
    if (to.path === '/login') {
      // 是否在登入页面
      next('/') // 在登入页就跳去首页
    } else {
      next() // 不在留在当前页
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      // 是否在白名单
      next() // 在就让他去
    } else {
      next('/login') // 不在就让他去登陆
    }
  }
})
