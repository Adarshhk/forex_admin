<script setup>
import { ref } from "vue";

const positions = ref([
  {
    strategy_name: "Sky blue",
    strategy_script: "GSJWU6738JSJWI2",
    broker_id: "GSJWU673",
    price: 67898,
    side: "BUY",
    quantity: 99,
    total_quantity: 100,
    status: "Success",
    time: "09:28AM",
  },

  {
    strategy_name: "Sky blue",
    strategy_script: "GSJWU6738JSJWI2",
    broker_id: "GSJWU673",
    price: 67898,
    side: "BUY",
    quantity: 99,
    total_quantity: 100,
    status: "Pending",
    time: "09:28AM",
  },
  {
    strategy_name: "Sky blue",
    strategy_script: "GSJWU6738JSJWI2",
    broker_id: "GSJWU673",
    price: 67898,
    side: "SELL",
    quantity: 99,
    total_quantity: 100,
    status: "Rejected",
    time: "09:28AM",
  },
  {
    strategy_name: "Sky blue",
    strategy_script: "GSJWU6738JSJWI2",
    broker_id: "GSJWU673",
    price: 67898,
    side: "BUY",
    quantity: 99,
    total_quantity: 100,
    status: "Pending",
    time: "09:28AM",
  },
]);

const statusClass = (status) => {
  if (status === "SUCCESS") {
    return "bg-custom-green/10 text-custom-green";
  } else if (status === "PENDING") {
    return "bg-custom-yellow/10 text-custom-yellow";
  } else if (status === "REJECTED") {
    return "bg-custom-red/10 text-custom-red";
  } else {
    return "bg-custom-demo/10 text-custom-demo";
  }
};
</script>

<template>
  <main class="flex flex-col gap-2">
    <div class="border border-white border-opacity-30 py-2 px-4">
      <div class="flex items-center justify-between nrml-text">
        <h2 class="title-text">Positions</h2>
        <p>Showing result 101-120 Result</p>
      </div>

      <hr class="w-full my-4 opacity-30" />

      <div class="flex items-center justify-between gap-x-4 w-full">
        <div class="">
          <button
            class="bg-white/15 border border-white/10 rounded-md text-sm px-4 py-1 text-nowrap"
          >
            Robert Fox
          </button>
        </div>

        <div class="flex items-center justify-end col-span-4 space-x-4">
          <div
            class="bg-white/10 rounded-md flex items-center gap-2 py-[4px] px-2"
          >
            <i class="pi pi-search opacity-20"></i>
            <input
              type="text"
              placeholder="Search"
              class="text-[#b2b5bb] bg-transparent rounded-md w-full outline-none nrml-text"
            />
          </div>

          <button
            class="inline-flex items-center bg-white/15 border border-white/10 rounded-md text-sm px-4 py-1 text-nowrap"
          >
            Status
            <i class="pi pi-chevron-down ml-2"></i>
          </button>

          <button
            class="inline-flex items-center bg-white/15 border border-white/10 rounded-md text-sm px-4 py-1 text-nowrap"
          >
            Brokers
            <i class="pi pi-chevron-down ml-2"></i>
          </button>
        </div>
      </div>
    </div>


    <!-- body  -->
    <div class="">
      <div class="table-container">
        <table class="w-full whitespace-nowrap overflow-x-auto">
          <thead class="bg-white/10">
            <tr class="text-left w-full px-4 py-3 text-sm">
              <th>
                <div>
                  <Checkbox v-model="isChecked" className="mr-4" />
                  <span>S.NO</span>
                </div>
              </th>
              <th>Strategy/Script</th>
              <th>Broker Id</th>
              <th>Buy / Sell</th>
              <th>PNL / Qty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="positions.length"
              v-for="item in positions"
              class="text-left text-sm w-full px-4 py-2"
            >
              <td>
                <div>
                  <Checkbox className="ml-2 mr-4" />
                  <span>S.NO</span>
                </div>
              </td>
              <td>
                <div>
                  {{ item.strategy_name }}
                  <br />
                  {{ item.strategy_script }}
                </div>
              </td>
              <td>
                <div class="">
                  {{ item.broker_id }}
                </div>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <div
                    v-if="item.side === 'BUY'"
                    class="capitalize bg-[#4BCE9738] border-t text-custom-green border-custom-green rounded-full w-7 h-7 flex items-center justify-center"
                  >
                    B
                  </div>
                  <div
                    v-else-if="item.side === 'SELL'"
                    class="capitalize bg-custom-red/10 border-t text-custom-red border-custom-red rounded-full w-7 h-7 flex items-center justify-center"
                  >
                    S
                  </div>
                  <div>
                    <p>
                      ₹{{ item.price.toFixed(2) }}
                      <span class="pl-1 text-custom-white/50">{{
                        item.time
                      }}</span>
                    </p>
                    <p>{{ item.quantity }}/{{ item.total_quantity }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="flex flex-col items-end">
                  <p>837678.00</p>
                  <p>100</p>
                </div>
              </td>
              <td>
                <div class="flex items-center">
                  <div
                    class="flex items-center justify-center rounded-md px-4 py-1"
                    :class="statusClass(item.status.toUpperCase())"
                  >
                    {{ item.status }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
