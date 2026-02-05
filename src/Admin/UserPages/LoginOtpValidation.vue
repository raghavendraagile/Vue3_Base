<template>
  <content-loader v-if="loader"></content-loader>
  <div
    class="background m-0"
    style="display: flex; justify-content: center; align-items: center"
  >
    <v-card class="pa-5">
      <div
        style="
          display: flex;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div class="w-100 d-flex" style="flex-direction: column">
          <h4 class="mb-0"></h4>
          <div class="font-login">
            <div v-if="app_image_url">
              <span>
                <img v-bind:src="app_image_url" style="width: 130px" />
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
          <span class="font-sign-in-msg">{{ $t("verification") }}</span>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="card-body">
        <v-form autocomplete="off" ref="form" v-model="valid">
          <div class="otptimer-align test-start mb-5">
            <i>
              <span style="color: grey" class="form-group">
                {{ $t("email") }} :
                <span>{{ email }}</span>
              </span>
            </i>
          </div>

          <div class="form-group" style="margin-left: -10px">
            <div>
              <v-otp-input
                ref="otpInput"
                v-model:value="verification_code"
                input-classes="otp-input"
                separator=" "
                :num-inputs="6"
                :should-auto-focus="true"
                input-type="letter-numeric"
                @on-change="handleOnChange"
                @on-complete="handleOnComplete"
              />
            </div>
          </div>
          <div class="form-group mt-5">
            <span v-show="textvisible">
              <span class="time_data">
                {{ $t("resend_code_format") }} {{ timecount }}
                {{ $t("seconds") }}
              </span>
            </span>

            <div class="Resendbtn">
              <v-tooltip :text="this.$t('resend_code')" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="d-inline-block">
                    <v-btn
                      size="small"
                      class="mt-3 mr-2"
                      @click="resendLoginOtp"
                      color="blue"
                      :disabled="isdisabled"
                      :loading="isbtnLoading"
                      v-show="btnvisible"
                    >
                      {{ $t("resend_code") }}
                    </v-btn>
                  </div>
                </template>
              </v-tooltip>
            </div>
          </div>
          <hr />
          <div class="d-flex" style="float: right">
            <v-tooltip :text="this.$t('cancel')" location="bottom">
              <template v-slot:activator="{ props }">
                <div v-on="on" class="d-inline-block mr-2">
                  <v-btn
                    v-on="on"
                    x-small
                    size="small"
                    v-bind="props"
                    :disabled="isDisabled"
                    color="cancel"
                    @click="$router.go(-1)"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
              <span>{{ $t("cancel") }}</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <div v-on="on" class="d-inline-block">
                  <v-btn
                    :disabled="isDisabled || verification_code.length != 6"
                    v-on="on"
                    x-small
                    v-bind="props"
                    :loading="isDisabled"
                    color="green"
                    class="mr-2 secondary"
                    size="small"
                    @click="verifyotp"
                  >
                    {{ $t("submit") }}
                  </v-btn>
                </div>
              </template>
              <span>{{ $t("submit") }}</span>
            </v-tooltip>
          </div>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
import localStorageWrapper from "../../localStorageWrapper.js";
import { mapActions, mapState } from "vuex";

