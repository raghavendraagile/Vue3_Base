<script setup>
import { navigation } from "./store/navigation.js";
import { apptheme } from "./store/apptheme.js";
</script>

<template>
  <content-loader v-if="c_loader"></content-loader>
  <div id="app" v-bind:class="apptheme.theme_type">
    <v-card>
      <v-layout>
        <NavigationDrawer
          :key="componentKey"
          v-if="layout === 'default-layout'"
          :sel_lang="sel_lang"
        ></NavigationDrawer>

        <v-app-bar
          color="white"
          elevation="3"
          style="border-radius: 0px"
          v-if="layout === 'default-layout'"
          v-bind:style="sel_lang == 'ar' ? 'direction:rtl' : ''"
        >
          <template v-slot:prepend>
            <v-app-bar-nav-icon
              v-show="navigation.drawer === false"
              @click="navigation.setDrawer(!navigation.drawer)"
            ></v-app-bar-nav-icon>
            <div v-show="navigation.drawer === false">
              <div class="font-login text-center">
                <div v-if="app_image_url">
                  <span>
                    <img v-bind:src="app_image_url" style="width: 150px;" />
                  </span>
                </div>
                <div v-else-if="app_image_url == ''">
                  <span class="font-base-app text-center">
                    {{ application_name }}
                  </span>
                </div>
                <div v-else>
                  <span class="font-base-app text-center">
                    {{ application_name }}
                  </span>
                </div>
              </div>
            </div>
          </template>
          <v-spacer></v-spacer>

          <!-- <v-tooltip
            :text="$t('notifications')"
            location="bottom"
            v-if="showtradienotification"
          > -->
          <!-- <template v-slot:activator="{ props }">
            
            </template> -->
          <!-- <div class="text-center">
            <v-menu
              v-model="notificationmenu"
              :close-on-content-click="false"
              location="bottom"
              max-height="650"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="showtradienotification"
                  plain
                  size="medium"
                  class="mr-5"
                  v-bind="props"
                  @click="shownotificationdialog()"
                >
                  <v-badge
                    :content="notification_count"
                    color="error"
                    v-if="notification_count > 0"
                  >
                    <v-icon @click="shownotificationdialog()"
                      >mdi-bell-outline</v-icon
                    >
                  </v-badge>
                  <v-icon v-else @click="shownotificationdialog()"
                    >mdi-bell-outline</v-icon
                  >
                </v-btn>
              </template>

              <v-card
                class="notifcationmaincardscroll mx-auto mt-2"
                width="600"
                v-bind:class="[
                  apptheme.theme_type == 'theme-dark'
                    ? 'notificationdialogclassdark'
                    : '',
                ]"
              >
                <v-toolbar color="cyan-lighten-1">
                  <v-toolbar-title>{{ $t("notifications") }}</v-toolbar-title>
                  <v-tooltip :text="$t('cancel')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        @click="notificationmenu = false"
                        v-bind="props"
                        class="mr-4"
                        >mdi-close</v-icon
                      >
                    </template>
                  </v-tooltip>
                </v-toolbar>
                <div v-if="notification_array.length > 0" class="pl-1">
                  <div
                    class="row"
                    v-for="(notification, index) in displayedItems"
                    :key="index"
                    v-bind:class="[index != 0 ? 'mt-2' : 'mt-0']"
                  >
                    <v-row style="border-bottom: solid #0000002b 1px">
                      <v-col
                        md="2"
                        lg="2"
                        sm="2"
                        class="text-center my-3 pl-6 align-self-center"
                        v-if="notification.fetchuserdetails"
                      >
                        <v-avatar
                          v-if="notification.fetchuserdetails.image_url != null"
                          size="50"
                          :image="
                            envImagePath +
                            notification.fetchuserdetails.image_url
                          "
                        ></v-avatar>
                        <v-avatar v-else size="50">
                          <v-img
                            :src="
                              require('@/assets/images/avatars/default.png')
                            "
                          ></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col md="10" lg="10" sm="10" class="align-self-center">
                        <div class="row">
                          <div
                            class="notificationcreatedbyclass col-md-6 col-sm-6 col-lg-6 pt-2"
                          >
                            {{ notification.fetchuserdetails.full_name }}
                          </div>
                          <div
                            class="col-md-6 col-sm-6 col-lg-6 pt-1 text-end font-italic"
                          >
                            <span class="notificationsentonclass">{{
                              formatDateTime(notification.created_at)
                            }}</span>
                          </div>
                        </div>
                        <div class="row">
                          <div class="notficationtitleclass">
                            {{ notification.title }}
                          </div>
                          <div class="notficationdescriptionclass">
                            {{ notification.description }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                  <div
                    class="d-flex justify-content-center text-center mt-8 mb-5"
                  >
                    <v-btn
                      @click="loadMore"
                      class="green_btn_color"
                      size="small"
                      v-if="showLoadMoreButton"
                    >
                      {{ $t("load_more") }}
                    </v-btn>
                    <div v-else>
                      <h6
                        class="text-start font-weight-medium first_h6_section"
                      >
                        {{ $t("no_more_data") }}
                      </h6>
                    </div>
                  </div>
                </div>
                <div v-else class="nonotificationclass">
                  <v-row>
                    <v-col md="12" sm="12" lg="12" class="text-center">
                      <span>{{ $t("no_notification") }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-menu>
          </div> -->
          <!-- <v-tooltip :text="$t('change_language')" location="bottom">
            <template v-slot:activator="{ props }"> -->
          <div class="d-flex switch-lang bounce-all">
            <div
              v-if="sel_lang == 'en'"
              class="mx-2"
              @click="setUserLang('ar')"
            >
              <v-icon style="font-size: 20px; margin-top: 2px"
                >mdi mdi-translate</v-icon
              >
              {{ $t("arabic") }}
            </div>
            <div v-else class="mx-2" @click="setUserLang('en')">
              <v-icon style="font-size: 20px; margin-top: 2px"
                >mdi mdi-translate</v-icon
              >
              {{ $t("english") }}
            </div>
          </div>
          <!-- </template>
          </v-tooltip> -->

          <!-- <v-tooltip :text="$t('switch_mode')" location="bottom">
            <template v-slot:activator="{ props }"> -->
          <!-- <v-btn
            icon
            @click="
              switchTheme();
              apptheme.setTheme();
            "
          >
            <v-icon
              style="transition: 2s"
              :icon="
                apptheme.theme_type == 'theme-dark'
                  ? 'mdi-weather-night'
                  : 'mdi-white-balance-sunny'
              "
            ></v-icon>
          </v-btn> -->
          <!-- </template>
          </v-tooltip> -->
          <ProfileView @getuserdetails="fetchUserdetails"></ProfileView>
        </v-app-bar>

        <v-main style="min-height: 100vh;">
          <router-view></router-view>
        </v-main>
      </v-layout>
    </v-card>
  </div>
  <LogoutTimer></LogoutTimer>
</template>

<script>
import localStorageWrapper from "./localStorageWrapper.js";
import { getMessaging, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
if (window.location.protocol === "https:") {
  const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
  };

  const app = initializeApp(firebaseConfig);
  console.log(app);
  var messaging = getMessaging();
}

const default_layout = "default";
import NavigationDrawer from "./Layout/NavigationDrawer.vue";
import ProfileView from "./Layout/ProfileView.vue";
import LogoutTimer from "./LogoutTimer.vue";
export default {
  components: { NavigationDrawer, ProfileView, LogoutTimer },
  data() {
    return {
      notificationmenu: false,
      componentKey: 0,
      app_image_url: "",
      application_name: "Gulf Mall",
      app_name: "",
      showtradienotification: false,
      notification_count: 0,
      user: [],
      user_id: "",
      notification_array: [],
      currentTheme: localStorage.getItem("theme-type"),
      envImagePath: process.env.VUE_APP_IMAGE_PATH,
      displayedItems: [],
      loader: false,
      currentIndex: 0,
      itemsPerPage: 5,
      sel_lang: "",
      c_loader: false,
    };
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
    nextItems() {
      return this.notification_array.slice(
        this.currentIndex,
        this.currentIndex + this.itemsPerPage
      );
    },
    showLoadMoreButton() {
      return this.currentIndex < this.notification_array.length;
    },
  },

  mounted() {
    this.selectedLang();
  },
  created() {
    this.emitter.on("app_image_update", () => {
      this.getAppImage();
    });
    this.getAppImage();
  },
  watch: {
    messaging: {
      immediate: true,
      handler() {
        if (window.location.protocol === "https:") {
          onMessage(messaging, (payload) => {
            console.log("Message received. ", payload.notification);
            if (this.user_id > 0) {
              // this.fetchNotification();
            }
          });
        }
      },
    },
    "$route.params.lang"(newLang) {
      if (newLang == "en" || newLang == "ar") {
        this.$i18n.locale = newLang;
        if (newLang) {
          localStorage.setItem("pref_lang", newLang);
          this.sel_lang = newLang;
        } else {
          localStorage.setItem("pref_lang", "en");
          this.sel_lang = "en";
        }
      } else {
        localStorage.setItem("pref_lang", "en");
        this.sel_lang = "en";
      }
    },
  },

  methods: {
    setUserLang(lang) {
      this.c_loader = true;
      setTimeout(() => {
        this.c_loader = false;
      }, 1000);
      localStorage.setItem("pref_lang", lang);
      this.$i18n.locale = lang;

      let newRoute = {
        ...this.$route,
        params: {
          ...this.$route.params,
          lang: lang,
        },
      };

      this.$router.push(newRoute).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          throw err;
        }
      });

      this.selectedLang();
      this.componentKey += 1;
    },
    selectedLang() {
      this.sel_lang = localStorage.getItem("pref_lang") || "en";
    },
    fetchUserdetails(getuserdetails) {
      this.user = getuserdetails;
      this.user_id = getuserdetails.id;
      // this.fetchNotification();
      if (
        this.user.role.rolename == "Tradie" ||
        this.user.role.rolename == "Principal"
      ) {
        this.showtradienotification = true;
      } else {
        this.showtradienotification = false;
      }
    },

    shownotificationdialog() {
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "seennotifications/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.notification_count = 0;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    fetchNotification() {
      this.notification_array = [];
      this.notification_count = 0;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchusernotifications/" +
            this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.notification_array = res.data.notification;
            this.notification_count = res.data.not_seen_count;
            this.loadMore();
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    getAppImage() {
      if (localStorageWrapper.getItem("App_Image_Url") != null) {
        this.app_image_url = localStorageWrapper.getItem("App_Image_Url");
        this.app_name = localStorageWrapper.getItem("App_Name");
      } else {
        this.app_image_url = "";
      }
      if (localStorageWrapper.getItem("Application_Name")) {
        this.application_name = localStorageWrapper.getItem("Application_Name");
      } else {
        this.application_name = "";
      }
    },

    switchTheme() {
      const storedTheme = localStorage.getItem("theme-type");
      if (storedTheme === "theme-dark") {
        localStorage.setItem("theme-type", "theme-light");
        this.currentTheme = localStorage.getItem("theme-type");
      } else {
        localStorage.setItem("theme-type", "theme-dark");
        this.currentTheme = localStorage.getItem("theme-type");
      }
    },

    loadMore() {
      this.loader = true;
      this.displayedItems.push(...this.nextItems);
      this.currentIndex += this.itemsPerPage;
      if (!this.showLoadMoreButton) {
        console.log("All data loaded.");
      }
      this.loader = false;
    },
  },
};
</script>
<style scoped>
:global(.rtl input) {
  text-align: right;
  direction: rtl;
}
:global(.rtl textarea) {
  text-align: right;
  direction: rtl;
}
:global(.v-list-group--prepend .v-list-item--active){background: #e4e4e4;}
:global(.rtl-page-title .v-checkbox-btn){direction:rtl !important}

nav {
  padding: 30px;
}

body::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.d-flex1{display:flex;justify-content: space-between;width:100%}
.notificationcreatedbyclass {
  font-size: 12px;
  font-weight: 500;
  color: #000000c9;
}

.notficationtitleclass {
  font-size: 16px;
  font-weight: 500;
}

.notficationdescriptionclass {
  font-size: 13px;
  text-align: justify;
}

.notificationsentonclass {
  color: rgb(7 7 7 / 55%);
  font-size: 14px;
  font-weight: 500;
}

.nonotificationclass {
  min-height: 68px;
  align-self: center;
  padding: 30px 0px;
  font-size: 20px;
  font-weight: 500;
}

.notificationdialogclassdark {
  background: #222 !important;
  color: #fff !important;
}

.notificationdialogclassdark .notificationcreatedbyclass {
  color: #ffffff91 !important;
}

.notificationdialogclassdark .notificationsentonclass {
  color: #ffffff91 !important;
}

.v-toolbar__content {
  height: 57px !important;
}

.v-toolbar-title__placeholder {
  font-size: 23px;
  font-weight: 500;
  font-family: "Roboto";
  color: #000000bd;
  padding-left: 10px;
}
.notifcationmaincardscroll {
  overflow-x: hidden !important;
}
.notifcationmaincardscroll::-webkit-scrollbar {
  display: none; /* for Chrome, Safari, and Opera */
}
</style>

