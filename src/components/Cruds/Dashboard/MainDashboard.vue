<template>
  <div>
    <page-title :heading="$t('dashboard')" :google_icon="google_icon"></page-title>
    <content-loader v-if="loader"></content-loader>
    <div class="container-fluid">
      <div class="dash-parent">
        <v-row>
          <v-col md="3">
            <v-card density="comfortable" elevation="3" hover="true" class="card">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('user1') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="green">
                        <template v-slot:prepend>
                           <v-avatar class="avatarcount">
                            {{activeuser}}
                          </v-avatar>
                        </template>
                        {{ $t('active') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-1">
                      <v-chip class="mx-3" color="orange">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{inactiveuser}}
                          </v-avatar>
                        </template>
                        {{ $t('inactive') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <i class="text-primary fa fa-user"></i>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="3" hover="true" class="card">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('events') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="green">
                        <template v-slot:prepend>
                           <v-avatar class="avatarcount">
                            {{activeevents}}
                          </v-avatar>
                        </template>
                        {{ $t('active') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-1">
                      <v-chip class="mx-3" color="orange">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{inactiveevents}}
                          </v-avatar>
                        </template>
                        {{ $t('inactive') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <i class="text-primary fa fa-user"></i>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="3" hover="true" class="card">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('promotions') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="green">
                        <template v-slot:prepend>
                           <v-avatar class="avatarcount">
                            {{activepromo}}
                          </v-avatar>
                        </template>
                        {{ $t('active') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-1">
                      <v-chip class="mx-3" color="orange">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{inactivepromo}}
                          </v-avatar>
                        </template>
                        {{ $t('inactive') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <i class="text-primary fa fa-user"></i>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="3">
            <v-card density="comfortable" elevation="3" hover="true" class="card">
              <v-row>
                <v-col md="8">
                  <v-card-title>
                    {{ $t('products') }}
                  </v-card-title>
                  <div class="pb-5 pt-2 px-3">
                    <div class="text-left row">
                      <v-chip class="mx-3" color="green">
                        <template v-slot:prepend>
                           <v-avatar class="avatarcount">
                            {{activeproducts}}
                          </v-avatar>
                        </template>
                        {{ $t('active') }}
                      </v-chip>
                    </div>
                    <div class="text-left row mt-1">
                      <v-chip class="mx-3" color="orange">
                        <template v-slot:prepend>
                          <v-avatar class="avatarcount">
                            {{inactiveproducts}}
                          </v-avatar>
                        </template>
                        {{ $t('inactive') }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col md="4" class="cardlogo">
                  <div class="icon-wrapper">
                    <i class="text-primary fa fa-user"></i>
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
    activeevents: 0,
    inactiveevents: 0,
    activepromo: 0,
    inactivepromo: 0,
    activeproducts: 0,
    inactiveproducts: 0,
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
          this.activeevents = res.data.activeevents;
          this.inactiveevents = res.data.inactiveevents;
          this.activepromo = res.data.activepromo;
          this.inactivepromo = res.data.inactivepromo;
          this.activeproducts = res.data.activeproducts;
          this.inactiveproducts = res.data.inactiveproducts;
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
.card /deep/ .v-card-item__prepend {
  padding-right: 0px;
}

.dash-parent .card {
  border-bottom: 4px solid #31c25ad2;
}

.cardlogo {
  align-self: center;
}

.icon-wrapper i {
  font-size: 25px;
  padding: 10px 13px;
  background: #0000ff2b;
  border-radius: 50px;

}
.avatarcount{
  color: rgba(0, 0, 0, 0.411);
    font-weight: 700;
}
.icon-wrapper{
  text-align: center;
}
</style>