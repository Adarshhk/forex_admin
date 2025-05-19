import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { storeToRefs } from "pinia";


export const usePlaceOrderStore = defineStore('positions', () => {

    const selectedOrderType = ref(null)
    const selectedStockId = ref(null)
    const selectedOrder = ref({})


    return{
        selectedOrder,
        selectedOrderType,
        selectedStockId
    }
})