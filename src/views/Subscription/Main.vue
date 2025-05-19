<template>
    <main class="flex flex-row gap-2 w-full justify-between">
        <!-- dynamic page -->
        <section class="w-full">
            <!-- header -->
            <div class="flex items-center justify-between p-4 border-b border-white/15">
                <h1 class="md:flex items-center font-bold text-lg">Subscriptions</h1>
                <button @click="isEditModalOpen = true"
                    class="flex items-center justify-center bg-gradient-to-b nrml-text from-[#00C6FF] to-[#0072FF] rounded-lg w-fit text-nowrap">
                    <i class="p-2 lg:pl-2 pi pi-plus"></i>
                    <p class="pr-2 hidden lg:block pl-1 py-2 nrml-text">Add Subscription</p>
                </button>
                <!-- <div class="hidden md:flex items-center justify-end col-span-4 space-x-1"> -->
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
          </div>
        </div> -->

                <!-- Filter Icon for Mobile -->
                <!-- <button
          class="flex md:hidden items-center justify-center small-btn-gradient2 p-1 xs:p-1.5 border border-white/10 rounded-[10px] xl:rounded-full text-nowrap">
          <img src="/svg/filter.svg" alt="filter" class="w-6 h-6" />
        </button> -->
            </div>

            <!-- body -->
            <div class="">
                <div class="table-container  min-h-[50vh]">
                    <table class="w-full whitespace-nowrap overflow-x-auto">
                        <thead class="border">
                            <tr class="text-left w-full px-4 py-3 text-sm">
                                <th>
                                    <div><span>S.NO</span></div>
                                </th>
                                <th>Strategy Name</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Payment Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Active</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="subscriptions.length" v-for="(item, i) in subscriptions"
                                class="text-left text-sm w-full px-4 py-2">
                                <td>
                                    <div class="text-center"><span>{{ i + 1 }}</span></div>
                                </td>
                                <td>
                                    <div>{{ item.strategy_name }}</div>
                                </td>
                                <td>{{ item.user_name }}</td>
                                <td>{{ item.user_email }}</td>
                                <td>
                                    {{ item.payment_status }}
                                </td>
                                <td>
                                    {{ formatDate(item.subscribed_at) }}
                                </td>
                                <td>
                                    {{ item.end_date }}
                                </td>
                                <td>
                                    <div class="flex items-center">
                                        <ButtonSwitch @change="handleActiveToggle(item)" :id="`${item.id}`"
                                            name="is_active" v-model="item.is_enabled" />
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
                                <td colspan="7">
                                    <EmptyState />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <AddEditModal :isOpen="isEditModalOpen" @close="closeEditModal" />
        <DeleteModal v-model="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="handleDeleteBroker" />

    </main>
</template>

<script setup>
import EmptyState from '@/components/EmptyState.vue';
import { useSubscriptionStore } from '@/stores/matrix/subscription';
import { storeToRefs } from 'pinia';
import AddEditModal from './AddEditModal.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import { ref } from 'vue';


const subscriptionStore = useSubscriptionStore();
const { subscriptions, editSubscriptionDate, idForDelete } = storeToRefs(subscriptionStore);

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

const handleDeleteBroker = async () => {
    await subscriptionStore.deleteSubscription();
    isDeleteModalOpen.value = false;
};
const openDeleteModal = (id) => {
    idForDelete.value = id;
    isDeleteModalOpen.value = true;
};

const openEditModal = (subscription) => {
    editSubscriptionDate.value = subscription;
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    editSubscriptionDate.value = null;
    isEditModalOpen.value = false;
};

const handleActiveToggle = async (subscription) => {
  subscriptionStore.addEditSubscriptions(subscription.id, { is_active: subscription.is_active });
};



</script>

<style scoped></style>
