import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
const timeOut = 2 // 小时

function checkTime() {
  // 获取当前时间
  const nowDate = Date.now()
  // 当前时间-登入的时间
  const timeStamp = (nowDate - store.getters.loginTime) / 1000 / 60
  // 返回是否大于设置的过期时间
  return timeStamp > timeOut
}

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
export default request
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      if (checkTime()) {
        // 每次请求时判断是否超时，超时则清除token,跳转登入页
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token 超时'))
      }
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  // 响应成功 200
  (response) => {
    // console.log(response)
    // 响应的axios默认封装一层data,解构后拿到后端返回的真实数据
    const { success, data, message } = response.data
    // 如果success是ture直接返回data
    if (success) {
      return data
    } else {
      // 错误则返回失败信息
      Message.error(message)
      // 没有错误对象，手动抛出一个错误信息提示
      return Promise.reject(new Error(message))
    }
  },
  // 响应失败 404等
  (error) => {
    // 弹出响应失败的错误信息并抛出reject进入catch
    if (error.response.status === 401) {
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('token 失效')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)
