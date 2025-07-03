<template>
  <view class="container">
    <NavLogo :show-search="false"/>

    <!-- 搜索框区域 -->
    <view class="search-container">
      <view class="search-box">
        <view class="search-icon">🔍</view>
        <input
            type="text"
            class="search-input"
            v-model="searchQuery"
            placeholder="搜索商品"
            @confirm="search"
            confirm-type="search"
            placeholder-class="placeholder-style"
        />
        <text class="search-btn" @click="search">搜索</text>
      </view>
    </view>

    <!-- 历史搜索区域 -->
    <view class="history-section">
      <view class="section-header">
        <text class="section-title">搜索历史</text>
        <view class="clear-history" @click="clearHistory">
          <text>清除记录</text>
        </view>
      </view>

      <view class="history-tags">
        <view v-if="searchStore.history.length === 0" class="empty-state">
          <text>暂无搜索历史</text>
        </view>

        <view
            v-for="(item, index) in searchStore.history"
            :key="index"
            class="history-tag"
            @click="search(item)"
        >
          <text class="text">{{ item.toString() }}</text>
          <text class="remove" @click.stop="removeHistory(index)">×</text>
        </view>
      </view>

    </view>
    <BackBtn/>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import NavLogo from "@/components/NavLogo.vue";
import BackBtn from "@/components/BackBtn.vue";
// 导入 Pinia store
import {useSearchHistoryStore} from '/stores/modules/search.store'

const searchQuery = ref('')
const searchStore = useSearchHistoryStore()


// 搜索功能
const search = () => {

  // 添加到历史记录 - 使用 Pinia action
  searchStore.addHistory(searchQuery.value)
  console.log(searchStore.history)

  // 清空搜索框
  searchQuery.value = ''

  // 执行搜索操作
  // uni.navigateTo({
  //   url: `/pages/search/result?keyword=${encodeURIComponent(searchTerm)}`
  // })
}

// 删除单条历史记录
const removeHistory = (index) => {
  // 直接修改 store 的状态
  searchStore.history.splice(index, 1)
}

// 清除所有历史记录
const clearHistory = () => {
  if (searchStore.history.length === 0) return

  uni.showModal({
    title: '提示',
    content: '确定要清除所有搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        // 使用 Pinia action 清除历史记录
        searchStore.clearHistory()
      }
    }
  })
}
</script>

<style lang="scss">
/* 保持原有样式不变 */
.container {
  padding: 0;
  background-color: #FFFFFF;
  min-height: 100vh;
}

.search-container {
  padding: px2rpx(10) px2rpx(15);
  background-color: #fff;
  margin-bottom: px2rpx(5);
}

.search-box {
  display: flex;
  align-items: center;
  height: px2rpx(20);
  background-color: #f5f5f5;
  border-radius: px2rpx(20);
  padding: 0 px2rpx(15);
  box-shadow: 0 px2rpx(1) px2rpx(4) rgba(0, 0, 0, 0.05);
}

.search-icon {
  font-size: px2rpx(8);
  color: #999;
  margin-right: px2rpx(10);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: px2rpx(15);
  color: #333;
  padding: 0;
  background: transparent;
}

.placeholder-style {
  color: #999;
  font-size: px2rpx(8);
}

.search-btn {
  background: none;
  border: none;
  color: #007aff;
  font-size: px2rpx(8);
  font-weight: 500;
  padding-left: px2rpx(10);
  flex-shrink: 0;
}

.history-section {
  padding: 0 px2rpx(15);
  background-color: #fff;
  border-radius: px2rpx(10) px2rpx(10) 0 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: px2rpx(15) 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: px2rpx(8);
  font-weight: 600;
  color: #333;
}

.clear-history {
  font-size: px2rpx(7);
  display: flex;
  align-items: center;
  color: red;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: px2rpx(5);
  padding: px2rpx(15) 0;
}

.history-tag {
  background: #f7f7f7;
  border-radius: px2rpx(20);
  padding: 16rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  display: flex;
  align-items: center;
  gap: 16rpx;
  transition: all 0.2s;

  &:active {
    background-color: #e0e0e0;
    transform: scale(0.98);
  }
}

.history-tag .remove {
  color: #999;
  font-size: 36rpx;
  margin-left: px2rpx(5);
  transition: color 0.2s;

  &:active {
    color: #ff0000;
    transform: scale(1.2);
  }
}

.empty-state {
  text-align: center;
  padding: px2rpx(40) 0;
  color: #999;
  width: 100%;
  font-size: 28rpx;
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>