<!-- pages/cart/cart.vue -->
<template>
  <view>
    <NavLogo />
    <view>
      <button @click="mockAddCart">模拟添加商品</button>
      <button @click="clearCart">清空购物车</button>
      <button @click="testBadge">测试徽标</button>
      <button @click="testGetCategory">测试获取分类</button>
      <button @click="testGetGoods">测试获取商品</button>
      <button @click="testSearchCategory">测试查询商品</button>
    </view>

  </view>
</template>

<script setup>

import { useCartStore } from '@/stores/modules/cart.store'
import NavLogo from "@/components/NavLogo.vue";
import GoodsApi from '@/api/goods'

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

const testGetCategory = async () => {
  const res = await GoodsApi.getGoodsCategory()
  console.log(res)
}

const testGetGoods = async () => {
  const res = await GoodsApi.getGoodsByCategory(29)
  console.log(res)
}

const testSearchCategory = async () => {
  const res = await GoodsApi.searchGoods({
    value: '手机',
  })
  console.log(res)
}

</script>


<style scoped lang="scss">

</style>
