<template>
  <content-loader v-if="loader"></content-loader>
  <v-app>
    <div>
    
      <transition name="fade" mode="out-in" appear>
        <div class="background">
          <div class="login-box-custom">
            <div>
              <!-- <img src="../../assets/images/TradieSafe_logo.png" /> -->
              <div class="w-100 d-flex" style="flex-direction: column">
                <h4 class="mb-0">{{ $t("welcome_msg") }}</h4>
                <div class="font-login">
                  <div v-if="app_image_url">
                    <span>
                      <img
                        class="custom-logo"
                        v-bind:src="app_image_url"
                        style="width: 130px"
                      />
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
                <span class="font-sign-in-msg">{{ $t("sign_in_msg") }}</span>
              </div>
            </div>

            <v-divider></v-divider>

            <div>
              <v-form v-model="valid" class="w-100">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="12" class="pb-0">
                      <label>{{ $t("email") }}</label>
                      <v-tooltip :text="$t('email')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="userdata.email"
                            :rules="emailRules"
                            @keyup.enter="login"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" md="12" class="pt-0">
                      <label>{{ $t("password") }}</label>
                      <v-tooltip :text="$t('password')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="userdata.password"
                            :append-inner-icon="
                              show1 ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :rules="fieldRules"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            @keyup.enter="login"
                            counter
                            variant="outlined"
                            density="compact"
                            @click:append-inner="show1 = !show1"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      class="error_message pt-0"
                      v-if="error_message && show_error"
                      ><v-icon style="font-size: 18px" class="mr-1"
                        >mdi mdi-close-circle-outline</v-icon
                      >{{ error_message }}</v-col
                    >
                    <v-col cols="12" md="12" class="pt-0">
                      <v-tooltip :text="this.$t('sign_in')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <div v-bind="props" class="d-inline-block w-100">
                            <v-btn
                              variant="flat"
                              color="#fff;"
                              small
                              class="btn-theme-blue w-100"
                              @click="login"
                              @keyup.enter="login"
                              :disabled="!valid || btnloading"
                              >{{ $t("sign_in") }}
                            </v-btn>
                          </div>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <a class="a-underline">
                      <p>
                        <router-link to="/forgot_password">
                          {{ $t("recoverpassword") }}
                        </router-link>
                      </p>
                    </a>
                  </v-row>

                  <div class="divider" />
                  <div class="d-flex align-items-center mt-5">
                    <div>
                      <h6 class="mb-0">
                        {{ $t("no_account") }}
                        <router-link
                          :to="{
                            name: 'register_user',
                          }"
                        >
                          {{ $t("register_here") }}
                        </router-link>
                      </h6>
                    </div>
                  </div>
                  <div class="divider" />
                  <div class="d-flex">
                    <div
                      v-bind:class="[this.sel_lang == 'en' ? 'selected' : '']"
                      class="lang_option"
                      @click="setUserLang('en')"
                    >
                      {{ $t("english") }}
                    </div>
                    <div
                      v-bind:class="[this.sel_lang == 'ar' ? 'selected' : '']"
                      class="lang_option"
                      @click="setUserLang('ar')"
                    >
                      {{ $t("arabic") }}
                    </div>
                  </div>
                </v-container>
              </v-form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import localStorageWrapper from "../../localStorageWrapper.js";
import { getToken, getMessaging } from "firebase/messaging";

export default {
  name: "LoginPage",
  data: () => ({
    userdata: {
      email: "",
      password: "",
      token_id: "",
    },
    firebase_vapid: process.env.VUE_APP_FIREBASE_VAPID_KEY,
    valid: false,
    show1: false,
    user: "",
    btnloading: false,
    userprofile: "",
    loader: false,
    app_image_url: "",
    application_name: "",
    app_name: "",
    error_message: "",
    show_error: false,
    sel_lang: "en",
  }),
  computed: {
    ...mapState({
      userDetails: (state) => state.auth.userData,
      isAuth: (state) => state.auth.isAuthenticated,
    }),

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) => /.+@.+/.test(v) || this.$t("email_valid"),
      ];
    },

    // ...mapGetters(["errors"]),
  },

  mounted() {
    this.fetchAppImageUrl();
    this.selectedLang();
  },

  created() {
    if (window.location.protocol === "https:") {
      const messaging = getMessaging();
      getToken(messaging, { vapidKey: this.firebase_vapid })
        .then((currentToken) => {
          if (currentToken) {
            console.log("token id", currentToken);
            this.userdata.token_id = currentToken;
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
        });
    }
  },

  methods: {
    setUserLang(lang) {
      localStorage.setItem("pref_lang", lang);
      this.$i18n.locale = lang;
      let newRoute = {
        name: this.$route.name,
        params: { ...this.$route.params, lang: lang },
      };
      this.$router.push(newRoute);
      this.selectedLang();
    },
    selectedLang() {
      if (localStorage.getItem("pref_lang")) {
        this.sel_lang = localStorage.getItem("pref_lang");
      } else {
        this.sel_lang = "en";
      }
    },
    fetchAppImageUrl() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_image_url", {})
        .then((res) => {
          this.app_image_url = res.data.parameter_image;
          this.application_name = res.data.application_name;
          localStorageWrapper.setItem(
            "Application_Name",
            this.application_name
          );

          if (this.app_image_url != null) {
            localStorageWrapper.setItem(
              "App_Image_Url",
              this.app_image_url.image_full_url
            );
            this.app_image_url = localStorage.getItem("App_Image_Url");
          } else {
            localStorageWrapper.removeItem("App_Image_Url");
            this.app_image_url = "";
          }
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },
    ...mapActions("auth", ["loginRequest"]),
    async login() {
      this.loader = true;
      await this.loginRequest(this.userdata)
        .then(() => {
          this.btnloading = true;
          const lang = localStorage.getItem("pref_lang");
          this.$i18n.locale = lang;
          let newRoute = {
            name: "dashboard",
            params: { lang: lang },
          };
          // alert('pushing to dashboard');
          console.log(newRoute);
          this.$router.push(newRoute);
          //this.$router.push(newRoute);
          this.loader = false;
        })
        .catch((err) => {
          this.error_message = err.response.data.message;
          this.loader = false;
          this.show_error = true;
          console.log(err.response.data.message);
        })
        .finally(() => {
          this.btnloading = false;
        });
    },
  },
};
</script>

<style scoped>
.v-messages__message,
.v-text-field--is-booted .error--text {
  color: red;
}

.font-login {
  font-family: "Goudy Old Style";
  font-size: 35px;
  color: black;
}

.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.h-120 {
  height: 120%;
}

.font-sign-in-msg {
  font-size: 1.175rem;
  font-weight: normal;
}
.error_message {
  color: red;
  font-style: italic;
}
.lang_option {
  font-size: 14px;
  margin: 10px 10px;
  color: grey;
}
.lang_option:hover {
  font-weight: bold;
  cursor: pointer;
  transition: 0.1s;
  color: black;
}
.selected {
  font-weight: bold;
  color: black;
}
</style>
