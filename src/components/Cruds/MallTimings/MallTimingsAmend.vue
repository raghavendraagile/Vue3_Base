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
                      :text="this.$t('mall_timing_categories')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.mall_timing_categories"
                          :rules="fieldRules"
                          v-bind:label="$t('mall_timing_categories')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="categories"
                          item-value="id"
                          item-title="shortname"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('from_day')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.from_day"
                          :rules="fieldRules"
                          v-bind:label="$t('from_day')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_day')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.to_day"
                          :rules="fieldRules"
                          v-bind:label="$t('to_day')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <!-- ------------- -->
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('from_time')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.from_time"
                          :rules="fieldRules"
                          v-bind:label="$t('from_time')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_time')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.to_time"
                          :rules="fieldRules"
                          v-bind:label="$t('to_time')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time"
                          item-value="shortname"
                          item-title="shortname"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
                    <v-tooltip :text="this.$t('description')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="fieldItem.description"
                          v-bind="props"
                          :rules="descriptionRules"
                          v-bind:label="$t('description')"
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
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.mall_timing_categories"
                          :rules="fieldRules"
                          v-bind:label="$t('mall_timing_categories_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="categories"
                          item-value="id"
                          item-title="shortname_ar"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('from_day_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.from_day_ar"
                          :rules="fieldRules"
                          v-bind:label="$t('from_day_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays"
                          item-value="shortname_ar"
                          item-title="shortname_ar"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_day_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.to_day_ar"
                          :rules="fieldRules"
                          v-bind:label="$t('to_day_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="weekdays"
                          item-value="shortname_ar"
                          item-title="shortname_ar"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <!-- ------------- -->
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip
                      :text="this.$t('from_time_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.from_time_ar"
                          :rules="fieldRules"
                          v-bind:label="$t('from_time_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time"
                          item-value="shortname_ar"
                          item-title="shortname_ar"
                        ></v-select>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('to_time_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-select
                          v-bind="props"
                          v-model="fieldItem.to_time_ar"
                          :rules="fieldRules"
                          v-bind:label="$t('to_time_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_time"
                          item-value="shortname_ar"
                          item-title="shortname_ar"
                        ></v-select>
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
                          v-model="fieldItem.description_ar"
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
    weekdays: [],
    mall_time: [],
    categories: [],
    tabs: 1,
    fieldItem: {
      id: 0,
    },
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
          this.weekdays = response.data.weekdays;
          this.mall_time = response.data.mall_time;
          this.categories = response.data.categories;
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
    