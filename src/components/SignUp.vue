<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-card class="pa-5" max-width="900">
      <v-card-title class="text-center">Регистрация</v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
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
          <v-text-field
            v-model="name"
            :rules="[rules.required]"
            label="Имя"
            type="text"
            required
          />
          <v-text-field
            v-model="description"
            :rules="[rules.required]"
            label="Описание"
            type="textarea"
            required
          />
          <v-text-field
            v-model="age"
            :rules="[rules.required, rules.age]"
            label="Возраст"
            type="text"
            inputmode="numeric"
            @keypress="onlyNumbers"
            required
          />
          <v-select
            v-model="gender"
            :items="this.genderOptions"
            item-title="text"
            item-value="value"
            label="Пол"
            :rules="[rules.required]"
            required
          />

          <v-file-input
            v-model="profile_image"
            :rules="[rules.required, rules.requiredFile]"
            label="Изображение профиля"
            placeholder="Выберите аватар"
            prepend-icon="mdi-camera"
            required
          />

          <v-btn
            :disabled="!isFormValid"
            @click="createUser"
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
import { api } from "../constants/api";

export default {
  data() {
    return {
      isFormValid: false,
      email: "",
      password: "",
      name: "",
      description: "",
      gender: null,
      age: null,
      profile_image: null,

      genderOptions: [
        { text: "Мужской", value: 1 },
        { text: "Женский", value: 2 },
      ],
      rules: {
        required: (v) => !!v || "Поле обязательно",
        email: (v) => /.+@.+\..+/.test(v) || "Введите корректный email",
        age: (v) => {
          return (v >= 18 && v <= 99) || "Возраст должен быть от 18 до 99";
        },
        requiredFile: (v) => {
          if (v.length == 0) {
            return "Должен содержать файл";
          } else {
            return true;
          }
        },
      },
      api: api,
    };
  },
  methods: {
    onlyNumbers(e) {
      const char = String.fromCharCode(e.keyCode);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    },
    async createUser() {
      const formData = new FormData();
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("name", this.name);
      formData.append("description", this.description);
      formData.append("gender", this.gender);
      formData.append("age", this.age);
      formData.append("profile_image", this.profile_image);

      try {
        const response = await fetch(`${this.api}/UserCreate/`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Ответ сервера:", data);
      } catch (error) {
        console.error("Ошибка при создании пользователя:", error);
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
