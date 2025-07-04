<template>
  <view class="searchresult-container">
    <NavLogo />
    <!-- 自定义顶部导航栏 -->
    <view class="header">
      <text class="header-text">搜索结果</text>
      <!-- 排序选择器 - 优化样式 -->
      <view class="sort-selector" v-if="goods.length > 0">
        <picker :value="sortIndex" :range="sortOptions" range-key="text" @change="changeSort">
          <view class="picker-content">
            <text class="sort-text">{{ sortOptions[sortIndex].text }} ▼</text>
            <uni-icons type="arrowdown" size="16" color="#666"></uni-icons>
          </view>
        </picker>
      </view>
    </view>
    <!-- 商品列表 -->
    <scroll-view class="goods-list" scroll-y>
      <view v-if="goods.length === 0" class="empty-container">
        <image src="/static/images/empty.png" class="empty-image"/>
        <text class="empty-text">暂无搜索结果</text>
        <text class="empty-tip">换个关键词试试吧</text>
      </view>

      <view v-else class="goods-container">
        <view class="goods-item" v-for="item in goods" :key="item.id">
          <image class="goods-image" :src="item.img_url" mode="aspectFill"/>
          <view class="goods-info">
            <view class="goods-title">{{ item.title }}</view>
            <view class="price-section">
              <text class="current-price">¥{{ item.sell_price }}</text>
              <text class="original-price">¥{{ item.market_price }}</text>
            </view>
            <view class="stats-section">
              <view class="hot-tag">热卖中</view>
              <text class="stock">剩余{{ item.stock_quantity }}件</text>
            </view>
          </view>
        </view>
      </view>
      <view class="no-more">
        <text class="no-more-text">———— 没有更多了 ————</text>
      </view>
    </scroll-view>
    <BackBtn/>
  </view>
</template>

<script setup>
import {ref} from 'vue';
import GoodsApi from '@/api/goods';
import {onLoad} from "@dcloudio/uni-app";
import BackBtn from "@/components/BackBtn.vue";
import NavLogo from "@/components/NavLogo.vue";

// 响应式数据
const value = ref('');
const goods = ref([]);
const sortIndex = ref(0); // 当前选中的排序索引
const sortOptions = ref([
  {text: '销量', value: 'buy'},
  {text: '好评数量', value: 'likes'},
  {text: '价格', value: 'sell_price'},
]);

// 搜索商品
const search = async () => {
  const query = value.value.trim()

  if (!query) {
    uni.showToast({
      title: '请输入搜索关键词',
      icon: 'none'
    });
    return;
  }

  try {
    const res = await GoodsApi.searchGoods({
      value: query,
      sort: sortOptions.value[sortIndex.value].value,
      page: 1,
      pagesize: 10
    });
    goods.value = res;
  } catch (error) {
    console.error('搜索失败:', error);
    uni.showToast({
      title: '搜索失败，请重试',
      icon: 'none'
    });
    goods.value = [];
  }
};

// 切换排序方式
const changeSort = (e) => {
  console.log('sortIndex=',e.detail.value)
  sortIndex.value = e.detail.value;
  search();
};

// 初始化
onLoad((options) => {
  if (options.value) {
    value.value = options.value
    console.log('value=',value.value)
    search()
  }
});
</script>

<style lang="scss" scoped>
.searchresult-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #FFFFFF;

  /* 顶部标题栏样式 */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 60rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .header-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      line-height: 1.5;
    }
  }

  /* 排序选择器样式 */
  .sort-selector {
    padding: 16rpx 30rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;
    display: flex;
    justify-content: flex-end;

    .picker-content {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      background-color: #f7f7f7;
      border-radius: 30rpx;

      .sort-text {
        font-size: 26rpx;
        color: #666;
        padding-left: 8rpx;
        margin-right: 8rpx;
      }

      &:active {
        background-color: #eee;
      }
    }
  }


  .goods-list {
    flex: 1;

    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 150rpx;

      .empty-image {
        width: 300rpx;
        height: 300rpx;
        margin-bottom: 30rpx;
      }

      .empty-text {
        font-size: 32rpx;
        color: #999;
        margin-bottom: 16rpx;
      }

      .empty-tip {
        font-size: 26rpx;
        color: #ccc;
      }
    }

    .goods-container {
      padding: 20rpx;

      .goods-item {
        display: flex;
        padding: 20rpx;
        margin-bottom: 20rpx;
        background-color: #fff;
        border-radius: 12rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

        .goods-image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 8rpx;
          background-color: #f8f9fa;
          margin-right: 20rpx;
        }

        .goods-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .goods-title {
            font-size: 28rpx;
            color: #333;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .price-section {
            display: flex;
            align-items: center;
            margin-top: 10rpx;

            .current-price {
              font-size: 32rpx;
              font-weight: bold;
              color: #e74c3c;
              margin-right: 20rpx;
            }

            .original-price {
              font-size: 24rpx;
              color: #999;
              text-decoration: line-through;
            }
          }

          .stats-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20rpx;

            .hot-tag {
              font-size: 22rpx;
              color: #e74c3c;
              padding: 4rpx 12rpx;
              background-color: #ffece8;
              border-radius: 6rpx;
            }

            .stock {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }

    .no-more{
      width: 100vw;
      height: px2rpx(20);
      text-align: center;
      color: #555555;
    }
  }
}
</style>