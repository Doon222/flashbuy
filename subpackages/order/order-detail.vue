<template>
  <view class="order-detail">
    <!-- 导航栏 -->
    <NavLogo/>
    <NavBar>订单详情</NavBar>

    <!-- 订单状态 -->
    <view class="order-status" :class="statusClass">
      <text>{{ orderStatusText }}</text>
      <view class="status-desc">
        <text v-if="orderDetail.is_cancel === 1">订单已取消</text>
        <text v-else-if="orderDetail.status === 0">请尽快完成支付</text>
        <text v-else-if="orderDetail.status === 1 && orderDetail.is_out === 0">商家正在准备商品</text>
        <text v-else-if="orderDetail.status === 1 && orderDetail.is_out === 1">商品已发货，请耐心等待</text>
        <text v-else-if="orderDetail.is_finish === 1">订单已完成</text>
        <text v-else>未知状态</text>
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="address-card" v-if="orderDetail.address_info">
      <view class="address-content">
        <view class="address-header">
          <text class="name">{{ orderDetail.address_info.name }}</text>
          <text class="tel">{{ orderDetail.address_info.tel }}</text>
        </view>
        <view class="address-detail">
          <text class="text">{{ orderDetail.address_info.province }}{{
              orderDetail.address_info.city
            }}{{ orderDetail.address_info.county }}
          </text>
          <text class="text">{{ orderDetail.address_info.addressDetail }}</text>
        </view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <view class="section-title">商品列表</view>
      <view class="goods-item" v-for="goods in orderDetail.goods" :key="goods.id">
        <image :src="goods.thumb_path || '/static/default-goods.png'" class="goods-image" mode="aspectFill"/>
        <view class="goods-info">
          <text class="goods-name">{{ goods.title }}</text>
          <view class="spec-price">
            <text class="price">¥{{ goods.sell_price }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="label">订单编号</text>
        <text class="value">{{ orderDetail.order_id }}</text>
      </view>
      <view class="info-item">
        <text class="label">下单时间</text>
        <text class="value">{{ formatTime(orderDetail.add_time) }}</text>
      </view>
      <view class="info-item">
        <text class="label">商品数量</text>
        <text class="value">{{ orderDetail.number }}</text>
      </view>
      <view class="info-item">
        <text class="label">支付方式</text>
        <text class="value">{{ orderDetail.pay_way || '未支付' }}</text>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-detail">
      <view class="section-title">价格明细</view>
      <view class="price-row">
        <text class="label">商品总额</text>
        <text class="value">¥{{ orderDetail.total_price }}</text>
      </view>
      <view class="price-row">
        <text class="label">运费</text>
        <text class="value">¥0.00</text>
      </view>
      <view class="price-row total">
        <text class="label">实付金额</text>
        <text class="value orange">¥{{ orderDetail.actual_price }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-buttons">
        <!-- 已取消的订单只显示删除按钮 -->
        <view
            v-if="orderDetail.is_cancel === 1"
            class="action-btn delete-btn"
            @click="deleteOrder"
        >
          删除订单
        </view>

        <!-- 未取消的订单显示其他按钮 -->
        <view
            v-if="orderDetail.status === 0 && !orderDetail.is_cancel"
            class="action-btn primary"
            @click="payOrder"
        >
          立即支付
        </view>
        <view
            v-if="orderDetail.status === 1 && orderDetail.is_out === 1 && !orderDetail.is_cancel"
            class="action-btn primary"
            @click="confirmReceipt"
        >
          确认收货
        </view>
        <view
            v-if="orderDetail.is_finish === 1 && !orderDetail.is_cancel"
            class="action-btn"
        >
          再次购买
        </view>
        <view
            v-if="orderDetail.status === 0 && !orderDetail.is_cancel"
            class="action-btn"
            @click="cancelOrder"
        >
          取消订单
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {computed, ref} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import OrderApi from '@/api/order'
import GoodsApi from '@/api/goods'
import NavLogo from "@/components/NavLogo.vue"
import NavBar from "@/components/NavBar.vue"

const orderDetail = ref({
  order_id: '',
  user_id: 0,
  address_id: 0,
  total_price: 0,
  actual_price: 0,
  is_take: 0,
  is_out: 0,
  pay_way: '',
  status: 0,
  add_time: 0,
  number: 0,
  goods_ids: '',
  openid: null,
  transaction_id: null,
  address_info: null,
  is_finish: 0,
  success_time: '',
  is_cancel: 0,
  goods: null
})


// 格式化时间戳
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}

const padZero = (num) => {
  return num.toString().padStart(2, '0')
}

// 获取订单状态文本
const orderStatusText = computed(() => {
  const order = orderDetail.value
  if (order.is_cancel === 1) return '已取消'
  if (order.status === 0) return '待付款'
  if (order.status === 1 && order.is_out === 0) return '待发货'
  if (order.status === 1 && order.is_out === 1) return '待收货'
  if (order.is_finish === 1) return '已完成'
  return '未知状态'
})

// 获取状态对应的样式类
const statusClass = computed(() => {
  const order = orderDetail.value
  if (order.is_cancel === 1) return 'cancel'
  if (order.status === 0) return 'unpaid'
  if (order.status === 1 && order.is_out === 0) return 'unship'
  if (order.status === 1 && order.is_out === 1) return 'shipped'
  if (order.is_finish === 1) return 'completed'
  return ''
})

// 获取订单详情
const fetchOrderDetail = async (orderId) => {
  try {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
    // 获取订单详情

    let a1 = await OrderApi.getOrderDetail(orderId)
    console.log(a1)
    orderDetail.value = a1
    // 获取订单内商品详情
    let a2 = await GoodsApi.getCarGoods(orderDetail.value.goods_ids)
    console.log(a2.message)
    orderDetail.value.goods = a2.message

    uni.hideLoading()
  } catch (error) {
    console.error('获取订单详情失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '获取订单详情失败',
      icon: 'none'
    })
  }
}

