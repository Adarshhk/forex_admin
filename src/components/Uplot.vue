<template>
  <div ref="chartContainer" class="uplot-canvas">
      <div ref="tooltip" class="custom-tooltip"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

const chartContainer = ref(null)
let chart = null
let socket = null
const tooltip = ref(null)

const MAX_POINTS = 50

// Candle data
const timestamps = []
const opens = []
const highs = []
const lows = []
const closes = []

function clearChartData() {
  timestamps.length = 0
  opens.length = 0
  highs.length = 0
  lows.length = 0
  closes.length = 0
}

async function fetchHistoricalCandles() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100')
    const data = await res.json()
    clearChartData()

    data.forEach(d => {
      timestamps.push(Math.floor(d[0] / 1000))
      opens.push(+d[1])
      highs.push(+d[2])
      lows.push(+d[3])
      closes.push(+d[4])
    })
  } catch (err) {
    console.error("Failed to fetch historical data:", err)
  }
}

// Zerodha-like colors
const bullishColor = '#26a69a'  // Teal green
const bearishColor = '#ef5350'  // Soft red

const chartOptions = {
  width: 0, // will be updated to container size on init
  height: 0,
  scales: {
    x: {
      time: true,
      auto: false,
      range: (u, min, max) => {
        if (min === max || min == null || max == null) {
          const now = Math.floor(Date.now() / 1000)
          return [now - 60 * 15, now + 60]
        }
        return [min, max]
      }
    },
    y: {
      auto: true,
      range: (u, min, max) => {
        if (min === max || min == null || max == null) return [0, 100]
        const padding = (max - min) * 0.1
        return [min - padding, max + padding]
      }
    }
  },
  series: [
    {},
    { label: "Open", value: (u, v) => v != null ? "$" + v.toFixed(2) : "--"  },
    { label: "High", value: (u, v) => v != null ? "$" + v.toFixed(2) : "--" },
    { label: "Low", value: (u, v) => v != null ? "$" + v.toFixed(2) : "--" },
    { label: "Close", value: (u, v) => v != null ? "$" + v.toFixed(2) : "--" }
  ],
  axes: [
    {
      grid: { show: true },
      ticks: { show: true },
      values: (u, vals) => vals.map(v => new Date(v * 1000).toLocaleTimeString())
    },
    {
      grid: { show: true },
      ticks: { show: true },
      size: 80,
      values: (u, vals) => vals.map(v => "$" + v.toFixed(0))
    }
  ],
  cursor: {
  drag: { x: true, y: false },
  points: { show: false },
  focus: {
    prox: 16
  },
  sync: {
    key: "tooltip-sync",
    setSeries: true
  }
},
  hooks: {
    draw: [
      (u) => {
        const ctx = u.ctx
        const w = 8
        if (!u.data[0].length) return

        for (let i = 0; i < u.data[0].length; i++) {
          const x = u.valToPos(u.data[0][i], 'x', true)
          const open = u.valToPos(u.data[1][i], 'y', true)
          const high = u.valToPos(u.data[2][i], 'y', true)
          const low = u.valToPos(u.data[3][i], 'y', true)
          const close = u.valToPos(u.data[4][i], 'y', true)

          if ([x, open, high, low, close].some(Number.isNaN)) continue

          const isBearish = u.data[4][i] < u.data[1][i]
          const color = isBearish ? bearishColor : bullishColor
          ctx.strokeStyle = color
          ctx.fillStyle = color

          // Wick
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x, high)
          ctx.lineTo(x, low)
          ctx.stroke()

          // Body
          const bodyHeight = Math.max(1, Math.abs(close - open))
          ctx.fillRect(x - w / 2, Math.min(open, close), w, bodyHeight)

          // Highlight latest
          if (i === u.data[0].length - 1) {
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 1
            ctx.strokeRect(x - w / 2, Math.min(open, close), w, bodyHeight)
          }

          // BUY Signal Example (if specific value matched)
          if (u.data[4][i] === 101756.81) {
            const signalText = 'BUY'
            const padding = -30
            const textHeight = 16
            const bgX = x + w / 2 - 20
            const bgY = high + padding - textHeight / 2

            ctx.fillStyle = bullishColor
            ctx.beginPath()
            ctx.roundRect(bgX, bgY, ctx.measureText(signalText).width + 10, textHeight, 5)
            ctx.fill()

            ctx.fillStyle = '#fff'
            ctx.font = 'bold 12px Arial'
            ctx.fillText(signalText, x + w / 2 + 10, high + padding)
          }
        }
      }
    ],
    setCursor: [
    (u) => {
      const idx = u.cursor.idx
      const tooltipEl = tooltip.value

      if (idx == null || idx >= u.data[0].length) {
        tooltipEl.style.display = 'none'
        return
      }

      const xVal = u.data[0][idx]
      const o = u.data[1][idx]
      const h = u.data[2][idx]
      const l = u.data[3][idx]
      const c = u.data[4][idx]

      const x = u.valToPos(xVal, 'x')
      const y = Math.min(
        u.valToPos(h, 'y'),
        u.valToPos(l, 'y')
      ) - 10

      tooltipEl.innerHTML = `
        <div><strong>O:</strong> $${o.toFixed(2)}</div>
        <div><strong>H:</strong> $${h.toFixed(2)}</div>
        <div><strong>L:</strong> $${l.toFixed(2)}</div>
        <div><strong>C:</strong> $${c.toFixed(2)}</div>
      `

      tooltipEl.style.display = 'block'
      tooltipEl.style.left = x + 'px'
      tooltipEl.style.top = y + 'px'
    }
  ]
  }
}

