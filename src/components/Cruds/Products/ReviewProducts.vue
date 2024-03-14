<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('products_services')"
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
              v-for="(product, index) in product_en"
              :key="index"
              :style="'border-color:' + getStatusColor(product.approval_status)"
            >
              <v-row class="px-6 mt-2">
                <v-col cols="12" sm="6" md="3">
                  <div class="d-label">{{ $t("title_en") }}</div>
                  <div>{{ product.title }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="d-label">{{ $t("meta_title_en") }}</div>
                  <div>{{ product.meta_title }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="d-label">{{ $t("approval_status_en") }}</div>
                  <div>
                    <v-chip
                      class="ma-2"
                      :color="getStatusColor(product.approval_status)"
                      variant="outlined"
                    >
                      {{ product.approval_status }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div
                    class="d-label"
                    v-if="product.approval_status == 'Rejected'"
                  >
                    {{ $t("rejected_by_en") }}
                  </div>
                  <div class="d-label" v-else>{{ $t("approved_by_en") }}</div>
                  <div v-if="product.review_by">
                    {{ product.review_by }}
                  </div>
                  <div v-else>{{ $t("not_applicable") }}</div>
                </v-col>
              </v-row>
              <v-row
                class="px-6 mt-1"
                v-if="product.approval_status == 'Rejected'"
              >
                <v-col cols="12" sm="12" md="12">
                  <div class="d-label">
                    {{ $t("reason_for_rejection_en") }}
                  </div>
                  <div v-if="product.review_comment">
                    {{ product.review_comment }}
                  </div>
                  <div v-else>{{ $t("not_applicable") }}</div>
                </v-col>
              </v-row>
              <v-row class="px-6 mt-1">
                <v-col cols="12" sm="12" md="9">
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div class="d-label">{{ $t("description_en") }}</div>
                      <div v-html="product.description"></div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <div class="d-label">{{ $t("meta_description_en") }}</div>
                      <div>{{ product.meta_description }}</div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="px-6 mt-1">
                <v-col cols="12" sm="12" md="12" class="image-preview">
                  <div class="d-label">{{ $t("image_preview_en") }}</div>
                  <div class="d-flex">
                    <div v-if="product.image_path.length == 0">
                      <img
                        v-bind:style="
                          isHovering == true ? 'filter: blur(1px);' : ''
                        "
                        src="@/assets/images/no_image.png"
                        width="100"
                      />
                    </div>
                    <div
                      class="mr-5 m-2"
                      v-for="(img_en, img_index) in product.image_path"
                      :key="img_index"
                    >
                      <div class="image-container">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          :src="envImagePath + img_en"
                          width="100"
                          height="65"
                          alt
                        />
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-layout v-if="service_slots.length > 0">
                <v-row class="headings">
                  <v-col xs="12" md="12" lg="12">
                    <h6 class="m-4">
                      <b>{{ $t("services_slots_en") }}</b>
                    </h6>
                  </v-col>
                </v-row>
              </v-layout>
              <div
                v-for="(service, sindex) in service_slots"
                :key="sindex"
                class="service-container"
              >
                <v-layout>
                  <v-row class="px-6 mt-2 ml-4">
                    <v-col cols="12" sm="12" md="2">
                      <div class="d-label">
                        <h4>{{ service.weekday }}</h4>
                      </div>
                    </v-col>
                  </v-row>
                </v-layout>
                <v-layout>
                  <v-row class="px-6 mt-2 ml-3">
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("from_time_en") }}</div>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("to_time_en") }}</div>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("slots_en") }}</div>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("total_claims_en") }}</div>
                    </v-col>
                  </v-row>
                </v-layout>
                <div v-for="(slot, cindex) in service.slot" :key="cindex">
                  <v-layout>
                    <v-row class="px-6 mt-2 ml-4 mb-3">
                      <v-col cols="12" sm="12" md="3">
                        <div>{{ slot.from_time }} {{ slot.from_meridiem }}</div>
                      </v-col>
                      <v-col cols="12" sm="12" md="3">
                        <div>{{ slot.to_time }} {{ slot.to_meridiem }}</div>
                      </v-col>
                      <v-col cols="12" sm="12" md="3">
                        <div>{{ slot.slots }}</div>
                      </v-col>
                      <v-col cols="12" sm="12" md="3">
                        <div>{{ slot.total_claims }}</div>
                      </v-col>
                    </v-row>
                  </v-layout>
                </div>
              </div>
              <div
                class="d-flex justify-content-end"
                v-if="
                  product.approval_status == 'In Review' &&
                  user_role != 'StoreAdmin'
                "
              >
                <v-chip
                  @click="statusOnChange('Approved', product.header_id)"
                  variant="flat"
                  color="green"
                  class="mx-1"
                >
                  {{ $t("approve_en") }}
                </v-chip>
                <v-chip
                  @click="statusOnChange('Rejected', product.header_id)"
                  variant="flat"
                  color="red"
                  class="mx-1"
                >
                  {{ $t("reject_en") }}
                </v-chip>
              </div>
            </v-card>
          </v-window-item>
          <!-- ENGLISH TAB END -->
          <!-- ARABIC TAB STARTS -->
          <v-window-item :value="2" class="p-3">
            <v-card
              variant="elevated"
              class="p-3 my-3 card-border rtl-direction"
              v-for="(product, index) in product_ar"
              :key="index"
              :style="'border-color:' + getStatusColor(product.approval_status)"
            >
              <v-row class="px-6 mt-2">
                <v-col cols="12" sm="6" md="3">
                  <div class="d-label">{{ $t("title_ar") }}</div>
                  <div>{{ product.title }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="d-label">{{ $t("meta_title_ar") }}</div>
                  <div>{{ product.meta_title }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="d-label">{{ $t("approval_status_ar") }}</div>
                  <div>
                    <v-chip
                      class="ma-2"
                      :color="getStatusColor(product.approval_status)"
                      variant="outlined"
                    >
                      {{ changeStatusAr(product.approval_status) }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div
                    class="d-label"
                    v-if="product.approval_status == 'Rejected'"
                  >
                    {{ $t("rejected_by_en") }}
                  </div>
                  <div class="d-label" v-else>{{ $t("approved_by_ar") }}</div>
                  <div v-if="product.review_by">
                    {{ product.review_by }}
                  </div>
                  <div v-else>{{ $t("not_applicable") }}</div>
                </v-col>
              </v-row>
              <v-row
                class="px-6 mt-1"
                v-if="product.approval_status == 'Rejected'"
              >
                <v-col cols="12" sm="12" md="12">
                  <div class="d-label">
                    {{ $t("reason_for_rejection_ar") }}
                  </div>
                  <div v-if="product.review_comment">
                    {{ product.review_comment }}
                  </div>
                  <div v-else>{{ $t("not_applicable") }}</div>
                </v-col>
              </v-row>
              <v-row class="px-6 mt-1">
                <v-col cols="12" sm="12" md="9">
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <div class="d-label">{{ $t("description_ar") }}</div>
                      <div v-html="product.description"></div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <div class="d-label">{{ $t("meta_description_ar") }}</div>
                      <div>{{ product.meta_description }}</div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row class="px-6 mt-1">
                <v-col cols="12" sm="12" md="12" class="image-preview">
                  <div class="d-label">{{ $t("image_preview_ar") }}</div>
                  <div class="d-flex">
                    <div v-if="product.image_path.length == 0">
                      <img
                        v-bind:style="
                          isHovering == true ? 'filter: blur(1px);' : ''
                        "
                        src="@/assets/images/no_image.png"
                        width="100"
                      />
                    </div>
                    <div
                      class="mr-5 m-2"
                      v-for="(img_en, img_index) in product.image_path"
                      :key="img_index"
                    >
                      <div class="image-container">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          :src="envImagePath + img_en"
                          width="100"
                          height="65"
                          alt
                        />
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
              <v-layout v-if="service_slots.length > 0">
                <v-row class="headings">
                  <v-col xs="12" md="12" lg="12">
                    <h6 class="m-4">
                      <b>{{ $t("services_slots_ar") }}</b>
                    </h6>
                  </v-col>
                </v-row>
              </v-layout>
              <div
                v-for="(service, sindex) in service_slots"
                :key="sindex"
                class="service-container"
              >
                <v-layout>
                  <v-row class="px-6 mt-2 ml-4">
                    <v-col cols="12" sm="12" md="2">
                      <div class="d-label">
                        <h4>{{ changeArWeekday(service.weekday) }}</h4>
                      </div>
                    </v-col>
                  </v-row>
                </v-layout>
                <v-layout>
                  <v-row class="px-6 mt-2 ml-4">
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("from_time_ar") }}</div>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("to_time_ar") }}</div>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("slots_ar") }}</div>
                    </v-col>
                    <v-col cols="12" sm="12" md="3">
                      <div class="d-label">{{ $t("total_claims_ar") }}</div>
                    </v-col>
                  </v-row>
                </v-layout>
                <div v-for="(slot, cindex) in service.slot" :key="cindex">
                  <v-layout>
                    <v-row class="px-6 mt-2 ml-4 mb-3">
                      <v-col cols="12" sm="12" md="3">
                        <div>
                          {{ slot.from_time }}
                          {{ changeArMeridian(slot.from_meridiem) }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="3">
                        <div>
                          {{ slot.to_time }}
                          {{ changeArMeridian(slot.to_meridiem) }}
                        </div>
                      </v-col>
                      <v-col cols="12" sm="12" md="3">
                        <div>{{ slot.slots }}</div>
                      </v-col>
                      <v-col cols="12" sm="12" md="3">
                        <div>{{ slot.total_claims }}</div>
                      </v-col>
                    </v-row>
                  </v-layout>
                </div>
              </div>

              <div
                class="d-flex justify-content-end"
                v-if="
                  product.approval_status == 'In Review' &&
                  user_role != 'StoreAdmin'
                "
              >
                <v-chip
                  @click="statusOnChange('Approved', product.header_id)"
                  variant="flat"
                  color="green"
                  class="mx-1"
                >
                  {{ $t("approve_ar") }}
                </v-chip>
                <v-chip
                  @click="statusOnChange('Rejected', product.header_id)"
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
      icon_name: "view_module",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: true,
    successmessage: "",
    message: "",
    valid_error: false,
    file: "",
    sel_lang: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    user_role: "",
    tabs: 1,
    product_en: [],
    product_ar: [],
    showApprovalDialog: false,
    selected: {
      header_id: null,
      approval_status: "",
    },
    approval_msg: "",
    enable_review_comment: false,
    service_slots: [],
  }),

  watch: {
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab == 1) {
          this.tabs = 1;
        } else {
          this.tabs = 2;
        }
      },
    },
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchProductDetails();
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
    changeArWeekday(day) {
      switch (day) {
        case "Monday":
          return this.$t("monday_ar");
        case "Tuesday":
          return this.$t("tuesday_ar");
        case "Wednesday":
          return this.$t("wednesday_ar");
        case "Thursday":
          return this.$t("thursday_ar");
        case "Friday":
          return this.$t("friday_ar");
        case "Saturday":
          return this.$t("saturday_ar");
        case "Sunday":
          return this.$t("sunday_ar");
        default:
          return "";
      }
    },
    changeArMeridian(data) {
      switch (data) {
        case "AM":
          return this.$t("am_ar");
        case "PM":
          return this.$t("pm_ar");
        default:
          return "";
      }
    },
    fetchProductDetails() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-product-details", {
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
            this.product_en = res.data.product_en;
            this.product_ar = res.data.product_ar;
            this.service_slots = res.data.service_slots;
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
        .post(process.env.VUE_APP_API_URL_ADMIN + "update-product-approval", {
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
            this.fetchProductDetails();
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
        name: "products",
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
.service-container {
  margin: 10px 20px;
  background: #e7e7e78c;
  border-radius: 6px;
}
/* .image-preview {
} */
</style>
