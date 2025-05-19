import { defineStore } from "pinia"
import { ref } from "vue"

export const useTelegramStore = defineStore('telegram' , () => {

    const isPremium = ref(false);
    const messages = ref([]);
    const premium_message = ref([]);
    return {
        isPremium,
        premium_message,
        messages
    }
})