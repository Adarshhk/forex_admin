<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/80 flex items-center lg:items-start justify-center z-[100]">
      <Transition name="fade" mode="out-in" appear>
        <div
          class="flex items-center flex-col w-[80%] sm:w-[300px] bg-[#1d1b20] z-[60] border border-white/10  rounded-lg shadow-lg relative p-4  lg:mt-[100px]"
          
          >
          <!-- <img src="/svg/some-error.svg" alt="error" class="w-[140px] h-auto" /> -->
           <div class="w-[140px]">
              <LottieAnimation animationPath="/src/assets/animation/trash.json" />
           </div>
					<div class="flex flex-col items-center justify-center text-center p-4">
						<p class="text-lg sm:text-lg font-bold text-white/85 mt-2">Are you sure you want to delete this?</p>
						<p class="text-xs sm:text-sm text-white/85 mt-2">This will remove it permanently from your list.</p>
					</div>

					<div class="flex flex-col w-full items-center justify-between gap-4 p-2 sm:p-4">
            <button @click="closeModal" class="transition-all duration-150 text-sm rounded-md w-full border border-[#ffffff44] hover:bg-[#ffffff11]">
              <p class="px-[23px] py-[7px] m-[1px] rounded-md">No</p>
            </button>
            <button @click="confirmModal" class="min-w-[93px] w-full text-sm px-6 py-2 rounded-md bg-[#FD2A2A]">Yes, Delete</button>
					</div>
          
        </div>
      </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import LottieAnimation from './LottieAnimation.vue'

const modal = ref('')
const props = defineProps({
  modelValue: Boolean,
  id: {
    type: String,
    default: () => `popup-${Math.random().toString(16).slice(2)}`,
  }
})
const emit = defineEmits(['update:modelValue'], 'close', 'confirm')

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

const confirmModal = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

onClickOutside(modal, () => {
  closeModal()
})

</script>

  
<style scoped>
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

  .gradient-text {
    background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

</style>
  