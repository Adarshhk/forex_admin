import { ref, provide, computed, watch } from 'vue';
import { getToken } from '@/requests/requests';
import { defineStore, storeToRefs } from 'pinia';
import MatrixTicker from "@/MatrixTicker";
import { ManageWebsocketResponse } from '@/requests/manageResponse';
import { useTelegramStore } from '../telegram';

export const useTickerStore = defineStore('tickers', () => {
  let ticker = null; // Instance of MatrixTicker
  const telegramStore = useTelegramStore();
  const { messages , premium_message , isPremium} = storeToRefs(telegramStore)
  let wsStatus = false;
  const lastPrices = ref({});
  const tickerList = ref([]);
  const profits = ref({});
  const candleData = ref({});
  const token = computed(() => getToken());
  const userId = ref('');

  const channel = new BroadcastChannel('my-channel');
  channel.addEventListener('message', (event) => {
    const message = event.data;
    if (message.type === 'logout') {
      stopWebSocket();
    }
  });

  function updateTickerList(data) {
    let newSymbols = [];

    for (let i = 0; i < data.length; i++) {
      if (!tickerList.value.includes(data[i])) {
        tickerList.value.push(data[i]);
        newSymbols.push(data[i]); // Store new symbols to subscribe later
      }
    }

    if (token.value && ticker !== null && newSymbols.length > 0) {
      subscribe(userId.value, newSymbols);
    }
  }



  const onTicks = (ticks) => {

    const tick = ticks;
    try {
      ManageWebsocketResponse(tick);
    } catch (error) {
      console.error("Error processing tick data:", error);
    }
    if (tick['price']) {
      updateLastPrice(tick);

    }

  };

  const startWebSocket = (user_id) => {
    if (!wsStatus) {
      console.log("Starting Socket.IO connection");
      ticker = new MatrixTicker({
        token: user_id,
        reconnect: true,
      });

      userId.value = user_id

      ticker.on("connect", () => {
        console.log("Socket connected");
      });

      subscribe(user_id)
      ticker.on('price_update' , (data) => onTicks(data));

      ticker.on('telegram_message' , (data) => {messages.value.push(data)});
      ticker.on('premium_telegram_message' , (data) => {
        if(isPremium.value)
        {
          premium_message.value.push(data);
        }
      })

      ticker.on("disconnect", () => {
        console.log("Socket disconnected");
        wsStatus = false;
      });

      
      wsStatus = true;
    }
  };

  const stopWebSocket = () => {
    if (ticker !== null) {
      ticker.disconnect();
      ticker = null;
      wsStatus = false;
    }
  };


  const subscribe = (id, symbols = tickerList.value) => {
    
    if (token.value && ticker && symbols.length > 0) {
      ticker.subscribe(symbols, id);
    }
  };

  const unsubscribe = (symbols) => {
    if (token.value && ticker) {
      ticker.unsubscribe(symbols, userId.value);
    }

  }

  function updateLastPrice(data) {
    const symbol = data['symbol'];
    
    lastPrices.value[symbol] = { ask: data['price']['ask'], bid: data['price']['bid'] };
    return lastPrices.value;

  }

  const getProfit = () => {

    return profits.value['total_profit'];
  }
  function getLastPrice(symbol) {
    return lastPrices.value[symbol] || undefined;
  }

  provide('lastPriceStore', {
    updateLastPrice,
    getProfit,
    getLastPrice,
    startWebSocket,
    stopWebSocket
  });

  return {
    unsubscribe,
    subscribe,
    getProfit,
    updateLastPrice,
    getLastPrice,
    startWebSocket,
    stopWebSocket,
    updateTickerList,
    lastPrices,
    tickerList,
    candleData
  };
});

