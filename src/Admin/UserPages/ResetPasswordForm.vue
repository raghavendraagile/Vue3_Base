<template>
  <div class="gradient-custom ma-0">
    <transition name="fade" mode="out-in" appear>
      <div class="background form_alignment">
        <b-row>
          <b-col
            lg="8"
            md="12"
            class="h-120 d-flex bg-transparent justify-content-center align-items-center"
          >
            <v-card>
              <b-col lg="9" md="10" sm="12" class="mx-3 p-3 v-card">
                <div
                  style="
                    display: flex;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <!-- <img src="../../assets/images/TradieSafe_logo.png" /> -->
                  <div class="w-100 d-flex" style="flex-direction: column">
                    <h4 class="mb-0"></h4>
                    <div class="font-login">
                      <div v-if="app_image_url">
                        <span>
                          <img
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
                    <span class="font-sign-in-msg">{{
                      $t("reset_password")
                    }}</span>
                  </div>
                </div>

                <v-divider></v-divider>
                <div class="card-body">
                  <div
                    style="color: red"
                    class="v-messages__message"
                    v-if="status == 'E'"
                  >
                    {{ message }}
                  </div>
                  <div style="color: green" v-if="status == 'S'">
                    {{ message }}
                  </div>
                </div>
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
                    <div class="position-relative" style="max-width: 440px">
                      <div style="display: flex; flex-direction: row">
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
                      <v-overlay absolute :value="loading">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-overlay>
                    </div>
                  </div>
                  <div class="form-group">
                    <span v-show="textvisible">
                      <span class="time_data">
                        {{ $t("resend_code_format") }} {{ timecount }}
                        {{ $t("seconds") }}
                      </span>
                    </span>

                    <div class="Resendbtn mt-3">
                      <v-tooltip
                        :text="this.$t('resend_code')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <div class="d-inline-block">
                            <v-btn
                              small
                              color="blue"
                              size="small"
                              plain
                              @click="requestpassword"
                              v-bind="props"
                              :disabled="isdisabled"
                              :loading="isbtnLoading"
                              v-show="btnvisible"
                              >{{ $t("resend_code") }}
                            </v-btn>
                          </div>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12 mt-5 pb-2">
                      <v-tooltip :text="this.$t('password')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            class="required_field show_icon"
                            :append-inner-icon="
                              show2 ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="show2 ? 'text' : 'password'"
                            @click:append-inner="show2 = !show2"
                            v-model="new_password"
                            :rules="[...passwordRules, ...fieldRules]"
                            v-bind:label="$t('password')"
                            variant="outlined"
                            density="compact"
                            required
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                    <div class="col-md-12 pb-2">
                      <v-tooltip :text="this.$t('lastname')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            class="required_field show_icon"
                            :append-inner-icon="
                              show1 ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="show1 ? 'text' : 'password'"
                            @click:append-inner="show1 = !show1"
                            v-model="password_confirmation"
                            :rules="[
                              !!password_confirmation || $t('password_confirm'),
                              new_password === password_confirmation ||
                                $t('confirm_password_match'),
                            ]"
                            v-bind:label="$t('confirm_password')"
                            required
                            @keyup.enter="resetPassword"
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </v-form>
                <div class="d-flex" style="float: right">
                  <v-tooltip :text="this.$t('cancel')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <div class="d-inline-block">
                        <v-btn
                          size="small"
                          class="ma-1 font-weight-bold cancel-btn"
                          color="cancel"
                          plain
                          small
                          :disabled="isBtnLoading"
                          v-bind="props"
                          @click="$router.go(-1)"
                        >
                          {{ $t("cancel") }}
                        </v-btn>
                      </div>
                    </template>
                  </v-tooltip>
                  <v-tooltip :text="this.$t('resend_code')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <div class="d-inline-block">
                        <v-btn
                          :disabled="isDisabled"
                          :loading="isBtnLoading"
                          @click="resetPassword"
                          size="small"
                          color="green"
                          v-bind="props"
                          >{{ $t("submit") }}
                        </v-btn>
                      </div>
                    </template>
                  </v-tooltip>
                </div>
              </b-col>
            </v-card>
          </b-col>
        </b-row>
      </div>
    </transition>
  </div>
</template>

<script>
import localStorageWrapper from "../../localStorageWrapper.js";

