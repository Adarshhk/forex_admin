<!-- ManualOrders.vue - Handles manual orders display and filtering -->
<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class="w-[80dvw]">
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

            <!-- mobile view -->
            <div class="md:hidden border-t border-white/15">
                <div v-if="userOrders.length" v-for="item in userOrders" :key="item.id"
                    class="flex justify-between text-sm w-full px-4 py-2 border-b border-white/20">
                    <div>
                        <div class="flex space-x-1 mb-1.5 ">
                            <h1 class="text-white/50">Name: </h1>
                            <p class="text-white/90">{{ item.name }}</p>
                        </div>
                        <div class="flex space-x-1 mb-1.5 ">
                            <h1 class="text-white/50">Broker Id: </h1>
                            <p class="text-white/90">{{ item.broker_id }}</p>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-end space-x-1 mb-1.5">
                            <div v-if="item.side === 'BUY'"
                                class="capitalize bg-[#4BCE9738] border-t text-custom-green border-custom-green rounded-full w-7 h-7 flex items-center justify-center">
                                B</div>
                            <div v-else-if="item.side === 'SELL'"
                                class="capitalize bg-[#F22B5B38] border-t text-custom-red border-custom-red rounded-full w-7 h-7 flex items-center justify-center">
                                S</div>
                        </div>

                        <div class="flex space-x-1 mb-1.5 ">
                            <h1 class="text-white/50">Price: </h1>
                            <p class="text-white/90">{{ item.price }}</p>
                        </div>

                        <div class="flex space-x-1 mb-1.5 ">
                            <h1 class="text-white/50">Quantity: </h1>
                            <p class="text-white/90">{{ item.quantity }}</p>
                        </div>

                        <div class="flex space-x-1 mb-1.5 ">
                            <div class="flex items-center justify-center rounded-md px-4 py-1"
                                :class="statusClass((item.status.toUpperCase()))">
                                {{ item.status }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    No Data Found
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
