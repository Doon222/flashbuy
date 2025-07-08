const baseURL = 'http://47.98.187.80:5000' // 后端地址
import { useUserStore } from '@/stores/modules/user.store'

// 最大重试次数
const MAX_RETRY_COUNT = 1

// 提取的刷新token方法（修复解构问题）
const refreshTokenRequest = async () => {
    const userStore = useUserStore()
    try {
        // 使用Promise风格调用，直接获取响应对象
        const res = await uni.request({
            url: baseURL + '/api/refreshToken',
            method: 'POST',
            data: {
                refreshToken: userStore.refreshToken
            },
            header: {
                'content-type': 'application/json'
            }
        })

        // uni.request返回的是对象 { data, statusCode, header, cookies }
        if (res.statusCode !== 200) {
            throw new Error(`刷新token失败，状态码: ${res.statusCode}`)
        }

        if (!res.data?.token) {
            throw new Error('响应中缺少token字段')
        }

        return {
            token: res.data.token,
            refreshToken: res.data.refreshToken || userStore.refreshToken,
            userInfo: res.data.userInfo || userStore.userInfo
        }
    } catch (error) {
        console.error('刷新token错误:', error)
        throw error
    }
}

const request = (url, method, data, retryCount = 0) => {
    return new Promise((resolve, reject) => {
        const userStore = useUserStore()
        const header = { 'content-type': 'application/json' }

        if (userStore.token) {
            header['Token'] = userStore.token
        }

        uni.request({
            url: baseURL + url,
            method: method || 'GET',
            data: data || {},
            header: header,
            async success(res) {
                if (res.statusCode === 401) {
                    if (retryCount >= MAX_RETRY_COUNT) {
                        userStore.logout()
                        uni.reLaunch({ url: '/subpackages/login/login' })
                        return reject(new Error('登录已过期，请重新登录'))
                    }

                    try {
                        const newTokens = await refreshTokenRequest()
                        userStore.login({
                            token: newTokens.token,
                            refreshToken: newTokens.refreshToken,
                            userInfo: newTokens.userInfo
                        })

                        // 返回重试请求的结果
                        const retryResult = await request(url, method, data, retryCount + 1)
                        resolve(retryResult)
                    } catch (error) {
                        userStore.logout()
                        uni.reLaunch({ url: '/subpackages/login/login' })
                        reject(new Error('登录已过期，请重新登录'))
                    }
                    return
                }

                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    reject(new Error(`请求失败: ${res.data?.message || res.statusCode}`))
                }
            },
            fail: (err) => {
                reject(new Error(`网络请求失败: ${err.errMsg}`))
            }
        })
    })
}

export default {
    get: (url, data) => request(url, 'GET', data),
    post: (url, data) => request(url, 'POST', data),
    put: (url, data) => request(url, 'PUT', data),
    delete: (url, data) => request(url, 'DELETE', data),
    request
}