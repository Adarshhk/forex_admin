<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black/50 flex items-start justify-center z-[60]">
      <Transition name="fade" mode="out-in" appear>
        <div
          ref="modal"
          class="flex items-center flex-col w-[90%] sm:w-[420px] min-h-[350px] bg-[#1D1E21] backdrop-blur-[27.2px] z-[60] border border-custom-demo/70 rounded-lg shadow-lg relative p-2 sm:p-4 pb-0 sm:pb-0 mt-[15vh] lg:mt-[100px]"
        >
          <h1 class="text-xl sm:text-2xl font-bold gradient-text">What It Costs to Win</h1>
					
          <div>
            <!-- left side  -->
            <div clas>
              <div class="h-20">

              </div>
              <div class="h-40">

              </div>
              <div class="h-20">

              </div>
            </div>
            
            <div>
              <!-- step 1 -->
              <div class="flex items-start justify-between h-20">
                <h2>Launch more, Scale Smart</h2>
                <p class="text-xs sm:text-sm text-white/90 mt-2">$6278.98</p>
              </div>

              <!-- step 2 -->
              <div class="h-40">
                <div class="flex items-start justify-between ">
                  <h2>Grow Your Team, Easily</h2>
                  <p class="text-xs sm:text-sm text-white/90 mt-2">$6278.98</p>
                </div>
                <p class="text-white/75">Add joiners to your strategy at only $12 per member—expand on your terms.</p>
              </div>

              <!-- step 3 -->
              <div class="flex items-start justify-between h-20">
                <h2>Add-On Features</h2>
                <p class="text-xs sm:text-sm text-white/90 mt-2">$6278.98</p>
              </div>
            </div>


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

  .gradient-text {
    background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

</style>
  