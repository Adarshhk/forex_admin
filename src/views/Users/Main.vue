<template>
  <main class="flex flex-row gap-2 w-full justify-between">
    <!-- dynamic page -->
    <section class="w-full">
      <!-- header -->
      <div class="flex items-center justify-between p-4 border-b border-white/15">
        <h1 class="md:flex items-center font-bold text-lg">Users</h1>
        <div class="hidden md:flex items-center justify-end col-span-4 space-x-2">
          <button @click="isAddEditModalOpen = true"
            class="flex items-center justify-center bg-gradient-to-b nrml-text from-[#00C6FF] to-[#0072FF] rounded-lg w-fit text-nowrap">
            <i class="p-2 lg:pl-2 pi pi-plus"></i>
            <p class="pr-2 hidden lg:block pl-1 py-2 nrml-text">Add User</p>
          </button>
          <div class="bg-white/10 rounded-md flex items-center gap-2 p-2">
            <i class="pi pi-search opacity-20"></i>
            <input v-model="searchQuery" type="text" placeholder="Search"
              class="text-[#b2b5bb] bg-transparent rounded-md w-full outline-none nrml-text" />
          </div>
        </div>

        <!-- Mobile header controls -->
        <div class="flex md:hidden items-center gap-2">
          <button @click="isAddEditModalOpen = true"
            class="flex items-center justify-center bg-gradient-to-b nrml-text from-[#00C6FF] to-[#0072FF] rounded-lg p-2">
            <i class="pi pi-plus"></i>
          </button>
          <button @click="isFilterMenuOpen = true"
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
              <input v-model="searchQuery" type="text" placeholder="Search Users..."
                class="text-[#b2b5bb] bg-transparent rounded-md w-full outline-none nrml-text" />
            </div>
          </div>

          <!-- Add more filters here if needed -->
        </div>

      </div>

      <!-- body -->
      <div class="block">
        <!-- Desktop Table -->
        <div class="hidden md:block table-container max-h-[80vh]">
          <table class="w-full whitespace-nowrap overflow-x-auto">
            <thead class="border sticky top-0 bg-black z-10">
              <tr class="text-left w-full text-sm">
                <th class="w-16">S.NO</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
                <th class="w-96">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredUsers.length" v-for="(item, i) in filteredUsers"
                class="relative text-center text-sm w-full">
                <td>{{ i + 1 }}</td>
                <td class="text-left">{{ item.name }}</td>
                <td class="text-left">{{ item.email }}</td>
                <td class="text-left">{{ item.phone }}</td>
                <td>
                  <div class="flex items-center">
                    <ButtonSwitch @change="handleActiveToggle(item)" :id="`${item.id}`" name="is_active"
                      v-model="item.is_enable" />
                  </div>
                </td>
                <td>
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
                    <button @click="selectOption('brokers', item.id)"
                      class="text-xs px-2 py-1 bg-white/10 rounded hover:bg-white/20">Brokers</button>
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
                <td colspan="6">
                  <EmptyState />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden pb-56">
          <div v-if="filteredUsers.length" class="space-y-4 p-4">
            <div v-for="(item, i) in filteredUsers" :key="item.id"
              class="bg-white/5 rounded-lg p-4 border border-white/10">

              <!-- User Info -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-semibold text-white truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-400 truncate">{{ item.email }}</p>
                  <p class="text-sm text-gray-400">{{ item.phone }}</p>
                </div>
                <div class="flex items-center gap-2 ml-4">
                  <span class="text-xs text-gray-400">#{{ i + 1 }}</span>
                  <ButtonSwitch @change="handleActiveToggle(item)" :id="`mobile-${item.id}`" name="is_active"
                    v-model="item.is_enable" />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-between">
                <div class="flex gap-2">
                  <button @click="openEditModal(item)" title="Edit" class="p-2 bg-white/10 rounded hover:bg-white/20">
                    <img src="/svg/edit.svg" alt="Edit" class="w-4 opacity-90" />
                  </button>
                  <button @click="openDeleteModal(item.id)" title="Delete"
                    class="p-2 bg-white/10 rounded hover:bg-white/20">
                    <img src="/svg/delete.svg" alt="Delete" class="w-4 opacity-90" />
                  </button>
                </div>

                <!-- More actions dropdown -->
                <div class="relative">
                  <button @click="toggleActionsMenu(item.id)"
                    class="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded hover:bg-white/20 text-sm">
                    <span>More</span>
                    <i class="pi pi-chevron-down text-xs"></i>
                  </button>

                  <!-- Dropdown menu -->
                  <div v-if="activeActionsMenu === item.id"
                    class="absolute right-0 top-full mt-1 bg-gray-800 border border-white/20 rounded-lg shadow-lg z-20 min-w-[140px]">
                    <button @click="selectOption('joiners', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 first:rounded-t-lg">
                      Joiners
                    </button>
                    <button @click="selectOption('brokers', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10">
                      Brokers
                    </button>
                    <button @click="selectOption('manual_position', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10">
                      Manual Pos
                    </button>
                    <button @click="selectOption('positions', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10">
                      Positions
                    </button>
                    <button @click="selectOption('manual_orders', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10">
                      Manual Orders
                    </button>
                    <button @click="selectOption('orders', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10">
                      Orders
                    </button>
                    <button @click="selectOption('subscriptions', item.id)"
                      class="block w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 last:rounded-b-lg">
                      Subscriptions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile empty state -->
          <div v-else class="p-8">
            <EmptyState />
          </div>
        </div>
      </div>
    </section>

    <!-- Modals -->
    <AddEditModal :isOpen="isAddEditModalOpen" @close="isAddEditModalOpen = false" />
    <DeleteModal v-model="isDeleteModalOpen" @close="{ isDeleteModalOpen = false; idToDelete.value = null }"
      @confirm="deleteUser" />

    <!-- Feature modals -->
    <Broker :isOpen="optionChoice === 'brokers'" :userId="selectedUserId" @close="closeOptionModal" />
    <ManualPosition :isOpen="optionChoice === 'manual_position'" :userId="selectedUserId" @close="closeOptionModal" />
    <Position :isOpen="optionChoice === 'positions'" :userId="selectedUserId" @close="closeOptionModal" />
    <ManualOrders :isOpen="optionChoice === 'manual_orders'" :userId="selectedUserId" @close="closeOptionModal" />
    <Orders :isOpen="optionChoice === 'orders'" :userId="selectedUserId" @close="closeOptionModal" />
    <Subscription :isOpen="optionChoice === 'subscriptions'" :userId="selectedUserId" @close="closeOptionModal" />
    <Joiner :isOpen="optionChoice === 'joiners'" :userId="selectedUserId" @close="closeOptionModal" />
  </main>
