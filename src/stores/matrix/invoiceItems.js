import { ref } from 'vue';
import { defineStore } from 'pinia';

import { makeRequest,state } from "../../requests/requests";
export const useInvoiceItemsStore = defineStore('invoiceItems', () => {
  const endpoint='invoiceItems'
  const wait=0
  const invoiceItems = ref([]);
 


  async function getInvoiceItems() {
    try {
      
        const response = await makeRequest(endpoint, "GET",{}, {}, {},wait,null);
        if (response.data){
          invoiceItems.value = response.data.sort((a, b) => a.id - b.id);
          
        }else{
          invoiceItems.value = [];
        }
    } catch (error) {
      throw error;
    }
  }

  getInvoiceItems();

  return {
    getInvoiceItems,
    invoiceItems,
    state,
    endpoint
  };
});
