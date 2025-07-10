<template>
  <view class="cart-container">
    <NavLogo/>

    <!-- 默认地址卡片 -->
    <view
        class="default-address-card"
        v-if="displayAddress && !cartStore.isCartEmpty"
        @click="goToAddress"
        style="border-left: 8rpx solid #e88a35;"
    >
      <view class="address-header">
        <text class="name">{{ displayAddress.name }}</text>
        <text class="tel">{{ displayAddress.tel }}</text>
        <text class="default-tag" v-if="displayAddress.isDefault">默认</text>
      </view>
      <view class="address-content">
        <text class="text">{{ displayAddress.province }}{{ displayAddress.city }}{{ displayAddress.county }}</text>
        <text class="text">{{ displayAddress.addressDetail }}</text>
      </view>
      <view class="arrow-icon">></view>
    </view>

    <view class="no-address" v-if="!addressStore.defaultAddress && !cartStore.isCartEmpty" @click="goToAddress">
      <text>+ 请添加收货地址</text>
    </view>

    <!-- 购物车列表 -->
    <view class="cart-list" v-if="!cartStore.isCartEmpty">
      <view class="cart-item" v-for="item in cartItemsWithDetails" :key="item.id">
        <!-- 勾选框 -->
        <view class="item-select" @click="toggleSelect(item.id)">
          <image
              :src="item.selected ? '/static/images/selected.png' : '/static/images/unselected.png'"
              class="select-icon"
          />
        </view>

        <!-- 商品图片 -->
        <image :src="item.image" class="item-image" mode="aspectFill" @click="goToGoodsDetail(item.id)"/>

        <!-- 商品信息 -->
        <view class="item-info">
          <view class="item-title">{{ item.title }}</view>
          <view class="item-price">¥{{ item.price }}</view>

          <!-- 数量控制 -->
          <view class="item-quantity">
            <view class="quantity-btn" @click="changeQuantity(item.id, -1)">
              <image src="/static/images/minus.png" class="quantity-icon"/>
            </view>
            <input
                class="quantity-input"
                type="number"
                v-model="item.number"
                @blur="validateQuantity(item)"
            />
            <view class="quantity-btn" @click="changeQuantity(item.id, 1)">
              <image src="/static/images/plus.png" class="quantity-icon"/>
            </view>
          </view>
        </view>

        <!-- 删除按钮 -->
        <view class="item-delete" @click="removeItem(item.id)">
          <image src="/static/images/delete.png" class="delete-icon"/>
        </view>
      </view>
    </view>

    <!-- 空购物车提示 -->
    <view class="empty-cart" v-else>
      <image src="/static/images/empty-cart.png" class="empty-icon"/>
      <text class="empty-text">购物车空空如也~</text>
      <button class="go-home-btn" @click="goToHome">去首页逛逛</button>
    </view>

    <!-- 底部结算栏 -->
    <view class="checkout-bar" v-if="!cartStore.isCartEmpty">
      <view class="select-all" @click="toggleSelectAll">
        <image
            :src="isAllSelected ? '/static/images/selected.png' : '/static/images/unselected.png'"
            class="select-icon"
        />
        <text>全选</text>
      </view>

      <view class="total">
        <text>合计: ¥{{ selectedTotalPrice }}</text>
        <text class="total-count">({{ selectedCount }}件)</text>
      </view>

      <view class="checkout-btn" @click="checkout">
        结算({{ selectedCount }})
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useCartStore} from '@/stores/modules/cart.store'
import {useAddressStore} from '@/stores/modules/address.store'
import GoodsApi from '@/api/goods'
import AddressApi from '@/api/address'
import OrderApi from '@/api/order'
import NavLogo from "@/components/NavLogo.vue"
import {onShow} from "@dcloudio/uni-app"
import moment from "moment";
import {showCarBadge} from "@/utils/showCarBadge";

const cartStore = useCartStore()
const addressStore = useAddressStore()
const cartGoods = ref([]) // 存储购物车商品数据
const loading = ref(false)
const addressList = ref([])

