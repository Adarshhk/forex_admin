<template>
  <div>
    <!-- header with filters -->
    <div class="flex items-center justify-between p-4 border-b border-white/15">
      <div class="flex items-center gap-4">
        <!-- Toggle is moved to parent component -->
        <div class="flex items-center justify-between ">
          <div class="flex items-center gap-4">
            <h1 class="font-bold text-lg">Positions</h1>
            <div class="border border-white/10 rounded-full flex gap-1 w-full">
              <button @click="updateToggle('strategy')"
                class="transition-all duration-150 w-full text-sm p-1 px-2 rounded-full"
                :class="{ 'bg-custom-blue': toggleManual == 'strategy' }">Strategy</button>

              <button @click="updateToggle('manual')"
                class="transition-all duration-150 w-full text-sm p-1 px-2 rounded-full"
                :class="{ 'bg-custom-blue': toggleManual == 'manual' }">Manual</button>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden md:flex items-center justify-end col-span-4 space-x-1">
        <!-- Status Filter -->
        <div class="relative">
          <button @click="isStatusDropdownOpen = !isStatusDropdownOpen"
            class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
            Status
            <i class="pi pi-chevron-down ml-2"></i>
          </button>
          <Dropdown v-model="isStatusDropdownOpen">
            <button @click="() => {filters.status = ''; isStatusDropdownOpen = false}" :class="{'bg-white/10' : filters.status == ''}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">All</button>
            <button @click="() => {filters.status = 'open'; isStatusDropdownOpen = false}" :class="{'bg-white/10' : filters.status == 'open'}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">OPEN</button>
            <button @click="() => {filters.status = 'closed'; isStatusDropdownOpen = false}" :class="{'bg-white/10' : filters.status == 'closed'}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">CLOSED</button>
          </Dropdown>
        </div>

        <!-- Strategy Filter - Only in Strategy Positions component -->
        <div class="relative">
          <button @click="isStrategyDropdownOpen = !isStrategyDropdownOpen" 
            class="inline-flex items-center bg-white/15  rounded-md text-sm px-2 py-1 text-nowrap">
            Strategy
            <i class="pi pi-chevron-down ml-2"></i>
          </button>

          <Dropdown v-model="isStrategyDropdownOpen">
            <button @click="() => {filters.strategy_id = ''; isStrategyDropdownOpen = false}" :class="{'bg-white/10' : filters.strategy_id == ''}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">All</button>
            <button @click="() => {filters.strategy_id = strategy.id; isStrategyDropdownOpen = false}" v-for="strategy in strategyFilterValue" :key="strategy.id" :class="{'bg-white/10' : filters.strategy_id == strategy.id}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">{{ strategy.strategy_name}} </button>
          </Dropdown>
        </div>

        <!-- Broker Filter -->
        <div class="relative">
          <button @click="isBrokerDropdownOpen = !isBrokerDropdownOpen"
            class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
            Brokers
            <i class="pi pi-chevron-down ml-2"></i>
          </button>

          <Dropdown v-model="isBrokerDropdownOpen">
            <button @click="() => {filters.broker_id = ''; isBrokerDropdownOpen = false}" :class="{'bg-white/10' : filters.broker_id == ''}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">All</button>
            <button @click="() => {filters.broker_id = broker.id; isBrokerDropdownOpen = false}" v-for="broker in brokerFilterValue" :key="broker.id" :class="{'bg-white/10' : filters.broker_id == broker.id}"
              class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">{{ broker.broker_name}} </button>
          </Dropdown>
        </div>
      </div>

      <button
        class="flex md:hidden items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
        <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
      </button>
    </div>

    <!-- positions list -->
    <div >
      <div
        class="table-container min-h-[50vh] rounded-t-xl xl:max-h-[calc(100vh-180px)] xl:pb-24 overflow-y-auto w-full">
        <Position v-if="filteredPositions.length" v-for="position in filteredPositions" :position="position" :key="position.id"/>
        <EmptyState v-else />
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { usePositionsStore } from '@/stores/matrix/positions';
import { storeToRefs } from 'pinia';
import Position from './Position.vue';
import Dropdown from '@/components/Dropdown.vue';
import EmptyState from '@/components/EmptyState.vue';

// Props to receive toggle state from parent
const props = defineProps({
  toggleManual: {
    type: String,
    default: 'strategy'
  }
});

// Emit event to update parent toggle
const emit = defineEmits(['update-toggle']);
const updateToggle = (value) => {
  emit("update-toggle", value);
};

// Filter dropdowns state
const isBrokerDropdownOpen = ref(false);
const isStrategyDropdownOpen = ref(false);
const isStatusDropdownOpen = ref(false);

// Filters configuration
const filters = ref({
  status: '',
  strategy_id: '',
  broker_id: '',
});

// Get positions data from store
const positionStore = usePositionsStore();
const { positions, strategyFilterValue, brokerFilterValue } = storeToRefs(positionStore);

// Filtered positions based on selected filters
const filteredPositions = computed(() => {
  return positions.value.filter(pos => {
    const statusMatch = !filters.value.status || pos.status?.toLowerCase() === filters.value.status.toLowerCase();
    const strategyMatch = !filters.value.strategy_id || String(pos.strategy_id) === String(filters.value.strategy_id);
    const brokerMatch = !filters.value.broker_id || String(pos.broker_id) === String(filters.value.broker_id);

    return statusMatch && strategyMatch && brokerMatch;
  });
});
</script>

<style scoped>
.main-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
    radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.bg-layered-table {
  @apply bg-none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
    radial-gradient(18.78% 37.56% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(22px)
}
</style>