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
        :heading="$t('stores')"
        :google_icon="google_icon"
      ></page-title>

      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="top">
          <template v-slot:activator="{ props }">
            <v-text-field
              dense
              density="compact"
              v-on="on"
              variant="outlined"
              v-bind:label="$t('search')"
              v-model="search"
              append-icon="search"
              class="srch_bar"
              small
              hide-details
              v-bind="props"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>

      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{
                name: 'stores-amend',
                query: {
                  s_tab: tabs,
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
          :items="stores_en"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available')"
          :footer-props="{
            'items-per-page-text': $t('rows_per_page'),
          }"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ props.item.selectable.stor_type }}</td>
              <td>{{ props.item.selectable.name }}</td>
              <td>{{ props.item.selectable.email }}</td>
              <td>{{ props.item.selectable.phone }}</td>
              <td>{{ props.item.selectable.seq }}</td>
              <td>
                <v-chip
                  :color="getStatusColor(props.item.selectable.approval_status)"
                  variant="outlined"
                >
                  {{ props.item.selectable.approval_status }}
                </v-chip>
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
                    name: 'stores-amend',
                    query: { slug: props.item.selectable.slug, 's_tab': tabs},
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
                <span
                  @click="deleteItem(props.item.selectable.header_id)"
                  v-if="!props.item.selectable.have_child"
                >
                  <v-tooltip :text="this.$t('delete')" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon color="error" type="button" v-bind="props" small
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </span>
                <span v-else>
                  <v-icon color="grey" class="disabledmditrash" small
                    >mdi-trash-can-outline</v-icon
                  >
                </span>
              </td>
              <td>
                <v-btn
                  size="small"
                  @click="viewStores(props.item.selectable.slug)"
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
      <!-- ENGLISH TAB END -->
      <!-- ARABIC TAB STARTS -->
      <v-window-item :value="2">
        <v-data-table
          :headers="headers_ar"
          :items="stores_ar"
          :search="search"
          :loading="initval"
          class="rtl-direction"
          :no-data-text="$t('no_data_available')"
          :items-per-page-text="$t('rows_per_page_ar')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ arType(props.item.selectable.stor_type) }}</td>
              <td>{{ props.item.selectable.name }}</td>
              <td>{{ props.item.selectable.email }}</td>
              <td>{{ props.item.selectable.phone }}</td>
              <td>{{ props.item.selectable.seq }}</td>
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
                    name: 'stores-amend',
                    query: { slug: props.item.selectable.slug, 's_tab': tabs},
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
                <span
                  @click="deleteItem(props.item.selectable.header_id)"
                  v-if="!props.item.selectable.have_child"
                >
                  <v-tooltip :text="this.$t('delete')" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon color="error" type="button" v-bind="props" small
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                    <span>{{ $t("delete") }}</span>
                  </v-tooltip>
                </span>
                <span v-else>
                  <v-icon color="grey" class="disabledmditrash" small
                    >mdi-trash-can-outline</v-icon
                  >
                </span>
              </td>
              <td>
                <v-btn
                  size="small"
                  @click="viewStores(props.item.selectable.slug)"
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
    stores_en: [],
    stores_ar: [],
    initval: true,
    google_icon: {
      icon_name: "storefront",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    status_id: null,
    sel_lang: "",
    showStatusDialog: false,
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
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers_en() {
      return [
        {
          title: this.$t("store_type"),
          key: "stor_type",
        },
        {
          title: this.$t("name_en"),
          key: "name",
        },
        {
          title: this.$t("email_en"),
          key: "email",
        },
        {
          title: this.$t("phone_en"),
          key: "phone",
        },
        {
          title: this.$t("sequence_en"),
          key: "seq",
        },
        {
          title: this.$t("approval_en"),
          key: "approval_status",
        },
        {
          title: this.$t("status_en"),
          key: "status",
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
    },
    headers_ar() {
      return [
        {
          title: this.$t("store_type_ar"),
          key: "stor_type",
        },
        {
          title: this.$t("name_ar"),
          key: "name",
        },
        {
          title: this.$t("email_ar"),
          key: "email",
        },
        {
          title: this.$t("phone_ar"),
          key: "phone",
        },
        {
          title: this.$t("sequence_ar"),
          key: "seq",
        },
        {
          title: this.$t("approval_ar"),
          key: "approval_status",
        },
        {
          title: this.$t("status_ar"),
          key: "status",
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
        ("");
        this.sel_lang = "en";
      }
    },
  },

  created() {},
  mounted() {
    this.fetchStores();
  },

  methods: {
    arType(type) {
      switch (type) {
        case "Mall":
          return this.$t("mall_ar");
        case "Store":
          return this.$t("store_ar");
        default:
          return "";
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
    viewStores(slug) {
      this.$router.push({
        name: "stores-review",
        query: { slug: slug, 's_tab': this.tabs },
      });
    },
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    fetchStores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "stores")
        .then((res) => {
          this.stores_en = res.data.stores_en;

          this.stores_ar = res.data.stores_ar;

          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
    },

    deleteItem(store_id) {
      this.delete_id = store_id;
      this.showConfirmDialog = true;
    },

    deleteConfirm(store_id) {
      this.$axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "stores/" + store_id)
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
            this.fetchStores();
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
        .post(process.env.VUE_APP_API_URL_ADMIN + "update-stores-status", {
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
            this.fetchStores();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchStores();
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
.disabledmditrash:hover {
  animation: none;
}
</style>
