<template>
  <AddBroker :isOpen="isOpen" @close="isOpen = false" />
  <div class="flex justify-between items-center flex-nowrap border-b border-white/20 p-2 w-full ">
    <RouterLink to="/">
      <img src="/src/assets/svg/logo.svg" alt="Logo" class="w-[200px]" />
    </RouterLink>
    <div class="hidden xl:block nrml-text">
      <RouterLink class="py-2 rounded-md px-4 transition-all duration-300" to="/"
        :class="[currentRoute.name === 'users' ? 'text-custom-blue' : 'border-white/0']">Users</RouterLink>
      <RouterLink class="py-2 rounded-md px-4 transition-all duration-300" to="/deployed-strategies"
        :class="[currentRoute.name === 'deployed-strategies' ? 'text-custom-blue' : 'border-white/0']">
        Strategies</RouterLink>
      <RouterLink class="py-2 rounded-md px-4 transition-all duration-300" to="/orders"
        :class="[currentRoute.name === 'orders' ? 'text-custom-blue' : 'border-white/0']">Orders</RouterLink>
      <RouterLink class="py-2 rounded-md px-4 transition-all duration-300" to="/positions"
        :class="[currentRoute.name === 'positions' ? 'text-custom-blue' : 'border-white/0']">Positions</RouterLink>
      <RouterLink class="py-2 rounded-md px-4 transition-all duration-300" to="/brokers"
        :class="[currentRoute.name === 'brokers' ? 'text-custom-blue' : 'border-white/0']">Brokers</RouterLink>
      <RouterLink class="py-2 rounded-md px-4 transition-all duration-300" to="/subscriptions"
        :class="[currentRoute.name === 'subscriptions' ? 'text-custom-blue' : 'border-white/0']">Subscriptions</RouterLink>
    </div>
    
    <div class="relative flex justify-between space-x-4">
      
      <button @click="isNotificationsOpen = !isNotificationsOpen" class="">
        <!-- <img src="/imgs/notification.png" alt="Notifications" class="bg-[#2C2736] rounded-[8px] w-[40px] p-2 border border-white/5" /> -->
        <div class="w-10 bg-[#2C2736] rounded-lg">
          <LottieAnimation animationPath="/src/assets/animation/notification.json" />
        </div>
      </button>
      <button @click="isDropdownOpen = !isDropdownOpen">

        <img :src="profile.profile?.profile_pic_url ? profile.profile?.profile_pic_url : '/imgs/defaultImg.png'"
          alt="Profile" class="w-[40px]" />
      </button>



      <Transition name="dropdown-slide-fade" mode="out-in">
        <div v-if="isDropdownOpen" ref="dropdown"
          class="absolute top-full right-0 mt-2 py-2 px-1 w-48 dropdown-bg rounded-md border border-white/15 shadow-lg z-40">

          
          <RouterLink to="/profile"
            class="block text-left px-4 py-2 text-sm text-white hover:bg-black/30 w-full rounded">Profile</RouterLink>
            <button @click="logout"
            class="block text-left px-4 py-2 text-sm text-white hover:bg-black/30 w-full rounded">Logout</button>
        </div>
      </Transition>

      <Transition name="dropdown-slide-fade" mode="out-in">
        <!-- isNotificationsOpen -->
        <div v-if="isNotificationsOpen" ref="notifications"
          class="absolute top-full right-0 mt-2 py-2 px-1 w-[80%] min-w-[300px] xs:min-w-[350px] md:min-w-[420px] dropdown-bg no-scrollbar rounded-md border border-white/15 shadow-lg z-40">
          <div class="relative space-y-2 max-h-[550px] h-[60vh] overflow-y-auto no-scrollbar">
            <div>
              <div class="flex justify-between items-center p-2">
                <div class="flex items-center font-bold text-lg">
                  <h1 class="text-sm mr-1">Notifications</h1>
                  <p class="px-2 py-1 text-xs rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </div>
                <button @click="" class="text-sm text-white/90 hover:text-white">Mark all as read</button>
              </div>
              <!-- tab  -->
              <div class="flex items-center justify-between border-y border-white/10 px-6 mb-2">
                <button @click="notificationType = 'all'" class="flex items-center space-x-1 border-b-2 px-4 py-4"
                  :class="[notificationType === 'all' ? 'text-custom-demo border-custom-demo' : 'border-transparent text-white/50 hover:text-white/70']">
                  <p>All</p>
                  <p class="px-1.5 py-0.5 text-xs text-white rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </button>
                <button @click="notificationType = 'orders'" class="flex items-center space-x-1 border-b-2 px-4 py-4"
                  :class="[notificationType === 'orders' ? 'text-custom-demo border-custom-demo' : 'border-transparent text-white/50 hover:text-white/70']">
                  <p>Orders</p>
                  <p class="px-1.5 py-0.5 text-xs text-white rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </button>
                <button @click="notificationType = 'alerts'" class="flex items-center space-x-1 border-b-2 px-4 py-4"
                  :class="[notificationType === 'alerts' ? 'text-custom-demo border-custom-demo' : 'border-transparent text-white/50 hover:text-white/70']">
                  <p>Alerts</p>
                  <p v-if="false" class="px-1.5 py-0.5 text-xs text-white rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </button>
              </div>

            </div>
            <div v-for="notification in notificationsData" :key="notification.id"
              class="flex justify-between items-center p-2 relative border-b border-white/10">
              <div class="flex items-center space-x-2 w-full">
                <img src="/imgs/dhan1.png" alt="Notification" class="w-12" />
                <div class="space-y-1 pr-4">
                  <p class="text-sm font-medium text-white/70 w-[90%]">{{ notification.message }}</p>
                  <!-- <p class="text-sm text-custom-white/50">{{ notification.strategy_id }}</p> -->
                  <p class="text-xs text-custom-white/50">{{ notification.time }}</p>
                </div>
                <button class="absolute top-1 right-1 pi pi-times text-white px-2 opacity-90"
                  @click="notificationStore.deleteNotification(notification.id)"></button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import { logout } from '@/requests/requests';
import { useNotificationsStore } from '@/stores/matrix/notifications';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/stores/matrix/profile';
import LottieAnimation from './LottieAnimation.vue';
import AddBroker from './AddBroker.vue';

const router = useRouter();
const dropdown = ref('');
const isOpen = ref(false);
const isDropdownOpen = ref(false);
const notificationType = ref('all');
const isNotificationsOpen = ref(false);
const notifications = ref('');

const notificationStore = useNotificationsStore()
const profileStore = useProfileStore();

const { profile } = storeToRefs(profileStore)
const { notificationsData } = storeToRefs(notificationStore);

const currentRoute = computed(() => {
  return router.currentRoute.value || {};
});

onClickOutside(dropdown, () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 10);
});

onClickOutside(notifications, () => {
  setTimeout(() => {
    isNotificationsOpen.value = false;
  }, 10);
});



</script>

<style scoped>
.bg-layered-gradient {
  @apply bg-none border border-gray-500 rounded-md;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
    radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);

  border-image-source: linear-gradient(to bottom, #504E52, #242327);
  border-image-slice: 1;
}

.dropdown-bg {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.096) 100%),
    radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
  backdrop-filter: blur(30px);
}
</style>