<!-- components/CartBadge.vue -->
<script setup>
import { useCartStore } from '@/stores/modules/cart.store'
const cartStore = useCartStore()

</script>

<template>
  <view class="cart-icon">
    <slot></slot>
    <view v-if="cartStore.totalCount > 0" class="badge">
      {{ cartStore.totalCount > 99 ? '99+' : cartStore.totalCount }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.badge {
  position: absolute;
  top: px2rpx(-16);
  right: px2rpx(-16);
  min-width: px2rpx(16);
  height: px2rpx(16);
  line-height: px2rpx(16);
  border-radius: 8px;
  background-color: #FF4D4F;
  color: white;
  font-size: 10px;
  text-align: center;
  padding: 0 px2rpx(3);
  z-index: 10;
}
</style>