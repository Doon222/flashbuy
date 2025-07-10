import http from '../../../utils/http/request'

const API_BASE = '/api'

export default {

    // 支付
    pay: (data) => http.post(`${API_BASE}/wxpay`,{
        openid: data.openid,
        order_id: data.order_id,
        total_price: data.total_price
    }),

    // 查询支付状态
    qureyPay: (order_id) => http.post(`${API_BASE}/queryPayOrder?order_id=${order_id}`)
}