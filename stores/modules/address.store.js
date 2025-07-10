import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
    const defaultAddress = ref(null)
    const currentAddress = ref(null)

    const setDefaultAddress = (address) => {
        defaultAddress.value = address
    }
    const setCurrentAddress = (address) => {
        currentAddress.value = address
    }
    return {
        defaultAddress,
        currentAddress,
        setDefaultAddress,
        setCurrentAddress
    }
})