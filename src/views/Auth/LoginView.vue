<template>
  <div class="absolute bottom-1/4 left-0 w-full h-full pointer-events-none z-0 rotate-180"
      style="background-image: url('/svg/signup-gradient2.svg'); background-repeat: no-repeat; background-size: cover; background-position: top;">
  </div>
  <section class="flex items-center h-[100vh] max-h-[100vh] overflow-hidden bg-[#0C0A0F]">
      <div class="grid lg:grid-cols-2 gap-8 justify-between w-full h-full p-8">
        <div class="hidden lg:flex flex-col justify-center mx-20">
          <div class="my-1">
            <img src="/svg/logo.svg" alt="Logo" class="w-[150px]" />
          </div>
          <h1 class="text-4xl font-bold gradient-text my-4">One platform. Multiple brokers. Unlimited potential</h1>
          <p class="text-base text-white/80">Manage your trading network, monitor broker performance, and scale smarter—all in one place</p>
          <div class="mt-10">
            <img src="/svg/login-img.svg" alt="Main" class="w-full max-w-[410px] h-auto" />
          </div>
        </div>

        <!-- form  -->
        <div class="flex flex-col items-center justify-center p-2">
          <form v-if="!isForgotPassword" class="login-form rounded-md mt-4 grid grid-cols-1 gap-6 w-full p-6 md:p-10 lg:max-w-[450px]" @submit.prevent="submitForm">
            <div >
              <h1 class="text-3xl font-bold">Sign in</h1>
              <p class="my-2 text-base text-white/60">Manage your trading network, monitor broker performance, and scale smarter—all in one place</p>
            </div>
            <div class="space-y-1 w-full">
                <label for="name" class="">Email</label>
                <input v-model.trim="validate.email.$model" class="w-full mt-2 py-2.5 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="e.g. roshni@example.com" />
            </div>


            <div class="space-y-1 w-full">
                <label for="password" class="">Password</label>
                <input id="password" v-model.trim="validate.password.$model" class="w-full mt-2 py-2.5 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="password" placeholder="Your password" />

                <div class="flex justify-between gap-4 mt-1">
                  <p class="text-start text-custom-red text-sm">
                    {{ errorMsg }}
                  </p>
                  <p @click="isForgotPassword=true; errorMsg=''" class="text-nowrap text-sm text-end text-custom-demo cursor-pointer">
                    Forgot password?
                  </p>
                </div>
            </div>

            <div class="space-y-1 w-full">
              <div class="flex items-center relative text-sm text-white/75 pb-2">
                <Checkbox v-model="isAgree" size="16px" />
                <div class="ml-2">
                  I agree the XYZ <a class="text-custom-demo" href="#" target="_blank">T&C</a> and <a class="text-custom-demo" href="#" target="_blank">Privacy Policy</a>
                </div>
              </div>
              <button type="submit" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                <p class="px-6 py-2 m-[1px] rounded-md transition-all duration-300" :class="[isAgree? 'bg-[#0B212C]/20 hover:bg-[#0B212C]/0' : 'bg-[#0B212C]/30 hover:bg-[#0B212C]/10']">Get started</p>
              </button>
              <div class="text-center text-white/75 text-sm pt-1">Don't have an account? <router-link to="/register" class="text-[#00C6FF]">Register</router-link></div>
            </div>

          </form>


          <form v-else-if="isForgotPassword && !isOtpVerified" class="login-form rounded-md mt-4 grid grid-cols-1 gap-6 w-full p-6 md:p-10 lg:max-w-[450px]" @submit.prevent="sendOtp">
            <div>
              <h1 class="text-3xl font-bold"> {{ isGetOtp ? 'Check your email': 'Forgot Password'}}</h1>
              <p v-if="!isGetOtp" class="my-2 text-base text-white/60">Manage your trading network, monitor broker performance, and scale smarter—all in one place</p>
              <p v-else class="my-2 text-base text-white/60">We sent a reset mail to {{ signInFormData.email }} enter 6 digit code that mentioned in the email</p>
            </div>


            <div v-if="isGetOtp">
              <div class="flex gap-3 mt-2">
                <input
                  v-for="(digit, index) in 6"
                  :key="index"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  :value="otp[index]"
                  @input="(e) => moveFocus(e, index)"
                  class="w-[54px] h-[66px] text-center text-2xl rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
                />
              </div>

              <div class="text-start text-sm text-white/60 mt-2">
                  Haven’t got the otp yet? <span @click="sendOtp" class="text-custom-demo cursor-pointer">Resend otp</span>
              </div>

              <div class="text-start text-custom-red text-sm min-h-5">
                  {{ errorMsg }}
              </div>
            </div>


            <div v-else class="space-y-1 w-full">
                <label for="name" class="">Email</label>
                <input v-model.trim="validate.email.$model" class="w-full mt-2 py-2.5 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="e.g. roshni@example.com" />

                <div class="text-start text-custom-red text-sm min-h-5 mt-1">
                    {{ errorMsg }}
                </div>
            </div>
            

            <div class="grid grid-cols-2 gap-4 w-full">
              <button @click="isForgotPassword=false; errorMsg=''" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                <p class="px-6 py-2 m-[1px] rounded-md bg-[#24292B] hover:bg-[#24292B]/90 transition-all duration-300">Back</p>
              </button>
              <button v-if="isGetOtp" @click="verifyOtp" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                <p class="px-6 py-2 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Verify otp</p>
              </button>
              <button v-else @click="sendOtp" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                <p class="px-6 py-2 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Send otp</p>
              </button>
            </div>

          </form>

          <form v-else-if="isForgotPassword && isOtpVerified" class="login-form rounded-md mt-4 grid grid-cols-1 gap-6 w-full p-6 md:p-10 lg:max-w-[450px]" @submit.prevent="requestSetPassword">
            <!-- popup  -->
            <template v-if="showResetPopup">
              <div class="mb-6">
                <h1 class="text-3xl font-bold">Password reset</h1>
                <p class="my-2 text-base text-white/60">Your password has been successfully reset. click
                  confirm to set a new password</p>
              </div>

              <div class="grid grid-cols-2 gap-4 w-full">
                <button @click="isOtpVerified=false; errorMsg=''" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                  <p class="px-6 py-2 m-[1px] rounded-md bg-[#24292B] hover:bg-[#24292B]/90 transition-all duration-300">Back</p>
                </button>
                <button @click="showResetPopup = false" type="button" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                  <p class="px-6 py-2 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Confirm</p>
                </button>
              </div>
            </template>

            <!-- set new password  -->
            <template v-else>
              <div>
                <h1 class="text-3xl font-bold">Set a new password</h1>
                <p class="my-2 text-base text-white/60">Your password has been successfully reset. Now
                    set a new password</p>
              </div>
              <div class="space-y-1 w-full">
                  <label for="new-password" class="">Password</label>
                  <input id="new-password" v-model="setPasswordData.password" class="w-full mt-2 py-2.5 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="text" placeholder="set a new password" />
              </div>


              <div class="space-y-1 w-full">
                  <label for="cnf-new-password" class="">Confirm Password</label>
                  <input id="cnf-new-password" v-model="setPasswordData.confirmPassword" class="w-full mt-2 py-2.5 px-6 rounded-lg text-white/80 bg-white/0 border border-white/15 hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30" type="password" placeholder="confirm your password" />

                  <p class="text-start text-custom-red text-sm mt-1">
                    {{ errorMsg }}
                  </p>
              </div>

              <div class="space-y-1 w-full">
                <button type="submit" class="bg-gradient-to-b from-[#00C6FF] to-[#0072FF] rounded-md w-full">
                  <p class="px-6 py-2 m-[1px] rounded-md bg-[#0B212C]/20 hover:bg-[#0B212C]/0 transition-all duration-300">Get started</p>
                </button>
                <div class="text-center text-white/75 text-sm pt-1">Don't have an account? <router-link to="/register" class="text-[#00C6FF]">Register</router-link></div>
              </div>
            </template>
          </form>

        </div>
      </div>
    </section>
