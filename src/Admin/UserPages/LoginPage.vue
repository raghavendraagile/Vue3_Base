<template>
  <v-app>
    <content-loader v-if="loader" />

    <div class="background d-flex justify-center align-center">
      <v-card class="pa-6 login-card" elevation="4">
        <!-- ================= LOGO ================= -->
        <div class="text-center mb-4">
          <img v-if="app_image_url" :src="app_image_url" width="130" />
          <h3 v-else>{{ application_name }}</h3>
        </div>

        <v-divider class="mb-4" />

        <!-- ================= LOGIN FORM ==================== -->
        <v-form v-if="step === 'login'" ref="form" v-model="valid">
          <v-text-field
            label="Email"
            v-model="userdata.email"
            :rules="emailRules"
            density="compact"
            variant="outlined"
            @keyup.enter="sendLoginOtp"
          />

          <v-text-field
            label="Password"
            v-model="userdata.password"
            :type="showPass ? 'text' : 'password'"
            :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPass = !showPass"
            density="compact"
            variant="outlined"
            class="mt-3"
            @keyup.enter="sendLoginOtp"
          />

          <v-btn
            block
            class="mt-4 btn-theme-blue"
            :loading="btnloading"
            :disabled="!valid"
            @click="sendLoginOtp"
          >
            Sign In
          </v-btn>                    
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
        </v-form>

        <!-- ================= OTP SECTION =================== -->
        <div v-if="step === 'otp'" class="text-center">
          <p class="mb-3">
            OTP sent to <b>{{ userdata.email }}</b>
          </p>

          <v-otp-input
            v-model:value="verification_code"
            :num-inputs="6"
            separator=" "
            input-classes="otp-input"
            :should-auto-focus="true"
          />

          <!-- TIMER -->
          <div class="mt-3 grey--text">
            <span v-if="timecount > 0"> Resend in {{ timecount }}s </span>

            <v-btn v-else size="small" text @click="resendLoginOtp">
              Resend OTP
            </v-btn>
          </div>

          <div class="d-flex mt-4">
            <v-btn small text @click="step = 'login'"> Back </v-btn>

            <v-spacer />

            <v-btn
              color="green"
              :loading="isBtnLoading"
              :disabled="verification_code.length !== 6"
              @click="verifyotp"
            >
              Submit
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      step: "login",

      userdata: {
        email: "",
        password: "",
      },
      verification_code: "",
      valid: false,
      loader: false,
      btnloading: false,
      isBtnLoading: false,
      showPass: false,
      app_image_url: "",
      application_name: "",
      timecount: 60,
      timer: null,
      login_otp_enabled: 0,
    };
  },

  computed: {
    emailRules() {
      return [
        (v) => !!v || "Email required",
        (v) => /.+@.+/.test(v) || "Invalid email",
      ];
    },
  },

  mounted() {
    this.fetchAppImage();
  },

  methods: {
    startTimer() {
      clearInterval(this.timer); // stop old timer if exists

      this.timer = setInterval(() => {
        if (this.timecount > 0) {
          this.timecount--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },

    /* ================= FETCH APP LOGO ================= */
    fetchAppImage() {
      this.$axios.get("fetch_image_url").then((res) => {
        this.application_name = res.data.application_name;
        this.login_otp_enabled = res.data.login_otp_enabled.status;
        if (res.data.parameter_image) {
          this.app_image_url = res.data.parameter_image.image_full_url;
        }
      });
    },

    /* ================= SEND OTP ================= */
    async sendLoginOtp() {
      if (!this.$refs.form.validate()) return;

      this.loader = true;
      this.btnloading = true;

      try {
        // ================= OTP FLOW =================
        const otpEnabled = Number(this.login_otp_enabled) === 1;
        if (otpEnabled) {
          const res = await this.$axios.post(
            `send_login_otp?email=${this.userdata.email}&password=${this.userdata.password}&role=User`
          );

          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.step = "otp";
            this.timecount = 60;
            this.startTimer();
          } else {
            this.$toast.error(res.data.message);
          }
        } else {
          await this.$store.dispatch("auth/loginRequest", this.userdata);
          localStorage.setItem("active_menu", "Dashboard");
          this.$router.push({ name: "dashboard" });
        }
      } 

      // ================= COMMON ERROR HANDLING =================
      catch (err) {
        if (err.response) {
          if (err.response.status === 429) {
            this.$toast.error("Too many attempts. Please try again after 2 minutes.");
          } else {
            this.$toast.error(err.response.data.message || "Something went wrong");
          }
        } else {
          this.$toast.error("Network error");
        }
      } 

      // ================= COMMON LOADER STOP =================
      finally {
        this.loader = false;
        this.btnloading = false;
      }
    },
    /* ================= VERIFY OTP ================= */
    verifyotp() {
      this.loader = true;
      this.isBtnLoading = true;

      this.$axios
        .post("login_otp_validate", {
          otp: this.verification_code,
          email: this.userdata.email,
        })
        .then(async (res) => {
          if (res.data.status === "S") {
            await this.$store.dispatch("auth/loginRequest", this.userdata);
            this.$router.push({ name: "dashboard" });
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
          this.isBtnLoading = false;
        });
    },

    /* ================= RESEND OTP ================= */
    resendLoginOtp() {
      this.timecount = 60;
      this.startTimer();
      this.$axios.post(`resend_otp_validate?email=${this.userdata.email}`);
      this.$toast.success("OTP resent");
    },
  },
};
</script>

<style scoped>

.login-card {
  width: 410px;
  border-radius: 12px;
}

.otp-input {
  width: 45px !important;
  height: 45px;
  font-size: 18px;
}
</style>