import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest,state } from "@/requests/requests";


export const useVideosStore = defineStore('videos', () => {
    
  const endpoint='videos'
  const wait=0

    const videos = ref([]);
    const selectedVideo = ref({ id:'', url: '' });

    const autoPlayVideo = ref({});
    const isPopupOpen = ref(false);

    async function getVideos(refresh=false) {
        if(refresh){
            state[endpoint]={
              loading: true,
              data: null,
              error: {},
              updating:false
            }
          }
        try {
            const response = await makeRequest(endpoint, "GET",{}, {}, {},wait)
            if(response === 'abort') return
            
            if (response.data){
                videos.value = response.data;
            }else{
                videos.value = [];
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    }

    getVideos()
    return {
        getVideos,
        videos,
        endpoint,
        state,
        autoPlayVideo,
        isPopupOpen,
        selectedVideo
    };
});
