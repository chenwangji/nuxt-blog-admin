import axios from 'axios'
// import qs from 'querystring'
import * as config from '../config'
import { loginIn } from '@/utils/loginIn'
import app from '@/main'

const ax = axios.create({
  baseURL: config.API_ROOT
})

// 拦截器
ax.interceptors.request.use(
  (config: any) => {
    // if (
    //   config.method === 'post' ||
    //   config.method === 'put' ||
    //   config.method === 'delete' ||
    //   config.method === 'patch'
    // ) {
    //   config.data = qs.stringify(config.data)
    // }

    const tokenObj = window.localStorage.getItem('TOKEN')
    if (tokenObj) {
      config.headers.Authorization = `Bearer ${JSON.parse(tokenObj || '').token}`
    }
    return config
  },
  (error: string) => {
    return Promise.reject(error)
  }
)

ax.interceptors.response.use(
  (response: any) => {
    return response
  },
  () => {
    if (!loginIn()) {
      app.$alert('用户信息已过期，请点击确定后重新登录。', '提示', {
        confirmButtonText: '确定',
        callback: () => app.$router.push({
          path: '/login',
          query: { redirect: app.$route.fullPath }
        })
      })
    }
  }
)

export default ax
