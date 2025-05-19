<script setup>
import { storeToRefs } from "pinia";
import { usePositionsStore } from "@/stores/matrix/positions";
const positionsStore = usePositionsStore();
const { isTabActive } = storeToRefs(positionsStore);

const toggleSelected = (button) => {
  isTabActive.value = button;
};
</script>

<template>
    <div
          class="flex justify-center text-white ml-auto text-[13px] py-1 rounded-3xl bg-white bg-opacity-10"
        >
          <button
            :class="[
              'w-[70px] h-[30px] rounded-3xl font-bold ml-1',
              {
                'bg-custom-demo text-black infinite-shine-btn': isTabActive === 'Paper',
                inactive: isTabActive !== 'Paper',
              },
            ]"
            @click="toggleSelected('Paper')"
          >
             Paper
          </button>
          <button
            :class="[
              'w-[70px] h-[30px] rounded-3xl font-bold mr-1',
              {
                'bg-custom-demo text-black infinite-shine-btn': isTabActive === 'Live',
                inactive: isTabActive !== 'Live',
              },
            ]"
            @click="toggleSelected('Live')"
          >
            Live
          </button>
        </div>
</template>

<style scoped>
.infinite-shine-btn {
  position: relative;
  display: inline-block;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s ease-in-out;
}

.infinite-shine-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 100%
  );
  transform: skewX(-20deg); /* Slant effect */
  animation: infiniteShine 2.5s linear infinite;
}

@keyframes infiniteShine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>