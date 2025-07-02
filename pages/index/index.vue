<!--page/index/index.vue-->
<template>
  <view class="container">
    <!-- 使用导航栏组件 -->
    <NavLogo show-search placeholder="搜索商品"/>

    <scroll-view refresher-enabled
                 @refresherrefresh="onRefresh"
                 @scrolltolower="onScrollLower"
                 :refresher-triggered="isRefreshing"
                 class="scroll-view"
                 scroll-y>

      <swiper
          class="swiper"
          :indicator-dots="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          circular>

        <swiper-item v-for="item in carouselList" :key="item.id" class="swiper-item">
          <image :src="item.img" mode="aspectFill"></image>
        </swiper-item>

      </swiper>

      <view class="more-view">
        <view class="more-text">更多功能</view>
        <view class="more-items">
          <view class="more-item">
            <view>
              <image src="/static/home/sales.png" mode="aspectFill"></image>
            </view>

            <text>排行榜</text>
          </view>
          <view class="more-item">
            <view>
              <image src="/static/home/digital.png" mode="aspectFill"></image>
            </view>
            <text>数码电器</text>
          </view>
          <view class="more-item">
            <view>
              <image src="/static/home/furniture.png" mode="aspectFill"></image>
            </view>
            <text>家居好物</text>
          </view>
          <view class="more-item">
            <view>
              <image src="/static/home/ranking.png" mode="aspectFill"></image>
            </view>
            <text>更多商品</text>
          </view>
        </view>
      </view>

      <view class="goods-list">
        <view class="goods-item" v-for="item in goodsList" :key="item.id">
          <image :src="item.img_url" mode="aspectFill"></image>
          <view class="goods-info">
            <text class="title">{{ item.title }}</text>
            <text class="price">{{ item.sell_price }}</text>
          </view>
        </view>
      </view>

      <!-- 加载状态提示 -->
      <view v-if="isLoading" class="loading-more">
        <uni-load-more status="loading"></uni-load-more>
      </view>
      <view v-if="!hasMore && goodsList.length > 0" class="no-more">
        <text>—— 已加载全部数据 ——</text>
      </view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref } from "vue";
import carouselAPI from '/api/carousel'
import goodsAPI from '/api/goods'
import NavLogo from "@/components/NavLogo.vue";
import UniLoadMore from '@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue'
import { onLoad } from '@dcloudio/uni-app'

const carouselList = ref([])
const goodsList = ref([])

const currentPage = ref(1)
const pageSize = ref(8) // 每页8条数据
const isRefreshing = ref(false)
const isLoading = ref(false)
const hasMore = ref(true)

onLoad(() => {
  fetchCarouselData()
  fetchGoodsData(1) // 初始加载第一页
})

// 下拉刷新
const onRefresh = async () => {
  if (isRefreshing.value) return

  isRefreshing.value = true
  try {
    currentPage.value = 1
    await fetchGoodsData(currentPage.value)
  } finally {
    isRefreshing.value = false
  }
}

// 上拉加载
const onScrollLower = async () => {
  // 增加检查条件防止重复请求
  if (isLoading.value || !hasMore.value || isRefreshing.value) return

  isLoading.value = true
  try {
    const nextPage = currentPage.value + 1
    await fetchGoodsData(nextPage)
  } finally {
    isLoading.value = false
  }
}

// 请求轮播图
const fetchCarouselData = async () => {
  try {
    const result = await carouselAPI.getCarousel()
    if (result?.status === 0 && Array.isArray(result.message)) {
      carouselList.value = result.message
    }
  } catch (error) {
    console.error('获取轮播图失败:', error)
  }
}

// 修复：正确传递分页参数
const fetchGoodsData = async (page = 1) => {
  try {
    // 修复：传递正确的参数格式
    const result = await goodsAPI.getGoodsList({
      page: page,
      pageSize: pageSize.value
    })
    console.log('API返回数据:', result)

    // 验证数据结构
    if (result?.status !== 0 || !Array.isArray(result.message)) {
      throw new Error('接口返回数据结构异常')
    }

    const newData = result.message

    // 更新分页状态
    if (page === 1) {
      goodsList.value = newData
    } else {
      goodsList.value = [...goodsList.value, ...newData]
    }

    // 更新当前页码
    currentPage.value = page

    // 判断是否还有更多数据
    hasMore.value = newData.length >= pageSize.value

  } catch (error) {
    console.error('获取商品列表失败:', error)
    // 失败时回退页码
    if (page > 1) currentPage.value = page - 1
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  height: 100%;
}

.swiper {
  height: px2rpx(120);
  width: 100vw;

  .swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      border-radius: 15px;
    }
  }
}

.more-view {
  margin-top: px2rpx(10);
  width: 100vw;
  height: px2rpx(70);

  .more-text {
    font-size: px2rpx(8);
    padding-top: px2rpx(4);
    padding-left: px2rpx(10);
    font-weight: bold;
  }

  .more-items {
    display: flex;
    justify-content: space-between;
    padding-left: px2rpx(10);
    padding-right: px2rpx(10);
    margin-top: px2rpx(5);

    .more-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: px2rpx(25);
        height: px2rpx(25);
      }

      text {
        font-size: px2rpx(8);
      }
    }
  }
}

.goods-list {
  display: flex; /* 改为弹性布局 */
  flex-wrap: wrap; /* 允许换行 */
  padding: px2rpx(10);

  .goods-item {
    width: calc(50% - #{px2rpx(5)}); /* 两列布局，减去间隙 */
    margin-right: px2rpx(10); /* 右边距 */
    margin-bottom: px2rpx(10); /* 下边距 */
    background: #fff;
    border-radius: px2rpx(8);
    overflow: hidden;
    box-shadow: 0 px2rpx(2) px2rpx(8) rgba(0, 0, 0, 0.06);
    display: flex; /* 内部也使用弹性布局 */
    flex-direction: column; /* 垂直排列 */

    /* 每隔两个清除右边距 */
    &:nth-child(2n) {
      margin-right: 0;
    }

    /* 图片区域 */
    image {
      width: 100%;
      height: px2rpx(100); /* 缩小图片高度 */
      display: block;
      object-fit: cover; /* 保持比例填充 */
    }

    .goods-info {
      padding: px2rpx(6) px2rpx(8);
      flex: 1; /* 占据剩余空间 */
      display: flex;
      flex-direction: column;

      .title {
        font-size: px2rpx(8); /* 缩小字体 */
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* 两行文字 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: px2rpx(15);
        min-height: px2rpx(30); /* 保持高度一致 */
        margin-bottom: px2rpx(4);
      }

      .price {
        font-size: px2rpx(14); /* 缩小字体 */
        color: #ff5000;
        font-weight: bold;
        margin-top: auto; /* 价格到底部 */

        &::before {
          content: "¥";
          font-size: px2rpx(12);
        }
      }
    }
  }
}


.loading-more, .no-more {
  padding: px2rpx(15);
  text-align: center;
  color: #999;
  font-size: px2rpx(8);
}
</style>