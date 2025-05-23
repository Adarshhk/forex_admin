<template>
  <main class="flex flex-row gap-2 w-full justify-between">
    <section class="w-full">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-white/15">
        <h1 class="md:flex items-center font-bold text-lg">Deployed strategies</h1>


        <!-- Desktop Controls -->
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
        </div>

        <!-- Mobile Controls -->
        <div class="flex md:hidden items-center gap-2">
          <button @click="isAddEditModalOpen = true"
            class="flex items-center justify-center bg-gradient-to-b nrml-text from-[#00C6FF] to-[#0072FF] rounded-lg p-2">
            <i class="pi pi-plus"></i>
          </button>
          <button @click="openFilterMenu"
            class="flex items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] text-nowrap">
            <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
          </button>
        </div>
      </div>
      <div v-if="isFilterMenuOpen" class="fixed inset-0 bg-black/50 z-50 md:hidden">
        <div class="absolute right-0 top-0 h-full w-3/4 bg-gray-900 p-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-bold">Filters</h2>
            <button @click="isFilterMenuOpen = false" class="p-2 hover:bg-white/10 rounded-full">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <!-- Search Filter -->
          <div class="mb-6">
            <div class="bg-white/10 rounded-md flex items-center gap-2 p-2">
              <i class="pi pi-search opacity-20"></i>
              <input v-model="searchQuery" type="text" placeholder="Search strategies..."
                class="text-[#b2b5bb] bg-transparent rounded-md w-full outline-none nrml-text" />
            </div>
          </div>

          <!-- Add more filters here if needed -->
        </div>

      </div>

      <!-- Body -->
      <div class="block">
        <!-- Desktop Table -->
        <div class="hidden md:block table-container max-h-[80vh]">
          <table class="w-full whitespace-nowrap overflow-x-auto">
            <!-- ... keep existing desktop table structure ... -->
            <thead class=" sticky top-0 bg-black z-20">
              <tr class="text-sm">
                <th class="p-4 text-left w-64">Name</th>
                <th class="p-4 text-left w-24">Symbol</th>
                <th class="p-4 text-left w-32">Win %</th>
                <th class="p-4 text-left w-44">Risk-Reward</th>
                <th class="p-4 text-left w-64">Min Capital</th>
                <th class="p-4 text-left w-28">Active</th>
                <th class="p-4 text-left w-64">Action</th>

              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredStrategies.length" v-for="(item, i) in filteredStrategies"
                class="text-left text-sm w-full border-y border-custom-white/15">

                <td>
                  <div class="flex items-center gap-2">
                    {{ item.name }}
                    <button @click="copyToClipboard(item.strategy_code)" class="text-white hover:text-blue-400"
                      title="Copy Secret Code">
                      <i class="pi pi-copy"></i>
                    </button>
                  </div>
                </td>
                <td class="text-left p-4">{{ item.symbol }}</td>
                <td class="text-left p-4">{{ item.win_percentage }}</td>
                <td class="text-left p-4">{{ item.risk_reward }}</td>
                <td class="text-left p-4">{{ item.min_capital }}</td>

                <td class="text-left p-4">
                  <div class="flex items-center">
                    <ButtonSwitch @change="handleActiveToggle(item)" :id="`${item.id}`" name="is_active"
                      v-model="item.is_enabled" />
                  </div>
                </td>

                <td class="text-center py-2">
                  <div class="flex flex-wrap gap-2">
                    <button @click="openEditModal(item)" title="Edit" class="p-1 bg-white/10 rounded hover:bg-white/20">
                      <img src="/svg/edit.svg" alt="Edit" class="w-5 opacity-90" />
                    </button>
                    <button @click="openDeleteModal(item.id)" title="Delete"
                      class="p-1 bg-white/10 rounded hover:bg-white/20">
                      <img src="/svg/delete.svg" alt="Delete" class="w-4 opacity-90" />
                    </button>
                    <button @click="selectOption('joiners', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Joiners</button>
                    <button @click="selectOption('manual_position', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Manual Pos</button>
                    <button @click="selectOption('positions', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Positions</button>
                    <button @click="selectOption('manual_orders', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Manual Orders</button>
                    <button @click="selectOption('orders', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Orders</button>
                    <button @click="selectOption('subscriptions', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Subscriptions</button>
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

        <!-- Mobile Cards -->
        <div class="md:hidden">
          <div v-if="filteredStrategies.length" class="space-y-4 p-4">
            <div v-for="(item, i) in filteredStrategies" :key="item.id"
              class="bg-white/5 rounded-lg p-4 border border-white/10">

              <!-- Card Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-base font-semibold truncate">{{ item.name }}</h3>
                    <button @click="copyToClipboard(item.strategy_code)" class="text-white hover:text-blue-400"
                      title="Copy Secret Code">
                      <i class="pi pi-copy text-sm"></i>
                    </button>
                  </div>
                  <div class="flex items-center gap-4 text-sm">
                    <div>
                      <span class="text-gray-400">Symbol:</span>
                      <span class="ml-1">{{ item.symbol }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Win:</span>
                      <span class="ml-1">{{ item.win_percentage }}</span>
                    </div>
                    <div>
                      <span class="text-gray-400">Risk-Reward:</span>
                      <span class="ml-1">{{ item.risk_reward }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-4">
                  <ButtonSwitch @change="handleActiveToggle(item)" :id="`mobile-${item.id}`" name="is_active"
                    v-model="item.is_enabled" />
                </div>
              </div>

              <!-- Card Body -->
              <div class="grid grid-cols-2 gap-3 text-sm mt-2">
                <div>
                  <p class="text-gray-400">Min Capital:</p>
                  <p>{{ item.min_capital }}</p>
                </div>
                <!-- Add more fields here if needed -->
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between mt-4">
                <div class="flex gap-2">
                  <button @click="openEditModal(item)" title="Edit" class="p-2 bg-white/10 rounded hover:bg-white/20">
                    <img src="/svg/edit.svg" alt="Edit" class="w-4 opacity-90" />
                  </button>
                  <button @click="openDeleteModal(item.id)" title="Delete"
                    class="p-2 bg-white/10 rounded hover:bg-white/20">
                    <img src="/svg/delete.svg" alt="Delete" class="w-4 opacity-90" />
                  </button>
                </div>

                <!-- More Actions Dropdown -->
                <div class="relative">
                  <button @click="toggleActionsMenu(item.id)"
                    class="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 text-sm">
                    <span>More</span>
                    <i class="pi pi-chevron-down text-xs"></i>
                  </button>

                  <div v-if="activeActionsMenu === item.id"
                    class="absolute right-0 top-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-20 min-w-[140px]">
                    <button @click="selectOption('joiners', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 first:rounded-t-lg">
                      Joiners
                    </button>
                    <button @click="selectOption('manual_position', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                      Manual Pos
                    </button>
                    <button @click="selectOption('positions', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                      Positions
                    </button>
                    <button @click="selectOption('manual_orders', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                      Manual Orders
                    </button>
                    <button @click="selectOption('orders', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10">
                      Orders
                    </button>
                    <button @click="selectOption('subscriptions', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 last:rounded-b-lg">
                      Subscriptions
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

    <!-- Keep existing modals -->
    <AddEditModal :isOpen="isAddEditModalOpen" @close="isAddEditModalOpen = false" />
    <DeleteModal v-model="isDeleteModalOpen" @close="{ isDeleteModalOpen = false; idToDelete.value = null }"
      @confirm="deleteStrategy" />
    <Subscriptions :isOpen="optionChoice === 'subscriptions'" :strategyId="selectedStrategyId"
      @close="closeOptionModal" />
    <ManualOrders :isOpen="optionChoice === 'manual_orders'" :strategyId="selectedStrategyId"
      @close="closeOptionModal" />
    <ManualPosition :isOpen="optionChoice === 'manual_position'" :strategyId="selectedStrategyId"
      @close="closeOptionModal" />
    <Position :isOpen="optionChoice === 'positions'" :strategyId="selectedStrategyId" @close="closeOptionModal" />
    <Orders :isOpen="optionChoice === 'orders'" :strategyId="selectedStrategyId" @close="closeOptionModal" />
    <Joiner :isOpen="optionChoice === 'joiners'" :strategyId="selectedStrategyId" @close="closeOptionModal" />
  </main>
</template>


<script setup>
import DeleteModal from '@/components/DeleteModal.vue';
import { useStrategiesStore } from '@/stores/matrix/strategies';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AddEditModal from './AddEditModal.vue';
import ManualOrders from './ManualOrders.vue';
import ManualPosition from './ManualPosition.vue';
import Position from './Position.vue';
import Orders from './Orders.vue';
import Joiner from './Joiner.vue';
import Subscriptions from './Subscriptions.vue';
import EmptyState from '@/components/EmptyState.vue';

const isDeleteModalOpen = ref(false);

// Add to existing script setup
const isFilterMenuOpen = ref(false);
const isAddEditModalOpen = ref(false);
// Options menu related refs
const searchQuery = ref('');
const activeOptionsMenu = ref(null);
const optionChoice = ref(null);
const selectedStrategyId = ref(null);

const strategiesStore = useStrategiesStore();
const { strategies, idToDelete, strategyToEdit } = storeToRefs(strategiesStore);

const filteredStrategies = computed(() => {
  if (searchQuery.value != '') {
    return strategies.value.filter(strat => {
      if (strat.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return strat
      }
    })
  }
  return strategies.value
})

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

const openFilterMenu = () => {
  isFilterMenuOpen.value = true;
}

const handleActiveToggle = async (item) => {
  strategyToEdit.value = item;
  await strategiesStore.addEditStrategy({ 'is_enabled': item.is_enabled })
  userToEdit.value = null
}

const selectOption = (option, userId) => {
  optionChoice.value = option;
  selectedStrategyId.value = userId;
  activeOptionsMenu.value = null;
}

const closeOptionModal = () => {
  optionChoice.value = null;
  selectedStrategyId.value = null;
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Copied to clipboard:', text);
    })
    .catch(err => {
      console.error('Failed to copy:', err);
    });
};

// Add mobile menu handling
const activeActionsMenu = ref(null);

const toggleActionsMenu = (itemId) => {
  activeActionsMenu.value = activeActionsMenu.value === itemId ? null : itemId;
};

// Click outside handler
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeActionsMenu.value = null;
  }
  // if (!event.target.closest('.fixed') && isFilterMenuOpen.value) {
  //   isFilterMenuOpen.value = false;
  // }

};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));


</script>