<template>
    <div class="flex flex-col-reverse lg:flex-row justify-center items-center gap-8 text-white w-full h-screen px-10 lg:px-20">
        <div>
            <h1 class="font-bold text-3xl lg:text-5xl xl:text-[67px] font-red-hat text-[#E3E3E3]" >Opps! Nothing Here.....</h1>
            <p class="font-bold text-[14px] lg:text-[18px] 3xl:text-[22.2px] text-[#E3E3E3]">The page you’re trying is out of this universe</p>
            <div class=" mt-4 flex justify-center lg:justify-start w-full">
                <router-link :to="router.go(-1)" class="font-bold text-[14px] lg:text-[18px] text-black bg-custom-demo py-1 lg:py-2 px-4 lg:px-6 rounded-full">
                    Go Back
                </router-link>
            </div>
        </div>
        <div class="max-w-[500px] xl:max-w-[642px] xl:max-h-[642px]">
            <LottieAnimation animation-path="/animations/no_page_found.json" />
        </div>
    </div>
</template>

<script setup>
import LottieAnimation from "@/components/LottieAnimation.vue";
import router from "@/router";

</script>
