<template>
  <section class="flex items-center h-[100vh] bg-[#0C0A0F]">
    <div class="flex gap-4 justify-between h-full p-4 pb-2 w-full">
      <div class="relative hidden lg:block w-full rounded-3xl ">
        <img src="/svg/signup-gradient.svg" alt="Main" class="w-full h-full object-cover rounded-3xl brightness-105" />

        <!-- Noise overlay -->
        <div
          class="absolute inset-0 pointer-events-none z-10"
          style="background-image: url('/imgs/small-noise.png'); background-repeat: repeat; background-size: 150px 150px;">
        </div>

        <!-- Text content -->
        <div class="absolute inset-0 flex items-center justify-center z-20">
          <div class="flex flex-col items-center justify-end h-full max-w-[600px] p-4 mb-20">
            <div class="my-1">
              <img src="/svg/logo.svg" alt="Logo" class="w-[150px]" />
            </div>
            <div class="text-center my-4">
              <h1 class="text-4xl font-bold">Your trading future starts now</h1>
              <p class="mt-2 px-20 text-base text-white/80">Create your account and explore opportunities in every market move.</p>
              <div class="flex items-center mx-6 px-6 py-3.5 mt-10 bg-[#202021]/80 rounded-lg">
                <img src="/imgs/setting.png" alt="Setting" class="w-6 h-6 mr-2" />
                <p class="text-base text-white/70">Control Your Workspace</p>
              </div>
              <div class="flex items-center mx-6 px-6 py-3.5 mt-4 bg-[#202021]/80 rounded-lg">
                <img src="/imgs/paint.png" alt="Setting" class="w-6 h-6 mr-2" />
                <p class="text-base text-white/70">Navigate the Markets</p>
              </div>
              <div class="flex items-center mx-6 px-6 py-3.5 mt-4 bg-[#202021]/80 rounded-lg">
                <img src="/imgs/chart.png" alt="Setting" class="w-6 h-6 mr-2" />
                <p class="text-base text-white/70">Clarity in Every Chart</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- form  -->
      <div class="flex flex-col items-center justify-center p-2 w-full lg:w-[75%] h-full ">
        <div class="max-w-[480px]">
          <div >
            <h1 class="text-3xl font-bold">Create your trading account</h1>
            <p class="my-2 text-base text-white/75">Manage portfolios, connect brokers, and track performance—all in one place.</p>
          </div>
          <form v-if="!isOtpVerified" class="mt-10 grid grid-cols-1 gap-6 w-full" @submit.prevent="getOtpRequest">
            <div class="space-y-1 w-full">
                <label for="name" class="">Full Name</label>
                <input id="name" v-model.trim="validate.name.$model" :disabled="isGetOtp" class="w-full mt-2 py-3 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="e.g. Roshni Chandra" />
            </div>

            <div class="space-y-1 w-full">
                <label for="email" class="">Email</label>
                <input id="email" v-model.trim="validate.email.$model" :disabled="isGetOtp" class="w-full mt-2 py-3 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="e.g. roshni@example.com" />
            </div>

            <div v-if="isGetOtp" class="space-y-1 w-full">
                <label for="otp" class="">OTP</label>
                <input id="otp" v-model="signupOtp" @input="signupOtp = signupOtp.replace(/[^0-9]/g, '')" class="w-full mt-2 py-3 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="Enter OTP Here" />
            </div>

            <div v-else class="w-full">
                <label for="number" class="">Number</label>
                <div class="relative">
                  <input id="number" v-model.trim="validate.mobile.$model" @input="validateMobile" class="w-full mt-1 py-3 px-6 pl-10 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="e.g 9009566516" />
                  <div class="absolute inset-y-0 h-full left-0 flex items-center pl-2 pt-[4px] font-semibold text-custom-demo pointer-events-none">
                    +91
                  </div>
                </div>
            </div>

            

            <div class="text-sm text-custom-red min-h-5 -mt-4">
                {{ errorMsg }}
            </div>

            <div class="space-y-1 w-full">
              <div class="flex items-center relative text-sm text-white/75 pb-2">
                <Checkbox v-model="isAgree" size="16px" />
                <div class="ml-2">
                  I agree the XYZ <a class="text-custom-demo" href="#" target="_blank">T&C</a> and <a class="text-custom-demo" href="#" target="_blank">Privacy Policy</a>
                </div>
              </div>
              <button v-if="isGetOtp" @click="verifyOtpRequest" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p class="px-6 py-3 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Verify OTP</p>
              </button>
              <button v-else @click="getOtpRequest" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p class="px-6 py-3 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Get an OTP</p>
              </button>
              <div class="text-center text-white/75 text-sm pt-1">Already a member? <router-link to="/login" class="text-[#00C6FF]">Login</router-link></div>
            </div>

          </form>


          <form v-else class="mt-10 grid grid-cols-1 gap-6 w-full" @submit.prevent="submitForm">
            <div class="space-y-1 w-full">
                <label for="password" class="">Password</label>
                <input id="password" v-model="setPasswordData.password" class="w-full mt-2 py-3 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="password" placeholder="Enter Password" />
            </div>

            <div class="space-y-1 w-full">
                <label for="confirm_password" class="">Confirm Password</label>
                <input id="confirm_password" v-model="setPasswordData.confirm_password" class="w-full mt-2 py-3 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="password" placeholder="Confirm Password" />
            </div>

            <div class="text-sm text-custom-red min-h-5 -mt-4">
                {{ errorMsg }}
            </div>

            <div class="space-y-1 w-full">
              <div class="flex items-center relative text-sm text-white/75 pb-2">
                <Checkbox v-model="isAgree" size="16px" />
                <div class="ml-2">
                  I agree the XYZ <a class="text-custom-demo" href="#" target="_blank">T&C</a> and <a class="text-custom-demo" href="#" target="_blank">Privacy Policy</a>
                </div>
              </div>
              <button type="submit" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-lg w-full">
                <p class="px-6 py-3 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Submit</p>
              </button>
              <div class="text-center text-white/75 text-sm pt-1">Already a member? <router-link to="/login" class="text-[#00C6FF]">Login</router-link></div>
            </div>

          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, reactive} from 'vue';
