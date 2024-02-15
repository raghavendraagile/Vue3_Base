<template>
  <div>
    <page-title :heading="$t('dashboard')" :google_icon="google_icon"></page-title>
    <content-loader v-if="loader"></content-loader>
    <div class="container-fluid">
      <div class="dash-parent" v-bind:class="[is_arabic ? 'arabic_row' : '']">
        <v-row> <v-col md="3" class="direction_col" v-for="(dashboard, i) in dashboard_count" :key="i">
            <v-card density="comfortable" elevation="6" class="routecard" :class="dashboard.color"
              @click="route_to_page(dashboard.name)">
              <v-row>
                <v-col md="12">
                  <div class="d-flex2">
                    <v-card-title class="d-flex2">
                      {{ changeNameTranslation(dashboard.name) }}
                    <v-btn class="ma-2" :color="dashboard.color" size="small" :icon="dashboard.icon"></v-btn>   
                    </v-card-title>
                  </div>
                  <div class="pb-5 pt-4 d-flex1">
                    <v-row class="px-5">
                      <div v-for="(status, k) in dashboard.status" :key="k">
                        <v-chip class="mr-1" :color="status.color" size="small">
                       <b class="mx-1">{{ status.count }}</b> {{ changeStatusTranslation(status.status_name) }}
                      </v-chip>
                      </div>
                    </v-row>
                 
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  components: {
  },
  computed: {
    ...mapGetters("auth", ["loggedin"]),
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    search: "",
    is_arabic: false,
    user: [],
    dashboard_count: [],
    loader: false,
    role_id: "",
    menuitems: [],
    google_icon: {
      icon_name: "dashboard",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

  }),
  watch: {
    '$i18n.locale'(newLocale) {
      if (newLocale === 'ar') {
        this.is_arabic = true;
      } else {
        this.is_arabic = false;
      }
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchDashboard(this.user.id,this.user.rolename);
  },

  methods: {
    changeNameTranslation(Name) {
      switch (Name) {
        case "Users":
          return this.$t("user1");
        case "Events":
          return this.$t("events");
        case "Promotions":
          return this.$t("promotions");
        case "Products":
          return this.$t("products");
        case "Categories":
          return this.$t("category");
        case "Careers":
          return this.$t("careers");
        case "Stores":
          return this.$t("stores");
        case "Testimonials":
          return this.$t("testimonials");
        default:
          return "";
      }
    },
    changeStatusTranslation(status) {
      switch (status) {
        case "In Review":
          return this.$t("in_review");
        case "Approved":
          return this.$t("approved");
        case "Rejected":
          return this.$t("rejected");
        case "Active":
          return this.$t("active");
        case "Inactive":
          return this.$t("inactive");
        default:
          return "";
      }
    },
    fetchDashboard(userId,Role) {
      this.loader = true;
      if(Role == 'SuperUser'){
        this.$axios.get(process.env.VUE_APP_API_URL_ADMIN + "fetchDashboardSuperUser/" + userId)
        .then((res) => {
          this.dashboard_count = res.data.count_dashboard;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
      }
      else if(Role == 'MallAdmin'){
        this.$axios.get(process.env.VUE_APP_API_URL_ADMIN + "fetchDashboardMallAdmin/" + userId)
        .then((res) => {
          this.dashboard_count = res.data.count_dashboard;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
      }
      else{
        this.$axios.get(process.env.VUE_APP_API_URL_ADMIN + "fetchDashboardStoreAdmin/" + userId)
        .then((res) => {
          this.dashboard_count = res.data.count_dashboard;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
      }
    },

    route_to_page(page) {
      if (page == 'Users') {
        this.$router.push({ name: 'users' });
      }
      else if (page == 'Events') {
        this.$router.push({ name: 'events' });
      }
      else if (page == 'Promotions') {
        this.$router.push({ name: 'promotions_offers' });
      }
      else if (page == 'Products') {
        this.$router.push({ name: 'products' });
      }
      else if (page == 'Categories') {
        this.$router.push({ name: 'categories' });
      }
      else if (page == 'Careers') {
        this.$router.push({ name: 'careers' });
      }
      else if (page == 'Stores') {
        this.$router.push({ name: 'stores' });
      }
      else if (page == 'Testimonials') {
        this.$router.push({ name: 'reviews-testimonials' });
      }
      else {
        this.$router.push({ name: 'dashboard' });
      }
    },
  },
};
</script>
<style scoped>
.card /deep/ .v-card-item__prepend {
  padding-right: 0px;
}

.dash-parent .success {
  border-bottom: 4px solid green;
}

.dash-parent .warning {
  border-bottom: 4px solid orange;
}

.dash-parent .primary {
  border-bottom: 4px solid blue;
}

.dash-parent .error {
  border-bottom: 4px solid red;
}
.dash-parent .pink {
  border-bottom: 4px solid #E91E63;
}
.dash-parent .purple {
  border-bottom: 4px solid #9C27B0;
}
.dash-parent .lime {
  border-bottom: 4px solid #CDDC39;
}

.cardlogo {
  align-self: center;
}

/* .icon-wrapper i {
  font-size: 20px;
  padding: 10px 13px;
  background: #0000ff2b;
  border-radius: 50px;

} */

.avatarcount {
  color: rgba(0, 0, 0, 0.411);
  font-weight: 700;
  margin-bottom: 1px;
}

.icon-wrapper {
  text-align: center;
}

.routecard {
  cursor: pointer;
}

.arabic_row .direction_col {
  direction: rtl;
  text-align: right;
}

.d-flex2 {
  display: flex !important;
  width: 100%;
  justify-content: space-between;
  align-items: baseline;
}
.d-flex1 {
  display: flex !important;
  width: 100%;
  align-items: baseline;
}

.routecard:hover {
  height: 100.1%;
  width: 100.1%;
  box-shadow: 0 18px 26px rgba(21, 1, 1, 0.2);
}

.v-chip.v-chip--size-small {
  width: 86px;
}</style>