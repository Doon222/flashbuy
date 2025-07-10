<template>
  <NavLogo/>
  <NavBar v-if="isEdit">修改地址</NavBar>
  <NavBar v-else>新增地址</NavBar>

  <view class="container">
    <view class="form-container">
      <!-- 姓名 -->
      <view class="form-item">
        <text class="label">姓名</text>
        <input
            v-model="formData.name"
            placeholder="收货人姓名"
            class="input"
            placeholder-class="placeholder"
        />
      </view>

      <!-- 电话 -->
      <view class="form-item">
        <text class="label">电话</text>
        <input
            v-model="formData.tel"
            placeholder="收货人手机号"
            class="input"
            placeholder-class="placeholder"
            type="number"
            maxlength="11"
        />
      </view>

      <!-- 地区选择 - 使用微信原生picker -->
      <view class="form-item">
        <text class="label">地区</text>
        <picker
            mode="region"
            :value="regionValue"
            @change="handleRegionChange"
        >
          <view class="picker-view">
            <text v-if="selectedRegion" class="region-text">{{ selectedRegion }}</text>
            <text v-else class="placeholder">选择省/市/区</text>
            <text class="icon">›</text>
          </view>
        </picker>
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <text class="label">详细地址</text>
        <input
            v-model="formData.addressDetail"
            placeholder="街道门牌、楼层房间号等信息"
            class="input"
            placeholder-class="placeholder"
        />
      </view>

      <!-- 邮政编码 -->
      <view class="form-item">
        <text class="label">邮政编码</text>
        <input
            v-model="formData.postalCode"
            placeholder="邮政编码"
            class="input"
            placeholder-class="placeholder"
            type="number"
            maxlength="6"
        />
      </view>

      <!-- 设为默认地址 -->
      <view class="form-item switch-item">
        <text class="label">设为默认收货地址</text>
        <switch
            :checked="formData.isDefault"
            @change="formData.isDefault = $event.detail.value"
            color="#04be02"
        />
      </view>

      <!-- 按钮组 -->
      <view class="button-group">
        <button class="cancel-btn" @click="cancel">取消</button>
        <button class="save-btn" @click="submitForm">保存</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import NavLogo from "@/components/NavLogo.vue";
import NavBar from "@/components/NavBar.vue";
import addressApi from '@/api/address' // 导入API方法

// 导入省市区编码数据
import areaData from '@/subpackages/address/utils/areaData'

const isEdit = ref(false)
const addressId = ref('')

// 表单数据
const formData = reactive({
  name: '',
  tel: '',
  province: '',
  city: '',
  county: '',
  areaCode: '',
  addressDetail: '',
  postalCode: '',
  isDefault: false
})

// 地区选择器数据
const regionValue = ref([]) // 用于picker组件的value绑定
const selectedRegion = ref('') // 显示选中的地区文本

onLoad((options) => {
  addressId.value = options.addressId || ''
  isEdit.value = !!addressId.value

  if (isEdit.value) {
    // 编辑模式，获取地址详情
    fetchAddressDetail(addressId.value)
  }
})

