<template>
  <v-container fluid class="page-wrapper background">
    <!-- Back section -->

    <div class="main-section">
      <button class="btn-outline" @click="goBackToDetails()">Back</button>
      <div>
        <!-- Search Bar -->
        <!-- {{ reg_deatils }} -->
        <v-card class="table-card pa-4 mt-4">
          <h2 class="heading">Registration Details</h2>
          <div class="d-flex">
            <div class="label">Id :</div>
            <div class="label">&nbsp;{{ reg_deatils.id }}</div>
          </div>
          <div class="d-flex">
            <div class="label">Prescriber :</div>
            <div class="label">
              &nbsp;{{ reg_deatils.salutation }}. &nbsp;{{ reg_deatils.name }}
            </div>
          </div>
          <div class="d-flex">
            <div class="label">Gender :</div>
            <div class="label">&nbsp;{{ reg_deatils.gender }}</div>
          </div>
          <div class="d-flex">
            <div class="label">dob :</div>
            <div class="label">&nbsp;{{ reg_deatils.dob }}</div>
          </div>
          <div class="d-flex">
            <div class="label">Idendication :</div>
            <div class="label">&nbsp;{{ reg_deatils.rolename }}</div>
          </div>
          <div class="d-flex">
            <div class="label">Molecule :</div>
            <div class="label">&nbsp;{{ reg_deatils.rolename }}</div>
          </div>
          <div class="d-flex">
            <div class="label">Status :</div>
            <div class="label">&nbsp;{{ reg_deatils.status }}</div>
          </div>
          <div class="auth-buttons text-right">
            <button class="btn-filled" @click="updateStatus(reg_deatils)">
              Approved
            </button>

            <button class="btn-filled ml-2" @click="updateStatus(reg_deatils)">
              Reject
            </button>
          </div>
        </v-card>
      </div>
      <!-- <div v-else>
        <RegistrationDetails :selectedId="selectedId" @back="handleBackClick" />
      </div> -->
    </div>
    <!-- Search Bar -->

    <!-- Data Table Card -->
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      reg_deatils: [],
    };
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("fetch_regdetails_by_slug/" + this.$route.query.slug)
            .then((res) => {
              this.reg_deatils = res.data.reg_deatils;
              this.loader = false;
            })
            .catch(() => {
              this.loader = false;
            });
        }
      },
    },
  },
  computed: {},

  mounted() {
    console.log("Registration ID:", this.$route.query.slug);
  },

  created() {
    // Initialization logic here
  },
  methods: {
    goBackToDetails() {
      this.$emit("back", false);
      // this.$router.push({ name: 'PatientDetails', params: { id: item.id } })
    },

    updateStatus() {
      this.loader = true;
      this.isBtnLoading = true;

      this.$axios
        .post("update_status", {
          otp: this.verification_code,
          email: this.userdata.email,
        })
        .then(async (res) => {
          if (res.data.status === "S") {
            await this.$store.dispatch("auth/loginRequest", this.userdata);
            this.$router.push({ name: "dashboard" });
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
          this.isBtnLoading = false;
        });
    },
  },
};
</script>

<style scoped>
/* Page Background */
.page-wrapper {
  padding: 40px;
}

/* Search */
.search-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 562px;
  position: relative;
  top: 34px;
  z-index: 20000;
  left: 29%;
}

.search-wrapper :deep(.v-field) {
  border-radius: 30px;
}

.search-field {
  width: 500px;
  border-radius: 999px;
}

/* Table Card */
.table-card {
  border-radius: 24px;
  background: #e9edf7;
  backdrop-filter: blur(12px);
}

/* Remove default header background */
.custom-table :deep(.v-data-table-header) {
  background: transparent;
}

/* Header text styling */
.custom-table :deep(th) {
  color: #6c4df6;
  font-weight: 600;
  font-size: 14px;
}

/* Row styling */
.custom-table :deep(td) {
  padding-top: 4px !important;
  padding-bottom: 6px !important;
  font-size: 12px;
  color: #444;
}

/* Row divider */
.custom-table :deep(tbody tr) {
  border-bottom: 1px solid #eaeaf5;
}

/* Status styling */
.status-text {
  font-weight: 600;
}

.status-submitted {
  color: #6c6c6c;
}

.status-rejected {
  color: #ff2d55;
}

/* PDF button */
.pdf-btn {
  background: #6c4df6;
  color: white;
  border-radius: 50%;
}

.pdf-btn:hover {
  background: #5b3de6;
}
.v-table {
  background: #e9edf7 !important;
}
</style>
