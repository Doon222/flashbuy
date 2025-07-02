"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_modules_cart_store = require("../../stores/modules/cart.store.js");
const _sfc_main = {
  __name: "cart",
  setup(__props) {
    const cartStore = stores_modules_cart_store.useCartStore();
    const mockAddCart = () => {
      cartStore.addItem({
        id: Date.now(),
        name: "测试商品",
        quantity: Math.floor(Math.random() * 5) + 1
      });
    };
    const clearCart = () => {
      cartStore.clearCart();
    };
    const testBadge = () => {
      common_vendor.index.setTabBarBadge({
        index: 2,
        text: cartStore.totalCount.toString()
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(mockAddCart),
        b: common_vendor.o(clearCart),
        c: common_vendor.o(testBadge)
      };
    };
  }
};
wx.createPage(_sfc_main);
