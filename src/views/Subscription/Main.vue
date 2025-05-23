<template>
    <main class="flex flex-row gap-2 w-full justify-between">
        <section class="w-full">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-white/15">
                <h1 class="text-lg font-bold">Subscriptions</h1>
                <button @click="isEditModalOpen = true"
                    class="flex items-center justify-center bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg text-nowrap">
                    <i class="p-2 pi pi-plus lg:pl-2"></i>
                    <p class="hidden pr-2 pl-1 py-2 lg:block">Add Subscription</p>
                </button>
            </div>

            <!-- Body -->
            <div class="block">
                <!-- Desktop Table -->
                <div class="hidden md:block table-container min-h-[50vh]">
                    <table class="w-full whitespace-nowrap overflow-x-auto">
                        <!-- Keep existing desktop table structure -->
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
                    </table>
                </div>

                <!-- Mobile Cards -->
                <div class="md:hidden">
                    <div v-if="subscriptions.length" class="space-y-4 p-4">
                        <div v-for="(item, i) in subscriptions" :key="item.id" 
                            class="bg-white/5 rounded-lg p-4 border border-white/10">
                            
                            <!-- Card Header -->
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-sm text-gray-400">#{{ i + 1 }}</span>
                                        <h3 class="text-base font-semibold truncate">{{ item.strategy_name }}</h3>
                                    </div>
                                    <p class="text-sm text-gray-400 truncate">{{ item.user_name }}</p>
                                    <p class="text-sm text-gray-400 truncate">{{ item.user_email }}</p>
                                </div>
                                <div class="flex items-center gap-2 ml-4">
                                    <ButtonSwitch @change="handleActiveToggle(item)" 
                                        :id="`mobile-${item.id}`" name="is_active" v-model="item.is_enabled" />
                                </div>
                            </div>

                            <!-- Card Body -->
                            <div class="grid grid-cols-2 gap-3 text-sm mt-2">
                                <div>
                                    <p class="text-gray-400">Payment Status:</p>
                                    <p :class="{
                                        'text-green-400': item.payment_status === 'paid',
                                        'text-yellow-400': item.payment_status === 'pending',
                                        'text-red-400': item.payment_status === 'failed'
                                    }">
                                        {{ item.payment_status }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-gray-400">Start Date:</p>
                                    <p>{{ formatDate(item.subscribed_at) }}</p>
                                </div>
                                <div>
                                    <p class="text-gray-400">End Date:</p>
                                    <p>{{ item.end_date }}</p>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-2 mt-4">
                                <button @click="openEditModal(item)" 
                                    class="p-2 bg-white/10 rounded hover:bg-white/20">
                                    <img src="/svg/edit.svg" alt="Edit" class="w-5 opacity-90" />
                                </button>
                                <button @click="openDeleteModal(item.id)" 
                                    class="p-2 bg-white/10 rounded hover:bg-white/20">
                                    <img src="/svg/delete.svg" alt="Delete" class="w-4 opacity-90" />
                                </button>
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

        <!-- Modals -->
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
