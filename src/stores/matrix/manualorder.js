import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia"
import { ref } from "vue"
import { useTickerStore } from "./ticker/ticker";

export const useManualOrderStore = defineStore('manual_order', () => {

    const endpoint = 'manualOrders';
    const manualOrders = ref([]);
    const brokerFilterValues = ref([]);
    const userManualOrders = ref([]);
    const strategyManualOrders = ref([]);
    const brokerOrders = ref([]);
    const tickerStore = useTickerStore();

    const getManualOrders = async () => {

        try {
            const res = await makeRequest(endpoint, 'GET');

            if (res.data) {
                manualOrders.value = res.data;
                brokerFilterValues.value = getUniqueBrokers(manualOrders.value);
                let tokensList = [];
                for (let i = 0; i < manualOrders.value.length; i++) {
                    tokensList.push(manualOrders.value[i].symbol);
                }
                tickerStore.updateTickerList(tokensList);
            }
        } catch (error) {
            console.log(error, 'Error in manual order store.')
        }
    }

    const getOrderByuserId = async (userId) => {
        try {
            const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, userId, 'users');
            if (res.data) {
                userManualOrders.value = res.data;
            }
        } catch (error) {
            console.log(error, 'Error in manual order store.')
        }
    }

    const getOrderByStrategyId = async (strategyId) => {
        try {
            const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, strategyId, 'strategy');
            if (res.data) {
                strategyManualOrders.value = res.data;
            }
        } catch (error) {
            console.log(error, 'Error in manual order store.')
        }
    }


    function getUniqueBrokers(orders) {
        const uniqueMap = new Map();

        orders.forEach(order => {
            if (order.broker_id && order.broker_name && !uniqueMap.has(order.broker_id)) {
                uniqueMap.set(order.broker_id, {
                    broker_id: order.broker_id,
                    broker_name: order.broker_name
                });
            }
        });

        return Array.from(uniqueMap.values());
    }

    const getOrderByBrokerId = async (brokerId) => {
        try {
            const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, brokerId, 'broker');
            if (res.data) {
                brokerOrders.value = res.data;
            }
        } catch (error) {
            console.log(error, 'Error in  order store.')
        }
    }

    getManualOrders();

    return {
        getOrderByBrokerId,
        brokerOrders,
        getManualOrders,
        getOrderByuserId,
        getOrderByStrategyId,
        strategyManualOrders,
        userManualOrders,
        manualOrders,
        brokerFilterValues,
    }
})