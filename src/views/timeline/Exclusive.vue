<template>
    <div ref="messagesContainer" class="flex flex-col p-4 h-[75%] overflow-auto relative" :class="{'blur-md' : !isPremium}">
        
        <div v-if="isPremium" v-for="item in premium_message" :key="item.id" class="my-2 flex justify-start">
            <div class="chat-bubble-container">
                <!-- Single chat-bubble for both text and media -->
                <div class="chat-bubble">

                    <!-- Media -->
                    <template v-if="item.media_type === 'photo'">
                        <img :src="item.media_url" alt="timeline" class="w-full h-auto max-w-[250px] mt-2 rounded-md" />
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
        <div v-else class="">
            
            <div class="chat-bubble-container ">
                <!-- Single chat-bubble for both text and media -->
                <div class="chat-bubble">

                    <!-- Media -->
                    <template v-if="mock.media_type === 'photo'">
                        <img :src="mock.media_url" alt="timeline" class="w-full h-auto max-w-[250px] mt-2 rounded-md" />
                    </template>

                    <template v-else-if="mock.media_type === 'video'">
                        <video controls class="w-full h-auto max-w-[250px] mt-2 rounded-md">
                            <source :src="mock.media_url" :type="mock.mime_type || 'video/mp4'" />
                            Your browser does not support the video tag.
                        </video>
                    </template>

                    <template v-else-if="mock.media_type === 'voice'">
                        <audio controls class="w-full mt-2">
                            <source :src="mock.media_url" :type="mock.mime_type || 'audio/mpeg'" />
                            Your browser does not support the audio tag.
                        </audio>
                    </template>
                    <p v-if="mock.text" class="text-sm text-white whitespace-pre-wrap" v-html="linkify(mock.text)">
                    </p>
                </div>

                <!-- Timestamp -->
                <p class="text-xs text-gray-500 text-left mt-1 pl-2">
                    {{ convertDate(mock.timestamp) }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTelegramStore } from '@/stores/matrix/telegram';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, ref, watch } from 'vue';


const telegramStore = useTelegramStore();
const { premium_message , isPremium } = storeToRefs(telegramStore);
const messagesContainer = ref(null);

const mock = { "message_id": 140, "chat_id": -4627181603, "sender": "Adarsh", "text": `10 Days Live Trading plan Special Offer @3299👇👇\n\n\nhttps://rpy.club/g/b55smMbczu\n\nFOR ANY QUERIES MESSAGE ON WHATSAPP 👇👇👇\n\nhttps://api.whatsapp.com/send?phone=919081981215`, "timestamp": 1747049465, "media_type": "photo", "media_url": "https://api.telegram.org/file/bot8143620007:AAFf3pclNWx_dZCSYV-hmeWsK99JTX-oqKg/photos/file_23.jpg" }

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
}

// Scroll to bottom when messages array changes
watch(() => premium_message.value.length, () => {
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