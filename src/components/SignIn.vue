<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card v-if="token" class="pa-5" width="600" max-width="100%">
      <v-card-title  class="text-center" >Вы вошли в систему</v-card-title>
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
      <p v-if="token">Токен: {{ token }}</p>
      <v-card-title  class="text-center" >Вход в систему</v-card-title>

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
          <p v-if="token">Токен: {{ token }}</p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useAuthStore } from '../stores/auth';
export default {
  data() {
    return {
      email: "",
      password: "",
      valid: false,
      rules: {
        required: (v) => !!v || "Поле обязательно",
        email: (v) => /.+@.+\..+/.test(v) || "Введите корректный email",
      },
    };
  },
  computed: {
    token() {
      const authStore = useAuthStore();
      return authStore.token; // Получаем токен из хранилища
    },
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        // Имитация успешной авторизации
        const fakeToken = 'abc123';

        const authStore = useAuthStore();
        authStore.setToken(fakeToken);

        alert(`Вход с email: ${this.email}, пароль: ${this.password}`);

      }
    },
    logout() {

        const authStore = useAuthStore();
        authStore.clearToken();

    },
  },

};
</script>

<style scoped>

</style>
