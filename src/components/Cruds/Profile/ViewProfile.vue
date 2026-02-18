<template>
  <v-container fluid class="page-wrapper background">
    <v-container class="py-12">
      <v-card class="profile-card pa-8" elevation="10">
        <!-- ================= HEADER ================= -->
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="text-center">
            <v-hover v-slot="{ isHovering, props }">
              <div class="position-relative d-inline-block" v-bind="props">
                <!-- AVATAR -->
                <v-avatar size="100" class="avatar-bg">
                  <v-img
                    v-if="profile_details.image_url"
                    :src="envImagePath + profile_details.image_url"
                    :style="
                      !isViewMode && isHovering ? 'filter: blur(2px);' : ''
                    "
                    cover
                  />

                  <v-icon
                    v-else
                    size="50"
                    :style="
                      !isViewMode && isHovering ? 'filter: blur(2px);' : ''
                    "
                  >
                    mdi-account
                  </v-icon>
                </v-avatar>

                <!-- EDIT ICON (ONLY WHEN EDIT MODE) -->
                <v-fade-transition>
                  <div
                    v-if="!isViewMode && isHovering"
                    class="avatar-edit-overlay"
                  >
                    <v-icon size="28" color="white" @click="uploadFile">
                      mdi-pencil
                    </v-icon>
                  </div>
                </v-fade-transition>
              </div>
            </v-hover>

            <!-- IMAGE UPLOAD COMPONENT -->
            <image-upload
              v-if="!isViewMode"
              :folder="'user_profile'"
              :resizewidth="200"
              :resizeheight="200"
              :upload_profile="uploadfile"
              @uploaded_image="uploaded_image"
            />
          </div>

          <div class="d-flex justify-end mt-4">
            <!-- ================= VIEW MODE BUTTON ================= -->
            <v-tooltip
              v-if="isViewMode"
              :text="$t('update_profile')"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  @click="isViewMode = false"
                  class="complete-btn"
                  rounded="pill"
                  elevation="10"
                  color="primary"
                >
                  {{ $t("update_profile") }} <b> ✓</b>
                </v-btn>
              </template>
            </v-tooltip>

            <!-- ================= EDIT MODE BUTTONS ================= -->
            <template v-else>
              <!-- CANCEL BUTTON -->
              <v-tooltip :text="$t('cancel')" location="bottom">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    @click="cancel()"
                    :disabled="loading"
                    class="mr-3"
                    rounded="pill"
                    elevation="10"
                    color="cancel"
                  >
                    {{ $t("cancel") }}
                  </v-btn>
                </template>
              </v-tooltip>

              <!-- SUBMIT BUTTON -->
              <v-tooltip :text="$t('submit')" location="bottom">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :disabled="isDisabled"
                    @click="submit"
                    rounded="pill"
                    elevation="10"
                    color="success"
                    class="complete-btn"
                  >
                    {{ $t("submit") }}

                    <v-progress-circular
                      v-if="isDisabled"
                      indeterminate
                      size="16"
                      width="2"
                      color="white"
                      class="ml-2"
                    />
                  </v-btn>
                </template>
              </v-tooltip>
            </template>
          </div>
        </div>

        <!-- ================= PERSONAL DETAILS ================= -->
        <div class="section-title mt-2">Personal details</div>

        <v-row class="mt-4">
          <v-col cols="12" md="4">
            <v-text-field
              :readonly="isViewMode"
              label="First name"
              v-model="profile_details.name"
              variant="outlined"
              density="compact"
              rounded="lg"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              :readonly="isViewMode"
              label="Last name"
              v-model="profile_details.lastname"
              variant="outlined"
              density="compact"
              rounded="lg"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              :readonly="isViewMode"
              label="Email"
              v-model="profile_details.email"
              variant="outlined"
              density="compact"
              rounded="lg"
            />
          </v-col>
        </v-row>

        <!-- ================= REGISTERED HOSPITALS ================= -->
        <div class="section-title mt-2">Registered hospitals</div>

        <v-row class="mt-4">
          <!-- LEFT SIDE -->
          <v-col cols="12" md="4">
            <v-btn
              v-for="item in hospitals"
              :key="item.id"
              block
              rounded="pill"
              class="mb-3"
              :class="
                selectedHospital?.id === item.id
                  ? 'purple-pill'
                  : 'outline-pill'
              "
              :variant="selectedHospital?.id === item.id ? 'flat' : 'outlined'"
              @click="selectedHospital = item"
            >
              {{ item.institutions?.name }}
            </v-btn>

            <v-btn block rounded="pill" variant="outlined" class="outline-pill">
              Register new hospital
            </v-btn>
          </v-col>

          <!-- RIGHT SIDE -->
          <v-col cols="12" md="8">
            <v-text-field
              readonly
              label="Hospital Name"
              :model-value="selectedHospital?.institutions?.name"
              variant="outlined"
              rounded="lg"
              class="mb-4"
              density="compact"
            />

            <v-textarea
              readonly
              label="Address"
              :model-value="selectedHospital?.institutions?.address"
              variant="outlined"
              rows="4"
              rounded="lg"
              density="compact"
            />
          </v-col>
        </v-row>

        <!-- ================= DRUG REGISTRATION DETAILS ================= -->
        <div class="section-title mt-2">Drug registration details</div>

        <v-row
          class="mt-2 align-start"
          v-for="(drug, index) in drugs"
          :key="index"
        >
          <v-col cols="12" md="4">
            <v-text-field
              label="Drug name"
              :readonly="isViewMode"
              v-model="drug.name"
              variant="outlined"
              rounded="lg"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              :readonly="isViewMode"
              label="Registration valid until"
              v-model="drug.validUntil"
              type="date"
              variant="outlined"
              rounded="lg"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="4" class="d-flex align-center">
            <v-chip
              :color="getStatusColor(drug)"
              variant="flat"
              class="status-chip w-100 text-center"
            >
              {{ getStatusLabel(drug) }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    loader: false,
    loading: false,
    profile_details: {
      id: 0,
      salutation: null,
      name: "",
      middlename: "",
      lastname: "",
      gender: null,
      email: "",
      image_url: "",
      postcode: "",
      dob: "",
      profession: "",
      maritalstatus_id: null,
      country: null,
      state: null,
      city: null,
      address: "",
      description: "",
      role_id: null,
      mobile: "",
      mobile_code: null,
      store_id: null,
    },
    role_details: [],
    selectedHospital: null,
    user: "",
    isDisabled: false,
    show_update: false,
    isViewMode: true,
    uploadfile: false,
    google_icon: {
      icon_name: "account_circle",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    drugs: [
      {
        name: "Lenalidomide",
        validUntil: "2026-07-26",
      },
      {
        name: "50mg - Thalidomide",
        validUntil: "2026-02-20",
      },
      {
        name: "Pomalidomide",
        validUntil: "2026-01-12",
      },
    ],
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  computed: {
    hospitals() {
      return this.profile_details?.prescriber_details || [];
    },
  },
  mounted() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("fetchuserdatabyslug/" + this.$route.query.slug)
            .then((res) => {
              this.loader = false;
              if (res.data.status == "S") {
                this.profile_details = res.data.user;
                this.role_details = res.data.user.role;
                if (this.profile_details.prescriber_details?.length > 0) {
                  this.selectedHospital =
                    this.profile_details.prescriber_details[0];
                }
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
    cancel() {
      this.isViewMode = true;
    },
    getStatusColor(drug) {
      const today = new Date();
      const expiry = new Date(drug.validUntil);
      const diff = (expiry - today) / (1000 * 60 * 60 * 24);

      if (diff < 0) return "red";
      if (diff <= 60) return "orange";
      return "green";
    },

    getStatusLabel(drug) {
      const today = new Date();
      const expiry = new Date(drug.validUntil);
      const diff = (expiry - today) / (1000 * 60 * 60 * 24);

      if (diff < 0) return "Invalid - Renew required";
      if (diff <= 60) return "Valid - Renew required soon";
      return "Valid";
    },

    saveProfile() {
      console.log("Profile Data:", this.profile_details);
      console.log("Drugs:", this.drugs);
    },
    uploaded_image(img_src) {
      this.profile_details.image_url = img_src;
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    submit() {
      this.isDisabled = true;
      this.$axios
        .post("saveuser", this.profile_details)
        .then((res) => {
          if (res.data.status == "S") {
            this.user.image_url = this.profile_details.image_url;
            const userdetails = JSON.stringify(this.user);
            localStorage.setItem("user_data", userdetails);
            this.$toast.success(res.data.message);
            this.isDisabled = false;
            this.isViewMode = true;
          } else if (res.data.status == "E") {
            this.$toast.error(res.data.message);
            this.isDisabled = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.isDisabled = false;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          this.$toast.error(this.$t("something_went_wrong"));
          this.isDisabled = false;
          console.log("error", err);
        });
    },
  },
};
</script>
<style scoped>
.profile-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f4f1e8, #f6e8c3);
}

.profile-card {
  border-radius: 24px;
}

.avatar-bg {
  background: var(--theme-color);
  color: white;
}

.profile-name {
  font-weight: 600;
  font-size: 22px;
}

.complete-btn {
  background: var(--theme-color) !important;
  color: white !important;
  padding: 8px 24px;
}

.section-title {
  font-weight: 600;
  font-size: var(--theme-header);
  border-bottom: 2px solid #eee;
  padding-bottom: 2px;
}

.purple-pill {
  background: var(--theme-color) !important;
  color: white !important;
}

.outline-pill {
  border: 2px solid var(--theme-color) !important;
  color: var(--theme-color) !important;
}

.status-chip {
  width: 100%;
  justify-content: center; /* center text horizontally */
  font-weight: 600;
  padding: 20px 0;
  font-size: 14px;
}
.position-relative {
  position: relative;
}

.avatar-bg {
  background: linear-gradient(135deg, #6a5af9, #836fff);
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
}
</style>
