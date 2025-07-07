<template>
  <NavLogo/>
  <NavBar>系统设置</NavBar>
  <view class="settings-container">
    <!-- 设置项列表 -->
    <view class="settings-list">
      <!-- 修改密码 -->
      <view class="setting-item" @click="navigateToChangePassword">
        <view class="item-left">
          <image src="/static/images/lock.png" class="item-icon"></image>
          <text class="item-title">修改密码</text>
        </view>
        <image src="/static/images/arrow.png" class="item-arrow"></image>
      </view>

      <!-- 版本信息 -->
      <view class="setting-item" @click="showVersionInfo">
        <view class="item-left">
          <image src="/static/images/info.png" class="item-icon"></image>
          <text class="item-title">版本信息</text>
        </view>
        <text class="item-value">v{{ version }}</text>
      </view>

      <!-- 彩蛋功能 -->
      <view class="setting-item" @click="handleEasterEgg">
        <view class="item-left">
          <image src="/static/images/gift.png" class="item-icon"></image>
          <text class="item-title">彩蛋功能</text>
        </view>
        <image src="/static/images/arrow.png" class="item-arrow"></image>
      </view>

      <!-- 新增的无意义小功能 -->
      <view class="setting-item" @click="showRandomFact">
        <view class="item-left">
          <image src="/static/images/fun.png" class="item-icon"></image>
          <text class="item-title">冷知识</text>
        </view>
        <image src="/static/images/arrow.png" class="item-arrow"></image>
      </view>

      <view class="setting-item" @click="changeThemeColor">
        <view class="item-left">
          <image src="/static/images/theme.png" class="item-icon"></image>
          <text class="item-title">切换主题色</text>
        </view>
        <view class="theme-preview" :style="{backgroundColor: themeColor}"></view>
      </view>

      <view class="setting-item" @click="showDeveloperInfo">
        <view class="item-left">
          <image src="/static/images/dev.png" class="item-icon"></image>
          <text class="item-title">开发者信息</text>
        </view>
        <image src="/static/images/arrow.png" class="item-arrow"></image>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn" @click="showLogoutConfirm">
      <text>退出登录</text>
    </view>

    <!-- 彩蛋弹窗 -->
    <uni-popup ref="easterEggPopup" type="center" :mask-click="true">
      <view class="easter-egg-popup">
        <image src="/static/images/other/working.jpg" class="easter-egg-image" mode="aspectFit"></image>
        <text class="easter-egg-text">恭喜发现彩蛋！🎉</text>
        <button class="easter-egg-btn" @click="closeEasterEgg">确定</button>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import {useUserStore} from "@/stores/modules/user.store";
import NavLogo from "@/components/NavLogo.vue"
import NavBar from "@/components/NavBar.vue"
import {onUnload} from "@dcloudio/uni-app";

// 版本号
const version = ref('1.2.0')
// 彩蛋点击次数
const easterEggClicks = ref(0)
// 弹窗引用
const easterEggPopup = ref(null)
// 主题色
const themeColor = ref('#007aff')
// 冷知识列表
const funFacts = ref([
  "按住Ctrl键可以多选文件",
  "键盘上的F和J键有凸起是为了盲打定位",
  "微信启动页的地球照片是NASA提供的",
  "程序员平均每天喝3.7杯咖啡",
  "第一台电脑重达27吨"
])

const userStore = useUserStore()

let timer = null

// 跳转到修改密码页面
const navigateToChangePassword = () => {
  // 判断是否登录
  if (!userStore.isLoggedIn) {
    uni.showToast({
      title: '您还没有登录',
      icon: 'none'
    })
    return
  }
  uni.navigateTo({
    url: '/subpackages/setting/pwd-setting'
  })
}

// 显示版本信息
const showVersionInfo = () => {
  uni.showModal({
    title: '版本信息',
    content: `当前版本: v${version.value}\n更新时间: 2023-11-15\n©2023`,
    showCancel: false,
    confirmText: '我知道了'
  })
}

