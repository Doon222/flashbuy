import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {useCartStore} from "@/stores/modules/cart.store";

export const useUserStore = defineStore('user', () => {
    // State
    const userInfo = ref({})
    const token = ref('')
    const refreshToken = ref('')

    // Getters
    const isLoggedIn = computed(() => !!token.value)

    // Actions
    function login(response) {
        userInfo.value = response.userInfo
        token.value = response.token
        refreshToken.value = response.refreshToken
    }

    function logout() {
        userInfo.value = {}
        token.value = ''
        refreshToken.value = ''

        // 清空购物车
        const cartStore = useCartStore()
        cartStore.clearCart()
    }

    return {
        userInfo,
        token,
        refreshToken,
        isLoggedIn,
        login,
        logout,
    }
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                paths: ['userInfo', 'token', 'refreshToken']
            }
        ]
    }
})