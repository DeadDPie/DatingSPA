<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-img :src="currentProfile.photo" height="300px"></v-img>
          <v-card-title>{{ currentProfile.name }}</v-card-title>
          <v-card-text>{{ currentProfile.bio }}</v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="error" @click="dislike">Dislike</v-btn>
            <v-btn color="success" @click="like">Like</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      profileList: [],
      currentProfile: {
        name: "Александра",
        photo: "https://via.placeholder.com/300",
        bio: "Я увлекаюсь спортом и путешествиями!",
      },
    };
  },
  methods: {
    like() {
      // Логика лайка
      alert("Вы поставили лайк");
    },
    dislike() {
      // Логика дизлайка
      alert("Вы поставили дизлайк");
    },
    async fetchUsers() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/UserList/");
        const data = await response.json();
        this.profileList = data;
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>