onMounted(async () => {
  await fetchHistoricalCandles()

  // Auto-set chart size
  const rect = chartContainer.value.getBoundingClientRect()
  chartOptions.width = rect.width
  chartOptions.height = rect.height

  chart = new uPlot(chartOptions, [timestamps, opens, highs, lows, closes], chartContainer.value)

  socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m')

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      const k = msg?.k
      if (!k) return

      const ts = Math.floor(k.t / 1000)
      const o = +k.o, h = +k.h, l = +k.l, c = +k.c
      const existingIndex = timestamps.findIndex(t => t === ts)

      if (existingIndex !== -1) {
        highs[existingIndex] = Math.max(highs[existingIndex], h)
        lows[existingIndex] = Math.min(lows[existingIndex], l)
        closes[existingIndex] = c
      } else {
        if (timestamps.length >= MAX_POINTS) {
          timestamps.shift()
          opens.shift()
          highs.shift()
          lows.shift()
          closes.shift()
        }
        timestamps.push(ts)
        opens.push(o)
        highs.push(h)
        lows.push(l)
        closes.push(c)

        if (timestamps.length > 1) {
          const firstTs = timestamps[0]
          const lastTs = timestamps[timestamps.length - 1]
          const span = lastTs - firstTs
          chart.setScale('x', { min: firstTs - span * 0.05, max: lastTs + 120 })
        }
      }

      chart.setData([timestamps, opens, highs, lows, closes])
    } catch (err) {
      console.error("WebSocket parse error:", err)
    }
  }

  socket.onopen = () => console.log("WebSocket connected")
  socket.onerror = (err) => console.error("WebSocket error:", err)
  socket.onclose = () => console.log("WebSocket closed")
})

onBeforeUnmount(() => {
  if (socket?.readyState === WebSocket.OPEN) socket.close()
  if (chart) chart.destroy()
})
</script>

<style scoped>
.uplot-canvas {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  border: 1px solid #333;
}

/* Deep styles for uPlot customization */
:deep(.u-legend) {
  background: #1e1e1e;
  color: #fff;
}

:deep(.u-select) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.u-axis .u-tick),
:deep(.u-axis .u-label) {
  color: #bbb;
}
.custom-tooltip {
  position: absolute;
  background-color: #1e1e1e;
  color: white;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  border: 1px solid #555;
  transform: translate(-50%, -100%);
  transition: opacity 0.2s;
}

</style>
