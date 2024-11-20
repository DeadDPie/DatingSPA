<template>
  <v-btn
    v-if="isLoggedIn"
    color="gray"
    class="m-4"
    block
    @click="deleteAccount"
  >
    Удалить аккаунт
  </v-btn>
  <v-container class="d-flex justify-center pa-5">
    <v-card v-if="isLoggedIn" class="pa-5" width="100%" max-width="600px">
      <v-card-title v-if="first_name" text-align="center"
        >Личный кабинет</v-card-title
      >
      <v-card-title v-else text-align="center"
        >Заполните данные о себе</v-card-title
      >
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <div class="avatar-container mx-auto mb-4">
            <v-img
              max-width="600px"
              max-height="400px"
              :src="profile_image || 'https://via.placeholder.com/200'"
              class="square-avatar"
            >
              <v-icon
                color="primary"
                @click="triggerFileInput"
                style="
                  bottom: -10px;
                  right: -10px;
                  cursor: pointer;
                  background: white;
                  border-radius: 50%;
                  padding: 4px;
                "
              >
                mdi-upload
              </v-icon>
            </v-img>
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="handleFileUpload"
              accept="image/*"
            />
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
            :rules="[rules.required, rules.age]"
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
            readonly
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
          <v-textarea
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
        <v-btn @click="goToLogin" color="success" class="mt-4" block>
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
import { useRouter } from "vue-router";
import { authFetch } from "../service/authService";

export default {
  setup() {
    const router = useRouter();

    const genderOptions = [
      { text: "Мужской", value: 1 },
      { text: "Женский", value: 2 },
    ];
    const authStore = useAuthStore();
    const token = computed(() => authStore.accessToken);
    const isLoggedIn = inject("isLoggedIn");

    const profile_image = ref("");
    const first_name = ref("");
    const last_name = ref("");
    const age = ref(null);
    const email = ref("");
    const gender = ref(null);
    const description = ref("");
    const valid = ref(false);
    const fileInput = ref(null); 

    const rules = {
      required: (v) => !!v || "Поле обязательно",
      email: (v) => /.+@.+\..+/.test(v) || "Введите корректный email",
      age: (v) => v > 18 || "Возраст должен быт больше 18",
    };

    async function getUserData() {
      try {
        const userId = JSON.parse(atob(token.value.split(".")[1])).user_id;
        const response = await authFetch(`${api}UserRetrieve/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
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

    function triggerFileInput() {
      fileInput.value.click();
    }

    async function handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profile_image", file);

        try {
          const userId = JSON.parse(atob(token.value.split(".")[1])).user_id;
          const response = await authFetch(`${api}UserUpdate/${userId}/`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
            body: formData,
          });
          const data = await response.json();
          console.log(data);

          if (response.ok) {
            profile_image.value = data.profile_image;
            alert("Аватар успешно обновлен!");
          } else {
            console.error("Ошибка при загрузке аватара:", data);
            alert("Ошибка при загрузке аватара.");
          }
        } catch (error) {
          console.error("Ошибка при загрузке аватара:", error);
        }
      }
    }

    async function saveProfile() {
      if (valid.value) {
        try {
          const userId = JSON.parse(atob(token.value.split(".")[1])).user_id;
          const response = await authFetch(`${api}UserUpdate/${userId}/`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token.value}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: first_name.value,
              last_name: last_name.value,
              age: age.value,
              email: email.value,
              gender: gender.value,
              description: description.value,
            }),
          });

          const data = await response.json();
          console.log(data);
          if (response.ok) {
            alert("Профиль успешно обновлен!");
          } else {
            console.error("Ошибка при обновлении профиля:", data);
            alert("Ошибка при сохранении профиля.");
          }
        } catch (error) {
          console.error("Ошибка при сохранении профиля:", error);
        }
      }
    }
    async function deleteAccount() {
      const userId = JSON.parse(atob(token.value.split(".")[1])).user_id;

      if (
        confirm(
          "Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо."
        )
      ) {
        try {
          const response = await authFetch(`${api}UserDelete/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          });

          if (response.ok) {
            alert("Аккаунт успешно удален.");
            authStore.clearTokens();
            router.push("/signup");
          } else {
            const data = await response.json();
            console.error("Ошибка при удалении аккаунта:", data);
            alert(data.detail || "Ошибка при удалении аккаунта.");
          }
        } catch (error) {
          console.error("Ошибка при удалении аккаунта:", error);
          alert("Ошибка при удалении аккаунта.");
        }
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
      fileInput,
      triggerFileInput,
      handleFileUpload,
      saveProfile,
      goToLogin,
      deleteAccount,
    };
  },
};
</script>

<style scoped>
.square-avatar {
  border-radius: 0;
  object-fit: cover;
}
</style>
