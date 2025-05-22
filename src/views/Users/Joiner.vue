<!-- ManualOrders.vue - Handles manual orders display and filtering -->
<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class=" w-full lg:w-[80dvw] ">
            <div class="flex items-center justify-between p-4 border-b border-white/15">
                <div class="flex items-center gap-4">
                    <!-- Toggle is moved to parent component -->
                    <div class="flex items-center justify-between ">
                        <div class="flex items-center gap-4">
                            <h1 class="font-bold text-lg">User Joiners</h1>
                        </div>
                    </div>
                </div>

            </div>
            <div class="table-container overflow-auto h-[50vh]">
                <table class="w-full whitespace-nowrap overflow-x-auto">
                    <thead class="border">
                        <tr class="text-left w-full px-4 py-3 text-sm">
                            <th>S.NO</th>
                            <th>Strategy</th>
                            <th>Broker Name</th>
                            <th>User Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="userJoiners.length" v-for="(item, i) in userJoiners"
                            class="text-left text-sm w-full px-4 py-2">
                            <td>
                                <div class="text-center"><span>{{ i + 1 }}</span></div>
                            </td>
                            <td>
                                <div>{{ item.strategy_name }}</div>
                            </td>
                            <td>{{ item.broker_name }}</td>
                            <td>{{ item.user_name }}</td>

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
        <Modal :modelValue="isEditModalOpen" @close="closeEditModal">

            <div class="min-h-[50vh] w-full lg:w-[350px]">
                <div
                    class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
                    <h1 class="text-lg font-bold">Edit Joiner</h1>

                    <button @click="closeModal" class="text-white/80 p-1">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <form class="grid grid-cols-1 w-full gap-2 p-4">
                    <div class="space-y-1">
                        <label for="name" class="text-sm text-white/40 font-semibold">Lot Size</label>
                        <input v-model="formdata.quantity"
                            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                            type="number" placeholder="Enter Lot Size" />
                    </div>

                    <button @click.prevent="handleSubmit"
                        class="min-w-[93px] w-full mt-4 text-sm px-6 py-2 rounded-md bg-custom-blue">Done</button>
                </form>
            </div>

        </Modal>
        <!-- <AddBroker :isOpen="isEditModalOpen" @close="closeEditModal" /> -->
       
    </Modal>
     <DeleteModal v-model="isDeleteModalOpen" @close="isDeleteModalOpen = false" @confirm="handleDeleteJoiner" />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import EmptyState from '@/components/EmptyState.vue';
import { ref, watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';
import DeleteModal from '@/components/DeleteModal.vue';
import { useJoinerStore } from '@/stores/matrix/joiners';

const joinerStore = useJoinerStore();
const { userJoiners , idForDelete} = storeToRefs(joinerStore);

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);

const emit = defineEmits(['close']);

const props = defineProps({
    userId: Number,
    isOpen: Boolean
})

const formdata = ref({
    quantity: 0,
    id : null
});

watchEffect(async () => {
    if (props.userId && props.isOpen) {
        await joinerStore.getJoinerByUserId(props.userId);
    }
})


const openDeleteModal = (id) => {
    idForDelete.value = id;
    isDeleteModalOpen.value = true;
};

const openEditModal = (joiner) => {
    formdata.value.quantity = joiner.quantity
    formdata.value.id = joiner.id
    isEditModalOpen.value = true;
};

const closeEditModal = () => {
    formdata.value.quantity = 0;
    formdata.value.id = null    
    isEditModalOpen.value = false;
};

const handleActiveToggle = async (joiner) => {
    console.log(joiner)
    await joinerStore.editJoiner({ is_enabled: joiner.is_enabled } , joiner.id);
};

const handleClose = () => {
    userJoiners.value = []
    emit("close");
}

const handleDeleteJoiner = async () => {
    await joinerStore.deleteJoiner()
    isDeleteModalOpen.value = false;
    idForDelete.value = null
}

const handleSubmit = async () => {
    await joinerStore.editJoinerQuantity(formdata.value);
    closeEditModal();
};
</script>
