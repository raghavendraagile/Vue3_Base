<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_store_timings')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <h1>TEST</h1>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form
          ref="form"
          v-model="valid"
          v-bind:style="sel_lang == 'ar' ? 'direction:rtl' : ''"
        >
          <v-layout>
            <v-row class="px-6 pt-1">
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('store_name')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      ref="container"
                      v-bind="props"
                      v-model="store_timing_id"
                      @update:modelValue="(value) => updateStoreId(value)"
                      v-bind:label="$t('store_name')"
                      variant="outlined"
                      density="compact"
                      index="id"
                      :items="sel_lang == 'en' ? stores_en : stores_ar"
                      :disabled="
                        $route.query.slug || user.rolename == 'StoreAdmin'
                      "
                      item-value="header_id"
                      item-title="name"
                      :error="v_store"
                      :rules="fieldReq"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
                <span v-if="v_store" class="req-field">{{
                  $t("field_required")
                }}</span>
              </v-col>
            </v-row>
          </v-layout>
          <div v-if="weekdays_en.length == 0" class="fetch-container">
            {{ $t("fetch_data_wait") }}
          </div>
          <v-layout v-for="(day, day_index) in store_timings" :key="day_index">
            <v-row class="px-6 day-container">
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-row>
                  <v-col cols="12" sm="4" md="2">
                    <div class="day-label">
                      <span v-if="sel_lang == 'ar'">{{
                        changeArWeekday(day.week_day)
                      }}</span>
                      <span v-else>{{ day.week_day }}</span>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4" md="2">
                    <v-checkbox
                      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
                      v-model="day.is_holiday"
                      v-bind:label="$t('is_holiday')"
                      color="green"
                      :value="1"
                      hide-details
                      @update:modelValue="updateTimingRules(day_index)"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-row
                  v-for="(slot, slot_index) in day.slots"
                  :key="slot_index"
                >
                  <v-col
                    cols="12"
                    sm="12"
                    md="1"
                    class="pt-5"
                    v-bind:class="[day.is_holiday == 1 ? 'disable' : '']"
                  >
                    <v-icon
                      color="#1A61CA"
                      class="mx-1"
                      @click="addTimeSlot(day_index)"
                      >mdi-plus</v-icon
                    >
                    <v-icon
                      color="#E61D0E"
                      v-if="day.slots.length > 1"
                      class="mx-1"
                      @click="deleteTimeSlot(day_index, slot_index)"
                      >mdi-delete</v-icon
                    >
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="3"
                    v-bind:class="[day.is_holiday == 1 ? 'disable' : '']"
                  >
                    <v-tooltip :text="this.$t('from_time')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="slot.from_time"
                          v-bind:label="$t('from_time')"
                          class="required_field"
                          variant="outlined"
                          density="compact"
                          index="id"
                          required
                          :rules="slot.from_time_rules"
                          :items="store_time"
                          item-value="shortname"
                          item-title="shortname"
                          :disabled="day.is_holiday"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="2"
                    v-bind:class="[day.is_holiday == 1 ? 'disable' : '']"
                  >
                    <v-tooltip
                      :text="this.$t('from_meridiem')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="slot.from_meridiem"
                          :rules="fieldRules"
                          variant="outlined"
                          density="compact"
                          required
                          index="id"
                          :items="meridiem"
                          item-value="shortname"
                          item-title="shortname"
                          :disabled="day.is_holiday"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="3"
                    v-bind:class="[day.is_holiday == 1 ? 'disable' : '']"
                  >
                    <v-tooltip :text="this.$t('to_time')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="slot.to_time"
                          :rules="slot.to_time_rules"
                          v-bind:label="$t('to_time')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          :items="store_time"
                          item-value="shortname"
                          item-title="shortname"
                          :disabled="day.is_holiday"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="2"
                    v-bind:class="[day.is_holiday == 1 ? 'disable' : '']"
                  >
                    <v-tooltip :text="this.$t('to_meridiem')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="slot.to_meridiem"
                          :rules="fieldRules"
                          variant="outlined"
                          density="compact"
                          required
                          index="id"
                          :items="meridiem"
                          item-value="shortname"
                          item-title="shortname"
                          :disabled="day.is_holiday"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <!-- <v-col
                    cols="12"
                    sm="12"
                    md="2"
                    v-bind:class="[day.is_holiday == 1 ? 'disable' : '']"
                  >
                    <v-tooltip :text="this.$t('sequence')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-on="on"
                          v-model="day.seq"
                          :rules="phoneRules"
                          v-bind="props"
                          maxlength="5"
                          v-bind:label="$t('sequence')"
                          required
                          v-on:keypress="NumbersOnly"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col> -->
                </v-row>
              </v-col>
            </v-row>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="cancel()"
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
    page_type: "add",
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: false,
    loader: false,
    data_loader: false,
    file: "",
    sel_lang: "",
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
    lang: "",
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
    v_store: false,
    user: "",
  }),

  computed: {
    fieldRules: [
      (v) => {
        const isValid = !!v;
        console.log("Validation check:", isValid);
        return isValid || this.$t("field_required");
      },
    ],
    fieldReq() {
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

  mounted() {
    this.$i18n.locale = localStorage.getItem("pref_lang");
    this.sel_lang = this.$i18n.locale;
  },
  watch: {
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        this.sel_lang = "en";
      }
    },
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.page_type = "edit";
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit-store-timings/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.get_weekdays();
              this.store_timings = res.data.store_timings;

              this.store_timing_id = res.data.store_timings[0].store_id;
              this.getAllStores();
            });
        } else {
          if (this.page_type == "add") {
            this.get_weekdays();
            this.getNewStores();
          }
        }
      },
    },
  },
  methods: {
    deleteTimeSlot(day_index, slot_index) {
      this.store_timings[day_index].slots.splice(slot_index, 1);
    },
    addTimeSlot(day_index) {
      this.store_timings[day_index].slots.push({
        from_time: null,
        from_meridiem: "AM",
        to_time: null,
        to_meridiem: "AM",
        from_time_rules: this.timingRules(false),
        to_time_rules: this.timingRules(false),
      });
    },
    copyToNext(index) {
      this.data_loader = true;
      const sel_time = this.store_timings[index];
      this.store_timings[index + 1].is_holiday = sel_time.is_holiday;
      this.store_timings[index + 1].from_time = sel_time.from_time;
      this.store_timings[index + 1].from_meridiem = sel_time.from_meridiem;
      this.store_timings[index + 1].to_time = sel_time.to_time;
      this.store_timings[index + 1].to_meridiem = sel_time.to_meridiem;
      this.store_timings[index + 1].seq =
        (parseInt(sel_time.seq) ? parseInt(sel_time.seq) : 0) + 1;
      this.$toast.success(
        this.$t("copied_successfully_to") +
          this.store_timings[index + 1].week_day
      );
      this.data_loader = false;
    },
    copyToAll(index) {
      this.data_loader = true;
      const sel_time = this.store_timings[index];
      for (let index = 1; index < this.store_timings.length; index++) {
        this.store_timings[index].is_holiday = sel_time.is_holiday;
        this.store_timings[index].from_time = sel_time.from_time;
        this.store_timings[index].from_meridiem = sel_time.from_meridiem;
        this.store_timings[index].to_time = sel_time.to_time;
        this.store_timings[index].to_meridiem = sel_time.to_meridiem;
        this.store_timings[index].seq = sel_time.seq;
      }
      this.$toast.success(this.$t("copied_successfully"));
      this.data_loader = false;
    },
    changeArWeekday(day) {
      switch (day) {
        case "Monday":
          return this.$t("monday_ar");
        case "Tuesday":
          return this.$t("tuesday_ar");
        case "Wednesday":
          return this.$t("wednesday_ar");
        case "Thursday":
          return this.$t("thursday_ar");
        case "Friday":
          return this.$t("friday_ar");
        case "Saturday":
          return this.$t("saturday_ar");
        case "Sunday":
          return this.$t("sunday_ar");
        default:
          return "";
      }
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    initializeTimingArray() {
      this.weekdays_en.forEach((element) => {
        console.log("ele log");
        console.log(element);
        this.store_timings.push({
          id: 0,
          is_holiday: 0,
          store_id: null,
          week_day: element.longname,
          seq: null,
          slots: [
            {
              from_time: null,
              from_meridiem: "AM",
              to_time: null,
              to_meridiem: "AM",
              from_time_rules: this.timingRules(false),
              to_time_rules: this.timingRules(false),
            },
          ],
        });
      });
    },
    updateTimingRules(dayIndex) {
      const isHoliday = this.store_timings[dayIndex].is_holiday;
      this.store_timings[dayIndex].slots.forEach((ele) => {
        ele.from_time_rules = this.timingRules(isHoliday);
        ele.to_time_rules = this.timingRules(isHoliday);
      });
    },
    timingRules(isHoliday) {
      if (isHoliday) {
        return [];
      }
      return [(v) => !!v || this.$t("field_required")];
    },
    updateStoreId(store_id) {
      this.store_timings.forEach((element) => {
        element.store_id = store_id;
      });
    },
    getNewStores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores-name")
        .then((response) => {
          this.stores_en = response.data.stores_en;
          this.stores_ar = response.data.stores_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getAllStores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
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
          this.store_time = response.data.store_time_en;
          this.weekdays_en = response.data.weekdays_en;
          this.initval = false;
          if (this.page_type == "add") {
            this.initializeTimingArray();

            this.user = JSON.parse(localStorage.getItem("user_data"));
            if (this.user.rolename == "StoreAdmin") {
              this.updateStoreId(this.user.store_id);
              this.store_timing_id = this.user.store_id;
            }
          }
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submit() {
      // store_timing_id
      // v_store

      if (this.$refs.form.validate() && this.valid) {
        if (!this.store_timing_id) {
          this.$refs.container.scrollIntoView({ behavior: "smooth" });
          this.v_store = true;
        } else {
          this.v_store = false;

          this.isDisabled = true;
          this.isBtnLoading = true;

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
            })
            .finally(() => {
              this.btnloading = false;
              this.isBtnLoading = false;
              this.isDisabled = false;
            });
        }
      }
    },
    cancel() {
      this.$router.push({
        name: "store-timings",
      });
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

.req-field {
  color: #b71734;
  font-size: 12px;
  position: relative;
  bottom: 22px;
}
.fetch-container {
  height: 400px;
  justify-content: center;
  align-items: center;
  display: flex;
  color: gray;
}
.day-label {
  font-size: 22px;
  font-weight: 400;
  margin-top: 10px;
}
.day-container {
  margin: 10px 20px;
  background: #f2f2f28c;
  border-radius: 6px;
}
</style>

