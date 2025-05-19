<template>
    <div class="bg-white/5 border-white/20 space-y-4 rounded-xl p-4">
        <!-- Moving Banner Integration -->
        <div class="w-full">
            <MovingBanner />
        </div>
        
        <div class="flex items-start gap-4 border-white/15 p-2 pt-0">
            <div class="w-[72px] rounded-md">
                <img src="/src/assets/img/strategy-icon.png" class="object-cover aspect-square" alt="">
            </div>
            <div class="flex justify-between w-full ">
                <div class="space-y-1">
                    <div class="flex items-center gap-1">
                        <p class="rounded-full bg-black px-2  py-1 text-[10px] border border-white/10 w-fit">Low Risk</p>
                        <p class="rounded-full bg-black px-2  py-1 text-[10px] border border-white/10 w-fit">Low Risk</p>
                    </div>
                    <p class="text-[16px] font-bold">{{ strategy.name}}</p>
                </div>
            </div>
        </div>

        <div class=" border-white/30 bg-white/5 rounded-xl grid grid-cols-3 p-2">
            <div class="text-center border-r-2 border-dotted border-white/15 p-2">
                <p class="text-white/50 text-sm">Min Cap</p>
                <p class="text-[16px] font-semibold">₹{{ strategy.min_capital }}</p>
            </div>
            <div class="text-center border-r-2 border-dotted border-white/15 p-2">
                <p class="text-white/50 text-sm">Win %</p>
                <p class="text-[16px] font-semibold">{{ strategy.win_percentage }}%</p>
            </div>
            <div class="text-center p-2">
                <p class="text-white/50 text-sm">R : R</p>
                <p class="text-[16px] font-semibold">{{ strategy.risk_reward }}</p>
            </div>
        </div>

        <div class="flex flex-col items-center justify-between mt-2 gap-2">
            <button v-if="!isSubscribed" @click="showPopup = true"
                class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p
                    class="bg-[#0B212C] hover:bg-[#0B212C]/30 w-full text-center m-[1px] p-1.5 rounded-lg transition-all duration-300 text-sm">
                    Subscribe Now</p>
            </button>
            <div v-else class="flex gap-2 w-full">
                <button disabled
                class="flex bg-[#0B212C]/60 items-center justify-center rounded-lg w-full border border-white/20">
                <p class="bg-[#0B212C]/60 w-full text-center m-[1px] p-1.5 rounded-lg transition-all duration-300 text-sm text-white/60">
                    Already Subscribed</p>
                </button>

                <button 
                class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p
                    class="bg-[#0B212C] hover:bg-[#0B212C]/30 w-full text-center m-[1px] p-1.5 rounded-lg transition-all duration-300 text-sm">
                    View Positions</p>
            </button>
            </div>
            <router-link to="/strategy-details"
                class="flex items-center justify-center rounded-lg w-full">
                <p
                    class=" w-full text-center text-custom-blue p-1.5 rounded-lg transition-all duration-300 text-sm">
                    Know More</p>
            </router-link>
        </div>
    </div>

    <FirstDeploymentPopup v-model="showPopup" v-if="false" />
    <FirstDeploymentPopup2 v-model="showPopup" v-if="true" @deploy="handleDeploy"/>
    <!-- <Eligibilty v-model="showPopup" v-if="true" /> -->
</template>

<script setup>
import FirstDeploymentPopup from '@/components/FirstDeploymentPopup.vue';
import FirstDeploymentPopup2 from '@/components/FirstDeploymentPopup2.vue';
import MovingBanner from '@/components/MovingBanner.vue';
import { useMyStrategiesStore } from '@/stores/matrix/myStrategies';
import { useProfileStore } from '@/stores/matrix/profile';
import { useStrategiesStore } from '@/stores/matrix/strategies';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const showPopup = ref(false);
const strategyStore = useStrategiesStore();
const profileStore = useProfileStore();
const myStrategyStore = useMyStrategiesStore();

const { myStrategies } = storeToRefs(myStrategyStore);

const isSubscribed = computed(() => {
  return myStrategies.value.some(strategy => strategy.id === props.strategy.id)
})
 
const { profile } = storeToRefs(profileStore);

const props = defineProps({
    strategy: {
        type: Object,
        required: true
    }
})

const handleDeploy = async () => {
    await strategyStore.subscribeStrategy(props.strategy.id, profile.value.user_id)
    showPopup.value = false;
}
</script>

<style lang="scss" scoped>
/* Ensure no conflicting styles are overriding the animation */
</style>