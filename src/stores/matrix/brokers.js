import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest, state } from "@/requests/requests";

export const useBrokerIndexStore = defineStore('brokers', () => {

    const endpoint = 'brokers'
    const wait = 0
    const brokers = ref([]);
    const showAddEditModal = ref(false);

    const editBrokerData = ref(null)
    const showDeleteConfirmationModal = ref(null);
    const idForDelete = ref(null);
    const brokerFilterValue = ref([]);
    const userBrokers = ref([]);

    async function getBrokers(refresh = false) {
        if (refresh) {
            state[endpoint] = {
                loading: true,
                data: null,
                error: {},
                updating: false
            }
        }

        try {
            const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait);
            if (response === 'abort') return
            brokers.value = response.data
            if (response.data) {
                const todayDate = new Date().toLocaleDateString('en-CA'); // Format: YYYY-MM-DD

                let data = response.data || []

                // Add today_token_generated field
                if (data.length > 0) {

                    data = data.map(broker => {
                        const brokerDate = broker.broker_token_date
                            ? new Date(broker.broker_token_date.replace("Z", "")).toLocaleDateString('en-CA')
                            : null;
                        return {
                            ...broker,
                            today_token_generated: brokerDate === todayDate
                        };
                    });
                }
                brokerFilterValue.value = getUniqueBrokers(brokers.value);
                // brokers.value = data;
            } else {
                brokers.value = [];
            }

        } catch (error) {
            console.error('Error fetching brokers:', error);
            throw error;
        }
    }

    const findBrokerById = (id) => {
        return brokers.value.find((broker) => broker.id === id);
    };

    function getUniqueBrokers(brokers) {
        const uniqueMap = new Map();

        brokers.forEach(b => {
            if (b.id && b.broker_name && !uniqueMap.has(b.id)) {
                uniqueMap.set(b.id, {
                    id: b.id,
                    broker_name: b.broker_name
                });
            }
        });

        return Array.from(uniqueMap.values());
    }

    // deleteBroker function delete broker from db
    async function deleteBroker() {
        try {
            const res = await makeRequest(endpoint, "DELETE", {}, {}, {}, 0, idForDelete.value);
            return res;
        } catch (error) {
            console.error('Error deleteting broker:', error);
            throw error;
        }
    }


    // addEditBroker function edit broker
    async function addEditBroker(id, formdata) {
        try {
            if (id) {
                //edit:data
                const res = await makeRequest(endpoint, "PUT", formdata, {}, {}, 0, id);
                return res;
            } else {
                //add:data
                const res = await makeRequest(endpoint, "POST", formdata, {}, {}, 0, null);
                return res;
            }


        } catch (error) {
            console.error('Error fetching brokers:', error);
            throw error;
        }
        finally {
            editBrokerData.value = null
        }
    }

    const connectBroker = async (id) => {
        try {
            const res = await makeRequest(endpoint, 'PUT', {}, {}, {}, 0, id, 'connect');
            if (res) {
                return res;
            }
        } catch (error) {
            console.log(error, 'Error in connecting broker')
        }
    }

    const getBrokerByUserId = async (userId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, userId, 'users');
      if (res.data) {
        userBrokers.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in broker store.')
    }
  }

    getBrokers();

    return {
        getBrokers,
        findBrokerById,
        brokers,
        getBrokerByUserId,
        userBrokers,
        deleteBroker,
        showAddEditModal,
        addEditBroker,
        editBrokerData,
        endpoint,
        state,
        showDeleteConfirmationModal,
        idForDelete,
        connectBroker,
        brokerFilterValue
    };
});