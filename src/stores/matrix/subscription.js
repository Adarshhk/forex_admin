import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest, state } from "../../requests/requests";

export const useSubscriptionStore = defineStore('subscription', () => {
  const endpoint = 'subscription'
  const wait = 0
  const subscriptions = ref([]);

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


  getSubscriptionInfo();
  return {
    getSubscriptionInfo,
    subscriptions,
    endpoint,
  };
});