export default {
  components: {},
  data() {
    return {
      userdata: {
        email: "",
        password: "",
        token_id: "",
      },
      token: null,
      emaildata: null,
      application_name: "",
      app_image_url: "",
      new_password: "",
      password_confirmation: "",
      verification_code: "",
      has_error: false,
      status: "",
      message: "",
      data: "",
      user: "",
      isdisabled: false,
      valid: true,
      isDisabled: false,
      isBtnLoading: false,
      confirmpasswordtoggle: String,
      newpasswordtoggle: String,
      loading: false,
      snackbar: false,
      snackbarColor: "default",
      otp: "",
      text: "",
      expectedOtp: "",
      textvisible: true,
      btnvisible: false,
      isbtnLoading: false,
      timecount: 60,
      loader: false,
      show_error: false,
    };
  },
  computed: {
    ...mapState({
      userDetails: (state) => state.auth.userData,
      isAuth: (state) => state.auth.isAuthenticated,
    }),

    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    passwordRules() {
      return [
        (v) => v.length >= 8 || "Password must have atleast 8 characters",
      ];
    },
  },
  watch: {
    timecount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timecount--;
          }, 1000);
        }
      },
      immediate: true,
    },
    $route: {
      immediate: true,
      handler() {
        this.email = localStorage.getItem("verifyemail");
      },
    },
  },
  mounted() {
    if (localStorage.getItem("Application_Name")) {
      this.application_name = localStorage.getItem("Application_Name");
    }
    if (localStorage.getItem("App_Image_Url") != null) {
      this.app_image_url = localStorage.getItem("App_Image_Url");
    } else {
      this.app_image_url = "";
    }
    this.emaildata = localStorage.getItem("verifyemail");
    setTimeout(() => (this.btnvisible = true), 60000);
    setTimeout(() => (this.textvisible = false), 60000);
  },
  created() {
    this.getAppImage();
    if (this.$route.query.userdata) {
      this.userdata = JSON.parse(this.$route.query.userdata);
    }
  },
  methods: {
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
    onFinish(rsp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = rsp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${rsp}" (${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
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
    verifyotp() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        this.$axios
          .post("login_otp_validate", {
            otp: this.verification_code,
            email: this.email,
          })
          .then(
            (response) => {
              this.message = response.data.message;
              this.status = response.data.status;
              if (response.data.status == "S") {
                this.$toast.success(this.message);
                setTimeout(() => {
                  this.loader = false;
                  this.login();
                }, 500);
              } else if (response.data.status == "E") {
                this.isDisabled = false;
                this.message = response.data.message;
                this.$toast.error(this.message);
                this.isDisabled = false;
                this.isBtnLoading = false;
                this.loader = false;
              }
            },
            (error) => {
              console.log(error);
              this.$toast.error(this.$t("something_went_wrong"));
              this.message = this.$t("too_many_request");
              this.isBtnLoading = false;
              this.isDisabled = false;
              this.loader = false;
              setTimeout(() => (this.isDisabled = false), 60000);
            }
          );
      }
    },
    resendLoginOtp() {
      this.timecount = 60;
      this.textvisible = true;
      setTimeout(() => (this.textvisible = false), 60000);
      this.btnvisible = false;
      setTimeout(() => (this.btnvisible = true), 60000);
      this.isdisabled = true;
      this.isbtnLoading = true;
      this.$axios
        .post(
            "resend_otp_validate?email=" +
            this.email
        )
        .then(
          (response) => {
            this.response = response.data;
            this.message = response.data.message;
            this.$toast.success(this.message);
            this.status = response.data.status;
            this.isdisabled = false;
            this.isbtnLoading = false;
          },
          (error) => {
            console.log(error);
            this.message = this.$t("too_many_request");
            this.$toast.error(this.message);
            this.status = "E";
            this.btnvisible = false;
            this.isdisabled = false;
            this.isbtnLoading = false;
            setTimeout(() => (this.btnvisible = true), 60000);
          }
        )
        .catch((err) => {
          this.isdisabled = false;
          this.isbtnLoading = false;
          this.$toast.error("Something went wrong.");
          console.log("error data resendLoginOtp", err);
        });
    },
    cancel() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>
<style scoped>
.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.Resendbtn {
  margin-left: -7px;
  display: flex;
  justify-content: end;
}
.card_container {
  width: 450px;
}
.gradient-custom {
  /* fallback for old browsers */
  background: #beb1c0 !important;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(
    to bottom right,
    rgb(231, 221, 232),
    rgb(188, 166, 169)
  );

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(
    to bottom right,
    rgb(215, 204, 216),
    rgb(227, 223, 223)
  );
}
</style>