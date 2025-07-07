const baseURL = 'http://47.98.187.80:5000' // 后端地址
import { useUserStore } from '@/stores/modules/user.store'

// 提取的刷新token方法
const refreshTokenRequest = async () => {
    const userStore = useUserStore()
    try {
        const [error, res] = await uni.request({
            url: baseURL + '/api/refreshToken',
            method: 'POST',
            data: {
                refreshToken: userStore.refreshToken
            },
            header: {
                'content-type': 'application/json'
            }
        })

        if (error || !res || res.statusCode !== 200) {
            throw new Error(error?.errMsg || '刷新token失败')
        }

        if (!res.data?.token) {
            throw new Error('无效的token响应')
        }

        return res.data
    } catch (error) {
        console.error('刷新token错误:', error)
        throw error
    }
}

const request = (url, method, data) => {
    return new Promise((resolve, reject) => {
        const userStore = useUserStore()

        // 设置请求头
        const header = {
            'content-type': 'application/json'
        }

        // 携带token
        if (userStore.token) {
            header['Token'] = `${userStore.token}`
        }

        const sendRequest = () => {
            uni.request({
                url: baseURL + url,
                method: method || 'GET',
                data: data || {},
                header: header,
                success: async (res) => {
                    // 处理token过期
                    if (res.statusCode === 401) {
                        try {
                            // 调用提取的刷新方法
                            const newTokens = await refreshTokenRequest()

                            // 更新store中的token
                            userStore.login({
                                token: newTokens.token,
                                refreshToken: userStore.refreshToken, // 保持原refreshToken
                                userInfo: newTokens.userInfo || userStore.userInfo
                            })

                            // 更新请求头后重试请求
                            header['Token'] = `${newTokens.token}`
                            sendRequest() // 递归重试
                        } catch (error) {
                            // 刷新失败，跳转登录
                            userStore.logout()
                            uni.reLaunch({ url: '/subpackages/login/login' })
                            reject('登录已过期，请重新登录')
                        }
                        return
                    }

                    // 其他状态码处理
                    if (res.statusCode === 200) {
                        resolve(res.data)
                    } else {
                        reject(`请求失败: ${res.statusCode}`)
                    }
                },
                fail: (err) => {
                    reject('网络请求失败')
                }
            })
        }

        // 发起请求
        sendRequest()
    })
}

export default {
    get: (url, data) => request(url, 'GET', data),
    post: (url, data) => request(url, 'POST', data),
    put: (url, data) => request(url, 'PUT', data),
    delete: (url, data) => request(url, 'DELETE', data)
}