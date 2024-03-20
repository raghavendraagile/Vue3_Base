<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('review_details')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-card
          variant="elevated"
          class="p-3 m-4 card-border"
          style="border-color: green"
        >
          <v-layout>
            <v-row class="px-6 mt-2">
              <v-col cols="12" sm="6" md="4">
                <div class="d-label">{{ $t("name") }}</div>
                <div>{{ review_details.name }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="d-label">{{ $t("email") }}</div>
                <div>{{ review_details.email }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="d-label">
                  {{ $t("gender") }}
                </div>
                <div>
                  <div>{{ review_details.gender }}</div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="d-label">{{ $t("phone") }}</div>
                <div>
                  {{ review_details.mobile_code }} {{ review_details.phone }}
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="d-label">{{ $t("shop_name") }}</div>
                <div>{{ review_details.shop_name }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <div class="d-label">{{ $t("staff_name") }}</div>
                <div>{{ review_details.staff_name }}</div>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <div class="d-label">{{ $t("address") }}</div>
                <div v-html="review_details.address"></div>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <div class="d-label">{{ $t("comments") }}</div>
                <div>{{ review_details.comments }}</div>
              </v-col>
            </v-row>
          </v-layout>
        </v-card>
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
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
  data: () => ({
    google_icon: {
      icon_name: "heap_snapshot_large",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
    loading: false,
    loader: false,
    review_details: [],
  }),

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchreview_detailssDetails();
        }
      },
    },
  },

  methods: {
    fetchreview_detailssDetails() {
      this.loader = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch-review-details-details",
          {
            params: {
              slug: this.$route.query.slug,
            },
          }
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.review_details = res.data.review_details;
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
    cancel() {
      this.$router.push({
        name: "reviews-testimonials",
      });
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
