"use strict";
const common_vendor = require("../../common/vendor.js");
const useCartStore = common_vendor.defineStore("cart", {
  state: () => ({
    items: []
    // 购物车商品数组
  }),
  getters: {
    // 计算商品总数（自动缓存）
    totalCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0)
  },
  actions: {
    // 添加专用action修改状态
    addItem(item) {
      this.items.push(item);
    },
    clearCart() {
      this.items = [];
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "cart",
        paths: ["items"]
        // 只持久化items数组
      }
    ]
  }
});
exports.useCartStore = useCartStore;
