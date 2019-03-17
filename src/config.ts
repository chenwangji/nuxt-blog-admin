/**
 * API_ROOT
 */
// proxy
// export const API_ROOT: string = window.location.origin + '/api'

// cors - test
const IS_DEV: boolean = process.env.NODE_ENV !== 'production'
export const API_ROOT: string = IS_DEV ? 'http://localhost:8000/api/' : 'http://admin.todyto.cn/api/'

/**
 * 七牛对象存储空间
 */
export const QN_URL: string = 'http://img.todyto.cn/'
