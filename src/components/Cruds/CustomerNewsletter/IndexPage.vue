<template>
  <div class="main-20">
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-3"
        :heading="$t('newsletter_subscriptions')"
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
              v-model="search"
              append-icon="search"
              label="Search"
              class="srch_bar"
              small
              hide-details
              v-bind="props"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-data-table
      :headers="headers_en"
      :items="customer_newsletter"
      :search="search"
      :loading="initval"
      :no-data-text="$t('no_data_available')"
      :items-per-page-text="$t('rows_per_page')"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.selectable.email_id }}</td>
          <td>{{ formatDateTime(props.item.selectable.created_at) }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
    
  <script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    search: "",
    customer_newsletter: [],
    initval: true,
    sel_lang: "",
    google_icon: {
      icon_name: "mail",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  computed: {
    headers_en() {
      return [
        {
          title: this.$t("email"),
          key: "email_id",
        },
        {
          title: this.$t("subscribed_on"),
          key: "created_at",
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
    this.fetchCustomerNewsletter();
  },

  methods: {
    fetchCustomerNewsletter() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-customer-newsletter")
        .then((res) => {
          this.customer_newsletter = res.data.customer_newsletters;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
    },
  },
};
</script>
  <style scoped>
.list_item {
  cursor: pointer;
}
</style>