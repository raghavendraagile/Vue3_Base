<template>
  <div class="mx-2 mt-3 p-0">
    <div class="main-card mb-3 card">
      <div
        class="my-3 p-0"
        v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
      >
        <page-title
          class="col-md-4 ml-2"
          :heading="$t('create_state')"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-tabs v-model="tabs" color="blue">
          <v-tab :value="1" @click="checkUploadImage">
            <span>{{ $t("english") }}</span>
          </v-tab>
          <v-tab :value="2" @click="checkUploadImage">
            <span>{{ $t("arabic") }}</span>
          </v-tab>
        </v-tabs>
        <v-alert
          closable
          close-label="Close Alert"
          density="compact"
          color="rgb(var(--v-theme-error))"
          v-if="error_valid"
          variant="tonal"
          @click:close="error_valid = false"
          class="my-3"
          v-bind:class="[tabs == 1 ? '' : 'arabdirectionalert']"
          :title="
            tabs == 1 ? $t('validation_error_en') : $t('validation_error_ar')
          "
          :text="
            tabs == 1
              ? $t('please_fill_required_fields_en')
              : $t('please_fill_required_fields_ar')
          "
        ></v-alert>
        <v-window v-model="tabs">
          <!-- ENGLISH TAB STARTS -->
          <v-window-item :value="1">
            <v-form ref="form" v-model="valid">
              <v-row class="mx-auto mt-2" max-width="344">
                <v-col cols="12" md="6">
                  <v-tooltip :text="this.$t('country_en')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-on="on"
                        readonly="isReadOnly"
                        v-model="country[0].name"
                        v-bind:label="$t('country_en')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col md="6">
                  <v-tooltip :text="this.$t('state_en')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-on="on"
                        v-model="state[0].name"
                        :rules="fieldRules"
                        v-bind:label="$t('state_en')"
                        required
                        v-bind="props"
                        class="required_field"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          <!-- ENGLISH TAB STOPS -->
          <!-- ARABIC TAB STARTS -->
          <v-window-item :value="2">
            <v-form ref="form" v-model="validAR">
              <v-row class="mx-auto mt-2 arabdirection" max-width="344">
                <v-col cols="12" md="6">
                  <v-tooltip :text="this.$t('country_ar')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-on="on"
                        readonly="isReadOnly"
                        v-model="country[1].name"
                        v-bind:label="$t('country_ar')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col md="6">
                  <v-tooltip :text="this.$t('state_ar')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-on="on"
                        v-model="state[1].name"
                        :rules="fieldRules"
                        v-bind:label="$t('state_ar')"
                        required
                        v-bind="props"
                        class="required_field"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
        </v-window>
        <!--  ARABIC TAB ENDS-->
      </div>

      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="cancel()"
                :disabled="loading"
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
                :disabled="isBtnLoading"
                @click="presubmitvalidation"
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
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    valid: false,
    validAR: false,
    error_valid: false,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    country_slug: "",
    sel_lang: "",
    state: [
      {
        id: 0,
        name: "",
        lang: "en",
        country_id: null,
      },
      {
        id: 0,
        name: "",
        lang: "ar",
        country_id: null,
      },
    ],
    country: [
      {
        id: 0,
        name: "",
      },
      {
        id: 0,
        name: "",
      },
    ],
    noimagepreview: "",
    items: [],
    tabs: 1,
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {},
  watch: {
    "$route.query.countryslug": {
      immediate: true,
      handler() {
        if (this.$route.query.countryslug) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_countries/" +
                this.$route.query.countryslug
            )
            .then((res) => {
              this.country = res.data.countries;
              for (let i = 0; i < 2; i++) {
                this.state[i].country_id = res.data.countries[0].header_id;
              }
              this.country_slug = this.$route.query.countryslug;

              this.loader = false;
            });
        }
      },
    },

    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.valid = true;
          this.validAR = true;
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_states/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.country = res.data.country;
              this.state = res.data.state;
              this.country_slug = this.country[0].slug;
              this.loader = false;
            });
        }
      },
    },
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab) {
          if (this.$route.query.s_tab == 1) {
            this.tabs = 1;
          } else {
            this.tabs = 2;
          }
        }
      },
    },
  },
  methods: {
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    presubmitvalidation() {
      if (this.tabs == 1) {
        if (
          this.$refs.form.validate() &&
          this.valid == true &&
          this.validAR == true
        ) {
          this.error_valid = false;
          this.submit();
        } else {
          if (this.valid == true) {
            this.error_valid = true;
            this.tabs = 2;
          }
        }
      } else {
        if (
          this.$refs.form.validate() &&
          this.validAR == true &&
          this.valid == true
        ) {
          this.error_valid = false;
          this.submit();
        } else {
          if (this.validAR == true) {
            this.error_valid = true;
            this.tabs = 1;
          }
        }
      }
    },
    submit() {
      if (this.validAR == true && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "save_states", this.state)
          .then((res) => {
            this.btnloading = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "states",
                query: {
                  countryslug: this.country_slug,
                  s_tab: this.tabs,
                },
              });
            } else if (res.data.status == "E") {
              this.$toast.error(this.array_data);
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    cancel() {
      this.$router.push({
        name: "states",
        query: {
          countryslug: this.country_slug,
          s_tab: this.tabs,
        },
      });
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}
.upload_doc {
  margin-top: -14px;
}
.upload_image {
  margin-bottom: 3px;
}
.download_btn_color {
  color: blue;
}
.image-width {
  border: 2px solid black;
  padding: 1px;
}
.arabdirection /deep/ .v-field {
  direction: rtl;
}
</style>
