/**
 * Created by dujinkai on 2018/7/10.
 */
import request from '@/utils/request';

// 分页查询商品信息
export function spulist(query) {
  return request({
    url: '/mall-goods/spu/list',
    method: 'post',
    params: query
  })
}

// 查询所有品牌信息
export function queryAllBrands() {
  return request({
    url: '/mall-goods/spu/allbrands',
    method: 'get'
  })
}


// 查询所有的三级分类信息
export function queryAllFirstCategorys() {
  return request({
    url: '/mall-goods/spu/firstcategory',
    method: 'get'
  })
}

// 添加商品
export function addSpu(spu) {
  return request({
    url: '/mall-goods/spu',
    method: 'post',
    data: spu
  })
}

//删除商品信息
export function delSpus(ids) {
  return request({
    url: '/mall-goods/spu',
    method: 'delete',
    params: ids
  })
}

// 查询分类下的子分类
export function queryCateroryChildren(id) {
  return request({
    url: '/mall-goods/spu/querycaterorychildren/' + id,
    method: 'get'
  })
}

// 根据商品id查询商品信息
export function queryById(id) {
  return request({
    url: '/mall-goods/spu/' + id,
    method: 'get'
  })
}

// 更新商品信息
export function updateSpu(spu) {
  return request({
    url: '/mall-goods/spu',
    method: 'put',
    data: spu
  })
}
