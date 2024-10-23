<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card v-if="currentProfile">
          <v-img
            class="align-end text-white"
            :src="currentProfile.profile_image"
            cover
          >
            <v-card-title
              >{{ currentProfile.name }}, {{ currentProfile.age }}
            </v-card-title></v-img
          >
          <v-card-subtitle class="pt-4">
            {{ getGender(currentProfile.gender) }}
          </v-card-subtitle>
          <v-card-text style="text-align: left">{{
            currentProfile.description
          }}</v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="error" @click="dislike" outlined rounded>
              <v-icon left>mdi-close</v-icon>
              Dislike
            </v-btn>
            <v-btn color="success" @click="like" outlined rounded>
              <v-icon left>mdi-heart</v-icon>
              Like
            </v-btn>
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
    getGender(gender) {
      return gender === 1 ? "Мужской" : gender === 2 ? "Женский" : "Не указано";
    },
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
  height: max-content;
}
.gradient-btn {
  color: white;
  border-radius: 24px;
  padding: 10px 20px;
  font-weight: bold;
}

.red-gradient {
  background: linear-gradient(45deg, #ff5252, #ff1744);
}

.green-gradient {
  background: linear-gradient(45deg, #00e676, #00c853);
}
</style>
