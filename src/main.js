import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/global.css";

import { createI18n } from "vue-i18n";
import { languages, defaultLocale } from "./assets/i18n/index.js";

import PageTitle from "./components/CustomComponents/PageTitle.vue";
import ContentLoader from "./components/CustomComponents/ContentLoader.vue";
import ConfirmationDialog from "./components/CustomComponents/ConfirmationDialog.vue";
import NoDataFound from "./components/CustomComponents/NoDataFound.vue";

import AxiosPlugin from "./axios-plugin.js";

import moment from "moment";
import VOtpInput from "vue3-otp-input";
import Vue3IconPicker from "vue3-icon-picker";
import "vue3-icon-picker/dist/style.css";

import Vue3FormWizard from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";

import { dateMixin } from "./dateMixin.js";
import mitt from "mitt";

import Toaster from '@meforma/vue-toaster';

// ---------------- VUETIFY ----------------
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";
import { aliases, mdi } from "vuetify/iconsets/mdi";


// ---------------- EVENT BUS ----------------
const emitter = mitt();

// ---------------- I18N ----------------
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  messages: { ...languages },
});

document.documentElement.lang = defaultLocale;

// ---------------- VUETIFY SETUP ----------------
const vuetify = createVuetify({
  components: { ...components, ...labsComponents },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});

// ---------------- APP INIT ----------------
const app = createApp(App);

app.use(store);
app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(AxiosPlugin);
app.use(Toaster);
app.use(Vue3FormWizard);
app.use(Vue3IconPicker, { name: "IconPicker" });

// ---------------- GLOBAL PROPERTIES ----------------
app.config.globalProperties.$moment = moment;
app.config.globalProperties.emitter = emitter;

// ---------------- GLOBAL COMPONENTS ----------------
app.component("page-title", PageTitle);
app.component("content-loader", ContentLoader);
app.component("v-otp-input", VOtpInput);
app.component("confirmation-dialog", ConfirmationDialog);
app.component("no-data-found", NoDataFound);
// ---------------- GLOBAL MIXINS ----------------
app.mixin(dateMixin);

// ---------------- MOUNT ----------------
app.mount("#app");
