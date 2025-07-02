import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    // State
    const items = ref([]) // 购物车商品数组

    // Getters
    const totalCount = computed(() =>
        items.value.reduce((total, item) => total + item.quantity, 0)
    )

    // Actions
    function addItem(item) {
        items.value.push(item)
    }

    function clearCart() {
        items.value = []
    }

    return {
        items,
        totalCount,
        addItem,
        clearCart
    }
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'cart',
                paths: ['items'] // 只持久化items数组
            }
        ]
    }
})