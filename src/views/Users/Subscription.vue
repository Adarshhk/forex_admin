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
                            <h1 class="font-bold text-lg">User Subscriptions</h1>
                        </div>
                    </div>
                </div>

            </div>

            <div class="">
                <div class="table-container overflow-auto h-[50vh]">
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

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="userSubscriptions.length" v-for="(item, i) in userSubscriptions"
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
        </div>
    </Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import EmptyState from '@/components/EmptyState.vue';
import { watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';
import { useSubscriptionStore } from '@/stores/matrix/subscription';

const subscriptionStore = useSubscriptionStore();
const { userSubscriptions } = storeToRefs(subscriptionStore);
const emit = defineEmits(['close']);

const props = defineProps({
    userId: Number,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.userId && props.isOpen) {
        await subscriptionStore.getSubscriptionByUserId(props.userId);
    }
})


const handleActiveToggle = async (subscription) => {
    subscriptionStore.addEditSubscriptions(subscription.id, { is_active: subscription.is_active });
};

const handleClose = () => {
    userSubscriptions.value = []
    emit("close");
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
</script>
