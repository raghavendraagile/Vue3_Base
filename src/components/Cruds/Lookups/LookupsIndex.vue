<template>
  <div class="main-20">
    <content-loader v-if="loader"></content-loader>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar position-relative"
    >
      <page-title
        class="col-md-3"
        :heading="$t('lookups')"
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
            <router-link :to="{ name: 'lookups_amend' }" style="color: white">
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-tabs v-model="tabs" color="blue">
      <v-tab :value="1" @click="checkUploadImage">
        <span>{{ $t("english") }}</span>
      </v-tab>
      <v-tab :value="2" @click="checkUploadImage">
        <span>{{ $t("arabic") }}</span>
      </v-tab>
    </v-tabs>
    <v-window v-model="tabs">
      <!-- ENGLISH TAB STARTS -->
      <v-window-item :value="1">
        <v-data-table
          :headers="headers_en"
          :items="lookup_en"
          :search="search"
          :loading="initval"
          :no-data-text="$t('no_data_available')"
          :items-per-page-text="$t('rows_per_page_en')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                <div class="text-truncate" style="max-width: 160px">
                  {{
                    props.item.selectable.shortname
                      ? props.item.selectable.shortname
                      : $t("not_appllicable")
                  }}
                </div>
              </td>
              <td>
                <div class="text-truncate" style="max-width: 160px">
                  {{
                    props.item.selectable.longname
                      ? props.item.selectable.longname
                      : $t("not_appllicable")
                  }}
                </div>
              </td>
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="updateLookupsStatus(props.item.selectable.header_id)"
                  size="small"
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
              <td class="text-center px-0">
                <router-link
                  small
                  :to="{
                    name: 'lookups_amend',
                    query: { slug: props.item.selectable.slug },
                  }"
                >
                  <v-tooltip :text="this.$t('edit')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        small
                        class="mr-2 edit_btn icon_size"
                        v-on="on"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </router-link>
                <router-link
                  small
                  class="mr-2"
                  :to="{
                    name: 'child_lookup',
                    query: {
                      slug: props.item.selectable.slug,
                      parentname: props.item.selectable.shortname,
                    },
                  }"
                >
                  <v-tooltip
                    :text="this.$t('child_look_ups')"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="mr-2 settings_icon icon_size"
                        v-on="on"
                        >mdi-sitemap</v-icon
                      >
                    </template>
                    <span>{{ $t("child_look_ups") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
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
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
      <!-- ENGLISH TAB STOPS -->
      <!-- ARABIC TAB STARTS -->
      <v-window-item :value="2">
        <v-data-table
          :headers="headers_ar"
          :items="lookup_ar"
          :search="search"
          :loading="initval"
          class="rtl-direction"
          :no-data-text="$t('no_data_available')"
          :items-per-page-text="$t('rows_per_page_ar')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                <div class="text-truncate" style="max-width: 160px">
                  {{
                    props.item.selectable.shortname
                      ? props.item.selectable.shortname
                      : $t("not_appllicable")
                  }}
                </div>
              </td>
              <td>
                <div class="text-truncate" style="max-width: 160px">
                  {{
                    props.item.selectable.longname
                      ? props.item.selectable.longname
                      : $t("not_appllicable")
                  }}
                </div>
              </td>
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="updateLookupsStatus(props.item.selectable.header_id)"
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
              <td class="text-center px-0">
                <router-link
                  small
                  :to="{
                    name: 'lookups_amend',
                    query: { slug: props.item.selectable.slug },
                  }"
                >
                  <v-tooltip :text="this.$t('edit')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        small
                        class="mr-2 edit_btn icon_size"
                        v-on="on"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </router-link>
                <router-link
                  small
                  class="mr-2"
                  :to="{
                    name: 'child_lookup',
                    query: {
                      slug: props.item.selectable.slug,
                      parentname: props.item.selectable.shortname,
                    },
                  }"
                >
                  <v-tooltip
                    :text="this.$t('child_look_ups')"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="mr-2 settings_icon icon_size"
                        v-on="on"
                        >mdi-sitemap</v-icon
                      >
                    </template>
                    <span>{{ $t("child_look_ups") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
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
      :show="showdeleteDialog"
      :cancel="cancel"
      :confirm="confirm"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_record')"
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
    lookup: [],
    showdeleteDialog: false,
    loader: false,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    lookup_en: [],
    lookup_ar: [],
    isDisabled: false,
    tabs: 1,
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    initval: false,
    message: "",
    json_fields: [
      {
        label: "Shortname",
        field: "shortname",
      },
      {
        label: "Longname",
        field: "longname",
      },
      {
        label: "Status",
        field: "status",
      },
    ],
  }),
  mounted() {
    this.initialize();
  },
  computed: {
    headers_en() {
      return [
        {
          title: this.$t("shortname_en"),
          align: "left",
          sortable: true,
          key: "shortname",
        },
        {
          title: this.$t("longname_en"),
          align: "left",
          sortable: false,
          key: "longname",
        },
        {
          title: this.$t("status_en"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("action_en"),
          key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
    headers_ar() {
      return [
        {
          title: this.$t("shortname_ar"),
          align: "left",
          sortable: true,
          key: "shortname",
        },
        {
          title: this.$t("longname_ar"),
          align: "left",
          sortable: false,
          key: "longname",
        },
        {
          title: this.$t("status_ar"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("action_ar"),
          key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    cancel() {
      this.showdeleteDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showdeleteDialog = false;
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
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_lookups_status", {
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
            this.initialize();
          } else if (res.data.status == "E") {
            this.$toast.success(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
      this.loader = false;
    },
    deleteLookup(id) {
      this.loader = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_lookup/" + id)
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
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("error", err);
        });
      this.loader = false;
    },

    initialize() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "lookups")
        .then((res) => {
          this.initval = false;
          this.lookup = res.data.lookups;
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.lookup_en = res.data.lookup_en;
            this.lookup_ar = res.data.lookup_ar;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.$toast.error(this.array_data);
          } else {
            this.initval = false;
            this.$toast.error(this.array_data);
            console.log("error message");
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("error", err);
          this.initval = false;
        });
      this.loader = false;
    },

    deleteItem(item) {
      this.delete_id = item;
      this.showdeleteDialog = true;
    },
    deleteConfirm() {
      this.deleteLookup(this.delete_id);
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    updateLookupsStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },

    // PDF download
    pdfgen: function (lookups) {
      var pdfMake = require("pdfmake/build/pdfmake.js");
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require("pdfmake/build/vfs_fonts.js");
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
      }
      var docDefinition = {
        content: [
          { text: "Lookups Report", style: "header" },
          this._table(lookups, ["shortname", "longname", "seq"]),
        ],
      };
      pdfMake.createPdf(docDefinition).download("Lookups.pdf");
    },

    _table(data, cols) {
      return {
        table: {
          headerRows: 1,
          body: this._buildTableBody(data, cols),
        },
      };
    },

    _buildTableBody(data, cols) {
      let body = [];
      body.push(cols);
      data.forEach(function (row) {
        // reg obj doesn't have forEach
        let dataRow = [];
        cols.forEach(function (column) {
          dataRow.push(row[column].toString());
        });
        body.push(dataRow);
      });

      return body;
    },
  },
};
</script>
<style scoped>
.v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
}
.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.v-btn:not(.v-btn--round).v-size--small {
  min-width: 90px !important;
}
</style>