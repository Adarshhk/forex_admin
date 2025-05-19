<template>

    <Modal @close="handleClose" :modelValue="props.isOpen">
        <div class="min-h-[50vh] w-full lg:w-[350px]">
            <div
                class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
                <h1 class="text-lg font-bold">{{ userToEdit ? 'Edit User' : 'Add User' }}</h1>

                <button @click="handleClose" class="text-white/80 p-1">
                    <i class="pi pi-times"></i>
                </button>
            </div>
            <form class="grid grid-cols-1 w-full gap-2 p-4">
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Name</label>
                    <input v-model="formData.name"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter User Name" />
                </div>
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Email</label>
                    <input v-model="formData.email"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Email" />
                </div>

                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">Phone Number</label>
                    <input v-model="formData.phone"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Phone Number" />
                </div>
                <div class="space-y-1">
                    <label for="name" class="text-sm text-white/40 font-semibold">New Password</label>
                    <input v-model="formData.password"
                        class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
                        type="text" placeholder="Enter Password" />
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
import { useUserStore } from '@/stores/matrix/users';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['close']);

const userStore = useUserStore();
const { userToEdit } = storeToRefs(userStore);

const formData = reactive({
  name: '',
  email: '',
  password: '',
  phone: ''
});

const props = defineProps({
  isOpen: Boolean
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && userToEdit.value) {
    formData.name = userToEdit.value.name || '';
    formData.email = userToEdit.value.email || '';
    formData.password = userToEdit.value.password || '';
    formData.phone = userToEdit.value.phone || '';
  } else {
    formData.name = '';
    formData.email = '';
    formData.password = '';
    formData.phone = '';
  }
});

const handleClose = () => {
  userToEdit.value = null;
  emit('close');
};

const handleSubmit = async () => {
  const res = await userStore.addEditUser({ ...formData });
  if (res) handleClose();
};


</script>

<style lang="scss" scoped></style>