</template>

<script setup>
import {ref, reactive, computed} from 'vue';
import { makeRequest, state, setTokenAndRole, setisAuthenticated } from "@/requests/requests";
import { useToastStore } from "@/stores/utils/toast";
import { useRouter } from 'vue-router';
import { required, email, minLength, integer } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const toast = useToastStore();
const router = useRouter();

const errorMsg = ref('');
const requested = ref(false);

const isForgotPassword = ref(false);
const isGetOtp = ref(false);
const isOtpVerified = ref(false);

const isAgree = ref(false);


const signInFormData = reactive({
  email: "",
  password: "",
});

const allowedDomains = ["gmail.com", "yahoo.com", "zoho.com", "icloud.com", "protonmail.com", "outlook.com", "rediffmail.com", "hotmail.com"];

const isAllowedEmail = (value) => {
  if (!value) return false;
  const domain = value.split("@")[1];
  return allowedDomains.includes(domain);
};

const rules = {
  email: { required, email, isAllowedEmail },
  password: { required, minLength: minLength(6) },
};

const validate = useVuelidate(rules, signInFormData);

const resetSignInFormData = () => {
  signInFormData.email = "";
  signInFormData.password = "";
  errorMsg.value = "";
  isGetOtp.value = false;
  isOtpVerified.value = false;
  isForgotPassword.value = false;
  isAgree.value = false;
};

const otp = ref(['', '', '', '', '', ''])

const moveFocus = (event, index) => {
  const input = event.target;

  // Allow only digits
  input.value = input.value.replace(/[^0-9]/g, '');
  otp.value[index] = input.value; // Save the value in correct position

  // Move to next input if typed
  if (input.value.length === 1 && event.inputType !== 'deleteContentBackward') {
    const next = input.nextElementSibling;
    if (next) next.focus();
  }

  // Move to previous input if backspace
  if (event.inputType === 'deleteContentBackward' && input.value.length === 0) {
    const prev = input.previousElementSibling;
    if (prev) prev.focus();
  }
};

