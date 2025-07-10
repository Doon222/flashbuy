<template>
  <view class="container">
    <NavLogo/>
    <!-- 用户信息头部 -->
    <view class="user-header">
      <image :src="'http://47.98.187.80:5000/' + userStore.userInfo.avatar" class="avatar" v-if="userStore.userInfo.avatar"/>
      <image src="/static/images/default-avatar.jpg" class="avatar" v-else/>
      <view class="user-info">
        <text class="username" v-if="userStore.isLoggedIn">{{ userStore.userInfo.username }}</text>
        <text class="username" v-else>请先登录/注册您的账号</text>
        <text v-if="userStore.isLoggedIn">欢迎回来</text>
        <button class="login-btn" @click="goToLogin" v-else>点击登录</button>
      </view>
      <image class="setting" src="/static/images/set.png" @click="goToSetting"/>
    </view>

    <!-- 认证入口 -->
    <view class="auth-container">
      <view class="auth-card">
        <view class="auth-left" v-if="!userStore.isLoggedIn">
          <image src="/static/images/shop-car.png" class="auth-icon" mode="aspectFit"/>
          <text class="auth-title">登录即享丰厚福利</text>
        </view>
        <view class="auth-left" v-else>
          <image src="/static/images/shop-car.png" class="auth-icon" mode="aspectFit"/>
          <text class="auth-title">前往享受丰厚福利</text>
        </view>
        <view class="auth-right">
          <text class="auth-btn" @click="goToLogin" v-if="!userStore.isLoggedIn">立即登录 ></text>
          <text class="auth-btn" @click="goToEvent" v-else>立即前往 ></text>
        </view>
      </view>
    </view>
    <!-- 功能卡片 -->
    <view class="tool-card-container">
      <view class="tool-card" @click="goToOrder">
        <view class="card-content">
          <view class="text-content">
            <text class="card-title">订单</text>
            <text class="card-subtitle">订单管理</text>
          </view>
          <image src="/static/images/order.png" class="card-icon" mode="aspectFit"/>
        </view>
      </view>
      <view class="tool-card" @click="goToAddress">
        <view class="card-content">
          <view class="text-content">
            <text class="card-title">地址</text>
            <text class="card-subtitle">地址管理</text>
          </view>
          <image src="/static/images/address.png" class="card-icon" mode="aspectFit"/>
        </view>
      </view>
    </view>

    <view class="history-section">
      <view class="section-title">———— 我的足迹 ————</view>

      <view class="history-box" v-if="userStore.isLoggedIn">
        <view v-if="historyList.length > 0">
          <view
              v-for="(item) in historyList"
              :key="item.id"
              class="history-item"
              @click="gotoDetail(item.goods_id)"
          >
            <image class="goods-image" :src="item.img_url" mode="aspectFill"/>
            <view class="goods-info">
              <text class="goods-title">{{ item.title }}</text>
              <view class="goods-meta">
                <text class="price">¥{{ item.sell_price }}</text>
                <text class="sales">{{ item.buy }}人购买</text>
              </view>
            </view>
            <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
          </view>
        </view>
        <view v-else class="empty-history">
          <text>暂无浏览记录</text>
        </view>
      </view>

      <view v-else class="login-tip">
        <text>请先登录查看浏览记录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {useUserStore} from "@/stores/modules/user.store";
import HistoryApi from "@/api/history";
import NavLogo from "@/components/NavLogo.vue";
import {ref} from "vue";
import {onLoad, onShow} from "@dcloudio/uni-app";

const userStore = useUserStore();

const historyList = ref([])

onLoad(() => {
  if (userStore.isLoggedIn) {
    initData()
  }
})

onShow(() => {
  if (userStore.isLoggedIn) {
    initData()
  }
})

const initData = async () => {
  try {
    const res = await HistoryApi.getHistory()
    historyList.value = res || []
  } catch (error) {
    uni.showToast({
      title: '加载历史记录失败',
      icon: 'none'
    })
  }
}

