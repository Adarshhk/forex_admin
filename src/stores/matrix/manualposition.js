import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia"
import { ref } from "vue"
import { useTickerStore } from "./ticker/ticker";

export const useManualPositionStore = defineStore('manual_position', () => {

    const endpoint = 'manualPositions';
    const manualPositions = ref([]);
    const brokerFilterValues = ref([]);
    const userPositions = ref([]);
    const strategyPositions = ref([]);
    const brokerPositions = ref([]);
    const tickerStore = useTickerStore();

    const getManualPosition = async () => {

        try {
            const res = await makeRequest(endpoint, 'GET');

            if (res.data) {
                manualPositions.value = res.data;
                brokerFilterValues.value = getUniqueBrokers(manualPositions.value);
                let tokensList = [];
                for (let i = 0; i < manualPositions.value.length; i++) {
                    tokensList.push(manualPositions.value[i].symbol);
                }
                tickerStore.updateTickerList(tokensList);
            }
        } catch (error) {
            console.log(error, 'Error in manual order store.')
        }
    }


    function getUniqueBrokers(positions) {
        const uniqueMap = new Map();

        positions.forEach(pos => {
            if (pos.broker_id && pos.broker_name && !uniqueMap.has(pos.broker_id)) {
                uniqueMap.set(pos.broker_id, {
                    broker_id: pos.broker_id,
                    broker_name: pos.broker_name
                });
            }
        });

        return Array.from(uniqueMap.values());
    }


    const getPositionByUserId = async (userId) => {
        try {
            const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, userId, 'users');
            if (res.data) {
                userPositions.value = res.data;
            }
        } catch (error) {
            console.log(error, 'Error in position store.')
        }
    }

    const getPositionByStrategyId = async (strategyId) => {
        try {
            const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, strategyId, 'strategy');
            if (res.data) {
                strategyPositions.value = res.data;
            }
        } catch (error) {
            console.log(error, 'Error in position store.')
        }
    }

    const getPositionByBrokerId = async (brokerId) => {
        try {
            const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, brokerId, 'broker');
            if (res.data) {
                brokerPositions.value = res.data;
            }
        } catch (error) {
            console.log(error, 'Error in position store.')
        }
    }

    getManualPosition()
    return {
        getPositionByBrokerId,
        getManualPosition,
        getPositionByUserId,
        getPositionByStrategyId,
        strategyPositions,
        brokerPositions,
        userPositions,
        manualPositions,
        brokerFilterValues,
    }
})