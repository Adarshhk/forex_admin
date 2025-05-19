import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "../../requests/requests";



export const useMyStrategiesStore = defineStore('mystrategies', () => {
    
    const endpoint='mystrategies'
    const wait=0
    const myStrategies = ref([]);
    let showAddEditModal = ref(false);
    const editMyStrategyData= ref({})
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    let joinStrategyId = ref(null);
    const strategyData = ref({});
    const isEditStrategiesOpen = ref(false)
    const deployedStrategiesFunds = ref(0);

    async function getMyStrategies(refresh=false) {
        if(refresh){
            state[endpoint]={
              loading: true,
              data: null,
              error: {},
              updating:false
            }
          }
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
            if(response === 'abort') return
            
            if (response.data){
                myStrategies.value = response.data.sort((a, b) => a.id - b.id);
            }else{
                myStrategies.value = [];
            }
        } catch (error) {
            myStrategies.value = [];
            console.error('Error fetching mystrategies:', error);
            throw error;
        }
    }

    // deleteMyStrategy function delete MyStrategy from db
    async function deleteMyStrategy(id) {
        try {
            idForDelete.value=null;
            await makeRequest(endpoint, "DELETE",{}, {}, {},wait,id);
              
        } catch (error) {
            console.error('Error deleteting MyStrategy:', error);
            throw error;
        }
    }


    // addEditMyStrategy function edit MyStrategy
    async function addEditMyStrategy(id,formdata) {
        try {
            if (!joinStrategyId.value && id){
                //edit:data
                await makeRequest(endpoint, "PUT",formdata, {}, {},wait,id);
            }else {
                //add:data
                await makeRequest(endpoint, "POST",formdata, {}, {},wait, null);
            }
        } catch (error) {
            console.error('Error fetching mystrategies:', error);
            throw error;
        }
    }


    getMyStrategies();
    return {
        getMyStrategies,
        myStrategies,
        deleteMyStrategy,
        showAddEditModal,
        addEditMyStrategy,
        editMyStrategyData,
        endpoint,
        state,
        showDeleteConfirmationModal,
        idForDelete,
        joinStrategyId,
        strategyData,
        isEditStrategiesOpen,
        deployedStrategiesFunds
    };
});