// 获取地址详情
const fetchAddressDetail = async (id) => {
  try {
    // 实际调用API获取地址详情
    const res = await addressApi.getAddressList()
    const addressList = res || []

    // 根据ID查找对应地址
    const address = addressList.find(item => item.id == id)

    if (!address) {
      uni.showToast({ title: '地址不存在', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 1500)
      return
    }

    // 填充表单
    formData.name = address.name
    formData.tel = address.tel
    formData.province = address.province
    formData.city = address.city
    formData.county = address.county
    formData.areaCode = address.areaCode
    formData.addressDetail = address.addressDetail
    formData.postalCode = address.postalCode || ''
    formData.isDefault = address.isDefault || false

    // 设置地区显示和picker值
    selectedRegion.value = `${formData.province} ${formData.city} ${formData.county}`
    regionValue.value = [formData.province, formData.city, formData.county]

  } catch (error) {
    uni.showToast({
      title: '获取地址详情失败',
      icon: 'none'
    })
    console.error('获取地址详情失败:', error)
  }
}

// 查找地区编码
const findAreaCode = (name, list) => {
  for (const [code, areaName] of Object.entries(list)) {
    if (areaName === name) {
      return code;
    }
  }
  return '';
}

// 处理地区选择
const handleRegionChange = (e) => {
  const value = e.detail.value
  regionValue.value = value

  // 更新表单数据
  formData.province = value[0]
  formData.city = value[1]
  formData.county = value[2]

  // 查找对应的地区编码
  const provinceCode = findAreaCode(value[0], areaData.province_list);
  const cityCode = findAreaCode(value[1], areaData.city_list);
  const countyCode = findAreaCode(value[2], areaData.county_list);

  // 生成符合要求的地区代码
  if (provinceCode && cityCode && countyCode) {
    formData.areaCode = `${provinceCode}-${cityCode}-${countyCode}`;
  } else {
    console.error('地区编码查找失败:', value);
    // 如果找不到编码，使用名称作为后备方案
    formData.areaCode = `${value[0]}-${value[1]}-${value[2]}`;
  }

  // 更新显示文本
  selectedRegion.value = value.join(' ')
}

// 表单验证
const validateForm = () => {
  if (!formData.name) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return false
  }

  if (!formData.tel || !/^1[3-9]\d{9}$/.test(formData.tel)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return false
  }

  if (!formData.province || !formData.city || !formData.county) {
    uni.showToast({ title: '请选择所在地区', icon: 'none' })
    return false
  }

  if (!formData.addressDetail) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return false
  }

  if (formData.postalCode && !/^\d{6}$/.test(formData.postalCode)) {
    uni.showToast({ title: '邮政编码格式不正确', icon: 'none' })
    return false
  }

  return true
}

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return

  try {
    // 构建API参数
    const params = {
      name: formData.name,
      tel: formData.tel,
      province: formData.province,
      city: formData.city,
      county: formData.county,
      areaCode: formData.areaCode,
      addressDetail: formData.addressDetail,
      postalCode: formData.postalCode,
      isDefault: formData.isDefault ? 1 : 0
    }

    if (isEdit.value) {
      // 编辑地址 - 添加地址ID
      await addressApi.updateAddress(addressId.value,params)
      uni.showToast({ title: '地址更新成功' })
    } else {
      // 新增地址
      await addressApi.addAddress(params)
      uni.showToast({ title: '地址添加成功' })
    }

    // 返回上一页
    setTimeout(() => uni.navigateBack(), 1500)

  } catch (error) {
    uni.showToast({
      title: isEdit.value ? '更新地址失败' : '添加地址失败',
      icon: 'none'
    })
    console.error('操作失败:', error)
  }
}

// 取消
const cancel = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background-color: #f7f7f7;
  height: calc(100% - 120rpx);
}

.form-container {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  display: flex;
  align-items: center;
  min-height: 100rpx;
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0;

  .label {
    width: 160rpx;
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
  }

  .input {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    height: 60rpx;
    padding: 0;
  }

  .placeholder {
    color: #999;
    font-size: 28rpx;
  }

  .picker-view {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60rpx;

    .region-text {
      font-size: 30rpx;
      color: #333;
    }

    .placeholder {
      color: #999;
      font-size: 28rpx;
    }

    .icon {
      font-size: 40rpx;
      color: #999;
    }
  }
}

.switch-item {
  justify-content: space-between;
}

.button-group {
  display: flex;
  justify-content: space-between;
  padding: 40rpx 0 30rpx;

  .cancel-btn, .save-btn {
    width: 48%;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    font-size: 34rpx;
    font-weight: 500;
  }

  .cancel-btn {
    background-color: #f7f7f7;
    color: #666;
    border: 1rpx solid #eee;
  }

  .save-btn {
    background: linear-gradient(90deg, #ff9a3c, #e88a35);
    color: white;
    border: none;
  }
}

.region-picker {
  background-color: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  padding: 20rpx 0;
  height: 700rpx;

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx 20rpx;
    border-bottom: 1rpx solid #eee;

    .cancel, .confirm {
      font-size: 32rpx;
      color: #e88a35;
    }

    .title {
      font-size: 34rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .picker-view {
    height: 600rpx;
    margin-top: 20rpx;

    .picker-item {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 32rpx;
      color: #333;
    }

    .indicator {
      height: 80rpx;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }
  }
}
</style>