const finalOtp = computed(() => otp.value.join(''));

const sendOtp = async () => {
  signInFormData.password = "randomPassword"; // Set a dummy password for validation
  validate.value.$touch();
  if (validate.value.$invalid) {
    errorMsg.value = "Please enter a valid email address!";
  } else {
    try {
      delete signInFormData.password; // Remove password from the data being sent
      const responseOtp = await makeRequest("sendForgotOTP", "POST", signInFormData);
      if (responseOtp) {
        isGetOtp.value = true;
        errorMsg.value = "";
      } else {
        errorMsg.value = state["sendForgotOTP"]?.error?.data?.message;
      }
    } catch (error) {
      console.error("sendForgotOTP error: ", error);
      errorMsg.value = state["sendForgotOTP"]?.error?.data?.message;
      if (!errorMsg.value) {
        errorMsg.value = "An error occurred while logging in. Please try again later."
      }
    } finally {
      requested.value = false;
    }
  }
}

const verifyOtp = async () => {
  if (finalOtp.value.length === 6) {
    try {
      const responseVerify = await makeRequest("verifyForgotOTP", "POST", {
        email: signInFormData.email,
        otp: finalOtp.value,
      });

      if (responseVerify) {
        isGetOtp.value = false;
        showResetPopup.value = true;
        isOtpVerified.value = true;
        errorMsg.value = "";
      } else {
        errorMsg.value = state["verifyForgotOTP"]?.error?.data?.message;
      }
    } catch (error) {
      console.error("verifyForgotOTP error: ", error);
      errorMsg.value = state["verifyForgotOTP"]?.error?.data?.message;
      if (!errorMsg.value) {
        errorMsg.value = "An error occurred while logging in. Please try again later."
      }
    } finally {
      requested.value = false;
      otp.value = ['', '', '', '', '', '']; // Reset OTP input
    }
  } else {
    errorMsg.value = "Please enter a valid OTP!";
  }
}

const showResetPopup = ref(false);
const setPasswordData = reactive({
  password: "",
  confirmPassword: "",
});

const requestSetPassword = async () => {
  if(setPasswordData.password.length >= 5) {
    if (setPasswordData.password === setPasswordData.confirmPassword) {
      try {
        const responseSetPassword = await makeRequest("forgot", "PUT", {
          email: signInFormData.email,
          password: setPasswordData.password,
          confirm_password: setPasswordData.confirmPassword,
        });

        if (responseSetPassword) {
          isGetOtp.value = false;
          isOtpVerified.value = false;
          resetSignInFormData();
          router.push("/login")
        } else {
          errorMsg.value = state["forgot"]?.error?.data?.message;
        }
      } catch (error) {
        console.error("set password submit error: ", error);
        errorMsg.value = state["forgot"]?.error?.data?.message;
        if (!errorMsg.value) {
          errorMsg.value = "An error occurred while logging in. Please try again later."
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


// login form submit
const submitForm = async () => {
  validate.value.$touch();
  if (validate.value.$invalid || !isAgree.value) {
    errorMsg.value = validate.value.$invalid ? "Please enter a valid email address and password!" : "Please agree to the terms and conditions!";
  } else {
    try {
      // { data: { access_token: 'gdfgdgdggdgdgd'}}//
      const response = await makeRequest("login", "POST", signInFormData, {}, {});

      if (response?.data) {
          // from backend only user and admin come in role 
          setTokenAndRole(`Bearer ${response.data?.access_token}`, 'trader');
          localStorage.setItem("token", `Bearer ${response.data?.access_token}`);
          localStorage.setItem("role", 'trader');

          errorMsg.value = "";
          setisAuthenticated(true, 'trader');

          // websocket connection
          // const tickerStore = useTickerStore();
          // tickerStore.startWebSocket(response.data.access_token);

          router.push("/")
          
          toast.addToast('Success', 'Successfully logged in!', 'success', 3000);
      } else {
        console.log(state["login"]?.error)
        errorMsg.value = state["login"]?.error?.data?.message;
      }
    } catch (error) {
        console.error("Login error: ", error);
        errorMsg.value = state["login"]?.error?.data?.message;
        if (!errorMsg.value) {
          errorMsg.value = "An error occurred while logging in. Please try again later."
        }
    } finally {
        requested.value = false;
    }
  }
  
}

</script>


<style scoped>
.gradient-text {
  background: linear-gradient(180deg, #00C6FF 0%, #0072FF 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.login-form {
  background: linear-gradient(149.17deg, rgba(255, 255, 255, 0.075) 2.12%, rgba(255, 255, 255, 0.03) 100.88%);
  border: 1px solid #FFFFFF1A;
  backdrop-filter: blur(73.5999984741211px);
}
</style>