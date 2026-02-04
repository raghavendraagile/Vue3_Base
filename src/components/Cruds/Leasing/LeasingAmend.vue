<template>
  <content-loader v-if="loader"></content-loader>
  <div class="main-20">
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
    >
      <page-title
        class="col-md-3"
        :heading="$t('leasing_details')"
        :google_icon="google_icon"
      ></page-title>
      <div class="add_new_button">
        <span class="mr-2">
          <v-tooltip :text="this.$t('back')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                size="small"
                class="mb-2"
                color="cancel"
                style="color: white"
                v-bind="props"
                @click="$router.go(-1)"
                >{{ $t("back") }}</v-btn
              >
            </template>
          </v-tooltip>
        </span>
      </div>
    </div>

    <div class="card-body">
      <div class="pa-5">
        <v-card
          variant="elevated"
          class="p-3 my-3 card-border"
          :style="'border-color:green'"
        >
          <v-layout>
            <v-row class="px-6 mt-2">
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("enquiry") }}</div>
                <div>{{ leasing_details.enquiry }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("store_type") }}</div>
                <div>{{ leasing_details.store_type }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("company_name") }}</div>
                <div>{{ leasing_details.company_name }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("contact_person") }}</div>
                <div>{{ leasing_details.contact_person }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("email") }}</div>
                <div>{{ leasing_details.email }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("email") }}</div>
                <div>{{ leasing_details.email }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("mobile") }}</div>
                <div>{{ leasing_details.mobile }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("brand_name") }}</div>
                <div>{{ leasing_details.brand_name }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("country") }}</div>
                <div v-if="leasing_details.country && leasing_details.country.name">{{ leasing_details.country.name }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("website") }}</div>
                <div>{{ leasing_details.website }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("num_of_stores") }}</div>
                <div>{{ leasing_details.num_of_stores }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("brand_name") }}</div>
                <div>{{ leasing_details.brand_name }}</div>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("status") }}</div>
                <div>
                  <v-chip class="ma-2" color="green" variant="outlined">
                    {{ changeStatusAr(leasing_details.status) }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <div class="d-label">{{ $t("created_at") }}</div>
                <div>{{ formatDateTime(leasing_details.created_at) }}</div>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <div class="d-label">{{ $t("notes") }}</div>
                <div>{{ leasing_details.notes }}</div>
              </v-col>
            </v-row>
          </v-layout>
        </v-card>
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
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    loader: false,
    leasing_details: [],
    role_details: [],
    isDisabled: false,
    show_update: false,
    google_icon: {
      icon_name: "box_edit",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),
  mounted() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "view-leasing-data-byslug/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.loader = false;
              if (res.data.status == "S") {
                this.leasing_details = res.data.leasing;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("this error" + err);
            });
        }
      },
    },
  },
  methods: {
    changeStatusAr(status) {
      switch (status) {
        case 1:
          return this.$t("Active");
        case 0:
          return this.$t("Inactive");
        default:
          return null;
      }
    },
  },
};
</script>
<style scoped>
.v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
}
.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.v-btn:not(.v-btn--round).v-size--small {
  min-width: 90px !important;
}
.field_value {
  font-weight: 600;
}
.img_border {
  border: 1px solid black;
  padding: 2px;
}
.d-label {
  font-weight: bold;
}
.card-border {
  border-style: solid;
  border-width: 1px;
}
</style>