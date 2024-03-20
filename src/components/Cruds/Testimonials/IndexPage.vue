<template>
  <div class="main-20 position-relative">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-6"
        :heading="$t('reviews_testimonials')"
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
              v-bind:label="$t('search')"
              class="srch_bar"
              small
              hide-details
              v-bind="props"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-tabs v-model="tabs" color="blue">
      <v-tab :value="1">
        <span>{{ $t("testimonials") }}</span>
      </v-tab>

      <v-tab :value="2">
        <span>{{ $t("reviews") }}</span>
      </v-tab>
    </v-tabs>

    <v-window v-model="tabs">
      <!-- Testimonials Tab Start -->
      <v-window-item :value="1">
        <v-data-table
          :headers="headers"
          :items="testimonials"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available')"
          :items-per-page-text="$t('rows_per_page')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td
                v-if="
                  props.item.selectable.customer &&
                  props.item.selectable.customer.firstname
                "
              >
                {{ props.item.selectable.customer.firstname }}
                {{ props.item.selectable.customer.lastname }}
              </td>
              <td v-else>
                {{ $t("not_appllicable") }}
              </td>
              <td>{{ props.item.selectable.testimonial_details }}</td>

              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="
                    updateStatus(
                      props.item.selectable.id,
                      props.item.selectable.status
                    )
                  "
                  size="small"
                  v-bind:color="[
                    props.item.selectable.status == 1 ? 'success' : 'error',
                  ]"
                >
                  <span
                    v-if="props.item.selectable.status == 1"
                    class="spanactivesize"
                    >{{ $t("accept") }}</span
                  >
                  <span
                    v-if="props.item.selectable.status == 0"
                    class="spanactivesize"
                    >{{ $t("reject") }}</span
                  >
                </v-btn>
              </td>
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="updateIsPublishStatus(props.item.selectable.id)"
                  size="small"
                  v-bind:color="[
                    props.item.selectable.is_published == 1
                      ? 'success'
                      : 'warning',
                  ]"
                >
                  <span
                    v-if="props.item.selectable.is_published == 1"
                    class="spanactivesize"
                    >{{ $t("yes") }}</span
                  >
                  <span
                    v-if="props.item.selectable.is_published == 0"
                    class="spanactivesize"
                    >{{ $t("no") }}</span
                  >
                </v-btn>
              </td>
              <!-- <td class="text-center">
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
              </td> -->
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
      <!-- Testimonials Tab End -->
      <!-- Reviews Tab Start -->
      <v-window-item :value="2">
        <v-data-table
          :headers="reviews_headers"
          :items="reviews"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available')"
          :items-per-page-text="$t('rows_per_page')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                {{ props.item.selectable.name }}
              </td>
              <td>{{ props.item.selectable.email }}</td>
              <td>{{ props.item.selectable.shop_name }}</td>
              <td>{{ props.item.selectable.staff_name }}</td>
              <td>
                {{ props.item.selectable.phone }}
                {{ props.item.selectable.mobile_code }}
              </td>
              <td>
                <v-btn
                  class="hover_shine btn mr-2"
                  :disabled="isDisabled"
                  @click="updateReviewsStatus(props.item.selectable.id)"
                  size="small"
                  v-bind:color="[
                    props.item.selectable.status == 1 ? 'success' : 'warning',
                  ]"
                >
                  <span
                    v-if="props.item.selectable.status == 1"
                    class="spanactivesize"
                    >{{ $t("active") }}</span
                  >
                  <span
                    v-if="props.item.selectable.status == 0"
                    class="spanactivesize"
                    >{{ $t("inactive") }}</span
                  >
                </v-btn>
              </td>
              <td>
                <router-link
                  small
                  :to="{
                    name: 'view-reviews',
                    query: { slug: props.item.selectable.slug },
                  }"
                >
                  <v-btn
                    size="small"
                    :disabled="loading"
                    class="ma-1"
                    color="blue"
                    >{{ $t("view") }}</v-btn
                  >
                </router-link>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
      <!-- Reviews Tab End -->
    </v-window>
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
    />
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="accept_reject_msg"
    />
    <ConfirmDialog
      :show="showIsPublishStatusDialog"
      :cancel="cancelIsPublishStatus"
      :confirm="confirmIsPublishStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
    <ConfirmDialog
      :show="showIReviewsStatusDialog"
      :cancel="cancelReviewsStatus"
      :confirm="confirmReviewsStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
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
    accept_reject_msg: "",
    showConfirmDialog: false,
    delete_id: null,
    dialog: false,
    testimonials: [],
    reviews: [],
    initval: true,
    google_icon: {
      icon_name: "speaker_notes",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    status_id: null,
    is_publish_id: null,
    review_id: null,
    showStatusDialog: false,
    showIsPublishStatusDialog: false,
    showIReviewsStatusDialog: false,
    tabs: 1,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: this.$t("customer"),
          key: "customer",
        },
        {
          title: this.$t("comments"),
          key: "testimonial_details",
        },
        {
          title: this.$t("accept/reject"),
          key: "status",
        },
        {
          title: this.$t("is_published"),
          key: "is_published",
        },
      ];
    },
    reviews_headers() {
      return [
        {
          title: this.$t("name"),
          key: "name",
        },
        {
          title: this.$t("email"),
          key: "email",
        },
        {
          title: this.$t("shop_name"),
          key: "shop_name",
        },
        {
          title: this.$t("staff_name"),
          key: "staff_name",
        },
        {
          title: this.$t("phone"),
          key: "phone",
        },
        {
          title: this.$t("status"),
          key: "status",
        },
        {
          title: "",
          align: "center",
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
    this.fetchReviewsTestimonials();
  },

  methods: {
    fetchReviewsTestimonials() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-reviews-testimonials")
        .then((res) => {
          this.testimonials = res.data.testimonials;
          this.reviews = res.data.reviews;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
    },

    deleteItem(testimonial_id) {
      this.delete_id = testimonial_id;
      this.showConfirmDialog = true;
    },

    cancel() {
      this.showConfirmDialog = false;
    },

    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },

    deleteConfirm(testimonial_id) {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "delete-testimonial-and-reviews/" +
            testimonial_id
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
            this.fetchReviewsTestimonials();
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

    updateStatus(id, status) {
      if (status == 1) {
        this.accept_reject_msg = this.$t("reject_change");
      } else {
        this.accept_reject_msg = this.$t("accept_change");
      }
      this.status_id = id;
      this.showStatusDialog = true;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    statusUpdate() {
      this.loader = true;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN +
            "update-testimonial-and-reviews-status",
          {
            id: this.status_id,
          }
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchReviewsTestimonials();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchReviewsTestimonials();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
      this.loader = false;
    },
    //------is upload status change-----------
    updateIsPublishStatus(id) {
      this.is_publish_id = id;
      this.showIsPublishStatusDialog = true;
    },
    confirmIsPublishStatus() {
      this.statusIsPublishUpdate();
      this.showIsPublishStatusDialog = false;
    },
    cancelIsPublishStatus() {
      this.showIsPublishStatusDialog = false;
    },
    statusIsPublishUpdate() {
      this.loader = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update-is-publish-status", {
          id: this.is_publish_id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchReviewsTestimonials();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchReviewsTestimonials();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
      this.loader = false;
    },
    //-------------update Reviews Status----------------
    updateReviewsStatus(id) {
      this.review_id = id;
      this.showIReviewsStatusDialog = true;
    },
    confirmReviewsStatus() {
      this.statusReviewsUpdate();
      this.showIReviewsStatusDialog = false;
    },
    cancelReviewsStatus() {
      this.showIReviewsStatusDialog = false;
    },
    statusReviewsUpdate() {
      this.loader = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update-reviews-status", {
          id: this.review_id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchReviewsTestimonials();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchReviewsTestimonials();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
      this.loader = false;
    },
  },
};
</script>
<style scoped>
.list_item {
  cursor: pointer;
}
</style>
