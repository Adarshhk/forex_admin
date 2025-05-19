<template>
    <label
        :for="id"
        class="relative inline-flex items-center justify-center cursor-pointer"
    >
        <input
            :id="id"
            :disabled = "disabled"
            :name="name"
            :checked="modelValue"
            @change="$emit('update:modelValue', ($event.target)?.checked)"
            type="checkbox"
            class="sr-only peer"
        />
        <div
            class="w-[42px] h-5 rounded-full transition-all duration-200"
            style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
                radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
                "
        ></div>
        <div 
            :class="[modelValue ? 'bg-[#00B852] w-[18px] h-[18px] top-[1px]' : 'bg-white/50 w-[18px] h-[18px] top-[1px]']"
            class="absolute left-0.5 rounded-full peer-checked:translate-x-5 transition-transform duration-200"
        ></div>
    </label>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default() {
      return `switch-${Math.random().toString(16).slice(2)}`;
    },
  },
  name: String,
  modelValue: Boolean,
  disabled: {
    type: Boolean,
    default: false,
  },
});

const id  = computed(() => {
  return `${props.id}-${Math.random().toString(16).slice(2)}`
})
</script>