import { ref, toRefs, reactive, computed } from 'vue';
import router from "@/router/index";
import { ManageApiResponse } from "./manageResponse";
import config from '../../matrixcnfg.js';
import { useTickerStore } from '@/stores/matrix/ticker/ticker'



const token = ref(null);
const isAuthenticated = ref(null)

const userRole = ref('')



token.value = localStorage.getItem('token');
if (token.value) {
  try {
    userRole.value = (localStorage.getItem('role') || '').toLowerCase();
    isAuthenticated.value = true
  } catch (error) {
    isAuthenticated.value = false
    userRole.value = ''
    localStorage.setItem('role', "");
  }

}


const setisAuthenticated = (value, role) => {
  isAuthenticated.value = value;
  userRole.value = role ? role.toLowerCase() : ''
};
const getisAuthenticated = () => {
  return isAuthenticated.value
};

const setRole = (roleName) => {
  userRole.value = roleName.toLowerCase();
  localStorage.setItem('role', roleName)
};

const setTokenAndRole = (tokendata, roleName) => {
  token.value = tokendata;
  userRole.value = roleName.toLowerCase();
};
const getToken = () => {

  return token.value;
};



const channel = new BroadcastChannel('my-channel');
channel.addEventListener('message', (event) => {
  const message = event.data;
  if (message.type === 'logout') {
    logout()
  }
});

let stopRequest = false
const logOutRequest = async () => {
  try {
    if (stopRequest) return
    await makeRequest("logout", "POST", {}, {}, {}, 0, null);
    stopRequest = true
  } catch (error) {
    console.error(error);
    stopRequest = true
  }
}

// const logout = async () => {
//   const tickerStore = useTickerStore();

//   // Inform backend about logout
//   logOutRequest();

//   // Send a logout message to other tabs
//   channel.postMessage({ type: 'logout', data: 'logged out' });

//   // Store tutorial status before clearing storage
//   const tutorial = localStorage.getItem('tutorial');

//   // Clear storage safely
//   localStorage.removeItem('token');
//   localStorage.removeItem('role');
//   localStorage.setItem('tutorial', tutorial || 'false'); // Restore tutorial state

//   sessionStorage.clear();

//   tickerStore.stopWebSocket();

//   isAuthenticated.value = false;

//   // router.push("/login");

//   // Delay reload if necessary
//   document.body.classList.add('fade-out')
//   setTimeout(() => {
//       window.location.reload();
//   }, 300);
// };

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  router.push('/login')
  setTimeout(() => {
    window.location.reload();
  }, 300);
}

const smoothReload = () => {
  router.push("/login");
  document.body.classList.add('fade-out')
  setTimeout(() => {
    window.location.reload();
  }, 300);
};


import axios from 'axios';
axios.defaults.silent = true;
axios.defaults.withCredentials = true;
let baseUrl
if (config.env == "production") {
  const currentRootUrl = window.location.origin;
  baseUrl = ref(currentRootUrl);
} else {
  baseUrl = ref("https://dsxt5ptw-7000.inc1.devtunnels.ms");
}


const endpoints = ref({
  login: '/admin/login',
  getSignupOTP: '/auth/signup',
  verifyOTP: '/auth/email/verify',
  register: '/auth/user/complete-signup',
  sendForgotOTP: '/auth/email/resend-otp',
  verifyForgotOTP: '/auth/verify-otp',
  forgot: '/auth/reset-password',
  logout: '/user/logout',
  profile: '/user/profile',
  subscribe: '/user/subscriptions',
  kyc: '/user/kyc',
  brokers: '/admin/brokers',
  broker_funds: '/user/brokers/funds',
  orders: '/user/orders',
  positions: '/user/positions',
  alerts: '/user/matrix/alerts',
  notifications: '/user/notifications',
  plans: '/user/products',
  positionsPaper: '/user/matrix/paper-positions',
  videos: '/user/videos',
  errors: '/user/matrix/errors',
  strategies: '/user/strategies',
  joiners: '/user/strategy-joiners',
  watchlist: '/user/watchlists',
  watchlistJoiners: '/user/watchlist-joiners',
  changePassword: '/user/change-password',
  mystrategies: '/user/strategies/subscriptions',
  generateToken: '/user/generate-token',
  getBrokerOrders: '/user/broker/getorders',
  indicators: '/user/indicators',
  coupons: '/user/apply-offer',
  getFunds: '/user/brokers/funds',
  updateUser: '/user/profile-update',
  changePassword: '/user/changepassword',
  invoice: '/user/invoices',
  invoiceSummary: '/user/invoices/view',
  invoiceDownload: '/user/invoices/download',
  invoiceItems: '/user/invoice/item',
  getOfferByPromo: '/user/get-offer',
  strategy_details: '/user/matrix/strategy-details',
  strategy_info: '/user/matrix/strategy-info',
  social: '/user/social/api',
  brokerOrder: '/user/broker-order/sqoff',
  searchInstruments: '/user/searchinstruments',
  getBrokerProfile: '/user/brokers/profile',
  getBrokerHoldings: '/user/brokers/holdings',
  reconcileManualOrders: '/user/groups/orders/reconcile',
  strategyType: '/user/matrix/strategytypes',
  verifyPayment: '/user/check-payment/status',
  users : '/admin/users',
  strategies : '/admin/strategies',
  subscription: '/admin/strategy-subscriptions',
  
})



const getApiUrl = (endpoint) => {
  return `${baseUrl.value}${endpoints.value[endpoint]}`;
};

const state = reactive({});

// Function to create the state properties for an endpoint
function createStateForEndpoint(endpoint) {
  if (!state[endpoint]) {
    state[endpoint] = {
      loading: true,
      data: null,
      error: {},
      updating: false
    }
  } else {
    state[endpoint].updating = true
  };
}

