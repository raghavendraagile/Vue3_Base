<template>
  <div class="main-20">
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-3"
        :heading="$t('states')"
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
                name: 'states_amend',
                query: {
                  countryslug: countryslug,
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
        <v-tooltip :text="this.$t('back')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{
                name: 'countries',
                query: { s_tab: tabs },
              }"
              style="color: white"
            >
              <v-btn
                size="small"
                class="mb-2 ml-2 mr-2"
                color="cancel"
                v-bind="props"
                >{{ $t("back") }}</v-btn
              >
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
          :headers="headers"
          :items="states_en"
          :search="search"
          :loading="initval"
          :no-data-text="$t('no_data_available_en')"
          :items-per-page-text="$t('rows_per_page_en')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ props.item.selectable.name }}</td>
              <td class="text-center px-0">
                <router-link
                  :to="{
                    name: 'states_amend',
                    query: {
                      slug: props.item.selectable.slug,
                      s_tab: tabs,
                    },
                  }"
                >
                  <v-tooltip :text="this.$t('edit_en')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-on="on"
                        small
                        class="mr-2 edit_btn icon_size"
                        v-bind="props"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </router-link>
                <router-link
                  small
                  class="mr-2"
                  :to="{
                    name: 'cities',
                    query: {
                      countryslug: countryslug,
                      s_tab: tabs,
                      stateslug: props.item.selectable.slug,
                    },
                  }"
                >
                  <v-tooltip :text="this.$t('city_en')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="mr-2 settings_icon icon_size"
                        v-on="on"
                        >mdi-sitemap</v-icon
                      >
                    </template>
                    <span>{{ $t("city_en") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
                  <v-tooltip :text="this.$t('delete_en')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        class="delete_btn icon_size"
                        v-bind="props"
                        v-on="on"
                        small
                        type="button"
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
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
          :items="states_ar"
          :search="search"
          :loading="initval"
          class="rtl-direction"
          :no-data-text="$t('no_data_available_ar')"
          :items-per-page-text="$t('rows_per_page_ar')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                {{
                  props.item.selectable.name
                    ? props.item.selectable.name
                    : $t("not_appllicable")
                }}
              </td>
              <td class="text-center px-0">
                <router-link
                  :to="{
                    name: 'states_amend',
                    query: {
                      slug: props.item.selectable.slug,
                      s_tab: tabs,
                    },
                  }"
                >
                  <v-tooltip :text="this.$t('edit_ar')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-on="on"
                        small
                        class="mr-2 edit_btn icon_size"
                        v-bind="props"
                        >mdi-pencil-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </router-link>
                <router-link
                  small
                  class="mr-2"
                  :to="{
                    name: 'cities',
                    query: {
                      countryslug: countryslug,
                      s_tab: tabs,
                      stateslug: props.item.selectable.slug,
                    },
                  }"
                >
                  <v-tooltip :text="this.$t('city_ar')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        class="mr-2 settings_icon icon_size"
                        v-on="on"
                        >mdi-sitemap</v-icon
                      >
                    </template>
                    <span>{{ $t("city_ar") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
                  <v-tooltip :text="this.$t('delete_ar')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        class="delete_btn icon_size"
                        v-bind="props"
                        v-on="on"
                        small
                        type="button"
                        >mdi-trash-can-outline</v-icon
                      >
                    </template>
                  </v-tooltip>
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
    </v-window>
    <!--  ARABIC TAB ENDS-->

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
    states: [],
    selected_country_details: [],
    showdeleteDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    tabs: 1,
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    sel_lang: "",
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    countryslug: "",
    states_ar: [],
    states_en: [],
    json_fields: [
      {
        label: "Name",
        field: "name",
      },
    ],
  }),
  computed: {
    headers() {
      return [
        {
          title: this.$t("name_en"),
          align: "left",
          sortable: true,
          key: "name",
        },
        {
          title: this.$t("actions_en"),
          // key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
    headers_ar() {
      return [
        {
          title: this.$t("name_ar"),
          align: "left",
          sortable: true,
          key: "name",
        },
        {
          title: this.$t("actions_ar"),
          // key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  },
  watch: {
    "$route.query.countryslug": {
      immediate: true,
      handler() {
        if (this.$route.query.countryslug) {
          this.countryslug = this.$route.query.countryslug;
          this.fetchstates();
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
  },
  mounted() {
    if (this.$route.query.s_tab) {
      this.tabs = this.$route.query.s_tab == 1 ? 1 : 2;
    }
  },
  methods: {
    cancel() {
      this.showdeleteDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showdeleteDialog = false;
    },
    fetchstates() {
      this.initval = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetch_states?countryslug=" +
            this.countryslug
        )
        .then((res) => {
          this.initval = false;
          // this.$toast.success(this.array_data);
          this.states_en = res.data.states_en;
          this.states_ar = res.data.states_ar;
          this.selected_country_details = res.data.countries;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },
    deleteConfirm() {
      this.deletestates(this.delete_id);
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.showdeleteDialog = true;
    },
    deletestates(id) {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_states/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchstates();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
    },

    // PDF download
    pdfgen: function (states) {
      var pdfMake = require("pdfmake/build/pdfmake.js");
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require("pdfmake/build/vfs_fonts.js");
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
      }
      var docDefinition = {
        content: [
          { text: "System Parameter Report", style: "header" },
          this._table(states, [
            "parameter_name",
            "parameter_value",
            "description",
            "status",
          ]),
        ],
      };

      pdfMake.createPdf(docDefinition).download("System Parameter.pdf");
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