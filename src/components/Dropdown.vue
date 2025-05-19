<template>
    <Transition name="dropdown-slide-fade" mode="out-in">
        <div v-if="modelValue" ref="dropdown" class="absolute space-y-1 top-full right-0 mt-2 py-2 px-1 w-48 bg-[#1d1b20] rounded-md shadow-lg z-10">
            <slot></slot>
        </div>
    </Transition>
</template>
  
<script setup>
  import { ref, computed, watch } from 'vue'
  import { onClickOutside } from '@vueuse/core'
  
  const dropdown = ref('')
  const props = defineProps({
    modelValue: Boolean,
    id: {
      type: String,
      default: () => `dropdown-${Math.random().toString(16).slice(2)}`,
    }
  })
  const emit = defineEmits(['update:modelValue'])
  
  onClickOutside(dropdown, () => {
    setTimeout(() => {
        emit('update:modelValue', false)
    }, 10)
  })

</script>
  