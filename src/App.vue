<template>
  <v-app>
    <!-- Top Toolbar -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="sidebar = !sidebar"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" class="app-title-link">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Desktop Menu -->
      <v-row class="hidden-sm-and-down">
        <v-btn
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          variant="text"
        >
          <v-icon start>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-row>
    </v-app-bar>

    <!-- Sidebar for Mobile -->
    <v-navigation-drawer v-model="sidebar" app temporary>
      <v-list>
        <v-col>
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.path"
            variant="text"
          >
            <v-icon start>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-list-item>
        </v-col>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { computed, provide, ref, watch } from "vue";
import { useAuthStore } from "./stores/auth.js";

export default {
  setup() {
    const sidebar = ref(false);
    const authStore = useAuthStore();
    const token = computed(() => authStore.accessToken);
    const isLoggedIn = ref(!!token.value);
    watch(token, (newValue) => {
      isLoggedIn.value = !!newValue;
    });
    provide("isLoggedIn", isLoggedIn);

    const menuItems = computed(() => [
      { title: "Home", path: "/", icon: "mdi-home" },
      { title: "Likes", path: "/about", icon: "mdi-information" },
      { title: "Discover", path: "/discover", icon: "mdi-heart" },
      { title: "Profile", path: "/profile", icon: "mdi-account" },
      //{ title: "Chat", path: "/chat", icon: "mdi-chat" },
      {
        title: token.value ? "Log Out" : "Log In",
        path: "/signin",
        icon: token.value ? "mdi-logout" : "mdi-login",
      },
      ...(token.value ? [] : [{
        title: "Sign Up",
        path: "/signup",
        icon: "mdi-account-plus",
      }]),
    ]);

    return {
      appTitle: "Awesome App",
      sidebar,
      menuItems,

    };
  },
};
</script>

<style scoped>
.app-title-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

</style>
