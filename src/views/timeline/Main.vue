<template>
    <section class="border-l border-white/15 w-full xl:max-w-[350px] h-full xl:min-w-[350px] relative">
        <div :class="{'bottom-0 backdrop-blur-xl' : activeTab == 'all' , 'top-1/2' : activeTab == 'premium'}" class="absolute z-50 w-full text-center ">
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


        <General v-if="activeTab == 'all'" />
        <Exclusive v-if="activeTab == 'premium'" />
    </section>

    <TelgramPopup v-model="isOpen" />
</template>

<script setup>
import LottieAnimation from '@/components/LottieAnimation.vue';
import PremiumButton from '@/components/PremiumButton.vue';
import TelgramPopup from '@/components/TelgramPopup.vue';
import Timeline from '@/components/Timeline.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import General from './General.vue';
import Exclusive from './Exclusive.vue';


const router = useRouter();
const isOpen = ref(false);
const activeTab = ref('all')
</script>