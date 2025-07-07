<!-- pages/cart/cart.vue -->
<template>
  <view>
    <NavLogo />
    <view>
      <button @click="clearCart">清空购物车</button>
      <button @click="testBadge">测试徽标</button>>
      <button @click="testLogin">是否登录</button>
      <button @click="testHistory">测试浏览历史记录</button>

    </view>

  </view>
</template>

<script setup>

import { useCartStore } from '@/stores/modules/cart.store'
import NavLogo from "@/components/NavLogo.vue";
import HistoryApi from '@/api/history'
import { useUserStore } from '@/stores/modules/user.store'

const cartStore = useCartStore()
const userStore = useUserStore()

const clearCart = () => {
  // 使用action
  cartStore.clearCart()
}

const testBadge = () => {
  // 测试显示
  uni.setTabBarBadge({
    index: 2,
    text: cartStore.totalCount.toString()
  })

}

const testLogin = async () => {
  console.log(userStore.isLoggedIn)
}

const testHistory = async () => {
  // 获取浏览记录
  const res = await HistoryApi.getHistory()
  console.log(res)
}
</script>


<style scoped lang="scss">

</style>
