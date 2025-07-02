"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_modules_cart_store = require("./stores/modules/cart.store.js");
const stores_index = require("./stores/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/category/category.js";
  "./pages/user/user.js";
  "./pages/cart/cart.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const cartStore = stores_modules_cart_store.useCartStore();
    common_vendor.onLaunch(() => {
      common_vendor.watch(
        () => cartStore.items.length,
        () => updateBadge(),
        { deep: true }
        // 深度监听数组内容变化
      );
      updateBadge();
    });
    function updateBadge() {
      const count = cartStore.totalCount;
      if (count > 0) {
        common_vendor.index.setTabBarBadge({
          index: 2,
          text: count > 99 ? "99+" : count.toString()
        });
      } else {
        try {
          common_vendor.index.removeTabBarBadge({ index: 2 });
        } catch (e) {
          console.warn("清除徽标失败:", e);
        }
      }
    }
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(stores_index.pinia);
  return {
    app,
    pinia: stores_index.pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
