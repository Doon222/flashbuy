<template>
  <NavLogo/>
  <NavBar>修改密码</NavBar>
  <view class="change-password-container">
    <view class="form-container">
      <!-- 原密码 -->
      <view class="input-group">
        <text class="label">原密码</text>
        <input
            class="input"
            v-model="oldPassword"
            password
            placeholder="请输入原密码"
            placeholder-class="placeholder"
        />
        <text class="error-message" v-if="oldPasswordError">{{ oldPasswordError }}</text>
      </view>

      <!-- 新密码 -->
      <view class="input-group">
        <text class="label">新密码</text>
        <input
            class="input"
            v-model="newPassword"
            password
            placeholder="请输入新密码(6-20位)"
            placeholder-class="placeholder"
        />
        <text class="error-message" v-if="newPasswordError">{{ newPasswordError }}</text>
      </view>

      <!-- 确认新密码 -->
      <view class="input-group">
        <text class="label">确认新密码</text>
        <input
            class="input"
            v-model="confirmPassword"
            password
            placeholder="请再次输入新密码"
            placeholder-class="placeholder"
        />
        <text class="error-message" v-if="confirmPasswordError">{{ confirmPasswordError }}</text>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleSubmit" :disabled="!canSubmit">确认修改</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavLogo from "@/components/NavLogo.vue"
import NavBar from "@/components/NavBar.vue"

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const oldPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')

// 验证原密码
const validateOldPassword = () => {
  if (!oldPassword.value.trim()) {
    oldPasswordError.value = '请输入原密码'
    return false
  }
  oldPasswordError.value = ''
  return true
}

// 验证新密码
const validateNewPassword = () => {
  if (!newPassword.value.trim()) {
    newPasswordError.value = '请输入新密码'
    return false
  }
  if (newPassword.value.length < 6 || newPassword.value.length > 20) {
    newPasswordError.value = '密码长度6-20位'
    return false
  }
  newPasswordError.value = ''
  return true
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!confirmPassword.value.trim()) {
    confirmPasswordError.value = '请再次输入密码'
    return false
  }
  if (confirmPassword.value !== newPassword.value) {
    confirmPasswordError.value = '两次密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// 是否可以提交
const canSubmit = computed(() => {
  return (
      oldPassword.value.trim() &&
      newPassword.value.trim() &&
      confirmPassword.value.trim() &&
      !oldPasswordError.value &&
      !newPasswordError.value &&
      !confirmPasswordError.value
  )
})

// 提交修改
const handleSubmit = async () => {
  const isValid =
      validateOldPassword() &
      validateNewPassword() &
      validateConfirmPassword()

  if (!isValid) return

  uni.showLoading({
    title: '修改中...'
  })

  try {
    // 这里替换为实际的修改密码API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    uni.hideLoading()
    uni.showToast({
      title: '密码修改成功',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '密码修改失败',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss" scoped>
.change-password-container {
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

.submit-btn {
  margin-top: 80rpx;
  height: 90rpx;
  line-height: 90rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 34rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);

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
</style>