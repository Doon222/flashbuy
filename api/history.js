import http from '../utils/http/request'

const API_BASE = '/api'

export default {

    // 添加浏览历史
    addHistory: (goodsId) => http.post(`${API_BASE}/addhistory?goods_id=${goodsId}`),

    // 查询浏览历史
    getHistory: (page = 1, pagesize = 10) => http.get(`${API_BASE}/history`,
        {
            page,
            pagesize
        })
}