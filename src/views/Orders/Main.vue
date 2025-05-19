<!-- Main.vue - Lightweight wrapper component that conditionally renders child components -->
<template>
  <main class="flex flex-row gap-2 w-full justify-between">
    <!-- dynamic page - conditionally render based on toggle -->
    <section class="w-full">
      <!-- Toggle between Strategy and Manual Orders -->
      

      <!-- Conditionally render StrategyOrders or ManualOrders component -->
      <StrategyOrder v-if="toggleManual === 'strategy'" :toggle-manual="toggleManual" @update-toggle="updateToggle" />
      <ManualOrder v-else :toggle-manual="toggleManual" @update-toggle="updateToggle" />
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import StrategyOrder from './StrategyOrder.vue';
import ManualOrder from './ManualOrder.vue';

// Toggle state that controls which component is displayed
const toggleManual = ref('strategy');

// Method to update toggle from child components
const updateToggle = (value) => {
  toggleManual.value = value;
};
</script>