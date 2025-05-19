import { makeRequest } from "@/requests/requests";
import { defineStore } from "pinia"
import { ref } from "vue"

export const useWatchlistStore = defineStore('watchlist', () => {
    const endpoint = 'watchlist'

    const watchlists = ref([]);
    const selectedWatchlist = ref({});
    const idToDelete = ref(null);
    const watchlistToEdit = ref(null);

    const getWatchlists = async () => {
        try {
            const res = await makeRequest(endpoint, 'GET');
            if (res.data) {
                watchlists.value = res.data;
                if (watchlists.value.length > 0) {

                    selectedWatchlist.value = watchlists.value[0]
                }
            }
        } catch (error) {
            console.log('Error in watchlist store', error);
        }
    }

    const addEditWatchlist = async (form) => {
        try {
            if (watchlistToEdit.value) {
                const res = await makeRequest(endpoint, 'PUT', form, {}, {}, 0, watchlistToEdit.value.id);
                watchlistToEdit.value = null
                return res;

            }
            else {
                const res = await makeRequest(endpoint, 'POST', form);
                return res;
            }

        } catch (error) {
            console.log('Error in watchlist store', error);
        }

    }

    const deleteWatchlist = async () => {
        try {
            if (idToDelete.value) {
                const res = await makeRequest(endpoint, 'DELETE', {}, {}, {}, 0, idToDelete.value)
                if (res) {
                    idToDelete.value = null
                }
            }

        }
        catch (error) {
            console.log('Error in watchlist store', error);
        }
    }

    getWatchlists();

    return {
        watchlists,
        watchlistToEdit,
        selectedWatchlist,
        addEditWatchlist,
        getWatchlists,
        deleteWatchlist,
        idToDelete,
    }
})