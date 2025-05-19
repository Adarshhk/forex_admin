<template>
    <Modal v-model="props.isOpen" @close="closeModal">
        <div class="min-h-[50vh] w-full lg:w-[350px]">
            <div
                class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
                <h1 class="text-lg font-bold">{{ editSubscriptionDate ? 'Edit Subscription' : 'Add Subscription' }}</h1>

                <button @click="closeModal" class="text-white/80 p-1">
                    <i class="pi pi-times"></i>
                </button>
            </div>

            <form class="grid grid-cols-1 w-full gap-2 p-4">
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">User</label>
                    <div class="relative" ref="userDropdownRef">
                        <input v-model="formData.user_name" @focusin="selectUser = true"
                            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 text-sm focus:ring-custom-blue"
                            readonly type="text" placeholder="Select User" />
                        <i class="pi pi-chevron-down absolute top-1/2 right-3 transform -translate-y-1/2 text-white/50"></i>
                        <div v-if="selectUser"
                            class="absolute top-12 left-0 w-full bg-[#1d1b20] border border-white/20 rounded-md shadow-lg z-10">
                            <ul class="max-h-40 overflow-y-auto no-scrollbar">
                                <li v-for="(user, index) in users" :key="index"
                                    class="px-4 py-2 text-sm hover:bg-white/20 cursor-pointer"
                                    @click="updateUser(user.id)">
                                    {{ user.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Strategy</label>
                    <div class="relative" ref="strategyDropDownRef">
                        <input v-model="formData.strategy_name" @focusin="selectStrategy = true"
                            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 text-sm focus:ring-custom-blue"
                            readonly type="text" placeholder="Select Strategy" />
                        <i class="pi pi-chevron-down absolute top-1/2 right-3 transform -translate-y-1/2 text-white/50"></i>
                        <div v-if="selectStrategy"
                            class="absolute top-12 left-0 w-full bg-[#1d1b20] border border-white/20 rounded-md shadow-lg z-10">
                            <ul class="max-h-40 overflow-y-auto no-scrollbar">
                                <li v-for="(strategy, index) in strategies" :key="index"
                                    class="px-4 py-2 text-sm hover:bg-white/20 cursor-pointer"
                                    @click="updateStrategy(strategy.id)">
                                    {{ strategy.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Status</label>
                    <div class="relative" ref="statusDropdownRef">
                        <input v-model="formData.payment_status" @focusin="selectStatus = true"
                            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 text-sm focus:ring-custom-blue"
                            readonly type="text" placeholder="Select Status" />
                        <i class="pi pi-chevron-down absolute top-1/2 right-3 transform -translate-y-1/2 text-white/50"></i>
                        <div v-if="selectStatus"
                            class="absolute top-12 left-0 w-full bg-[#1d1b20] border border-white/20 rounded-md shadow-lg z-10">
                            <ul class="max-h-40 overflow-y-auto no-scrollbar">
                                <li @click="formData.payment_status = 'PENDING'" class="px-4 py-2 text-sm hover:bg-white/20 cursor-pointer"
                                    >
                                    PENDING
                                </li>
                                <li @click="formData.payment_status = 'COMPLETE'" class="px-4 py-2 text-sm hover:bg-white/20 cursor-pointer"
                                    >
                                    COMPLETE
                                </li>
                                <li @click="formData.payment_status = 'FAILED'" class="px-4 py-2 text-sm hover:bg-white/20 cursor-pointer"
                                    >
                                    FAILED
                                </li>
                               
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Start Date</label>
                    <input v-model="formData.start_date"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="date" placeholder="Enter Start Date" />
                </div>

                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">End Date</label>
                    <input v-model="formData.end_date"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="date" placeholder="Enter End Date" />
                </div>

                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Active</label>
                    <ButtonSwitch @change="() =>{ formData.active}" name="is_active"
                      v-model="formData.active" />
                </div>

                <button @click="handleSubmit"
                    class="min-w-[93px] w-full mt-4 text-sm px-6 py-2 rounded-md bg-custom-blue">Done</button>
            </form>
        </div>
    </Modal>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import Modal from '@/components/Modal.vue';
import { useSubscriptionStore } from '@/stores/matrix/subscription';
import { useUserStore } from '@/stores/matrix/users';
import { useStrategiesStore } from '@/stores/matrix/strategies';
import ButtonSwitch from '@/components/ButtonSwitch.vue';

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(['close']);

const selectUser = ref(false);
const selectStrategy = ref(false);
const selectStatus = ref(false);
const userDropdownRef = ref(null);
const strategyDropDownRef = ref(null);
const statusDropdownRef = ref(null);

const userStore = useUserStore();
const { users } = storeToRefs(userStore);

const strategyStore = useStrategiesStore();
const { strategies } = storeToRefs(strategyStore);

const subscriptionStore = useSubscriptionStore();
const { editSubscriptionDate } = storeToRefs(subscriptionStore);

const formData = ref({
    user_id: '',
    user_name: '',
    strategy_id: '',
    strategy_name: '',
    payment_status: '',
    start_date: '',
    end_date: '',
    active: false,
});

watch(() => props.isOpen, (newVal) => {
    if (newVal && editSubscriptionDate.value) {
        formData.value = {
            user_id: editSubscriptionDate.value.user_id,
            user_name: editSubscriptionDate.value.user_name,
            strategy_id: editSubscriptionDate.value.strategy_id,
            strategy_name: editSubscriptionDate.value.strategy_name,
            payment_status: editSubscriptionDate.value.payment_status,
            start_date: editSubscriptionDate.value.start_date,
            end_date: editSubscriptionDate.value.end_date,
            active: editSubscriptionDate.value.active,
        };
    } else {
        formData.value = {
            user_id: '',
            user_name: '',
            strategy_id: '',
            strategy_name: '',
            payment_status: '',
            start_date: '',
            end_date: '',
            active: false,
        };
    }
});

const handleSubmit = async (e) => {
    e.preventDefault();
    const id = editSubscriptionDate.value?.id || null;
    const res = await subscriptionStore.addEditSubscriptions(id, formData.value);
    if (res) closeModal();
};

const closeModal = () => {
    formData.value = {
        user_id: '',
        user_name: '',
        strategy_id: '',
        strategy_name: '',
        payment_status: '',
        start_date: '',
        end_date: '',
        active: false,
    };
    subscriptionStore.editSubscriptionDate = null;
    emit('close');
};

const updateUser = (userId) => {
    const selected = users.value.find((u) => u.id === userId);
    formData.value.user_id = userId;
    formData.value.user_name = selected?.name || '';
    selectUser.value = false;
};

const updateStrategy = (strategyId) => {
    const selected = strategies.value.find((s) => s.id === strategyId);
    formData.value.strategy_id = strategyId;
    formData.value.strategy_name = selected?.name || '';
    selectStrategy.value = false;
};

const updateStatus = (status) => {
    formData.value.payment_status = status;
    selectStatus.value = false;
};

const handleClickOutside = (event) => {
    if (
        userDropdownRef.value && !userDropdownRef.value.contains(event.target)
    ) selectUser.value = false;

    if (
        strategyDropDownRef.value && !strategyDropDownRef.value.contains(event.target)
    ) selectStrategy.value = false;

    if (
        statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)
    ) selectStatus.value = false;
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

</script>


<style lang="scss" scoped></style>
