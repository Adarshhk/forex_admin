<template>
  <section class="w-[90%] lg:w-[50%] mx-auto">
    <template v-if="isPositionsLoading && currentStrategyData.length > 0">
      <div class="relative flex justify-center items-center mx-auto mt-6 w-[90%] xs:w-[80%] sm:w-[70%] max-w-[250px]">
        <Pie  v-if="chartData && chartData.datasets.length > 0" :data="chartData" :options="chartOptions" />
        <p v-else class="absolute text-center text-[20px] md:text-[20px] xl:text-[18px] text-white">
          No positions yet
        </p>
      </div>
    </template>

    <div v-else-if="!isPositionsLoading" class="flex justify-center p-2">
      <div class="w-[150px] mx-auto mt-[100px] md:mt-[120px]">
        <div class="w-[100px]">
          <!-- <LottieAnimation animation-path="/animations/fusionx_loader.json"/> -->
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col justify-center items-center mx-auto mt-[50px] w-[200px] h-[250px]">
      <LottieAnimation animation-path="/animations/no_data_found.json" class=""/>
      <h1 class="font-bold opacity-60">Nothing to show</h1>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watchEffect, computed, onMounted } from "vue";
import { Doughnut, Pie  } from "vue-chartjs";
import { Chart as ChartJS, registerables as ChartRegisterables } from "chart.js";
import { usePositionsStore } from "@/stores/matrix/positions";
import { usePaperPositionsStore } from "@/stores/matrix/paperPositions";
import LottieAnimation from "./LottieAnimation.vue";

const paperPositionsStore = usePaperPositionsStore();
const positionsStore = usePositionsStore();
const { isTabActive } = storeToRefs(positionsStore);

ChartJS.register(...ChartRegisterables);

const props = defineProps({
  livedata: Object,
  paperdata: Object,
});

const currentChartData = computed(() => {
  return isTabActive.value === "Live" ? props.livedata : props.paperdata;
});

const currentStrategyData = ref([]);
const chartData = ref({ labels: [], datasets: [] });

const chartOptions = ref({
  responsive: true,
  // cutout: "50%", // Creates a hollow center
  plugins: {
    legend: { display: false },
  },
});

function updateData() {
  const strategies = [...Object.values(currentChartData.value)];
  currentStrategyData.value = strategies;
  chartData.value = {
    labels: strategies.map((strategy) => strategy.name),
    datasets: [
      {
        label: "Profit",
        data: strategies.map((strategy) => strategy.pnl),
        backgroundColor: strategies.map((strategy) => strategy.color),
        borderWidth: 0,
      },
    ],
  };
}

watchEffect(() => {
  updateData();
});

onMounted(() => {
  updateData();
});

const isPositionsLoading = computed(() => {
  const state = positionsStore.state[positionsStore.endpoint];
  return state && state.loading === false;
});
</script>

<style scoped>
.text-red-500 {
  color: #bf1717;
}
</style>
