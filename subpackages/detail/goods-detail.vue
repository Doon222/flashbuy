<template>
  <view class="container">
    <NavLogo/>

    <view class="custom-navbar">
      <view class="nav-left" @click="goBack">
        <image src="/static/detail/back.png" class="nav-icon"></image>
      </view>
      <view class="nav-title">商品详情</view>
      <view class="nav-right"></view>
    </view>

    <!-- 轮播图 -->
    <swiper
        class="swiper-container"
        :indicator-dots="true"
        :autoplay="true"
        interval="3000"
        circular
        indicator-active-color="#e93b3d"
    >
      <swiper-item v-for="(item, index) in goodsImages" :key="index">
        <image
            :src="item.src"
            class="swiper-img"
            mode="aspectFill"
        ></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息 -->
    <view class="goods-info">
      <view class="goods-title">{{ goodsDetail.title }}</view>
      <view class="goods-price">
        <text class="sell-price">¥{{ goodsDetail.sell_price }}</text>
        <text class="market-price">¥{{ goodsDetail.market_price }}</text>
      </view>
      <view class="goods-extra">
        <view class="extra-item">
          <text class="extra-label">库存:</text>
          <text>{{ goodsDetail.stock_quantity }}件</text>
        </view>
        <view class="extra-item">
          <text class="extra-label">货号:</text>
          <text>{{ goodsDetail.goods_no }}</text>
        </view>
        <view class="extra-item">
          <text class="extra-label">上架时间:</text>
          <text>{{ formatDate(goodsDetail.add_time) }}</text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="goods-detail">
      <view class="detail-title">商品详情</view>
      <rich-text :nodes="goodsDetail.content"></rich-text>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-icon" @click="goCart">
        <image src="/static/tabbar/cart-active.png" class="icon-image"></image>
        <text>购物车</text>
      </view>
      <view class="action-buttons">
        <view class="action-btn cart-btn" @click="showPopup('cart')">
          加入购物车
        </view>
        <view class="action-btn buy-btn" @click="showPopup('buy')">
          立即购买
        </view>
      </view>
    </view>

    <!-- 选择弹窗 -->
    <uni-popup
        ref="popup"
        type="bottom"
        :mask="true"
        :safe-area="false"
        @maskClick="closePopup"
    >
      <view class="spec-card">
        <view class="close-view">
          <view class="close-btn" @click="closePopup">
            <image src="/static/detail/close.png" class="icon-image close"></image>
          </view>
        </view>

        <view class="card-header">
          <image :src="goodsImages.length > 0 ? goodsImages[0].src : ''" class="card-goods-img"></image>
          <view class="card-goods-info">
            <view class="card-goods-title">{{ goodsDetail.title }}</view>
            <view class="card-goods-price">¥{{ goodsDetail.sell_price }}</view>
            <view class="card-goods-stock">库存: {{ goodsDetail.stock_quantity }}件</view>
          </view>
        </view>

        <view class="spec-content">
          <view class="quantity-selector">
            <view class="quantity-label">数量</view>
            <view class="quantity-control">
              <view class="quantity-btn" @click="decreaseQuantity">
                <image src="/static/detail/minus.png" class="icon-image"></image>
              </view>
              <input
                  class="quantity-input"
                  type="number"
                  v-model="quantity"
                  :max="goodsDetail.stock_quantity"
              >
              <view class="quantity-btn" @click="increaseQuantity">
                <image src="/static/detail/plus.png" class="icon-image"></image>
              </view>
            </view>
          </view>

          <view class="card-footer">
            <view class="confirm-btn" @click="confirmAction">
              {{ actionType === 'cart' ? '加入购物车' : '立即购买' }}
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import {ref} from 'vue';
import {onLoad} from '@dcloudio/uni-app';
import GoodsApi from '../../api/goods';
import NavLogo from "@/components/NavLogo.vue";

// 商品数据
const goodsImages = ref([]);
const goodsDetail = ref({
  id: 0,
  title: '',
  add_time: '',
  content: '',
  goods_no: '',
  stock_quantity: 0,
  market_price: 0,
  sell_price: 0
});

// 弹窗相关
const popup = ref(null);
const quantity = ref(1);
const actionType = ref('cart');
const goodsId = ref(0);


// 生命周期
onLoad((options) => {
  if (options.value) {
    goodsId.value = options.value;
    initData();
  }
});

// 初始化数据
const initData = async () => {
  try {
    // 获取轮播图数据
    const swiperRes = await GoodsApi.getGoodsImages(goodsId.value);
    goodsImages.value = swiperRes.message;

    // 获取商品详情
    const detailRes = await GoodsApi.getGoodsDetail(goodsId.value);
    goodsDetail.value = detailRes.message;

    // 处理富文本中的图片
    goodsDetail.value.content = processRichText(goodsDetail.value.content);

  } catch (error) {
    console.error('数据加载失败:', error);
    uni.showToast({
      title: '数据加载失败',
      icon: 'none'
    });
  }
};

// 数量控制
const increaseQuantity = () => {
  if (quantity.value < goodsDetail.value.stock_quantity) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// 弹窗控制
const showPopup = (type) => {
  actionType.value = type;
  popup.value.open();
};

const closePopup = () => {
  popup.value.close();
};

// 确认操作
const confirmAction = () => {
  closePopup();
  uni.showToast({
    title: actionType.value === 'cart'
        ? `已添加${quantity.value}件到购物车`
        : `已购买${quantity.value}件商品`,
    icon: 'success'
  });
};

// 跳转购物车
const goCart = () => {
  uni.switchTab({
    url: '/pages/cart/cart'
  });
};

// 格式化时间
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};


