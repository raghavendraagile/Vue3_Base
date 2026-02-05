<template>
  <v-app>
    <content-loader v-if="loader"></content-loader>
    <div>
      <transition name="fade" mode="out-in" appear>
        <div class="background">
          <!-- new login form -->
          <div class="login-box-custom">
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
            <div class="heading">Sign In</div>
            <v-divider></v-divider>
            <form class="form" @submit.prevent="login">
              <!-- Email -->
              <input
                v-model="userdata.email"
                required
                class="input"
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                @input="
                  formErrors.email = validateField(userdata.email, emailRules)
                "
                @keyup.enter="login"
              />
              <span v-if="formErrors.email" class="error-text">
                {{ formErrors.email }}
              </span>

              <!-- Password -->
              <input
                v-model="userdata.password"
                required
                class="input"
                :type="show1 ? 'text' : 'password'"
                name="password"
                id="password"
                placeholder="Password"
                @input="
                  formErrors.password = validateField(
                    userdata.password,
                    fieldRules
                  )
                "
                @keyup.enter="login"
              />
              <span v-if="formErrors.password" class="error-text">
                {{ formErrors.password }}
              </span>

              <!-- Forgot password -->
              <span class="forgot-password">
                <router-link :to="{ name: 'forgot_password' }">
                  Forgot Password ?
                </router-link>
              </span>

              <!-- Submit -->
              <button
                class="login-button"
                type="submit"
                :disabled="btnloading || !validateForm()"
              >
                <span v-if="!btnloading">Sign In</span>
                <span v-else>Signing in...</span>
              </button>
            </form>

            <!-- Social login -->
            <!-- <div class="social-account-container">
              <span class="title">Or Sign in with</span>

              <div class="social-accounts">
                <button class="social-button google" type="button">
                 
                </button>

                <button class="social-button apple" type="button">
                  
                </button>

                <button class="social-button twitter" type="button">
                 
                </button>
              </div>
            </div> -->

            <!-- <span class="agreement">
              <a href="#">Learn user licence agreement</a>
            </span> -->
          </div>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import localStorageWrapper from "../../localStorageWrapper.js";
// import { getToken, getMessaging } from "firebase/messaging";

export default {
  name: "LoginPage",
  data: () => ({
    userdata: {
      email: "",
      password: "",
      token_id: "",
    },
    // firebase_vapid: process.env.VUE_APP_FIREBASE_VAPID_KEY,
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
    formErrors: {
      email: "",
      password: "",
    },
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
    // if (window.location.protocol === "https:") {
    //   const messaging = getMessaging();
    //   getToken(messaging, { vapidKey: this.firebase_vapid })
    //     .then((currentToken) => {
    //       if (currentToken) {
    //         console.log("token id", currentToken);
    //         this.userdata.token_id = currentToken;
    //       } else {
    //         console.log(
    //           "No registration token available. Request permission to generate one."
    //         );
    //       }
    //     })
    //     .catch((err) => {
    //       console.log("An error occurred while retrieving token. ", err);
    //     });
    // }
  },

  methods: {
    validateField(value, rules) {
      for (const rule of rules) {
        const result = rule(value);
        if (result !== true) return result;
      }
      return "";
    },

    validateForm() {
      this.formErrors.email = this.validateField(
        this.userdata.email,
        this.emailRules
      );

      this.formErrors.password = this.validateField(
        this.userdata.password,
        this.fieldRules
      );

      return !this.formErrors.email && !this.formErrors.password;
    },
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
        .get(import.meta.env.VITE_API_URL_ADMIN + "fetch_image_url", {})
        .then((res) => {
          console.log("res.data");
          console.log(res.data);
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
      this.show_error = false; // reset error
      try {
        // Wait for loginRequest to complete and update Vuex state
        await this.loginRequest(this.userdata);

        // Mark button as loading
        this.btnloading = true;

        // Set default active menu
        localStorage.setItem("active_menu", "Dashboard");

        // Redirect to dashboard after login is successful
        this.$router.push({ name: "dashboard" });
      } catch (err) {
        // Handle errors
        this.error_message = err.response?.data?.message || "Login failed";
        this.show_error = true;
        console.error(err.response?.data?.message);
      } finally {
        // Stop loader and button loading
        this.loader = false;
        this.btnloading = false;
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
.container {
  max-width: 350px;
  background: #f8f9fd;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
  margin: 20px;
}

.heading {
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: rgb(16, 137, 211);
}

.form {
  margin-top: 20px;
}

.form .input {
  width: 100%;
  background: white;
  border: none;
  padding: 15px 20px;
  border-radius: 20px;
  margin-top: 15px;
  box-shadow: #cff0ff 0px 10px 10px -5px;
  border-inline: 2px solid transparent;
}

.form .input::-moz-placeholder {
  color: rgb(170, 170, 170);
}

.form .input::placeholder {
  color: rgb(170, 170, 170);
}

.form .input:focus {
  outline: none;
  border-inline: 2px solid #12b1d1;
}

.form .forgot-password {
  display: block;
  margin-top: 10px;
  margin-left: 10px;
}

.form .forgot-password a {
  font-size: 11px;
  color: #0099ff;
  text-decoration: none;
}

.form .login-button {
  display: block;
  width: 100%;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    rgb(16, 137, 211) 0%,
    rgb(18, 177, 209) 100%
  );
  color: white;
  padding-block: 15px;
  margin: 20px auto;
  border-radius: 20px;
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
  border: none;
  transition: all 0.2s ease-in-out;
}

.form .login-button:hover {
  transform: scale(1.03);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
}

.form .login-button:active {
  transform: scale(0.95);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
}

.social-account-container {
  margin-top: 25px;
}

.social-account-container .title {
  display: block;
  text-align: center;
  font-size: 10px;
  color: rgb(170, 170, 170);
}

.social-account-container .social-accounts {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 5px;
}

.social-account-container .social-accounts .social-button {
  background: linear-gradient(45deg, rgb(0, 0, 0) 0%, rgb(112, 112, 112) 100%);
  border: 5px solid white;
  padding: 5px;
  border-radius: 50%;
  width: 40px;
  aspect-ratio: 1;
  display: grid;
  place-content: center;
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 12px 10px -8px;
  transition: all 0.2s ease-in-out;
}

.social-account-container .social-accounts .social-button .svg {
  fill: white;
  margin: auto;
}

.social-account-container .social-accounts .social-button:hover {
  transform: scale(1.2);
}

.social-account-container .social-accounts .social-button:active {
  transform: scale(0.9);
}

.agreement {
  display: block;
  text-align: center;
  margin-top: 15px;
}

.agreement a {
  text-decoration: none;
  color: #0099ff;
  font-size: 9px;
}
.error-text {
  font-size: 10px;
  color: #e53935;
  margin-left: 12px;
}
</style>
