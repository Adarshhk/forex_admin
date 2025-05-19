<!-- StrategyOrders.vue - Handles strategy orders display and filtering -->
<template>
    <div>
        <!-- header with filters -->
        <div class="flex items-center justify-between p-4 border-b border-white/15">
            <div class="flex items-center gap-4">
                <!-- Toggle is moved to parent component -->
                <div class="flex items-center justify-between ">
                    <div class="flex items-center gap-4">
                        <h1 class="font-bold text-lg">Orders</h1>
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
                        <button @click="() => { filters.status = ''; isStatusDropdownOpen = false }"
                            :class="{ 'bg-white/10': filters.status == '' }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">All</button>
                        <button @click="() => { filters.status = 'pending'; isStatusDropdownOpen = false }"
                            :class="{ 'bg-white/10': filters.status == 'pending' }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">Pending</button>
                        <button @click="() => { filters.status = 'success'; isStatusDropdownOpen = false }"
                            :class="{ 'bg-white/10': filters.status == 'success' }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">Success</button>
                        <button @click="() => { filters.status = 'rejected'; isStatusDropdownOpen = false }"
                            :class="{ 'bg-white/10': filters.status == 'rejected' }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">Rejected</button>
                    </Dropdown>
                </div>

                <!-- Strategy Filter - Only in Strategy Orders component -->
                <div class="relative">
                    <button @click="isStrategyDropdownOpen = !isStrategyDropdownOpen"
                        class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
                        Strategy
                        <i class="pi pi-chevron-down ml-2"></i>
                    </button>

                    <Dropdown v-model="isStrategyDropdownOpen">
                        <button @click="() => { filters.strategy_id = ''; isStrategyDropdownOpen = false }"
                            :class="{ 'bg-white/10': filters.strategy_id == '' }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">All</button>
                        <button @click="() => { filters.strategy_id = strategy.id; isStrategyDropdownOpen = false }"
                            v-for="strategy in strategyFilterValues" :key="strategy.id"
                            :class="{ 'bg-white/10': filters.strategy_id == strategy.id }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">{{
                                strategy.strategy_name }}</button>
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
                        <button @click="() => { filters.broker_id = ''; isBrokerDropdownOpen = false }"
                            :class="{ 'bg-white/10': filters.broker_id == '' }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">All</button>
                        <button @click="() => { filters.broker_id = broker.id; isBrokerDropdownOpen = false }"
                            v-for="broker in brokerFilterValues" :key="broker.id"
                            :class="{ 'bg-white/10': filters.broker_id == broker.id }"
                            class="block text-left px-4 py-2 text-sm text-white hover:bg-[#ffffff11] w-full rounded">{{
                                broker.broker_name }}</button>
                    </Dropdown>
                </div>
            </div>
            <button
                class="flex md:hidden items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
                <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
            </button>
        </div>

        <!-- order list -->
        <OrderRow v-if="filteredOrders.length" :order="order" v-for="order in filteredOrders" :key="order.id" />
        <EmptyState v-else />

        <!-- mobile view -->
        <div class="md:hidden border-t border-white/15">
            <div v-if="orders.length" v-for="item in orders" :key="item.id"
                class="flex justify-between text-sm w-full px-4 py-2 border-b border-white/20">
                <div>
                    <div class="flex space-x-1 mb-1.5 ">
                        <h1 class="text-white/50">Script: </h1>
                        <p class="text-white/90">{{ item.strategy_script }}</p>
                    </div>
                    <div class="flex space-x-1 mb-1.5 ">
                        <h1 class="text-white/50">Strategy: </h1>
                        <p class="text-white/90">{{ item.strategy_name }}</p>
                    </div>
                    <div class="flex space-x-1 mb-1.5 ">
                        <h1 class="text-white/50">Name: </h1>
                        <p class="text-white/90">{{ item.strategy_name }}</p>
                    </div>
                    <div class="flex space-x-1 mb-1.5 ">
                        <h1 class="text-white/50">Broker Id: </h1>
                        <p class="text-white/90">{{ item.broker_id }}</p>
                    </div>
                </div>
                <div>
                    <div class="flex justify-end space-x-1 mb-1.5">
                        <div v-if="item.side === 'BUY'"
                            class="capitalize bg-[#4BCE9738] border-t text-custom-green border-custom-green rounded-full w-7 h-7 flex items-center justify-center">
                            B</div>
                        <div v-else-if="item.side === 'SELL'"
                            class="capitalize bg-[#F22B5B38] border-t text-custom-red border-custom-red rounded-full w-7 h-7 flex items-center justify-center">
                            S</div>
                    </div>

                    <div class="flex space-x-1 mb-1.5 ">
                        <h1 class="text-white/50">Price: </h1>
                        <p class="text-white/90">{{ item.price }}</p>
                    </div>

                    <div class="flex space-x-1 mb-1.5 ">
                        <h1 class="text-white/50">Quantity: </h1>
                        <p class="text-white/90">{{ item.quantity }}</p>
                    </div>

                    <div class="flex space-x-1 mb-1.5 ">
                        <div class="flex items-center justify-center rounded-md px-4 py-1"
                            :class="statusClass((item.status.toUpperCase()))">
                            {{ item.status }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                No Data Found
            </div>
        </div>
    </div>
</template>

<script setup>
import Dropdown from '@/components/Dropdown.vue';
import { useOrderStore } from '@/stores/matrix/orders';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import OrderRow from './OrderRow.vue';
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
    emit("update-toggle" , value);
}
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

// Get order data from store
const orderStore = useOrderStore();
const { orders, strategyFilterValues, brokerFilterValues } = storeToRefs(orderStore);

// Filtered orders based on selected filters
const filteredOrders = computed(() => {
    return orders.value.filter(order => {
        const statusMatch = !filters.value.status || order.status?.toLowerCase() === filters.value.status.toLowerCase();
        const strategyMatch = !filters.value.strategy_id || String(order.strategy_id) === String(filters.value.strategy_id);
        const brokerMatch = !filters.value.broker_id || String(order.broker_id) === String(filters.value.broker_id);

        return statusMatch && strategyMatch && brokerMatch;
    });
});

// Status class helper function
const statusClass = (status) => {
    if (status === 'SUCCESS') {
        return 'bg-custom-green/10 text-custom-green';
    } else if (status === 'PENDING') {
        return 'bg-custom-yellow/10 text-custom-yellow';
    } else if (status === 'REJECTED') {
        return 'bg-custom-red/10 text-custom-red';
    } else {
        return 'bg-custom-demo/10 text-custom-demo';
    }
};
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