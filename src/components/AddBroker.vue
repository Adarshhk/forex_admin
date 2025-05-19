<template>
  <Modal v-model="props.isOpen" @close="closeModal">
    <div class="min-h-[50vh] w-full lg:w-[350px]">
      <div
        class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
        <h1 class="text-lg font-bold">{{ editBrokerData ? 'Edit Broker' : 'Add User' }}</h1>
        
        <button @click="closeModal" class="text-white/80 p-1">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <form class="grid grid-cols-1 w-full gap-2 p-4">
        <div class="space-y-1">
          <label for="name" class="text-sm text-white/40 font-semibold">Name</label>
          <input v-model="formData.broker_name"
            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
            type="text" placeholder="Enter Broker Name" />
        </div>

        <div class="space-y-1">
          <label for="name" class="text-sm text-white/40 font-semibold">Broker Id</label>
          <input v-model="formData.broker_userid"
            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
            type="text" placeholder="Enter Broker UserId" />
        </div>

        <div class="space-y-1">
          <label for="name" class="text-sm text-white/40 font-semibold">Password</label>
          <input v-model="formData.broker_password"
            class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 focus:ring-custom-blue"
            type="text" placeholder="Enter Broker Password" />
        </div>

        <div class="space-y-1">
          <label for="name" class="text-sm text-white/40 font-semibold">Server</label>
          <div class="relative" ref="serverDropdownRef">
            <input v-model="formData.server_name" @focusin="selectServer = true"
              class="focus:outline outline-custom-blue w-full py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue placeholder:text-sm focus:ring-1 text-sm focus:ring-custom-blue"
              readonly type="text" placeholder="Select Server" />
            <i class="pi pi-chevron-down absolute top-1/2 right-3 transform -translate-y-1/2 text-white/50"></i>
            <div v-if="selectServer"
              class="absolute top-12 left-0 w-full bg-[#1d1b20] border border-white/20 rounded-md shadow-lg z-10">
              <ul class="max-h-40 overflow-y-auto no-scrollbar">
                <li v-for="(server, index) in servers" :key="index"
                  class="px-4 py-2 text-sm hover:bg-white/20 cursor-pointer"
                  @click="updateServer(server)">
                  {{ server }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button @click="handleSubmit"
          class="min-w-[93px] w-full mt-4 text-sm px-6 py-2 rounded-md bg-custom-blue">Done</button>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import Modal from './Modal.vue';
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import { storeToRefs } from 'pinia';
import { servers } from '@/utils/servers';

const selectServer = ref(false)
const serverDropdownRef = ref(null)

const brokerStore = useBrokerIndexStore();
const { editBrokerData } = storeToRefs(brokerStore);
const props = defineProps({
  isOpen: Boolean
})

const formData = ref({
  broker_userid: '',
  broker_name: '',
  broker_password: '',
  server_name: '',
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (editBrokerData.value) {
      formData.value.broker_userid = editBrokerData.value.broker_userid;
      formData.value.broker_name = editBrokerData.value.broker_name;
      formData.value.broker_password = editBrokerData.value.broker_password;
      formData.value.server_name = editBrokerData.value.server_name;
    } else {
      formData.value.broker_name = '';
      formData.value.broker_password = '';
      formData.value.broker_userid = '';
      formData.value.server_name = '';
    }
  }
});

const handleSubmit = async (e) => {
  e.preventDefault();
  const id = editBrokerData.value?.id || null;
  const res = await brokerStore.addEditBroker(id, formData.value);
  if (res) {
    closeModal();
  }
}

const emit = defineEmits(['close']);

const closeModal = () => {
  formData.value.broker_name = '';
  formData.value.broker_password = '';
  formData.value.broker_userid = '';
  formData.value.server_name = '';
  brokerStore.editBrokerData = null;
  emit('close');
}

const updateServer = (server) => {
  formData.value.server_name = server;
  selectServer.value = false;
}

const handleClickOutside = (event) => {
  if (serverDropdownRef.value && !serverDropdownRef.value.contains(event.target)) {
    selectServer.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped></style>
