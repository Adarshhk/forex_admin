<script setup>
import { onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useTickerStore } from "@/stores/matrix/ticker/ticker";
import WatchList from "@/views/watchlist/Main.vue";
import Topbar from "@/components/Topbar.vue";
import Timeline from "@/views/timeline/Main.vue";
import Bottombar from "@/components/Bottombar.vue"

const route = useRoute();


</script>

<template>
  <main>
    <div class="relative flex items-start ">


      <div class="w-full flex flex-col overflow-y-hidden">
        <Topbar />
        
        <RouterView />


    </div>
    
    </div>
  </main>
</template>
