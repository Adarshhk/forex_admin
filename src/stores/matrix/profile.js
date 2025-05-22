import { ref } from 'vue';
import { defineStore } from 'pinia';

import { makeRequest,state, setRole } from "../../requests/requests";
import { useTickerStore } from './ticker/ticker';
export const useProfileStore = defineStore('profiles', () => {

  const tickerStore = useTickerStore();
  const endpoint='profile'
  const wait=0
  const profile = ref({});
  const userInfo = ref({});
  const currentPage = ref(1);

  const checkStep = ref(1);
  const selectedPlan = ref('');
  const explorePlan = ref(false);
 




  async function getUserInfo(refresh=false) {
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
          profile.value = response.data;
          setRole(profile.value.role);
          if(profile.value.profile_picture_url == "" || profile.value.profile_picture_url == "images/user/defaultuser.png" || profile.value.profile_picture_url == "imagesuser/user/defaultuser.png"){
            // profile.value_picture_url= "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            profile.value.profile_picture_url= "/imgs/defaultImg.png"
          }
          tickerStore.startWebSocket(profile.value.id)
        }else{
          profile.value = {};
        }
    } catch (error) {
      throw error;
    }
  }

  const updateProfile = async (form) => {
    try {
      const res = await makeRequest(endpoint , 'PUT' , form);
      if(res)
      {
          return res;
      }
    } catch (error) {
      console.log(error , 'Error in profile Store');
    }
  }

  const changePassword = async (form) => {
    try {
      const res = await makeRequest('changePassword' , 'PUT' , form)
      if(res)
      {
         return res;
      }
    } catch (error) {
      console.log(error , 'Error in changing password')
    }
  }

  getUserInfo()
  // Other store actions and properties here...
 
  return {
    getUserInfo,
    userInfo,
    updateProfile,
    profile,
    currentPage,
    changePassword,
    state,
    endpoint,
    checkStep,
    selectedPlan,
    explorePlan
  };
});
