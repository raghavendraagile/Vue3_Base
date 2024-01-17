<template>
  <div>
    <page-title
      :heading="$t('dashboard')"
      :google_icon="google_icon"
    ></page-title>
    <v-container
      v-if="
        user.role &&
        (user.role.rolename == 'Admin' ||
          user.role.rolename == 'Principal' ||
          user.role.rolename == 'SuperUser')
      "
    >
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="rounded-lg elevation-4 px-2" height="340">
            <v-card-title class="text-h6 text-md-h6 text-lg-h6 py-5">{{
              $t("tradiesafe_overview")
            }}</v-card-title>
            <v-layout
              row
              class="mt-5 justify-content-center align-items-center"
            >
              <div v-if="overview_obj" class="text-center">
                <v-progress-circular
                  :size="100"
                  :width="15"
                  :model-value="overview_obj.user_count_percentage"
                  color="blue"
                  >{{
                    overview_obj.user_count_percentage
                  }}%</v-progress-circular
                >
                <div></div>
                <h3 class="text-center text-blue mt-3">
                  {{ overview_obj.overview_details_users }}
                </h3>
                <p>
                  of
                  <strong>{{ overview_obj.overview_details_approved }}</strong>
                  Approved.
                </p>
              </div>

              <div v-else>
                <h4 color="cancel" class="text-grey text-center">
                  {{ $t("no_details") }}
                </h4>
              </div>
            </v-layout>
          </v-card>
        </v-col>
        <v-col cols="12" md="8">
          <v-card class="rounded-lg elevation-4" height="340">
            <div class="d-flex justify-content-between align-items-center mr-3">
              <v-card-title class="text-h6 text-md-h6 text-lg-h6 py-5">{{
                $t("recent_activity")
              }}</v-card-title>

              <div class>
                <v-tooltip :text="$t('view_all')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <router-link
                      :to="{ name: 'activity_log' }"
                      style="color: white"
                    >
                      <v-btn
                        size="small"
                        class="green_btn_color"
                        v-bind="props"
                      >
                        {{ $t("view_all") }}
                      </v-btn>
                    </router-link>
                  </template>
                </v-tooltip>
              </div>
            </div>
            <v-layout>
              <v-timeline
                v-if="activitylog && activitylog.length > 0"
                truncate-line="both"
                side="end"
                align="start"
              >
                <v-timeline-item
                  v-for="(activity, i) in activitylog"
                  :key="i"
                  size="small"
                  :dot-color="
                    activity.log_type == 'Approved'
                      ? '#A5D6A7'
                      : activity.log_type == 'Submitted'
                      ? '#00ACC1'
                      : activity.log_type == 'Rejected'
                      ? '#FFCCBC'
                      : ''
                  "
                >
                  <template v-slot:icon>
                    <v-icon
                      class="p-5 m-2 icon_size"
                      size="x-small"
                      v-bind:class="[
                        activity.log_type == 'Accepted'
                          ? 'text-green-darken-4'
                          : activity.log_type == 'Rejected'
                          ? 'text-red-darken-4'
                          : 'text-grey-lighten-5',
                      ]"
                    >
                      {{
                        activity.log_type == "Approved"
                          ? "mdi mdi-check-bold"
                          : activity.log_type == "Rejected"
                          ? "mdi mdi-close-thick"
                          : activity.log_type == "Submitted"
                          ? "mdi mdi-playlist-check"
                          : ""
                      }}
                    </v-icon>
                  </template>
                  <div class="d-flex">
                    <div>
                      <strong>{{ activity.description }}</strong>
                      <div class="text-caption text-grey">
                        {{ formatDateTime(activity.created_at) }}
                      </div>
                    </div>
                  </div>
                </v-timeline-item>
              </v-timeline>
              <div v-else-if="loader == false" class="flex-grow-1 mt-5">
                <h4 color="cancel" class="text-grey text-center">
                  {{ $t("no_log_found") }}
                </h4>
              </div>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <!-- admin data table start -->

        <v-col
          cols="12"
          v-if="
            (user.role && user.role.rolename == 'Admin') ||
            (user.role && user.role.rolename == 'SuperUser')
          "
        >
          <v-card class="rounded-lg elevation-4" min-height="300">
            <div class="d-flex justify-content-between align-items-center mr-3">
              <v-card-title class="text-h6 text-md-h6 text-lg-h6 py-5">{{
                $t("recent_tardiesafe_wizard_submissions")
              }}</v-card-title>

              <div>
                <v-tooltip :text="$t('view_all')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <router-link
                      :to="{ name: 'wizard_submission' }"
                      style="color: white"
                    >
                      <v-btn
                        size="small"
                        class="green_btn_color"
                        v-bind="props"
                      >
                        {{ $t("view_all") }}
                      </v-btn>
                    </router-link>
                  </template>
                </v-tooltip>
              </div>
            </div>
            <v-row>
              <v-col cols="12" md="6" class="p-4">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
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
                    ></v-text-field>
                  </template>
                  <span>{{ $t("search") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>

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
                      <span
                        v-if="
                          props.item.selectable.header_approved.submitted_date
                        "
                      >
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
                          props.item.selectable.header_approved.status ==
                            'Completed'
                        "
                        class
                        size="small"
                        color="yellow-darken-4"
                        text-color="white"
                      >
                        <v-icon
                          size="small"
                          start
                          icon="mdi-dots-horizontal"
                        ></v-icon>
                        {{ $t("pending") }}
                      </v-chip>

                      <v-chip
                        v-if="
                          props.item.selectable.header_approved &&
                          props.item.selectable.header_approved.status ==
                            'Approved'
                        "
                        size="small"
                        class
                        color="green"
                        text-color="white"
                      >
                        <v-icon size="small" start icon="mdi-check"></v-icon
                        >Approved
                      </v-chip>

                      <v-chip
                        v-if="
                          props.item.selectable.header_approved &&
                          props.item.selectable.header_approved.status ==
                            'Rejected'
                        "
                        class
                        color="red-accent-2"
                        text-color="white"
                        size="small"
                      >
                        <v-icon size="small" start icon="mdi-close"></v-icon
                        >Rejected
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
                      <v-tooltip
                        :text="this.$t('view_license')"
                        location="bottom"
                      >
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
          </v-card>
        </v-col>
        <!-- admin data table end -->

        <!-- principle data table start -->
        <v-col v-else-if="user.role && user.role.rolename == 'Principal'">
          <v-card class="rounded-lg elevation-4" min-height="300">
            <v-card-title class="text-h6 text-md-h6 text-lg-h6 py-5">{{
              $t("recently_added_tradies")
            }}</v-card-title>
            <v-row>
              <v-col cols="12" md="6" class="p-4">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
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
                    ></v-text-field>
                  </template>
                  <span>{{ $t("search") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="allUsers"
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
                    <span v-if="props.item.selectable.email">
                      {{ props.item.selectable.email }}
                    </span>
                    <span v-else>{{ $t("not_appllicable") }}</span>
                  </td>
                  <td>
                    <span v-if="props.item.selectable.phone">
                      {{ props.item.selectable.phone }}
                    </span>
                    <span v-else>{{ $t("not_appllicable") }}</span>
                  </td>
                  <td>
                    <!-- @click="changeStatus(props.item.selectable.id)" -->
                    <!-- <v-btn
                      class="hover_shine btn mr-2"
                      :disabled="isDisabled"
                      size="small"
                      @click="changeStatus(props.item.selectable.id)"
                      v-bind:color="[
                      props.item.selectable.status == 1 ? 'success' : 'warning',
                    ]"
                    >
                      <span
                        v-if="props.item.selectable.status == 1"
                        class="spanactivesize"
                      >{{ $t("active") }}</span>
                      <span
                        v-if="props.item.selectable.status == 0"
                        class="spanactivesize"
                      >{{ $t("inactive") }}</span>
                    </v-btn>-->

                    <v-chip
                      v-if="
                        props.item.selectable.header_approved &&
                        props.item.selectable.header_approved.status ==
                          'Approved'
                      "
                      size="small"
                      class
                      color="green"
                      text-color="white"
                    >
                      <v-icon size="small" start icon="mdi-check"></v-icon
                      >Approved
                    </v-chip>

                    <v-chip
                      v-else
                      class
                      color="red-accent-2"
                      text-color="white"
                      size="small"
                    >
                      <v-icon size="small" start icon="mdi-close"></v-icon>Not
                      Approved
                    </v-chip>
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
                      <v-tooltip
                        :text="this.$t('view_license')"
                        location="bottom"
                      >
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
          </v-card>
        </v-col>
        <!-- principle data table end -->
      </v-row>
    </v-container>
    <!-- tradie dashboard start -->
    <v-container v-if="user.role && user.role.rolename == 'Tradie'">
      <TradieDashboard :user="user"></TradieDashboard>
    </v-container>
    <!-- tradie dashboard end -->

    <!-- <ComingSoon></ComingSoon> -->

    <v-snackbar v-model="snackbar" timeout="3000">
      <div class="d-flex justify-space-between">
        <span>Logged in successfully</span>
        <v-icon>mdi-account-check</v-icon>
      </div>
    </v-snackbar>
  </div>
  <ConfirmDialog
    :show="showStatusDialog"
    :cancel="cancelStatus"
    :confirm="confirmStatus"
    v-bind:title="$t('confirm')"
    v-bind:description="$t('status_change')"
  />
</template>

<script>
import { mapGetters } from "vuex";
// import ComingSoon from "../../CustomComponents/ComingSoon.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
import TradieDashboard from "../../Cruds/Dashboard/TradieDashboard.vue";

export default {
  components: {
    // ComingSoon,
    ConfirmDialog,
    TradieDashboard,
  },
  computed: {
    ...mapGetters("auth", ["loggedin"]),
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    search: "",
    allUsers: [],
    status_id: false,
    showStatusDialog: false,
    submitted_questions: [],
    dashboarddata: [],
    loader: false,
    snackbar: false,
    user: [],
    role_id: "",
    menuitems: [],
    activitylog: [],
    overview_obj: [],
    google_icon: {
      icon_name: "dashboard",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    headers: [
      {
        title: "Name",
        align: "left",
        key: "full_name",
      },
      {
        title: "Email ID",
        key: "email",
      },
      {
        title: "Phone",
        key: "phone",
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
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));

    if (this.loggedin == true) {
      this.snackbar = true;
    }
    this.fetchActivity();
    this.fetchUsers();
    this.fetchHeaderAnswerDetails();
  },
  //   watch: {
  //   role_id: {
  //     immediate: true,
  //     handler() {
  //       if(this.role_id>0){
  //         this.fetchMenuTree();
  //       }
  //     },
  //   },
  // },

  methods: {
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.initval = true;
      this.showStatusDialog = false;
      this.statusUpdate();
    },
    statusUpdate() {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateuserstatus", {
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
            this.initval = true;
            this.fetchUsers();
          } else if (res.data.status == "E") {
            this.$toast.error(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchUsers();
          }
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
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
    fetchUsers() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_tradie_alluser")
        .then((res) => {
          this.allUsers = res.data.usersdata;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },
    fetchActivity() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchrecentactivitylog")
        .then((res) => {
          this.activitylog = res.data.activitylog;
          this.overview_obj = res.data.overview_obj;

          this.loader = false;
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
