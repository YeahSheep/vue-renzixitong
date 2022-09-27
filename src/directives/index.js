export const imgerror = {
  // 什么时候更换图片
  // 图片加载失败会自动触发img属性的onerror方法
  inserted(el, bingding, vnode) {
    // el 表示当前指令作用的dom对象
    // console.log(el)
    // bingding是当前指令的相关信息
    // console.log(bingding)
    // vnode虚拟节点
    // console.log(vnode)
    el.onerror = () => {
      el.src = bingding.value
    }
  }
}
