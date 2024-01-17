<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
    >
      <page-title
        class="col-md-3"
        :heading="$t('notifications')"
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
        <v-tooltip :text="this.$t('send_notification')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{ name: 'notification_amend' }"
              style="color: white"
            >
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">
                {{ $t("send_notification") }}
              </v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="notification"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td style="max-width: 150px">
            <span v-if="props.item.selectable.title">{{
              props.item.selectable.title
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td style="max-width: 270px; text-align: justify">
            <span v-if="props.item.selectable.description">{{
              props.item.selectable.description
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.type">{{
              props.item.selectable.type
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.fetchuserdetails">{{
              props.item.selectable.fetchuserdetails.full_name
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.created_at">{{
              formatDateTime(props.item.selectable.created_at)
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td class="px-0 text-center">
            <v-tooltip :text="this.$t('user_details')" location="bottom">
              <template v-slot:activator="{ btnprops }">
                <v-btn
                  plain
                  size="small"
                  color="blue"
                  @click="
                    showuserdetails(
                      props.item.selectable.id,
                      props.item.selectable.title
                    )"
                    :disabled="userdetailsloader"
                  v-bind="btnprops"
                  dense
                  >{{ $t("user_details") }}</v-btn
                >
              </template>
            </v-tooltip>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog persistent v-model="dialog" width="800px">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-content-between">
            <h5>{{ $t("user_details") }} ({{ notification_name }})</h5>
            <v-tooltip :text="$t('cancel')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon @click="close" v-bind="props" v-on="on"
                  >mdi-close</v-icon
                >
              </template>
            </v-tooltip>
          </div>
          <div>
            <v-data-table
              :headers="headers1"
              :items="user_details"
              :search="search"
              v-bind:no-data-text="$t('no_data_available')"
              :footer-props="{
                'items-per-page-text': $t('rows_per_page'),
              }"
            >
              <template v-slot:item="props">
                <tr class="vdatatable_tbody">
                  <td>
                    <span v-if="props.item.selectable.full_name">{{
                      props.item.selectable.full_name
                    }}</span>
                    <span v-else>{{ $t("not_appllicable") }}</span>
                  </td>
                  <td>
                    <span v-if="props.item.selectable.email">{{
                      props.item.selectable.email
                    }}</span>
                    <span v-else>{{ $t("not_appllicable") }}</span>
                  </td>
                  <td>
                    <span v-if="props.item.selectable.phone">{{
                      props.item.selectable.phone
                    }}</span>
                    <span v-else>{{ $t("not_appllicable") }}</span>
                  </td>
                  <td>
                    <span v-if="props.item.selectable.rolename">{{
                      props.item.selectable.rolename
                    }}</span>
                    <span v-else>{{ $t("not_appllicable") }}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    search: "",
    notification_name: "",
    dialog: false,
    userdetailsloader: false,
    notification: [],
    user_details: [],
    initval: true,
    message: "",
    delete_id: null,
    google_icon: {
      icon_name: "add_alert",
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
          title: this.$t("title"),
          align: "left",
          sortable: true,
          key: "title",
        },
        {
          title: this.$t("body"),
          key: "description",
        },
        {
          title: this.$t("type"),
          key: "type",
        },
        {
          title: this.$t("created_by"),
          key: "fetchuserdetails.full_name",
        },
        {
          title: this.$t("sent_on"),
          key: "created_at",
        },
        {
          title: this.$t("view"),
          align: "center",
        },
      ];
    },
    headers1() {
      return [
        {
          title: this.$t("name"),
          align: "left",
          sortable: true,
          key: "full_name",
        },
        {
          title: this.$t("email"),
          key: "email",
        },
        {
          title: this.$t("phone"),
          key: "phone",
        },
        {
          title: this.$t("role"),
          key: "rolename",
        },
      ];
    },
  },

  watch: {},

  mounted() {
    this.fetchNotifcation();
  },

  methods: {
    showuserdetails(id, notification_name) {
      this.initval = true;
      this.userdetailsloader = true;
      this.notification_name = notification_name;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getviewuserdetails/" + id)
        .then((res) => {
          this.user_details = res.data.user_details;
          this.dialog = true;
          this.initval = false;
          this.userdetailsloader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
          this.userdetailsloader = false;
        });
    },
    close() {
      this.user_details = [];
      this.dialog = false;
      this.notification_name = "";
    },
    fetchNotifcation() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchallnotification")
        .then((res) => {
          this.notification = res.data.notification;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
        });
    },
  },
};
</script>
<style scoped></style>
