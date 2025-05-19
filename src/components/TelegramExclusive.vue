<template>
    <div class="bg-[#030720] relative z-[0] pb-24">

        <div class="fixed bottom-0 w-full h-20 z-20 flex justify-center items-center backdrop-blur-sm bg-custom-blue/10 border-t border-white/10">
            <button class="bg-custom-blue/50 h-min z-30 hover:scale-95 w-[90%] lg:w-[20%] py-2 border-2 border-custom-blue rounded-lg transition-all hover:shadow-lg">
                Join Exclusive
            </button>
        </div>
        <!-- absolute bg -->
        <div class="w-full mx-auto absolute top-0 z-[-1] flex justify-center">
            <div class="grid grid-cols-11 w-full lg:w-[75%]">
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/5 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/10 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/20 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/30 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/40 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/40 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/40 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/30 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/20 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/10 to-transparent h-[55vh]"></div>
                <div class="bg-gradient-to-b from-custom-blue/5 via-custom-blue/5 to-transparent h-[55vh]"></div>
            </div>
        </div>



        <!-- hero -->
        <section class="w-[90%] lg:w-full mx-auto text-center flex flex-col items-center h-[60vh] justify-center ">
            <p class="text-white font-[400] text-[23.02px] ">Welcome To</p>


            <!-- badge -->
            <div class="border border-l-0 mt-8 mb-10 border-custom-blue flex w-fit ">
                <div class="flex p-2 items-center">

                    <img src="/src/assets/svg/logo.svg" alt="">
                </div>
                <div class="bg-custom-blue flex items-center justify-center px-5 py-2">
                    <p class="text-black italic text-[28px] font-bold">Club</p>
                </div>
            </div>

            <h1 class="mb-8 text-white text-3xl lg:text-[39.02px] font-bold">Let Our Signals Lead the Way.</h1>
            <p class="text-[19.2px] font-[400] text-white">Accurate forex calls. Real-time alerts. One step
                ahead—always.
            </p>
        </section>

        <!-- why -->
        <section class="w-[90%] lg:w-[70%] mx-auto border-2 border-custom-blue rounded-lg bg-white/5 text-center p-8">
            <h3 class="font-bold text-white text-[16px] lg:text-[19.2px] mb-8">
                WHY CHOOSE US
            </h3>
            <h1 class="font-bold text-white text-2xl lg:text-[39.02px] mb-8">
                Because in a volatile market, clarity and timing are everything.
            </h1>
            <p class="font-normal text-white text-[16px] lg:text-[19.2px]">We offer reliable, expert-backed forex
                signals that help you
                enter trades with confidence—whether you're just starting or scaling up.</p>
        </section>

        <!-- perks -->
        <section
            class="w-[90%] lg:w-[70%] mx-auto border-2  border-custom-blue rounded-lg bg-white/5 text-center p-4 mt-10">
            <h3 class="font-bold text-custom-blue text-[43.2px] mb-8 curvy">
                Exclusive Perks
            </h3>
            <div class="flex flex-col lg:flex-row w-full justify-evenly text-left  p-4 lg:px-10 gap-10 lg:gap-4 ">
                <div class="space-y-2 lg:border-r border-dashed w-full">
                    <h4 class="text-[16px] lg:text-[19.2px] font-bold">Basic</h4>
                    <div class="flex gap-2 items-center" v-for="i in basicFeatures">
                        <div class="min-w-8 max-w-8">

                            <LottieAnimation animationPath="/src/assets/animation/verification.json" />
                        </div>
                        <p class="text-[16px] lg:text-[19.2px]">{{ i }}</p>
                    </div>
                </div>
                <div class="space-y-2  w-full lg:px-4">
                    <h4 class="text-[16px] lg:text-[19.2px] font-bold">Premium</h4>
                    <div class="flex gap-2 items-center" v-for="i in premiumFeatures">
                        <div class="min-w-8 max-w-8">

                            <LottieAnimation animationPath="/src/assets/animation/verification.json" />
                        </div>
                        <p class="text-[16px] lg:text-[19.2px]">{{ i }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import LottieAnimation from './LottieAnimation.vue';

const basicFeatures = [
    '2–3 trade signals per day',
    'No access to past trade reports',
    'Email support only',
    'No personalized risk suggestions'
]

const premiumFeatures = [
    '10–15 high-accuracy signals per day',
    'Full trade setup: Entry, SL, TP + strategy explanation',
    'Access to full trade history & performance tracking',
    'Personalized lot size & risk management tips'
]

</script>

<style lang="scss" scoped>
* {
    font-family: "Red Hat Display", sans-serif;
}

.curvy {
    font-family: "Caveat", cursive;
}
</style>