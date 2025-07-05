<template>
  <NavLogo/>
  <NavBar>用户注册</NavBar>
  <view class="register-container">
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

      <!-- 确认密码输入框 -->
      <view class="input-group">
        <text class="label">确认密码</text>
        <input
            class="input"
            v-model="confirmPassword"
            password
            placeholder="请再次输入密码"
            placeholder-class="placeholder"
            @blur="validateConfirmPassword"
        />
        <text class="error-message" v-if="confirmPasswordError">{{ confirmPasswordError }}</text>
      </view>

      <!-- 注册按钮 -->
      <button class="register-btn" @click="handleRegister" :disabled="!canRegister">注册</button>

      <!-- 登录链接 -->
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link-text" @click="navigateToLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, computed} from 'vue'
import NavLogo from "@/components/NavLogo.vue";
import NavBar from "@/components/NavBar.vue";
import UserApi from "@/api/user"
import {onUnload} from "@dcloudio/uni-app";

// 表单数据
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const usernameError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
let timer = null

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

// 验证确认密码
const validateConfirmPassword = () => {
  if (!confirmPassword.value.trim()) {
    confirmPasswordError.value = '请再次输入密码'
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = '两次密码不一致'
  } else {
    confirmPasswordError.value = ''
  }
}

// 计算属性：是否可以注册
const canRegister = computed(() => {
  return (
      username.value.trim().length >= 4 &&
      password.value.trim().length >= 6 &&
      confirmPassword.value === password.value &&
      !usernameError.value &&
      !passwordError.value &&
      !confirmPasswordError.value
  )
})

// 注册方法
const handleRegister = async () => {
  validateUsername()
  validatePassword()
  validateConfirmPassword()

  if (!canRegister.value) return

  // 这里替换为实际的注册API调用
  let res = await UserApi.register({
    username: username.value,
    password: password.value
  })

  if (res.status === 0) {
    uni.hideLoading()
    uni.showToast({
      title: '注册成功',
      icon: 'success'
    })

    timer = setTimeout(() => {
      uni.navigateBack()
    }, 1000)


  } else {
    // 清空用户表单
    username.value = ''
    password.value = ''
    confirmPassword.value = ''

    uni.showToast({
      title: '用户名已被占用',
      icon: 'error'
    })
  }

  // 在页面销毁的生命周期清除定时器
  onUnload(() => {
    clearTimeout(timer)
  })
}

// 跳转到登录页面
const navigateToLogin = () => {
  uni.navigateTo({
    url: '/subpackages/login/login'
  })
}
</script>

<style lang="scss" scoped>
page {
  height: 100%;
  overflow: hidden;
}

.register-container {
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
      border-color: #07c160;
      box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.2);
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

.register-btn {
  margin-top: 80rpx;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #07c160;
  color: #fff;
  font-size: 34rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(7, 193, 96, 0.3);
  }

  &[disabled] {
    background-color: #a0e5b8;
    opacity: 0.7;
    box-shadow: none;
  }
}

.login-link {
  margin-top: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;

  .link-text {
    color: #07c160;
    margin-left: 10rpx;
  }
}
</style>