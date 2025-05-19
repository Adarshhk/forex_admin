<template>
  <div ref="chartContainer" class="chart-container"></div>
  <!-- for extra tooltip -->
  <!-- <div ref="tooltip" class="chart-tooltip"></div> -->
</template>

<script>
import { storeToRefs } from "pinia";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { createChart } from "lightweight-charts";
import { useStrategiesStore } from "@/stores/matrix/strategies";

export default {
  name: "LightweightChart",
  setup() {
    const chartContainer = ref(null);
    const tooltip = ref(null);
    const calculatedData = ref([]);
    const strategiesStore = useStrategiesStore();
    const { strategyDetails } = storeToRefs(strategiesStore);
    let chart, lineSeries;

    // Function to calculate data with fixed start price
    const calculateData = () => {
      let data = strategyDetails.value.map(item => ({
        time: item.updated_at.split("T")[0], // Extract date
        value: item.sell_price && item.buy_price ? (item.sell_price - item.buy_price) * item.quantity : 0, // Profit calculation
      }));

      // Merge duplicate dates
      const map = new Map();
      for (const { time, value } of data) {
        map.set(time, (map.get(time) || 0) + value);
      }

      // Convert to sorted array
      const sortedData = [...map]
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([time, value]) => ({ time, value }));

      // Ensure start price is 0 (set on a backdate)
      let cumulativeProfit = 0;
      let finalData = sortedData.map((item, index) => {
        cumulativeProfit += item.value;
        return { time: item.time, value: cumulativeProfit };
      });

      // Inject an initial hidden backdate with value `0`
      if (finalData.length > 0) {
        let firstDate = new Date(finalData[0].time);
        firstDate.setDate(firstDate.getDate() - 1); // One day before

        finalData.unshift({
          time: firstDate.toISOString().split("T")[0], // Hidden date
          value: 0, // Force start from 0
        });
      }

      calculatedData.value = finalData;
    };

    onMounted(() => {
      chart = createChart(chartContainer.value, {
        width: chartContainer.value.clientWidth,
        height: 300,
        layout: {
          background: { type: "solid", color: "#0C1219" },
          textColor: "#fff",
        },
        grid: {
          vertLines: { color: "#333" },
          horzLines: { color: "#333" },
        },
        timeScale: {
          timeVisible: false, // Show date values properly
          borderColor: "#ffffff10",
          fixLeftEdge: true, // Fix left side of chart
          fixRightEdge: true, // Fix right side of chart
          rightOffset: 10, // Space on the right
          barSpacing: 50, // Controls spacing between data points
        },
      });

      // lineSeries = chart.addLineSeries({
      //   color: "#46BA4B",
      //   lineWidth: 2,
      // });

      // Replace line series with area series
      lineSeries = chart.addAreaSeries({
        lineColor: "#46BA4B",  // Line color
        topColor: "rgba(70, 186, 75, 0.6)",  // Lighter green near the line
        bottomColor: "rgba(70, 186, 75, 0)", // Transparent towards bottom
        lineWidth: 2, 
      });

      watch(strategyDetails, () => {
        calculateData();
      });

      watch(calculatedData, (newData) => {
        if (lineSeries) {
          lineSeries.setData(newData);
          if (newData.length > 0) {
            chart.timeScale().fitContent(); // Expands X-axis to fit all data
          }
        }

        // Add markers for positive and negative values
        const markers = newData.map((point) => ({
          time: point.time,
          position: "inBar", // Position in bar
          color: point.value >= 0 ? "#ddffd9" : "red",
          shape: point.value >= 0 ? "arrowUp" : "arrowDown",
          text: point.value.toFixed(2),
          size: 0.5,
        }));

        if (lineSeries) {
          lineSeries.setMarkers(markers);
        }
      });

      // **Custom Tooltip Handler**
      // chart.subscribeCrosshairMove((param) => {
      //   if (!param || !param.seriesData || !tooltip.value) return;

      //   const data = param.seriesData.get(lineSeries);
      //   if (!data) {
      //     tooltip.value.style.display = "none";
      //     return;
      //   }

      //   const date = data.time; // Date without time
      //   const price = data.value.toFixed(2); // Show price

      //   tooltip.value.innerHTML = `📅 ${date} <br> 💰 ${price}`;
      //   tooltip.value.style.display = "block";
      //   tooltip.value.style.left = param.point.x + "px";
      //   tooltip.value.style.top = param.point.y - 30 + "px"; // Adjust tooltip position
      // });

      // Resize chart dynamically
      const resizeObserver = new ResizeObserver(() => {
        if (chartContainer.value) {
          chart.applyOptions({ width: chartContainer.value.clientWidth });
        }
      });

      resizeObserver.observe(chartContainer.value);
    });

    onUnmounted(() => {
      if (chart) chart.remove();
    });

    return {
      chartContainer, 
      tooltip
    };
  },
};
</script>

<style>
.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
}


/* .chart-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
  display: none;
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 10;
} */
</style>
