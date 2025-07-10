<template>
  <view>
    <NavLogo/>
    <NavBar>商品订单</NavBar>

    <!-- 状态筛选栏 -->
    <scroll-view scroll-x class="filter-bar">
      <view
          v-for="(item, index) in filterOptions"
          :key="index"
          :class="['filter-item', { active: activeFilter === item.value }]"
          @click="changeFilter(item.value)"
      >
        {{ item.label }}
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-list" :style="{ height: scrollHeight + 'px' }">
      <!-- 无订单提示 -->
      <view v-if="orders.length === 0" class="empty-order">
        <image src="/static/images/empty-order.png" class="empty-image" />
        <text class="empty-text">暂无订单记录</text>
      </view>

      <!-- 订单卡片 -->
      <view v-for="(order, index) in filteredOrders" :key="order.id" class="order-card">
        <view class="order-header">
          <text class="order-id">订单号: {{ order.order_id }}</text>
          <text :class="['order-status', statusClass(order)]">{{ getStatusText(order) }}</text>
        </view>

        <!-- 商品列表 -->
        <view class="goods-list">
          <view v-for="goods in order.goods" :key="goods.id" class="goods-item">
            <image :src="goods.thumb_path" class="goods-image" mode="aspectFill" />
            <view class="goods-info">
              <text class="goods-name">{{ goods.title }}</text>
              <view class="goods-price">
                <text class="price">¥{{ goods.sell_price }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单信息 -->
        <view class="order-info">
          <view class="info-row">
            <text class="info-label">商品数量:</text>
            <text class="info-value">{{ order.number }}件</text>
          </view>
          <view class="info-row">
            <text class="info-label">订单金额:</text>
            <text class="info-value">¥{{ order.total_price }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">实付金额:</text>
            <text class="info-value orange">¥{{ order.actual_price }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">下单时间:</text>
            <text class="info-value">{{ formatTime(order.add_time) }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="order-actions">
          <button
              v-if="order.status === 0 && order.is_cancel === 0"
              class="action-btn primary"
              @click="payOrder(order)"
          >
            去支付
          </button>
          <button
              v-if="order.status === 1 && order.is_out === 0"
              class="action-btn"
          >
            提醒发货
          </button>
          <button
              v-if="order.status === 1 && order.is_out === 1"
              class="action-btn primary"
              @click="confirmReceipt(order)"
          >
            确认收货
          </button>
          <button
              v-if="order.is_finish === 1 || order.is_cancel === 1"
              class="action-btn"
              @click="deleteOrder(order)"
          >
            删除订单
          </button>
          <button
              v-if="order.is_finish === 1"
              class="action-btn primary"
          >
            再次购买
          </button>
          <button
              v-if="order.status === 0 && order.is_cancel === 0"
              class="action-btn"
              @click="cancelOrder(order)"
          >
            取消订单
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {onShow} from '@dcloudio/uni-app';
import NavLogo from "@/components/NavLogo.vue";
import NavBar from "@/components/NavBar.vue";
import OrderApi from '@/api/order';

// 筛选选项
const filterOptions = ref([
  {label: '全部', value: 'all'},
  {label: '未付款', value: 'unpaid'},
  {label: '待发货', value: 'unship'},
  {label: '已完成', value: 'completed'}
]);

const activeFilter = ref('all');
const orders = ref([]);
const scrollHeight = ref(0);

// 计算过滤后的订单
const filteredOrders = computed(() => {
  if (activeFilter.value === 'all') return orders.value;

  return orders.value.filter(order => {
    // 已取消的订单只在"全部"中显示
    if (order.is_cancel === 1) return false;

    switch (activeFilter.value) {
      case 'unpaid':
        return order.status === 0;
      case 'unship':
        return order.status === 1 && order.is_out === 0;
      case 'completed':
        return order.is_finish === 1;
      default:
        return true;
    }
  });
});

// 切换筛选条件
const changeFilter = (value) => {
  activeFilter.value = value;
};

// 获取订单状态文本
const getStatusText = (order) => {
  if (order.is_cancel === 1) return '已取消';
  if (order.status === 0) return '待付款';
  if (order.status === 1 && order.is_out === 0) return '待发货';
  if (order.status === 1 && order.is_out === 1) return '待收货';
  if (order.is_finish === 1) return '已完成';
  return '未知状态';
};

// 获取状态对应的样式类
const statusClass = (order) => {
  if (order.is_cancel === 1) return 'cancel';
  if (order.status === 0) return 'unpaid';
  if (order.status === 1 && order.is_out === 0) return 'unship';
  if (order.status === 1 && order.is_out === 1) return 'shipped';
  if (order.is_finish === 1) return 'completed';
  return '';
};

// 格式化时间戳
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
};

const padZero = (num) => {
  return num.toString().padStart(2, '0');
};

// 获取订单列表
const fetchOrders = async () => {
  try {
    const res = await OrderApi.getOrderList();
    // 直接使用后端返回的数据结构
    orders.value = res.map(order => ({
      ...order,
      // 使用后端返回的商品数据
      goods: order.goods.map(goods => ({
        ...goods,
        // 确保图片地址有效
        thumb_path: goods.thumb_path || '/static/default-goods.png'
      }))
    }));
  } catch (error) {
    console.error('获取订单失败:', error);
    uni.showToast({
      title: '获取订单失败',
      icon: 'none'
    });
  }
};

// 支付订单
const payOrder = (order) => {
  uni.showToast({
    title: '跳转支付页面',
    icon: 'none'
  });
  // 跳转到支付页面
};

// 确认收货
const confirmReceipt = (order) => {
  uni.showModal({
    title: '确认收货',
    content: '请确认您已收到商品',
    success: (res) => {
      if (res.confirm) {
        // 调用API确认收货
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        });
      }
    }
  });
};

// 取消订单
const cancelOrder = (order) => {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        // 调用API取消订单
        try {
          // 取消订单
          await OrderApi.cancelOrder(order.order_id)
          // 刷新订单列表
          await fetchOrders();
        } catch (error) {
          uni.showToast({
            title: '取消订单失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 删除订单
const deleteOrder = (order) => {
  uni.showModal({
    title: '删除订单',
    content: '确定要删除此订单吗？',
    success: async (res) => {
      if (res.confirm) {
        // 调用API删除订单
        try {
          // 删除订单
          await OrderApi.delOrder(order.order_id)
          // 刷新订单列表
          await fetchOrders();
          uni.showToast({
            title: '订单已删除',
            icon: 'success'
          });
        }catch (error){
          uni.showToast({
            title: '删除订单失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 初始化
onMounted(() => {
  // 计算滚动区域高度
  const systemInfo = uni.getSystemInfoSync();
  scrollHeight.value = systemInfo.windowHeight - 200; // 减去导航栏和筛选栏高度
});

onShow(() => {
  fetchOrders();
});
</script>

<style lang="scss" scoped>
/* 筛选栏样式 */
.filter-bar {
  display: flex;
  align-items: center;
  white-space: nowrap;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0 20rpx 40rpx;
}

.filter-item {
  display: inline-block;
  padding: 10rpx 30rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 30rpx;

  &.active {
    background-color: #ff5a00;
    color: #fff;
  }
}

/* 订单列表容器 */
.order-list {
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

/* 空订单提示 */
.empty-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 30rpx;
  }

  .empty-text {
    font-size: 30rpx;
    color: #999;
  }
}

/* 订单卡片样式 */
.order-card {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .order-header {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .order-id {
      font-size: 26rpx;
      color: #666;
    }

    .order-status {
      font-size: 28rpx;
      font-weight: bold;

      &.unpaid {
        color: #ff5a00;
      }

      &.unship {
        color: #f0ad4e;
      }

      &.shipped {
        color: #5cb85c;
      }

      &.completed {
        color: #999;
      }

      &.cancel {
        color: #999;
        text-decoration: line-through;
      }
    }
  }

  .goods-list {
    padding: 20rpx 30rpx;
  }

  .goods-item {
    display: flex;
    padding: 20rpx 0;
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

      .goods-name {
        display: block;
        font-size: 28rpx;
        line-height: 1.4;
        margin-bottom: 10rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .goods-price {
        .price {
          font-size: 28rpx;
          color: #ff5a00;
          font-weight: bold;
        }
      }
    }
  }

  .order-info {
    padding: 0 30rpx 20rpx;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 0;
    font-size: 26rpx;

    .info-label {
      color: #999;
    }

    .info-value {
      color: #333;

      &.orange {
        color: #ff5a00;
        font-weight: bold;
      }
    }
  }

  .order-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 20rpx 30rpx;
    border-top: 1rpx solid #f5f5f5;

    .action-btn {
      min-width: 160rpx;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 20rpx;
      margin: 10rpx 0 10rpx 20rpx;
      font-size: 26rpx;
      border-radius: 30rpx;
      border: 1rpx solid #ddd;
      background-color: #fff;
      color: #666;

      &.primary {
        border-color: #ff5a00;
        background-color: #fff8f5;
        color: #ff5a00;
      }
    }
  }
}
</style>