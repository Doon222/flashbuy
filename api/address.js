import http from '../utils/http/request'

const API_BASE = '/api'

export default {

    // 获取用户地址列表接口
    getAddressList: () => http.get(`${API_BASE}/getaddress`),
    // 添加用户地址接口
    addAddress: (data) => http.post(`${API_BASE}/addaddress`,{
        name : data.name,
        tel : data.tel,
        addressDetail : data.addressDetail,
        isDefault : data.isDefault,
        province : data.province,
        city : data.city,
        county : data.county,
        postalCode: data.postalCode,
        areaCode: data.areaCode
    }),
    // 修改用户地址接口
    updateAddress: (addressId,data) => http.post(`${API_BASE}/updateaddress?address_id=${addressId}`,{
        name : data.name,
        tel : data.tel,
        addressDetail : data.addressDetail,
        isDefault : data.isDefault,
        province : data.province,
        city : data.city,
        county : data.county,
        postalCode: data.postalCode,
        areaCode: data.areaCode
    }),
    // 删除用户地址接口
    delAddress: (addressId) => http.post(`${API_BASE}/deladdress?address_id=${addressId}`)
}