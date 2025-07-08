import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user.store'

export const useCartStore = defineStore('cart', () => {
    // State
    // 购物车中的内容
    // {goods_id,number,selected,price}
    const items = ref([])

    // Getters
    const totalCount = computed(() =>
        items.value.reduce((total, item) => total + item.number, 0))

    const totalPrice = computed(() =>
        items.value.reduce((total, item) => total + (item.price * item.number), 0))

    const isCartEmpty = computed(() => items.value.length === 0)

    const isShowUseAddressButton = computed(() => {
        const userStore = useUserStore()
        return userStore.isLoggedIn && !isCartEmpty.value
    })

    // Actions
    function addItem(item) {
        const existingItem = items.value.find(i => i.id === item.id)
        if (existingItem) {
            existingItem.number += item.number
        } else {
            items.value.push({...item, selected: true})
        }
    }

    function updateItem(id, updates) {
        const item = items.value.find(i => i.id === id)
        if (item) {
            Object.assign(item, updates)
        }
    }

    function removeItem(id) {
        items.value = items.value.filter(i => i.id !== id)
    }

    function clearCart() {
        items.value = []
    }

    // 初始化从服务端同步购物车数据
    function syncCartData(shopCarData) {
        if (Array.isArray(shopCarData)) {
            items.value = shopCarData
        }
    }

    return {
        items,
        totalCount,
        totalPrice,
        isCartEmpty,
        isShowUseAddressButton,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        syncCartData
    }
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'cart',
                paths: ['items']
            }
        ]
    }
})