<template>
    <div ref="dropdownRef" :id="id" class="relative  w-full single-select-dropdown" tabindex="0">
      <div @click="toggleDropdown" class="custom-input w-full"
           :class="{ 'cursor-not-allowed opacity-80': disabled, 'cursor-pointer': !disabled }">
        <div class="flex items-center justify-between text-white">
          <span v-if="!selectedOption">{{ placeholder }}</span>
          <span v-else>{{ getSelectedLabel }}</span>
          <svg
            class="w-4 h-4 ml-2 text-primary transition-transform transform"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      <div class="hidden">
        <slot></slot>
      </div>
      <transition name="fade">
        
        <div v-if="isOpen && !disabled" class="absolute z-10 mt-[2px] w-full max-h-56 overflow-auto text-nowrap border border-white border-opacity-10 bg-[#1D292C] rounded-md no-scrollbar top-12" :style ="{ zIndex: zIndexValue }">
          <div
            v-if="options.length"
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="w-full cursor-pointer hover:bg-white hover:bg-opacity-5 py-2"
            :class="{ 'bg-white bg-opacity-[8%]': (option.value || '').toString() === (selectedOption || '').toString() }"
          >
            <label class="flex m-0 items-center py-[2px] pl-4 cursor-pointer font-normal text-base"
            >
              <div class="flex m-0 items-center">
                <div>{{ option.label }}</div>
              </div>
            </label>
          </div>
          <div v-else class="w-full cursor-pointer" :style ="{ zIndex: zIndexValue }">
            <label class="flex items-center m-0 py-1 pl-4 cursor-pointer">
              <span class="text-gray-200">Options not available</span>
            </label>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, watchEffect, onUnmounted, onMounted } from 'vue';
  
  const props = defineProps({
    id: {
      type: String,
      default: `SingleSelect-${Math.random().toString(16).slice(2)}`
    },
    modelValue: {
      type: [Number, String, Object],
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Select',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    iconShow: {
      type: Boolean,
      default: false,
    },
    imageShow: {
      type: Boolean,
      default: false,
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const isOpen = ref(false);
  const selectedOption = ref(props.modelValue);
  const dropdownRef = ref(null);
  
  const options = ref([]);
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };

  const findAllOptions = () => {
    let data =  dropdownRef.value?.querySelectorAll('option') || [];
    const slotOptions = Array.from(data).map(option => ({
      key: option.getAttribute('key') || '',
      value: option.value,
      label: option.textContent || '',
      icon: option.getAttribute('icon') || '',
      image: option.getAttribute('image') || ''
    }));
    options.value = slotOptions;
  }
  
  const selectOption = (option) => {
    selectedOption.value = option.value;
    emit('update:modelValue', option.value);
    isOpen.value = false;
  };
  
  const getSelectedLabel = computed(() => {
    try {
      const selected = options.value.find(option => option.value.toString() === selectedOption.value.toString());
      return selected ? selected.label : props.placeholder;
    } catch (error) {
      console.error("print error", error);
    }
  });
  
  watch(() => props.modelValue, (newValue) => {
    selectedOption.value = newValue;
  });
  
  const handleClickOutside = (event) => {
    if (
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target)
    ) {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    findAllOptions();
  });
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  function getHighestZIndex() {
    const elements = [...document.querySelectorAll('body *')]
    const zIndexes = elements.map(el => parseFloat(window.getComputedStyle(el).zIndex))
      .filter(zIndex => !isNaN(zIndex))
    return Math.max(0, ...zIndexes)
  }

  // Compute the zIndex value dynamically
  const zIndexValue = computed(() => getHighestZIndex() + 1)
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .rotate-180 {
    transform: rotate(180deg);
  }
  
  .single-select-dropdown {
    span, svg {
      @apply text-white font-normal text-base;
    }
  }
  </style>
  