<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-start justify-center z-[60]">
      <Transition name="fade" mode="out-in" appear>
        <div ref="modal"
          class="flex items-center flex-col w-[90%] sm:w-[420px] min-h-[350px] bg-[#1D1E21] backdrop-blur-[27.2px] z-[60] border border-custom-demo/70 rounded-lg shadow-lg relative p-2 sm:p-4 pb-0 sm:pb-0 mt-[15vh] lg:mt-[100px]">
          
					<div class="flex flex-col items-center justify-center text-center p-4">
						<h1 class="text-xl sm:text-2xl font-bold gradient-text">First Deployment <br/> Absolutely FREE!</h1>
						<p class="text-xs sm:text-sm text-white/90 mt-2">Deploy your first strategy at no cost. After that, enjoy premium features with our paid plans.</p>
					</div>

					<div class="flex items-center justify-between gap-4 p-2 sm:p-4">
            <button @click="handleDeploy" class="text-sm bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md">
              <p class="bg-black/75 px-[19px] sm:px-[31px] py-[7px] m-[1px] rounded-md">Deploy Now</p>
            </button>
            <button class="text-sm px-5 sm:px-8 py-2 rounded-md bg-gradient-to-b from-[#00C6FF] to-[#0072FF]">View Pricing</button>
					</div>
          <img src="/svg/visual.svg" alt="bitcoin-gift" class="w-[200px] h-auto" />
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
const emit = defineEmits(['update:modelValue' , 'deploy'])

const handleDeploy = () => {
  emit('deploy');
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
  