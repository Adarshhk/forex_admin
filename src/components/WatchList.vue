<template>
  <div
    class="xl:w-[350px] border border-white/15 h-screen text-white nrml-text"
  >
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="font-bold text-lg">Watchlist</h1>
        <div class="flex items-center space-x-4">
          <button @click="isOpen2 = true"
            class="small-btn-gradient border border-white/10 rounded-lg xl:rounded-full flex items-center justify-center"
          >
            <i class="pi pi-plus p-2.5"></i>
          </button>
        </div>
      </div>

      <!-- Search -->
      <div
        class="flex items-center bg-white/15 mt-4 py-2 px-4 gap-4 rounded-md"
      >
        <i class="pi pi-search opacity-50"></i>
        <input
          type="text"
          class="bg-transparent outline-none w-full text-white placeholder-white/70"
          placeholder="Search"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="true" class="relative mt-4">
      <div
        class="flex border-b border-white/10 whitespace-nowrap overflow-x-auto no-scrollbar px-4 pr-24"
      >
        <button class="pb-2 px-4 text-custom-demo border-b-2 border-custom-demo">
          My most profitable
        </button>
        <button class="pb-2 px-4 text-[#ADB1B8]">Top crypto stocks</button>
      </div>

      <div class="absolute top-0 right-0 -mt-1 mr-0.5 bg-[#0C0A0F] ml-auto flex items-center gap-1 text-[#ADB1B8]">
        <button class="small-btn-gradient w-8 h-8 rounded-lg xl:rounded-full flex items-center justify-center">
          <i class="pi pi-chevron-left"></i>
        </button>
        <button class="small-btn-gradient w-8 h-8 rounded-lg xl:rounded-full flex items-center justify-center">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>


    <div v-else class="flex flex-col items-center min-h-[50vh] w-full border border-white/10">
      <img src="/svg/sqoff.svg" alt="no data" class="w-[100px] mt-12" />
      <div class="flex flex-col items-center justify-center text-center p-4">
        <p class="text-xs sm:text-sm text-white/85 mt-2">There is no watchlist find </p>
      </div>
      <div class="flex items-center justify-between gap-4 p-2 sm:p-4">
        <button class="min-w-[93px] text-sm px-6 py-2 rounded-md bg-gradient-to-b from-[#00C6FF] to-[#0072FF]">Add Symbol</button>
      </div>

    </div>

    <!-- Watchlist items -->
    <div v-if="true"
      class="mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] no-scrollbar"
    >
      <div
        v-for="(item, index) in watchlist"
        :key="index"
        class="relative border-b border-white/15 px-4 pb-2"
      >
        <div class="flex justify-between">
          <span class="font-medium">{{ item.name }}</span>
          <div class="text-custom-red flex items-center font-semibold">
            <i class="pi pi-arrow-down mr-1 text-xs"></i>
            ₹{{ item.ltp.toFixed(2) }}
          </div>
        </div>
        <div class="text-right text-xs text-[#AFAFAF] mt-1">
          (24.78%)<br />
          {{ item.pnlPercentage.toFixed(2) }}%
        </div>


        <div v-if="false" class="absolute top-0  flex ">
          <div class="bg-[#4BCE9738] border-t text-custom-green border-custom-green rounded-full w-7 h-7 flex items-center justify-center">B</div>
          <div class="bg-custom-red/10 border-t text-custom-red border-custom-red rounded-full w-7 h-7 flex items-center justify-center">S</div>
          

        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from '@/components/Modal.vue';

const activeWatchlist = ref(0);
const isOpen2 = ref(false);

const watchlist = ref([
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
  {
    name: "NIPPONSIVERBEES",
    ltp: 490,
    added_on: "2023-01-01",
    pnl: 897.87,
    pnlPercentage: 78,
  },
]);
</script>


<style scoped>


</style>