const gotoDetail = (goodsId) => {
  uni.navigateTo({
    url: `/subpackages/detail/goods-detail?value=${goodsId}`
  })
}

const goToLogin = () => {
  uni.navigateTo({
    url: '/subpackages/login/login'
  })
}

const goToOrder = () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({
      title: '请先登录在使用订单功能',
      icon: 'none'
    })
    return
  }
  uni.navigateTo({
    url: '/subpackages/order/order'
  })
}

const goToAddress = () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({
      title: '请先登录再使用地址功能',
      icon: 'none'
    })
    return
  }
  uni.navigateTo({
    url: '/subpackages/address/address'
  })
}

const goToSetting = () => {
  uni.navigateTo({
    url: '/subpackages/setting/setting'
  })
}

const goToEvent = () => {
  uni.showToast({
    title: '功能正在开发中',
    icon: 'none'
  })
}
</script>


<style scoped lang="scss">

.container {
  background: #fff;
  min-height: 100vh;
  padding-bottom: px2rpx(20);
  display: flex;
  flex-direction: column;
}

/* 用户头部信息 */
.user-header {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  padding: 0 px2rpx(15) px2rpx(10);
  width: 90vw;

  .setting {
    width: px2rpx(15);
    height: px2rpx(15);
    margin-left: 40rpx;

  }

}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 40rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: px2rpx(100);
  height: px2rpx(35);
}

.username {
  font-size: px2rpx(8);
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.login-btn {
  width: px2rpx(40);
  height: px2rpx(15);
  align-self: flex-start;
  font-size: px2rpx(6);
  margin: px2rpx(1) 0 0;
}


/* 认证卡片 */
.auth-container {
  display: flex;
  justify-content: center;
}

.auth-card {
  background: linear-gradient(135deg, #7d4f9c, #74bce7);
  padding: 28rpx 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12rpx 12rpx 0 0; /* 添加圆角 */
  width: 80%;
}

.auth-left {
  display: flex;
  align-items: center;
}

.auth-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 20rpx;
}

.auth-title {
  font-size: 30rpx;
  color: #f0dbbe; /* 金色文字 */
  font-weight: 500;
}

.auth-right {
  display: flex;
  align-items: center;
}

.auth-btn {
  font-size: 24rpx;
  background-color: #ccd4e4;
  border-radius: 30rpx;
  padding: 12rpx 24rpx;
}

/* 功能卡片容器 */
.tool-card-container {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: space-between; /* 两端对齐 */
  padding: 0 30rpx;
  margin-bottom: 30rpx;
}

/* 卡片主体 */
.tool-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  width: 40%;
  margin-bottom: 20rpx;
}


/* 卡片内容布局 */
.card-content {
  display: flex;
  align-items: center;
  width: 100%;
}

/* 文字内容 */
.text-content {
  flex: 1;
}

.recommend {
  width: 100vw;
  text-align: center;
  color: #555555;
}

/* 卡片标题 */
.card-title {
  font-size: 34rpx;
  font-weight: 550;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

/* 卡片副标题 */
.card-subtitle {
  font-size: 26rpx;
  color: #999999;
  display: block;
}

/* 卡片图标 */
.card-icon {
  width: 80rpx;
  height: 80rpx;
  margin-left: 20rpx;
}

/* 功能菜单 */
.menu-group {
  background: #fff;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 20rpx;
}

.my-history {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.history-section {
  margin-top: 40rpx;
  padding: 0 30rpx;
}

.section-title {
  text-align: center;
  color: #555;
  font-size: 28rpx;
  margin-bottom: 30rpx;
}

.history-box {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  padding: 0 20rpx;
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.goods-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.goods-info {
  flex: 1;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-title {
  font-size: 28rpx;
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.goods-meta {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

.price {
  font-size: 32rpx;
  color: #f40;
  font-weight: bold;
  margin-right: 20rpx;
}

.sales {
  font-size: 24rpx;
  color: #999;
}

.empty-history,
.login-tip {
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 28rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  margin-top: 60rpx;
}
</style>
