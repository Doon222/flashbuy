import http from '../utils/http/request'

const API_BASE = '/api'

export default {

    // 获取用户订单数据
    getOrderList: () => http.post(`${API_BASE}/userorder`),

    // 删除订单
    delOrder: (orderId) => http.post(`${API_BASE}/delorder?order_id=${orderId}`),

    // 取消订单
    cancelOrder: (orderId) => http.post(`${API_BASE}/cancelorder?order_id=${orderId}`),

    // 下单
    createOrder: (data) => http.post(`${API_BASE}/commitorder`, {
        order_id: data.order_id,
        goods_ids: data.goods_ids,
        number: data.number,
        total_price: data.total_price,
        address_id: data.address_id
    }),

    // 获取订单详情
    getOrderDetail: (orderId) => http.post(`${API_BASE}/getorder?order_id=${orderId}`)
}

