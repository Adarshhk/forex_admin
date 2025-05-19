<template>
    <Modal v-model="props.isOpen" @close="handleClose">
        <div class="flex flex-col justify-between w-full lg:w-[320px]">
            <div>
                <div
                    class="flex items-center justify-between py-4 px-2 xs:px-4 border-b border-white/10 rounded-lg rounded-b-none w-full">
                    <h1 class="text-lg font-bold">New Watchlist</h1>

                    <button @click="handleClose" class="block text-white/80 p-1">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <form class="grid grid-cols-1 w-full px-4">
                    <div class="space-y-2">
                        <!-- <label for="name" class="font-thin">Name</label> -->
                        <input v-model="formData.name"
                            class="focus:outline outline-custom-blue w-full mt-2 py-2 px-3 rounded-md bg-white/0 border border-white/15 hover:border-custom-blue  focus:ring-1 focus:ring-custom-blue text-sm placeholder:text-sm"
                            type="text" placeholder="Enter Name" />
                        <div class="flex w-full gap-2 items-center flex-wrap">
                            <p class="text-xs">SUGGESTIONS : </p>
                            <button @click="() => {formData.name = item}"  type="button" v-for="(item , i) in suggestionButtons" class="rounded-full bg-white/5 px-2 py-1 text-[10px] border border-white/10 hover:border-custom-blue w-fit hover:bg-white/10 transition-all duration-150">
                                <span class="text-xs text-nowrap ">{{ item }}</span>
                            </button>
                            
                        </div>
                    </div>

                </form>
            </div>
            <div class="p-4">

                <button @click="handleSubmit" type="button"
                    class="min-w-[93px] w-full text-sm px-6 py-2 rounded-md  transition-all duration-150 bg-custom-blue ">Submit</button>
            </div>

        </div>


    </Modal>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import Modal from './Modal.vue';
import { useWatchlistStore } from '@/stores/matrix/watchlist';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['close']);
const watchlistStore = useWatchlistStore();
const { watchlistToEdit } = storeToRefs(watchlistStore)

const props = defineProps({
    isOpen: Boolean
})

const handleClose = () => {
    emit('close')
}

watchEffect(() => {
    if (watchlistToEdit.value) {
        formData.value.name = watchlistToEdit.value.name
    }
})
const formData = ref({
    name: ''
})

const handleSubmit = async () => {
    const res = await watchlistStore.addEditWatchlist(formData.value);
    if (res) {
        handleClose();
    }
}

const suggestionButtons = ['My Favourite' , 'Top Symbols' , 'Gold' , 'High Volume']
</script>

<style lang="scss" scoped></style>