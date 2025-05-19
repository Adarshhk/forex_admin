<template>
    <div class="flex flex-col justify-center min-h-80 items-center h-full w-full">

      <div class="h-44">
        <LottieAnimation animationPath="/src/assets/not-found.json" />

      </div>
      <div class="flex flex-col items-center justify-center text-center p-4">
        <p class="text-lg font-bold sm:text-lg text-white/85 mt-2">Oops! Looks like there's nothing here.</p>
      </div>
    </div>
</template>

<script setup>
import LottieAnimation from './LottieAnimation.vue';


</script>

<style lang="scss" scoped>

</style>