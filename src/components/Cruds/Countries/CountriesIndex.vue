<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center component_app_bar">
      <page-title class="col-md-3" :heading="$t('countries')" :google_icon="google_icon"></page-title>
      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-text-field rounded density="compact" variant="outlined" elevation="24" v-bind="props" v-model="search"
              append-icon="search" v-bind:label="$t('search')" hide-details class="srch_bar"></v-text-field>
          </template>
        </v-tooltip>
      </div>
      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link :to="{ name: 'countries_amend' }" style="color: white">
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-form ref="form" v-model="valid">
      <excelupload @ExcellRecieved=ExcellRecieved :response_data = response_data></excelupload>
    </v-form>
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
        <v-data-table :headers="headers" :items="countries_en" :search="search" :loading="initval">
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ props.item.selectable.name }}</td>
              <td class="text-center px-0">
                <router-link :to="{
                  name: 'countries_amend',
                  query: { slug: props.item.selectable.slug },
                }">
                  <v-tooltip :text="this.$t('edit')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon v-on="on" small class="mr-2 edit_btn icon_size" v-bind="props">mdi-pencil-outline</v-icon>
                    </template>
                  </v-tooltip>
                </router-link>
                <router-link small class="mr-2" :to="{
                  name: 'states',
                  query: {
                    countryslug: props.item.selectable.slug,
                  },
                }">
                  <v-tooltip :text="this.$t('states')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="mr-2 settings_icon icon_size" v-on="on">mdi-sitemap</v-icon>
                    </template>
                    <span>{{ $t("states") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.id)">
                  <v-tooltip :text="this.$t('delete')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon class="delete_btn icon_size" v-bind="props" v-on="on" small
                        type="button">mdi-trash-can-outline</v-icon>
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
        <v-data-table :headers="headers_ar" :items="countries_ar" :search="search" :loading="initval">
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
                <router-link :to="{
                      name: 'countries_amend',
                      query: { slug: props.item.selectable.slug },
                    }">
                  <v-tooltip :text="this.$t('edit')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon v-on="on" small class="mr-2 edit_btn icon_size" v-bind="props">mdi-pencil-outline</v-icon>
                    </template>
                  </v-tooltip>
                </router-link>
                <router-link small class="mr-2" :to="{
                  name: 'states',
                  query: {
                    countryslug: props.item.selectable.slug,
                  },
                }">
                  <v-tooltip :text="this.$t('states')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon v-bind="props" class="mr-2 settings_icon icon_size" v-on="on">mdi-sitemap</v-icon>
                    </template>
                    <span>{{ $t("states") }}</span>
                  </v-tooltip>
                </router-link>
                <span @click="deleteItem(props.item.selectable.header_id)">
                  <v-tooltip :text="this.$t('delete')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon class="delete_btn icon_size" v-bind="props" v-on="on" small
                        type="button">mdi-trash-can-outline</v-icon>
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

    <ConfirmDialog :show="showdeleteDialog" :cancel="cancel" :confirm="confirm" v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_record')" />
  </div>
</template>

<script>
import excelupload from "../../CustomComponents/ExcelUpload.vue"
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    excelupload,
    ConfirmDialog,
  },
  data: () => ({
    uploaded_file: null,
    countries_en: [],
    countries_ar: [],
    response_data: '',
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
    search: "",
    valid: false,
    json_fields: [
      {
        label: "Name",
        field: "name",
      },
    ],
  }),
  mounted() {
    this.fetchcountries();
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    headers() {
      return [
        {
          title: this.$t("name_en"),
          align: "left",
          sortable: true,
          key: this.tabs == 1 ? "name" : "name",
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
          key: this.tabs == 1 ? "name" : "name",
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
  methods: {
    ExcellRecieved(file) {
      this.uploaded_file = file;
      if (this.uploaded_file) {
        this.$axios.post('/insert_country_template', {
          file :this.uploaded_file
        })
          .then((res) => {
            this.response_data = res.data.status;
            if (res.data.status == "S") {
              this.fetchcountries();
              this.loader = false;
            }
            else {
              // this.fetchcountries();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    cancel() {
      this.showdeleteDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showdeleteDialog = false;
    },
    fetchcountries() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_countries")
        .then((res) => {
          this.initval = false;

          // this.$toast.success(this.array_data);
          this.countries_en = res.data.countries_en;
          this.countries_ar = res.data.countries_ar;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },
    deleteConfirm() {
      this.deletecountries(this.delete_id);
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.showdeleteDialog = true;
    },
    deletecountries(id) {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_countries/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchcountries();
            localStorage.removeItem("appimage");
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
    pdfgen: function (countries) {
      var pdfMake = require("pdfmake/build/pdfmake.js");
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require("pdfmake/build/vfs_fonts.js");
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
      }
      var docDefinition = {
        content: [
          { text: "System Parameter Report", style: "header" },
          this._table(countries, [
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

.erroralert /deep/ i {
  margin-top: 5px;
}
</style>