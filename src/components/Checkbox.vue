<template>
    <div class="custom-checkbox" :class="className">
      <input
        type="checkbox"
        :id="id"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="hidden"
      />
      <label :for="id" class="checkbox-label" :style="{ width: size, height: size }">
        <div class="checkbox-icon-container">
          <i v-if="modelValue" class="pi pi-check text-white" :style="{ fontSize: `${intSize/1.5}px` }"></i>
          <i v-else :style="{ height: `${intSize/1.5}px` }"></i>
        </div>
      </label>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: () => `checkbox-${Math.random().toString(16).slice(2)}`,
    },
    size: {
      type: String,
      default: '18px',
    },
    className: {
      type: String,
      default: '',
    }
  });
  
  const emit = defineEmits(['update:modelValue']);

  const intSize = computed(() => {
    return Number(props.size.replace('px', '') || '18');
  });

</script>
  
  <style scoped>
  .custom-checkbox {
    display: inline-flex;
    align-items: center;
  }
  
  .checkbox-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .checkbox-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .checkbox-label:hover {
    border-color: lightgray;
  }
  
  input[type="checkbox"]:checked + .checkbox-label {
    @apply bg-custom-demo border-custom-demo
  }
  
  /* 
  input[type="checkbox"]:checked + .checkbox-label .checkbox-icon-container {
    Icon is already white due to 'text-white' class in template
  }
  */
  
  input[type="checkbox"]:focus + .checkbox-label {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.25);
  }
  
  .pi-check {
    font-size: 12px;
  }
  </style>