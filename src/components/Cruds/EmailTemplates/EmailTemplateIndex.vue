<template>
  <div class="main-20">

    <!-- HEADER -->
    <div
      class="row py-5 pl-5 align-items-center component_app_bar position-relative"
      :class="[sel_lang === 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4"
        :heading="$t('email_templates')"
        :google_icon="google_icon"
      />

      <!-- SEARCH -->
      <div class="col-md-4">
        <v-text-field
          v-model="search"
          rounded
          density="compact"
          variant="outlined"
          append-icon="search"
          :label="$t('search')"
          hide-details
          class="srch_bar"
        />
      </div>

      <!-- ADD BUTTON -->
      <div class="add_new_button">
        <router-link
          :to="{ name: 'email_template_amend', query: { s_tab: tabs } }"
        >
          <v-btn size="small" class="green_btn_color">
            {{ $t("add_new") }}
          </v-btn>
        </router-link>
      </div>
    </div>

    <!-- TABLE -->
    <v-data-table
      :headers="headers"
      :items="filteredTemplates"
      :loading="initval"
      item-key="id"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.template_name }}</td>
          <td>{{ item.template_subject }}</td>
          <td class="text-center">
            <router-link
              :to="{
                name: 'email_template_amend',
                query: { slug: item.slug, s_tab: tabs },
              }"
            >
              <v-icon class="mr-2">mdi-pencil-outline</v-icon>
            </router-link>

            <v-icon color="error" @click="deleteItem(item.id)">
              mdi-trash-can-outline
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- CONFIRM DIALOG -->
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      :title="$t('confirm')"
      :description="$t('delete_confirmation')"
    />

  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";

export default {
  components: { PageTitle, ConfirmDialog },

  data() {
    return {
      search: "",
      email_templates: [],
      initval: true,
      tabs: 1,

      showConfirmDialog: false,
      delete_id: null,

      google_icon: {
        icon_name: "dynamic_feed",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      sel_lang: "",
    };
  },

  computed: {
    headers() {
      return [
        { title: this.$t("name_en"), key: "template_name" },
        { title: this.$t("subject_en"), key: "template_subject" },
        { title: this.$t("action_en"), key: "action", align: "center" },
      ];
    },

    filteredTemplates() {
      if (!this.search) return this.email_templates;

      return this.email_templates.filter(t =>
        t.template_name
          ?.toLowerCase()
          .includes(this.search.toLowerCase())
      );
    },
  },

  mounted() {
    this.fetchEmailTemplates();

    if (this.$route.query.s_tab) {
      this.tabs = this.$route.query.s_tab == 1 ? 1 : 2;
    }
  },

  methods: {
    fetchEmailTemplates() {
      this.initval = true;

      this.$axios
        .get(import.meta.env.VUE_APP_API_URL_ADMIN + "emailtemplates")
        .then((res) => {
          this.email_templates = res.data?.email_templates || [];
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.initval = false;
        });
    },

    deleteItem(id) {
      this.delete_id = id;
      this.showConfirmDialog = true;
    },

    cancel() {
      this.showConfirmDialog = false;
    },

    confirm(id) {
      this.$axios
        .delete(import.meta.env.VUE_APP_API_URL_ADMIN + "emailtemplates/" + id)
        .then((res) => {
          const msg = Array.isArray(res.data.message)
            ? res.data.message.toString()
            : res.data.message;

          res.data.status === "E"
            ? this.$toast.error(msg)
            : this.$toast.success(msg);

          this.fetchEmailTemplates();
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.showConfirmDialog = false;
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