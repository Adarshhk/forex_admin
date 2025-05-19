<template>
    <!-- for top  -->
    <div class="lg:hidden relative border border-white/15 rounded-md h-[250px] lg:h-[300px]">
        <div class="relative h-[144px] w-full rounded-t-md flex items-center justify-center">
            <img src="/imgs/profilebg1.png" alt="Profile" class="w-full h-full" />
            <button>
                <img src="/svg/edit.svg" alt="Edit" class="absolute top-2 right-2 w-6 cursor-pointer" />
            </button>
        </div>
        <div class="absolute top-0 w-full h-full flex flex-col items-center justify-center space-y-3 pt-6">
            <div class="relative">
                <img :src="profile?.profile?.profile_pic_url || '/imgs/dafaultImg2.png'" alt="Profile" class="w-[130px] h-[130px] rounded-lg object-cover" />
                <button @click="triggerFileInput" type="button">
                    <img src="/svg/edit.svg" alt="Edit" class="absolute bottom-0 -right-2 w-6 cursor-pointer" />
                </button>
                <input 
                    type="file" 
                    ref="fileInput" 
                    @change="handleProfilePicChange" 
                    accept="image/*" 
                    class="hidden" 
                />
            </div>
            <div class="space-y-1 ml-2">
                <h1 class="font-bold text-lg">{{ profile?.profile?.name }}</h1>
                <p class="text-xs text-white/80">{{ profile?.profile?.email }}</p>
            </div>
        </div>
    </div>


    <!-- bottom content  -->
    <main class="flex gap-4 w-full mt-2">
        <div class="min-w-[280px] xl:min-w-[330px] max-w-[340px] hidden lg:block ">
            <div class="relative border border-white/15 rounded-md h-[300px]">
                <div class="relative h-[144px] w-full rounded-t-md flex items-center justify-center">
                    <img src="/imgs/profilebg1.png" alt="Profile" class="w-full h-full" />
                    <img src="/svg/edit.svg" alt="Edit" class="absolute top-2 right-2 w-6 cursor-pointer" />
                </div>
                <div class="absolute top-0 w-full h-full flex flex-col items-center justify-center space-y-3 pt-6">
                    <div class="relative">
                        <img :src="profile?.profile?.profile_pic_url || '/imgs/dafaultImg2.png'" alt="Profile"
                            class="w-[130px] h-[130px] rounded-lg object-cover" />
                        <button @click="triggerFileInput" type="button">
                            <img src="/svg/edit.svg" alt="Edit" class="absolute bottom-0 -right-2 w-6 cursor-pointer" />
                        </button>
                        <input 
                            type="file" 
                            ref="fileInput" 
                            @change="handleProfilePicChange" 
                            accept="image/*" 
                            class="hidden" 
                        />
                    </div>
                    <div class="space-y-1 ml-2">
                        <h1 class="font-bold text-lg">{{ profile?.profile?.name }}</h1>
                        <p class="text-xs text-white/80">{{ profile?.profile?.email }}</p>
                    </div>
                </div>
            </div>

            <div class="relative border border-white/15 rounded-md h-[173px] mt-4 w-auto">
                <img src="/imgs/profilebg2.png" alt="Profile" class="w-full h-full" />
                <div class="absolute top-0 w-full h-full flex flex-col space-y-6 px-2">
                    <h1 class="font-bold mt-4 text-xl w-[80%]">Thanks to one of our 3600 guests already there</h1>
                    <button class="px-6 py-2 rounded-lg bg-[#E2C937] max-w-[150px]">Upgrade Now</button>
                </div>
            </div>
        </div>
        <div class="lg:border border-white/15 min-h-[50vh] p-1 md:p-4 rounded-md w-full">
            <!-- <h1 class="font-bold text-lg pl-1 md:pl-0">Showing Roshni's Profile</h1> -->

            <div class="profile-btn-gradient hidden xl:grid grid-cols-2 mt-4 rounded-lg">
                <button @click="() => { activebtn = 'profile'; isEditing = true; }"
                    class="text-sm rounded-lg px-4 py-1.5 mx-1.5 my-[3px] border smooth-transition"
                    :class="[activebtn === 'profile' ? 'bg-[#FFFFFF12] border-[#FFFFFF1A] text-white/90 ' : ' border-transparent text-white/65']">Personal
                    Details</button>
                <button @click="() => { activebtn = 'password'; isEditing = true; }"
                    class="text-sm rounded-lg px-4 py-1.5 mx-1.5 my-[3px] border smooth-transition"
                    :class="[activebtn === 'password' ? 'bg-[#FFFFFF12] border-[#FFFFFF1A] text-white/90' : ' border-transparent text-white/65']">Change
                    Password</button>
            </div>

            <div class="xl:hidden grid grid-cols-2 mt-4 rounded-lg">
                <button @click="() => { activebtn = 'profile'; isEditing = true; }"
                    class="flex justify-center text-sm rounded-lg mx-0.5 xs:mx-1.5 my-[3px] smooth-transition">
                    <p class="border-b px-3 xs:px-4 py-1.5"
                        :class="[activebtn === 'profile' ? 'border-custom-demo text-white/90 ' : ' border-transparent text-white/65']">
                        Personal Details</p>
                </button>
                <button @click="() => { activebtn = 'password'; isEditing = true; }"
                    class="flex justify-center text-sm rounded-lg mx-0.5 xs:mx-1.5 my-[3px] smooth-transition">
                    <p class="border-b px-3 xs:px-4 py-1.5"
                        :class="[activebtn === 'password' ? 'border-custom-demo text-white/90' : ' border-transparent text-white/65']">
                        Change Password</p>
                </button>
            </div>

            <div class="border border-white/15 grid grid-cols-2 md:grid-cols-3 items-center mt-4 rounded-lg p-2">
                <div class="flex item-center">
                    <img :src="profile?.profile?.profile_pic_url || '/imgs/defaultImg.png'" alt="Profile" class="w-[40px] h-[40px] object-cover rounded-full" />
                    <div class="space-y-1 ml-2">
                        <h1 class="font-bold text-sm xs:text-base">{{ profile?.profile?.name }}</h1>
                        <p class="text-xs text-white/80">{{ profile?.profile?.email }}</p>
                    </div>
                </div>

                <div class="flex gap-4 justify-end md:justify-center items-center">

                    <div class="flex md:hidden justify-end sm:mr-8">
                        <button v-if="isEditing" @click="handleEdit" class="flex items-center space-x-1">
                            <img src="/svg/edit.svg" alt="Edit" class="w-4" />
                            <span class="text-sm">Edit</span>
                        </button>
                        <button @click="handleSave" v-else class="flex items-center space-x-1">
                            <!-- <img src="/svg/edit.svg" alt="Edit" class="w-4" /> -->
                            <span class="text-sm">Save</span>
                        </button>
                    </div>
                </div>

                <div class="hidden md:flex justify-end mr-8">
                    <button v-if="isEditing" @click="handleEdit" class="flex items-center space-x-1">
                        <img src="/svg/edit.svg" alt="Edit" class="w-4" />
                        <span class="text-sm">Edit</span>
                    </button>
                    <button @click="handleSave" v-else class="flex items-center space-x-1">
                        <!-- <img src="/svg/edit.svg" alt="Edit" class="w-4" /> -->
                        <span class="text-sm">Save</span>
                    </button>
                </div>
            </div>


            <!--profile form  -->
            <div v-if="activebtn == 'profile'" class="mt-5 grid md:grid-cols-2 gap-3 md:gap-7 w-full px-1 md:px-0">
                <div>
                    <label for="name" class="">Name</label>
                    <input :disabled="isEditing" v-model="profileForm.name" class="form-input" type="text"
                        placeholder="Enter your name" />
                </div>

                <div>
                    <label for="name" class="">Website</label>
                    <input :disabled="isEditing" v-model="profileForm.website" class="form-input" type="text"
                        placeholder="Enter your website" />
                </div>

                <div>
                    <label for="name" class="">Tradingview id</label>
                    <input :disabled="isEditing" v-model="profileForm.tradingview" class="form-input" type="text"
                        placeholder="Enter your tradingview id" />
                </div>

                <div>
                    <label for="name" class="">Telegram id</label>
                    <input :disabled="isEditing" v-model="profileForm.telegram" class="form-input" type="text"
                        placeholder="Enter your telegram id" />
                </div>
            </div>

            <!--password form  -->
            <div v-if="activebtn == 'password'" class="mt-5 grid md:grid-cols-2 gap-3 md:gap-7 w-full px-1 md:px-0">
                <div>
                    <label for="name" class="">Current Password</label>
                    <input :disabled="isEditing" v-model="passwordForm.current_password" class="form-input" type="text"
                        placeholder="Enter your current password" />
                </div>

                <div>
                    <label for="name" class="">New Password</label>
                    <input :disabled="isEditing" v-model="passwordForm.new_password" class="form-input" type="text"
                        placeholder="Enter new password" />
                </div>

                <div>
                    <label for="name" class="">Confirm Password</label>
                    <input :disabled="isEditing" v-model="passwordForm.confirm_password" class="form-input" type="text"
                        placeholder="Enter your confirm password" />
                </div>


            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import Topbar2 from '@/components/Topbar2.vue';
