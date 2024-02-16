<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar position-relative"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '',]"
    >
      <page-title
        class="col-md-3"
        :heading="$t('products')"
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
            <router-link :to="{ name: 'products_amend' }" style="color: white">
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
          :headers="headers"
          :items="products_en"
          :search="search"
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
              <td>
                <span v-if="props.item.selectable.description">
                  {{ props.item.selectable.description }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
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
              </td>
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
                    >{{ $t("active_en") }}</span
                  >
                  <span
                    v-if="props.item.selectable.status == 0"
                    class="spanactivesize"
                    >{{ $t("inactive_en") }}</span
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
                    name: 'products_amend',
                    query: { slug: props.item.selectable.slug },
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
                  @click="viewProduct(props.item.selectable.slug)"
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
          :items="products_ar"
          :search="search"
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
              <td>
                <span v-if="props.item.selectable.description">
                  {{ props.item.selectable.description }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
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
              </td>
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
                <v-chip
                  :color="getStatusColor(props.item.selectable.approval_status)"
                  variant="outlined"
                >
                  {{ changeStatusAr(props.item.selectable.approval_status) }}
                </v-chip>
              </td>
              <td>
                <router-link
                  :to="{
                    name: 'products_amend',
                    query: { slug: props.item.selectable.slug },
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
                  @click="viewProduct(props.item.selectable.slug)"
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
    products_en: [],
    products_ar: [],
    initval: false,
    status_id: null,
    isDisabled: false,
    showConfirmDialog: false,
    delete_id: "",
    sel_lang: "",
    tabs: 1,
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
    showStatusDialog: false,
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchproducts();
  },
   watch: {
    '$i18n.locale'(newLocale) {
      if (newLocale === 'ar') {
        this.sel_lang = 'ar';
      } else {''
        this.sel_lang = 'en';
      }
    }
  },
  computed: {
    headers() {
      return [
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
          title: this.$t("meta_title_en"),
          key: "meta_title",
        },

        {
          title: this.$t("meta_description_en"),
          key: "meta_description",
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
          key: "",
          align: "left",
        },
        {
          title: " ",
          align: "center",
        },
      ];
    },

    headers_ar() {
      return [
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
          title: this.$t("meta_title_ar"),
          key: "meta_title",
        },

        {
          title: this.$t("meta_description_ar"),
          key: "meta_description",
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
          key: "",
          align: "left",
        },
        {
          title: " ",
          align: "center",
        },
      ];
    },
  },
  methods: {
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
    viewProduct(slug) {
      this.$router.push({
        name: "products-review",
        query: { slug: slug },
      });
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
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_products/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchproducts();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchproducts();
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
    fetchproducts() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_products")
        .then((res) => {
          this.products_en = res.data.products_en;
          this.products_ar = res.data.products_ar;
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
    routereditusers(slug, empno, role) {
      if (role) {
        return;
      }
      if (empno != null) {
        this.$router.push({
          name: "users.view",
          query: {
            slug: slug,
            view: "userview",
          },
        });
      } else {
        this.$router.push({
          name: "employee_creation",
          query: {
            slug: slug,
            pathname: "userview",
          },
        });
      }
    },

    statusUpdate() {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_products_status", {
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
            this.fetchproducts();
          } else if (res.data.status == "E") {
            this.$toast.success(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchproducts();
          }
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log("this error" + err);
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
