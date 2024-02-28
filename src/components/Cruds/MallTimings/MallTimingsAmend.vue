<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_ammend_mall_timing')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-tabs v-model="tabs" color="blue">
          <v-tab :value="1">
            <span>{{ $t("english") }}</span>
          </v-tab>
          <v-tab :value="2">
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
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" sm="12" xs="6" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('mall_timing_categories_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].mall_timing_categories"
                          @update:modelValue="
                            (value) => updateCategories(value)
                          "
                          :rules="fieldRules"
                          v-bind:label="$t('mall_timing_categories_en')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="categories_en"
                          item-value="header_id"
                          item-title="name"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="6" xs="6" md="4" lg="4">
                    <v-tooltip :text="this.$t('from_day_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].from_day"
                          :rules="fieldRules"
                          v-bind:label="$t('from_day_en')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays_en"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="6" xs="6" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_day_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].to_day"
                          :rules="fieldRules"
                          v-bind:label="$t('to_day_en')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays_en"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="4" xs="12" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('from_time_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].from_time"
                          :rules="fieldRules"
                          v-bind:label="$t('from_time_en')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time_en"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="2" xs="12" md="2" lg="2">
                    <v-tooltip
                      :text="this.$t('from_meridiem')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].from_meridiem"
                          :rules="fieldRules"
                          variant="outlined"
                          density="compact"
                          v-bind:label="$t('from_meridiem')"
                          required
                          index="id"
                          :items="meridiem"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="4" xs="12" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_time_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].to_time"
                          :rules="fieldRules"
                          v-bind:label="$t('to_time_en')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time_en"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="2" xs="12" md="2" lg="2">
                    <v-tooltip :text="this.$t('to_meridiem')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].to_meridiem"
                          :rules="fieldRules"
                          variant="outlined"
                          v-bind:label="$t('to_meridiem')"
                          density="compact"
                          required
                          index="id"
                          :items="meridiem"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col cols="12" sm="12" xs="12" md="12" lg="12">
                    <v-tooltip
                      :text="this.$t('description_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="fieldItem[0].description"
                          v-bind="props"
                          v-bind:label="$t('description_en')"
                          variant="outlined"
                          maxlength="2000"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ENGLISH TAB END -->
          <!-- ARABIC TAB STARTS -->
          <v-window-item :value="2">
            <v-form
              ref="form"
              v-model="validAR"
              style="direction: rtl; text-align: end"
            >
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" sm="12" xs="6" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('mall_timing_categories_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].mall_timing_categories"
                          @update:modelValue="
                            (value) => updateCategories(value)
                          "
                          :rules="fieldRulesAR"
                          v-bind:label="$t('mall_timing_categories_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="categories_ar"
                          item-value="header_id"
                          item-title="name"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="6" xs="6" md="4" lg="4">
                    <v-tooltip :text="this.$t('from_day_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].from_day"
                          :rules="fieldRulesAR"
                          v-bind:label="$t('from_day_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays_ar"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="6" xs="6" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_day_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].to_day"
                          :rules="fieldRulesAR"
                          v-bind:label="$t('to_day_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays_ar"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="4" xs="4" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('from_time_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].from_time"
                          :rules="fieldRulesAR"
                          v-bind:label="$t('from_time_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time_ar"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="2" xs="2" md="2" lg="2">
                    <v-tooltip
                      :text="this.$t('from_meridiem_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].from_meridiem"
                          :rules="fieldRules"
                          variant="outlined"
                          density="compact"
                          v-bind:label="$t('from_meridiem_ar')"
                          required
                          index="id"
                          :items="meridiem"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="4" xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_time_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].to_time"
                          :rules="fieldRulesAR"
                          v-bind:label="$t('to_time_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time_ar"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="2" xs="2" md="2" lg="2">
                    <v-tooltip
                      :text="this.$t('to_meridiem_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].to_meridiem"
                          :rules="fieldRules"
                          variant="outlined"
                          v-bind:label="$t('to_meridiem_ar')"
                          density="compact"
                          required
                          index="id"
                          :items="meridiem"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6 arabdirection" max-width="344">
                  <v-col cols="12" sm="12" xs="12" md="12" lg="12">
                    <v-tooltip
                      :text="this.$t('description_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="fieldItem[1].description"
                          v-bind="props"
                          v-bind:label="$t('description_ar')"
                          class="rtl"
                          variant="outlined"
                          maxlength="2000"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ARABIC TAB END -->
        </v-window>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="
                  $router.push({
                    name: 'mall-timings',
                    query: { s_tab: this.$route.query.s_tab },
                  })
                "
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
                :disabled="isDisabled"
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
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: false,
    validAR: false,
    error_valid: false,
    successmessage: "",
    message: "",
    valid_error: false,
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    weekdays_en: [],
    weekdays_ar: [],
    mall_time_en: [],
    mall_time_ar: [],
    categories_en: [],
    categories_ar: [],
    tabs: 1,
    fieldItem: [
      {
        id: 0,
        lang: "en",
        mall_timing_categories: null,
        to_day: "",
        from_day: "",
        from_time: "",
        to_time: "",
        description: "",
        from_meridiem: "AM",
        to_meridiem: "AM",
      },
      {
        id: 0,
        lang: "ar",
        mall_timing_categories: null,
        to_day: "",
        from_day: "",
        from_time: "",
        to_time: "",
        description: "",
        from_meridiem: "AM",
        to_meridiem: "AM",
      },
    ],
    sel_lang: "",
    meridiem: [
      {
        id: 0,
        shortname: "AM",
      },
      {
        id: 0,
        shortname: "PM",
      },
    ],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAR() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },
    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },
    descriptionRulesAR() {
      return [(v) => !!v || this.$t("description_required_ar")];
    },
  },

  created() {
    this.fetchWeekdaysAandTime();
  },

  watch: {
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
                "edit-mall-timings/" +
                this.$route.query.slug
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.fieldItem = res.data.mall_timings;
                this.loader = false;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            });
        }
      },
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
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
  },

  methods: {
    updateCategories(categories) {
      if (this.tabs == 1) {
        this.fieldItem[1].mall_timing_categories = categories;
      } else {
        this.fieldItem[0].mall_timing_categories = categories;
      }
    },
    fetchWeekdaysAandTime() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-weekdays-and-time")
        .then((response) => {
          this.weekdays_en = response.data.weekdays_en;
          this.weekdays_ar = response.data.weekdays_ar;
          this.mall_time_en = response.data.mall_time_en;
          this.mall_time_ar = response.data.mall_time_ar;
          this.categories_en = response.data.categories_en;
          this.categories_ar = response.data.categories_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
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
            this.tabs = 1;
            this.error_valid = true;
          }
        }
      }
    },
    submit() {
      if (this.validAR == true && this.valid == true) {
        this.isBtnLoading = true;
        this.isDisabled = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-mall-timings",
            this.fieldItem
          )
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
                name: "mall-timings",
                query: { s_tab: this.$route.query.s_tab },
              });
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("error", err);
          });
        this.isDisabled = false;
        this.isBtnLoading = false;
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
.arabdirection .v-field {
  direction: rtl !important;
}

.arabdirection /deep/ .v-messages__message {
  text-align: right !important;
}
</style>
    