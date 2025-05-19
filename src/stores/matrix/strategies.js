import { computed, ref, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";
import axios from 'axios';

export const useStrategiesStore = defineStore('strategies', () => {
    const endpoint = "strategies";
    const wait= 0
    const strategies = ref([]);
    const idToDelete = ref(null);
    const strategyToEdit = ref(null);

    
    async function getStrategies(refresh=false) {
        if(refresh){
            state[endpoint]={
              loading: true,
              data: null,
              error: {},
              updating:false
            }
          }
        try {
            const response = await makeRequest(endpoint , 'GET');
            if(response.data)
            {
                strategies.value = response.data;

            }

        } catch (error) {
            console.error('Error fetching strategies:', error);
            throw error;
        }
    }

    const addEditStrategy = async (form) => {
        try {
            let res;
            if(strategyToEdit.value)
            {
                res = await makeRequest(endpoint , 'PUT' , form , {} , {} , 0 , strategyToEdit.value.id); 
            }
            else res = await makeRequest(endpoint , 'POST' , form);

            return res;
        } catch (error) {
            console.log('Error in strategy store' , error);
        }
    }

    const deleteStrategy = async () => {
        try {
            
            if(idToDelete.value)
            {
                const res = await makeRequest(endpoint , 'DELETE' , {} , {} , {} , 0 , idToDelete.value); 
                if(res)
                {

                    return res;
                }
            }
        } catch (error) {
            console.log('Error in strategy store' , error);
        }
    }

    getStrategies()
    return {
        strategies,
        getStrategies,
        idToDelete,
        strategyToEdit,
        addEditStrategy,
        deleteStrategy,
        state,
        endpoint
    };
});
