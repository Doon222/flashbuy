import http from '../utils/http/request'

const API_BASE = '/api'

export default {
    // 获取轮播图
    getCarousel: () => http.get(`${API_BASE}/getlunbo`)
}