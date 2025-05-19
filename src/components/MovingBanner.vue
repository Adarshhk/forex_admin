<template>
  <div class="bg-custom-red/10 py-1">

    <Vue3Marquee>
      <span v-for="(word, index) in helloArray" :key="index" class="text-sm text-white/50" :gradient="true"
        :gradient-color="[255, 255, 255]" gradient-length="30%">
        {{ word }} &nbsp;
      </span>
    </Vue3Marquee>
  </div>
</template>

<script setup>
import { Vue3Marquee } from 'vue3-marquee';

const helloArray = ['10000', 'PLUS', 'USERS', 'SUBSCRIBED', 'THIS', 'STRATEGY', 'AND', 'DEPLOYED', 'IT.']
</script>
