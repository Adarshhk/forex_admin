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
          <!-- Status Filter -->
          <!-- <div class="relative">
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
          </div> -->

          <!-- Broker Filter -->
          <!-- <div class="relative">
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
          </div> -->
        </div>

        <!-- Filter Icon for Mobile -->
        <button
          class="flex md:hidden items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
          <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
        </button>
      </div>

      <!-- body -->
      <div class="block">
        <div class="table-container  max-h-[80vh]">
          <table class="w-full whitespace-nowrap overflow-x-auto">
            <thead class="border sticky top-0 bg-black z-10">
              <tr class="text-left w-full text-sm">
                <th class="w-32">S.NO</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Disable</th>
                <th class="w-96">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredUsers.length" v-for="(item, i) in filteredUsers"
                class="relative text-center text-sm w-full ">
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
                <td colspan="7">
                  <EmptyState />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <AddEditModal :isOpen="isAddEditModalOpen" @close="isAddEditModalOpen = false" />
    <DeleteModal v-model="isDeleteModalOpen" @close="{ isDeleteModalOpen = false; idToDelete.value = null }"
      @confirm="deleteUser" />

    <!-- You would need to create these modals for each option -->
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
import { computed, ref } from 'vue';
import AddEditModal from './AddEditModal.vue';
import Broker from './Broker.vue';
import ManualPosition from './ManualPosition.vue';
import Position from './Position.vue';
import ManualOrders from './ManualOrders.vue';
import Orders from './Orders.vue';
import Subscription from './Subscription.vue';
import Joiner from './Joiner.vue';

// Options menu related refs
const activeOptionsMenu = ref(null);
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
      if (user.name.includes(searchQuery.value)) {
        return user
      }
    })
  }
  return users.value
})

const openEditModal = (user) => {
  userToEdit.value = user;
  isAddEditModalOpen.value = true;
}

const openDeleteModal = (id) => {
  idToDelete.value = id;
  isDeleteModalOpen.value = true;
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
}

const closeOptionModal = () => {
  optionChoice.value = null;
  selectedUserId.value = null;
}

</script>

<style scoped></style>