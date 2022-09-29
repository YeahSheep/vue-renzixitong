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
export const addRoleApi = (data) => {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

/**
 * 编辑角色
 * @param {*} data
 * @returns
 */
export const updateRoleApi = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put'
  })
}
/**
 * 删除角色
 * @param {*} id
 * @returns
 */
export const deleteRoleApi = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

export const getComponentApi = (id) => {
  return request({
    url: `/company/{id}`
  })
}
