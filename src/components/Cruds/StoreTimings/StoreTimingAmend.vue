<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_store_timings')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-layot>
            <v-row class="px-6">
              <v-col xs="12" lg="4" md="4">
                <v-tooltip :text="this.$t('store_name')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="store_timing_id"
                      @update:modelValue="(value) => updateStoreId(value)"
                      :rules="fieldRules"
                      v-bind:label="$t('store_name')"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      :items="stores_en"
                      item-value="id"
                      item-title="name"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-layot>
          <v-layot>
            <v-row
              class="px-6"
              v-for="(day, day_index) in weekdays_en"
              :key="day_index"
            >
              <v-col xs="2" lg="2" md="2">
                <v-checkbox
                  v-model="store_timings[day_index].is_holiday"
                  v-bind:label="$t('is_holiday')"
                  color="green"
                  :value="1"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col xs="12" lg="2" md="2">
                <v-tooltip :text="this.$t(day.shortname)" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="store_timings[day_index].week_day"
                      v-bind="props"
                      variant="outlined"
                      disabled
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                xs="12"
                lg="2"
                md="2"
                v-bind:class="[
                  store_timings[day_index].is_holiday == 1 ? 'disable' : '',
                ]"
              >
                <v-tooltip :text="this.$t('from_time')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="store_timings[day_index].from_time"
                      v-bind:label="$t('from_time')"
                      variant="outlined"
                      density="compact"
                      index="id"
                      :items="store_time"
                      item-value="shortname"
                      item-title="shortname"
                      :disabled="store_timings[day_index].is_holiday"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                xs="12"
                lg="1"
                md="1"
                v-bind:class="[
                  store_timings[day_index].is_holiday == 1 ? 'disable' : '',
                ]"
              >
                <v-tooltip :text="this.$t('from_meridiem')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="store_timings[day_index].from_meridiem"
                      :rules="fieldRules"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      :items="meridiem"
                      item-value="shortname"
                      item-title="shortname"
                      :disabled="store_timings[day_index].is_holiday"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                xs="12"
                lg="2"
                md="2"
                v-bind:class="[
                  store_timings[day_index].is_holiday == 1 ? 'disable' : '',
                ]"
              >
                <v-tooltip :text="this.$t('to_time')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="store_timings[day_index].to_time"
                      v-bind:label="$t('to_time')"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      :items="store_time"
                      item-value="shortname"
                      item-title="shortname"
                      :disabled="store_timings[day_index].is_holiday"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                xs="12"
                lg="1"
                md="1"
                v-bind:class="[
                  store_timings[day_index].is_holiday == 1 ? 'disable' : '',
                ]"
              >
                <v-tooltip :text="this.$t('to_meridiem')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="store_timings[day_index].to_meridiem"
                      :rules="fieldRules"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      :items="meridiem"
                      item-value="shortname"
                      item-title="shortname"
                      :disabled="store_timings[day_index].is_holiday"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                xs="12"
                lg="2"
                md="2"
                v-bind:class="[
                  store_timings[day_index].is_holiday == 1 ? 'disable' : '',
                ]"
              >
                <v-tooltip :text="this.$t('sequence')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="store_timings[day_index].seq"
                      :rules="phoneRules"
                      v-bind="props"
                      v-bind:label="$t('sequence')"
                      required
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-layot>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="isDisabled"
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
                :loading="isDisabled"
                @click="submit"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}
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
  components: { PageTitle },
  data: () => ({
    google_icon: {
      icon_name: "punch_clock",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: false,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    store_timing_id: null,
    store_timings: [],
    stores_en: [],
    stores_ar: [],
    weekdays_en: [],
    weekdays_ar: [],
    store_time: [],
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

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },

    phoneRules() {
      return [
        (v) => (v >= 0 && v <= 999999999999) || this.$t("number_required"),
      ];
    },
  },

  created() {
    this.get_stores();
    this.get_weekdays();
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
                "edit-store-timings/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.store_timings = res.data.store_timings;
              // console.log(res.data.store_timings[0].store_id);
              this.store_timing_id = res.data.store_timings[0].store_id;
              this.get_stores();
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    initializeTimingArray() {
      this.weekdays_en.forEach((element) => {
        this.store_timings.push({
          id: 0,
          store_id: null,
          is_holiday: 0,
          week_day: element.longname,
          from_time: null,
          from_meridiem: "AM",
          to_time: null,
          to_meridiem: "AM",
          seq: null,
        });
      });
    },
    updateStoreId(strore_id) {
      this.store_timings.forEach((element) => {
        element.store_id = strore_id;
      });
    },
    get_stores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
          console.log(response);
          this.stores_en = response.data.stores_en;
          this.stores_ar = response.data.stores_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    get_weekdays() {
      this.initval = true;
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-weekdays")
        .then((response) => {
          this.store_time = response.data.store_time;
          this.weekdays_en = response.data.weekdays;
          this.initval = false;
          this.initializeTimingArray();
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submit() {
      if (this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-store-timings",
            this.store_timings
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
                name: "store-timings",
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
            this.btnloading = false;
            console.log(err);
          });
      }
    },

    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}
.disable {
  display: none;
}
</style>

