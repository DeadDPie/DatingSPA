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
        currentProfile: {
          name: 'Александра',
          photo: 'https://via.placeholder.com/300',
          bio: 'Я увлекаюсь спортом и путешествиями!',
        },
      };
    },
    methods: {
      like() {
        // Логика лайка
        alert('Вы поставили лайк');
      },
      dislike() {
        // Логика дизлайка
        alert('Вы поставили дизлайк');
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    text-align: center;
  }
  </style>
  