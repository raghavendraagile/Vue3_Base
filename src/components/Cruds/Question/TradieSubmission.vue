
<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
    >
      <page-title
        class="col-md-4"
        :heading="$t('wizard_submission')"
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
      :headers="adminheaders"
      :items="submitted_questions"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <span class="mr-2">
              <v-avatar
                v-if="props.item.selectable.image_url != null"
                size="30"
                :image="envImagePath + props.item.selectable.image_url"
              ></v-avatar>
              <v-avatar v-else size="30">
                <v-img
                  :src="require('@/assets/images/avatars/default.png')"
                ></v-img>
              </v-avatar>
            </span>
            <span v-if="props.item.selectable.full_name">
              {{ props.item.selectable.full_name }}
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <div v-if="props.item.selectable.header_approved">
              <span v-if="props.item.selectable.header_approved.submitted_date">
                {{
                  formatDateTime(
                    props.item.selectable.header_approved.submitted_date
                  )
                }}
              </span>
              <span v-else>{{ $t("not_appllicable") }}</span>
            </div>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.header_approved">
              <v-chip
                v-if="
                  props.item.selectable.header_approved &&
                  props.item.selectable.header_approved.status == 'Completed'
                "
                class
                size="small"
                color="yellow-darken-4"
                text-color="white"
              >
                <v-icon size="small" start icon="mdi-dots-horizontal"></v-icon>
                {{ $t("pending") }}
              </v-chip>

              <v-chip
                v-if="
                  props.item.selectable.header_approved &&
                  props.item.selectable.header_approved.status == 'Approved'
                "
                size="small"
                class
                color="green"
                text-color="white"
              >
                <v-icon size="small" start icon="mdi-check"></v-icon>Approved
              </v-chip>

              <v-chip
                v-if="
                  props.item.selectable.header_approved &&
                  props.item.selectable.header_approved.status == 'Rejected'
                "
                class
                color="red-accent-2"
                text-color="white"
                size="small"
              >
                <v-icon size="small" start icon="mdi-close"></v-icon>Rejected
              </v-chip>
            </span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <router-link
              :to="{
                name: 'view-licenses',
                query: {
                  slug: props.item.selectable.slug,
                },
              }"
            >
              <v-tooltip :text="this.$t('view_license')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    plain
                    v-bind="props"
                    dense
                    class="mr-2 edit_btn icon_size"
                    >mdi-eye-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </router-link>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
    
<script>
// import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: {
    // ConfirmDialog,
  },
  data: () => ({
    google_icon: {
      icon_name: "assignment",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    user: [],
    initval: false,
    next_seq: "",
    submitted_questions: [],
    adminheaders: [
      {
        title: "Name",
        align: "left",
        key: "full_name",
      },
      {
        title: "Date Submitted",
        key: "email",
      },

      {
        title: "Status",
        align: "left",
        sortable: false,
        key: "status",
      },
      {
        title: "Actions",
        key: "",
        align: "left",
      },
    ],

    search: "",
  }),
  watch: {},
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchHeaderAnswerDetails();
    // this.$eventBus.$emit("tradie_submission");
  },
  methods: {
    fetchHeaderAnswerDetails() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchheaderanswerdetails")
        .then((res) => {
          this.submitted_questions = res.data.submitted_questions;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },
  },
};
</script>
<style scoped></style>