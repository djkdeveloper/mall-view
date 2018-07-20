import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    userName: username,
    password: password
  }
  return request({
    url: '/mall-user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/mall-user/manager/managerauthoritys',
    method: 'get'
  })
}

