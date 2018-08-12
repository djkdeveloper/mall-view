import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username: username,
    password: password,
    client_id: 'client_2',
    client_secret: '123456',
    grant_type: 'password'
  }
  return request({
    url: '/uaa/oauth/token',
    method: 'post',
    params: data
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

