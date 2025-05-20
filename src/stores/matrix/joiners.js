import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useJoinerStore = defineStore('joiners' , () => {
    const joiners = ref([]);
    const endpoint = 'joiners'
   
    const selectedStrategy = ref({});
    const strategyJoiners = ref([]);
    const userJoiners = ref([]);

    const getJoiners = async () => {
        try {
            const res = await makeRequest(endpoint , 'GET');
            if(res.data)
            {
                joiners.value = res.data;
            }
        } catch (error) {
            console.log('error in joiner store' , error);
        }
    }

    
    const addJoinerToStrategy = async (brokerId) => {
        try {
            const res = await makeRequest(endpoint , 'POST' , {broker_account_id : brokerId , strategy_id : selectedStrategy.value.id})

        } catch (error) {
            console.log('error in my joiner store' , error);
        }
    }

    const editJoinerQuantity = async (form) => {
        try {
            const res = await makeRequest(endpoint , 'PUT' , {quantity : form.quantity} , {} , {} , 0 , form.id);
            
        } catch (error) {
            console.log('error in my joiner store' , error);
        }
    }

    const editJoiner = async (form , id) => {
        try {
            const res = await makeRequest(endpoint , 'PUT' , form , {} , {} , 0 , id);
            
        } catch (error) {
            console.log('error in my joiner store' , error);
        }
    }

    const deleteSelectedJoiners = async (form) => {
        try {
            const res = await makeRequest(endpoint , 'POST' , {joiner_id : form} , {} , {} , 0 , null , 'delete')

        } catch (error) {
            console.log('error in my joiner store' , error);
        }
    }

    const getJoinersByStrategyId = async (strategyId) => {
        try {
            const res = await makeRequest(endpoint , 'GET' , {} , {} , {} , 0 , strategyId , 'strategy');
            if(res.data)
            {
                strategyJoiners.value = res.data;
            }
        } catch (error) {
            console.log('error in my joiner store' , error);
        }
    }

    const getJoinerByUserId = async (userId) => {
        try {
            const res = await makeRequest(endpoint , 'GET' , {} , {} , {} , 0 , userId , 'users');
            if(res.data)
            {
                userJoiners.value = res.data;
            }
        } catch (error) {
            console.log('error in my joiner store' , error);
        }
    }

    getJoiners();
    return {
        joiners,
        getJoiners,
        addJoinerToStrategy,
        selectedStrategy,
        editJoinerQuantity,
        getJoinersByStrategyId,
        getJoinerByUserId,
        userJoiners,
        strategyJoiners,
        editJoiner,
        deleteSelectedJoiners
    }
})