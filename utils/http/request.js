const baseURL = 'http://47.98.187.80:5000' // 后端地址

const request = (url, method, data) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseURL + url,
            method: method || 'GET',
            data: data || {},
            header: {
                'content-type': 'application/json'
            },
            success: (res) => {
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
    })
}

export default {
    get: (url, data) => request(url, 'GET', data),
    post: (url, data) => request(url, 'POST', data),
    put: (url, data) => request(url, 'PUT', data),
    delete: (url, data) => request(url, 'DELETE', data)
}