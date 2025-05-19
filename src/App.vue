<script setup>
import { RouterView } from 'vue-router'
import Toast from "@/components/Toast.vue"
import Uplot from './components/Uplot.vue';
import TelegramExclusive from './components/TelegramExclusive.vue';
</script>

<template>
  <Toast />
  
  <RouterView />
   <!-- <TelegramExclusive /> -->
  <!-- <Uplot/> -->
</template>
