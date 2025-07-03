<template>
  <view class="container">
    <NavLogo/>
    <!-- 用户信息头部 -->
    <view class="user-header">
      <image src="/static/user/default-avatar.jpg" class="avatar"/>
      <view class="user-info">
        <text class="username">请先登录/注册您的账号</text>
        <button class="login-btn">点击登录</button>
      </view>
      <image class="setting" src="/static/user/set.png"/>
    </view>

    <!-- 认证入口 -->
    <view class="auth-container">
      <view class="auth-card">
        <view class="auth-left">
          <image src="/static/user/shop-car.png" class="auth-icon" mode="aspectFit"/>
          <text class="auth-title">登录即享丰厚福利</text>
        </view>
        <view class="auth-right">
          <text class="auth-btn">立即登录 ></text>
        </view>
      </view>
    </view>
    <!-- 功能卡片 -->
    <view class="tool-card-container">
      <view class="tool-card">
        <view class="card-content">
          <view class="text-content">
            <text class="card-title">订单</text>
            <text class="card-subtitle">订单管理</text>
          </view>
          <image src="/static/user/order.png" class="card-icon" mode="aspectFit"/>
        </view>
      </view>
      <view class="tool-card">
        <view class="card-content">
          <view class="text-content">
            <text class="card-title">地址</text>
            <text class="card-subtitle">地址管理</text>
          </view>
          <image src="/static/user/address.png" class="card-icon" mode="aspectFit"/>
        </view>
      </view>
    </view>

    <view class="recommend">
      <text>———— 我的足迹 ————</text>
    </view>

    <view class="my-history">
        <view>
          暂无数据
        </view>
    </view>

  </view>
</template>

<script setup>
import NavLogo from "@/components/NavLogo.vue";
import {ref} from "vue";

const isLogin = ref(false);
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
  padding: 0 px2rpx(15) px2rpx(20);
  margin-bottom: 20rpx;
  width: 90vw;

  .setting{
    width: px2rpx(20);
    height: px2rpx(20);
    margin-left: px2rpx(18);

  }

}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 40rpx;
}

.user-info{
  display: flex;
  flex-direction: column;
  width: px2rpx(100);
  height: px2rpx(35);
}

.username {
  font-size: px2rpx(8);
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.login-btn{
  width: px2rpx(40);
  height: px2rpx(15);
  align-self: flex-start;
  margin: 0;
  font-size: px2rpx(6);
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

.recommend{
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

.my-history{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
