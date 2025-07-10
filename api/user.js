import http from '../utils/http/request'
import {useUserStore} from "@/stores/modules/user.store";

// 使用与request.js相同的baseURL
const API_BASE = '/api' // 保持相对路径，因为baseURL已在request.js中定义

export default {
    // 注册
    register: (data) => http.post(`${API_BASE}/register`, data),

    // 登录
    login: (data) => http.post(`${API_BASE}/login`, data),

    // 获取小程序用户的openid
    getOpenId: (code) => http.post(`${API_BASE}/getopenid`, {code}),

    // 上传用户头像
    uploadAvatar: (filePath) => {
        const userStore = useUserStore()
        return new Promise((resolve, reject) => {
            // 获取当前token
            const token = userStore.token

            uni.uploadFile({
                url: http.baseURL + `${API_BASE}/upload`,
                filePath: filePath,
                name: 'avatar',
                header: {
                    'Token': token, // 添加token到请求头
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    'type': 'avatar'
                },
                success: (uploadRes) => {
                    try {
                        const res = JSON.parse(uploadRes.data)
                        if (res.status === 0) {
                            resolve({
                                code: 200,
                                data: {
                                    avatarUrl: res.src
                                }
                            })
                        } else {
                            reject(new Error(res.message || '上传失败'))
                        }
                    } catch (e) {
                        reject(new Error('解析响应数据失败'))
                    }
                },
                fail: (err) => {
                    reject(new Error(err.errMsg || '上传失败'))
                }
            })
        })
    }
}