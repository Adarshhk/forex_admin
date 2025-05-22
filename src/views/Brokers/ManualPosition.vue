<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class=" w-full lg:w-[80dvw] ">
        <!-- header with filters -->
        <div class="flex items-center justify-between p-4 border-b border-white/15">
            <div class="flex items-center gap-4">
                <!-- Toggle is moved to parent component -->
                <div class="flex items-center justify-between ">
                    <div class="flex items-center gap-4">
                        <h1 class="font-bold text-lg">Broker Manual Positions</h1>

                    </div>
                </div>
            </div>

        </div>

        <!-- positions list -->
        <div>
            <div
                class="table-container min-h-[50vh] rounded-t-xl xl:max-h-[calc(100vh-180px)] xl:pb-24 overflow-y-auto w-full">
                <Position v-if="brokerPositions.length" v-for="position in brokerPositions" :position="position"
                    :key="position.id" />
                <EmptyState v-else />
            </div>
        </div>


    </div>
    </Modal>
</template>

<script setup>

import { storeToRefs } from 'pinia';
import EmptyState from '@/components/EmptyState.vue';
import { onMounted, watchEffect } from 'vue';
import Modal from '@/components/Modal.vue';
import Position from '../Positions/Position.vue';
import { useManualPositionStore } from '@/stores/matrix/manualposition';

const manualPositionStore = useManualPositionStore();
const { brokerPositions } = storeToRefs(manualPositionStore)

const emit = defineEmits(['close']);

const props = defineProps({
    brokerId: String,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.brokerId && props.isOpen) {
        await manualPositionStore.getPositionByBrokerId(props.brokerId);
    }
})

const handleClose = () => {
    brokerPositions.value = []
    emit("close");
}

</script>
