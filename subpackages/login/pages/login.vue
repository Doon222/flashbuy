<template>
  <NavLogo/>
  <NavBar>用户登录</NavBar>
  <view class="login-container">
    <!-- 表单区域 -->
    <view class="form-container">
      <!-- 用户名输入框 -->
      <view class="input-group">
        <text class="label">用户名</text>
        <input
            class="input"
            v-model="username"
            placeholder="请输入用户名"
            placeholder-class="placeholder"
            @blur="validateUsername"
        />
        <text class="error-message" v-if="usernameError">{{ usernameError }}</text>
      </view>

      <!-- 密码输入框 -->
      <view class="input-group">
        <text class="label">密码</text>
        <input
            class="input"
            v-model="password"
            password
            placeholder="请输入密码"
            placeholder-class="placeholder"
            @blur="validatePassword"
        />
        <text class="error-message" v-if="passwordError">{{ passwordError }}</text>
      </view>

      <!-- 登录按钮 -->
      <button class="login-btn" @click="handleLogin" :disabled="!canLogin">登录</button>

      <!-- 注册链接 -->
      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link-text" @click="navigateToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, computed} from 'vue'
import UserApi from "@/api/user";
import {useUserStore} from "@/stores/modules/user.store";
import NavLogo from "@/components/NavLogo.vue";
import NavBar from "@/components/NavBar.vue";


// 表单数据
const username = ref('')
const password = ref('')
const usernameError = ref('')
const passwordError = ref('')

const userStore = useUserStore()

// 验证用户名
const validateUsername = () => {
  if (!username.value.trim()) {
    usernameError.value = '用户名不能为空'
  } else if (username.value.length < 4) {
    usernameError.value = '用户名至少4个字符'
  } else {
    usernameError.value = ''
  }
}

// 验证密码
const validatePassword = () => {
  if (!password.value.trim()) {
    passwordError.value = '密码不能为空'
  } else if (password.value.length < 6) {
    passwordError.value = '密码至少6个字符'
  } else {
    passwordError.value = ''
  }
}

// 计算属性：是否可以登录
const canLogin = computed(() => {
  return username.value.trim().length >= 4 &&
      password.value.trim().length >= 6 &&
      !usernameError.value &&
      !passwordError.value
})

// 登录方法
const handleLogin = async () => {
  validateUsername()
  validatePassword()

  if (!canLogin.value) return

  uni.showLoading({
    title: '登录中...'
  })


  let res = await UserApi.login({
    username: username.value,
    password: password.value
  })

  if (res.status === 0) {
    uni.hideLoading()
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    // 将用户登录信息存入本地
    userStore.login(res)

    uni.navigateBack()
    // 清除用户输入信息
    username.value = ''
    password.value = ''
  }else {
    // 登录失败
    uni.hideLoading()
    uni.showToast({
      title: res.message,
      icon: 'error'
    })
    username.value = ''
    password.value = ''
  }
}

// 跳转到注册页面
const navigateToRegister = () => {
  uni.navigateTo({
    url: '/subpackages/register/register'
  })
}

</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
}

.login-container {
  padding: 60rpx 80rpx;
  height: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
}

.form-container {
  flex: 1;
}

.input-group {
  margin-bottom: 40rpx;

  .label {
    display: block;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    color: #333;
  }

  .input {
    height: 90rpx;
    padding: 0 30rpx;
    background-color: #fff;
    border-radius: 12rpx;
    font-size: 30rpx;
    border: 1rpx solid #eee;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &:focus {
      border-color: #007aff;
      box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
    }
  }

  .placeholder {
    color: #ccc;
    font-size: 28rpx;
  }

  .error-message {
    display: block;
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #ff4d4f;
    height: 30rpx;
  }
}

.login-btn {
  margin-top: 80rpx;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 34rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.3);
  }

  &[disabled] {
    background-color: #a0cfff;
    opacity: 0.7;
    box-shadow: none;
  }
}

.register-link {
  margin-top: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;

  .link-text {
    color: #007aff;
    margin-left: 10rpx;
  }
}
</style>