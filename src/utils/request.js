import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8081/', // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = "Bearer " + getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status == 403) {
      Message({
        message: '您没有此权限！',
        type: 'error',
        duration: 3000
      })
    } else if (error.response.status == 400) {
      Message({
        message: '用户名或密码错误！',
        type: 'error',
        duration: 3000
      })
    } else {
      Message({
        message: '网络异常请重试',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error.response);
  })

export default service
