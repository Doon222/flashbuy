<!--page/index/index.vue-->
<template>
  <view class="container">
    <view class="logo">
      <NavLogo />
    </view>


  </view>

  <view>
    <button @click="getCarousel">测试轮播图接口</button>
    <button @click="getGoodsList">测试商品接口</button>
    <button @click="getGoodsCategory">测试商品分类接口</button>
    <button @click="getGoodsDetail">测试商品详情接口</button>
    <button @click="getGoodsImages">测试商品图片接口</button>
  </view>
</template>

<script setup>
import carouselAPI from '/api/carousel'
import goodsAPI from '/api/goods'
import NavLogo from "@/components/NavLogo.vue";

const getCarousel = async () => {
  const res = await carouselAPI.getCarousel()
  console.log(res)
}
const getGoodsList = async () => {
  const res = await goodsAPI.getGoodsList()
  console.log(res)
}
const getGoodsCategory = async () => {
  const res = await goodsAPI.getGoodsCategory()
  console.log(res)
}
const getGoodsDetail = async () => {
  const res = await goodsAPI.getGoodsDetail(87 )
  console.log(res)
}
const getGoodsImages = async () => {
  const res = await goodsAPI.getGoodsImages(87 )
  console.log(res)
}

</script>