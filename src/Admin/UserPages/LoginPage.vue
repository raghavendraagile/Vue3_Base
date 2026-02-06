<template>
  <v-app>
    <content-loader v-if="loader"></content-loader>
    <div>
      <transition name="fade" mode="out-in" appear>
        <div class="background">
          <div class="login-box-custom">
            <div class="d-flex flex-column">
              <div class="w-100 d-flex" style="flex-direction: column">
                <!-- <h4 class="mb-0">{{ $t("welcome_msg") }}</h4> -->
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
                <!-- <span class="font-sign-in-msg">{{ $t("sign_in_msg") }}</span> -->
              </div>
            </div>
            <v-divider></v-divider>
            <div>
              <v-form v-model="valid" class="w-100" ref="form">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="12" class="pb-0 pt-0">
                      <label
                        v-bind:class="[sel_lang == 'ar' ? 'text-right' : '']"
                        >{{ $t("email") }}</label
                      >
                      <v-tooltip :text="$t('email')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="userdata.email"
                            :rules="emailRules"
                            v-bind:class="[sel_lang == 'ar' ? 'rtl' : '']"
                            @keyup.enter="sendLoginOtp"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" md="12" class="pt-0">
                      <label
                        v-bind:class="[sel_lang == 'ar' ? 'text-right' : '']"
                        >{{ $t("password") }}</label
                      >
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
                            @keyup.enter="sendLoginOtp"
                            counter
                            v-bind:class="[sel_lang == 'ar' ? 'rtl' : '']"
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
                              color="#fff"
                              small
                              class="btn-theme-blue w-100"
                              @click="sendLoginOtp"
                              @keyup.enter="sendLoginOtp"
                              :disabled="!valid || btnloading"
                              >{{ $t("sign_in") }}
                            </v-btn>
                          </div>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <a class="a-underline">
                      <p>
                        <router-link
                          :to="{
                            name: 'forgot_password',
                          }"
                        >
                          <!-- <router-link to="/forgot_password"> -->
                          {{ $t("recoverpassword") }}
                        </router-link>
                      </p>
                    </a>
                  </v-row>

                  <div class="divider" />
                  <!-- <div class="d-flex align-items-center mt-5">
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
                  </div> -->
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
import localStorageWrapper from "../../localStorageWrapper.js";

export default {
  name: "LoginPage",
  data: () => ({
    userdata: {
      email: "",
      password: "",
      token_id: "",
    },
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
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) => /.+@.+/.test(v) || this.$t("email_valid"),
      ];
    },
  },

  mounted() {
    this.fetchAppImageUrl();
    this.selectedLang();
  },

  created() {},

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
        .get("fetch_image_url", {})
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

    sendLoginOtp() {
      if (this.$refs.form.validate()) {
        this.btnloading = true;
        this.loader = true;
        this.$axios
          .post("send_login_otp?email=" + this.userdata.email + "&role=User")
          .then((response) => {
            this.response = response.data;
            this.message = response.data.message;
            this.status = response.data.status;
            if (this.status == "S") {
              this.btnloading = true;
              this.$toast.success(this.message);
              if (this.userdata.email) {
                localStorageWrapper.setItem("verifyemail", this.userdata.email);
              }
              localStorage.setItem("active_menu", "OTP Validation");

              // Redirect to dashboard after login is successful
              this.$router.push({
                name: "login-otp-validation",
                query: {
                  userdata: JSON.stringify(this.userdata),
                },
              });
              setTimeout(() => {
                this.btnloading = false;
                this.loader = false;
              }, 500);
            } else if (this.status == "E") {
              this.$toast.error(this.message);
              this.btnloading = false;
              this.loader = false;
            }
          })
          .catch((err) => {
            this.btnloading = false;
            this.loader = false;
            this.error_message = err.response.data.message;
            this.show_error = true;
            console.log(err);
          });
      }
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
