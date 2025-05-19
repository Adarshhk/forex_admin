<template>
  <div class="xl:w-[350px] border-r w-full border-white/15 h-screen text-white nrml-text">
    <div class="">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-white/15 p-4">
        <h1 class="font-bold text-lg">Watchlist</h1>
        <div class="flex items-center space-x-4">
          <button @click="isOpen = true"
            class="small-btn-gradient gap-2 p-2  rounded-lg flex items-center justify-center">
            <i class="pi pi-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div v-if="watchlists.length > 0" class="relative">
      <div class="flex border-b border-white/10 whitespace-nowrap overflow-x-auto no-scrollbar px-4 pr-24">
        <div @click="selectWatchlist(watchlist)" v-for="watchlist in watchlists"
          class="cursore-pointer p-2 border-b-2 flex items-center gap-1"
          :class="{ 'text-custom-demo border-custom-demo': selectedWatchlist.id == watchlist.id, 'text-[#ADB1B8] border-[#0c0a0f]': selectedWatchlist.id != watchlist.id }">
          {{ watchlist.name }}

          <button v-if="selectedWatchlist.id == watchlist.id" @click="handleEditWatchlist">
            <img src="/public/svg/edit_blue.svg" alt="" class="min-w-5">
          </button>
          <button v-if="selectedWatchlist.id == watchlist.id" @click="handleDelete(selectedWatchlist.id, 'watchlist')">
            <img src="/public/svg/delete_red.svg" alt="" class="min-w-3">
          </button>
        </div>
      </div>

      <div class="absolute top-0 h-full  right-2  mr-0.5  bg-[#0C0A0F] ml-auto flex items-center gap-2 text-[#ADB1B8]">
        <button @click="navigateWatchlist('prev')"
          class=" w-4 h-4 rounded-lg xl:rounded-full flex items-center justify-center">
          <i class="pi pi-chevron-left"></i>
        </button>
        <button @click="navigateWatchlist('next')"
          class=" w-4 h-4 rounded-lg xl:rounded-full flex items-center justify-center">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>


    <div v-else class="flex flex-col justify-center items-center ">

      <div class="h-44">
        <LottieAnimation animationPath="/src/assets/not-found.json" />

      </div>
      <div class="flex flex-col items-center justify-center text-center p-4">
        <p class="text-lg font-bold sm:text-lg text-white/85 mt-2">Oops! Looks like there's nothing here.</p>
        <p class="text-xs sm:text-sm text-white/85 mt-2">Add trading instruments to monitor them easily.</p>
      </div>
      <div @click="isOpen = true" class="flex items-center justify-between gap-4 p-2 sm:p-4">
        <button class="min-w-[93px] text-sm px-6 py-2 rounded-md bg-gradient-to-b from-[#00C6FF] to-[#0072FF]">Create
          watchlist</button>
      </div>

    </div>

    <!-- Watchlist items -->
    <div v-if="watchlists.length > 0"
      class="px-2 space-y-2 overflow-y-auto min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] no-scrollbar">
      <!-- Search -->
      <div v-if="watchlists.length > 0" class="relative flex items-center bg-white/10 mt-2 py-2 px-4 gap-4 rounded-md">
        <i class="pi pi-search opacity-50"></i>
        <input @focus="showSearchDiv = true" type="text" v-model="searchQuery"
          class="bg-transparent outline-none w-full text-white placeholder-white/70" placeholder="Search or Add" />
        <div ref="searchdiv" v-if="showSearchDiv"
          class="absolute overflow-y-auto w-full  h-[calc(100vh-200px)] p-4 z-50 bg-[#1d1b20] left-0 top-10 rounded">
          <div v-if="filteredSymbols.length > 0">
            <div class="flex hover:bg-white/10  items-center justify-between p-2" v-for="symbol in filteredSymbols"
              :key="symbol">

              <p class=" ">
                {{ symbol }}
              </p>

              <button v-if="!alreadyAdded(symbol)" @click="addWatchlistJoiner(symbol)"
                class="flex w-full max-w-16 items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg ">
                <p
                  class="bg-[#0B212C] px-2 hover:bg-[#0B212C]/30 w-full text-center m-[1px] py-1 rounded-lg transition-all duration-300 text-xs">
                  Add</p>
              </button>
              <button v-else disabled
                class="flex bg-[#0B212C]/60 items-center justify-center rounded-lg w-full max-w-16 border border-white/20">
                <p class="bg-[#0B212C]/60 w-full text-center m-[1px] p-1.5 rounded-lg transition-all duration-300 text-xs text-white/60">
                    Added</p>
                </button>
            </div>

          </div>
          <div v-else class="p-2 text-sm text-white/70">No matching symbols</div>
        </div>
      </div>
      <div class="relative border-b border-white/15 px-4 pb-2 group">
        <div class="grid grid-cols-4">
          <span class="font-medium text-[#ffffff88] col-span-2 ">Symbol</span>

          <p class="text-[#ffffff88] text-right">Ask</p>
          <p class="text-[#ffffff88] text-right">Bid</p>

        </div>

      </div>
      <div v-for="(item, index) in joiners" :key="index" class="relative border-b border-white/15 px-4 pb-2 group">

        <div class="grid grid-cols-4">
          <span class="font-medium col-span-2 ">{{ item.symbol }}</span>

          <p class="text-[#d94a4a] text-right">{{ tickerStore.lastPrices[item.symbol] ?
            (tickerStore.lastPrices[item.symbol]?.ask).toFixed(4) : '- -' }}</p>
          <p class="text-custom-blue text-right">{{ tickerStore.lastPrices[item.symbol] ?
            (tickerStore.lastPrices[item.symbol]?.bid).toFixed(4) : '- -' }}</p>

        </div>



        <div class="absolute top-0 right-4 opacity-0 group-hover:opacity-100 transition-all duration-150">
          <TradeButton @buy="handleTrade('buy', item.symbol)" @sell="handleTrade('sell', item.symbol)"
            @delete="handleDelete(item.id, 'joiner')" />

        </div>
      </div>
    </div>


  </div>
  <DeleteModal @close="showDeleteModal = false" @confirm="confirmDelete" :modelValue="showDeleteModal" />
  <BuySellModal />
  <AddWatchlistModal :isOpen="isOpen" @close="isOpen = false" />