const abortControllers = {};
let abortMessage = []

const makeApiRequest = async (config, wait, endpoint, id) => {
  // Cancel the previous request for the same endpoint if it's still ongoing
  if (abortControllers[endpoint]) {
    abortControllers[endpoint].abort();
  }

  // Create a new AbortController instance for this request
  abortControllers[endpoint] = new AbortController();
  config.signal = abortControllers[endpoint].signal; // Attach the signal to the config

  if (isAuthenticated.value) {
    config.headers = {
      ...config.headers,
      Authorization: token.value,
    };
  } else if (endpoint != "login" && endpoint != "register" && endpoint != "verifyOTP" && endpoint !== 'getSignupOTP') {
    router.push("/login");
  }
  await sleep(wait)
  try {

    const response = await axios(config);

    state[endpoint].error = null;
    if (response.status === 200 && (endpoint === 'strategy_info' || endpoint === 'strategy_details' || endpoint === 'getBrokerOrders' || endpoint === 'getFunds' || endpoint === 'getBrokerProfile' || endpoint === 'getBrokerHoldings' || endpoint === 'login' || endpoint === 'webhookAlerts' || (config.method === 'GET' && (!id || endpoint === 'webhookStrategyJoiners')))) {
      return response.data;
    } else {

      ManageApiResponse(response, endpoint, config.method);
      return response.data
    }
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'CanceledError') {
      abortMessage.push({
        endpoint: endpoint,
        message: 'abort'
      })
      // console.log(`Request to endpoint '${endpoint}' was canceled`);
      return 'abort'; // Return an string to handle the 'abort' case
    }

    if (error.message == "Network Error") {
      state[endpoint].error = { ...error, statusText: error.message }
    } else if (error.response.status == 401) {
      localStorage.setItem('token', "")
      localStorage.setItem('role', "");
      state[endpoint].error = error.response;

      if (endpoint !== 'login' && endpoint !== 'register' && endpoint !== 'verifyOTP' && endpoint !== 'getSignupOTP' && endpoint !== 'sendForgotOTP' && endpoint !== 'verifyForgotOTP' && endpoint !== 'forgot') {
        smoothReload()
      }

    } else {
      state[endpoint].error = error.response;
    }
    if (endpoint === 'verifyPayment' && error.response.status === 500) {
      throw error.response
    }

    if (error.response.status !== 401 && error.response.status !== 503 && ((endpoint !== 'login' && endpoint !== 'register' && endpoint !== 'verifyOTP' && endpoint !== 'getSignupOTP' && endpoint !== 'sendForgotOTP' && endpoint !== 'verifyForgotOTP' && endpoint !== 'forgot' && endpoint !== 'positionsPaper' && endpoint !== 'notifications' && endpoint !== 'plans' && endpoint !== 'orders') || (endpoint === 'generateToken' && endpoint === 'subscribe'))) {
      ManageApiResponse(error.response, endpoint, config.method, true);
    }
    state[endpoint].loading = false;

    return "";
  } finally {
    let endpointData = abortMessage.find(item => item.endpoint === endpoint)
    if (endpointData && endpointData.message === 'abort') {
      abortMessage = abortMessage.filter(item => item.endpoint !== endpoint)
    } else {
      state[endpoint].loading = false;
      state[endpoint].updating = false;
    }
    // Cleanup: Remove the controller after request completion
    delete abortControllers[endpoint];
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const makeRequest = async (endpoint, method, data = {}, config = {}, params = {}, wait = 0, id = null, subendpoint = '') => {

  let url = getApiUrl(endpoint);
  if (subendpoint != '') {
    url = `${url}/${subendpoint}`
  }
  if (((method === 'DELETE' || method === 'PUT' || method === 'POST') && id != null) || (method === 'GET' && id != null)) {
    url = `${url}/${id}`
  }

  // to download pdf 
  if (endpoint === 'invoiceDownload') {
    config.responseType = "blob"
  }

  createStateForEndpoint(endpoint);
  if (method === 'GET') {

    if (userRole.value !== 'demo' || endpoint === 'profile' || endpoint === 'plans' || endpoint === 'indicators' || endpoint === 'strategy_details' || endpoint === 'strategy_info' || endpoint === 'verifyPayment' || endpoint === 'invoice' || endpoint === 'invoiceItems' || endpoint === 'getOfferByPromo' || endpoint === 'subscription' || endpoint === 'subscriptions') {

      // add check for paper
      if (userRole.value.toLowerCase() === 'paper' && (endpoint === 'positions' || endpoint === 'webhookPositions' || endpoint === 'orders' || endpoint === 'webhookOrders')) {
        state[endpoint].loading = false;
        state[endpoint].updating = false;
        return {}
      }

      const queryParams = new URLSearchParams(params);
      const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
      let response = await makeApiRequest({ ...config, method: 'GET', url: fullUrl }, wait, endpoint, id);
      return response
    } else {
      state[endpoint].loading = false;
      state[endpoint].updating = false;
      return []
    }
  } else if (method === 'POST') {
    let response = await makeApiRequest({ ...config, method: 'POST', url, data }, wait, endpoint, id);
    return response
  } else if (method === 'PUT') {
    let response = await makeApiRequest({ ...config, method: 'PUT', url, data }, wait, endpoint, id);
    return response
  } else if (method === 'DELETE') {
    let response = await makeApiRequest({ ...config, method: 'DELETE', url }, wait, endpoint, id);
    return response
  } else {
    throw new Error(`Invalid HTTP method: ${method}`);
  }

};

export { makeRequest, state, setTokenAndRole, getToken, userRole, setRole, getisAuthenticated, setisAuthenticated, logout };

