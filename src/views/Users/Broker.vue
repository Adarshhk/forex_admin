<!-- ManualOrders.vue - Handles manual orders display and filtering -->
<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class="w-[80dvw]">
            <div class="table-container  min-h-[50vh]">
                <table class="w-full whitespace-nowrap overflow-x-auto">
                    <thead class="border">
                        <tr class="text-left w-full px-4 py-3 text-sm">
                            <th>
                                <div><span>S.NO</span></div>
                            </th>
                            <th>Name</th>
                            <th>Broker ID</th>
                            <th>Server</th>
                            <th>Connect</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="userBrokers.length" v-for="(item, i) in userBrokers"
                            class="text-left text-sm w-full px-4 py-2">
                            <td>
                                <div class="text-center"><span>{{ i + 1 }}</span></div>
                            </td>
                            <td>
                                <div>{{ item.broker_name }}</div>
                            </td>
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
                            <td colspan="7">
                                <EmptyState />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <AddBroker :isOpen="isEditModalOpen" @close="closeEditModal" />
        <DeleteModal v-model="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="handleDeleteBroker" />
    </Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import EmptyState from '@/components/EmptyState.vue';
import { ref, watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import AddBroker from '@/components/AddBroker.vue';
import DeleteModal from '@/components/DeleteModal.vue';

const brokerStore = useBrokerIndexStore();
const { userBrokers } = storeToRefs(brokerStore);

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);

const emit = defineEmits(['close']);

const props = defineProps({
    userId: String,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.userId) {
        await brokerStore.getBrokerByUserId(props.userId);
    }
})

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

const handleClose = () => {
    userBrokers.value = []
    emit("close");
}
</script>
