import { ref } from 'vue';
import { defineStore } from 'pinia';

import { makeRequest,state } from "../../requests/requests";
export const useSocialStore = defineStore('social', () => {
  const endpoint='social'
  const wait=0
  const social = ref({});
  const userInfo = ref({});
  const currentPage = ref(1);
 




  async function getSocialInfo(refresh=false) {
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
        if (response.data){
          social.value = response.data;
         
        }else{
          social.value = {};
        }
    } catch (error) {
      throw error;
    }
  }


  // Other store actions and properties here...
  getSocialInfo();
  return {
    getSocialInfo,
    social,
    endpoint,
    userInfo,
    currentPage,
    state,
  };
});
