import { ref, watch, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest, state } from "@/requests/requests";
import { useTickerStore } from './ticker/ticker'
import { useStrategiesStore } from "@/stores/matrix/strategies";
import { storeToRefs } from "pinia";
import { useManualPositionStore } from './manualposition';



export const usePositionsStore = defineStore('positions', () => {
  const tickerStore = useTickerStore();
  const strategiesStore = useStrategiesStore();
  const manaulPositionsStore = useManualPositionStore();
  let { strategies } = storeToRefs(strategiesStore);
  const endpoint = 'positions'
  const wait = 0
  const isTabActive = ref('Live')
  const highlightedRow = ref(-1)
  const strategiesPositions = ref([]);
  const positions = ref([]);
  const mainPositions = ref([]);
  const uniqueKey = ref('');
  const searchInputText = ref('');
  const pageSizeOption = ref('');
  const selectPageOptions = ref([10, 20, 30, 40, 500]);
  const currentPageNumber = ref(1);
  const totalPages = ref(0);
  const showStartRecords = ref(0);
  const showEndRecords = ref(0);
  const totalRecords = ref(0);
  let showSqOffModal = ref(false);
  const showSqOffAllModal = ref(false)
  const selectedPositions = ref([]);

  const strategyFilterValue = ref([]);
  const brokerFilterValue = ref([]);
  let dataForSqOff = ref(null);
  const totalPnlClass = ref('');
  const userPositions = ref([]);
  const brokerPositions = ref([]);  

  const strategyPositions = ref([]);
  // watch(strategies, () => {
  //   strategiesPositions.value = computeStrategiesPositions();
  // })

  // watchEffect(() => {
  //   console.log("print positions value", positions.value);
  // })
  watchEffect(() => {
    strategiesPositions.value = computeStrategiesPositions();
  });

  pageSizeOption.value = selectPageOptions.value[0]

  const localuniquekey = localStorage.getItem('p-uniqueKey')
  if (localuniquekey) {
    uniqueKey.value = localuniquekey
  }

  async function getPositions(refresh = false) {
    if (refresh) {
      state[endpoint] = {
        loading: true,
        data: null,
        error: {},
        updating: false
      }
    }
    try {
      const response = await makeRequest(endpoint, "GET", {}, {}, {}, wait)
      if (response === 'abort') return

      if (response.data) {

        positions.value = response.data || []
        mainPositions.value = positions.value
        let tokensList = []
        for (let i = 0; i < positions.value.length; i++) {
          tokensList.push(positions.value[i].symbol)
        }
        tickerStore.updateTickerList(tokensList)
        strategiesPositions.value = computeStrategiesPositions();
        strategyFilterValue.value = getUniqueStrategies(positions.value);
        brokerFilterValue.value = getUniqueBrokers(positions.value);
      } else {
        positions.value = []
        mainPositions.value = []
        strategiesPositions.value = [];
      }

    } catch (error) {
      positions.value = []
      mainPositions.value = []
      strategiesPositions.value = [];
      throw error;
    } finally {
      totalRecords.value = positions.value.length
    }
  }
  // Define the function separately
  function computeStrategiesPositions() {
    if (Object.keys(mainPositions.value).length && strategies.value.length) {
      let data = groupPositionsByStrategyId(
        mainPositions.value,
        strategies.value
      );
      const chartDataArray = [];
      for (const id in data) {
        chartDataArray.push({
          label: data[id].name,
          value: data[id].pnl,
        });
      }

      return data;
    } else {
      return [];
    }
  }
  function getUniqueStrategies(positions) {
    const uniqueMap = new Map();

    positions.forEach(pos => {
      if (pos.strategy_id && pos.strategy_name && !uniqueMap.has(pos.strategy_id)) {
        uniqueMap.set(pos.strategy_id, {
          strategy_id: pos.strategy_id,
          strategy_name: pos.strategy_name
        });
      }
    });

    return Array.from(uniqueMap.values());
  }

  function getUniqueBrokers(positions) {
    const uniqueMap = new Map();

    positions.forEach(pos => {
      if (pos.broker_id && pos.broker_name && !uniqueMap.has(pos.broker_id)) {
        uniqueMap.set(pos.broker_id, {
          broker_id: pos.broker_id,
          broker_name: pos.broker_name
        });
      }
    });

    return Array.from(uniqueMap.values());
  }


  function groupPositionsByStrategyId(positions, strategies) {
    const groupedPositions = {};

    positions.forEach((position) => {
      const { strategy_id } = position;
      const strategy = strategies.find((s) => s.id === strategy_id) || {};

      position.last_price = updatePositionLastPrice(position);

      let pnl = 0;
      let pnlPercentage = 0;
      let first_price = 0;
      const normalizedStatus = position.status?.toUpperCase();

      if (normalizedStatus === "OPEN") {
        if (position.side === "BUY") {
          if (position.buy_price && position.last_price) {
            pnl = (position.last_price - position.buy_price) * position.quantity;
            pnlPercentage = ((position.last_price - position.buy_price) / position.buy_price) * 100;
            first_price = position.buy_price;
          }
        } else if (position.side === "SELL") {
          if (position.sell_price && position.last_price) {
            pnl = (position.sell_price - position.last_price) * position.quantity;
            pnlPercentage = ((position.sell_price - position.last_price) / position.sell_price) * 100;
            first_price = position.last_price;
          }
        }
      } else if (normalizedStatus === "CLOSED") {
        if (position.sell_price && position.buy_price) {
          pnl = (position.sell_price - position.buy_price) * position.quantity;
          pnlPercentage = ((position.sell_price - position.buy_price) / position.buy_price) * 100;
          first_price = position.buy_price;
        }
      }

      position.pnl = pnl;
      position.pnlPercentage = pnlPercentage;
      position.first_price = first_price;

      if (!groupedPositions[strategy_id]) {
        groupedPositions[strategy_id] = {
          id: strategy_id,
          color: strategy.color,
          color2: strategy.color2,
          pnl: pnl,
          name: strategy.name,
          image_url: strategy.image_url,
          script: strategy.script,
          strategy_type_name: strategy.strategy_type_name,
          risk: strategy.risk,
          quantity: position.quantity,
          status: normalizedStatus === "OPEN" ? "OPEN" : "CLOSED",
          positions: [position],
        };
      } else {
        groupedPositions[strategy_id].pnl += pnl;
        groupedPositions[strategy_id].quantity += position.quantity;

        // If any position is OPEN, make strategy status OPEN
        if (normalizedStatus === "OPEN") {
          groupedPositions[strategy_id].status = "OPEN";
        }

        groupedPositions[strategy_id].positions.push(position);
      }
    });

    return groupedPositions;
  }


  // Other store actions and properties here...
  function updatePositionLastPrice(data) {
    // positions.value.forEach((position) => {
    //   if (position.symbol === data.symbol) {
    const newTick = tickerStore.getLastPrice(data.symbol);

    return newTick || data.last_price;
    //   }
    // });

  };


  async function sqOffPosition() {
    try {
      await makeRequest(endpoint, "POST", dataForSqOff.value, {}, {}, 0, null);
      await manaulPositionsStore.getManualPosition()
      return "success"

    } catch (error) {
      console.error('Error sqoff  position:', error);
      throw error;
    }
  }

  const getPositionByUserId = async (userId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, userId, 'users');
      if (res.data) {
        userPositions.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in position store.')
    }
  }

  const getPositionByStrategyId = async (strategyId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, strategyId, 'strategy');
      if (res.data) {
        strategyPositions.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in position store.')
    }
  }

  const getPositionByBrokerId = async (brokerId) => {
    try {
      const res = await makeRequest(endpoint, 'GET', {}, {}, {}, 0, brokerId, 'broker');
      if (res.data) {
        brokerPositions.value = res.data;
      }
    } catch (error) {
      console.log(error, 'Error in position store.')
    }
  }



  getPositions()

  return {
    getPositions,
    strategyFilterValue,
    getPositionByBrokerId,
    brokerPositions,
    getPositionByUserId,
    getPositionByStrategyId,
    strategyPositions,
    userPositions,
    brokerFilterValue,
    mainPositions,
    sqOffPosition,
    uniqueKey,
    positions,
    updatePositionLastPrice,
    endpoint,
    state,
    searchInputText,
    pageSizeOption,
    selectPageOptions,
    currentPageNumber,
    totalPages,
    showStartRecords,
    showEndRecords,
    totalRecords,
    showSqOffModal,
    dataForSqOff,
    isTabActive,
    strategiesPositions,
    highlightedRow,
    showSqOffAllModal,
    selectedPositions,
    totalPnlClass

  };
});