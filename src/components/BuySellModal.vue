<template>
    <Modal v-model="showTradeModal" @close="closeModal">
        <div class="min-h-fit h-[80vh] lg:h-max w-full lg:w-[380px]" @click.stop>
            <div
                class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
                <div>
                    <h1 class="text-lg font-bold">{{ scriptToTrade }}</h1>
                    <div class="flex gap-4">
                        <p class="text-sm text-white/40">Ask : <span class="text-[#d94a4a] font-bold text-sm">{{
                            tickerStore.lastPrices[scriptToTrade]?.ask }}</span>
                        </p>
                        <p class="text-sm text-white/40">Bid : <span class="text-custom-blue font-bold text-sm">{{
                            tickerStore.lastPrices[scriptToTrade]?.bid }}</span>
                        </p>
                    </div>
                </div>

                <button @click.stop="closeModal" class="text-white/80 p-1">
                    <i class="pi pi-times"></i>
                </button>
            </div>

            <p class="px-4 pt-2 text-custom-white/60 text-xs">Note : Broker Must Be Connected Before Placing Order</p>
            <form class="space-y-2 w-full p-4" @submit.prevent>

                 <div class="space-y-1">
                        <label for="qty" class="text-sm text-white/40 font-bold">Symbol</label>
                        <input v-model="formData.symbol"
                            class="focus:outline outline-custom-blue w-full mt-2 py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                            type="text" placeholder="Enter Symbol" />
                    </div>

                <div class="border border-white/10 rounded-lg flex gap-1 w-full">
                    <button @click.stop="(e) => { e.preventDefault(); orderCategory = 'strategy' }"
                        class="w-full text-sm p-2 rounded-md"
                        :class="{ 'bg-custom-blue': orderCategory == 'strategy' }">Strategy</button>

                    <button @click.stop="(e) => { e.preventDefault(); orderCategory = 'individual' }"
                        class="w-full text-sm  rounded-md"
                        :class="{ 'bg-custom-blue': orderCategory == 'individual' }">Individual</button>
                </div>

                <div>
                    <label for="" class="text-sm text-white/40 font-bold">Select {{ orderCategory == 'strategy' ?
                        'Strategy' : 'User' }}</label>
                    <!-- here -->
                    <div ref="searchDiv" class="relative mt-1">
                        <div
                            class="flex items-center border border-white/15 rounded-md bg-white/0 hover:border-custom-blue">
                            <input type="text"
                                class=" text-sm w-full py-2 px-3 rounded-md bg-transparent focus:outline-none"
                                :placeholder="orderCategory === 'strategy' ? 'Search strategies...' : 'Search users...'"
                                v-model="searchTerm" @focus.stop="isDropdownOpen = true" />
                            <div class="px-3 text-white/60">
                                <i class="pi pi-search"></i>
                            </div>
                        </div>

                        <!-- Dropdown list -->
                        <div v-if="isDropdownOpen"
                            class="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-[#1d1b20] border border-white/10 rounded-md shadow-lg">
                            <div v-if="filteredItems.length > 0">
                                <div v-for="item in filteredItems" :key="item.id"
                                    class="flex gap-2 items-center px-3 py-2 border-b border-white/10 hover:bg-white/10">
                                    <Checkbox :id="item.id" :modelValue="selectedItems.includes(item.id)"
                                        @update:model-value="(bool) => handleSelection(item.id, bool)" />
                                    <label :for="item.id" class="flex-1 cursor-pointer text-xs">{{ item.name }}
                                        &nbsp;<span class="px-2 py-1 bg-white/10 rounded-lg"
                                            v-if="orderCategory == 'strategy'">{{joiners.filter(j => j.strategy_id ==
                                                item.id).length}} Joiners</span></label>
                                </div>
                            </div>
                            <div v-else class="px-3 py-2 text-white/60 text-sm">
                                No results found
                            </div>
                        </div>
                    </div>

                    <!-- Selected items display -->
                    <div v-if="selectedItems.length > 0" class="mt-2 flex flex-wrap gap-2">
                        <div v-for="id in selectedItems" :key="id"
                            class="border border-white/10 text-xs text-white/80 px-2 py-1 rounded-md flex items-center gap-1">
                            {{ getItemName(id) }}
                            <button @click.stop="removeSelectedItem(id)" class="text-white/60 hover:text-white">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="selectedItems.length > 0" class="border border-white/10 rounded-lg flex gap-1 w-full">
                    <button @click.stop="(e) => { e.preventDefault(); tradeMode = 'buy' }"
                        class="w-full text-sm p-2 rounded-md"
                        :class="{ 'bg-[#2ab425]': tradeMode == 'buy' }">Buy</button>

                    <button @click.stop="(e) => { e.preventDefault(); tradeMode = 'sell' }"
                        class="w-full text-sm  rounded-md"
                        :class="{ 'bg-[#d94a4a]': tradeMode == 'sell' }">Sell</button>
                </div>

                <div class="w-full " v-if="selectedItems.length > 0">
                    <div class="flex gap-2 border-b border-white/15">
                        <button type="button" @click.stop="() => { formData.order_type = 'market' }"
                            class=" transition-all duration-200 p-2 text-sm"
                            :class="{ 'border-b-2 border-custom-blue text-custom-blue': formData.order_type == 'market', 'border-b-2 border-white/0': formData.order_type != 'market' }">
                            Market
                        </button>

                        <button type="button" @click.stop="() => { formData.order_type = 'limit' }"
                            class="p-2  transition-all duration-200 text-sm flex gap-1 items-center justify-center"
                            :class="{ 'border-b-2 border-custom-blue text-custom-blue ': formData.order_type == 'limit', 'border-b-2 border-white/0': formData.order_type != 'limit' }">
                            <p>Limit</p>
                        </button>

                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4" v-if="selectedItems.length > 0">
                    <div class="space-y-1">
                        <label for="qty" class="text-sm text-white/40 font-bold">Volume</label>
                        <input v-model="formData.volume"
                            class="focus:outline outline-custom-blue w-full mt-2 py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                            type="number" placeholder="Enter Quantity" />
                    </div>


                    <div class="space-y-1 relative">
                        <label for="limit_price" class="text-sm text-white/40 font-bold">Limit Price</label>
                        <div class="relative">
                            <!-- Lock Icon -->
                            <img v-if="formData.order_type === 'market'" src="/src/assets/svg/lock.svg"
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-70"
                                alt="Locked" />

                            <input v-model="formData.limit_price" :disabled="formData.order_type === 'market'"
                                class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue disabled:opacity-50 disabled:cursor-not-allowed"
                                :class="{ 'placeholder:opacity-0': formData.order_type == 'market' }" type="number"
                                placeholder="Enter Limit Price" />
                        </div>
                    </div>

                </div>

                <div class="grid grid-cols-2 gap-4 pb-4" v-if="selectedItems.length > 0">


                    <div class="space-y-1">
                        <label for="target" class="text-sm text-white/40 font-bold">Target
                            <span class="text-custom-blue font-normal italic text-xs">
                                (optional)
                            </span>
                        </label>
                        <input v-model="formData.target"
                            class="focus:outline outline-custom-blue w-full mt-2 py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                            type="text" placeholder="Enter Target" />
                    </div>

                    <div class="space-y-1">
                        <label for="stoploss" class="text-sm text-white/40 font-bold">Stoploss
                            <span class="text-custom-blue font-normal italic text-xs">
                                (optional)
                            </span>
                        </label>
                        <input v-model="formData.stoploss"
                            class="focus:outline outline-custom-blue w-full mt-2 py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                            type="text" placeholder="Enter Stoploss" />
                    </div>
                </div>


                <!-- <button @click="handleSubmit"
                    class="md:hidden min-w-[93px] w-full text-sm px-6 py-2 rounded-md bg-gradient-to-b from-[#00C6FF] to-[#0072FF] opacity-80">Done</button> -->

                <button @click="handleSubmit" type="button" v-if="selectedItems.length > 0"
                    class="min-w-[93px] col-span-2 w-full text-sm px-6 py-2 rounded-md "
                    :class="{ 'bg-[#2ab425]': tradeMode == 'buy', 'bg-[#d94a4a]': tradeMode == 'sell' }">Place
                    Order</button>
            </form>


        </div>

    </Modal>