export default {
  name: "LoginPage",
  data: () => ({
    token: null,
    emaildata: null,
    new_password: "",
    password_confirmation: "",
    verification_code: "",
    has_error: false,
    status: "",
    message: "",
    data: "",
    user: "",
    valid: true,
    isDisabled: false,
    isBtnLoading: false,
    isdisabled: false,
    isbtnLoading: false,
    confirmpasswordtoggle: String,
    newpasswordtoggle: String,
    loading: false,
    snackbar: false,
    snackbarColor: "default",
    show1: false,
    show2: false,
    otp: "",
    text: "",
    expectedOtp: "",
    length: 7,
    btnvisible: false,
    timecount: 60,
    textvisible: true,
    app_image_url: "",
    application_name: "",
    app_name: "",
    loader: false,
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    passwordRules() {
      return [(v) => v.length >= 8 || this.$t("password_length")];
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
    this.emaildata = localStorage.getItem("verifyemail");
    setTimeout(() => (this.btnvisible = true), 60000);
    setTimeout(() => (this.textvisible = false), 60000);
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
    "$route.params.email": {
      immediate: true,
      handler() {
        if (this.$route.params.email) {
          this.email = this.$route.params.email;
          this.emaildata = this.$route.params.email;
        }
      },
    },
  },
  created() {
    this.getAppImage();
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
    requestpassword() {
      this.timecount = 60;
      this.textvisible = true;
      setTimeout(() => (this.textvisible = false), 60000);
      this.btnvisible = false;
      setTimeout(() => (this.btnvisible = true), 60000);
      this.isdisabled = true;
      this.isbtnLoading = true;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "resend_otp_validate?email=" +
            this.email
        )
        .then((response) => {
          this.response = response.data;
          this.message = response.data.message;
          this.status = response.data.status;

          this.isdisabled = false;
          this.isbtnLoading = false;
        })
        .catch((err) => {
          this.isdisabled = false;
          this.isbtnLoading = false;
          console.log(err);
        });
    },
    resetPassword() {
      if (this.$refs.form.validate()) {
        if (this.new_password != this.password_confirmation) {
          this.status = "E";
          this.message = this.$t("password_not_match");
          this.isDisabled = false;
          this.isBtnLoading = false;
          // this.$vuetify.goTo(0);
        } else {
          this.isDisabled = true;
          this.isBtnLoading = true;
          this.$axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "resetpassword", {
              otp: this.verification_code,
              email: this.email,
              password: this.new_password,
              password_confirmation: this.password_confirmation,
            })
            .then(
              (response) => {
                if (Array.isArray(response.data.message)) {
                  this.array_data = response.data.message.toString();
                } else {
                  this.array_data = response.data.message;
                }
                this.message = response.data.message;
                this.status = response.data.status;
                if (response.data.status == "S") {
                  setTimeout(() => this.$router.push({ name: "login" }), 1000);
                  localStorage.removeItem("verifyemail");
                } else if (response.data.status == "E") {
                  this.message = response.data.message;
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                console.log(error);
                this.message = this.$t("too_many_request");
              }
            )
            .catch((err) => {
              console.log("error data", err);
            });
        }
      }
    },
    handleOnComplete(resp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = resp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${resp}" (${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
    },
    requestResetPassword() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN +
              "reset_password?email=" +
              this.email +
              "&role=User"
          )
          .then((response) => {
            console.log(response);
            this.response = response.data;
            this.message = response.data.message;
            this.status = response.data.status;
            if (this.status == "S") {
              this.$toast.success(this.message);
              setTimeout(
                () =>
                  this.$router.push({
                    name: "forgot_password",
                    params: { email: this.email },
                  }),
                1000
              );
            } else if (this.status == "E") {
              this.$toast.error(this.message);
            }
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.loader = false;
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.loader = false;
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
.time_data {
  width: 232px;
  margin-left: 0px;
}
.Resendbtn {
  margin-left: -7px;
  display: flex;
  justify-content: end;
}
.show_icon /deep/ i {
  z-index: 1000;
}
.cancel-btn {
  color: white;
  margin-right: 9px !important;
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
.test-start {
  text-align: start;
}
.form_alignment {
  display: flex;
  justify-content: center;
}
</style>
