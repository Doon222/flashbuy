<!-- App.vue -->
<script setup>
import { watch } from "vue"
import {onLaunch} from "@dcloudio/uni-app";
import { useCartStore } from "@/stores/modules/cart.store"

const cartStore = useCartStore()

onLaunch(() => {
  // 直接监听 items 数组的变化
  watch(
      () => cartStore.items.length,
      () => updateBadge(),
      { deep: true } // 深度监听数组内容变化
  )

  // 初始化徽标
  updateBadge()
})

function updateBadge() {
  const count = cartStore.totalCount

  if (count > 0) {
    uni.setTabBarBadge({
      index: 2,
      text: count > 99 ? '99+' : count.toString()
    })
  } else {
    try {
      uni.removeTabBarBadge({ index: 2 })
    } catch(e) {
      console.warn('清除徽标失败:', e)
    }
  }
}
</script>