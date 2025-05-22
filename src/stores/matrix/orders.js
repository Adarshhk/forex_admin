import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useTickerStore } from './ticker/ticker';
import { useStrategiesStore } from "@/stores/matrix/strategies";
import { storeToRefs } from "pinia";
import { makeRequest, state } from "../../requests/requests";

export const useOrderStore = defineStore('orders', () => {
  const strategiesStore = useStrategiesStore();
  let { strategies } = storeToRefs(strategiesStore);

  const endpoint = 'orders';
  const wait = 0;
  const orders = ref([]);
  const tickerStore = useTickerStore();
  const searchInputText = ref('');
  const pageSizeOption = ref('');
  const selectPageOptions = ref([10, 20, 30, 40, 500]);
  const currentPageNumber = ref(1);
  const totalPages = ref(0);
  const showStartRecords = ref(0);
  const showEndRecords = ref(0);
  const totalRecords = ref(0);
  let showSqOffModal = ref(false);
  const idForSqOff = ref(null);
  const strategiesOrders = ref([]);
  pageSizeOption.value = selectPageOptions.value[0];
  const showTradeModal = ref(false);
  const tradeMode = ref('buy');
  const scriptToTrade = ref('');
  const strategyFilterValues = ref([]);
  const brokerFilterValues = ref([]);
  const userOrders = ref([]);
  const strategyOrders = ref([]);
  const brokerOrders = ref([]);

  const previousOrders = ref(0);
  const todayOrders = ref(0);

  watch(strategies, () => {
    strategiesOrders.value = groupOrdersByStrategyId(
      orders.value,
      strategies.value
    );
  });

  const totalOrders = computed(() => {
    return orders.value.length;
  });

  async function getOrders(refresh = false) {
    if (refresh) {
      state[endpoint] = {
        loading: true,
        data: null,
        error: {},
        updating: false
      };
    }
    try {
      const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait);
      if (response === 'abort') return

      if (response.data) {
        orders.value = response.data || []
        strategiesOrders.value = groupOrdersByStrategyId(
          orders.value,
          strategies.value
        );
        previousOrders.value = response.data?.yesterday_count || 0;
        todayOrders.value = orders.value.length;
        strategyFilterValues.value = getUniqueStrategies(orders.value);
        brokerFilterValues.value = getUniqueBrokers(orders.value);
      } else {
        orders.value = [];
        todayOrders.value = 0;
        previousOrders.value = 0;
      }

      let tokensList = [];
      for (let i = 0; i < orders.value.length; i++) {
        tokensList.push(orders.value[i].symbol);
      }
      tickerStore.updateTickerList(tokensList);

    } catch (error) {
      orders.value = []
      strategiesOrders.value = groupOrdersByStrategyId(
        orders.value,
        strategies.value
      );
      console.error('Error fetching orders:', error);
      throw error;
    } finally {
      totalRecords.value = orders.value.length
    }
  }


  function getUniqueStrategies(orders) {
    const uniqueMap = new Map();

    orders.forEach(order => {
      if (order.strategy_id && order.strategy_name && !uniqueMap.has(order.strategy_id)) {
        uniqueMap.set(order.strategy_id, {
          strategy_id: order.strategy_id,
          strategy_name: order.strategy_name
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  function getUniqueBrokers(orders) {
    const uniqueMap = new Map();

    orders.forEach(order => {
      if (order.broker_id && order.broker_name && !uniqueMap.has(order.broker_id)) {
        uniqueMap.set(order.broker_id, {
          broker_id: order.broker_id,
          broker_name: order.broker_name
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  function groupOrdersByStrategyId(orders, strategies) {
    const groupedOrders = {};
    if (orders.length && strategies.length) {
      orders.forEach((order) => {
        const { strategy_id } = order;
        const strategy = strategies.find((s) => s.id === strategy_id) || {};
        if (!groupedOrders[strategy_id]) {
          // let color = strategy?.color.replace(/,[\s\d.]+[)]$/, ", 0.8)") || strategy.color;
          groupedOrders[strategy_id] = {
            color: strategy?.color,
            color2: strategy.color2,
            name: strategy.name,
            image_url: strategy.image_url,
            script: strategy.script,
            orders: [],
          };
        }

        groupedOrders[strategy_id].orders.push(order);
      });
    }
    return groupedOrders;
  }

  const deleteOrder = async (orderId) => {
    try {
      const res = await makeRequest(endpoint, 'DELETE', {}, {}, {}, 0, orderId);
      
    } catch (error) {
      console.log(error, 'Error in  order store.')
    }
  }

  const getOrderByuserId = async (userId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, userId, 'users');
      if (res.data) {
        userOrders.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in  order store.')
    }
  }

    const getOrderByStrategyId = async (strategyId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, strategyId, 'strategy');
      if (res.data) {
        strategyOrders.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in  order store.')
    }
  }
    const getOrderByBrokerId = async (brokerId) => {
      
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, brokerId, 'broker');
      if (res.data) {
        brokerOrders.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in  order store.')
    }
  }

  function filterOrders(query) {
    if (!query) {
      return orders.value;
    } else {
      return orders.value.filter(order => order.symbol.toLowerCase().includes(query.toLowerCase()));
    }
  }

  getOrders();

  return {
    getOrders,
    getOrderByuserId,
    deleteOrder,
    getOrderByBrokerId,
    brokerOrders,
    userOrders,
    orders,
    getOrderByStrategyId,
    strategyOrders,
    filterOrders, strategyFilterValues, brokerFilterValues,
    showTradeModal,
    state,
    endpoint,
    totalOrders,
    searchInputText,
    pageSizeOption,
    selectPageOptions,
    currentPageNumber,
    totalPages,
    showStartRecords,
    showEndRecords,
    totalRecords,
    showSqOffModal,
    idForSqOff,
    strategiesOrders,
    scriptToTrade,
    tradeMode,
    todayOrders,
    previousOrders
  };
});
