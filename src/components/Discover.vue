<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card v-if="currentProfile && !noMoreUsers">
          <v-img
            class="align-end text-white"
            :src="currentProfile.profile_image"
            cover
          >
            <v-card-title
              >{{ currentProfile.first_name }} {{ currentProfile.last_name }},
              {{ currentProfile.age }}
            </v-card-title>
          </v-img>
          <v-card-subtitle class="pt-4">
            {{ getGender(currentProfile.gender) }}
          </v-card-subtitle>
          <v-card-text style="text-align: left"
            >{{ currentProfile.description }}
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="error" @click="dislike" outlined rounded>
              <v-icon left>mdi-close</v-icon>
              Dislike
            </v-btn>
            <v-btn color="success" @click="like" outlined rounded>
              <v-icon left>mdi-heart</v-icon>
              Like
            </v-btn>
          </v-card-actions>
        </v-card>
        <div v-else class="text-center">
          <h3>На сегодня пользователи закончились</h3>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import { api } from "../constants/api";
import { useAuthStore } from "../stores/auth.js";
import { authFetch } from "../service/authService";

export default {
  setup() {
    const authStore = useAuthStore();
    const profileList = ref([]);
    const currentProfile = ref(null);
    const currentProfileIndex = ref(0);
    const noMoreUsers = ref(false);

    const token = computed(() => authStore.accessToken);

    function getGender(gender) {
      return gender === 1 ? "Мужской" : gender === 2 ? "Женский" : "Не указано";
    }

    async function like() {
      if (!currentProfile.value) return;

      const likedUserId = currentProfile.value.id; // Получаем ID текущего профиля
      try {
        const response = await fetch(`${api}UserLike/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.value}`, // Передаём токен в заголовках
          },
          body: JSON.stringify({ liked_user_id: likedUserId }), // Тело запроса
        });

        if (response.ok) {
          console.log(`Вы успешно лайкнули пользователя с ID: ${likedUserId}`);
        } else {
          const error = await response.json();
          console.error(
            `Ошибка при отправке лайка: ${error.detail || response.statusText}`
          );
        }
      } catch (error) {
        console.error("Ошибка сети или запроса при лайке:", error);
      }

      // Переключаемся на следующий профиль
      currentProfileIndex.value += 1;
      if (currentProfileIndex.value < profileList.value.length) {
        currentProfile.value = profileList.value[currentProfileIndex.value];
      } else {
        noMoreUsers.value = true;
        currentProfile.value = null;
      }
    }

    function dislike() {
      currentProfileIndex.value += 1;
      if (currentProfileIndex.value < profileList.value.length) {
        currentProfile.value = profileList.value[currentProfileIndex.value];
      } else {
        noMoreUsers.value = true;
        currentProfile.value = null;
      }
    }

    async function fetchUsers() {
      try {
        const userId = JSON.parse(atob(token.value.split(".")[1])).user_id;
        const response = await authFetch(`${api}UserList/`);
        const data = await response.json();
        profileList.value = data.filter((user) => user.id !== userId);
        if (profileList.value.length > 0) {
          currentProfile.value = profileList.value[0];
        } else {
          noMoreUsers.value = true;
        }
        console.log(data);
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    }

    onMounted(() => {
      fetchUsers();
    });

    return {
      profileList,
      currentProfile,
      currentProfileIndex,
      noMoreUsers,
      getGender,
      like,
      dislike,
    };
  },
};
</script>

<style scoped>
.v-card {
  height: max-content;
}

.gradient-btn {
  color: white;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: bold;
}

.red-gradient {
  background: linear-gradient(45deg, #ff5252, #ff1744);
}

.green-gradient {
  background: linear-gradient(45deg, #00e676, #00c853);
}
</style>
