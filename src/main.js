import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "../src/assets/css/global.css";
import { createI18n } from "vue-i18n";
import { languages, defaultLocale } from "./assets/i18n/index.js";
import PageTitle from "./components/CustomComponents/PageTitle.vue";
import ContentLoader from "./components/CustomComponents/ContentLoader.vue";
import AxiosPlugin from "./axios-plugin.js";
import Toaster from "@meforma/vue-toaster";
import moment from "moment";
import VOtpInput from "vue3-otp-input";
import Vue3IconPicker from 'vue3-icon-picker';
import 'vue3-icon-picker/dist/style.css';

// import FlashMessage from './vue-flash-message';

//import translations
const messages = Object.assign(languages);

// configure i18n
const i18n = createI18n({
  locale: defaultLocale,
  messages,
});
document.documentElement.lang = defaultLocale;

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

import Vue3FormWizard from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";
import { dateMixin } from "./dateMixin.js";

import mitt from "mitt";
const emitter = mitt();
const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
});

const app = createApp(App)
  .use(store)
  .use(vuetify)
  .use(router)
  .use(AxiosPlugin)
  .use(Toaster)
  .use(moment)
  .use(Vue3FormWizard)
  .use(i18n)
  .use(Vue3IconPicker, { name: 'IconPicker' });

app.config.globalProperties.emitter = emitter;
app.component("page-title", PageTitle);
app.component("content-loader", ContentLoader);
app.mixin(dateMixin);
app.component("v-otp-input", VOtpInput);
app.mount("#app");
