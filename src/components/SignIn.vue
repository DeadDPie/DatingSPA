<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card v-if="token" class="pa-5" width="600" max-width="100%">
      <v-card-title class="text-center">Вы вошли в систему</v-card-title>
      <v-card-text>
        <v-btn
          @click="$router.push('/about')"
          color="primary"
          class="mt-4"
          block
        >
          Перейти к лайкам
        </v-btn>
        <v-btn @click="logout" color="secondary" class="mt-4" block>
          Выйти
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card v-else class="pa-5" width="600" max-width="100%">
      <v-card-title class="text-center">Вход в систему</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="Email"
            prepend-icon="mdi-email"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            :rules="[rules.required]"
            label="Пароль"
            prepend-icon="mdi-lock"
            type="password"
            required
          />
          <v-btn
            :disabled="!valid"
            @click="login"
            color="primary"
            class="mt-4"
            block
          >
            Войти
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { computed, ref } from "vue";
import { api } from "../constants/api";
import { useRouter } from "vue-router";
import { authFetch } from "../service/authService";
import { useWebSocket } from "../service/websocket";

export default {
  setup() {
    const router = useRouter();

    const authStore = useAuthStore();
    const { connectToWebSocket } = useWebSocket();

    const valid = ref(false);
    const form = ref(null);
    const email = ref("");
    const password = ref("");
    const token = computed(() => authStore.accessToken);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      email: (value) => /.+@.+\..+/.test(value) || "Некорректный email",
    };

    async function login() {
      if (form.value && form.value.validate()) {
        const formData = new FormData();
        formData.append("email", email.value);
        formData.append("password", password.value);
        try {
          const response = await authFetch(`${api}token/`, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log("Ответ сервера:", data);

          if (response.ok) {
            authStore.setTokens({
              accessToken: data.access,
              refreshToken: data.refresh,
            });
            alert("Вы вошли успешно!");
           
            connectToWebSocket();
            router.push("/profile");
          } else {
            console.error("Ошибка сервера:", data);
            alert(
              data.email ? data.email[0] : "Ошибка при входе. Попробуйте снова."
            );
          }
        } catch (error) {
          console.error("Ошибка при входе:", error);
          alert("Ошибка при входе: Попробуйте снова");
        }
      }
    }

    function logout() {
      authStore.clearTokens();
    }

    return {
      token,
      login,
      logout,
      valid,
      form,
      email,
      password,
      rules,
    };
  },
};
</script>
