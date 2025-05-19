<script setup>
import { ref, onMounted, computed, defineEmits } from "vue";
import LottieAnimation from "@/components/LottieAnimation.vue";

const emit = defineEmits(["loadingCompleted"]); // Define emit event

const props = defineProps({
  redirect: {
    type: String,
    default: "/",
  },
  redirectText: {
    type: String,
    default: "Home",
  },
  username:{
    type: String,
  }
})

// Extract initials from username
const userInitials = computed(() => {
  return props.username
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // Limit to 2 letters
});

// Steps dynamically using username
const steps = ref([
  { title: `Hey ${props.username}, we're almost there!`, subtitle: "Setting up your personalized dashboard. This won’t take long." },
  { title: `Just a moment, ${props.username}!`, subtitle: "We’re configuring your trading preferences and getting things ready." },
  { title: `Hang tight, ${props.username}!`, subtitle: "Your dashboard is loading with real-time market data." },
  { title: `Sign Up Completed!`, subtitle: "Redirecting you to your dashboard." },
]);

const currentStepIndex = ref(0);
const loadingCompleted = ref(false);

onMounted(() => {
  steps.value.forEach((_, index) => {
    setTimeout(() => {
      if (index < steps.value.length - 1) {
        currentStepIndex.value = index + 1;
      } else {
        loadingCompleted.value = true;
        emit("loadingCompleted"); // Emit event when loading is done
      }
    }, (index + 1) * 1500); // 2s delay per step
  });
});
</script>

<template>
  <div class="absolute inset-0 bg-gradient-to-b from-[#040810] to-[#021717] flex flex-col items-center justify-center pt-[65px]">
    <div class="flex flex-col items-center justify-center w-full max-w-md p-6 rounded-lg">
      <div class="flex justify-center mb-4">
        <img src="/svg/fusionx_logo_white.svg" alt="FusionX" class="w-[180px]" />
      </div>
      <!-- <p class="text-white">{{ props.username }}</p> -->

      <div class="flex items-center justify-center w-[100px] mt-10">
        <LottieAnimation animation-path="/animations/loader_welcome.json" class="relative"/>
        <div class="w-[55px] h-[55px] rounded-full bg-custom-demo absolute flex items-center justify-center">
          <p class="text-black font-bold tracking-wide text-[25px]">{{ userInitials }}</p>
        </div>
      </div>

      <!-- Animated Step Text  -->
      <!-- v-if="!loadingCompleted" -->
      <transition name="fade" mode="out-in">
        <div  :key="currentStepIndex" class="text-white flex flex-col items-center justify-center text-center space-y-4">
          <h2 class="font-bold leading-tight text-[27px]">{{ steps[currentStepIndex].title }}</h2>
          <p class="max-w-[80%] mx-auto text-[16px]">{{ steps[currentStepIndex].subtitle }}</p>
        </div>
      </transition>


      <!-- <button
        v-if="loadingCompleted"
        class="mt-10 w-full bg-custom-demo hover:bg-demo-700 text-white font-semibold py-2 rounded-lg transition"
      >
        <RouterLink :to="redirect" class="inline-flex justify-center w-full h-full">Go to {{ redirectText }}</RouterLink>
      </button> -->

    </div>
  </div>
</template>

<style scoped>

</style>
