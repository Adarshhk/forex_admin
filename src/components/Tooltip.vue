<script setup>
import { useStrategiesStore } from "@/stores/matrix/strategies";
import StrategyCard from "@/views/Dashboard/StrategyCard.vue";
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";

const props = defineProps({
  text: String,
  direction: {
    type: String,
    default: "bottom",
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
  },
  strategyId : {
    type: String,
  }
});


  const strategyStore = useStrategiesStore();
  const {strategies} = storeToRefs(strategyStore)

  const strategyInfo = computed(() => {
    return strategies.value.filter(v => v.id == props.strategyId)[0]
  })
const isVisible = ref(false);


const positionClasses = computed(() => {
  switch (props.direction) {
    case "bottom":
      return "top-full left-1/2 -translate-x-1/2 mt-2";
    case "left":
      return "right-full top-1/2 -translate-y-1/2 mr-2";
    case "right":
      return "left-full top-1/2 -translate-y-1/2 ml-2";
    default:
      return "bottom-full left-1/2 -translate-x-1/2 mb-2"; // Default is "top"
  }
});

// Define arrow position classes
const arrowClasses = computed(() => {
  switch (props.direction) {
    case "bottom":
      return "-top-1 left-1/2 -translate-x-1/2 border-t-gray-800";
    case "left":
      return "top-1/2 -translate-y-1/2 -right-1 border-l-gray-800";
    case "right":
      return "top-1/2 -translate-y-1/2 -left-1 border-r-gray-800";
    default:
      return "-bottom-1 left-1/2 -translate-x-1/2 border-b-gray-800"; // Default is "top"
  }
});

const handleDelayClose = () => {
  setTimeout(() => {
    isVisible.value = false
  }, 500);
}
</script>

<template>
  <div class="relative flex items-center" @mouseleave="handleDelayClose">
    <!-- Slot for content -->
    <div @mouseenter="isVisible = true"  >
      <slot />
    </div>

    <!-- Tooltip -->
    <div
      v-if="isVisible"
      class="absolute z-50 px-3 py-1 text-sm text-white bg-[#0c0a0f] rounded-md shadow-lg transition-opacity duration-200 opacity-100"
      :class="positionClasses"
    >
      <div class="max-w-[320px]">
        <StrategyCard :strategy="strategyInfo" />

      </div>
      
    </div>
  </div>
</template>
