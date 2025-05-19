import { ref } from 'vue';
import { defineStore } from 'pinia';

import { makeRequest,state } from "../../requests/requests";
export const useInvoiceStore = defineStore('invoice', () => {
  const endpoint='invoice'
  const wait=0
  const invoices = ref([]);
  const showCreateInvoiceModal = ref(false);
  const showInvoiceReceiptModal = ref(false);
  const invoiceData = ref(null);
  const editInvoiceData = ref(null);
  const invoiceId = ref(null);
  const isPaymentProofOpen = ref(false)
 

  


  async function getInvoices(refresh=false) {
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
          invoices.value = response.data.sort((a, b) => a.id - b.id);
          
        }else{
          invoices.value = [];
        }
    } catch (error) {
      throw error;
    }
  }


 

  getInvoices();


  return {
    getInvoices,
    invoices,
    showCreateInvoiceModal,
    showInvoiceReceiptModal,
    invoiceData,
    editInvoiceData,
    state,
    endpoint,
    invoiceId,
     isPaymentProofOpen
  };
});
