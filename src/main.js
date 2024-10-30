import { createApp } from "vue";
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import "vuetify/dist/vuetify.min.css";

// import "./style.css";
const pinia = createPinia()
import App from "./App.vue";

const vuetify = createVuetify({
    components,
    directives,
  })

import router from "./router";
createApp(App).use(router).use(pinia).use(vuetify).mount("#app");