// 跳转到首页
const goToHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

// 跳转到地址列表
const goToAddress = () => {
  uni.navigateTo({
    url: '/subpackages/address/pages/address?from=cart'
  })
}

// 跳转到商品详情页面
const goToGoodsDetail = (goodsId) => {
  uni.navigateTo({
    url: `/subpackages/detail/goods-detail?value=${goodsId}`
  })
}

// 获取默认地址
const fetchDefaultAddress = async () => {
  try {
    const res = await AddressApi.getAddressList()
    addressList.value = res

    // 查找并设置默认地址
    const defaultAddr = addressList.value.find(item => item.isDefault) || null
    addressStore.setDefaultAddress(defaultAddr)

    // 如果没有当前地址，使用默认地址作为当前地址
    if (!addressStore.currentAddress) {
      addressStore.setCurrentAddress(defaultAddr)
    }
  } catch (error) {
    console.error('获取地址失败:', error)
  }
}

// 当前选择的地址
const displayAddress = computed(() => {
  return addressStore.currentAddress || addressStore.defaultAddress
})

// 获取购物车商品数据
const fetchCartGoods = async () => {
  if (cartStore.isCartEmpty) {
    cartGoods.value = []
    return
  }

  try {
    loading.value = true

    // 获取购物车中所有商品的ID（逗号分隔）
    const goodsIds = cartStore.items.map(item => item.id).join(',')

    // 调用 getCarGoods 方法获取商品详情
    const res = await GoodsApi.getCarGoods(goodsIds)

    // 根据你的API返回结构调整这里
    if (Array.isArray(res)) {
      cartGoods.value = res
    } else if (res && res.message) {
      cartGoods.value = res.message
    } else {
      throw new Error('获取购物车商品失败')
    }
  } catch (error) {
    console.error('获取购物车商品失败:', error)
    uni.showToast({
      title: '加载购物车商品失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 合并购物车数据和商品详情
const cartItemsWithDetails = computed(() => {
  return cartStore.items.map(cartItem => {
    // 在 cartGoods 中查找匹配的商品详情
    const goodsInfo = cartGoods.value.find(g => g.id == cartItem.id) || {}

    return {
      ...cartItem,
      title: goodsInfo.title || '未知商品',
      image: goodsInfo.thumb_path || '/static/images/default-product.png',
      price: cartItem.price // 优先使用购物车中的价格
    }
  })
})

// 全选状态
const isAllSelected = computed(() => {
  return cartStore.items.length > 0 &&
      cartStore.items.every(item => item.selected)
})

// 已选商品总价
const selectedTotalPrice = computed(() => {
  return cartStore.items
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.number), 0)
})

// 已选商品数量
const selectedCount = computed(() => {
  return cartStore.items
      .filter(item => item.selected)
      .reduce((total, item) => total + item.number, 0)
})

// 修改数量
const changeQuantity = (id, delta) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item) {
    const newQuantity = item.number + delta
    if (newQuantity > 0) {
      cartStore.updateItem(id, {number: newQuantity})
    }
  }
}

// 验证数量输入
const validateQuantity = (item) => {
  if (item.number < 1) {
    cartStore.updateItem(item.id, {number: 1})
  }
}

// 删除商品
const removeItem = (id) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    success: (res) => {
      if (res.confirm) {
        cartStore.removeItem(id)
      }
    }
  })
}

// 切换选中状态
const toggleSelect = (id) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item) {
    cartStore.updateItem(id, {selected: !item.selected})
  }
}

// 全选/取消全选
const toggleSelectAll = () => {
  const newSelectedState = !isAllSelected.value
  cartStore.items.forEach(item => {
    cartStore.updateItem(item.id, {selected: newSelectedState})
  })
}

const genOrderId = () => {
  // 生成6位随机数
  let randomStr = ''
  for (let i = 1; i <= 6; i++) {
    randomStr += Math.floor(Math.random() * 10)
  }
  return moment().format('YYYYMMDDHHmmss') + randomStr
}

