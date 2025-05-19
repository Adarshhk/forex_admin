<template>
  <teleport to="body">
    <div class="toast-container" :style="{ zIndex: Math.max(zIndexValue+1, currZindex+1 ) }" >
      <template v-if="toastsArray.length > 0">
        <div v-for="(item, index) in toastsArray" class="relative text-white toast flex flex-col gap-1 p-3 w-full rounded-lg"
          :class="getClass(item.severity)"
        >
          <div class="flex space-x-2 items-start">
            <div class="inline-flex justify-center items-center bg-black/30 w-6 h-6 rounded-lg">
              <i class="pi max-h-2.5" style="font-size: 0.8rem;" :class="getPrimeIcon(item.severity)"></i>
            </div>
            <h2 class="text-[14px] text-wrap font-bold">
               {{ item.summary }} 
            </h2>
          </div>
          <div class="text-white/90 pl-8">
            <p class="text-[13.5px]">
              {{ item.detail }}
            </p>
          </div>
          <button @click="hideToast(item.id)" class="absolute top-2.5 right-2 pi pi-times text-white/90" ></button>
        </div>
      </template>
    </div>
  </teleport>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, computed, watch, watchEffect } from "vue";
import success from '@/assets/svg/tick.svg'
import cross from '@/assets/svg/cross.svg'
import pending from '@/assets/svg/pending.svg'
import info from '@/assets/svg/info.svg'


import { useToastStore } from "@/stores/utils/toast";
const toastStore = useToastStore();
let { toasts, showToastData } = storeToRefs(toastStore);

const currZindex = ref(0)
const toastsArray = computed(() => {
  return toastStore.toasts || []
})

const hideToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

function getHighestZIndex() {
  const elements = [...document.querySelectorAll('body *')]
  const zIndexes = elements.map(el => parseFloat(window.getComputedStyle(el).zIndex))
    .filter(zIndex => !isNaN(zIndex))
  currZindex.value = Math.max(0, ...zIndexes) 
  return Math.max(0, ...zIndexes)
}

const zIndexValue = computed(() => {
  if(toasts.value && toasts.value.length > 0) {
    return getHighestZIndex() + 1
  }
})

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return success
    case 'error':
      return cross
    case 'warning' || 'warn':
      return pending
    default:
      return info
  }
}


const getClass = (type) => {
  switch (type) {
    case 'success':
      return 'success-gradient'
    case 'error':
      return 'error-gradient'
    case 'warning' || 'warn':
      return 'warning-gradient'
    default:
      return 'info-gradient'
  }
}

const getPrimeIcon = (type) => {
  switch (type) {
    case 'success':
      return 'pi-check'
    case 'error':
      return 'pi-times'
    case 'warning' || 'warn':
      return 'pi-info'
    default:
      return 'pi-info'
  }
}


</script>

<style scoped>
.toast-container {
  @apply fixed bottom-5 left-5 flex flex-col items-end;
}

.success-gradient {
  background: linear-gradient(94.77deg, #32BB71 15.3%, #2A9D8F 113.45%);
}

.error-gradient {
  background: linear-gradient(94.77deg, #C53333 42.58%, #F3A290 113.45%);
}
.warning-gradient {
  background: linear-gradient(94.77deg, #C5BE33 42.58%, #fcee87 113.45%);
}

.info-gradient {
  background: linear-gradient(94.77deg, #C5BE33 42.58%, #fcee87 113.45%);
}

.glow {
  box-shadow: 0 0 15px;
}

.toast {
  @apply min-w-[270px] max-w-[300px] transform transition-transform ease-out duration-300 mb-2;
  animation: slideInBottom 0.4s ease-in-out, slideOutBottom 0.4s ease-in-out 3s forwards;
}

@keyframes slideInBottom {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* @keyframes slideOutBottom {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
} */
</style>

