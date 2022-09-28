import request from '@/utils/request'

/** *
 * huoqu角色
 * ***/
export const getRoleListApi = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}
/** *
 * 新增角色
 * ***/
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
