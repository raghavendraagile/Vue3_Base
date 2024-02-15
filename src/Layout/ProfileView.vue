
<script setup>
import { apptheme } from "../store/apptheme.js";
</script>
<template>
  <div class="d-flex">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar
              v-if="user.image_url != null"
              v-bind="props"
              class="profile-card"
              color="grey-darken-3"
              :image="envImagePath + user.image_url"
            ></v-avatar>
            <v-avatar
              v-else
              v-bind="props"
              color="grey-darken-3"
              class="defalut_src"
              :image="default_src"
            >
            </v-avatar>
          </template>
          <v-list-item-title style="font-weight: bold; font-size: 14px" class="user_name">
            <span
              v-if="user"
              v-bind:class="
                apptheme.theme_type == 'theme-dark' ? 'text-white' : ''
              "
              >{{ user.salutation }} {{ user.name }} {{ user.lastname }}</span
            >
          </v-list-item-title>
          <!-- <v-list-item-subtitle style="font-size: 12px"
            >coming soon</v-list-item-subtitle
          > -->
        </v-list-item>
      </template>

      <v-card
        min-width="300"
        v-bind:style="
          apptheme.theme_type == 'theme-dark'
            ? 'box-shadow: 0px 0px 4px white;background:black;'
            : 'box-shadow: 0px 0px 4px grey;'
        "
        style="margin-top: 18px"
      >
        <v-list
          v-bind:class="apptheme.theme_type == 'theme-dark' ? 'card-bg' : ''"
        >
          <div class="container d-flex justify-content-center p-0 m-0">
            <div
              class="card p-3"
              v-bind:class="
                apptheme.theme_type == 'theme-dark' ? 'card-bg' : ''
              "
            >
              <div class="d-flex align-items-flex-start">
                <div class="profile-image">
                  <img
                    v-if="user.image_url != null"
                    :src="envImagePath + user.image_url"
                    class="rounded-circle profile_display"
                    style="width: 86%"
                  />
                  <img
                    v-else
                    src="@/assets/images/avatars/default.png"
                    class="rounded-circle"
                    style="width: 100%"
                  />
                </div>

                <div class="ml-3 w-100 profile-data">
                  <h4 class="mb-0 mt-0 ml-2">
                    <span
                      v-if="user"
                      v-bind:class="
                        apptheme.theme_type == 'theme-dark' ? 'text-white' : ''
                      "
                      >{{ user.salutation }} {{ user.name }}
                      {{ user.lastname }}</span
                    >
                  </h4>
                  <span class="ml-2" style="color: #918f8f"
                    >Role: {{ user.role.role_display_name }}</span
                  >
                  <div>
                    <div class="mt-2 d-flex justify-content-between rounded">
                      <v-tooltip :text="$t('my_profile')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <router-link
                            :to="{
                              name: 'view-my-profile',
                              query: {
                                slug: user.slug,
                                from: 'amend',
                              },
                            }"
                          >
                            <a class="w-100 ml-2 list-menus" v-bind="props">
                              {{ $t("my_profile") }}
                            </a>
                          </router-link>
                        </template>
                      </v-tooltip>
                    </div>
                    <div class="mt-2 d-flex justify-content-between rounded">
                      <v-tooltip :text="$t('reset_password')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <div @click="resetPasswordRedirect()">
                            <a class="w-100 ml-2 list-menus" v-bind="props">
                              {{ $t("reset_password") }}
                            </a>
                          </div>
                        </template>
                      </v-tooltip>
                    </div>
                    <div class="mt-2 d-flex justify-content-between rounded">
                      <v-tooltip :text="$t('logout')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <span>
                            <a
                              v-bind="props"
                              class="w-100 ml-2 list-menus"
                              @click="logoutUser"
                            >
                              {{$t('logout')}}
                            </a>
                          </span>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    fav: true,
    user: [],
    menu: false,
    message: false,
    hints: true,
    default_src: require("@/assets/images/avatars/default.png"),
  }),
  mounted() {
    if (JSON.parse(localStorage.getItem("user_data"))) {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      this.role_id = this.user.role_id;
    }
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        if (this.user.id > 0) {
          this.$emit("getuserdetails", this.user);
        }
      },
    },
  },
  created() {
    this.emitter.on("updateProfileImage", () => {
      this.fetchUserData();
    });
  },
  methods: {
    resetPasswordRedirect() {
      this.$router.push({
        name: "reset_password",
      });
    },
    fetchUserData() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
    },
    ...mapActions("auth", ["logoutUser"]),
    logoutUser() {
      this.$store.dispatch('auth/logoutUser') 
        .then(() => {
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Logout failed", error);
        });
    },
    // async login() {
    //   await this.loginRequest(this.userdata).then(() => {
    //     // console.log("userdata are", this.userdata);
    //     this.btnloading = true;
    //     this.$router.push({
    //       name: "dashboard",
    //     });
    //   });
    // },
  },
};
</script>

<style scoped>
.profile-card:hover {
  cursor: pointer;
}
.profile-image {
  width: 30%;
}
.profile-image > img {
  border: 1px solid #e3e2e2;
  background: #f5f2f2;
}
.profile-data {
  width: 70%;
}
body {
  background-color: #b3e5fc;
  border-radius: 10px;
}

.card {
  width: 400px;
  border: none;
  border-radius: 10px;

  background-color: #fff;
}

.stats {
  background: #f2f5f8 !important;

  color: #000 !important;
}
a:hover {
  cursor: pointer;
}
.articles {
  font-size: 10px;
  color: #a1aab9;
}
.number1 {
  font-weight: 500;
}
.followers {
  font-size: 10px;
  color: #a1aab9;
}
.number2 {
  font-weight: 500;
}
.rating {
  font-size: 10px;
  color: #a1aab9;
}
.number3 {
  font-weight: 500;
}
.profile_display {
  height: 43% !important;
}
.card-bg {
  background: #2d2d2d;
}

.text-white {
  color: white;
}
.image-size {
  font-size: 45px;
}
.defalut_src:hover {
  cursor: pointer;
}

.list-menus:hover {
  transform: translateY(20px);
  font-weight: bold;
  color: rgb(77, 77, 253);
}
@media only screen and (max-width: 600px) {
  .user_name {
    font-size: 13px; 
    white-space: normal; 
  }
}
</style>