// 支付订单
const payOrder = () => {
  uni.showToast({
    title: '跳转支付页面',
    icon: 'none'
  })
}

// 确认收货
const confirmReceipt = () => {
  uni.showModal({
    title: '确认收货',
    content: '请确认您已收到商品',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
        // 更新订单状态
        orderDetail.value.is_finish = 1
      }
    }
  })
}

// 取消订单
const cancelOrder = () => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消此订单吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '订单已取消',
          icon: 'success'
        })
        // 更新订单状态
        orderDetail.value.is_cancel = 1
      }
    }
  })
}

// 删除订单
const deleteOrder = () => {
  uni.showModal({
    title: '删除订单',
    content: '确定要删除此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 调用API删除订单
          await OrderApi.delOrder(orderDetail.value.order_id)
          uni.showToast({
            title: '订单已删除',
            icon: 'success'
          })
          // 返回上一页
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } catch (error) {
          uni.showToast({
            title: '删除订单失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 初始化页面
onLoad((options) => {
  const {order_id} = options
  if (order_id) {
    fetchOrderDetail(order_id)
  } else {
    uni.showToast({
      title: '订单ID不存在',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>

<style lang="scss" scoped>
.order-detail {
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.order-status {
  padding: 40rpx 30rpx;
  margin: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 8rpx;
    height: 100%;
  }

  text {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .status-desc {
    font-size: 26rpx;
    color: #666;
    margin-top: 10rpx;
  }

  &.unpaid {
    color: #ff5a00;
    background: linear-gradient(to right, #fff8f5, #fff);

    &::before {
      background: #ff5a00;
    }

    .status-desc {
      color: #ff7d33;
    }
  }

  &.unship {
    color: #f0ad4e;
    background: linear-gradient(to right, #fffaf2, #fff);

    &::before {
      background: #f0ad4e;
    }

    .status-desc {
      color: #f0ad4e;
    }
  }

  &.shipped {
    color: #5cb85c;
    background: linear-gradient(to right, #f8fff8, #fff);

    &::before {
      background: #5cb85c;
    }

    .status-desc {
      color: #5cb85c;
    }
  }

  &.completed {
    color: #999;
    background: linear-gradient(to right, #f8f8f8, #fff);

    &::before {
      background: #999;
    }

    .status-desc {
      color: #999;
    }
  }

  &.cancel {
    color: #999;
    background: linear-gradient(to right, #f8f8f8, #fff);
    text-decoration: line-through;

    &::before {
      background: #999;
    }

    .status-desc {
      color: #999;
    }
  }
}

.address-card {
  position: relative;
  margin: 20rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .address-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .name {
      font-size: 32rpx;
      font-weight: bold;
      margin-right: 20rpx;
      color: #333;
    }

    .tel {
      font-size: 28rpx;
      color: #666;
      margin-right: 20rpx;
    }
  }

  .address-detail {
    display: flex;
    flex-direction: column;

    .text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
    }
  }
}

.order-info {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 15rpx 0;
    font-size: 28rpx;

    .label {
      color: #999;
    }

    .value {
      color: #333;
    }
  }
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f5f5f5;
}

.goods-list {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .goods-item {
    display: flex;
    padding: 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .goods-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 8rpx;
      background-color: #f5f5f5;
      margin-right: 20rpx;
    }

    .goods-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 28rpx;
        color: #333;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 1.4;
      }

      .spec-price {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;

        .spec {
          font-size: 24rpx;
          color: #999;
        }

        .price {
          font-size: 28rpx;
          color: #ff5a00;
          font-weight: bold;
        }
      }

      .quantity {
        text-align: right;
        margin-top: 10rpx;

        .qty {
          font-size: 26rpx;
          color: #666;
        }
      }
    }
  }
}

.price-detail {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding-bottom: 20rpx;

  .price-row {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    font-size: 28rpx;

    .label {
      color: #666;
    }

    .value {
      color: #333;
    }

    &.total {
      font-weight: bold;
      font-size: 30rpx;
      padding-top: 30rpx;
      border-top: 1rpx solid #f5f5f5;

      .orange {
        color: #ff5a00;
        font-size: 32rpx;
      }
    }

    .orange {
      color: #ff5a00;
    }
  }
}

/* 底部操作栏 - 修改为类似订单列表页的样式 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
  z-index: 10;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 20rpx;
}

.action-btn {
  min-width: 160rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  border-radius: 30rpx;
  border: 1rpx solid #ddd;
  background-color: #fff;
  color: #666;
  text-align: center;
  transition: all 0.2s;

  &:active {
    opacity: 0.8;
    transform: scale(0.95);
  }

  &.primary {
    border-color: #ff5a00;
    background-color: #fff8f5;
    color: #ff5a00;
  }
}
</style>