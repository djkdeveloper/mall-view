/**
 * Created by dujinkai on 2018/7/10.
 */
import request from '@/utils/request';

// 分页查询品牌信息
export function brandlist(query) {
  return request({
    url: '/mall-goods/brand/list',
    method: 'post',
    params: query
  })
}

// 添加品牌信息
export function addBrand(brand) {
  return request({
    url: '/mall-goods/brand',
    method: 'post',
    data: brand
  })
}

//删除品牌信息
export function delBrand(ids) {
  return request({
    url: '/mall-goods/brand',
    method: 'delete',
    params: ids
  })
}

// 根据品牌id查询品牌信息
export function queryById(id) {
  return request({
    url: '/mall-goods/brand/' + id,
    method: 'get',
  })
}

// 更新品牌
export function updateBrand(brand) {
  return request({
    url: '/mall-goods/brand',
    method: 'put',
    data: brand
  })
}
