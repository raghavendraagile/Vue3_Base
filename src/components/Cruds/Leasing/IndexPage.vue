<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar position-relative"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-3"
        :heading="$t('leasing')"
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
    </div>
    <v-data-table
      :headers="headers"
      :items="leasing_data"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
      v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <span>{{ props.item.selectable.enquiry }}</span>
          </td>
          <td>
            <span>{{ props.item.selectable.store_type }}</span>
          </td>
          <td>
            <span>{{ props.item.selectable.company_name }}</span>
          </td>
          <td>
            <span>{{ props.item.selectable.contact_person }}</span>
          </td>
          <td>
            <span>{{ props.item.selectable.email }}</span>
          </td>
          <td>
            <span>{{ props.item.selectable.mobile }}</span>
          </td>
          <td class="px-0 text-center">
            <router-link
              :to="{
                name: 'leasing-amend',
                query: { slug: props.item.selectable.slug },
              }"
            >
              <v-tooltip :text="this.$t('view')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    plain
                    v-bind="props"
                    dense
                    class="mr-2 edit_btn icon_size"
                    >mdi-eye</v-icon
                  >
                </template>
              </v-tooltip>
            </router-link>
            <span @click="deleteItem(props.item.selectable.id)">
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
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    showConfirmDialog: false,
    search: "",
    dialog: false,
    leasing_data: [],
    initval: true,
    message: "",
    delete_id: null,
    google_icon: {
      icon_name: "box_edit",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: this.$t("enquiry"),
          align: "left",
          sortable: true,
          key: "enquiry",
        },
        {
          title: this.$t("store_type"),
          key: "store_type",
        },
        {
          title: this.$t("company_name"),
          key: "company_name",
        },
        {
          title: this.$t("contact_person"),
          key: "contact_person",
        },
        {
          title: this.$t("email"),
          key: "email",
        },
        {
          title: this.$t("mobile"),
          key: "mobile",
        },
        {
          title: this.$t("action"),
          key: "name",
          align: "center",
          sortable: false,
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

  created() {
    this.initialize();
  },
  mounted() {
    this.initialize();
  },

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm() {
      this.deleteLeasingData();
      this.showConfirmDialog = false;
    },
    deleteItem(deleteID) {
      this.delete_id = deleteID;
      this.showConfirmDialog = true;
    },

    deleteLeasingData() {
      this.initval = true;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "delete-leasing/" + this.delete_id
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.initval = false;
            this.$toast.error(this.array_data);
            this.initialize();
          } else {
            this.initval = false;
            this.$toast.success(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.initval = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    initialize() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-leasing_data")
        .then((res) => {
          this.leasing_data = res.data.leasing;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
};
</script>
<style scoped></style>
