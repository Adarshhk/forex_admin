<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useStrategiesStore } from '@/stores/matrix/strategies.js';
import { useToastStore } from "@/stores/utils/toast";
import FirstDeploymentPopup from "@/components/FirstDeploymentPopup.vue";
import FirstDeploymentPopup2 from "@/components/FirstDeploymentPopup2.vue";
import Eligibilty from "@/components/Eligibilty.vue";
import StrategyCard from './StrategyCard.vue';
import { storeToRefs } from 'pinia';
import { useTelegramStore } from '@/stores/matrix/telegram';
import LottieAnimation from '@/components/LottieAnimation.vue';
import Totalpnl from '@/components/totalpnl.vue';
import EmptyState from '@/components/EmptyState.vue';

const strategiesStore = useStrategiesStore();
const { strategies } = storeToRefs(strategiesStore);
const toastStore = useToastStore();

const telegramStore = useTelegramStore();



const checkToast = () => {
  toastStore.addToast('Error', 'Successfully logged in!', 'error', 300000);
  toastStore.addToast('Success', 'Your request has been processed successfully', 'success', 300000);
  toastStore.addToast('Warning', 'Successfully logged in!', 'warning', 300000);
  toastStore.addToast('Random', 'Successfully logged in!', 'random', 300000);
};

</script>

<template>
  <main class="flex flex-col gap-2">
    <div class="">
      <div class="title-text flex items-center p-4 justify-between">
        <div>

          <h2>PnL (Profit and Loss)</h2>
          <p class="text-xs italic text-[#ffffff55]">
            This PNL data is the average of all trades placed across accounts or brokers.
          </p>
        </div>
        <!-- <p class="text-custom-green">+6357.09</p> -->
         <Totalpnl/>
      </div>
      
    </div>

    <div class="border-t  border-white/15 h-[80vh]">
      <div class="flex items-center justify-between  border-white/15 p-4">
        <h1 class="font-bold text-lg">Strategies Hub</h1>
        <div class="flex items-center space-x-4">
          <button 
            class="gap-2  rounded-lg flex items-center justify-center small-btn-gradient">
            <div class="w-8 h-8">
              <LottieAnimation animationPath="/src/assets/animation/arrow.json" />
            </div>
          </button>
        </div>
      </div>

      <div v-if="strategies.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-2 xl:pb-24 overflow-y-auto p-4">
        <StrategyCard :strategy="item" v-for="(item, index) in strategies" :key="index" />
      </div>
      <div v-else>
        <EmptyState/>
      </div>
    </div>

  </main>
</template>


<style scoped>
.text-gradient-top-bottom {
  background: linear-gradient(to bottom, #00C6FF, #0072FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>