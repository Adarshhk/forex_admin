<!-- ManualOrders.vue - Handles manual orders display and filtering -->
<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <section class="w-[80vw]">
            <!-- header -->

            <div class="flex items-center justify-between p-4 border-b border-white/15">
                <h1 class="md:flex items-center font-bold text-lg">Strategy Subscriptions</h1>

            </div>

            <!-- body -->
            <div class="block">
                <div class="table-container  max-h-[80vh]">
                    <table class="w-full whitespace-nowrap overflow-x-auto">
                        <thead class="border sticky top-0 bg-black z-10">
                            <tr class="text-left w-full text-sm">
                                <th class="w-32">S.NO</th>
                                <th>Strategy Name</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Disable</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="strategySubscriptions.length" v-for="(item, i) in strategySubscriptions"
                                class="relative text-center text-sm w-full ">
                                <td>{{ i + 1 }}</td>
                                <td class="text-left">{{ item.strategy_name }}</td>
                                <td class="text-left">{{ item.username }}</td>
                                <td class="text-left">{{ item.email }}</td>

                                <td>
                                    <div class="flex items-center">
                                        <ButtonSwitch @change="handleActiveToggle(item)" :id="`${item.id}`"
                                            name="is_active" v-model="item.is_enable" />
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
    </Modal>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import EmptyState from '@/components/EmptyState.vue';
import { onMounted, watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';
import { useSubscriptionStore } from '@/stores/matrix/subscription';

const subscriptionStore = useSubscriptionStore();
const { strategySubscriptions } = storeToRefs(subscriptionStore);

const emit = defineEmits(['close']);

const props = defineProps({
    strategyId: String,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.strategyId && props.isOpen) {
        await subscriptionStore.getSubscriptionByStrategyId(props.strategyId);
    }
})

const handleClose = () => {
    strategySubscriptions.value = []
    emit("close");
}
</script>