</template>

<script setup>
import ButtonSwitch from '@/components/ButtonSwitch.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import { useUserStore } from '@/stores/matrix/users';
import { storeToRefs } from 'pinia';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import AddEditModal from './AddEditModal.vue';
import Broker from './Broker.vue';
import ManualPosition from './ManualPosition.vue';
import Position from './Positions.vue';
import ManualOrders from './ManualOrders.vue';
import Orders from './Orders.vue';
import Subscription from './Subscription.vue';
import Joiner from './Joiner.vue';
import EmptyState from '@/components/EmptyState.vue';

// Options menu related refs
const activeOptionsMenu = ref(null);
const activeActionsMenu = ref(null);
const isFilterMenuOpen = ref(false);
const optionChoice = ref(null);
const selectedUserId = ref(null);

// Modal states
const isDeleteModalOpen = ref(false);
const isAddEditModalOpen = ref(false);

const userStore = useUserStore();

const { users, searchQuery, userToEdit, idToDelete } = storeToRefs(userStore);

const filteredUsers = computed(() => {
  if (searchQuery.value != '') {
    return users.value.filter(user => {
      if (user.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        return user
      }
    })
  }
  return users.value
})

const openEditModal = (user) => {
  userToEdit.value = user;
  isAddEditModalOpen.value = true;
  activeActionsMenu.value = null;
}

const openDeleteModal = (id) => {
  idToDelete.value = id;
  isDeleteModalOpen.value = true;
  activeActionsMenu.value = null;
}

const deleteUser = async () => {
  await userStore.deleteUser()
}

const handleActiveToggle = async (item) => {
  userToEdit.value = item;
  await userStore.addEditUser({ 'is_enable': item.is_enable })
  userToEdit.value = null
}

const selectOption = (option, userId) => {
  optionChoice.value = option;
  selectedUserId.value = userId;
  activeOptionsMenu.value = null;
  activeActionsMenu.value = null;
}

const closeOptionModal = () => {
  optionChoice.value = null;
  selectedUserId.value = null;
}

const toggleActionsMenu = (userId) => {
  if (activeActionsMenu.value === userId) {
    activeActionsMenu.value = null;
  } else {
    activeActionsMenu.value = userId;
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeActionsMenu.value = null;
  }
}

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