import { useProfileStore } from '@/stores/matrix/profile';
import { storeToRefs } from 'pinia';

const activebtn = ref('profile');
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);
const isEditing = ref(true);
const fileInput = ref(null);

const profileForm = ref({
    name: '',
    website: '',
    tradingview: '',
    telegram: '',
})

const passwordForm = ref({
    current_password: '',
    new_password: '',
    confirm_password: ''
})

watchEffect(() => {
    if (profile.value.socials) {
        profileForm.value.website = profile.value.socials.website;
        profileForm.value.name = profile.value.profile.name;
        profileForm.value.tradingview = profile.value.socials.tradingview;
        profileForm.value.telegram = profile.value.socials.telegram;
    }
})

const handleEdit = () => {
    isEditing.value = false
}

const handleSave = async () => {
    let res;
    if (activebtn.value === 'profile') {
        res = await profileStore.updateProfile(profileForm.value);
    }
    else {
        res = await profileStore.changePassword({ 
            current_password: passwordForm.value.current_password, 
            new_password: passwordForm.value.new_password 
        });
    }

    if(res) {
        isEditing.value = true;
    }
}

// Function to trigger the file input click
const triggerFileInput = () => {
    fileInput.value.click();
}

// Function to handle profile pic change
const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // You might want to add validation for file type/size here
    
    // Convert the file to Base64 or handle it according to your API requirements
    const reader = new FileReader();
    
    reader.onload = async (e) => {
        const imageData = e.target.result;
        
        // Call the updateProfile function with the profile_pic_url
        const res = await profileStore.updateProfile({
            profile_pic_url: imageData
        });
        
        // Reset the file input so the same file can be selected again if needed
        event.target.value = '';
        
        // Optional: Show a success message or handle errors
        if (res) {
            console.log('Profile picture updated successfully');
        }
    };
    
    reader.readAsDataURL(file);
}
</script>


<style scoped>
.bg-profile-gradient {
    backdrop-filter: blur(22.598642349243164px);
    box-shadow: 0px 4px 8px 0px #00000080;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
        radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
}

.profile-btn-gradient {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%),
        radial-gradient(50% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);

}

.smooth-transition {
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.form-input {
    @apply w-full disabled:cursor-not-allowed mt-2 py-2 px-4 rounded-md bg-white/10 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30;
}
</style>