<template>
  <main class="flex flex-row gap-2 w-full justify-between">
    <section class="w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-white/15">
        <h1 class="md:flex items-center font-bold text-lg">Brokers List</h1>

        <!-- Desktop Filters -->
        <div class="hidden md:flex items-center justify-end col-span-4 space-x-1">
          <div class="relative">
            <button @click="isStatusDropdownOpen = !isStatusDropdownOpen"
              class="inline-flex items-center bg-white/15 rounded-md text-sm px-2 py-1 text-nowrap">
              Status
              <i class="pi pi-chevron-down ml-2"></i>
            </button>
            <Dropdown v-model="isStatusDropdownOpen">
              <button @click="() => { filters.status = ''; isStatusDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.status === '' }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">All</button>
              <button @click="() => { filters.status = true; isStatusDropdownOpen = false }"
                :class="{ 'bg-white/10': filters.status === true }"
                class="block text-left px-4 py-2 text-sm text-white hover:bg-[#4e4b50] w-full rounded">Enabled</button>
              <button @click="() => { filters.status = false; isStatusDropdownOpen = false }"
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

        <!-- Mobile Controls -->
        <div class="flex md:hidden items-center gap-2">
          <button @click="isFilterMenuOpen = true"
            class="flex items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px]">
            <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Search -->


      <!-- Body -->
      <div class="block">
        <!-- Desktop Table -->
        <div class="hidden md:block table-container min-h-[50vh]">
          <!-- ... keep existing desktop table ... -->
          <table class="w-full whitespace-nowrap overflow-x-auto">
            <thead class="border">
              <tr class="text-left w-full px-4 py-3 text-sm">
                <th>
                  <div><span>S.NO</span></div>
                </th>
                <th>Name</th>
                <th>User Name</th>
                <th>Broker ID</th>
                <th>Server</th>
                <th>Connect</th>
                <th>Status</th>
                <th class="w-72">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredBrokers.length" v-for="(item, i) in filteredBrokers"
                class="text-left text-sm w-full px-4 py-2">
                <td>
                  <div class="text-center"><span>{{ i + 1 }}</span></div>
                </td>
                <td>
                  <div>{{ item.broker_name }}</div>
                </td>
                <td>{{ item.username }}</td>
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
                  <div class="flex items-center gap-2 flex-wrap">
                    <button @click="openEditModal(item)" class="flex items-center space-x-1">
                      <img src="/svg/edit.svg" alt="Edit" class="w-6 opacity-90" />
                    </button>
                    <button @click="openDeleteModal(item.id)" class="flex items-center space-x-1">
                      <img src="/svg/delete.svg" alt="joiners" class="w-4 opacity-90" />
                    </button>
                    <button @click="selectOption('orders', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Orders</button>
                    <button @click="selectOption('positions', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Positions</button>
                    <button @click="selectOption('manual_orders', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Manual Orders</button>
                    <button @click="selectOption('manual_positions', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Manual Positions</button>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td colspan="7">
                  <EmptyState />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden pb-52">
          <div v-if="filteredBrokers.length" class="space-y-4 p-4">
            <div v-for="(item, i) in filteredBrokers" :key="item.id"
              class="bg-white/5 rounded-lg p-4 border border-white/10">

              <!-- Card Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm text-gray-400">#{{ i + 1 }}</span>
                      <h3 class="text-base font-semibold truncate">{{ item.broker_name }}</h3>
                    </div>
                    <div class="flex items-center justify-end">
                      <ButtonSwitch @change="handleActiveToggle(item)" :id="`mobile-${item.id}`" name="is_active"
                        v-model="item.is_enabled" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <p class="text-sm text-gray-400 truncate">{{ item.username }}</p>
                      <p class="text-sm text-gray-400">ID: {{ item.broker_userid }}</p>
                    </div>
                    <div class="flex gap-2 justify-end items-center">
                      <button @click="openEditModal(item)" title="Edit"
                        class="p-2 bg-white/10 rounded hover:bg-white/20">
                        <img src="/svg/edit.svg" alt="Edit" class="w-4 opacity-90" />
                      </button>
                      <button @click="openDeleteModal(item.id)" title="Delete"
                        class="p-2 bg-white/10 rounded hover:bg-white/20">
                        <img src="/svg/delete.svg" alt="Delete" class="w-4 opacity-90" />
                      </button>
                      <button @click="handleConnect(item.broker_userid)"
                        class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">
                        Connect
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              <!-- Card Body -->
              <div class="grid grid-cols-2 gap-3 text-sm mt-2">
                <div>
                  <p class="text-gray-400">Server:</p>
                  <p class="truncate">{{ item.server_name }}</p>
                </div>
                <div class="relative flex items-center justify-end">
                  <button @click="toggleActionsMenu(item.id)"
                    class="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 text-sm">
                    <span>More</span>
                    <i class="pi pi-chevron-down text-xs"></i>
                  </button>

                  <div v-if="activeActionsMenu === item.id"
                    class="absolute right-0 top-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-20 min-w-[160px]">
                    <button @click="selectOption('orders', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 first:rounded-t-lg">
                      Orders
                    </button>
                    <button @click="selectOption('positions', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                      Positions
                    </button>
                    <button @click="selectOption('manual_orders', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                      Manual Orders
                    </button>
                    <button @click="selectOption('manual_positions', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 last:rounded-b-lg">
                      Manual Positions
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          <!-- Mobile Empty State -->
          <div v-else class="p-8">
            <EmptyState />
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile Filter Menu -->
    <div v-if="isFilterMenuOpen" class="fixed inset-0 bg-black/50 z-50 md:hidden">
      <div class="absolute right-0 top-0 h-full w-3/4 bg-gray-900 p-4">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold">Filters</h2>
          <button @click="isFilterMenuOpen = false" class="p-2 hover:bg-white/10 rounded-full">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Status Filter -->
        <div class="mb-6">
          <h3 class="text-sm font-medium mb-2">Status</h3>
          <div class="space-y-2">
            <button @click="filters.status = ''" :class="{ 'bg-white/10': filters.status === '' }"
              class="block w-full text-left px-4 py-2 text-sm rounded">All</button>
            <button @click="filters.status = true" :class="{ 'bg-white/10': filters.status === true }"
              class="block w-full text-left px-4 py-2 text-sm rounded">Enabled</button>
            <button @click="filters.status = false" :class="{ 'bg-white/10': filters.status === false }"
              class="block w-full text-left px-4 py-2 text-sm rounded">Disabled</button>
          </div>
        </div>

        <!-- Broker Filter -->
        <div>
          <h3 class="text-sm font-medium mb-2">Brokers</h3>
          <div class="space-y-2">
            <button @click="filters.broker = ''" :class="{ 'bg-white/10': filters.broker === '' }"
              class="block w-full text-left px-4 py-2 text-sm rounded">
              All
            </button>
            <button v-for="broker in brokerFilterValue" :key="broker.id" @click="filters.broker = broker.broker_name"
              :class="{ 'bg-white/10': filters.broker === broker.broker_name }"
              class="block w-full text-left px-4 py-2 text-sm rounded">
              {{ broker.broker_name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Keep existing modals -->

    <Orders :isOpen="optionChoice === 'orders'" :brokerId="selectedBrokerId" @close="closeOptionModal" />
    <Position :isOpen="optionChoice === 'positions'" :brokerId="selectedBrokerId" @close="closeOptionModal" />
    <ManualOrders :isOpen="optionChoice === 'manual_orders'" :brokerId="selectedBrokerId" @close="closeOptionModal" />
    <ManualPosition :isOpen="optionChoice === 'manual_positions'" :brokerId="selectedBrokerId"
      @close="closeOptionModal" />
    <AddBroker :isOpen="isEditModalOpen" @close="closeEditModal" />
    <DeleteModal v-model="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="handleDeleteBroker" />
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import DeleteModal from "@/components/DeleteModal.vue";
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import { storeToRefs } from 'pinia';
import AddBroker from '@/components/AddBroker.vue';
import Dropdown from '@/components/Dropdown.vue';
import EmptyState from '@/components/EmptyState.vue';
import Orders from './Orders.vue';
import Position from './Position.vue';
import ManualOrders from './ManualOrders.vue';
import ManualPosition from './ManualPosition.vue';

const brokerStore = useBrokerIndexStore();
const { brokers, idForDelete, editBrokerData, brokerFilterValue } = storeToRefs(brokerStore);


const activeOptionsMenu = ref(null);
const optionChoice = ref(null);
const selectedBrokerId = ref(null);

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

const selectOption = (option, userId) => {
  optionChoice.value = option;
  selectedBrokerId.value = userId;
  activeOptionsMenu.value = null;
}

const closeOptionModal = () => {
  optionChoice.value = null;
  selectedBrokerId.value = null;
}

// Add mobile menu states
const isFilterMenuOpen = ref(false);
const activeActionsMenu = ref(null);

// Add mobile menu handlers
const toggleActionsMenu = (itemId) => {
  activeActionsMenu.value = activeActionsMenu.value === itemId ? null : itemId;
};

// Click outside handler
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeActionsMenu.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped>
.table-container {
  overflow-x: auto;
}

@media (max-width: 768px) {
  .table-container {
    display: none;
  }
}
</style>
