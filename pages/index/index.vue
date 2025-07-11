<!--page/index/index.vue-->
<template>
  <view class="container">
    <!-- 导航栏固定区域 -->
    <view class="nav-container">
      <NavLogo show-search placeholder="搜索商品"/>
    </view>

    <view class="scroll-container">
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
            <image :src="item.img" mode="aspectFill" class="carousel-image"></image>
          </swiper-item>

        </swiper>

        <view class="more-view">
          <view class="more-text">更多功能</view>
          <view class="more-items">
            <view class="more-item">
              <view>
                <image src="/static/images/sales.png" mode="aspectFill" class="more-image"></image>
              </view>
              <text class="more-item-text">排行榜</text>
            </view>
            <view class="more-item">
              <view>
                <image src="/static/images/digital.png" mode="aspectFill" class="more-image"></image>
              </view>
              <text class="more-item-text">数码电器</text>
            </view>
            <view class="more-item">
              <view>
                <image src="/static/images/furniture.png" mode="aspectFill" class="more-image"></image>
              </view>
              <text class="more-item-text">家居好物</text>
            </view>
            <view class="more-item">
              <view>
                <image src="/static/images/ranking.png" mode="aspectFill" class="more-image" @click="goToCategory"></image>
              </view>
              <text class="more-item-text">更多商品</text>
            </view>
          </view>
        </view>

        <view class="recommend">
          <text class="recommend-text">———— 为您推荐 ————</text>
        </view>

        <view class="goods-list">
          <view class="goods-item" v-for="item in goodsList" :key="item.id" @click="goToGoodsDetail(item.id)">
            <image :src="item.img_url" mode="aspectFill" class="goods-image"></image>
            <view class="goods-info">
              <text class="title">{{ item.title }}</text>
              <view class="price-view">
                <text class="price"> {{ item.sell_price }}</text>
                <text class="original-price">{{ item.market_price }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载状态提示 -->
        <view v-if="isLoading" class="loading-more">
          <uni-load-more status="loading"></uni-load-more>
        </view>
        <view v-if="!hasMore && goodsList.length > 0" class="no-more">
          <text class="no-more-text">—— 没有更多了 ——</text>
        </view>
      </scroll-view>
    </view>


  </view>
</template>

<script setup>
import {ref} from "vue";
import carouselAPI from '/api/carousel'
import goodsAPI from '/api/goods'
import NavLogo from "@/components/NavLogo.vue";
import UniLoadMore from '@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue'
import {onLoad, onShow} from '@dcloudio/uni-app'
import {showCarBadge} from "@/utils/showCarBadge";

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

onShow(()=>{
  showCarBadge()
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

// 请求商品列表
const fetchGoodsData = async (page = 1) => {
  try {
    // 传递正确的参数格式
    const result = await goodsAPI.getGoodsList({
      page: page,
      pageSize: pageSize.value
    })

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

// 跳转到 分类
const goToCategory= () => {
  uni.switchTab({
    url: '/pages/category/category'
  })
}

// 跳转到商品详情
const goToGoodsDetail = (goodsId) => {
  uni.navigateTo({
    url: `/subpackages/detail/pages/goods-detail?value=${goodsId}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏容器（固定高度） */
.nav-container {
  width: 100%;
  z-index: 1000;
}

/* 滚动区域容器（占满剩余空间） */
.scroll-container {
  flex: 1;
  height: 0; /* 关键：允许flex分配高度 */
  overflow: hidden; /* 防止内容溢出 */
}

.scroll-view {
  height: 100%; /* 占满父容器 */
}

.swiper {
  height: px2rpx(240);
  width: 100vw;

  .swiper-item {
    display: flex;
    justify-content: center;
    align-items: center;

    .carousel-image {
      border-radius: 15px;
    }
  }
}

.more-view {
  margin-top: px2rpx(20);
  width: 100vw;
  height: px2rpx(140);

  .more-text {
    font-size: px2rpx(16);
    padding-top: px2rpx(8);
    padding-left: px2rpx(20);
    font-weight: bold;
  }

  .more-items {
    display: flex;
    justify-content: space-between;
    padding-left: px2rpx(20);
    padding-right: px2rpx(20);
    margin-top: px2rpx(10);

    .more-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .more-image {
        width: px2rpx(50);
        height: px2rpx(50);
      }

      .more-item-text {
        font-size: px2rpx(16);
      }
    }
  }
}

.recommend {
  width: 100vw;
  text-align: center;
  color: #555555;

  .recommend-text {
    display: block;
  }
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  padding: px2rpx(20);

  .goods-item {
    width: calc(50% - #{px2rpx(10)});
    margin-right: px2rpx(20);
    margin-bottom: px2rpx(20);
    background: #fff;
    border-radius: px2rpx(16);
    overflow: hidden;
    box-shadow: 0 px2rpx(4) px2rpx(16) rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;

    &:nth-child(2n) {
      margin-right: 0;
    }

    .goods-image {
      width: 100%;
      height: px2rpx(150);
      display: block;
      object-fit: cover;
    }

    .goods-info {
      padding: px2rpx(12) px2rpx(16);
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        font-size: px2rpx(14);
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: px2rpx(30);
        min-height: px2rpx(60);
        margin-bottom: px2rpx(8);
      }

      .price-view {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .price {
          color: #ff5000;
          font-weight: bold;
          margin-top: auto;
          font-size: px2rpx(16);

          &::before {
            content: "¥";
          }
        }

        .original-price {
          font-size: px2rpx(12);
          color: #999;
          text-decoration: line-through;
          margin-left: px2rpx(30);

          &::before {
            content: "¥";
          }
        }
      }
    }
  }
}

.loading-more, .no-more {
  padding: px2rpx(30);
  text-align: center;
  color: #999;
  font-size: px2rpx(16);

  .no-more-text {
    display: block;
  }
}

.goods-description {
  font-size: px2rpx(14);
  color: #666;
  line-height: px2rpx(32);
  margin-bottom: px2rpx(16);
}
</style>