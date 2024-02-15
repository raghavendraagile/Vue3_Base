<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
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
        <v-window v-model="tabs">
          <!-- ENGLISH TAB STARTS -->
          <v-window-item :value="1">
            <v-form ref="form" v-model="valid">
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('mall_timing_categories_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[0].mall_timing_categories"
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
                  <v-col xs="4" md="4" lg="4">
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
                  <v-col xs="4" md="4" lg="4">
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
                          :items="weekdays_ar"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
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
                  <v-col xs="4" md="4" lg="4">
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
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
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
                          :rules="descriptionRules"
                          v-bind:label="$t('description_en')"
                          required
                          class="required_field"
                          variant="outlined"
                          maxlength="100"
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
            <v-form ref="form" v-model="valid">
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('mall_timing_categories_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].mall_timing_categories"
                          :rules="fieldRules"
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
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('from_day_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].from_day"
                          :rules="fieldRules"
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
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_day_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].to_day"
                          :rules="fieldRules"
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
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('from_time_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].from_time"
                          :rules="fieldRules"
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
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_time_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="fieldItem[1].to_time"
                          :rules="fieldRules"
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
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
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
                          :rules="descriptionRules"
                          v-bind:label="$t('description_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          maxlength="100"
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
                @click="$router.go(-1)"
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
    valid: true,
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
    fieldItem:[
      {
        id: 0,
        lang: "en",
        mall_timing_categories: null,
        to_day: "",
        from_day: "",
        from_time: "",
        to_time: "",
        description: "",
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
      },
    ],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
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
  },

  methods: {
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

    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
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
  <style scoped></style>
    