<template>
  <main class="flex flex-row gap-2 w-full justify-between">

    <!-- dynamic page  -->
    <section class="w-full">
      <!-- header  -->
      <div class="flex items-center justify-between p-4 border-b border-white/15">
        <h1 class="md:flex items-center font-bold text-lg">Deployed strategies</h1>
        
        <div class="hidden md:flex items-center justify-end col-span-4 space-x-2">
          <button @click="isAddEditModalOpen = true"
            class="flex items-center justify-center bg-gradient-to-b nrml-text from-[#00C6FF] to-[#0072FF] rounded-lg w-fit text-nowrap">
            <i class="p-2 lg:pl-2 pi pi-plus"></i>
            <p class="pr-2 hidden lg:block pl-1 py-2 nrml-text">Create Strategy</p>
          </button>
          <div class="bg-white/10 rounded-md flex items-center gap-2 p-2">
            <i class="pi pi-search opacity-20"></i>
            <input v-model="searchQuery" type="text" placeholder="Search"
              class="text-[#b2b5bb] bg-transparent rounded-md w-full outline-none nrml-text" />
          </div>
          <!-- <div class="relative">
            <button @click="isStatusDropdownOpen = !isStatusDropdownOpen"
              class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
              Status
              <i class="pi pi-chevron-down ml-2"></i>
            </button>
            <Dropdown v-model="isStatusDropdownOpen">
              <button
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">OPEN</button>
              <button
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">CLOSED</button>
            </Dropdown>
          </div>

          <div class="relative">
            <button @click="isBrokerDropdownOpen = !isBrokerDropdownOpen"
              class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
              Brokers
              <i class="pi pi-chevron-down ml-2"></i>
            </button>

            <Dropdown v-model="isBrokerDropdownOpen">
              <button v-for="(item, index) in 6" :key="index"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">Broker {{ index +
                  1
                }}</button>
            </Dropdown>
          </div> -->
        </div>
        <button
          class="flex md:hidden items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
          <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
        </button>
      </div>

      <!-- body  -->
      <div class="">
        <div class="max-h-[90vh]">
          <table class="w-full whitespace-nowrap overflow-x-auto">
            <thead class=" sticky top-0 bg-black z-20">
              <tr class="text-sm">
                <th class="p-4 text-left w-64">Name</th>
                <th class="p-4 text-left w-32">Win %</th>
                <th class="p-4 text-left w-44">Risk-Reward</th>
                <th class="p-4 text-left w-64">Min Capital</th>
                <th class="p-4 text-left w-28">Active</th>
                <th class="p-4 text-left w-24">Action</th>
                
              </tr>
            </thead>
            <tbody>
              <tr v-if="strategies.length" v-for="(item, i) in strategies"
                class="text-left text-sm w-full">
                
                <td class="text-left p-4">{{ item.name }}</td>
                <td class="text-left p-4">{{ item.win_percentage }}</td>
                <td class="text-left p-4">{{ item.risk_reward }}</td>
                <td class="text-left p-4">{{ item.min_capital }}</td>
                
                <td class="text-left p-4">
                  <div class="flex items-center">
                    <ButtonSwitch @change="handleActiveToggle(item)" :id="`${item.id}`"
                      name="is_active" v-model="item.is_enabled" />
                  </div>
                </td>

                <td class="text-center">
                  <div class="flex items-center gap-2">
                    <button @click="openEditModal(item)" class="flex items-center space-x-1">
                      <img src="/svg/edit.svg" alt="Edit" class="w-6 opacity-90" />
                    </button>
                    <button class="flex items-center space-x-1">
                      <img @click="openDeleteModal(item.id)" src="/svg/delete.svg" alt="joiners" class="w-4 opacity-90" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-else>
                <td colspan="10" class="border-none">
                  <EmptyState />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <AddEditModal :isOpen="isAddEditModalOpen" @close="isAddEditModalOpen = false" />
    <DeleteModal v-model="isDeleteModalOpen" @close="{isDeleteModalOpen = false; idToDelete.value = null}" @confirm="deleteStrategy" />

  </main>
</template>


<script setup>
import DeleteModal from '@/components/DeleteModal.vue';
import { useStrategiesStore } from '@/stores/matrix/strategies';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import AddEditModal from './AddEditModal.vue';

const isDeleteModalOpen = ref(false);
const isAddEditModalOpen = ref(false);


const strategiesStore = useStrategiesStore();
const { strategies , idToDelete , strategyToEdit} = storeToRefs(strategiesStore);

const openEditModal = (strategy) => {

  strategyToEdit.value = strategy;
  isAddEditModalOpen.value = true;
}

const openDeleteModal = (id) => {
  idToDelete.value = id;
  isDeleteModalOpen.value = true;
}

const deleteStrategy = async () => {
  await strategiesStore.deleteStrategy()
}

const handleActiveToggle = async (item) => {
  strategyToEdit.value = item;
  await strategiesStore.addEditStrategy({'is_enabled' : item.is_enabled})
  userToEdit.value = null
}
</script>