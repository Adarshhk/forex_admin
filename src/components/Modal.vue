<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-[100]">
    <div v-if="!preventAutoClose" @click="closeModal" class="fixed inset-0 z-[99]"></div>
    <Transition :name="transitionName" mode="out-in" appear>
      <div
        ref="modal"
        class="modal-content z-[100] rounded-lg shadow-lg relative w-full lg:w-auto max-h-[95vh] bg-[#1d1b20]"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const modal = ref('')
const props = defineProps({
  modelValue: Boolean,
  id: {
    type: String,
    default: () => `modal-${Math.random().toString(16).slice(2)}`,
  },
  preventAutoClose: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'close'])

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Responsive transition
const { width } = useWindowSize()
const transitionName = computed(() => (width.value >= 1024 ? 'fade' : 'slide-up'))

const background = computed(() => {
  if(transitionName.value === 'slide-up') {
    return `#1B1B1B`
  }
  else {
    return `linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
      radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)
    `
  }
})

// Uncomment if you want to lock background scrolling when modal is open
// watch(() => props.modelValue, (newVal) => {
//   if (newVal) {
//     document.body.style.overflow = 'hidden'
//   } else {
//     document.body.style.overflow = ''
//   }
// })
</script>

<style scoped>
/* Fade for large devices */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Slide-up for small devices */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>