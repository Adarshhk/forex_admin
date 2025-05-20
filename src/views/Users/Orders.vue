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
                            <h1 class="font-bold text-lg">User Orders</h1>
                        </div>
                    </div>
                </div>

            </div>

            <!-- order list -->
            <OrderRow v-if="userOrders.length" :order="order" v-for="order in userOrders" :key="order.id" />
            <EmptyState v-else />


        </div>
    </Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import OrderRow from '../Orders/OrderRow.vue';
import EmptyState from '@/components/EmptyState.vue';
import { onMounted, watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';
import { useOrderStore } from '@/stores/matrix/orders';

const orderStore = useOrderStore();
const { userOrders } = storeToRefs(orderStore);

const emit = defineEmits(['close']);

const props = defineProps({
    userId: String,
    isOpen : Boolean
})

watchEffect(async () => {
    if (props.userId && props.isOpen) {
        await orderStore.getOrderByuserId(props.userId);
    }
})

const handleClose = () => {
    userOrders.value = []
    emit("close");
}
</script>
