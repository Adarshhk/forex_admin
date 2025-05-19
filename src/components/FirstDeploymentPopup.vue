<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-start justify-center z-[60]">
      <Transition name="fade" mode="out-in" appear>
        <div ref="modal"
          class="flex items-center flex-col w-[90%] sm:w-[420px] min-h-[350px] bg-white/10 backdrop-blur-[27.2px] z-[60] rounded-lg shadow-lg relative p-2 sm:p-4 mt-[15vh] lg:mt-[100px]"
					style="background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);"
        >
          <img src="/svg/bitcoin-gift.svg" alt="bitcoin-gift" class="w-[121px] h-auto" />
					<div class="flex flex-col items-center justify-center text-center p-4">
						<h1 class="text-xl sm:text-2xl font-bold">First Deployment <br/> Absolutely FREE!</h1>
						<p class="text-xs sm:text-sm text-white/90 mt-2">Deploy your first strategy at no cost. After that, enjoy premium features with our paid plans.</p>
					</div>

					<div class="flex items-center justify-between gap-4 p-2 sm:p-4 mb-4">
						<button class="bg-[#FCF7F7] text-custom-demo text-sm px-4 sm:px-8 py-1.5 text-nowrap rounded-md">Deploy Now</button>
						<button class="bg-[#FCF7F7] text-custom-demo text-sm px-4 sm:px-8 py-1.5 text-nowrap rounded-md">View Pricing</button>
					</div>
        </div>
      </Transition>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const modal = ref('')
const props = defineProps({
  modelValue: Boolean,
  id: {
    type: String,
    default: () => `popup-${Math.random().toString(16).slice(2)}`,
  }
})
const emit = defineEmits(['update:modelValue'])

onClickOutside(modal, () => {
  emit('update:modelValue', false)
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

</style>
  