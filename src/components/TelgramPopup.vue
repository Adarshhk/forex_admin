<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-center lg:items-start justify-center z-[60]">
      <Transition name="fade" mode="out-in" appear>
        <div ref="modal"
          class="flex items-center flex-col w-[80%] sm:w-[450px] min-h-[350px] backdrop-blur-[27.2px] z-[60] border border-white/10 rounded-lg shadow-lg relative p-8 p-4 pb-0 sm:pb-0 lg:mt-[100px]"
          style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
            radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
          "
          >
          <button @click="closeModal" class="absolute top-4 right-4 pi pi-times opacity-80"></button>
          <img src="/svg/went-wrong.svg" alt="bitcoin-gift" class="w-[140px] h-auto" />
					<div class="flex flex-col items-center justify-center text-center p-4">
						<p class="text-xs sm:text-sm text-white/85 mt-2">Last month, we announced that newwere coming to Instagram to bring you even closer</p>
					</div>

					<div class="flex items-center justify-between gap-4 p-2 sm:p-4">
            <button class="text-sm px-5 sm:px-8 py-2 rounded-md bg-gradient-to-b from-[#00C6FF] to-[#0072FF]">Go to telegram</button>
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

const closeModal = () => {
  emit('update:modelValue', false)
}

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

  .gradient-text {
    background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

</style>
  