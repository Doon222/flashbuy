import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({})
    const token = ref('')
    const refreshToken = ref('')
    return {
        userInfo,
        token,
        refreshToken
    }
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                paths: ['userInfo', 'token']
            }
        ]
    }
})