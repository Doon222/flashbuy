<script setup>
import {ref, onMounted} from 'vue'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '搜索商品'
  }
})

const safeAreaInsets = ref({top: 0})
const showSearchBox = ref(props.showSearch)
const navbarHeight = ref(70)

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  safeAreaInsets.value = systemInfo.safeAreaInsets || {top: 0}
})

// 直接处理搜索跳转
function navigateToSearch() {
  uni.navigateTo({
    url: '/subpackages/search/search' // 替换为您的搜索页面路径
  })
}
</script>

<template>
  <view class="navbar-container">
    <view class="nav-logo" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
      <image src="@/static/logo.png" mode="aspectFit" class="logo"/>
      <text class="logo-text">| 闪电一般的购物体验</text>
    </view>

    <!-- 修改后的搜索框 -->
    <view class="search-box" v-if="showSearchBox">
      <view class="search-container" @click="navigateToSearch">
        <text class="icon-search">🔍</text>
        <text class="search-placeholder">{{ placeholder }}</text>
      </view>
    </view>
  </view>

  <view class="navbar-placeholder" :style="{ height: `calc(${safeAreaInsets.top+10}px + ${navbarHeight+30}px)` }"></view>
</template>

<style lang="scss">
/* 保持原有样式不变 */
.navbar-container {
  position: fixed;
  width: 100vw;
  background-color: #ffffff;
  z-index: 1000;
  height: px2rpx(65);
}

.nav-logo {
  display: flex;
  align-items: center;
  height: px2rpx(24);
}

.logo {
  width: px2rpx(70);
  height: px2rpx(20);
}

.logo-text {
  font-size: px2rpx(6);
  font-weight: bold;
  letter-spacing: px2rpx(1);
  vertical-align: bottom;
  text-shadow: 0 2rpx 4rpx rgba(255, 149, 0, 0.3);
}

.search-box {
  padding: 0 px2rpx(10) px2rpx(10);
  padding-top: px2rpx(5);

  .search-container {
    -webkit-tap-highlight-color: transparent;
    outline: none;
    user-select: none;
    display: flex;
    align-items: center;
    height: px2rpx(16);
    background-color: #f5f5f5;
    border-radius: px2rpx(16);
    padding: 0 px2rpx(12);
    cursor: pointer; /* 添加指针样式 */

    .icon-search {
      font-size: px2rpx(10);
      margin-right: px2rpx(6);
      color: #999;
    }

    .search-placeholder {
      font-size: px2rpx(8);
      color: #999;
    }
  }
}

.navbar-placeholder {
  width: 100%;
  background-color: transparent;
}
</style>