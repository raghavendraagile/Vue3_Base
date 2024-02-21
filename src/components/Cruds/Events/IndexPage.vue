<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-3"
        :heading="$t('events')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              dense
              density="compact"
              v-on="on"
              variant="outlined"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              class="srch_bar"
              small
              hide-details
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link :to="{ name: 'events_amend', query:{ 's_tab': tabs } }"  style="color: white">
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
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
          :headers="headers_en"
          :items="events_en"
          v-bind:label="$t('search')"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available_en')"
          :items-per-page-text="$t('rows_per_page_en')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                <span v-if="props.item.selectable.title">
                  {{ props.item.selectable.title }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="this.role === 'SuperUser'">
                <span v-if="props.item.selectable.store_name">
                  {{ props.item.selectable.store_name.stor_type }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="this.role === 'SuperUser'">
                <span v-if="props.item.selectable.store_name">
                  {{ props.item.selectable.store_name.name }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="props.item.selectable.description">
                <span v-html="props.item.selectable.description"> </span>
              </td>
              <td v-else>
                <span>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.selectable.start_date">
                  {{ formatDate(props.item.selectable.start_date) }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.selectable.end_date">
                  {{ formatDate(props.item.selectable.end_date) }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <!-- <td>
            <span v-if="props.item.selectable.meta_title">
              {{ props.item.selectable.meta_title }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.meta_description">
              {{ props.item.selectable.meta_description }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td> -->

              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  size="small"
                  @click="changeStatus(props.item.selectable.id)"
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
              <td>
                <v-chip
                  :color="getStatusColor(props.item.selectable.approval_status)"
                  variant="outlined"
                >
                  {{ props.item.selectable.approval_status }}
                </v-chip>
              </td>
              <td>
                <router-link
                  :to="{
                    name: 'events_amend',
                    query: { slug: props.item.selectable.slug,
                    's_tab': tabs  },
                  }"
                >
                  <v-tooltip :text="this.$t('edit')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        plain
                        v-bind="props"
                        dense
                        class="mr-2 edit_btn icon_size"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.id)">
                  <v-tooltip :text="this.$t('delete')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="delete_btn icon_size"
                        v-on="on"
                        small
                        type="button"
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </span>
              </td>
              <td>
                <v-btn
                  size="small"
                  @click="viewEvents(props.item.selectable.slug)"
                  :disabled="loading"
                  class="ma-1"
                  color="blue"
                  >{{ $t("view_en") }}</v-btn
                >
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
      <!-- ENGLISH TAB STOPS -->
      <!-- ARABIC TAB STARTS -->
      <v-window-item :value="2">
        <v-data-table
          :headers="headers_ar"
          :items="events_ar"
          v-bind:label="$t('search')"
          :loading="initval"
          class="rtl-direction"
          v-bind:no-data-text="$t('no_data_available_ar')"
          :items-per-page-text="$t('rows_per_page_ar')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                <span v-if="props.item.selectable.title">
                  {{ props.item.selectable.title }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="this.role === 'SuperUser'">
                <span v-if="props.item.selectable.store_name">
                  {{ changeName(props.item.selectable.store_name.stor_type) }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="this.role === 'SuperUser'">
                <span v-if="props.item.selectable.store_name">
                  {{ props.item.selectable.store_name.name }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td v-if="props.item.selectable.description">
                <span v-html="props.item.selectable.description"> </span>
              </td>
              <td v-else>
                <span>{{ $t("not_appllicable") }}</span>
              </td>

              <td>
                <span v-if="props.item.selectable.start_date">
                  {{ formatDate(props.item.selectable.start_date) }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.selectable.end_date">
                  {{ formatDate(props.item.selectable.end_date) }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <!-- <td>
            <span v-if="props.item.selectable.meta_title">
              {{ props.item.selectable.meta_title}}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>-->
              <!-- <td>
                <span v-if="props.item.selectable.meta_description">
                  {{ props.item.selectable.meta_description }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td> -->
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  size="small"
                  @click="changeStatus(props.item.selectable.id)"
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
              <td>
                <router-link
                  :to="{
                    name: 'events_amend',
                    query: { slug: props.item.selectable.slug,'s_tab': tabs  },
                  }"
                >
                  <v-tooltip :text="this.$t('edit')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        plain
                        v-bind="props"
                        dense
                        class="mr-2 edit_btn icon_size"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.id)">
                  <v-tooltip :text="this.$t('delete')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="delete_btn icon_size"
                        v-on="on"
                        small
                        type="button"
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </span>
              </td>
              <td>
                <v-chip
                  :color="getStatusColor(props.item.selectable.approval_status)"
                  variant="outlined"
                >
                  {{ changeStatusAr(props.item.selectable.approval_status) }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  size="small"
                  @click="viewEvents(props.item.selectable.slug)"
                  :disabled="loading"
                  class="ma-1"
                  color="blue"
                  >{{ $t("view_ar") }}</v-btn
                >
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
    </v-window>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
  },
  data: () => ({
    events_en: [],
    events_ar: [],
    initval: false,
    role: '',
    status_id: null,
    isDisabled: false,
    showConfirmDialog: false,
    delete_id: "",
    tabs: 1,
    approval_status_items: [
      {
        id: 1,
        shortname: "In Review",
        longname: "In Review",
      },
      {
        id: 2,
        shortname: "Approved",
        longname: "Approved",
      },
      {
        id: 3,
        shortname: "Rejected",
        longname: "Rejected",
      },
    ],
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    user: "",
    sel_lang: "",
    showStatusDialog: false,
  }),
  mounted() {
    this.role = JSON.parse(localStorage.getItem("user_data")).rolename;
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchEvents();
  },
  watch: {
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers_en() {
      let headers = [
        {
          title: this.$t("title_en"),
          align: "left",
          key: "title",
        },
        {
          title: this.$t("description_en"),
          key: "description",
        },
        {
          title: this.$t("start_date_en"),
          key: "start_date",
        },
        {
          title: this.$t("end_date_en"),
          key: "end_date",
        },
        {
          title: this.$t("status_en"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("approval_en"),
          key: "approval_status",
        },
        {
          title: this.$t("action_en"),
          align: "center",
          key: "action",
        },
        {
          title: "",
          align: "center",
        },
      ];

      if (this.role === "SuperUser") {
        headers.splice(1, 0, { title: this.$t("store_type_en"), key: "store_name.stor_type" });
        headers.splice(2, 0, { title: this.$t("mall/store_en"), key: "stor_type.name" });
      }

      return headers;
    },
    headers_ar() {
      let headers = [
        {
          title: this.$t("title_ar"),
          align: "left",
          key: "title",
        },
        {
          title: this.$t("description_ar"),
          key: "description",
        },
        {
          title: this.$t("start_date_ar"),
          key: "start_date",
        },
        {
          title: this.$t("end_date_ar"),
          key: "end_date",
        },
        {
          title: this.$t("status_ar"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("approval_ar"),
          key: "approval_status",
        },
        {
          title: this.$t("action_ar"),
          align: "center",
          key: "action",
        },
        {
          title: "",
          align: "center",
        },
      ];

      if (this.role === "SuperUser") {
        headers.splice(1, 0, { title: this.$t("store_type_ar"), key: "store_name.stor_type" });
        headers.splice(2, 0, { title: this.$t("mall/store_ar"), key: "stor_type.name" });
      }

      return headers;
    },
  },
  methods: {
        changeName(store){
 switch (store) {
        case "Mall":
          return this.$t("mall_ar");
        case "Store":
          return this.$t("store_ar");
    }
    },
    changeStatusAr(status) {
      switch (status) {
        case "Approved":
          return this.$t("approved_ar");
        case "In Review":
          return this.$t("inreview_ar");
        case "Rejected":
          return this.$t("rejected_ar");
        default:
          return "";
      }
    },
    getStatusColor(status) {
      switch (status) {
        case "Approved":
          return "green";
        case "In Review":
          return "orange";
        case "Rejected":
          return "red";
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
    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(id) {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_events/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchEvents();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchEvents();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.initval = true;
      this.showStatusDialog = false;
      this.statusUpdate();
    },
    fetchEvents() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_events")
        .then((res) => {
          this.events_en = res.data.events_en;
          this.events_ar = res.data.events_ar;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_events_status", {
          id: this.status_id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.initval = true;
            this.fetchEvents();
          } else if (res.data.status == "E") {
            this.$toast.success(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchEvents();
          }
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    viewEvents(slug) {
      this.$router.push({
        name: "events-review",
        query: { slug: slug ,
        's_tab': this.tabs },
      });
    },
  },
};
</script>
<style scoped>
/* .v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
} */

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.userindexcodechip:hover {
  cursor: pointer;
}

.usernamehoverstyle:hover {
  /* cursor: pointer; */
  font-weight: 500;
}

.usernamehoverstyle {
  font-weight: 500;
  color: rgb(71, 174, 110);
}

.delete_icon_size {
  font-size: 20px !important;
}
</style>
