<!-- pages/cart/cart.vue -->
<template>
  <view>
    <NavLogo />
    <view>
      <button @click="clearCart">清空购物车</button>
      <button @click="testBadge">测试徽标</button>
      <button @click="testGetAddress">测试获取地址列表</button>
      <button @click="testAddAddress">测试添加地址</button>
      <button @click="testUpdateAddress">测试修改地址</button>
      <button @click="testDelAddress">测试删除地址</button>
    </view>

  </view>
</template>

<script setup>

import { useCartStore } from '@/stores/modules/cart.store'
import NavLogo from "@/components/NavLogo.vue";
import AddressApi from '@/api/address'

const cartStore = useCartStore()

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

const testGetAddress = async () => {
  const res = await AddressApi.getAddressList()
  console.log(res)
}

const testAddAddress = async () => {
  const res = await AddressApi.addAddress()
  console.log(res)
}

const testUpdateAddress = async () => {

  const res = await AddressApi.updateAddress()
  console.log(res)
}

const testDelAddress = async () => {
  const res = await AddressApi.delAddress(1975)
  console.log(res)
}

</script>


<style scoped lang="scss">

</style>
