<template>
    <div class="rounded-lg flex justify-end bg-[#0c0a0f] gap-2  relative min-w-60 lg:w-auto ">
        <button @click="emits('buy')" class="bg-[#2ab425] rounded-lg w-6 h-6 flex items-center justify-center">B</button>
        <button @click="emits('sell')" class="bg-[#d94a4a] rounded-lg w-6 h-6 flex items-center justify-center">S</button>
        <button @click="emits('delete')" class="bg-[#ffffff11] rounded-lg w-6 h-6 flex items-center justify-center"><img src="/svg/delete.svg" alt=""></button>
    </div>  
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const { width } = useWindowSize()

const emits = defineEmits(['buy' , 'sell' , 'delete']);



const background = computed(() => {
    return width.value >= 1024
        ? `linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
         radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)`
        : `#1B1B1B`
})
</script>