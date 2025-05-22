import { getActivePinia, setActivePinia, createPinia } from 'pinia';

let pinia = getActivePinia();
if (!pinia) {
  pinia = createPinia();
  setActivePinia(pinia);
}

import { ref } from 'vue';
import { computed } from 'vue';
import { useProfileStore } from '@/stores/matrix/profile';
import { useMyStrategiesStore } from '@/stores/matrix/myStrategies.js';
import { useBrokerIndexStore } from '@/stores/matrix/brokers';
import { useInvoiceStore } from '@/stores/matrix/invoice';
import { useNotificationsStore } from '@/stores/matrix/notifications';
import { useOrderStore } from '@/stores/matrix/orders';
import { usePaperPositionsStore } from '@/stores/matrix/paperPositions';
import { usePositionsStore } from '@/stores/matrix/positions';
import { useSocialStore } from '@/stores/matrix/social';
import { useStrategiesStore } from '../stores/matrix/strategies.js';
import { useVideosStore } from '@/stores/matrix/videos';
import { useSubscriptionStore } from '../stores/matrix/subscription.js';

import { makeRequest } from "@/requests/requests";
import { useToastStore } from "@/stores/utils/toast";
import { useWatchlistStore } from '@/stores/matrix/watchlist.js';
import { useJoinerStore } from '@/stores/matrix/joiners.js';
import { useWatchlistJoinerStore } from '@/stores/matrix/watchlistjoiner.js';
import { useUserStore } from '@/stores/matrix/users.js';

const statusMessages = {
  200: 'Success: ',
  201: 'Success: ',
  400: 'Bad Request: ',
  401: 'Unauthorized: ',
  403: 'Forbidden: ',
  404: 'Not Found: ',
  500: 'Internal Server Error: ',
  502: 'Bad Gateway: ',
  503: 'Service Unavailable: ',
  504: 'Gateway Timeout: ',
};

const getMethods = ref({
  brokers: 'getBrokers',
  invoice: 'getInvoices',
  mystrategies: 'getMyStrategies',
  orders: 'getOrders',
  positionsPaper: 'getPaperPositions',
  positions: 'getPositions',
  updateUser: 'getUserInfo',
  social: 'getSocialInfo',
  plans: 'getStrategies',
  videos: 'getVideos',
  notifications: 'updateNotifications',
  subscription: 'getSubscriptionInfo',
  watchlist : 'getWatchlists',
  watchlistJoiners : 'getWatchlistJoiners',
  joiners : 'getJoiners',
  users : 'getUsers'
});

function showToast(toastTitle, message, toastType, duration=3000) {
  const toastStore = useToastStore();
  toastStore.addToast(toastTitle, message, toastType, duration);
}

let storeFunctions = {}

// to igonre stores Cannot access before initialization
setTimeout(() => {
  storeFunctions = {
    brokers: useBrokerIndexStore,
    invoice: useInvoiceStore,
    mystrategies: useMyStrategiesStore,
    notifications: useNotificationsStore,
    orders: useOrderStore,
    positionsPaper: usePaperPositionsStore,
    positions: usePositionsStore,
    updateUser: useProfileStore,
    social: useSocialStore,
    plans: useStrategiesStore,
    videos: useVideosStore,
    subscription: useSubscriptionStore,
    watchlist : useWatchlistStore,
    watchlistJoiners : useWatchlistJoinerStore,
    joiners : useJoinerStore,
    users : useUserStore,
  };
}, 100);

function playAudio(sound) {
  // const audioSource = `./src/assets/sounds/${sound}.mp3`;
  // const audio = new Audio(audioSource);
  // audio.play();
}

