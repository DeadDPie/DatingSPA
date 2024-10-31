<template>
  <v-container class="d-flex justify-center">
    <v-card v-if="isLoggedIn" class="pa-5">
      <v-card-title>Личный кабинет</v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-avatar size="120" class="mx-auto mb-4">
            <v-img :src="avatar || 'https://via.placeholder.com/120'" />
          </v-avatar>
          <v-btn color="primary" @click="uploadAvatar">Загрузить аватар</v-btn>

          <v-text-field
            v-model="name"
            :rules="[rules.required]"
            label="Имя"
            prepend-icon="mdi-account"
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
          <v-text-field
            v-model="bio"
            label="О себе"
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
import { inject } from "vue";

export default {
  data() {
    return {
      avatar: "", // Загрузка аватара
      name: "Иван Иванов", // Пример данных
      email: "ivan@example.com",
      bio: "Я разработчик из России, увлекаюсь программированием и спортом.",
      valid: false,
      isLoggedIn: inject("isLoggedIn"),
      rules: {
        required: (v) => !!v || "Поле обязательно",
        email: (v) => /.+@.+\..+/.test(v) || "Введите корректный email",
      },
    };
  },
  methods: {
    uploadAvatar() {
      alert("Функция загрузки аватара пока не реализована");
      console.log(this.isLoggedIn);
    },
    saveProfile() {
      if (this.$refs.form.validate()) {
        alert("Профиль сохранен!");
      }
    },
    goToLogin() {
      this.$router.push("/signin");
    },
  },
};
</script>

<style scoped>

</style>
