import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
// require.context 这个方法有 3 个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
// console.log(req.keys());
// req.keys方法返回一个数组，内容为符合条件的所有路径
// console.log(req('./dashboard.svg'));
// 等同于引入图片
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