// 结算
const checkout = async () => {
  if (selectedCount.value === 0) {
    uni.showToast({
      title: '请选择要结算的商品',
      icon: 'none'
    })
    return
  }

  // 检查是否有收货地址
  if (!displayAddress.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({
      title: '正在生成订单...',
      mask: true
    })

    // 获取选中的商品
    const selectedItems = cartStore.items.filter(item => item.selected)

    // 准备订单id
    let  orderId = genOrderId()
    // 准备订单数据
    const orderData = {
      address_id: displayAddress.value.id, // 使用当前显示的地址ID
      number: selectedCount.value,
      total_price: selectedTotalPrice.value,
      order_id: orderId ,
      goods_ids: selectedItems.map(item => item.id).join(',')
    }

    // 调用API创建订单
    const res = await OrderApi.createOrder(orderData)

    // 订单创建成功后，跳转到订单详情页
    if (res && res.code === 20000) {
      uni.hideLoading()

      // 跳转到订单详情页
      uni.navigateTo({
        url: `/subpackages/order/pages/order-detail?order_id=${orderId}`
      })

      // 清空已选中的购物车商品
      selectedItems.forEach(item => {
        cartStore.removeItem(item.id)
      })

    } else {
      throw new Error('订单创建失败')
    }
  } catch (error) {
    console.error('订单创建失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: '订单创建失败',
      icon: 'none'
    })
  }
}

// 监听购物车变化
watch(() => cartStore.items, () => {
  fetchCartGoods()
}, {deep: true})

// 初始化
onMounted(() => {
  fetchDefaultAddress()
  fetchCartGoods()

  // 监听地址选择事件
  uni.$on('addressSelected', (address) => {
    addressStore.setCurrentAddress(address)
  })
})

// 监听页面显示事件
onShow(() => {
  fetchDefaultAddress()
  showCarBadge()
})

</script>

<style scoped lang="scss">
/* 样式保持不变，与之前相同 */
.default-address-card {
  position: relative;
  margin: 20rpx;
  padding: 24rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

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

.default-tag {
  background: #e0620d;
  color: #fff;
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.address-content {
  display: flex;
  flex-direction: column;
}

.text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.arrow-icon {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 36rpx;
}

.no-address {
  margin: 20rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 16rpx;
  text-align: center;
  color: #e93b3d;
  font-size: 30rpx;
}

.cart-container {
  padding-bottom: 100rpx;
}

.cart-list {
  padding: 20rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .item-select {
    margin-right: 20rpx;

    .select-icon {
      width: 36rpx;
      height: 36rpx;
    }
  }

  .item-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
  }

  .item-info {
    flex: 1;

    .item-title {
      font-size: 28rpx;
      color: #333;
      margin-bottom: 10rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .item-price {
      font-size: 32rpx;
      color: #ff4400;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .item-quantity {
      display: flex;
      align-items: center;

      .quantity-btn {
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;

        .quantity-icon {
          width: 24rpx;
          height: 24rpx;
        }
      }

      .quantity-input {
        width: 80rpx;
        text-align: center;
        margin: 0 10rpx;
      }
    }
  }

  .item-delete {
    margin-left: 20rpx;

    .delete-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
}

.checkout-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  border-top: 1rpx solid #eee;
  z-index: 10;

  .select-all {
    display: flex;
    align-items: center;
    margin-right: 20rpx;

    .select-icon {
      width: 36rpx;
      height: 36rpx;
      margin-right: 10rpx;
    }
  }

  .total {
    flex: 1;
    text-align: right;
    padding-right: 20rpx;

    .total-count {
      font-size: 24rpx;
      color: #999;
      margin-left: 10rpx;
    }
  }

  .checkout-btn {
    width: 200rpx;
    height: 80rpx;
    background: linear-gradient(to right, #ff5a00, #ff7d33);
    color: #fff;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 300rpx;

  .empty-icon {
    width: 150rpx;
    height: 150rpx;
    margin-bottom: 30rpx;
    color: #cdcdcd;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }

  .go-home-btn {
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: #e88a35;
    color: white;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
  }
}
</style>