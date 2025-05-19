<template>
  <div class="rounded-r-md relative grid grid-cols-4 md:grid-cols-6 xl:grid-cols-5 justify-between items-center p-2 w-full ">
    <div class="col-span-3 md:col-span-5 xl:col-span-4 flex space-x-1 sm:space-x-2 items-center overflow-x-auto no-scrollbar nrml-text pr-10">
      <!-- <button v-for="(item, index) in names" :key="index" @click="activeName = item" 
        class="border border-white/10 rounded-md text-sm px-2 sm:px-4 py-1 text-nowrap" 
        :class="[activeName===item ? 'bg-white/15' : 'bg-white/5' ]"
      >
        {{ item }}
      </button> -->
    </div>
    <div class="col-span-1 flex justify-end space-x-8" >
      <!-- line  -->
      <div class="w-1 bg-white/10 rounded-full shadow-[ -2px_1px_4px_0px_rgba(255,255,255,0.25) ]"></div>
      <div class="hidden xl:flex items-center space-x-2">
        <!-- <RouterLink to="/brokers">

          <button class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full text-nowrap">
            <p class="px-[7px] py-[3px] m-[1px] bg-[#19122A] rounded-lg">View all</p>
          </button>
        </RouterLink> -->
        <button @click="isOpen = true" class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full text-nowrap">
          <i class="pl-2 pi pi-plus"></i>
          <p class="pr-2 pl-1 py-1">Add account</p>
        </button>
      </div>

      <div class="flex xl:hidden items-center space-x-2 min-w-[80px]">
        <button class="flex items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
          <img src="/svg/eye.svg" alt="view" class="w-6 h-6" />
        </button>
        <button @click="isOpen = true" class="flex items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
          <img src="/svg/add.svg" alt="add" class="w-6 h-6" />
        </button>
      </div>
      
    </div>
  </div>

  <AddBroker :isOpen="isOpen" @close="isOpen = false" />

</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Modal from './Modal.vue';
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import AddBroker from './AddBroker.vue';

const router = useRouter();
const brokerStore = useBrokerIndexStore();

const isOpen = ref(false);
const selectServer = ref(false);

const currentRoute = computed(() => {
  return router.currentRoute.value || {};
});


const names = ['See all', 'Annete Black', 'Marvin McKinney','Arlene McCoy', 'Floyd Miles', 'Annette Black', 'Jacob Jones']
const activeName = ref('See all')

</script>

<style scope>
.modal-header {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.13) 100%),
  radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
}
</style>