// 显示随机冷知识
const showRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * funFacts.value.length)
  uni.showToast({
    title: funFacts.value[randomIndex],
    icon: 'none',
    duration: 3000
  })
}

// 切换主题色
const changeThemeColor = () => {
  const colors = ['#007aff', '#07c160', '#ff9500', '#ff4d4f', '#5856d6']
  const currentIndex = colors.indexOf(themeColor.value)
  const nextIndex = (currentIndex + 1) % colors.length
  themeColor.value = colors[nextIndex]
  uni.showToast({
    title: '主题色已切换',
    icon: 'none'
  })
}

// 显示开发者信息
const showDeveloperInfo = () => {
  uni.showModal({
    title: '开发者信息',
    content: '开发团队: 黑幕小组' +
        '\n联系方式: blackSrceen@qq.com',
    showCancel: false,
    confirmText: '知道了'
  })
}

// 处理彩蛋功能
const handleEasterEgg = () => {
  easterEggClicks.value++

  // 点击3次触发彩蛋
  if (easterEggClicks.value >= 3) {
    easterEggPopup.value.open()
    easterEggClicks.value = 0
  }
}

// 关闭彩蛋弹窗
const closeEasterEgg = () => {
  easterEggPopup.value.close()
}

// 显示退出登录确认框
const showLogoutConfirm = () => {
  if (userStore.isLoggedIn) {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
        }
      }
    })
  } else {
    uni.showToast({
      title: '您还没有登录',
      icon: 'none'
    })
  }

// 退出登录
  const logout = () => {
    uni.showLoading({
      title: '正在退出...'
    })

    // 退出登录
    uni.hideLoading()
    // 清除登录状态
    userStore.logout()

    uni.showToast({
      title: '退出登录成功',
      icon: 'success'
    })

    // 跳转到登录页
    uni.redirectTo({
      url: '/subpackages/login/login'
    })
  }
}

onUnload(() => {
  clearTimeout(timer)
})

</script>

<style lang="scss" scoped>
page {
  background-color: #f5f7fa;
  padding-bottom: 120rpx; // 为底部按钮留出空间
}

.settings-container {
  padding: 30rpx;
  position: relative;
  height: 100%;
}

.settings-list {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:active {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }

  .item-left {
    display: flex;
    align-items: center;
  }

  .item-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
  }

  .item-title {
    font-size: 30rpx;
    color: #333;
  }

  .item-value {
    font-size: 28rpx;
    color: #999;
  }

  .item-arrow {
    width: 24rpx;
    height: 24rpx;
  }

  .theme-preview {
    width: 40rpx;
    height: 40rpx;
    border-radius: 8rpx;
    border: 1rpx solid #eee;
  }
}

.logout-btn {
  position: fixed;
  bottom: 30rpx;
  left: 30rpx;
  right: 30rpx;
  height: 90rpx;
  background-color: #ff4d4f;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 34rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.3);

  &:active {
    background-color: #ff7875;
    transform: scale(0.98);
  }
}

.easter-egg-popup {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  width: 80vw; /* 调整为视口宽度的80% */
  max-width: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1001;

  .easter-egg-image {
    width: 100%; /* 图片宽度填充容器 */
    height: 400rpx; /* 固定高度 */
    margin-bottom: 30rpx;
    border-radius: 12rpx;
    object-fit: cover; /* 保持图片比例 */
  }

  .easter-egg-text {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 40rpx;
    text-align: center;
    font-weight: bold;
  }

  .easter-egg-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #007aff;
    color: #fff;
    font-size: 30rpx;
    border-radius: 12rpx;
    margin-top: 20rpx;

    &:active {
      opacity: 0.8;
    }
  }
}

/* 全屏遮罩层样式 */
::v-deep .uni-popup__wrapper {
  background-color: rgba(0, 0, 0, 0.7) !important; /* 半透明黑色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .uni-popup {
  z-index: 9999 !important;
}

</style>