<template>
    <section class="border-l border-white/15 w-full xl:max-w-[350px] h-full xl:min-w-[350px] relative">
        <div class="absolute z-50 bottom-0 w-full text-center backdrop-blur-xl">
            <PremiumButton />
            <button @click="router.push('/telegram-premium')">
                <p class=" w-full text-center text-custom-blue p-1.5 rounded-lg transition-all duration-300 text-sm">
                    View Benifits</p>
            </button>
        </div>
        <div class="flex items-center justify-between py-2 px-4 border-b border-white/10">
            <h1 class="font-bold text-lg">Get. Set. Trade.</h1>
            <button @click="isOpen = true"
                class="gap-2  rounded-lg flex items-center justify-center small-btn-gradient">
                <div class="w-8 h-8">
                    <LottieAnimation animationPath="/src/assets/animation/arrow.json" />
                </div>
            </button>
        </div>
        <div class="flex px-4 gap-2 border-b border-white/15">
            <button @click="activeTab = 'all'" class="text-custom-blue transition-all duration-200 p-2 text-sm"
                :class="{ 'border-b-2 border-custom-blue ': activeTab == 'all', 'border-b-2 border-white/0': activeTab != 'all' }">
                All
            </button>
            <button @click="activeTab = 'premium'"
                class="p-2 text-custom-blue transition-all duration-200 text-sm flex gap-1 items-center justify-center"
                :class="{ 'border-b-2 border-custom-blue ': activeTab == 'premium', 'border-b-2 border-white/0': activeTab != 'premium' }">
                <img src="/src/assets/svg/shine.svg" alt="">
                <p>Exclusive</p>
            </button>
        </div>
        <div v-if="activeTab == 'all'" ref="messagesContainer" class="flex flex-col p-4 h-[75%] overflow-auto">
            <div v-for="item in messages" :key="item.id" class="my-2 flex justify-start">
                <div class="chat-bubble-container">
                    <!-- Single chat-bubble for both text and media -->
                    <div class="chat-bubble">

                        <!-- Media -->
                        <template v-if="item.media_type === 'photo'">
                            <img :src="item.media_url" alt="timeline"
                                class="w-full h-auto max-w-[250px] mt-2 rounded-md" />
                        </template>

                        <template v-else-if="item.media_type === 'video'">
                            <video controls class="w-full h-auto max-w-[250px] mt-2 rounded-md">
                                <source :src="item.media_url" :type="item.mime_type || 'video/mp4'" />
                                Your browser does not support the video tag.
                            </video>
                        </template>

                        <template v-else-if="item.media_type === 'voice'">
                            <audio controls class="w-full mt-2">
                                <source :src="item.media_url" :type="item.mime_type || 'audio/mpeg'" />
                                Your browser does not support the audio tag.
                            </audio>
                        </template>
                        <p v-if="item.text" class="text-sm text-white whitespace-pre-wrap" v-html="linkify(item.text)">
                        </p>
                    </div>

                    <!-- Timestamp -->
                    <p class="text-xs text-gray-500 text-left mt-1 pl-2">
                        {{ convertDate(item.timestamp) }}
                    </p>
                </div>
            </div>
        </div>
        

    </section>

    <TelgramPopup v-model="isOpen" />
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import TelgramPopup from '@/components/TelgramPopup.vue';
import { useTelegramStore } from '@/stores/matrix/telegram';
import { storeToRefs } from 'pinia';
import LottieAnimation from './LottieAnimation.vue';
import PremiumButton from './PremiumButton.vue';
import router from '@/router';

const telegramStore = useTelegramStore();
const { messages } = storeToRefs(telegramStore);

const isOpen = ref(false);
const activeTab = ref('all');
const messagesContainer = ref(null);

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
}

// Scroll to bottom when messages array changes
watch(() => messages.value.length, () => {
    scrollToBottom();
});

// Initial scroll to bottom when component is mounted
onMounted(() => {
    scrollToBottom();
});

function convertDate(timestamp) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const weekday = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');

    return `${weekday}, ${day} ${month} ${year} ${hour}:${minute}`;
}

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-custom-blue underline">${url}</a>`;
    });
}

</script>

<style scoped>
.chat-bubble-container {
    display: flex;
    flex-direction: column;
}

.chat-bubble {
    position: relative;
    width: fit-content;
    background-color: #ffffff22;
    /* WhatsApp dark color for received messages */
    color: white;
    border-radius: 0.75rem;
    border-bottom-left-radius: 0;
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.25rem;
    box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
}

.chat-bubble::before {
    content: "";
    position: absolute;
    opacity: 0;
    bottom: -1px;
    left: -7px;
    height: 15px;
    width: 20px;
    background-color: #15A2DF;
    clip-path: polygon(78% 34%, 100% 0, 100% 35%, 100% 70%, 100% 100%, 50% 100%, 0 100%, 23% 88%, 46% 70%, 63% 54%);
    border-bottom-right-radius: 15px;
    transform: translateY(0px);
}

/* Optional: Add animation for new messages */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chat-bubble {
    animation: fadeIn 0.3s ease-in-out;
}
</style>