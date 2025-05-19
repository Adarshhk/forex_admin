<script setup>
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const paths = [
  {
    name: "Home",
    img: "/svg/home.svg",
    imgteal: "/svg/home-primary.svg",
    path: "/",
  },
  {
    name: "Watchlist",
    img: "/svg/list.svg",
    imgteal: "/svg/list-primary.svg",
    path: "/watchlist",
  },
  {
    name: "Strategies",
    img: "/svg/home.svg",
    imgteal: "/svg/home-primary.svg",
    path: "/deployed-strategies",
  },
  {
    name: "Orders",
    img: "/svg/list.svg",
    imgteal: "/svg/list-primary.svg",
    path: "/orders",
  },
  {
    name: "Positions",
    img: "/svg/home.svg",
    imgteal: "/svg/home-primary.svg",
    path: "/positions",
  },
  // {
  //   name: "Feed",
  //   img: "/svg/list.svg",
  //   imgteal: "/svg/list-primary.svg",
  //   path: "/feed",
  // }
];
</script>

<template>
  <nav class="text-white xl:hidden flex-col items-center justify-between bg-[#1D1E21] border-t border-white/10 w-full px-1 xs:px-4 pb-2 mx-0">
    <div class="flex items-center justify-between px-2">
      <div v-for="item in paths" class="flex items-center my-2">
        <div class="relative group flex flex-col items-center">
          <router-link :to="item.path" class="flex flex-col items-center">
            <button
              class="p-1 pb-1.5 border border-transparent hover:border-[#1D292C]"
              :class="{
                '':
                  item.path === route.path,
              }"
            >
              <img :src="item.path === route.path ? item.imgteal : item.img" alt="" class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div
              class="text-xs sm:text-[13px] text-center font-semibold sm:font-bold"
              :class="[
                item.path === route.path
                  ? 'bottom-nav-text-gradient'
                  : 'text-white/30',]"
            >
              {{ item.name }}
            </div>
          </router-link>
          <!-- <div
            class="absolute top-full -translate-y-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <p>{{ item.name }}</p>
          </div> -->
        </div>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.bottom-nav-text-gradient {
  background: linear-gradient(to bottom, #00C6FF, #0072FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>