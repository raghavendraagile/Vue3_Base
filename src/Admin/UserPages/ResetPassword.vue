<template>
  <div class="mx-2 mt-3 p-0" v-bind:class="[is_arabic ? 'arabicclass' : '']">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('reset_password')"
        :google_icon="google_icon"
      ></page-title>
    </div>

    <v-card elevation="7" width="700" class="mx-6">
      <v-form
        autocomplete="off"
        ref="form"
        v-model="valid"
        v-bind:class="[is_arabic ? 'arabicclass' : '']"
      >
        <v-container>
          <v-row class="mx-auto mt-2" max-width="344">
            <v-col md="12" class="emailclass">
              <strong>{{ $t("email") }}:</strong>
              &nbsp;&nbsp;
              {{ userprofile.email }}
            </v-col>
          </v-row>
          <br />
          <v-row class="mx-auto mt-2" max-width="344">
            <v-col md="12">
              <v-tooltip :text="this.$t('current_password')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="fieldItem.currentpassword"
                    v-bind:label="$t('current_password')"
                    required
                    v-bind="props"
                    :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    :rules="fieldRules"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                    @click:append-inner="show1 = !show1"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="mx-auto mt-2" max-width="344">
            <v-col md="12">
              <v-tooltip :text="this.$t('new_password')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="fieldItem.newpassword"
                    v-bind:label="$t('new_password')"
                    :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    v-bind="props"
                    required
                    :rules="fieldRules"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                    @click:append-inner="show2 = !show2"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col> </v-row
          ><v-row class="mx-auto mt-2" max-width="344">
            <v-col md="12">
              <v-tooltip :text="this.$t('confirm_password')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="fieldItem.confirmpassword"
                    v-bind:label="$t('confirm_password')"
                    :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show3 ? 'text' : 'password'"
                    v-bind="props"
                    required
                    :rules="[
                      !!fieldItem.confirmpassword || $t('password_confirm'),
                      fieldItem.newpassword === fieldItem.confirmpassword ||
                        $t('confirm_password_match'),
                    ]"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                    @click:append-inner="show3 = !show3"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <div
        class="d-block mx-4 mt-3 pb-3"
        v-bind:class="[is_arabic ? ' text-left' : ' text-right']"
      >
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="cancel"
                :disabled="isBtnLoading"
                class="ma-1"
                color="cancel"
                >{{ $t("cancel") }}</v-btn
              >
            </div>
          </template>
        </v-tooltip>
        <v-tooltip :text="this.$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                @click="submit"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}
                <v-progress-circular
                  v-if="isBtnLoading"
                  indeterminate
                  width="1"
                  color="cancel"
                  size="x-small"
                  class="ml-2"
                ></v-progress-circular>
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
    userprofile: "",
    isDisabled: false,
    isBtnLoading: false,
    show1: false,
    show2: false,
    show3: false,
    fieldItem: {
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
      claim_profile: "N",
      email: "",
    },
    currentpasswordtoggle: String,
    newpasswordtoggle: String,
    confirmpwdtoggle: String,
    is_arabic: false,
    newpasswordshow: false,
    confirmpasswordshow: false,
  }),
  computed: {
    minlength() {
      return [
        (v) => v.length > 7 || this.$t("password_length"),
        (v) => !!v || this.$t("field_required"),
      ];
    },
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
  },
  created() {},
  watch: {
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.is_arabic = true;
      } else {
        this.is_arabic = false;
      }
    },
  },
  mounted() {
    this.userprofile = JSON.parse(localStorage.getItem("user_data"));
  },
  methods: {
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        if (this.fieldItem.newpassword != this.fieldItem.confirmpassword) {
          this.message = "Confirm password is not matching with new password";
          this.$toast.error(this.message);
        } else {
          // Form is valid, process
          this.isDisabled = true;
          this.isBtnLoading = true;
          this.fieldItem.email = this.userprofile.email;
          this.fieldItem.user_id = this.userprofile.id;
          this.$axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "resetuserpassword",
              this.fieldItem
            )
            .then(
              (res) => {
                if (Array.isArray(res.data.message)) {
                  this.array_data = res.data.message.toString();
                } else {
                  this.array_data = res.data.message;
                }
                if (res.data.status == "E") {
                  (this.message = this.array_data), (this.isDisabled = false);
                  this.isBtnLoading = false;
                  this.$toast.error(this.message);
                  this.valid_success = false;
                } else {
                  this.$toast.success(this.array_data);

                  this.valid_success = true;
                  // setTimeout(() => this.$router.push({ name: "login" }), 1000);
                  this.$router.push({
                    name: "dashboard",
                  });
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                console.log(error);
                (this.message = this.$t("too_many_request")),
                  (this.isDisabled = true),
                  (this.isBtnLoading = false);
                this.$toast.error(this.message);
                setTimeout(() => (this.isDisabled = false), 120000);
                setTimeout(() => (this.message = "Now try again"), 120000);
              }
            )
            .catch((err) => {
              console.log("error data", err);
              this.valid_success = false;
              this.message = this.$t("password_error");
              this.$toast.error(this.message);
            });
        }
      } else {
        this.message = this.$t("invalid_form");
        this.$toast.error(this.message);
      }
    },
    cancel() {
      this.$router.push({
        name: "dashboard",
      });
    },
  },
};
</script>
<style scoped>
.arabicclass /deep/ .v-field {
  direction: rtl;
}
.arabicclass .emailclass {
  direction: rtl;
}
.arabicclass /deep/ .v-messages__message {
  direction: rtl;
}
.arabicclass {
  direction: rtl;
}
</style>
