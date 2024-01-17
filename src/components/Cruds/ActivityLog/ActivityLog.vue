<template>
  <div class="h-100">
    <page-title
      v-if="$route.name == 'activity_log'"
      class="col-md-3"
      :heading="$t('activity_log')"
      :google_icon="google_icon"
    ></page-title>
    <!-- <div v-if="$route.name=='activity_log'">
      <p class="px-5 text-body-2">
        Lorem ipsum is a placeholder text commonly used to demonstrate the
        visual form of a document or a typeface without relying on meaningful
        content. Lorem ipsum may be used as a placeholder before final copy is
        available.
      </p>
    </div> -->
    <div style="" class="px-0 my-5">
      <content-loader v-if="loader"></content-loader>
      <div v-if="activitylog && activitylog.length > 0">
        <v-timeline density="compact" side="end" class="my-5 px-5">
          <v-timeline-item
            line-inset="5"
            v-for="(activity, i) in displayedItems"
            :key="i"
            class="activity_item"
            :dot-color="
              activity.log_type == 'Registration'
                ? '#607D8B'
                : activity.log_type == 'Invitation'
                ? '#42A5F5'
                : activity.log_type == 'Approved'
                ? '#A5D6A7'
                : activity.log_type == 'Submitted'
                ? '#00ACC1'
                : activity.log_type == 'Rejected'
                ? '#FFCCBC'
                : ''
            "
            size="large"
          >
            <template v-slot:icon>
              <v-icon
                class="p-5 m-2 icon_size"
                v-bind:class="[
                  activity.log_type == 'Approved'
                    ? 'text-green-darken-4'
                    : activity.log_type == 'Rejected'
                    ? 'text-red-darken-4'
                    : 'text-grey-lighten-5',
                ]"
              >
                {{
                  activity.log_type == "Registration"
                    ? "mdi mdi-account-check"
                    : activity.log_type == "Invitation"
                    ? "mdi mdi-human-greeting-proximity"
                    : activity.log_type == "Approved"
                    ? "mdi mdi-check-bold"
                    : activity.log_type == "Rejected"
                    ? "mdi mdi-close-thick"
                    : activity.log_type == "Submitted"
                    ? "mdi mdi-playlist-check"
                    : ""
                }}
              </v-icon>
            </template>
            <h6 class="text-start font-weight-medium">
              {{ activity.title }}
            </h6>
            <div
              class="d-flex justify-content-between flex-grow-1"
              color="#E0E0E0"
            >
              <!-- <v-chip class="ms-0" color="purple" label size="small">APP</v-chip> -->
              <small class="text-grey-darken-1 font-weight-medium">{{
                activity.description
              }}</small>

              <small
                class="text-grey-darken-1 font-weight-medium ml-5 font-italic"
                >{{ formatDateTime(activity.created_at) }}</small
              >
            </div>

            <!-- <div
                class="position-absolute border_item bg-grey-lighten-2 p-0 my-2"
              ></div> -->
            <v-divider class="mb-0"></v-divider>
          </v-timeline-item>
        </v-timeline>
        <div class="d-flex justify-content-center">
          <v-btn
            @click="loadMore"
            class="green_btn_color"
            v-if="showLoadMoreButton"
          >
            {{ $t("load_more") }}
          </v-btn>
          <div v-else>
            <h6 class="text-start font-weight-medium first_h6_section">
              {{ $t("no_more_data") }}
            </h6>
          </div>
        </div>
      </div>

      <div v-else-if="loader == false">
        <h4 color="cancel" class="text-grey text-center">
          {{ $t("no_log_found") }}
        </h4>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["user_id"],
  data: () => ({
    events: [],
    input: null,
    nonce: 0,
    activitylog: [],
    displayedItems: [],
    loader: false,
    currentIndex: 0,
    itemsPerPage: 5,
    google_icon: {
      icon_name: "timeline",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    logged_in_userid: 0,
    userdetails: [],
  }),
  mounted() {
    this.userdetails = JSON.parse(localStorage.getItem("user_data"));
    if (this.user_id && this.user_id > 0) {
      this.logged_in_userid = this.user_id;
    } else {
      this.logged_in_userid = this.userdetails.id;
    }
    this.fetchActivity();
  },
  computed: {
    timeline() {
      return this.events.slice().reverse();
    },
    nextItems() {
      return this.activitylog.slice(
        this.currentIndex,
        this.currentIndex + this.itemsPerPage
      );
    },
    showLoadMoreButton() {
      return this.currentIndex < this.activitylog.length;
    },
  },
  methods: {
    comment() {
      const time = new Date().toTimeString();
      this.events.push({
        id: this.nonce++,
        text: this.input,
        time: time.replace(/:\d{2}\sGMT-\d{4}\s\((.*)\)/, (match, contents) => {
          return ` ${contents
            .split(" ")
            .map((v) => v.charAt(0))
            .join("")}`;
        }),
      });

      this.input = null;
    },
    loadMore() {
      this.loader = true;
      this.displayedItems.push(...this.nextItems);
      this.currentIndex += this.itemsPerPage;
      if (!this.showLoadMoreButton) {
        console.log("All data loaded.");
      }
      this.loader = false;
    },
    fetchActivity() {
      this.loader = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "fetchactivitylog/" +
            this.logged_in_userid
        )
        .then((res) => {
          this.activitylog = res.data.activitylog;
          this.loadMore();
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

<style scoped>
.activity_item /deep/ .v-timeline-item__body {
  width: 100% !important;
}
.v-timeline--vertical {
  grid-row-gap: 10px !important;
  /* background-color: black; */
}

.border_item {
  /* left: 0px; */
  height: 1px;
  /* background: black; */
  width: 89vw;
}
</style>