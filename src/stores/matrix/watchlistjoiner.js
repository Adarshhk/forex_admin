import { makeRequest } from "@/requests/requests";
import { defineStore, storeToRefs } from "pinia"
import { ref } from "vue"
import { useTickerStore } from "./ticker/ticker";

export const useWatchlistJoinerStore = defineStore('watchlist_joiners', () => {
    const endpoint = 'watchlistJoiners'

    const watchlistJoiners = ref([]);
    const idToDelete = ref(null)
    const tickerStore = useTickerStore();

    const getWatchlistJoiners = async () => {
        try {
            const res = await makeRequest(endpoint, 'GET');
            if (res.data) {
                watchlistJoiners.value = res.data;

            }
            if(watchlistJoiners.value.length > 0)
            {
                const symbols = watchlistJoiners.value.map(joiner => {
                    return joiner.symbol
                })
                tickerStore.updateTickerList(symbols)
                tickerStore.subscribe();
            }
        } catch (error) {
            console.log('Error in watchlist joiner store', error);
        }
    }

    const addWatchlistJoiner = async (form) => {
        try {
            const res = await makeRequest(endpoint, 'POST', form);
            return res;
        } catch (error) {
            console.log('Error in watchlist joiner store', error);
        }
    }

    const deleteJoiner = async () => {
        if(idToDelete.value)
        {
            const res = await makeRequest(endpoint , 'DELETE' , {} , {} , {} , 0 , idToDelete.value);
            if(res)
            {
                idToDelete.value = null;
                return res;
            }
        }
    }

    getWatchlistJoiners();

    return {
        deleteJoiner,
        getWatchlistJoiners,
        watchlistJoiners,
        addWatchlistJoiner,
        idToDelete,
    }
})