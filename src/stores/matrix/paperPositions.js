
import { ref,watch,watchEffect } from 'vue';
import { defineStore ,storeToRefs} from 'pinia';

import { makeRequest,state,userRole } from "@/requests/requests";
import {useTickerStore} from './ticker/ticker'
import { useStrategiesStore } from "@/stores/matrix/strategies";


export const usePaperPositionsStore = defineStore('paper_positions', () => {
  const strategiesStore = useStrategiesStore();
let { strategies } = storeToRefs(strategiesStore);
const tickerStore = useTickerStore();
  const endpoint='positionsPaper'
  const wait=0
  const highlightedRow = ref(-1)
  const paperPositions = ref([]);
  const mainPaperPositions = ref([]);
  const totalRecords = ref(0)


  watchEffect(() => {
    paperPositions.value = computeStrategiesPositions();
  });
  async function getPaperPositions(refresh=false) {
    if(refresh){
      state[endpoint]={
        loading: true,
        data: null,
        error: {},
        updating:false
      }
    }
    try {
      
      const response = await makeRequest(endpoint, "GET",{}, {}, {},wait);
      if(response === 'abort') return
            
      if (response.data){
        let papPosData=response.data || []
        
        mainPaperPositions.value=papPosData
        paperPositions.value=papPosData
        
        
        // console.log("modifiedPaperPositions", modifiedPaperPositions);
        // mainPaperPositions.value=paperPositions.value
        let tokensList=[]
        if(paperPositions.value && paperPositions.value.length){
          for(let i=0;i<paperPositions.value.length;i++){
            tokensList.push(paperPositions.value[i].symbol)
          }
          tickerStore.updateTickerList(tokensList)
        }

        // paperPositions.value = computeStrategiesPositions();
      }else{
        paperPositions.value=[]
        mainPaperPositions.value=[]
      }
    } catch (error) {
      paperPositions.value=[]
      mainPaperPositions.value=[]
      console.error('Error fetching paperPositions:', error);
      throw error;
    } finally {
      totalRecords.value = mainPaperPositions.value.length
    }
  }

  function computeStrategiesPositions() {
    
    if (Object.keys(mainPaperPositions.value).length && strategies.value.length) {

      let data = groupPositionsByStrategyId(
        mainPaperPositions.value,
        strategies.value
      );
      const chartDataArray = [];
      for (const id in data) {
        chartDataArray.push({
          label: data[id].name,
          value: data[id].pnl,
        });
      }

      return data; // Assuming the intention was to return 'data'. If you intended to return 'chartDataArray', adjust accordingly.
    } else {
      return [];
    }
  }
  
  
    function groupPositionsByStrategyId(positions, strategies) {
      const groupedPositions = {};
    
      positions.forEach((position) => {
        
        const { strategy_id } = position;
        const strategy = strategies.find((s) => s.id === strategy_id);

        position.last_price = updatePaperPositionLastPrice(position);

        // let pnl =
        //   position.status === "CLOSED"
        //     ? (position.sell_price - position.buy_price) * position.quantity
        //     : position.status === "OPEN"
        //     ? position.side === "BUY"
        //       ? (position.last_price - position.buy_price) * position.quantity
        //       : (position.sell_price - position.last_price) * position.quantity
        //     : 0;
        
        let pnl = 0
        let pnlPercentage = 0
        let first_price = 0
        if(position.status === "OPEN") {
          if (position.side === 'BUY') {
            if(position.buy_price && position.last_price){
              pnl = (position.last_price - position.buy_price) * position.quantity;
              pnlPercentage = ((position.last_price - position.buy_price) / position.buy_price) * 100
              first_price = position.buy_price
            }
          } else if (position.side === 'SELL') {
            if(position.sell_price && position.last_price){
              pnl = (position.sell_price - position.last_price) * position.quantity;
              pnlPercentage = ((position.sell_price - position.last_price) / position.sell_price) * 100
              first_price = position.last_price
            }
          } 
        } else if (position.status === "CLOSED" ) {
          if(position.sell_price && position.buy_price){
            pnl = (position.sell_price - position.buy_price) * position.quantity
            pnlPercentage = ((position.sell_price - position.buy_price) / position.buy_price) * 100
            first_price = position.buy_price
          }
        }
        
            
        if (!groupedPositions[strategy_id]) {
          let color = strategy.color.replace(/,[\s\d.]+[)]$/, ", 0.8)");
          groupedPositions[strategy_id] = {
            id: strategy_id,
            color: color,
            color2: strategy.color2,
            pnl: pnl,
            name: strategy.name,
            image_url: strategy.image_url,
            script: strategy.script,
            strategy_type_name: strategy.strategy_type_name,
            risk: strategy.risk,
            positions: [],
          };
        } else {
          groupedPositions[strategy_id].pnl += pnl;
        }
        
        position.pnl = pnl
        position.pnlPercentage = pnlPercentage
        position.first_price = first_price
        groupedPositions[strategy_id].positions.push(position);
      });
    
      return groupedPositions;
    }
    
  
    // Other store actions and properties here...
    function updatePaperPositionLastPrice(data) {
      
          const newTick = tickerStore.getLastPrice(data.symbol);
          return newTick || data.last_price;  
    };
    
  // Other store actions and properties here...
  // function updatePaperPositionLastPrice (data) {
  //   paperPositions.value.forEach((position) => {
  //     if (position.symbol === data.symbol) {
  //       position.last_price = data.last_price;
  //     }
  //   });
  //   return
  // };

  getPaperPositions()
  return {
    getPaperPositions,
    paperPositions,
    mainPaperPositions,
    highlightedRow,
    endpoint,
    updatePaperPositionLastPrice,
    state,
    totalRecords
  };
});
