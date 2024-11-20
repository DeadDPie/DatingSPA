<template>
  <v-container>
    <v-card class="pa-5" width="800" max-width="100%">
      <v-card-title class="text-center">Все лайки</v-card-title>
      <v-card-text>
        <v-list v-if="likesWithDetails.length">
          <v-list-item v-for="(like, index) in likesWithDetails" :key="index">
            <v-row justify="space-between" align="center">
              <!-- Отображение почты -->
              <v-col cols="6">
                <strong>{{ like.email || "Почта неизвестна" }}</strong>
              </v-col>

              <!-- Кнопка "Посмотреть подробнее" -->
              <v-col cols="6" class="text-end">
                <v-btn
                  color="primary"
                  text
                  @click="fetchUserDetails(like.liked_by)"
                  v-if="!like.loaded"
                >
                  Посмотреть подробнее
                </v-btn>

                <!-- Полная информация о пользователе -->
                <div v-else>
                  <v-avatar size="48" color="primary" class="mb-2">
                    <v-img
                      v-if="like.profile_image"
                      :src="like.profile_image"
                      :alt="like.full_name"
                    />
                    <v-icon v-else>mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <strong>
                      {{ like.full_name || "Имя неизвестно" }},
                      {{ like.age || "Возраст не указан" }}
                    </strong>
                  </div>
                  <div>{{ like.gender || "Пол неизвестен" }}</div>
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <div v-else>Пока нет лайков</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed, watchEffect } from "vue";
import { useWebSocket } from "../service/websocket";
import { authFetch } from "../service/authService";
import { api } from "../constants/api";

export default {
  setup() {
    const { connectToWebSocket } = useWebSocket();
    connectToWebSocket();
    const { likes } = useWebSocket(); // Получение сообщений через WebSocket
    const userDetails = ref({}); // Данные пользователей

    // Обрабатываем новые лайки, которые приходят через WebSocket
    const likesWithDetails = computed(() =>
      (likes.value || []).map((like) => ({
        ...like,
        ...userDetails.value[like.liked_by], // Добавляем данные пользователя
        loaded: userDetails.value[like.liked_by]?.loaded || false, // Устанавливаем "loaded" явно
      }))
    );

    // Запрос данных пользователя
    async function fetchUserDetails(userId) {
      try {
        // Проверка, если данные уже загружены
        if (userDetails.value[userId]?.loaded) return;

        const response = await authFetch(`${api}UserRetrieve/${userId}`);
        if (response.ok) {
          const user = await response.json();
          userDetails.value[userId] = {
            profile_image: user.profile_image || null,
            full_name: `${user.first_name || ""} ${
              user.last_name || ""
            }`.trim(),
            age: user.age || null,
            email: user.email || "Почта неизвестна",
            gender:
              user.gender === 1
                ? "Мужской"
                : user.gender === 2
                ? "Женский"
                : "Пол неизвестен",
            loaded: true,
          };
        } else {
          console.error(
            `Ошибка при запросе данных пользователя: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Ошибка при запросе данных пользователя:", error);
      }
    }

    // Обновление данных пользователя, когда приходят новые сообщения
    watchEffect(() => {
      // Проходим по всем новым лайкам
      (likes.value || []).forEach((like) => {
        if (like.liked_by_email) {
          // Если есть email в сообщении, обновляем email пользователя
          const user = userDetails.value[like.liked_by] || {};
          userDetails.value[like.liked_by] = {
            ...user,
            email: like.liked_by_email,
            loaded: user.loaded || false, // Не отмечаем как загруженное, если данных нет
          };
        }
      });
    });

    return {
      likesWithDetails,
      fetchUserDetails,
    };
  },
};
</script>
