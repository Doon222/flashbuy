import http from '../utils/http/request'

const API_BASE = '/api'

export default {

    // 获取商品列表
    getGoodsList: ({page = 1, limit = 8}) => http.get(`${API_BASE}/recommend`, {page, limit}),

    // 获取商品分类
    getGoodsCategory: () => http.get(`${API_BASE}/getcategory`),

    // 根据分类id获取商品
    getGoodsByCategory: (categoryId) => http.get(`${API_BASE}/getcategorygoods`, {category_id :categoryId}),

    // 获取商品详情
    getGoodsDetail: (goodsId) => http.get(`${API_BASE}/getgoodsinfo/${goodsId}`),

    // 获取商品图片
    getGoodsImages: (goodsId) => http.get(`${API_BASE}/getthumbimages/${goodsId}`),

    // 搜索商品
    searchGoods: ({value, sort, page = 1, pagesize = 10}) => http.get(`${API_BASE}/search`, {value, sort, page, pagesize}),

}