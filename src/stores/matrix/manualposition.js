import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia"
import { ref } from "vue"

export const useManualPositionStore = defineStore('manual_position', () => {

    const endpoint = 'manualPosition';
    const manualPositions = ref([]);
    const brokerFilterValues = ref([]);
    const userPositions = ref([]);
    const strategyPositions = ref([]);

    const getManualPosition = async () => {

        try {
            const res = await makeRequest(endpoint, 'GET');

            if (res.data) {
                manualPositions.value = res.data;
                brokerFilterValues.value = getUniqueBrokers(manualPositions.value);
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
            const res = await makeRequest(endpoint, 'GET', {}, {}, {} , 0 , userId, 'users');
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

    getManualPosition()
    return {
        getManualPosition,
        getPositionByUserId,
        getPositionByStrategyId,
        strategyPositions,
        userPositions,
        manualPositions,
        brokerFilterValues,
    }
})