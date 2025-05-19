import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest, state } from "../../requests/requests";

export const useSubscriptionStore = defineStore('subscription', () => {
  const endpoint = 'subscription'
  const wait = 0
  const subscriptions = ref([]);
  const editSubscriptionDate = ref(null);
  const idForDelete = ref(null);
  const userSubscriptions = ref([]);

  async function getSubscriptionInfo() {

    try {
      const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait);
      if (response === 'abort') return

      if (response.data) {
        subscriptions.value = response.data || [];
      } else {
        subscriptions.value = [];
      }
    } catch (error) {
      throw error;
    }
  }

  async function addEditSubscriptions(id, formdata) {
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
      console.error('Error in subscriptionStore:', error);
      throw error;
    }
    finally {
      editSubscriptionDate.value = null
    }
  }

  // deleteBroker function delete broker from db
  async function deleteSubscription() {
    try {
      const res = await makeRequest(endpoint, "DELETE", {}, {}, {}, 0, idForDelete.value);
      return res;
    } catch (error) {
      console.error('Error deleteting subscription:', error);
      throw error;
    }
  }

  const getSubscriptionByUserId = async (userId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, userId, 'users');
      if (res.data) {
        userSubscriptions.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in  order store.')
    }
  }

  getSubscriptionInfo();
  return {
    getSubscriptionInfo,
    subscriptions,
    getSubscriptionByUserId,
    userSubscriptions,
    addEditSubscriptions,
    deleteSubscription,
    idForDelete,
    editSubscriptionDate,
    endpoint,
  };
});
