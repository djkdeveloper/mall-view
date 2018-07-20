/**
 * Created by dujinkai on 2018/7/10.
 */
import request from '@/utils/request';

// 分页查询分类信息
export function categorys() {
  return request({
    url: '/mall-goods/category/list',
    method: 'get',
  })
}

// 根据层级查询分类信息
export function queryCategoryByGrade(grade) {
  return request({
    url: '/mall-goods/category/grade/' + grade,
    method: 'get',
  })
}

// 新增分类
export function addCategory(category) {
  return request({
    url: '/mall-goods/category/',
    method: 'post',
    data: category
  })
}


// 根据分类id查询分类信息
export function queryById(id) {
  return request({
    url: '/mall-goods/category/' + id,
    method: 'get',
  })
}

// 更新分类信息
export function updateCategory(category) {
  return request({
    url: '/mall-goods/category/',
    method: 'put',
    data: category
  })
}

// 删除分类信息
export function deleteCategory(id) {
  return request({
    url: '/mall-goods/category/' + id,
    method: 'delete',
  })
}
