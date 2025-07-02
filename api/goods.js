import http from '../utils/http/request'

const API_BASE = '/api'

export default {

    // 获取商品列表
    getGoodsList: ({page = 1, limit = 8}) => http.get(`${API_BASE}/recommend`, {page, limit}),

    // 获取商品分类
    getGoodsCategory: () => http.get(`${API_BASE}/getcategory`),

    // 获取分类下的商品
    getGoodsByCategory: (categoryId) => http.get(`${API_BASE}/getcategorygoods`, {categoryId}),

    // 获取商品详情
    getGoodsDetail: (goodsId) => http.get(`${API_BASE}/getgoodsinfo/${goodsId}`),

    // 获取商品图片
    getGoodsImages: (goodsId) => http.get(`${API_BASE}/getthumbimages/${goodsId}`),


}