<template>
  <content-loader v-if="loader"></content-loader>
  <section class="vh-100 background">
    <div class="container py-5 h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-12 col-lg-9 col-xl-5">
          <div
            class="card shadow-2-strong card-registration"
            style="border-radius: 15px"
          >
            <div class="card-body px-4">
              <div class="font-login text-center">
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
              <h4 class="pb-md-0 text-center">{{ $t("registration_form") }}</h4>
              <v-divider></v-divider>

              <v-form ref="form" v-model="valid" lazy-validation>
                <div class="row mt-2">
                  <div class="col-md-6 mb-2">
                    <div class="form-outline">
                      <v-tooltip :text="this.$t('firstname')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="users.name"
                            v-bind="props"
                            :rules="fieldRules1"
                            v-bind:label="$t('firstname')"
                            required
                            variant="outlined"
                            density="compact"
                            class="required_field"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                  <div class="col-md-6 mb-2">
                    <div class="form-outline">
                      <v-tooltip :text="this.$t('lastname')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="users.lastname"
                            :rules="fieldRules1"
                            v-bind:label="$t('lastname')"
                            required
                            variant="outlined"
                            density="compact"
                            class="required_field"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12 mb-2 d-flex align-items-center">
                    <div class="form-outline datepicker w-100">
                      <v-tooltip :text="this.$t('lastname')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="users.email"
                            :rules="[...fieldRules1,...emailRules]"
                            @keyup.enter="login"
                            v-bind:label="$t('email')"
                            variant="outlined"
                            density="compact"
                            required
                            class="required_field"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12 pb-2">
                    <v-tooltip :text="this.$t('password')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          class="required_field show_icon"
                          :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show2 ? 'text' : 'password'"
                          @click:append-inner="show2 = !show2"
                          v-on="on"
                          v-model="users.password"
                          :rules="[...passwordRules, ...fieldRules1]"
                          v-bind:label="$t('password')"
                          required
                          @keyup.enter="saveUser"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </div>
                  <div class="col-md-12 pb-2">
                    <v-tooltip
                      :text="this.$t('confirm_password')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          class="required_field show_icon"
                          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          @click:append-inner="show1 = !show1"
                          v-on="on"
                          v-model="users.confirm_password"
                          :rules="[
                            !!users.confirm_password || $t('password_confirm'),
                            users.password === users.confirm_password ||
                              $t('confirm_password_match'),
                          ]"
                          v-bind:label="$t('confirm_password')"
                          required
                          @keyup.enter="saveUser"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </div>
                </div>
                <!-- <div v-if="role_array" class="row">
                  <v-radio-group
                    required
                    :rules="fieldRules1"
                    inline
                    v-model="users.role_id"
                    :label="$t('is_trade_or_principle')"
                    class="radio_item"
                  >
                    <v-radio
                      v-for="(role, i) in role_array"
                      :key="i"
                      :label="role.rolename"
                      :value="role.id"
                    ></v-radio>
                  </v-radio-group>
                </div> -->
              </v-form>
              <div>
                <v-btn
                  :disabled="isDisabled"
                  v-bind="props"
                  :loading="isDisabled"
                  block
                  color="btn-theme-blue darken-1"
                  @click="saveUser"
                  small
                  class="mr-2 btn-theme-blue"
                >
                  {{ $t("register") }}
                </v-btn>
              </div>

              <div class="row text-start my-5">
                <div :disabled="isDisabled" class="col-md-12">
                  <div class="f-13 ml-2">
                    {{ $t("already_have_account") }}
                    <router-link to="/" class="a-underline">
                      {{ $t("sign_in") }}
                    </router-link>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import localStorageWrapper from "../../localStorageWrapper.js";
export default {
  data: () => ({
    loader: false,
    gender_array: [],
    salutation_array: [],
    isDisabled: false,
    show1: false,
    show2: false,
    role_array: [],
    users: {
      id: 0,
      salutation: "",
      name: "",
      lastname: "",
      gender: "",
      email: "",
      password: "",
      role_id: null,
      userrole: "User",
      confirm_password: "",
    },
    app_image_url: "",
    application_name: "",
    app_name: "",
    valid: false,
    valid_error: false,
    message: "",
    alertmessage: "",
    array_data: "",
  }),

  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    fieldRules1() {
      return [(v) => !!v || this.$t("field_required")];
    },
    passwordRules() {
      return [(v) => v.length >= 8 || this.$t("password_count")];
    },
  },

  created() {
    this.fetchRoles();
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
    saveUser() {
      if (this.$refs.form.validate() && this.valid) {
        if (this.users.password != this.users.confirm_password) {
          this.valid_error = true;
          this.alertmessage = this.$t("confirm_password_match");
        } else {
          this.loader = true;
          this.isDisabled = true;
          this.$axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "register_user",
              this.users
            )
            .then((res) => {
              if (res.data.status == "S") {
                this.loader = false;
                this.$toast.success(res.data.message);
                this.message = res.data.message;
                setTimeout(
                  () =>
                    this.$router.replace({
                      name: "register",
                      query: { email: this.users.email },
                    }),
                  500
                );
              } else {
                this.loader = false;
                this.isDisabled = false;
                this.$toast.error(res.data.message);
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      }
    },
    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchrole")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;

          this.role_array = this.role_array.filter((ele) => {
            return ele.rolename == "Tradie" || ele.rolename == "Principal";
          });
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.gradient-custom {
  /* fallback for old browsers */
  background: #beb1c0;

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

.card-registration .select-input.form-control[readonly]:not([disabled]) {
  font-size: 1rem;
  line-height: 2.15;
  padding-left: 0.75em;
  padding-right: 0.75em;
}
.card-registration .select-arrow {
  top: 13px;
}
.font-login {
  font-family: "Goudy Old Style";
  font-size: 35px;
  color: black;
  text-decoration: none;
}
/* .show_icon i{
z-index: 1000 !important;
/* } */
</style>