/**
 * Created by dujinkai on 2018/7/10.
 */
import request from '@/utils/request';

// 分页查询会员信息
export function customerlist(query) {
  return request({
    url: '/mall-user/customer/list',
    method: 'post',
    params: query
  })
}

// 新增会员信息
export function addCustomer(customer) {
  return request({
    url: '/mall-user/customer',
    method: 'post',
    data: customer
  })
}


// 删除会员信息
export function deleteCustomers(ids) {
  return request({
    url: '/mall-user/customer',
    method: 'delete',
    params: ids
  })
}

// 根据会员id查询会员信息
export function queryById(id) {
  return request({
    url: '/mall-user/customer/' + id,
    method: 'get',
  })
}

// 更新会员信息
export function updateCustomer(customer) {
  return request({
    url: '/mall-user/customer',
    method: 'put',
    data: customer
  })
}
