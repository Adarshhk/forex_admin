<template>
    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class=" w-full lg:w-[80dvw] ">
        <!-- header with filters -->
        <div class="flex items-center justify-between p-4 border-b border-white/15">
            <div class="flex items-center gap-4">
                <!-- Toggle is moved to parent component -->
                <div class="flex items-center justify-between ">
                    <div class="flex items-center gap-4">
                        <h1 class="font-bold text-lg">User Manual Positions</h1>

                    </div>
                </div>
            </div>

        </div>

        <!-- positions list -->
        <div>
            <div
                class="table-container min-h-[50vh] rounded-t-xl xl:max-h-[calc(100vh-180px)] xl:pb-24 overflow-y-auto w-full">
                <Position v-if="userPositions.length" v-for="position in userPositions" :position="position"
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
import Position from './Positions.vue';
import { useManualPositionStore } from '@/stores/matrix/manualposition';

const manualPositionStore = useManualPositionStore();
const { userPositions } = storeToRefs(manualPositionStore)

const emit = defineEmits(['close']);

const props = defineProps({
    userId: Number,
    isOpen: Boolean
})

watchEffect(async () => {
    if (props.userId && props.isOpen) {
        await manualPositionStore.getPositionByUserId(props.userId);
    }
})

const handleClose = () => {
    userPositions.value = []
    emit("close");
}

</script>
