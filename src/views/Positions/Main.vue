<template>
  <main class="flex flex-row gap-2 w-full justify-between">
    <!-- dynamic page - conditionally render based on toggle -->
    <section class="w-full">
      <!-- Conditionally render StrategyPosition or ManualPosition component -->
      <StrategyPosition v-if="toggleManual === 'strategy'" :toggle-manual="toggleManual" @update-toggle="updateToggle" />
      <ManualPosition v-else :toggle-manual="toggleManual" @update-toggle="updateToggle" />
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import StrategyPosition from './StrategyPosition.vue';
import ManualPosition from './ManualPosition.vue';


// Toggle state that controls which component is displayed
const toggleManual = ref('strategy');

// Method to update toggle from child components
const updateToggle = (value) => {
  toggleManual.value = value;
};
</script>

<style scoped>
.main-top-header {
  @apply bg-none border-solid border border-gray-500 rounded-md overflow-hidden;
  border-image-source: linear-gradient(to bottom, #504E52, #242327);
  border-image-slice: 1;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
    radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);

  box-shadow: 0px 4px 8px 0px #00000080;
}

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