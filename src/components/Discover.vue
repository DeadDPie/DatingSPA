<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card v-if="currentProfile">
          <v-img :src="currentProfile.profile_image" height="300px"></v-img>
          <v-card-title>{{ currentProfile.name }}</v-card-title>
          <v-card-text>{{ currentProfile.description }}</v-card-text>
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
import { api } from "../constants/api";
export default {
  data() {
    return {
      profileList: [],
      currentProfile: null,
      currentProfileIndex: 0,
      api: api, 
    };
  },
  methods: {
    like() {
      this.currentProfileIndex += 1;
      this.currentProfile = this.profileList[this.currentProfileIndex];
    },
    dislike() {
      this.currentProfileIndex += 1;
      this.currentProfile = this.profileList[this.currentProfileIndex];
    },
    async fetchUsers() {
      try {
        const response = await fetch(`${this.api}/UserList/`);
        const data = await response.json();
        this.profileList = data;
        if (this.profileList.length > 0) {
          this.currentProfile = this.profileList[0];
        }
        console.log(data);
      } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>
