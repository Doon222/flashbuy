<template>
  <!-- 返回按钮 -->
    <view
        v-show="showBackBtn"
        class="back-btn"
        @click="goBack"
        :style="{ bottom: bottom + 'px', right: right + 'px' }"
    >
      <view class="icon">←</view>
      <text class="text">返回</text>
    </view>

</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';

const props = defineProps({
  bottom: {
    type: Number,
    default: 100
  },
  right: {
    type: Number,
    default: 30
  },
  delta: {
    type: Number,
    default: 1
  }
});

const showBackBtn = ref(false);

const checkPageStack = () => {
  const pages = getCurrentPages();
  showBackBtn.value = pages.length > 1;
};

const goBack = () => {
  uni.navigateBack({
    delta: props.delta,
    fail: (err) => {
      console.error('返回失败:', err);
      uni.reLaunch({url: '/pages/index/index'});
    }
  });
};

onMounted(() => {
  checkPageStack();
  uni.$on('pageChanged', checkPageStack);
});

onUnmounted(() => {
  uni.$off('pageChanged', checkPageStack);
});
</script>

<style lang="scss" scoped>


.back-btn {
  position: fixed;
  z-index: 1000; /* 提高层级确保在最前 */
  right: px2rpx(30);
  bottom: px2rpx(100);
  display: flex;
  align-items: center;
  justify-content: center;
  width: px2rpx(40);
  height: px2rpx(20);
  border-radius: px2rpx(20);
  box-shadow: 0 px2rpx(4) px2rpx(8) rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  padding: 0 px2rpx(10);

}

.back-btn:active {
  transform: scale(0.95);
}

.icon {
  font-size: #{px2rpx(36)}rpx;
  font-weight: bold;
  color: white;
  margin-right: #{px2rpx(8)}rpx;
}

.text {
  font-size: #{px2rpx(28)}rpx;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(#{px2rpx(20)}rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.back-btn {
  animation: fadeIn 0.5s ease forwards;
}

.back-btn:hover {
  animation: pulse 1.5s infinite;
}
</style>