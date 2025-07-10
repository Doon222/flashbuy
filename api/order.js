import http from '../utils/http/request'

const API_BASE = '/api'

export default {

    // 获取用户订单数据
    getOrderList: () => http.post(`${API_BASE}/userorder`),

    // 删除订单
    delOrder: (orderId) => http.post(`${API_BASE}/delorder?order_id=${orderId}`),

    // 取消订单
    cancelOrder: (orderId) => http.post(`${API_BASE}/cancelorder?order_id=${orderId}`),
}

