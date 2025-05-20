<!-- ManualOrders.vue - Handles manual orders display and filtering -->
<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class=" w-full lg:w-[80dvw] ">
            <!-- header with filters -->
            <div class="flex items-center justify-between p-4 border-b border-white/15">
                <div class="flex items-center gap-4">
                    <!-- Toggle is moved to parent component -->
                    <div class="flex items-center justify-between ">
                        <div class="flex items-center gap-4">
                            <h1 class="font-bold text-lg">User Manual Orders</h1>
                        </div>
                    </div>
                </div>

            </div>

            <!-- order list -->
            <OrderRow v-if="userManualOrders.length" :order="order" v-for="order in userManualOrders" :key="order.id" />
            <EmptyState v-else />

            <!-- mobile view -->
            
        </div>
    </Modal>
</template>

<script setup>
import { useManualOrderStore } from '@/stores/matrix/manualorder';
import { storeToRefs } from 'pinia';
import OrderRow from '../Orders/OrderRow.vue';
import EmptyState from '@/components/EmptyState.vue';
import { onMounted, watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';

// Get manual order data from store
const manualOrderStore = useManualOrderStore();
const { userManualOrders } = storeToRefs(manualOrderStore);

const emit = defineEmits(['close']);

const props = defineProps({
    userId: String,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.userId && props.isOpen) {
        await manualOrderStore.getOrderByuserId(props.userId);
    }
})

const handleClose = () => {
    userManualOrders.value = []
    emit("close");
}


</script>
