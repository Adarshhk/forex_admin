<template>
    <div class="custom-radio" :class="className">
      <input
        type="radio"
        :id="id"
        :name="name"
        :value="value"
        :checked="modelValue === value"
        @change="$emit('update:modelValue', value)"
        class="hidden"
      />
      <label :for="id" class="radio-label" :style="{ width: size, height: size }">
        <div class="radio-container">
          <div class="radio-outer-circle"></div>
          <div v-if="modelValue === value" class="radio-inner-glow"></div>
          <div v-if="modelValue === value" class="radio-inner-circle"></div>
        </div>
      </label>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean, Object],
      required: true,
    },
    value: {
      type: [String, Number, Boolean, Object],
      required: true,
    },
    id: {
      type: String,
      default: () => `radio-${Math.random().toString(16).slice(2)}`,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '24px',
    },
    className: {
      type: String,
      default: '',
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const intSize = computed(() => {
    return Number(props.size.replace('px', '') || '24');
  });
  </script>
  
  <style scoped>
  .custom-radio {
    display: inline-flex;
    align-items: center;
  }
  
  .radio-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }
  
  .radio-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .radio-outer-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #1a1a1a;
    border: 2px solid #333;
    box-sizing: border-box;
  }
  
  .radio-inner-circle {
    position: absolute;
    width: 50%;
    height: 50%;
    border-radius: 50%;
    background-color: #0099ff;
    z-index: 2;
  }
  
  .radio-inner-glow {
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 153, 255, 0.8) 0%, rgba(0, 153, 255, 0.3) 50%, rgba(0, 153, 255, 0) 70%);
    filter: blur(2px);
    z-index: 1;
  }
  
  input[type="radio"]:checked + .radio-label .radio-outer-circle {
    border-color: #0099ff;
  }
  
  /* Hover effect */
  .radio-label:hover .radio-outer-circle {
    border-color: #0099ff;
    box-shadow: 0 0 5px rgba(0, 153, 255, 0.3);
  }
  
  /* Focus effect */
  input[type="radio"]:focus + .radio-label .radio-outer-circle {
    box-shadow: 0 0 0 2px rgba(0, 153, 255, 0.4);
  }
  </style>