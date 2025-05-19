<script setup>
import { RouterView } from "vue-router";
import Bottombar from "@/components/Bottombar.vue";
import Topbar from "@/components/Topbar.vue";

</script>

<template>
  <main class="w-full h-full">
    <RouterLink to="/" class="hidden xl:block px-4 py-1">
      <img src="/src/assets/svg/logo.svg" alt="Logo" class="w-[200px]" />
    </RouterLink>
    <template class="block xl:hidden">
      <Topbar />
    </template>
    <div class="md:m-2 max-h-[calc(100vh-130px)] pb-12 lg:pb-0 lg:max-h-auto overflow-y-auto xl:overflow-hidden">
      <RouterView />
    </div>
    <div class="fixed bottom-0 left-0 right-0 w-full xl:hidden overflow-x-auto z-50">
      <Bottombar />
    </div>
  </main>
</template>
