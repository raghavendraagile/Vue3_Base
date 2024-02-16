<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('events')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>

        <v-tabs v-model="tabs" color="blue">
          <v-tab :value="1">
            <span>{{ $t("english") }}</span>
          </v-tab>

          <v-tab :value="2">
            <span>{{ $t("arabic") }}</span>
          </v-tab>
        </v-tabs>
        <v-window v-model="tabs">
          <!-- ENGLISH TAB STARTS -->
          <v-window-item :value="1" class="p-3">
            <v-card
              variant="elevated"
              class="p-3 my-3 card-border"
              v-for="(event, index) in events_en"
              :key="index"
              :style="'border-color:' + getStatusColor(event.approval_status)"
            >
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" sm="6" md="4">
                    <div class="d-label">{{ $t("title_en") }}</div>
                    <div>{{ event.title }}</div>
                  </v-col>
                  <!-- <v-col cols="12" sm="6" md="4">
                    <div class="d-label">{{ $t("parent_event_en") }}</div>
                    <div v-if="event.parent_event">
                      {{ event.parent_event }}
                    </div>
                    <div v-else>{{ $t("not_applicable") }}</div>
                  </v-col> -->

                  <v-col cols="12" sm="6" md="4">
                    <div
                      class="d-label"
                      v-if="event.approval_status == 'Rejected'"
                    >
                      {{ $t("rejected_by_en") }}
                    </div>
                    <div class="d-label" v-else>{{ $t("approved_by_en") }}</div>
                    <div v-if="event.review_by">
                      {{ event.review_by }}
                    </div>
                    <div v-else>{{ $t("not_applicable") }}</div>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <div class="d-label">{{ $t("approval_status_en") }}</div>
                    <div>
                      <v-chip
                        class="ma-2"
                        :color="getStatusColor(event.approval_status)"
                        variant="outlined"
                      >
                        {{ event.approval_status }}
                      </v-chip>
                    </div>
                  </v-col>

                  
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if="event.approval_status == 'Rejected'"
                  >
                    <div class="d-label">
                      {{ $t("reason_for_rejection_en") }}
                    </div>
                    <div v-if="event.review_comment">
                      {{ event.review_comment }}
                    </div>
                    <div v-else>{{ $t("not_applicable") }}</div>
                  </v-col>
                </v-row>
              </v-layout>
                <v-col
                    cols="12"
                    sm="12"
                    md="4"
                   
                  >

              <div
              
                class="d-flex justify-content-end"
                v-if="event.approval_status == 'In Review'"
              >
                <v-chip
                  @click="statusOnChange('Approved', event.header_id)"
                  variant="flat"
                  color="green"
                  class="mx-1"
                >
                  {{ $t("approve_en") }}
                </v-chip>
                <v-chip
                  @click="statusOnChange('Rejected', event.header_id)"
                  variant="flat"
                  color="red"
                  class="mx-1"
                >
                  {{ $t("reject_en") }}
                </v-chip>
              </div>
                </v-col>
            </v-card>
          </v-window-item>
          <!-- ENGLISH TAB END -->
          <!-- ARABIC TAB STARTS -->
          <v-window-item :value="2" class="p-3">
            <v-card
              variant="elevated"
              class="p-3 my-3 card-border rtl-direction"
              v-for="(event, index) in events_ar"
              :key="index"
              :style="'border-color:' + getStatusColor(event.approval_status)"
            >
              <v-layout>
                <v-row class="px-6 mt-2">
                   <v-col cols="12" sm="6" md="3">
                    <div class="d-label">{{ $t("title_ar") }}</div>
                    <div>{{ event.title }}</div>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <div class="d-label">{{ $t("meta_title_ar") }}</div>
                    <div>{{ event.meta_title }}</div>
                  </v-col>
                  <v-col cols="12" sm="12" md="3">
                    <div class="d-label">{{ $t("description_ar") }}</div>
                    <div v-html="event.description"></div>
                  </v-col>
                  <v-col cols="12" sm="12" md="3">
                    <div class="d-label">{{ $t("meta_description_ar") }}</div>
                    <div>{{ event.meta_description }}</div>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <div class="d-label">{{ $t("approval_status_ar") }}</div>
                    <div>
                      <v-chip
                        class="ma-2"
                        :color="getStatusColor(event.approval_status)"
                        variant="outlined"
                      >
                        {{ changeStatusAr(event.approval_status) }}
                      </v-chip>
                    </div>
                  </v-col>

                 

                  <v-col cols="12" sm="6" md="3">
                    <div
                      class="d-label"
                      v-if="event.approval_status == 'Rejected'"
                    >
                      {{ $t("rejected_by_ar") }}
                    </div>
                    <div class="d-label" v-else>{{ $t("approved_by_ar") }}</div>
                    <div v-if="event.review_by">
                      {{ event.review_by }}
                    </div>
                    <div v-else>{{ $t("not_applicable") }}</div>
                  </v-col>
                  
                  <v-col
                    cols="12"
                    sm="12"
                    md="12"
                    v-if="event.approval_status == 'Rejected'"
                  >
                    <div class="d-label">
                      {{ $t("reason_for_rejection_ar") }}
                    </div>
                    <div v-if="event.review_comment">
                      {{ event.review_comment }}
                    </div>
                    <div v-else>{{ $t("not_applicable") }}</div>
                  </v-col>
                </v-row>
                <v-row class="px-6 mt-2">
                </v-row>
              </v-layout>
              <div
                class="d-flex justify-content-end"
                v-if="event.approval_status == 'In Review' && user_role != 'StoreAdmin'"
              >
                <v-chip
                  @click="statusOnChange('Approved', event.header_id)"
                  variant="flat"
                  color="green"
                  class="mx-1"
                >
                  {{ $t("approve_ar") }}
                </v-chip>
                <v-chip
                  @click="statusOnChange('Rejected', event.header_id)"
                  variant="flat"
                  color="red"
                  class="mx-1"
                >
                  {{ $t("reject_ar") }}
                </v-chip>
              </div>
            </v-card>
          </v-window-item>
          <!-- ARABIC TAB END -->
        </v-window>
      </div>

      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-btn
          size="small"
          @click="cancel()"
          :disabled="loading"
          class="ma-1"
          color="cancel"
          >{{ $t("cancel") }}</v-btn
        >
      </div>
    </div>
    <ConfirmDialog
      :show="showApprovalDialog"
      :cancel="cancelApproval"
      :confirm="confirmApproval"
      v-bind:title="$t('confirm')"
      v-bind:description="approval_msg"
    />
    <ReviewComments
      v-if="enable_review_comment"
      @close-dialog="closeReviewComment()"
      @submit-data="submitReview"
    >
    </ReviewComments>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
