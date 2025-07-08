import {useCartStore} from "@/stores/modules/cart.store";

export function showCarBadge() {
    const cartStore = useCartStore()
    const tabBarIndex = 2

    if (cartStore.totalCount > 0) {
        uni.setTabBarBadge({
            index: tabBarIndex, // 请确认这是购物车页的正确索引
            text: cartStore.totalCount > 99 ? '99+' : String(cartStore.totalCount)
        })
    } else {
        uni.removeTabBarBadge({
            index: tabBarIndex
        })
    }
}