<template>
  <div class="main-20 position-relative">
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-3"
        :heading="$t('mall_timings')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-text-field
              rounded
              density="compact"
              variant="outlined"
              elevation="24"
              v-bind="props"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>

      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{
                name: 'mall-timings-amend',
                query: {
                  s_tab: tabs,
                  r_type: record_type,
                },
              }"
              style="color: white"
            >
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
        <v-tooltip :text="this.$t('preview')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              @click="previewPage()"
              v-if="mall_timings_en.length > 0"
              size="small"
              class="mb-2 preview-btn mx-2"
              v-bind="props"
              >{{ $t("preview")
              }}<v-icon size="large" class="ml-1"
                >mdi mdi-play-circle-outline</v-icon
              ></v-btn
            >
          </template>
        </v-tooltip>
      </div>
    </div>

    <div>
      <v-container fluid style="padding: 0px 10px">
        <v-radio-group
          v-model="record_type"
          inline
          v-bind:style="sel_lang == 'ar' ? 'direction:rtl' : ''"
        >
          <template v-slot:label>
            <strong>{{ $t("set_default_malltime") }}</strong>
          </template>
          <v-radio
            value="manual"
            @click="setDefault('manual')"
            :disabled="record_type == 'manual'"
          >
            <template v-slot:label>
              <div>{{ $t("manual_entry") }}</div>
            </template>
          </v-radio>
          <v-radio
            value="image"
            @click="setDefault('image')"
            :disabled="record_type == 'image'"
          >
            <template v-slot:label>
              <div>{{ $t("image_upload") }}</div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-container>
    </div>

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
        <v-data-table
          :headers="headers"
          :items="mall_timings_en"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available_en')"
          :footer-props="{
            'items-per-page-text': $t('rows_per_page'),
          }"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td v-if="record_type == 'image'" class="py-2">
                <a
                  :href="envImagePath + props.item.selectable.image_path"
                  target="_blank"
                >
                  <img
                    width="50"
                    :src="envImagePath + props.item.selectable.image_path"
                    alt="image"
                  />
                </a>
              </td>
              <td v-if="record_type == 'image'">
                <span>{{ props.item.selectable.description }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                <span v-if="props.item.selectable.category">{{
                  props.item.selectable.category.longname
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                <span v-if="props.item.selectable.from_day">{{
                  props.item.selectable.from_day.longname
                }}</span>
                <span v-else>{{ $t("not_applicable") }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                <span v-if="props.item.selectable.to_day">{{
                  props.item.selectable.to_day.longname
                }}</span>
                <span v-else>{{ $t("not_applicable") }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                {{ props.item.selectable.from_time }}
                {{ props.item.selectable.from_meridiem }}
              </td>
              <td v-if="record_type == 'manual'">
                {{ props.item.selectable.to_time }}
                {{ props.item.selectable.to_meridiem }}
              </td>
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="updateStatus(props.item.selectable.header_id)"
                  size="small"
                  v-bind:color="[
                    props.item.selectable.status == 1 ? 'success' : 'warning',
                  ]"
                >
                  <span
                    v-if="props.item.selectable.status == 1"
                    class="spanactivesize"
                    >{{ $t("active") }}</span
                  >
                  <span
                    v-if="props.item.selectable.status == 0"
                    class="spanactivesize"
                    >{{ $t("inactive") }}</span
                  >
                </v-btn>
              </td>
              <td class="text-center">
                <router-link
                  small
                  :to="{
                    name: 'mall-timings-amend',
                    query: {
                      slug: props.item.selectable.slug,
                      s_tab: tabs,
                      r_type: record_type,
                    },
                  }"
                >
                  <v-tooltip :text="this.$t('edit')" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        small
                        class="mr-2 edit_btn icon_size"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("edit") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
                  <v-tooltip :text="this.$t('delete')" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon color="error" type="button" v-bind="props" small
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
      <!-- ENGLISH TAB END -->
      <!-- ARABIC TAB STARTS -->
      <v-window-item :value="2">
        <v-data-table
          :headers="headers_ar"
          :items="mall_timings_ar"
          :search="search"
          :loading="initval"
          class="rtl-direction"
          v-bind:no-data-text="$t('no_data_available_ar')"
          :items-per-page-text="$t('rows_per_page_ar')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td v-if="record_type == 'image'" class="py-3">
                <a
                  :href="envImagePath + props.item.selectable.image_path"
                  target="_blank"
                >
                  <img
                    width="50"
                    :src="envImagePath + props.item.selectable.image_path"
                    alt="صورة"
                  />
                </a>
              </td>
              <td v-if="record_type == 'image'">
                <span>{{ props.item.selectable.description }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                <span v-if="props.item.selectable.category">{{
                  props.item.selectable.category.longname
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                <span v-if="props.item.selectable.from_day">{{
                  props.item.selectable.from_day.longname
                }}</span>
                <span v-else>{{ $t("not_applicable") }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                <span v-if="props.item.selectable.to_day">{{
                  props.item.selectable.to_day.longname
                }}</span>
                <span v-else>{{ $t("not_applicable") }}</span>
              </td>
              <td v-if="record_type == 'manual'">
                {{ props.item.selectable.from_time }}
                {{ changeArMeridian(props.item.selectable.from_meridiem) }}
              </td>
              <td v-if="record_type == 'manual'">
                {{ props.item.selectable.to_time }}
                {{ changeArMeridian(props.item.selectable.to_meridiem) }}
              </td>
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="updateStatus(props.item.selectable.header_id)"
                  size="small"
                  v-bind:color="[
                    props.item.selectable.status == 1 ? 'success' : 'warning',
                  ]"
                >
                  <span
                    v-if="props.item.selectable.status == 1"
                    class="spanactivesize"
                    >{{ $t("active_ar") }}</span
                  >
                  <span
                    v-if="props.item.selectable.status == 0"
                    class="spanactivesize"
                    >{{ $t("inactive_ar") }}</span
                  >
                </v-btn>
              </td>
              <td class="text-center">
                <router-link
                  small
                  :to="{
                    name: 'mall-timings-amend',
                    query: {
                      slug: props.item.selectable.slug,
                      s_tab: tabs,
                      r_type: record_type,
                    },
                  }"
                >
                  <v-tooltip :text="this.$t('edit')" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        small
                        class="mr-2 edit_btn icon_size"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("edit") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
                  <v-tooltip :text="this.$t('delete')" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon color="error" type="button" v-bind="props" small
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
      <!-- ARABIC TAB END -->
    </v-window>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    search: "",
    showConfirmDialog: false,
    delete_id: null,
    dialog: false,
    mall_timings_en: [],
    mall_timings_ar: [],
    initval: true,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    google_icon: {
      icon_name: "calendar_clock",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    status_id: null,
    showStatusDialog: false,
    tabs: 1,
    sel_lang: "",
    record_type: "manual",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      let headers = [
        {
          title: this.$t("status_en"),
          key: "status",
        },
        {
          title: this.$t("action_en"),
          align: "center",
          key: "email",
        },
      ];

      if (this.record_type == "manual") {
        headers.splice(0, 0, {
          title: this.$t("mall_timing_categories_en"),
          key: "category.longname",
        });
        headers.splice(1, 0, {
          title: this.$t("from_day_en"),
          key: "from_day.longname",
        });
        headers.splice(2, 0, {
          title: this.$t("to_day_en"),
          key: "to_day.longname",
        });
        headers.splice(3, 0, {
          title: this.$t("from_time_en"),
          key: "from_time",
        });
        headers.splice(4, 0, {
          title: this.$t("to_time_en"),
          key: "to_time",
        });
      }
      if (this.record_type == "image") {
        headers.splice(0, 0, {
          title: this.$t("image"),
          key: "image_path",
        });
        headers.splice(1, 0, {
          title: this.$t("description_en"),
          key: "description",
        });
      }

      return headers;
    },
    headers_ar() {
      let headers = [
        {
          title: this.$t("status_ar"),
          key: "status",
        },
        {
          title: this.$t("action_ar"),
          align: "center",
          key: "email",
        },
      ];

      if (this.record_type == "manual") {
        headers.splice(0, 0, {
          title: this.$t("mall_timing_categories_ar"),
          key: "category.longname",
        });
        headers.splice(1, 0, {
          title: this.$t("from_day_ar"),
          key: "from_day.longname",
        });
        headers.splice(2, 0, {
          title: this.$t("to_day_ar"),
          key: "to_day.longname",
        });
        headers.splice(3, 0, {
          title: this.$t("from_time_ar"),
          key: "from_time",
        });
        headers.splice(4, 0, {
          title: this.$t("to_time_ar"),
          key: "to_time",
        });
      }

      if (this.record_type == "image") {
        headers.splice(0, 0, {
          title: this.$t("image"),
          key: "image_path",
        });
        headers.splice(1, 0, {
          title: this.$t("description_ar"),
          key: "description",
        });
      }

      return headers;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        this.sel_lang = "en";
      }
    },
  },

  created() {},
  mounted() {
    if (this.$route.query.s_tab) {
      this.tabs = this.$route.query.s_tab == 1 ? 1 : 2;
    }
    this.fetchMallTimings();
  },

  methods: {
    setDefault(type) {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update-malltimings-type", {
          type: type,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.success(this.array_data);
            this.fetchMallTimings();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    previewPage() {
      var lang = this.tabs === 1 ? "en" : "ar";

      const route = this.$router.resolve({
        name: "preview_webapp",
        params: {
          lang: lang,
          page: "",
        },
      });
      window.open(route.href, "_blank");
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
    changeArMeridian(data) {
      switch (data) {
        case "AM":
          return this.$t("am_ar");
        case "PM":
          return this.$t("pm_ar");
        default:
          return "";
      }
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    fetchMallTimings() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-mall-timings")
        .then((res) => {
          this.mall_timings_en = res.data.mall_timings_en;
          this.mall_timings_ar = res.data.mall_timings_ar;
          if (res.data.record_type) {
            this.record_type = res.data.record_type;
          }

          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
    },

    deleteItem(time_id) {
      this.delete_id = time_id;
      this.showConfirmDialog = true;
    },

    deleteConfirm(time_id) {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete-mall-timing/" + time_id
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.success(this.array_data);
            this.fetchMallTimings();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    updateStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    statusUpdate() {
      this.loader = true;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update-mall-timings-status",
          {
            id: this.status_id,
          }
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchMallTimings();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchMallTimings();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
      this.loader = false;
    },
  },
};
</script>
<style scoped>
.list_item {
  cursor: pointer;
}
.type-selector {
  position: absolute;
  right: 30px;
}
</style>
