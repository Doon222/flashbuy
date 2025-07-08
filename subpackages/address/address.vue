<template>
  <NavLogo/>
  <NavBar>收货地址</NavBar>
  <view class="container">
    <!-- 地址列表 -->
    <view v-if="addressList.length > 0" class="address-list">
      <view
          v-for="item in addressList"
          :key="item.id"
          class="address-item"
          :class="{ 'default-address': item.isDefault }"
          @click="handleSelectAddress(item)"
      >
        <view class="address-header">
          <text class="name">{{ item.name }}</text>
          <text class="tel">{{ item.tel }}</text>
          <text v-if="item.isDefault" class="default-tag">默认</text>
        </view>

        <view class="address-content">
          <text class="region">{{ item.province }}{{ item.city }}{{ item.county }}</text>
          <text class="detail">{{ item.addressDetail }}</text>
        </view>

        <view class="address-footer">
          <view class="left">
            <switch
                :checked="item.isDefault"
                @change="handleSetDefault(item.id)"
                class="address-switch"
            />
            <text class="switch-label">设为默认</text>
          </view>
          <view class="right">
            <button
                @click="handleEdit(item.id)"
                class="action-btn edit-btn"
            >
              <text class="icon">✏️</text>
              编辑
            </button>
            <button
                @click="handleDelete(item.id)"
                class="action-btn delete-btn"
            >
              <text class="icon">🗑️</text>
              删除
            </button>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="empty">
      <image src="/static/images/empty-address.png" mode="aspectFit" class="empty-image" />
      <text class="empty-text">暂无收货地址</text>
    </view>

    <!-- 添加按钮 -->
    <view class="add-btn-container">
      <button
          type="primary"
          class="add-btn"
          @click="handleAdd"
      >
        添加新地址
      </button>
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import {onLoad, onShow} from '@dcloudio/uni-app'
import AddressApi from '@/api/address'
import NavLogo from "@/components/NavLogo.vue";
import NavBar from "@/components/NavBar.vue";

// 地址列表数据
const addressList = ref([])


// 点击地址项的处理
const handleSelectAddress = (address) => {
  // 判断是否从购物车页面跳转过来
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2]

  if (prevPage && prevPage.route === 'pages/cart/cart') {
    // 将选择的地址数据返回给购物车页面
    uni.$emit('addressSelected', address)
    uni.navigateBack()
  }
}

// 获取地址列表
const fetchAddressList = async () => {
  try {
    addressList.value = await AddressApi.getAddressList()
  } catch (error) {
    uni.showToast({
      title: '获取地址列表失败',
      icon: 'none'
    })
    console.error('获取地址列表失败:', error)
  }
}

// 设置默认地址
const handleSetDefault = async (id) => {
  try {
    // 找到要设置为默认的地址
    const targetAddress = addressList.value.find(item => item.id === id);

    if (!targetAddress) return;

    // 如果已经是默认地址，则不做任何操作
    if (targetAddress.isDefault) {
      console.log('已经是默认地址，无需设置')
      return;
    }

    // 显示加载中状态
    uni.showLoading({
      title: '设置中...',
      mask: true
    });

    // 构建完整的地址数据
    const addressData = {
      name: targetAddress.name,
      tel: targetAddress.tel,
      province: targetAddress.province,
      city: targetAddress.city,
      county: targetAddress.county,
      areaCode: targetAddress.areaCode,
      addressDetail: targetAddress.addressDetail,
      postalCode: targetAddress.postalCode,
      isDefault: true  // 设置为1表示默认地址
    };

    // 调用API更新地址
    await AddressApi.updateAddress(id,addressData);

    // 重新获取地址列表
    await fetchAddressList();

    uni.hideLoading();
    uni.showToast({
      title: '设置默认地址成功',
      icon: 'success'
    });

  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: '设置默认地址失败',
      icon: 'none'
    });
    console.error('设置默认地址失败:', error);
  }
}

// 删除地址
const handleDelete = async (id) => {
  console.log("删除地址", id)
  uni.showModal({
    title: '提示',
    content: '确定要删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        console.log('用户点击确定')
        // 删除
        try {
          await AddressApi.delAddress(id)
          await fetchAddressList()
        }catch (error) {
          uni.showToast({
            title: '删除地址失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 编辑地址
const handleEdit = (id) => {
  console.log("编辑地址", id)
  uni.navigateTo({
    url: `/subpackages/address/set-address?addressId=${id}`
  })
}

// 添加地址
const handleAdd = () => {
  uni.navigateTo({
    url: '/subpackages/address/set-address'
  })
}

// 页面显示时获取数据
onShow(() => {
  fetchAddressList()
})

// 初始化获取数据
onLoad(() => {
  fetchAddressList()
})
</script>

<style lang="scss">
.container {
  min-height: 100%;
  padding: 20rpx 20rpx 140rpx;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.address-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  position: relative;
  /* 添加更明显的阴影效果 */
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.08);
  /* 添加过渡效果使交互更平滑 */
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &.default-address {
    border-left: 8rpx solid #e88a35;
    /* 默认地址可以加更明显的阴影 */
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  }

  /* 可选：添加悬停效果 */
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
  }
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .name {
    font-size: 34rpx;
    font-weight: bold;
    margin-right: 24rpx;
    color: #333;
  }

  .tel {
    font-size: 30rpx;
    color: #666;
    margin-right: 24rpx;
  }

  .default-tag {
    background-color: #e88a35;
    color: #fff;
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-radius: 24rpx;
    font-weight: 500;
  }
}

.address-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 28rpx;

  .region {
    font-size: 30rpx;
    color: #666;
    line-height: 1.4;
  }

  .detail {
    font-size: 32rpx;
    color: #333;
    line-height: 1.5;
    word-break: break-all;
  }
}

.address-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 24rpx;

  .left {
    display: flex;
    align-items: center;

    .address-switch {
      transform: scale(0.8);
      transform-origin: left center;
    }

    .switch-label {
      font-size: 28rpx;
      color: #666;
      margin-left: 16rpx;
    }
  }

  .right {
    display: flex;
    gap: 24rpx;

    .action-btn {
      padding: 0 24rpx;
      height: 56rpx;
      line-height: 56rpx;
      font-size: 28rpx;
      border-radius: 8rpx;
      border: 1rpx solid;
      background-color: transparent;

      .icon {
        margin-right: 8rpx;
      }

      &.edit-btn {
        color: #1989fa;
        border-color: #1989fa;
      }

      &.delete-btn {
        color: #ee0a24;
        border-color: #ee0a24;
      }
    }
  }
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;

  .empty-image {
    width: 150rpx;
    height: 150rpx;
    margin-bottom: 30rpx;
    opacity: 0.8;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
  }
}

.add-btn-container {
  position: fixed;
  bottom: 30rpx;
  left: 20rpx;
  right: 20rpx;

  .add-btn {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 34rpx;
    font-weight: 500;
    background: linear-gradient(90deg, #ff9a3c, #e88a35);
    color: white;
    border-radius: 44rpx;
    border: none;
  }
}
</style>