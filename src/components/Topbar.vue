<template>
  <AddBroker :isOpen="isOpen" @close="isOpen = false" />
  <div class="flex justify-between items-center flex-nowrap border-b border-white/20 p-2 w-full">
    <div class="flex items-center">
      <!-- Mobile menu hamburger icon -->
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="mr-2 xl:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      <!-- Logo -->
      <RouterLink to="/">
        <img src="/src/assets/svg/logo.svg" alt="Logo" class="w-[120px] sm:w-[160px] md:w-[200px]" />
      </RouterLink>
    </div>
    
    <!-- Desktop Navigation -->
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
    
    <div class="relative flex justify-between space-x-2 sm:space-x-4">
      <button @click="isNotificationsOpen = !isNotificationsOpen" class="">
        <div class="w-8 sm:w-10 bg-[#2C2736] rounded-lg">
          <LottieAnimation animationPath="/src/assets/animation/notification.json" />
        </div>
      </button>
      <button @click="isDropdownOpen = !isDropdownOpen">
        <img :src="profile.profile?.profile_pic_url ? profile.profile?.profile_pic_url : '/imgs/defaultImg.png'"
          alt="Profile" class="w-8 sm:w-10" />
      </button>

      <!-- Profile Dropdown -->
      <Transition name="dropdown-slide-fade" mode="out-in">
        <div v-if="isDropdownOpen" ref="dropdown"
          class="absolute top-full right-0 mt-2 py-2 px-1 w-48 dropdown-bg rounded-md border border-white/15 shadow-lg z-50">
          <RouterLink to="/profile"
            class="block text-left px-4 py-2 text-sm text-white hover:bg-black/30 w-full rounded">Profile</RouterLink>
          <button @click="logout"
            class="block text-left px-4 py-2 text-sm text-white hover:bg-black/30 w-full rounded">Logout</button>
        </div>
      </Transition>

      <!-- Notifications Panel -->
      <Transition name="dropdown-slide-fade" mode="out-in">
        <div v-if="isNotificationsOpen" ref="notifications"
          class="absolute top-full right-0 mt-2 py-2 px-1 w-[90%] min-w-[280px] xs:min-w-[320px] sm:min-w-[350px] md:min-w-[420px] dropdown-bg no-scrollbar rounded-md border border-white/15 shadow-lg z-50">
          <div class="relative space-y-2 max-h-[550px] h-[60vh] overflow-y-auto no-scrollbar">
            <div>
              <div class="flex justify-between items-center p-2">
                <div class="flex items-center font-bold text-lg">
                  <h1 class="text-xs sm:text-sm mr-1">Notifications</h1>
                  <p class="px-2 py-1 text-xs rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </div>
                <button @click="" class="text-xs sm:text-sm text-white/90 hover:text-white">Mark all as read</button>
              </div>
              <!-- tabs -->
              <div class="flex items-center justify-between border-y border-white/10 px-2 sm:px-6 mb-2">
                <button @click="notificationType = 'all'" class="flex items-center space-x-1 border-b-2 px-2 sm:px-4 py-4"
                  :class="[notificationType === 'all' ? 'text-custom-demo border-custom-demo' : 'border-transparent text-white/50 hover:text-white/70']">
                  <p>All</p>
                  <p class="px-1.5 py-0.5 text-xs text-white rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </button>
                <button @click="notificationType = 'orders'" class="flex items-center space-x-1 border-b-2 px-2 sm:px-4 py-4"
                  :class="[notificationType === 'orders' ? 'text-custom-demo border-custom-demo' : 'border-transparent text-white/50 hover:text-white/70']">
                  <p>Orders</p>
                  <p class="px-1.5 py-0.5 text-xs text-white rounded-md"
                    style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);">12</p>
                </button>
                <button @click="notificationType = 'alerts'" class="flex items-center space-x-1 border-b-2 px-2 sm:px-4 py-4"
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
                <img src="/imgs/dhan1.png" alt="Notification" class="w-10 sm:w-12" />
                <div class="space-y-1 pr-4">
                  <p class="text-xs sm:text-sm font-medium text-white/70 w-[90%]">{{ notification.message }}</p>
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

  <!-- Mobile Menu Overlay -->
  <Transition name="slide-fade">
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-black/70" @click="isMobileMenuOpen = false"></div>
  </Transition>

  <!-- Mobile Menu Sidebar -->
  <Transition name="slide-fade">
    <div v-if="isMobileMenuOpen" class="fixed inset-y-0 left-0 z-50 w-64 sm:w-72 dropdown-bg border-r border-white/15 p-4 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <RouterLink to="/" @click="isMobileMenuOpen = false">
          <img src="/src/assets/svg/logo.svg" alt="Logo" class="w-[140px]" />
        </RouterLink>
        <button @click="isMobileMenuOpen = false" class="text-white hover:text-white/80">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="flex flex-col space-y-2">
        <RouterLink class="py-3 px-4 rounded-md transition-all duration-300 hover:bg-white/10" to="/"
          :class="[currentRoute.name === 'users' ? 'text-custom-blue bg-white/5' : '']"
          @click="isMobileMenuOpen = false">Users</RouterLink>
        <RouterLink class="py-3 px-4 rounded-md transition-all duration-300 hover:bg-white/10" to="/deployed-strategies"
          :class="[currentRoute.name === 'deployed-strategies' ? 'text-custom-blue bg-white/5' : '']"
          @click="isMobileMenuOpen = false">Strategies</RouterLink>
        <RouterLink class="py-3 px-4 rounded-md transition-all duration-300 hover:bg-white/10" to="/orders"
          :class="[currentRoute.name === 'orders' ? 'text-custom-blue bg-white/5' : '']"
          @click="isMobileMenuOpen = false">Orders</RouterLink>
        <RouterLink class="py-3 px-4 rounded-md transition-all duration-300 hover:bg-white/10" to="/positions"
          :class="[currentRoute.name === 'positions' ? 'text-custom-blue bg-white/5' : '']"
          @click="isMobileMenuOpen = false">Positions</RouterLink>
        <RouterLink class="py-3 px-4 rounded-md transition-all duration-300 hover:bg-white/10" to="/brokers"
          :class="[currentRoute.name === 'brokers' ? 'text-custom-blue bg-white/5' : '']"
          @click="isMobileMenuOpen = false">Brokers</RouterLink>
        <RouterLink class="py-3 px-4 rounded-md transition-all duration-300 hover:bg-white/10" to="/subscriptions"
          :class="[currentRoute.name === 'subscriptions' ? 'text-custom-blue bg-white/5' : '']"
          @click="isMobileMenuOpen = false">Subscriptions</RouterLink>
      </div>
      <div class="mt-6 pt-6 border-t border-white/10">
        <RouterLink to="/profile" @click="isMobileMenuOpen = false"
          class="flex items-center space-x-3 py-3 px-4 rounded-md hover:bg-white/10">
          <img :src="profile.profile?.profile_pic_url ? profile.profile?.profile_pic_url : '/imgs/defaultImg.png'"
            alt="Profile" class="w-8" />
          <span>Profile</span>
        </RouterLink>
        <button @click="() => { logout(); isMobileMenuOpen = false; }"
          class="flex items-center space-x-3 w-full text-left py-3 px-4 rounded-md hover:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </Transition>
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
const dropdown = ref(null);
const notifications = ref(null);
const isOpen = ref(false);
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const notificationType = ref('all');
const isNotificationsOpen = ref(false);

const notificationStore = useNotificationsStore();
const profileStore = useProfileStore();

const { profile } = storeToRefs(profileStore);
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

// Close mobile menu when route changes
router.afterEach(() => {
  isMobileMenuOpen.value = false;
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

/* Slide in animation for mobile menu */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Animation for dropdowns */
.dropdown-slide-fade-enter-active,
.dropdown-slide-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-slide-fade-enter-from,
.dropdown-slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>