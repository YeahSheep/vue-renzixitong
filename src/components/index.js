// 引入所有过滤器进行全局注册
import * as filters from '@/filters'
// require.context(路径，是否查看子目录，正则) ==>返回一个函数
// require.context 返回的函数 有一个keys属性，对应也是一个方法，返回值 找到内容的路径
// require.context 返回的函数 的作用 根据路径 找到对应的模块

const fn = require.context('./', true, /\.vue$/)
// console.log(fn.keys()) // 符合正则的所有路径
// console.log(fn('./PageTools/index.vue')) // 根据路径查找到的模块
const components = fn.keys().map((item) => {
  console.log(item.split('/')[1])
  //   item.componentname = item.split('/')[1]
  return fn(item)
})

// Vue.use(plugins)
// Vue.use接收的第一个参数plugins可以是一个对象也可以是一个函数，对象需要配置install方法，函数会被默认执行install方法

// 对象
// export default {
//   install: function(Vue) {
//     components.forEach((ele) => {
//     // vue.component('组件名字'，'组件对象')
//       Vue.component(ele.name, ele)
//     })
//   }
// }

export default (Vue) => {
  components.forEach((ele) => {
    // vue.component('组件名字'，'组件对象')
    Vue.component(ele.default.name, ele.default)
    Object.keys(filters).forEach((key) => {
      //   console.log(Object.keys(filters)) 过滤器名称的数组
      //   console.log(filters[key])  过滤器方法的数组
      //   Vue.filter('过滤器名称', 过滤器方法)
      Vue.filter(key, filters[key])
    })
  })
}
