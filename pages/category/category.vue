<template>
  <view class="page-container">
    <!-- 顶部标题 -->
    <NavLogo show-search placeholder="搜索商品"/>

    <!-- 主体内容 -->
    <view class="main-content">
      <!-- 左侧分类导航 -->
      <scroll-view class="sidebar" scroll-y>
        <view
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            :class="{ active: activeCategoryId === category.id }"
            @click="selectCategory(category)"
        >
          <text class="iconfont icon-fenlei category-icon"></text>
          <text class="category-name">{{ category.title }}</text>
        </view>
      </scroll-view>

      <!-- 右侧商品区域 -->
      <scroll-view class="goods-area" scroll-y>
        <!-- 分类信息 -->
        <view class="category-info">
          <!-- 分类图片（如果有） -->
          <image
              v-if="activeCategoryImg"
              class="category-img"
              :src="activeCategoryImg"
              mode="widthFix"
          />

          <view class="info-wrapper">
            <view class="category-name-wrapper">
              <text class="iconfont icon-tag category-tag-icon"></text>
              <text class="category-title">{{ activeCategoryTitle }}</text>
            </view>
            <view class="category-count">共 {{ goodsList.length }} 件商品</view>
          </view>
        </view>

        <!-- 加载状态 -->
        <view v-if="loading" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">加载中...</text>
        </view>

        <!-- 商品列表 -->
        <view v-else>
          <view v-if="goodsList.length > 0" class="goods-list">
            <view
                v-for="goods in goodsList"
                :key="goods.id"
                class="goods-card"
                @click="goToGoodsDetail(goods.id)"
            >
              <image class="goods-image" :src="goods.thumb_path" mode="aspectFill" />
              <view class="goods-info">
                <text class="goods-title">{{ goods.title }}</text>
                <view class="goods-prices">
                  <text class="current-price">¥{{ goods.sell_price }}</text>
                  <text class="original-price">¥{{ goods.market_price }}</text>
                </view>
              </view>
            </view>
            <view class="no-more">
              <text class="no-more-text">—— 没有更多了 ——</text>
            </view>
          </view>

          <!-- 无数据提示 -->
          <view v-else class="no-data">
            <text class="iconfont icon-wushuju no-data-icon"></text>
            <text class="no-data-text">暂无商品数据</text>
            <text class="no-data-hint">该分类下暂无商品，请选择其他分类</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import GoodsApi from '@/api/goods';
import NavLogo from "@/components/NavLogo.vue";
import {onShow} from "@dcloudio/uni-app";
import {showCarBadge} from "@/utils/showCarBadge";

// 响应式数据
const categories = ref([]);
const activeCategoryId = ref(null);
const activeCategoryTitle = ref('全部商品');
const activeCategoryImg = ref('');
const goodsList = ref([]);
const loading = ref(true);

// 获取商品分类
const fetchCategories = async () => {
  try {
    const res = await GoodsApi.getGoodsCategory()
    categories.value = res;

    // 默认选中第一个分类
    if (res.length > 0) {
      selectCategory(res[0]);
    }
  } catch (error) {
    console.error('获取分类失败:', error);
  }
};

// 获取分类商品
const fetchGoodsByCategory = async (categoryId) => {
  loading.value = true;
  try {
    const res = await GoodsApi.getGoodsByCategory(categoryId)
    goodsList.value = res;
  } catch (error) {
    console.error('获取商品失败:', error);
    goodsList.value = [];
  } finally {
    loading.value = false;
  }
};

// 选择分类
const selectCategory = (category) => {
  activeCategoryId.value = category.id;
  activeCategoryTitle.value = category.title;
  // 设置分类图片（如果存在）
  activeCategoryImg.value = category.img_url && category.img_url.trim() !== '' ? category.img_url : '';
  fetchGoodsByCategory(category.id);
};