import { makeRequest, state, setTokenAndRole, setisAuthenticated } from "@/requests/requests";
import { useToastStore } from "@/stores/utils/toast";
import { useRouter } from 'vue-router';
import { required, email, minLength, integer } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const router = useRouter();

const errorMsg = ref('');
const requested = ref(false);

const isGetOtp = ref(false);
const isOtpVerified = ref(false);
const isLogin = ref(false);
const isAgree = ref(false);

const registerFormData = reactive({
  name: "",
  email: "",
  mobile: "",
});

const signupOtp = ref('')

const allowedDomains = ["gmail.com", "yahoo.com", "zoho.com", "icloud.com", "protonmail.com", "outlook.com", "rediffmail.com", "hotmail.com"];

const isAllowedEmail = (value) => {
  if (!value) return false;
  const domain = value.split("@")[1];
  return allowedDomains.includes(domain);
};

const validateMobile = () => {
  registerFormData.mobile = registerFormData.mobile.replace(/\D/g, ""); // Remove non-numeric characters
  if (registerFormData.mobile.length > 10) {
    registerFormData.mobile = registerFormData.mobile.slice(0, 10); // Limit to 10 digits
  }
};

const rules = {
  name: { required },
  email: { required, email, isAllowedEmail },
  mobile: { required, minLength: minLength(10) },
};

const validate = useVuelidate(rules, registerFormData);


const getOtpRequest = async () => {
  errorMsg.value = "";
  validate.value.$touch();
  if (validate.value.$invalid) {
    // const toastStore = useToastStore();
    errorMsg.value = "Please fill the form correctly!";
    // toastStore.addToast("Warning", "Please check the filled form!", "warn");
  } else {
    debugger
    try {
      const response = await makeRequest("getSignupOTP", "POST", registerFormData, {}, {});

      console.log("print resonse ", response);

      if (response) {
        isGetOtp.value = true;
        errorMsg.value = "";
        
      } else {
        errorMsg.value = state["getSignupOTP"]?.error?.data?.message;
      }
    } catch (error) {
        console.error("getSignupOTP error: ", error);
        errorMsg.value = state["getSignupOTP"]?.error?.data?.message;
        if (!errorMsg.value) {
          errorMsg.value = "An error occurred while signup. Please try again later."
        }
    } finally {
        requested.value = false;
    }
  }
  
}


const verifyOtpRequest = async () => {
  errorMsg.value = "";
  if(signupOtp.value.length < 6) {
    errorMsg.value = "Please enter a valid OTP!";
    return;
  } else {
    debugger
    let formData = {
      email: registerFormData.email,
      otp: signupOtp.value
    }
    try {
      const response = await makeRequest("verifyOTP", "PUT", formData, {}, {});

      console.log("print resonse ", response);

      if (response) {
        errorMsg.value = "";
        isOtpVerified.value = true;
        
      } else {
        errorMsg.value = state["verifyOTP"]?.error?.data?.message;
      }
    } catch (error) {
        console.error("verifyOTP error: ", error);
        errorMsg.value = state["verifyOTP"]?.error?.data?.message;
        if (!errorMsg.value) {
          errorMsg.value = "An error occurred while signup. Please try again later."
        }
    } finally {
        requested.value = false;
    }
  }
}


const setPasswordData = reactive({
  password: "",
  confirm_password: "",
});

const submitForm = async () => {
  errorMsg.value = "";
  if(setPasswordData.password.length >= 5) {
    if (setPasswordData.password === setPasswordData.confirm_password) {
      try {
        setPasswordData.email = registerFormData.email;
        const response = await makeRequest("register", "POST", setPasswordData, {}, {});

        console.log("print resonse ", response);

        if (response) {
          isGetOtp.value = true;
          errorMsg.value = "";

          router.push("/login")
          
          toast.addToast('Success', 'Successfully registered!', 'success', 3000);
        } else {
          errorMsg.value = state["register"]?.error?.data?.message;
        }
      } catch (error) {
          console.error("Signup error: ", error);
          errorMsg.value = state["register"]?.error?.data?.message;
          if (!errorMsg.value) {
            errorMsg.value = "An error occurred while signup. Please try again later."
          }
      } finally {
          requested.value = false;
      }
    } else {
      errorMsg.value = "Passwords do not match!";
    }
  } else {
    errorMsg.value = "Please enter a minimum 5 digit password!";
  }
  
}


</script>


<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.55) 100%);
  -webkit-background-clip: text; /* For WebKit-based browsers */
  background-clip: text;        /* The standard property */
  color: transparent;
}


</style>