</template>

<script setup>
import { computed, ref } from "vue";
import { useWatchlistStore } from "@/stores/matrix/watchlist";
import { storeToRefs } from "pinia";
import AddWatchlistModal from "@/components/AddWatchlistModal.vue";
import { useWatchlistJoinerStore } from "@/stores/matrix/watchlistjoiner";
import { onClickOutside } from "@vueuse/core";
import { symbols } from "@/utils/symbols";
import { useTickerStore } from "@/stores/matrix/ticker/ticker";
import TradeButton from "@/components/TradeButton.vue";
import BuySellModal from "@/components/BuySellModal.vue";
import { useOrderStore } from "@/stores/matrix/orders";
import DeleteModal from "@/components/DeleteModal.vue";
import LottieAnimation from "@/components/LottieAnimation.vue";


const isOpen = ref(false);
const showSearchDiv = ref(false);
const searchQuery = ref('')
const showDeleteModal = ref(false)
const deleteType = ref('');

const searchdiv = ref(null);
const watchlistStore = useWatchlistStore();
const watchlistJoinerStore = useWatchlistJoinerStore();
const tickerStore = useTickerStore();
const orderStore = useOrderStore();

const { showTradeModal, scriptToTrade, tradeMode } = storeToRefs(orderStore);
const { watchlistJoiners, idToDelete: joinerIdToDelete } = storeToRefs(watchlistJoinerStore);
const { watchlists, selectedWatchlist, watchlistToEdit, idToDelete } = storeToRefs(watchlistStore);

const joiners = computed(() => {
  return watchlistJoiners.value.filter(joiner => joiner.watchlist_id == selectedWatchlist.value.id)
})
const selectWatchlist = (watchlist) => {
  selectedWatchlist.value = watchlist
}

// New function to navigate between watchlists
const navigateWatchlist = (direction) => {
  if (watchlists.value.length <= 1) return; // No need to navigate if there's only one watchlist

  // Find the current index of the selected watchlist
  const currentIndex = watchlists.value.findIndex(w => w.id === selectedWatchlist.value.id);

  let newIndex;
  if (direction === 'next') {
    // Move to next watchlist, or loop back to first one
    newIndex = (currentIndex + 1) % watchlists.value.length;
  } else {
    // Move to previous watchlist, or loop to last one
    newIndex = (currentIndex - 1 + watchlists.value.length) % watchlists.value.length;
  }

  // Select the new watchlist
  selectedWatchlist.value = watchlists.value[newIndex];
}

const filteredSymbols = computed(() => {
  if (!searchQuery.value.trim()) return symbols;
  return symbols.filter(symbol => symbol.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const addWatchlistJoiner = async (symbol) => {
  const res = await watchlistJoinerStore.addWatchlistJoiner({ symbol, watchlist_id: selectedWatchlist.value.id })
}

const deleteJoiner = async () => {
  const res = await watchlistJoinerStore.deleteJoiner();
  console.log(res)
  if (res) {
    showDeleteModal.value = false;
  }
}

const handleEditWatchlist = () => {
  watchlistToEdit.value = selectedWatchlist.value;
  isOpen.value = true
}

const handleTrade = (mode, symbol) => {
  tradeMode.value = mode;
  scriptToTrade.value = symbol;
  showTradeModal.value = true;
}

const handleDelete = (id, type) => {

  deleteType.value = type;
  if (deleteType.value == 'watchlist') {
    idToDelete.value = id;
  }
  else joinerIdToDelete.value = id

  showDeleteModal.value = true
}

const deleteWatchlist = async () => {
  const res = await watchlistStore.deleteWatchlist()
  if (res) {
    showDeleteModal.value = false;
  }
}

const confirmDelete = () => {
  if (deleteType.value == 'watchlist') {
    deleteWatchlist()
  }
  else deleteJoiner();

  showDeleteModal.value = false
}
onClickOutside(searchdiv, () => {
  showSearchDiv.value = false;
})

const alreadyAdded = (symbol) => {
  return watchlistJoiners.value.some(j => j.symbol == symbol && j.watchlist_id == selectedWatchlist.value.id)
}
</script>


<style scoped></style>