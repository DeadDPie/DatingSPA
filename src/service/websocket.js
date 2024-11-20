import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const likes = ref([]);
let websocket = null;

export function useWebSocket() {
  const authStore = useAuthStore();

  function connectToWebSocket() {
    if (websocket || !authStore.accessToken) return;

    websocket = new WebSocket("ws://127.0.0.1:8000/ws/likes/");
    websocket.onopen = () => {
      console.log("WebSocket подключен");
      websocket.send(
        JSON.stringify({
          type: "authenticate",
          token: authStore.accessToken,
        })
      );
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Сообщение от WebSocket:", data);
      if (data.type === "like_update") {
        likes.value.push(data.data);
      }
    };

    websocket.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket отключен");
      websocket = null;
    };
  }

  function disconnectWebSocket() {
    if (websocket) {
      websocket.close();
      websocket = null;
    }
  }

  return {
    likes,
    connectToWebSocket,
    disconnectWebSocket,
  };
}
