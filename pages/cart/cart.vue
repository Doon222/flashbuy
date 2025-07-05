<!-- pages/cart/cart.vue -->
<template>
  <view>
    <NavLogo />
    <view>
      <button @click="mockAddCart">模拟添加商品</button>
      <button @click="clearCart">清空购物车</button>
      <button @click="testBadge">测试徽标</button>
      <button @click="login">测试登录</button>

    </view>

  </view>
</template>

<script setup>

import { useCartStore } from '@/stores/modules/cart.store'
import NavLogo from "@/components/NavLogo.vue";
import UserApi from '../../api/user'

const cartStore = useCartStore()

const mockAddCart = () => {
  // 使用action而不是直接操作state
  cartStore.addItem({
    id: Date.now(),
    name: '测试商品',
    quantity: Math.floor(Math.random() * 5) + 1
  })
}

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

const login = async () => {
  const res = await UserApi.login({
    username: 'fwzlw',
    password: '123456'
  })
  console.log(res)
}

</script>


<style scoped lang="scss">

</style>
