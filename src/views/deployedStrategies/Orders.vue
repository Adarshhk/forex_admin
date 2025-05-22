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
                            <h1 class="font-bold text-lg">Strategy Orders</h1>
                        </div>
                    </div>
                </div>

            </div>

            <!-- order list -->
            <div>
                <div
                    class="table-container min-h-[50vh] rounded-t-xl xl:max-h-[calc(100vh-180px)] xl:pb-24 overflow-y-auto w-full">
                    <OrderRow v-if="strategyOrders.length" :order="order" v-for="order in strategyOrders"
                        :key="order.id" />
                    <EmptyState v-else />
                </div>
            </div>


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
const { strategyOrders } = storeToRefs(orderStore);

const emit = defineEmits(['close']);

const props = defineProps({
    strategyId: String,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.strategyId && props.isOpen) {
        await orderStore.getOrderByStrategyId(props.strategyId);
    }
})

const handleClose = () => {
    strategyOrders.value = []
    emit("close");
}
const statusClass = (status) => {
    if (status === "SUCCESS") {
        return "bg-custom-green/10 text-custom-green";
    } else if (status === "PENDING") {
        return "bg-custom-yellow/10 text-custom-yellow";
    } else if (status === "REJECTED") {
        return "bg-custom-red/10 text-custom-red";
    } else {
        return "bg-custom-demo/10 text-custom-demo";
    }
};
</script>
