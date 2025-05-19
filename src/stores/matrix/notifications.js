import { ref } from 'vue';
import { defineStore } from 'pinia';
import { makeRequest, state } from "../../requests/requests";

export const useNotificationsStore = defineStore('notifications', () => {
  const endpoint = 'notifications';
  const wait = 0;
  const notificationsData = ref([]);


  async function updateNotifications() {
    try {
      // Mock JSON data
      const response = {
        data: [
          {
            id: "1",
            message: "Order executed",
            strategy_id: "Strategy 1",
            time: "2024-06-26T10:00:00Z"
          },
          {
            id: "2",
            message: "Order failed",
            strategy_id: "Strategy 2",
            time: "2024-06-26T11:00:00Z"
          },

          {
            id: "3",
            message: "Order executed",
            strategy_id: "Strategy 3",
            time: "2024-06-26T11:00:00Z"
          },
          {
            id: "4",
            message: "Order failed",
            strategy_id: "Strategy 4",
            time: "2024-06-26T11:00:00Z"
          },
          {
            id: "5",
            message: "Order executed",
            strategy_id: "Strategy 1",
            time: "2024-06-26T10:00:00Z"
          },
          {
            id: "6",
            message: "Order failed",
            strategy_id: "Strategy 2",
            time: "2024-06-26T11:00:00Z"
          },

          {
            id: "7",
            message: "Order executed",
            strategy_id: "Strategy 3",
            time: "2024-06-26T11:00:00Z"
          },
          {
            id: "8",
            message: "Order failed",
            strategy_id: "Strategy 4",
            time: "2024-06-26T11:00:00Z"
          }
        ]
      };
      
      notificationsData.value = response.data.map(item => ({
        id: item.id,
        message: item.message,
        strategy_id: item.strategy_id,
        time: new Date(item.time).toLocaleString()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  const deleteNotification = (id) => {
    notificationsData.value = notificationsData.value.filter(n => n.id != id)
  }
  
  updateNotifications()
  return {
    endpoint,
    state,
    wait,
    notificationsData,
    deleteNotification,
  };
});
