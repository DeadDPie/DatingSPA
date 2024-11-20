<template>
  <div>
    <h1>WebSocket Example</h1>
    <button @click="sendMessage">Send Message</button>
    <ul>
      <li v-for="message in messages" :key="message">{{ message }}</li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthStore } from "../stores/auth";

export default {
  setup() {
    const ws = ref(null); // WebSocket объект
    const messages = ref([]); // Полученные сообщения

    const authStore = useAuthStore();
    const token = computed(() => authStore.accessToken);
    const connectWebSocket = () => {
      // Создаём соединение
      ws.value = new WebSocket(`ws://${window.location.host}/ws/likes/`); //ws://127.0.0.1:8000/ws/likes/

      // Событие при открытии соединения
      ws.value.onopen = () => {
        console.log("WebSocket connection established");
        // Если нужно, отправляем сообщение с токеном
        ws.value.send(
          JSON.stringify({
            type: "authenticate",
            token: token,
          })
        );
      };

      // Событие при получении сообщения
      ws.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message received:", data);
        if (data.type === "like_update") {
          messages.value.push(`Liked by user: ${data.data.liked_by_email}`);
        }
      };

      // Событие при закрытии соединения
      ws.value.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        reconnectWebSocket();
      };

      // Событие при ошибке
      ws.value.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    const reconnectWebSocket = () => {
      console.log("Reconnecting WebSocket...");
      setTimeout(() => {
        connectWebSocket();
      }, 3000); // Попробуйте подключиться снова через 3 секунды
    };

    const sendMessage = () => {
      console.log("sendMessage вызвана");
      console.log(ws);
      console.log(ws.value);
      console.log(WebSocket.OPEN);
      console.log(ws.value.readyState);
      if (ws.value && ws.value.readyState === WebSocket.OPEN) {
        ws.value.send(
          JSON.stringify({
            type: "like_status",
          })
        );
      }
    };

    // Открытие соединения при монтировании компонента
    onMounted(() => {
      connectWebSocket();
    });

    // Закрытие соединения при размонтировании компонента
    onUnmounted(() => {
      if (ws.value) {
        ws.value.close();
      }
    });

    return {
      messages,
      sendMessage,
    };
  },
};
</script>
