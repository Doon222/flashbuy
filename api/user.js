import http from '../utils/http/request'

const API_BASE = '/api'

export default {
    // 注册
    register: (data) => http.post(`${API_BASE}/register`, data),

    // 登录
    login: (data) => http.post(`${API_BASE}/login`, data),

    // 获取小程序用户的openid
    getOpenId: (code) => http.post(`${API_BASE}/getopenid`, {code}),
}