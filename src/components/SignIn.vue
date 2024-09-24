<template>
    <v-container class="d-flex justify-center align-center fill-height">
      <v-card class="pa-5" max-width="400">
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
  export default {
    data() {
      return {
        email: '',
        password: '',
        valid: false,
        rules: {
          required: (v) => !!v || 'Поле обязательно',
          email: (v) => /.+@.+\..+/.test(v) || 'Введите корректный email',
        },
      };
    },
    methods: {
      login() {
        if (this.$refs.form.validate()) {
          // Обработка логики авторизации
          alert(`Вход с email: ${this.email}, пароль: ${this.password}`);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card-title {
    font-weight: bold;
    font-size: 24px;
  }
  </style>
  