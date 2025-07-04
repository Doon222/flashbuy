<template>
  <view class="navbar-container">
    <!-- 导航栏内容 -->
    <view ref="navbarRef" class="navbar-content" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
      <view class="nav-logo">
        <image src="@/static/logo.png" mode="aspectFit" class="logo" @click="goToHome"/>
        <text class="logo-text">| 闪电一般的购物体验</text>
      </view>

      <!-- 搜索框 -->
      <view class="search-box" v-if="showSearchBox">
        <view class="search-container" @click="navigateToSearch">
          <text class="icon-search">🔍</text>
          <text class="search-placeholder">{{ placeholder }}</text>
        </view>
      </view>
    </view>

    <!-- 动态占位区 -->
    <view class="navbar-placeholder" :style="{ height: placeholderHeight + 'px' }"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, getCurrentInstance } from 'vue'

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

// 响应式数据
const safeAreaInsets = ref({ top: 0 })
const showSearchBox = ref(props.showSearch)
const placeholderHeight = ref(0)
const instance = getCurrentInstance() // 获取组件实例

// 获取导航栏高度（优化版）
const getNavbarHeight = () => {
  return new Promise((resolve) => {
    // 使用组件作用域查询
    const query = uni.createSelectorQuery().in(instance)

    query.select('.navbar-content').boundingClientRect(data => {
      if (data && data.height > 0) {
        resolve(data.height)
      } else {
        // 精确的回退计算：安全区 + Logo高度 + 搜索框高度(如果显示)
        const baseHeight = uni.upx2px(120) // Logo区域高度120rpx->px
        const searchHeight = showSearchBox.value ? uni.upx2px(95) : 0 // 搜索框高度95rpx->px
        resolve(safeAreaInsets.value.top + baseHeight + searchHeight)
      }
    }).exec()
  })
}

// 更新占位区高度（添加5px安全边距）
const updatePlaceholderHeight = async () => {
  try {
    const height = await getNavbarHeight()
    placeholderHeight.value = height + 5 // 添加额外边距避免滚动时闪烁
  } catch (e) {
    console.error('高度计算失败:', e)
    // 最终回退方案
    const baseHeight = uni.upx2px(120)
    const searchHeight = showSearchBox.value ? uni.upx2px(95) : 0
    placeholderHeight.value = safeAreaInsets.value.top + baseHeight + searchHeight + 5
  }
}

// 初始化
onMounted(async () => {
  const systemInfo = uni.getSystemInfoSync()
  safeAreaInsets.value = systemInfo.safeAreaInsets || { top: 0 }

  // 确保DOM更新后计算
  await nextTick()
  await updatePlaceholderHeight()
})

// 监听搜索框显示状态变化
watch(() => props.showSearch, async (newVal) => {
  showSearchBox.value = newVal
  await nextTick()
  await updatePlaceholderHeight()
})

// 处理搜索跳转
function navigateToSearch() {
  uni.navigateTo({
    url: '/subpackages/search/search'
  })
}

function goToHome() {
  uni.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss">
.navbar-container {
  position: relative;
  width: 100%;
  z-index: 1000;
  transition: height 0.3s ease;

}

.navbar-content {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  z-index: 1001;
}

.nav-logo {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  height: 80rpx;
}

.logo {
  width: 140rpx;
  height: 40rpx;
}

.logo-text {
  font-size: 24rpx;
  font-weight: bold;
  letter-spacing: 1rpx;
  color: #333;
  margin-left: 16rpx;
  vertical-align: bottom;
  text-shadow: 0 2rpx 4rpx rgba(255, 149, 0, 0.3);
}

.search-box {
  padding: 0 24rpx 24rpx;

  .search-container {
    display: flex;
    align-items: center;
    height: 64rpx;
    background-color: #f5f5f5;
    border-radius: 32rpx;
    padding: 0 24rpx;

    .icon-search {
      font-size: 32rpx;
      margin-right: 12rpx;
      color: #999;
    }

    .search-placeholder {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.navbar-placeholder {
  width: 100%;
  background-color: transparent;
}
</style>