/**
 * Created by dujinkai on 2018/7/10.
 */
import request from '@/utils/request';

// 分页查询角色信息
export function rolelist(query) {
  return request({
    url: '/mall-user/role/list',
    method: 'post',
    params: query
  })
}


// 查询当前角色的权限
export function queryAuthoritys() {
  return request({
    url: '/mall-user/role/authoritiesinduction',
    method: 'get'
  })
}

// 新增角色
export function addRole(role) {
  return request({
    url: '/mall-user/role',
    method: 'post',
    data: role
  })
}


// 删除角色
export function deleteRole(ids) {
  return request({
    url: '/mall-user/role',
    method: 'delete',
    params: ids
  })
}


// 根据角色id查询角色信息
export function queryById(id) {
  return request({
    url: '/mall-user/role/' + id,
    method: 'get'
  })
}

// 更新角色信息
export function updateRole(role) {
  return request({
    url: '/mall-user/role',
    method: 'put',
    data: role
  })
}
