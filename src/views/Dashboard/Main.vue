<script setup>
import { useStrategiesStore } from '@/stores/matrix/strategies';
import { storeToRefs } from 'pinia';
import StrategyCard from './StrategyCard.vue';
import { useUserStore } from '@/stores/matrix/users';
import { computed } from 'vue';
import { useSubscriptionStore } from '@/stores/matrix/subscription';
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import { useOrderStore } from '@/stores/matrix/orders';

const userStore = useUserStore();
const strategyStore = useStrategiesStore();
const brokerStore = useBrokerIndexStore();
const subscriptionStore = useSubscriptionStore();
const orderStore = useOrderStore();

const { subscriptions } = storeToRefs(subscriptionStore);
const { strategies } = storeToRefs(strategyStore);
const { users } = storeToRefs(userStore);
const { brokers } = storeToRefs(brokerStore);
const { orders } = storeToRefs(orderStore);


const activeUsers = computed(() => {
  return users.value.filter(user => user.is_enable).length;
});

const deployedStrategies = computed(() => {
  const deployed = new Set();
  subscriptions.value.forEach(subscription => {
    if (subscription.strategy_id) {
      deployed.add(subscription.strategy_id);
    }
  });

  return deployed.size;
});


const activeBrokers = computed(() => {
  return brokers.value.filter(broker => broker.is_enabled).length;
});

</script>

<template>
  <div class=" overflow-hidden p-2">
    <div class="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div class="bg-white/10 shadow-md rounded-lg p-4 col-span-1">
        <h2 class="text-xl font-bold">{{ activeUsers }}/{{ users.length }}</h2>
        <p class="text-sm text-white/80">Users Active</p>
        <RouterLink to="/users" class="mt-2 text-sm text-custom-blue underline">See all</RouterLink>
      </div>
      <div class="bg-white/10 shadow-md rounded-lg p-4 col-span-1">
        <h2 class="text-xl font-bold">{{deployedStrategies}}/{{ strategies.length }}</h2>
        <p class="text-sm text-white/80">Strategy Deployed</p>
        <RouterLink to="/deployed-strategies" class="mt-2 text-sm text-custom-blue underline">See all</RouterLink>
      </div>
      <div class="bg-white/10 shadow-md rounded-lg p-4 col-span-1">
        <h2 class="text-xl font-bold">{{activeBrokers}}/{{ brokers.length }}</h2>
        <p class="text-sm text-white/80">Brokers Active</p>
        <RouterLink to="/brokers" class="mt-2 text-sm text-custom-blue underline">See all</RouterLink>
      </div>
      <div class="bg-white/10 shadow-md rounded-lg p-4 col-span-1">
        <h2 class="text-xl font-bold">{{ orders.length }}</h2>
        <p class="text-sm text-white/80">Orders Executed</p>
        <RouterLink to="/orders" class="mt-2 text-sm text-custom-blue underline">See all</RouterLink>
      </div>
    </div>

    <!-- strategy table -->

    <div class="h-[70vh] overflow-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white/10 shadow-md rounded-lg">
      <StrategyCard v-for="strategy in strategies" :key="strategy.id" :strategy="strategy" />
    </div>
  </div>
</template>


<style scoped></style>