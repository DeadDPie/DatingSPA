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
        <v-col >
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
import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VToolbarTitle,
  VSpacer,
  VNavigationDrawer,
  VList,
  VListItem,
  // VListItemIcon,
  // VListItemContent,
  VListItemTitle,
  VMain,
  VContainer,
  VIcon,
  VBtn,
  VRow,
} from "vuetify/components";

export default {
  components: {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VToolbarTitle,
    VSpacer,
    VNavigationDrawer,
    VList,
    VListItem,
    // VListItemIcon,
    // VListItemContent,
    VListItemTitle,
    VMain,
    VContainer,
    VIcon,
    VBtn,
    VRow,
  },
  data() {
    return {
      appTitle: "Awesome App",
      sidebar: false, // Контроль боковой панели
      menuItems: [
        { title: "Home", path: "/", icon: "mdi-home" },
        { title: "About", path: "/about", icon: "mdi-information" },
        { title: "Discover", path: "/discover", icon: "mdi-heart" },
        { title: "Profile", path: "/profile", icon: "mdi-account" },
        { title: "Chat", path: "/chat", icon: "mdi-chat" },
        { title: "Sign Up", path: "/signup", icon: "mdi-account-plus" },
        { title: "Sign In", path: "/signin", icon: "mdi-login" },
      ],
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

.v-btn {
  margin-left: 10px;
}
</style>