</template>

<script setup>
import Modal from './Modal.vue';
import { useOrderStore } from '@/stores/matrix/orders';
import { storeToRefs } from 'pinia';
import { useTickerStore } from '@/stores/matrix/ticker/ticker';
import { ref, watch, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { onClickOutside } from '@vueuse/core';
import Checkbox from './Checkbox.vue';
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import { useJoinerStore } from '@/stores/matrix/joiners';
import { useStrategiesStore } from '@/stores/matrix/strategies';
import { useManualOrderStore } from '@/stores/matrix/manualorder';
import { useManualPositionStore } from '@/stores/matrix/manualposition';

const orderStore = useOrderStore();
const manaulOrderStore = useManualOrderStore();
const manualPositionStore = useManualPositionStore();
const strategiesStore = useStrategiesStore();
const brokerStore = useBrokerIndexStore();
const joinerStore = useJoinerStore();
const tickerStore = useTickerStore();


const { strategies } = storeToRefs(strategiesStore);
const { joiners } = storeToRefs(joinerStore)
const { brokers } = storeToRefs(brokerStore);
const { showTradeModal, tradeMode, scriptToTrade } = storeToRefs(orderStore);


const orderCategory = ref('strategy');
const emit = defineEmits(['close']);
const searchDiv = ref(null);

// Search and selection functionality
const searchTerm = ref('');
const isDropdownOpen = ref(false);
const selectedItems = ref([]);

// Get the appropriate list based on category
const itemsList = computed(() => {
    return orderCategory.value === 'strategy' ? strategies.value : brokers.value.map(b => { return { id: b.id, name: b.broker_name } });
});

// Filter items based on search term
const filteredItems = computed(() => {
    if (!searchTerm.value) return itemsList.value;
    return itemsList.value.filter(item =>
        item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

// Get item name by id
const getItemName = (id) => {
    const item = itemsList.value.find(item => item.id === id);
    return item ? item.name : '';
};

// Remove selected item
const removeSelectedItem = (id) => {
    selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
};

// Modified: Only close dropdown for explicit outside clicks
const handleOutsideClick = (event) => {
    // We'll rely on the onClickOutside directive instead of this manual handler
    // This function is no longer used but kept for reference
};

const handleSelection = (id, checked) => {
    if (checked) {
        if (!selectedItems.value.includes(id)) {
            selectedItems.value.push(id);
        }
    } else {
        selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
    }
};

watchEffect(() => {
    if (selectedItems.value.length == 1) {
        isDropdownOpen.value = false
    }
})

// Reset selected items when category changes
watch(orderCategory, () => {
    selectedItems.value = [];
    searchTerm.value = '';
});

// Removed document click event listener as it may be interfering with the modal

const closeModal = () => {
    showTradeModal.value = false;
}

const formData = ref({
    volume: '',
    order_type: 'limit',
    limit_price: '',
    symbol: '',
    target: '',
    stoploss: '',
    signal_type: tradeMode.value,
    broker_ids: [],
    strategy_ids: []

})

watch(() => formData.value.order_type, (newVal) => {
    if (newVal === 'market') {
        formData.value.limit_price = '';
    }
});

const handleSubmit = () => {
    // Reset arrays before populating them
    formData.value.broker_ids = [];
    formData.value.strategy_ids = [];

    // Set the appropriate IDs based on the orderCategory
    if (orderCategory.value === 'strategy') {
        formData.value.strategy_ids = [...selectedItems.value];
    } else {
        formData.value.broker_ids = [...selectedItems.value];
    }

    // Make sure symbol and signal_type are current
    formData.value.signal_type = tradeMode.value;

    manaulOrderStore.placeOrder(formData.value)
        .then(() => {
            // Reset form data after successful order placement
            formData.value.volume = '';
            formData.value.limit_price = '';
            formData.value.target = '';
            formData.value.stoploss = '';
            formData.value.order_type = 'limit';
            formData.value.broker_ids = [];
            formData.value.strategy_ids = [];
            closeModal();
            manualPositionStore.getManualPosition()
        })
        .catch((error) => {
            console.error('Error placing order:', error);
        });

    
}

// Apply onClickOutside only to the search dropdown, not the entire modal
onClickOutside(searchDiv, (event) => {
    isDropdownOpen.value = false;
});
</script>

<style lang="scss" scoped></style>