const processRichText = (html) => {
  if (!html) return '';

  // 1. 处理图片 - 移除固定尺寸，添加响应式样式
  html = html.replace(/<img([^>]*)width="[^"]*"/gi, '<img$1')
      .replace(/<img([^>]*)height="[^"]*"/gi, '<img$1')
      .replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;margin:10rpx auto;"');

  // 2. 处理表格 - 转为响应式
  html = html.replace(/<table([^>]*)width="[^"]*"/gi, '<table$1')
      .replace(/<table/gi, '<div class="table-container"><table style="width:100%!important;"')
      .replace(/<\/table>/gi, '</table></div>');

  // 3. 移除不必要的空白和换行符
  html = html.replace(/↵/g, '').trim();

  // 4. 添加基础安全样式
  const safeStyle = `
    <style>
      body {font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 28rpx; line-height: 1.6; color: #333;}
      p {margin: 20rpx 0; word-break: break-word;}
      img {max-width: 100% !important; height: auto !important; display: block; margin: 20rpx auto;}
      .table-container {overflow-x: auto; margin: 20rpx 0;}
      table {width: 100% !important; border-collapse: collapse;}
      td, th {border: 1px solid #ddd; padding: 12rpx; text-align: left;}
      a {color: #576b95; text-decoration: none;}
    </style>
  `;

  return safeStyle + html;
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

</script>

<style lang="scss" scoped>

.container {
  width: 100vw;
  height: 100vh;
  background: #f8f8f8;
}

.custom-navbar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .nav-left {
    width: 60rpx;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .nav-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #333;
  }

  .nav-right {
    width: 60rpx;
  }

  .nav-icon {
    width: 40rpx;
    height: 40rpx;
  }
}

/* 轮播图样式 */
/* 更新轮播图样式 */
.swiper-container {
  height: 750rpx;
  width: 100%;
  position: relative;

  .swiper-img {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* 指示点样式 */
  ::v-deep .uni-swiper-dots {
    bottom: 30rpx;

    .uni-swiper-dot {
      width: 12rpx;
      height: 12rpx;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 6rpx;
      margin: 0 6rpx;
      transition: all 0.3s;
    }

    .uni-swiper-dot-active {
      width: 36rpx;
      background: #e93b3d;
    }
  }
}


/* 商品信息 */
.goods-info {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.goods-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.goods-price {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.sell-price {
  font-size: 44rpx;
  color: #e93b3d;
  margin-right: 20rpx;
  font-weight: bold;
}

.market-price {
  font-size: 28rpx;
  color: #999;
  text-decoration: line-through;
}

.goods-extra {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
  border-top: 1rpx solid #eee;
}

.extra-item {
  width: 50%;
  display: flex;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  margin-top: 10rpx;
}

.extra-label {
  color: #999;
  margin-right: 10rpx;
}

/* 商品详情 */
.goods-detail {
  background: #fff;
  margin-top: 20rpx;
  padding: 30rpx 30rpx 140rpx;

  ::v-deep {
    img {
      max-width: 100% !important;
      height: auto !important;
      display: block;
      margin: 20rpx auto;
      border-radius: 8rpx;
    }

    .table-container {
      overflow-x: auto;
      margin: 20rpx 0;
      -webkit-overflow-scrolling: touch;

      table {
        min-width: 100%;
        border-collapse: collapse;

        td, th {
          border: 1rpx solid #eee;
          padding: 16rpx;
          word-break: break-word;
        }
      }
    }

    p {
      margin: 24rpx 0;
      line-height: 1.8;
      color: #333;
    }

    a {
      color: #e93b3d;
      word-break: break-all;
    }
  }

}

.detail-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #eee;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #fff;
  display: flex;
  align-items: start;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 20rpx 20rpx 0;
}

.action-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  font-size: 24rpx;
  color: #666;
}

.icon-image {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 6rpx;
}

.action-buttons {
  flex: 1;
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #fff;
}

.cart-btn {
  background: linear-gradient(90deg, #ffd01e, #ff8917);
}

.buy-btn {
  background: linear-gradient(90deg, #ff6034, #ee0a24);
}

/* 弹窗样式 */
.spec-card {
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx ;
  padding-top: 60rpx;
}

.card-header {
  margin-top: 30rpx;
  display: flex;
  align-items: center;
  position: relative;
}

.card-goods-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  margin-right: 30rpx;
}

.card-goods-info {
  flex: 1;
}

.card-goods-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.card-goods-price {
  font-size: 36rpx;
  color: #e93b3d;
  margin-bottom: 10rpx;
}

.card-goods-stock {
  font-size: 26rpx;
  color: #999;
}

.close-btn {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}

.close {
  width: 36rpx;
  height: 36rpx;
}

.spec-content {
  max-height: 60vh;
  overflow-y: auto;
}

.spec-group {
  margin-bottom: 30rpx;
}

.spec-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.spec-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.spec-item {
  padding: 16rpx 30rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.spec-item.active {
  border-color: #e93b3d;
  color: #e93b3d;
  background: #fff0f0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  border-top: 1rpx solid #eee;
  margin-top: 20rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-input {
  width: 100rpx;
  text-align: center;
  font-size: 32rpx;
  margin: 0 20rpx;
}

.card-footer {
  padding-top: 30rpx;
  padding-bottom: 30rpx;
}

.confirm-btn {
  width: 100%;
  height: 80rpx;
  background: #e93b3d;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #fff;
}

::v-deep .uni-popup {
  z-index: 9999;
  height: 40vh;
}
</style>