<template>

    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class="min-h-[50vh] w-full lg:w-[350px]">
            <div
                class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
                <h1 class="text-lg font-bold">{{ strategyToEdit ? 'Edit Strategy' : 'Add Strategy' }}</h1>

                <button @click="handleClose" class="text-white/80 p-1">
                    <i class="pi pi-times"></i>
                </button>
            </div>
            <form class="grid grid-cols-1 w-full gap-2 p-4">
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Name</label>
                    <input v-model="formData.name"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Strategy Name" />
                </div>
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Description</label>
                    <input v-model="formData.description"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Description" />
                </div>

                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Min Capital</label>
                    <input v-model="formData.min_capital"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Minimum Capital" />
                </div>
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Win Percentage</label>
                    <input v-model="formData.win_percentage"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter win percentage" />
                </div>
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Risk Reward</label>
                    <input v-model="formData.risk_reward"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Risk Reward e.g.(1:1)" />
                </div>

                <button @click.prevent="handleSubmit"
                    class="min-w-[93px] w-full mt-4 text-sm px-6 py-2 rounded-md bg-custom-blue">Done</button>
            </form>

        </div>
    </Modal>

</template>

<script setup>
import { reactive, watch } from 'vue';
import Modal from '@/components/Modal.vue';
import { storeToRefs } from 'pinia';
import { useStrategiesStore } from '@/stores/matrix/strategies';

const emit = defineEmits(['close']);

const strategyStore = useStrategiesStore();
const { strategyToEdit } = storeToRefs(strategyStore);

const formData = reactive({
  name: '',
  description: '',
  min_capital: '',
  win_percentage: '',
  risk_reward : '',
});

const props = defineProps({
  isOpen: Boolean
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && strategyToEdit.value) {
    formData.name = strategyToEdit.value.name || '';
    formData.description = strategyToEdit.value.description || '';
    formData.win_percentage = strategyToEdit.value.win_percentage || '';
    formData.risk_reward = strategyToEdit.value.risk_reward || '';
    formData.min_capital = strategyToEdit.value.min_capital || '';
  } else {
    formData.name = '';
    formData.description = '';
    formData.win_percentage = '';
    formData.risk_reward = '';
    formData.min_capital = '';
  }
});

const handleClose = () => {
  strategyToEdit.value = null;
  emit('close');
};

const handleSubmit = async () => {
  const res = await strategyStore.addEditStrategy({ ...formData });
  if (res) handleClose();
};


</script>

<style lang="scss" scoped></style>