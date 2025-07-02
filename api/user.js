import http from '../utils/http/request'

const API_BASE = '/api'

export default {
    // 注册
    register: (data) => http.post(`${API_BASE}/register`, data),

    // 登录
    login: (data) => http.post(`${API_BASE}/login`, data),

    // 上传头像
    uploadAvatar: (formData) => http.post(`${API_BASE}/upload`, formData),

    // 获取用户地址
    getUserAddress: () => http.get(`${API_BASE}/getaddress`),

    // 添加用户地址
    addUserAddress: (data) => http.post(`${API_BASE}/addaddress`, data),

    // 修改用户地址
}