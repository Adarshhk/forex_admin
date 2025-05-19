<template>
  <div v-if="profile && (profile.user_role || '').toLowerCase() !== 'paper' && totalProfit?.totalPnl" class="font-bold">
    <span :class="totalProfit?.totalPnl < 0 ? setTotalPnlClass('text-custom-red') : totalProfit?.totalPnl > 0 ? setTotalPnlClass('text-custom-green') : setTotalPnlClass('')">
      {{ totalProfit?.totalPnl > 0 ? '+' : '' }}{{ totalProfit?.totalPnl }}
    </span>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { usePositionsStore } from '@/stores/matrix/positions';
import { useTickerStore } from '@/stores/matrix/ticker/ticker';
import { useProfileStore } from '@/stores/matrix/profile';

const tickerStore = useTickerStore();
const positionsStore = usePositionsStore();
const profileStore = useProfileStore();

const { profile } = storeToRefs(profileStore);
const { totalPnlClass } = storeToRefs(positionsStore);

const totalProfit = computed(() => {
  let totalPnl = 0;

  positionsStore.positions.forEach((position) => {
    if (!position || !position.symbol || !tickerStore?.getLastPrice) return;

    const lastPrice = tickerStore.getLastPrice(position.symbol);
    if (!lastPrice) return;

    const order_type = position.order_type?.toLowerCase();
    const status = position.status?.toLowerCase();

    // Select correct LTP based on side
    const ltp = order_type === 'sell' ? Number(lastPrice.ask) : Number(lastPrice.bid);
    if (isNaN(ltp)) return;

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

    if (!isNaN(pnl)) {
      totalPnl += pnl;
    }
  });

  return {
    totalPnl: totalPnl.toFixed(2),
  };
});


const setTotalPnlClass = (className = '') => {
  totalPnlClass.value = className;
  return className;
};
</script>
