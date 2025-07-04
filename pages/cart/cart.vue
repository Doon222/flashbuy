<!-- pages/cart/cart.vue -->
<template>
  <view>
    <NavLogo />
    <view>
      <button @click="mockAddCart">模拟添加商品</button>
      <button @click="clearCart">清空购物车</button>
      <button @click="testBadge">测试徽标</button>
      <button @click="testGetGoodsImg">测试根据id查询商品轮播图</button>
      <button @click="testGetGoodsDetail">测试根据id查询商品详情</button>

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

const testGetGoodsImg = async () => {
  const res = await GoodsApi.getGoodsImages(87)
  console.log(res)
}

const testGetGoodsDetail = async () => {
  const res = await GoodsApi.getGoodsDetail(87)
  console.log(res)
}

</script>


<style scoped lang="scss">

</style>
