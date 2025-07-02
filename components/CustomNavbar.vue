<template>
  <view class="custom-navbar">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 导航栏内容 -->
    <view class="navbar-content">
      <!-- Logo直接使用rpx单位 -->
      <image
          :src="logo"
          class="navbar-logo"
          mode="aspectFit"
      />

      <!-- 插槽内容 -->
      <view class="navbar-slot">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup>
// JavaScript 部分不需要调用 px2rpx
const props = defineProps({
  logo: String,
  statusBarHeight: {
    type: Number,
    default: 20
  }
})
</script>

<style lang="scss">
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  /* 使用SCSS函数转换样式值 */
  box-shadow: 0 px2rpx(4) px2rpx(12) rgba(0, 0, 0, 0.1);
}

.status-bar {
  width: 100%;
}

.navbar-content {
  display: flex;
  align-items: center;
  height: px2rpx(88); // 直接调用SCSS函数
  padding: 0 px2rpx(24);
}

.navbar-logo {
  width: px2rpx(180); // Logo宽度转换
  height: px2rpx(60); // Logo高度转换
  flex-shrink: 0;
}

.navbar-slot {
  flex: 1;
  margin-left: px2rpx(20);
}
</style>