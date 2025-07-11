import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
    const defaultAddress = ref(null)
    const currentAddress = ref(null)

    const setDefaultAddress = (address) => {
        defaultAddress.value = address
        if (!currentAddress.value) {
            currentAddress.value = address
        }
    }
    const setCurrentAddress = (address) => {
        currentAddress.value = address
    }

    const clearCurrentAddress = () => {
        currentAddress.value = null
    }

    const updateAddressList = (list) => {
        const defaultAddr = list.find(item => item.isDefault) || null
        setDefaultAddress(defaultAddr)

        // 如果当前地址存在，更新其数据
        if (currentAddress.value) {
            const updatedCurrent = list.find(item => item.id === currentAddress.value.id)
            if (updatedCurrent) {
                setCurrentAddress(updatedCurrent)
            }
        }
    }

    return {
        defaultAddress,
        currentAddress,
        setDefaultAddress,
        setCurrentAddress,
        clearCurrentAddress,
        updateAddressList
    }
})