import ReviewComments from "../../CustomComponents/ReviewComments.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
    ReviewComments,
  },
  data: () => ({
    google_icon: {
      icon_name: "event",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: true,
    successmessage: "",
    message: "",
    valid_error: false,
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    tabs: 1,
    events_en: [],
    events_ar: [],
    user_role:"",
    showApprovalDialog: false,
    selected: {
      header_id: null,
      approval_status: "",
    },
    approval_msg: "",
    enable_review_comment: false,
  }),

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetcheventDetails();
          this.user_role = JSON.parse(
            localStorage.getItem("user_data")
          ).rolename;
        }
      },
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

  mounted() {},

  methods: {
    changeStatusAr(status) {
      switch (status) {
        case "Approved":
          return this.$t("approved_ar");
        case "In Review":
          return this.$t("inreview_ar");
        case "Rejected":
          return this.$t("rejected_ar");
        default:
          return "";
      }
    },
    fetcheventDetails() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-events-details", {
          params: {
            slug: this.$route.query.slug,
          },
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.events_en = res.data.events_en;
            this.events_ar = res.data.events_ar;
            this.loader = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.loader = false;
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        })
        .finally(() => {
          this.loader = false;
        });
    },
    statusOnChange(value, id) {
      this.selected.approval_status = value;
      this.selected.header_id = id;
      if (value === "Approved") {
        this.approval_msg = this.$t("approval_confirm");
      } else {
        this.approval_msg = this.$t("rejection_confirm");
      }
      this.showApprovalDialog = true;
    },
    cancelApproval() {
      this.showApprovalDialog = false;
    },
    confirmApproval() {
      if (this.selected.approval_status == "Approved") {
        this.updateApprovalStatus();
      } else {
        this.enable_review_comment = true;
        this.showApprovalDialog = false;
      }
    },
    updateApprovalStatus(comment_en = "", comment_ar = "") {
      this.loader = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update-events-approval", {
          id: this.selected.header_id,
          status: this.selected.approval_status,
          comment_en: comment_en,
          comment_ar: comment_ar,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.fetcheventDetails();
            this.$toast.success(this.array_data);
          } else {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        })
        .finally(() => {
          this.showApprovalDialog = false;
          this.closeReviewComment();
          this.loader = false;
        });
    },
    getStatusColor(status) {
      switch (status) {
        case "Approved":
          return "green";
        case "In Review":
          return "orange";
        case "Rejected":
          return "red";
        default:
          return "";
      }
    },
    cancel() {
      this.$router.push({
        name: "events",
      });
    },
    closeReviewComment() {
      this.enable_review_comment = false;
    },
    submitReview(comment_en, comment_ar) {
      this.updateApprovalStatus(comment_en, comment_ar);
    },
  },
};
</script>

<style scoped>
.d-label {
  font-weight: bold;
}
.card-border {
  border-style: solid;
  border-width: 1px;
}
</style>
