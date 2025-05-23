<template>
  <div class="p-4 space-y-2 border-b border-white/10">

    <div class="flex justify-between text-sm">
      <div>
        <div class="flex gap-1">
          <p>{{ position?.symbol }}</p>
          <span class="font-bold"
            :class="{ 'text-custom-blue': position?.order_type == 'buy', 'text-[#d94a4a]': position?.order_type == 'sell' }">{{
              position?.order_type }} {{ position?.order_type == 'buy' ? position?.buy_quantity : position?.sell_quantity
            }}</span>
        </div>
        <div class="flex gap-1">
          <p>{{ position?.order_type == 'buy' ? position?.buy_price : position?.sell_price }}</p>
          <span>- - - -</span>
          <p v-if="position?.status.toLowerCase() == 'open'">{{ position?.order_type == 'buy' ?
            tickerStore.getLastPrice(position?.symbol)?.bid : tickerStore.getLastPrice(position?.symbol)?.ask }}</p>
          <p v-else>{{ position?.order_type == 'buy' ? position?.buy_exit_price : position?.sell_exit_price }}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="font-bold" :class="{ 'text-custom-green': pnl >= 0, 'text-[#d94a4a]': pnl < 0 }">{{ typeof pnl ===
          'number' ? (pnl > 0 ? '+' : '') + pnl.toFixed(2) : '-' }}</p>
        <p class="text-white/40 font-bold text-xs">{{ formatToDateOnly(position?.created_at) }}</p>
      </div>
    </div>

    <div
      class="w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 justify-between flex py-1 text-xs items-center">
      <div class="flex gap-6">
        <span><span class="text-white/60">
            Strategy:
          </span>{{ position.strategy_name }}</span>
        <span><span class="text-white/60">
            Account:
          </span>{{ position.broker_name }} ({{ position.broker_userid }}) </span>
      </div>
      <div v-if="position?.status.toLowerCase() == 'closed'"
        class="rounded-full px-2 capitalize font-bold text-xs py-1 bg-white/10">
        {{ position?.status }}
      </div>
      <button v-else @click="showConfirmModal = true"
        class=" border border-[#D94a4a] rounded-full px-2 capitalize font-bold text-xs py-1 bg-white/10 text-[#D94a4a] flex items-center">
        <img src="/public/svg/close.svg" class="w-4" alt=""> <span class="hidden md:block">Close</span>
      </button>
    </div>

  </div>
  <SqOffModal :modelValue="showConfirmModal" @close="showConfirmModal = false" @confirm="handleSqoff" />
</template>

<script setup>
import SqOffModal from '@/components/SqOffModal.vue';
import { usePositionsStore } from '@/stores/matrix/positions';
import { useTickerStore } from '@/stores/matrix/ticker/ticker';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';


const tickerStore = useTickerStore();
const positionStore = usePositionsStore();
const {dataForSqOff} = storeToRefs(positionStore);


const showConfirmModal = ref(false);

const props = defineProps({
  position: {
    type: Object
  }
})

const pnl = computed(() => {

  return calculatePNL(props.position)
});
const handleSqoff = async () => {
  dataForSqOff.value = {position_ids : [props.position.id]};
  await positionStore.sqOffPosition()
  showConfirmModal.value = false;
}


function formatToDateOnly(dateStr) {
  const date = new Date(dateStr);

  if (isNaN(date)) return ''; // Handle invalid date

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function calculatePNL(position) {
  if (!position || !position.symbol || !tickerStore?.getLastPrice) return '_';

  const lastPrice = tickerStore.getLastPrice(position.symbol);
  if (!lastPrice) return '_';

  const order_type = position.order_type?.toLowerCase();
  const status = position.status?.toLowerCase();

  // Choose LTP based on order type
  const ltp = order_type === 'buy' ? Number(lastPrice.bid) : Number(lastPrice.ask);
  if (isNaN(ltp)) return '_';

  const buy_price = Number(position.buy_price);
  const buy_quantity = Number(position.buy_quantity) * 100;
  const buy_exit_price = Number(position.buy_exit_price);

  const sell_price = Number(position.sell_price);
  const sell_quantity = Number(position.sell_quantity) * 100;
  const sell_exit_price = Number(position.sell_exit_price);

  let pnl;

  if (status === 'open') {
    if (order_type === 'buy' && !isNaN(buy_price) && !isNaN(buy_quantity)) {
      pnl = (ltp - buy_price) * buy_quantity;
    } else if (order_type === 'sell' && !isNaN(sell_price) && !isNaN(sell_quantity)) {
      pnl = (sell_price - ltp) * sell_quantity;
    }
  } else if (status === 'closed') {
    if (order_type === 'buy' && !isNaN(buy_price) && !isNaN(buy_exit_price) && !isNaN(buy_quantity)) {
      pnl = (buy_exit_price - buy_price) * buy_quantity;
    } else if (order_type === 'sell' && !isNaN(sell_price) && !isNaN(sell_exit_price) && !isNaN(sell_quantity)) {
      pnl = (sell_price - sell_exit_price) * sell_quantity;
    }
  }

  return isNaN(pnl) ? '_' : parseFloat(pnl.toFixed(2));
}



</script>

<style lang="scss" scoped></style>