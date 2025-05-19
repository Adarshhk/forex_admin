<template>
  <main class="flex flex-row gap-2 w-full justify-between">
    <!-- dynamic page -->
    <section class="w-full">
      <!-- header -->
      <div class="flex items-center justify-between p-4 border-b border-white/15">
        <h1 class="md:flex items-center font-bold text-lg">Brokers List</h1>
        <div class="hidden md:flex items-center justify-end col-span-4 space-x-1">
          <!-- Status Filter -->
          <div class="relative">
            <button @click="isStatusDropdownOpen = !isStatusDropdownOpen"
              class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
              Status
              <i class="pi pi-chevron-down ml-2"></i>
            </button>
            <Dropdown v-model="isStatusDropdownOpen">
              <button @click="() => { filters.status = '' ; isStatusDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.status === '' }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">All</button>
              <button @click="() => { filters.status = true ; isStatusDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.status === true }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">Enabled</button>
              <button @click="() => { filters.status = false ; isStatusDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.status === false }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">Disabled</button>
            </Dropdown>
          </div>

          <!-- Broker Filter -->
          <div class="relative">
            <button @click="isBrokerDropdownOpen = !isBrokerDropdownOpen"
              class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
              Brokers
              <i class="pi pi-chevron-down ml-2"></i>
            </button>
            <Dropdown v-model="isBrokerDropdownOpen">
              <button @click="() => { filters.broker = ''; isBrokerDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.broker === '' }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">
                All
              </button>
              <button v-for="broker in brokerFilterValue" :key="broker.id"
                @click="() => { filters.broker = broker.broker_name; isBrokerDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.broker === broker.broker_name }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">
                {{ broker.broker_name }}
              </button>
            </Dropdown>
          </div>
        </div>

        <!-- Filter Icon for Mobile -->
        <button
          class="flex md:hidden items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
          <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
        </button>
      </div>

      <!-- body -->
      <div class="">
        <div class="table-container  min-h-[50vh]">
          <table class="w-full whitespace-nowrap overflow-x-auto">
            <thead class="border">
              <tr class="text-left w-full px-4 py-3 text-sm">
                <th><div><span>S.NO</span></div></th>
                <th>Name</th>
                <th>Broker ID</th>
                <th>Server</th>
                <th>Connect</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredBrokers.length" v-for="(item, i) in filteredBrokers"
                class="text-left text-sm w-full px-4 py-2">
                <td><div class="text-center"><span>{{ i + 1 }}</span></div></td>
                <td><div>{{ item.broker_name }}</div></td>
                <td>{{ item.broker_userid }}</td>
                <td>{{ item.server_name }}</td>
                <td>
                  <button @click="handleConnect(item.broker_userid)">connect</button>
                </td>
                <td>
                  <div class="flex items-center">
                    <ButtonSwitch @change="handleActiveToggle(item)" :id="`${item.id}`" name="is_active"
                      v-model="item.is_enabled" />
                  </div>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <button @click="openEditModal(item)" class="flex items-center space-x-1">
                      <img src="/svg/edit.svg" alt="Edit" class="w-6 opacity-90" />
                    </button>
                    <button @click="openDeleteModal(item.id)" class="flex items-center space-x-1">
                      <img src="/svg/delete.svg" alt="joiners" class="w-4 opacity-90" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7"><EmptyState /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <AddBroker :isOpen="isEditModalOpen" @close="closeEditModal" />
    <DeleteModal v-model="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="handleDeleteBroker" />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import DeleteModal from "@/components/DeleteModal.vue";
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import { storeToRefs } from 'pinia';
import AddBroker from '@/components/AddBroker.vue';
import Dropdown from '@/components/Dropdown.vue';
import EmptyState from '@/components/EmptyState.vue';

const brokerStore = useBrokerIndexStore();
const { brokers, idForDelete, editBrokerData, brokerFilterValue } = storeToRefs(brokerStore);

const isStatusDropdownOpen = ref(false);
const isBrokerDropdownOpen = ref(false);

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);

const filters = ref({
  status: '',
  broker: ''
});

const filteredBrokers = computed(() => {
  return brokers.value.filter(b => {
    const statusFilter = filters.value.status;
    const statusMatch = statusFilter === '' || b.is_enabled === statusFilter;
    const brokerMatch = !filters.value.broker || b.broker_name === filters.value.broker;
    return statusMatch && brokerMatch;
  });
});

const handleDeleteBroker = async () => {
  await brokerStore.deleteBroker();
  isDeleteModalOpen.value = false;
};

const handleConnect = async (id) => {
  await brokerStore.connectBroker(id);
};

const openDeleteModal = (id) => {
  idForDelete.value = id;
  isDeleteModalOpen.value = true;
};

const openEditModal = (broker) => {
  editBrokerData.value = broker;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  editBrokerData.value = null;
  isEditModalOpen.value = false;
};

const handleActiveToggle = async (broker) => {
  brokerStore.addEditBroker(broker.id, { is_enabled: broker.is_enabled });
};
</script>

<style scoped>
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
  backdrop-filter: blur(22px);
}
</style>