// 跳转到商品详情
const goToGoodsDetail = (goodsId) => {
  uni.navigateTo({
    url: `/subpackages/detail/pages/goods-detail?value=${goodsId}`
  })
}

// 初始化
onMounted(() => {
  fetchCategories();
});

onShow(() => {
  showCarBadge()
})
</script>

<style lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #FFFFFF;

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .sidebar {
      width: #{px2rpx(50)};
      background-color: #fff;
      border-right: #{px2rpx(1)} solid #eee;

      .category-item {
        padding: #{px2rpx(24)} #{px2rpx(10)};
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 13px;
        color: #666;
        border-left: #{px2rpx(4)} solid transparent;
        transition: all 0.2s;

        .category-icon {
          margin-bottom: #{px2rpx(8)};
          font-size: 20px;
        }

        &.active {
          border-left-color: #ffd43b;
          background-color: #fffaf0;
          color: #e67e22;
          font-weight: bold;

          .category-name {
            font-weight: bold;
          }
        }
      }
    }

    .goods-area {
      flex: 1;

      .category-info {
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-bottom: #{px2rpx(1)} solid #f0f0f0;

        .category-img {
          width: 95%;
          height: auto;
          margin: px2rpx(8);
        }

        .info-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: #{px2rpx(20)} #{px2rpx(24)};

          .category-name-wrapper {
            font-size: 16px;
            font-weight: bold;
            color: #333;

            .category-tag-icon {
              margin-right: #{px2rpx(8)};
              color: #e67e22;
            }
          }

          .category-count {
            font-size: 12px;
            color: #999;
            background-color: #f0f7ff;
            padding: #{px2rpx(4)} #{px2rpx(16)};
            border-radius: #{px2rpx(20)};
          }
        }
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: #{px2rpx(80)} 0;

        .loading-spinner {
          width: #{px2rpx(60)};
          height: #{px2rpx(60)};
          border: #{px2rpx(6)} solid #f3f3f3;
          border-top: #{px2rpx(6)} solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: #{px2rpx(20)};
        }

        .loading-text {
          font-size: 14px;
          color: #999;
        }
      }

      .goods-list {
        display: flex;
        flex-direction: column;
        gap: #{px2rpx(20)};
        padding: #{px2rpx(20)};

        .goods-card {
          display: flex;
          background-color: #fff;
          border-radius: #{px2rpx(16)};
          overflow: hidden;
          box-shadow: 0 #{px2rpx(4)} #{px2rpx(12)} rgba(0, 0, 0, 0.05);

          .goods-image {
            width: #{px2rpx(100)};
            height: #{px2rpx(100)};
            background-color: #f8f9fa;
            border-bottom-right-radius: #{px2rpx(16)}; /* 右下角圆角 */
          }

          .goods-info {
            flex: 1;
            padding: #{px2rpx(20)};
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .goods-title {
              font-size: 14px;
              color: #333;
              line-height: 1.4;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .goods-prices {
              display: flex;
              align-items: center;
              margin-top: #{px2rpx(16)};

              .current-price {
                font-size: 16px;
                font-weight: bold;
                color: #e74c3c;
                margin-right: #{px2rpx(12)};
              }

              .original-price {
                font-size: 12px;
                color: #999;
                text-decoration: line-through;
                margin-right: #{px2rpx(4)};
              }
            }
          }
        }
      }

      .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: #{px2rpx(100)} #{px2rpx(40)};
        text-align: center;

        .no-data-icon {
          font-size: #{px2rpx(80)};
          color: #ddd;
          margin-bottom: #{px2rpx(30)};
        }

        .no-data-text {
          font-size: 16px;
          color: #666;
          margin-bottom: #{px2rpx(16)};
        }

        .no-data-hint {
          font-size: 13px;
          color: #999;
        }
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-more {
  padding: px2rpx(30);
  text-align: center;
  color: #999;
  font-size: px2rpx(16);

  .no-more-text {
    display: block;
  }
}
</style>