function ManageApiResponse(response, endpoint, method, isError=false) {
  let toastTitle = '', toastType = '';
  if (response) {
    try {
      if (endpoint !== 'profile' && endpoint !== "videos" && endpoint !== "logout" && endpoint !== "broker_funds") {
        let message = response.data.message || 'Unknown status code';
        toastTitle = statusMessages[response.status];
        toastType = response.status >= 200 && response.status < 300 ? 'success' : 'error';

        if (response.status === 404 && response.data === '404 page not found') {
          message = 'Internal Server Error: Something went wrong';
          toastTitle = 'Error:';
        }

        // If the request is for downloading invoice, trigger file download
        if (endpoint === "invoiceDownload" && response.status === 200) {
          let filename = "invoice.pdf"; // Default fallback
          const contentDisposition = response.headers["content-disposition"];
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) {
              filename = match[1];
            }
          }
          downloadPDF(response, filename);
          return 
        } else if (endpoint === "invoiceSummary" && response.status === 200) {
          return 
        }

        if (endpoint === 'mystrategies' && response.data.data) {
          // console.log("print data of ", endpoint, ": ", response.data.data);
          const brokerStore = useBrokerIndexStore();
          const broker = brokerStore.findBrokerById(response.data.data.broker_id) || {};
          const strategisStore = useStrategiesStore();
          const strategy = strategisStore.findStrategyById(response.data.data.strategy_id) || {};
          if (method === 'DELETE') {
            message = broker.broker_userid + ' Deleted ' + strategy.name + ' (' + strategy.script + ')' + ' Successfully';
            toastTitle = 'Success:'
          } else if (method === 'PUT') {
            message = broker.broker_userid + ' Updated ' + strategy.name + ' (' + strategy.script + ')' + ' Successfully';
            toastTitle = 'Success:'
          }
        }

        if (endpoint === 'social') {
          toastType = 'warn';
        }
        let duration = endpoint === 'register' || endpoint === 'forgot' || endpoint === 'verifyOTP' || endpoint === 'subscriptions' ? 6000 : 3000;
        showToast(toastTitle, message, toastType, duration);

        if (endpoint === 'generateToken') {
          endpoint = 'brokers';
        } else if(endpoint==='kyc') {
          endpoint = 'profile';
        }

        if (!isError && ((response.status >= 200 && response.status < 300) || (endpoint === 'brokers') || (endpoint === 'social' && method !== 'GET')) && response.status !== 500 && response.status !== 404 && endpoint !== 'changePassword' && endpoint !== 'register' && endpoint !== 'getSignupOTP' && endpoint !== 'forgot' && endpoint !== 'verifyOTP' && endpoint !== 'getBrokerOrders' && endpoint !== 'getFunds' && endpoint !== 'brokerOrder' && endpoint !== 'subscribe') {
          if (endpoint == 'positions') {
            const storeFunctionMyPOS = storeFunctions['mystrategies'];
            if (typeof storeFunctionMyPOS === 'function') {
              storeFunctionMyPOS()[getMethods.value['mystrategies']]();
            } else {
              console.error('not found for endpoint mystrategies:');
            }
          }

          if (endpoint === 'manualPlaceOrder' || endpoint === 'manualCancelOrder' || endpoint === 'manualModifyOrder' || endpoint === 'masterModifyOrder' || endpoint === 'masterCancelOrder') {
            const storeFunctionGrpOrders = storeFunctions['manualOrders'];
            storeFunctionGrpOrders()[getMethods.value['reconcileManualOrders']]();

            if (endpoint === 'manualPlaceOrder' || endpoint === 'masterModifyOrder' || endpoint === 'masterCancelOrder') {
              const storeFunctionMsterOrders = storeFunctions['masterOrders'];
              storeFunctionMsterOrders()[getMethods.value['masterOrders']]();
            }
            endpoint = 'manualOrders';
          }

          const storeFunction = storeFunctions[endpoint];
          if (typeof storeFunction === 'function') {
            storeFunction()[getMethods.value[endpoint]]();

          } else {
            console.error('not found for endpoint:', endpoint);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

function downloadPDF(response, filename) {
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename; // Set the filename
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

async function ManageWebsocketResponse(response) {
  if (response.type) {
    try {
      const excludedTypes = [ "brokers", "webhookStrategies", "webhookStrategyJoiners", "updateUser", "mystrategies", "invoice", "strategies", "social", "videos"];

      if (!excludedTypes.includes(response.type) && response.data) {
        if (response.type === 'brokerOrder') {
          const brokersStore = storeFunctions.brokers();
          let ordResponse = await makeRequest("getBrokerOrders", "GET", {}, {}, {}, 0, response.data.id);

          if (ordResponse.data.order) {
            brokersStore.brokerOrders = ordResponse.data.order.data;
          } else {
            brokersStore.brokerOrders = [];
          }

          if (ordResponse.data.position) {
            brokersStore.brokerPositions = ordResponse.data.position.data;
          } else {
            brokersStore.brokerPositions = [];
          }
        } else if(response.type !=='users' && response.type !== 'kyc' && response.type !== 'product' && response.type !== 'indicator') {
          let formattedTime = '';
          if (response.method === 'POST') {
            formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(response.data.created_at));
          } else if (response.method === 'PUT') {
            formattedTime = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(response.data.data.updated_at));
          }
          let side = '';
          if (response.type === 'orders' || response.type === 'webhookOrders') {
            side = response.data.data.transaction_type;
            try {
              playAudio('order');
            } catch {
              console.error('Error playing audio:', error);
            }
          } else if (response.type === 'positions' || response.type === 'webhookPositions') {
            side = response.data.data.side;
            try {
              playAudio('order');
            } catch {
              console.error('Error playing audio:', error);
            }
          }

          let strategyId = '';
          if (response.type === 'webhookOrders' || response.type === 'webhookPositions') {
            strategyId = response.data.data.webhook_strategy_id;
          } else {
            strategyId = response.data.data.strategy_id;
          }

          const notificationsStore = storeFunctions.notifications();
          notificationsStore.notificationsData.push({
            id: response.data.id,
            strategy_id: strategyId,
            status: response.data.data.status,
            heading: response.type,
            exchange: response.data.data.exchange,
            tradingsymbol: response.data.data.tradingsymbol,
            side: side,
            time: formattedTime,
            message: response.data.description
          });
        }

        let message = response.data.description;
        if(response.type !== 'product' && response.type !== 'indicator') {
          showToast('Success: ', message, "success");
        }
        
      }

      if (response.type !== 'brokerOrder' && response.type !== 'users' && response.type !== 'kyc' && response.type !== 'product' && response.type !== 'indicator')  {
        // for remaining types 
        const storeFunction = storeFunctions[response.type];
        if (typeof storeFunction === 'function') {
          if (response.type === 'positions') {
            const storeFunctiontemp = storeFunctions['mystrategies'];
            storeFunctiontemp()[getMethods.value['mystrategies']]();
          } else if (response.type === 'orders') {
            const storeFunctiontempPapPo = storeFunctions['positionsPaper'];
            storeFunctiontempPapPo()[getMethods.value['positionsPaper']]();
          }

          // call stores for remaining types
          storeFunction()[getMethods.value[response.type]]();
        } else {
          console.error('Store function not found for response.type:', response.type);
        }
      } else if (response.type === 'users') {
        refreshAllMainStores();
      } else if(response.type === 'kyc'){
        const profileStore = storeFunctions['updateUser'];
        profileStore()[getMethods.value['updateUser']]();
      } else if (response.type === 'product') {
        const planProductStore = storeFunctions['plans'];
        planProductStore()[getMethods.value['plans']]();
      } else if (response.type === 'indicator') {
        const planProductStore = storeFunctions['plans'];
        planProductStore()[getMethods.value['plans']]();
      }
    } catch (error) {
      console.error('Error in websocket manage:', error);
      throw error;
    }
  }
}


const refreshAlgoStores = () => {
  const myStgStore = storeFunctions['mystrategies'];
  myStgStore()[getMethods.value['mystrategies']]();    

  const planProductStore = storeFunctions['plans'];
  planProductStore()[getMethods.value['plans']]();

  const ppositionStore = storeFunctions['positionsPaper'];
  ppositionStore()[getMethods.value['positionsPaper']]();

  const orderStore = storeFunctions['orders'];
  orderStore()[getMethods.value['orders']]();

  const posStore = storeFunctions['positions'];
  posStore()[getMethods.value['positions']]();

};


async function refreshAllMainStores() {
  const profileStore = storeFunctions['updateUser'];
  await profileStore().getUserInfo()

  const subscriptionStore = storeFunctions['subscription'];
  await subscriptionStore().getSubscriptionInfo()

  await new Promise(resolve => setTimeout(resolve, 2000));

  refreshAlgoStores()
}


export { ManageApiResponse, ManageWebsocketResponse, refreshAlgoStores };
