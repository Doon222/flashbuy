<template>
  <view class="navbar">
    <!-- 左侧返回按钮 -->
    <view class="nav-left" @click="handleBack">
      <slot name="left">
        <image v-if="showBack" src="/static/images/back.png" class="back-icon" />
      </slot>
    </view>

    <!-- 中间标题插槽 -->
    <view class="nav-center">
      <slot></slot>
    </view>

    <!-- 右侧插槽 -->
    <view class="nav-right">
      <slot name="right"></slot>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true
  },
  // 自定义返回图标路径
  backIcon: {
    type: String,
    default: '/static/nav/back.png'
  }
})

const emit = defineEmits(['back'])

const handleBack = () => {
  if (props.showBack) {
    emit('back')
    uni.navigateBack()
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .nav-left, .nav-right {
    width: 80rpx;
    height: 100%;
    display: flex;
    align-items: center;

    .back-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .nav-center {
    flex: 1;
    text-align: center;
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 20rpx;
  }
}
</style>