<template>
  <div>
    <page-title :heading="$t('dashboard')" :google_icon="google_icon"></page-title>
    <content-loader v-if="loader"></content-loader>
    <div class="container-fluid">
      <div class="dash-parent">
        <v-row>
          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="usercard routecard" @click="route_to_page('user')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('user1') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ activeuser }}
                          </v-avatar>
                        </template>
                        {{ $t('active') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ inactiveuser }}
                          </v-avatar>
                        </template>
                        {{ $t('inactive') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" style="visibility: hidden;" size="small">

                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="success" icon="mdi-pencil"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="eventcard routecard" @click="route_to_page('event')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('events') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ irevents }}
                          </v-avatar>
                        </template>
                        {{ $t('in_review') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ apevents }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ reevents }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="warning" icon="mdi-calendar-check"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="promocard routecard" @click="route_to_page('promotion')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('promotions') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ irpromo }}
                          </v-avatar>
                        </template>
                        {{ $t('in_review') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ appromo }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ repromo }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="primary" icon="mdi-ticket-percent"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="productcard routecard" @click="route_to_page('product')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('products') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ irprod }}
                          </v-avatar>
                        </template>
                        {{ $t('in_review') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ approd }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ reprod }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="error" icon="mdi-view-module"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="categorycard routecard" @click="route_to_page('category')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('categories') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ ircat }}
                          </v-avatar>
                        </template>
                        {{ $t('in_review') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ apcat }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ recat }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="error" icon="mdi mdi-apps"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="carriercard routecard" @click="route_to_page('career')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('careers') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ ircar }}
                          </v-avatar>
                        </template>
                        {{ $t('in_review') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ apcar }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ recar }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="primary" icon="mdi mdi-briefcase"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="storecard routecard" @click="route_to_page('store')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('stores') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="orange" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ irstore }}
                          </v-avatar>
                        </template>
                        {{ $t('in_review') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ apstore }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ re_store }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="warning" icon="mdi mdi-storefront-outline"></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="6" class="testimonialcard routecard"
              @click="route_to_page('testimonial')">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('testimonials') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="green" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ aptesti }}
                          </v-avatar>
                        </template>
                        {{ $t('approved') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" size="small">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{ retesti }}
                          </v-avatar>
                        </template>
                        {{ $t('rejected') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-2">
                      <v-chip class="mx-3" color="error" style="visibility: hidden;" size="small">

                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <v-btn class="ma-2" color="success" icon="mdi mdi-message-text-fast-outline"></v-btn>
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
    activeuser: 0,
    inactiveuser: 0,
    reevents: 0,
    apevents: 0,
    irevents: 0,
    repromo: 0,
    appromo: 0,
    irpromo: 0,
    reprod: 0,
    approd: 0,
    irprod: 0,
    recat: 0,
    apcat: 0,
    ircat: 0,
    recar: 0,
    apcar: 0,
    ircar: 0,
    re_store: 0,
    apstore: 0,
    irstore: 0,
    aptesti: 0,
    retesti: 0,
    loader: false,
    role_id: "",
    menuitems: [],
    google_icon: {
      icon_name: "dashboard",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchDashboard();
  },

  methods: {
    fetchDashboard() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchdashboard")
        .then((res) => {
          this.activeuser = res.data.activeuser;
          this.inactiveuser = res.data.inactiveuser;
          this.irevents = res.data.irevents;
          this.apevents = res.data.apevents;
          this.reevents = res.data.reevents;
          this.irpromo = res.data.irpromo;
          this.appromo = res.data.appromo;
          this.repromo = res.data.repromo;
          this.irprod = res.data.irprod;
          this.approd = res.data.approd;
          this.reprod = res.data.reprod;
          this.ircat = res.data.ircat;
          this.apcat = res.data.apcat;
          this.recat = res.data.recat;
          this.ircar = res.data.ircar;
          this.apcar = res.data.apcar;
          this.recar = res.data.recar;
          this.irstore = res.data.irstore;
          this.apstore = res.data.apstore;
          this.re_store = res.data.re_store;
          this.aptesti = res.data.aptesti;
          this.retesti = res.data.retesti;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log(err);
        });
    },

    route_to_page(page) {
      if (page == 'user') {
        this.$router.push({ name: 'users' });
      }
      else if (page == 'event') {
        this.$router.push({ name: 'events' });
      }
      else if (page == 'promotion') {
        this.$router.push({ name: 'promotions_offers' });
      }
      else if (page == 'product') {
        this.$router.push({ name: 'products' });
      }
      else if (page == 'category') {
        this.$router.push({ name: 'categories' });
      }
      else if (page == 'career') {
        this.$router.push({ name: 'careers' });
      }
      else if (page == 'store') {
        this.$router.push({ name: 'stores' });
      }
      else if (page == 'testimonial') {
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

.dash-parent .usercard,
.testimonialcard {
  border-bottom: 4px solid green;
}

.dash-parent .eventcard,
.storecard {
  border-bottom: 4px solid orange;
}

.dash-parent .promocard,
.carriercard {
  border-bottom: 4px solid blue;
}

.dash-parent .productcard,
.categorycard {
  border-bottom: 4px solid red;
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

.routecard:hover {
  height: 100.7%;
  width: 100.7%;
  box-shadow: 0 18px 26px rgba(21, 1, 1, 0.2);
}</style>