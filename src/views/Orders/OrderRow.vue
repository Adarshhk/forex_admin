<template>
  <div class="p-4 space-y-2 border-b border-white/10">

    <div class="flex justify-between text-sm">
      <div>
        <div class="flex gap-1">
          <p>{{ order?.symbol }}</p>
          <span class="font-bold"
            :class="{ 'text-custom-blue': order?.order_type == 'buy', 'text-[#d94a4a]': order?.order_type == 'sell' }">{{
              order?.order_type }} {{ order?.volume }}</span>
        </div>
        <div class="flex gap-4">
          <p>TP : {{ order.target ? order.target : '- -' }}</p>
          <p>SL : {{ order.stoploss ? order.stoploss : '- -' }}</p>
          <p>Entry Price : {{ order.price ? order.price : '- -' }}</p>
        </div>
      </div>
      <div class="text-right">
        <!-- <p class="font-bold">{{ order.price ? order.price : '- -' }}</p> -->
        <p v-if="order.status == 'pending'" class="text-custom-blue italic">Placed</p>
        <p v-if="order.status == 'success'" class="text-[#2ab425] italic">Success</p>
        <p v-if="order.status == 'rejected'" class="text-[#d94a4a] italic">Rejected</p>
        <p class="text-white/40 font-bold text-xs">{{ formatToDateOnly(order?.created_at) }}</p>
      </div>
    </div>

    <div
      class="w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 justify-between flex py-1 text-xs items-center">
      <div class="flex gap-6">
        <span>
          <span class="text-white/60">
            Strategy:
          </span>
          {{ order.strategy_name }}
        </span>
        <span>
          <span class="text-white/60">
            Account:
          </span>
          {{ order.broker_name }} ({{ order.broker_userid }})
        </span>
        <span>
          <span class="text-white/60">
            Server:
          </span>
          {{ order.broker_server ? order.broker_server : '- -' }}
        </span>
      </div>

      <div v-if="order.status == 'pending' && order.strategy_name == null" class="flex gap-2">
        <button
          class=" border border-[#D94a4a] rounded-full p-1 hover:bg-[#D94a4a]/10 transition-all duration-150 bg-white/10 text-[#D94a4a] flex items-center">
          <img src="/public/svg/close.svg" class="w-4" alt="">
        </button>
        <button
          class=" border border-custom-blue hover:bg-custom-blue/10 transition-all duration-150 rounded-full p-1 bg-white/10 flex items-center">
          <img src="/public/svg/edit.svg" class="w-4" alt="">
        </button>
      </div>
    </div>

  </div>
  <DeleteModal :modelValue="showDeleteModal" @close="showDeleteModal = false" @confirm="handleOrderDelete" />
</template>

<script setup>
import DeleteModal from '@/components/DeleteModal.vue';
import { useTickerStore } from '@/stores/matrix/ticker/ticker';
import { computed, ref } from 'vue';

const showDeleteModal = ref(false);
const tickerStore = useTickerStore();

const props = defineProps({
  order: {
    type: Object
  }
})


const handleOrderDelete = async () => {

}

const pnl = computed(() => {

  return calculatePNL(props.position)
});

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