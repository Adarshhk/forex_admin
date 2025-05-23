<template>
    <div class="bg-[#18161b] border-white/20 space-y-4 rounded-xl p-4 h-fit">
        <!-- Moving Banner Integration -->
        <div class="w-full">
            <MovingBanner />
        </div>
        
        <div class="flex items-start gap-4 border-white/15 p-2 pt-0">
            <div class="w-[72px] rounded-md">
                <img src="/src/assets/img/strategy-icon.png" class="object-cover aspect-square" alt="">
            </div>
            <div class="flex justify-between w-full ">
                <div class="space-y-1">
                    
                    <p class="text-[16px] font-bold">{{strategy.name}}</p>
                </div>
            </div>
        </div>

        <div class=" border-white/30 bg-white/5 rounded-xl grid grid-cols-3 p-2">
            <div class="text-center border-r-2 border-dotted border-white/15 p-2">
                <p class="text-white/50 text-sm">Joiners</p>
                <p class="text-[16px] font-semibold">{{ joinersCount }}</p>
            </div>
            <div class="text-center border-r-2 border-dotted border-white/15 p-2">
                <p class="text-white/50 text-sm">PnL</p>
                <p class="text-[16px] font-semibold" :class="{'text-custom-green' : strategyPnL > 0 , 'text-custom-red':strategyPnL < 0}">{{ strategyPnL }}</p>
            </div>
            <div class="text-center p-2">
                <p class="text-white/50 text-sm">Symbol</p>
                <p class="text-[16px] font-semibold">{{ strategy.symbol }}</p>
            </div>
        </div>

        <div class="flex flex-col items-center justify-between mt-2 gap-2">
            <button v-if="isOpen" @click="sqoffStrategy"
                class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p
                    class="bg-[#0B212C] hover:bg-[#0B212C]/30 w-full text-center m-[1px] p-1.5 rounded-lg transition-all duration-300 text-sm">
                    Square Off</p>
            </button>
            <button v-else disabled
                class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p
                    class="bg-[#0B212C] hover:cursor-not-allowed w-full text-center m-[1px] p-1.5 rounded-lg transition-all duration-300 text-sm text-white/50">
                    Squared Off</p>
            </button>
            
        </div>
    </div>
    <!-- <Eligibilty v-model="showPopup" v-if="true" /> -->
</template>

<script setup>
import MovingBanner from '@/components/MovingBanner.vue';
import { useManualPositionStore } from '@/stores/matrix/manualposition';
import { usePositionsStore } from '@/stores/matrix/positions';
import { useSubscriptionStore } from '@/stores/matrix/subscription';
import { useTickerStore } from '@/stores/matrix/ticker/ticker';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const tickerStore = useTickerStore();
const subscriptionStore = useSubscriptionStore();
const { subscriptions } = storeToRefs(subscriptionStore);

const normalPositionStore = usePositionsStore();
const manualPositionStore = useManualPositionStore();

const { positions , dataForSqOff} = storeToRefs(normalPositionStore);
const { manualPositions } = storeToRefs(manualPositionStore);


const joinersCount = computed(() => {
    return subscriptions.value.filter((subscription) => subscription.strategy_id === props.strategy.id).length;
});

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

const strategyPnL = computed(() => {
  const normalPNL = positions.value
    .filter(pos => pos.strategy_id === props.strategy.id)
    .map(pos => calculatePNL(pos))
    .filter(pnl => pnl !== '_')
    .reduce((sum, pnl) => sum + pnl, 0);

  const manualPNL = manualPositions.value
    .filter(pos => pos.strategy_id === props.strategy.id)
    .map(pos => calculatePNL(pos))
    .filter(pnl => pnl !== '_')
    .reduce((sum, pnl) => sum + pnl, 0);

  return (normalPNL + manualPNL).toFixed(2);
});

const isOpen = computed(() => {
    return positions.value.some(pos => pos.strategy_id === props.strategy.id && pos.status === 'open') ||
           manualPositions.value.some(pos => pos.strategy_id === props.strategy.id && pos.status === 'open');
});


const props = defineProps({
    strategy: {
        type: Object,
        required: true
    }
})

const sqoffStrategy = async () => {

   const positionIds = [];
   positions.value.forEach((position) => {
       if (position.strategy_id === props.strategy.id && position.status === 'open') {
           positionIds.push(position.id);
       }
   });

   manualPositions.value.forEach((position) => {
       if (position.strategy_id === props.strategy.id && position.status === 'open') {
           positionIds.push(position.id);
       }
   });

   dataForSqOff.value = {positions_ids : positionIds};
   await normalPositionStore.sqOffPosition();

    await manualPositionStore.getManualPosition();
};

</script>

<style lang="scss" scoped>
/* Ensure no conflicting styles are overriding the animation */
</style>