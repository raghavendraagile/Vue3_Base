<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-3"
        :heading="$t('invite_tradies')"
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

      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{ name: 'invite_tradies_amend' }"
              style="color: white"
            >
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">{{
                $t("invite")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="invite_tradies"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.selectable.email }}</td>
          <td
            v-if="
              props.item.selectable.created_user_details &&
              (props.item.selectable.created_by != null ||
                props.item.selectable.created_by != '' ||
                props.item.selectable.created_by > 0)
            "
          >
            {{ props.item.selectable.created_user_details.full_name }}
          </td>
          <td v-else>-</td>
          <td>{{ props.item.selectable.template_name.template_name }}</td>
          <td>{{ formatDateTime(props.item.selectable.created_at) }}</td>
          <!-- for showing status -->
          <td
            v-if="
              props.item.selectable.created_user_form_status &&
              props.item.selectable.created_user_form_status.header_approved &&
              props.item.selectable.created_user_form_status.header_approved
                .status
            "
          >
            {{
              props.item.selectable.created_user_form_status.header_approved
                .status
            }}
          </td>
          <td v-else>-</td>
          <!-- <td class="text-center">
                        <router-link small :to="{
                            name: 'email_template_amend',
                            query: { slug: props.item.selectable.slug },
                        }">
                            <v-tooltip :text="this.$t('edit')" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" small class="mr-2 edit_btn icon_size">mdi-pencil-outline</v-icon>
                                </template>
                                <span>{{ $t("edit") }}</span>
                            </v-tooltip>
                        </router-link>
                        <v-tooltip :text="this.$t('delete')" location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon color="error" v-bind="props" small
                                    @click="deleteItem(props.item.selectable.id)">mdi-trash-can-outline</v-icon>
                            </template>
                            <span>{{ $t("delete") }}</span>
                        </v-tooltip>
                    </td> -->
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
    search: "",
    showConfirmDialog: false,
    delete_id: null,
    dialog: false,
    invite_tradies: [],
    initval: true,
    user: [],
    user_id: 0,
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
          title: this.$t("email"),
          key: "email",
        },
        {
          title: this.$t("principal"),
          key: "",
        },
        {
          title: this.$t("template_name"),
          key: "template_name",
        },
        {
          title: this.$t("sent_on"),
          key: "created_at",
        },
        {
          title: this.$t("status"),
          key: " ",
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
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchInviteTradies();
  },

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    fetchInviteTradies() {
      this.initval = true;
      if (this.user.rolename == "SuperUser" || this.user.rolename == "Admin") {
        this.user_id = 0;
      } else if (this.user.rolename == "Principal") {
        this.user_id = this.user.id;
      }

      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "invitetradies/" + this.user_id
        )
        .then((res) => {
          this.invite_tradies = res.data.invite_tradies;
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