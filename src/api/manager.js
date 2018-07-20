/**
 * Created by dujinkai on 2018/7/10.
 */
import request from '@/utils/request';

// 分页查询品牌信息
export function managerlist(query) {
  return request({
    url: '/mall-user/manager/list',
    method: 'post',
    params: query
  })
}

// 查询员工创建的角色
export function queryRoles() {
  return request({
    url: '/mall-user/manager/roles',
    method: 'get',
  })
}

// 新增员工信息
export function addManager(manager) {
  return request({
    url: '/mall-user/manager',
    method: 'post',
    data: manager
  })
}

// 删除员工信息
export function deleteManagers(ids) {
  return request({
    url: '/mall-user/manager',
    method: 'delete',
    params: ids
  })
}

// 根据id查询员工信息
export function queryById(id) {
  return request({
    url: '/mall-user/manager/' + id,
    method: 'get'
  })
}

// 更新员工信息
export function updateManager(manager) {
  return request({
    url: '/mall-user/manager',
    method: 'put',
    data: manager
  })
}

