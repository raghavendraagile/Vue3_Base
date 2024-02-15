<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center position-relative">
      <page-title
        class="col-md-4"
        :heading="$t('email_templates')"
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
              :to="{ name: 'email_template_amend' }"
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
          :items="email_templates"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available')"
                :items-per-page-text="$t('rows_per_page_en')"

        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ props.item.selectable.templatetypename }}</td>
              <td>{{ props.item.selectable.template_name }}</td>
              <td>{{ props.item.selectable.template_subject }}</td>
              <td class="text-center">
                <router-link
                  small
                  :to="{
                    name: 'email_template_amend',
                    query: { slug: props.item.selectable.slug },
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
      </v-window-item>
      <!-- ENGLISH TAB STOPS -->
      <!-- ARABIC TAB STARTS -->
      <v-window-item :value="2">
        <v-data-table
          :headers="headers_ar"
          :items="email_templates"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available')"
              :items-per-page-text="$t('rows_per_page_ar')"

        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ props.item.selectable.templatetypename }}</td>
              <td>{{ props.item.selectable.template_name }}</td>
              <td>{{ props.item.selectable.template_subject_ar }}</td>
              <td class="text-center">
                <router-link
                  small
                  :to="{
                    name: 'email_template_amend',
                    query: { slug: props.item.selectable.slug },
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
      </v-window-item>
    </v-window>
    <!--  ARABIC TAB ENDS-->

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
    search: "",
    showConfirmDialog: false,
    delete_id: null,
    tabs: 1,
    dialog: false,
    email_templates: [],
    initval: true,
    add_type: "Other Template",
    google_icon: {
      icon_name: "dynamic_feed",
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
          title: this.$t("type_en"),
          key: "templatetypename",
        },
        {
          title: this.$t("name_en"),
          key: "template_name",
        },
        {
          title: this.$t("subject_en"),
          key: "template_subject",
        },
        {
          title: this.$t("action_en"),
          align: "center",
          key: "email",
        },
      ];
    },
    headers_ar() {
      return [
        {
          title: this.$t("type_ar"),
          key: "templatetypename",
        },
        {
          title: this.$t("name_ar"),
          key: "template_name",
        },
        {
          title: this.$t("subject_ar"),
          key: "template_subject",
        },
        {
          title: this.$t("action_ar"),
          align: "center",
          key: "email",
        },
      ];
    },

    dropdown_font() {
      return [
        {
          text: this.$t("default_template"),
          value: "Default Templates",
        },
        {
          text: this.$t("other_template"),
          value: "Other Templates",
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {},
  mounted() {
    this.fetchEmailTemplates();
  },

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    fetchEmailTemplates() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "emailtemplates")
        .then((res) => {
          this.email_templates = res.data.email_templates;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
    },
    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(template_id) {
      this.$axios
        .delete(
          process.env.VUE_APP_API_URL_ADMIN + "emailtemplates/" + template_id
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
            this.fetchEmailTemplates();
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

    addDropdown(addtype) {
      this.add_type = addtype;
      this.$emit("template_type", addtype);
    },
  },
};
</script>
<style scoped>
.list_item {
  cursor: pointer;
}
</style>