import { defineStore } from 'pinia'
import { ref } from 'vue'

// 建议根据功能命名store，这里是搜索历史所以用useSearchHistoryStore
export const useSearchHistoryStore = defineStore('searchHistory', () => {
    // State
    const history = ref([])
    const hotKeywords = ref(['手机', '电脑', '耳机', '衣服'])

    // Actions
    function addHistory(keyword) {
        // 新增类型检查：确保只存储字符串
        if (typeof keyword !== 'string') {
            console.warn('Invalid keyword type:', typeof keyword, keyword)
            return;
        }
        // 去重 - 使用.value访问ref
        history.value = history.value.filter(item => item !== keyword)
        // 添加到开头
        history.value.unshift(keyword)
        // 限制数量
        if (history.value.length > 10) {
            history.value.pop()
        }
    }

    function clearHistory() {
        history.value = []
    }

    return {
        history,
        hotKeywords,
        addHistory,
        clearHistory
    }
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'searchHistory',
                paths: ['history'] // 只持久化history
            }
        ]
    }
})