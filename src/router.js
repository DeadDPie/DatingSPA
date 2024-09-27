import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Profile from "./components/Profile.vue";
import Discover from "./components/Discover.vue";
import Chat from "./components/Chat.vue";
import Landing from "./components/Landing.vue";
import SignIn from "./components/SignIn.vue";
import SignUp from "./components/SignUp.vue";
import NotFound from "./components/NotFound.vue";

const routes = [
  { path: "/", component: Landing },
  { path: "/signin", component: SignIn },
  { path: "/signup", component: SignUp },
  { path: "/home", component: Home },
  { path: "/(.*)", component: NotFound },
  { path: "/about", component: About },
  { path: "/profile", component: Profile },
  { path: "/discover", component: Discover },
  { path: "/chat", component: Chat },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
