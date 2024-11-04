<template>
  <v-container class="d-flex justify-center pa-5">
    <v-card v-if="isLoggedIn" class="pa-5 " width="100%" max-width="600px">

      <v-card-title text-align='center'>Личный кабинет</v-card-title>
      <v-card-text>

        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="avatar-container mx-auto mb-4 ">
            <v-img
              max-width='600px' max-height='400px'
              :src="profile_image || 'https://via.placeholder.com/200'"
              class="square-avatar"

            >
              <v-icon
                color="primary"
                @click="uploadAvatar"
                style="bottom: -10px; right: -10px; cursor: pointer; background: white; border-radius: 50%; padding: 4px;"
              >
                mdi-upload
              </v-icon>
            </v-img>
          </div>
          <v-text-field
            v-model="first_name"
            :rules="[rules.required]"
            label="Имя"
            prepend-icon="mdi-account"
            required
          />
          <v-text-field
            v-model="last_name"
            :rules="[rules.required]"
            label="Фамилия"
            prepend-icon="mdi-account"
            required
          />
          <v-text-field
            v-model="age"
            :rules="[rules.required]"
            label="Возраст"
            prepend-icon="mdi-calendar"
            type="number"
            required
          />
          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="Email"
            prepend-icon="mdi-email"
            type="email"
            required
          />
          <v-select
            v-model="gender"
            :items="genderOptions"
            item-title="text"
            item-value="value"
            label="Пол"
            :rules="[rules.required]"
            prepend-icon="mdi-gender-male-female"
            required
          />

          <v-text-field
            v-model="description"
            label="Описание"
            prepend-icon="mdi-information"
            textarea
            rows="3"
          />

          <v-btn
            :disabled="!valid"
            @click="saveProfile"
            color="success"
            class="mt-4"
            block
          >
            Сохранить
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card v-else max-width="600" class="pa-5">
      <v-card-title>Войдите в аккаунт</v-card-title>
      <v-card-text>
        <v-btn
          @click="goToLogin"
          color="success"
          class="mt-4"
          block
        >
          Войти
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { api } from "../constants/api";
import { useAuthStore } from "../stores/auth";

export default {
  setup() {

    const genderOptions = [
      { text: "Мужской", value: 1 },
      { text: "Женский", value: 2 },
    ];
    const authStore = useAuthStore();
    const token = computed(() => authStore.token);
    const isLoggedIn = inject("isLoggedIn");

    // Объявляем поля пользователя
    const profile_image = ref("");
    const first_name = ref("");
    const last_name = ref("");
    const age = ref(null);
    const email = ref("");
    const gender = ref(null);
    const description = ref("");
    const valid = ref(false);

    const rules = {
      required: (v) => !!v || "Поле обязательно",
      email: (v) => /.+@.+\..+/.test(v) || "Введите корректный email",
    };

    async function getUserData() {
      try {
        const userId = JSON.parse(atob(token.value.split(".")[1])).user_id;
        const response = await fetch(`${api}UserRetrieve/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          // Заполняем данные пользователя
          profile_image.value = data.profile_image;
          first_name.value = data.first_name;
          last_name.value = data.last_name;
          age.value = data.age;
          email.value = data.email;
          gender.value = data.gender;
          description.value = data.description;
        } else {
          console.error("Ошибка сервера:", data);
          alert(data.detail || "Ошибка при загрузке данных.");
        }
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    }

    function uploadAvatar() {
      alert("Функция загрузки аватара пока не реализована");
    }

    async function saveProfile() {
      if (valid.value) {
        alert("Профиль сохранен!");
        // Код для сохранения изменений профиля на сервере
      }
    }

    function goToLogin() {
      this.$router.push("/signin");
    }

    onMounted(() => {
      if (isLoggedIn) {
        getUserData();
      }
    });

    return {
      profile_image,
      first_name,
      last_name,
      age,
      email,
      gender,
      description,
      genderOptions,
      valid,
      rules,
      isLoggedIn,
      uploadAvatar,
      saveProfile,
      goToLogin,
    };
  },
};
</script>

<style scoped></style>
