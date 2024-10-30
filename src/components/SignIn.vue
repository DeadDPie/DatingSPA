<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card v-if="token" class="pa-5" width="600" max-width="100%">
      <v-card-title class="text-center">Вы вошли в систему</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>

          <v-btn
            @click="logout"
            color="primary"
            class="mt-4"
            block
          >
            Выйти
          </v-btn>
        </v-form>
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

export default {
  setup() {
    const authStore = useAuthStore();

    const valid = ref(false);
    const form = ref(null);
    const email = ref("");
    const password = ref("");

    const token = computed(() => authStore.token);

    const rules = {
      required: (value) => !!value || "Обязательное поле",
      email: (value) => /.+@.+\..+/.test(value) || "Некорректный email",
    };

    function login() {
      if (form.value && form.value.validate()) {
        // Имитация успешной авторизации
        const fakeToken = "abc123";
        authStore.setToken(fakeToken);

      }
    }

    function logout() {
      authStore.clearToken();
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

<style scoped>

</style>
