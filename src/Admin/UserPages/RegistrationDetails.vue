<template>
  <v-container fluid class="page-wrapper background">
    <content-loader v-if="loader"></content-loader>
    <!-- Back section -->
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>

    <div class="main-section">
      <v-btn
        variant="outlined"
        class="register-btn"
        rounded="pill"
        @click="goBackToDetails()"
        >Back</v-btn
      >
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
              &nbsp;{{ reg_deatils.salutation }}.{{ reg_deatils.name }}
            </div>
          </div>
          <div class="d-flex">
            <div class="label">Gender :</div>
            <div class="label">&nbsp;{{ reg_deatils.gender }}</div>
          </div>
          <div class="d-flex">
            <div class="label">Dob :</div>
            <div class="label">&nbsp;{{ formatDateTime(reg_deatils.dob) }}</div>
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
            <v-btn
              small
              rounded
              :class="reg_deatils.status == 1 ? 'btn-disabled' : 'btn-approved'"
              :disabled="reg_deatils.status == 1"
              @click="updateStatus(reg_deatils)"
            >
              Approved
            </v-btn>

            <v-btn
              rounded
              small
              :class="reg_deatils.status == 0 ? 'btn-disabled' : 'btn-reject'"
              :disabled="reg_deatils.status == 0"
              class="ml-2"
              @click="updateStatus(reg_deatils)"
            >
              Reject
            </v-btn>
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
      dialogMessage: "",
      dialogTitle: "",
      loader: false,
      // accepted: false,
    };
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.getRegDetails();
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
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    getRegDetails() {
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
    },
    goBackToDetails() {
      // this.$emit("back", false);
      this.$router.push({ name: "registration_list" });
    },
    async updateStatus(regObj) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update the status ?"
      );
      if (!result) return;
      this.loader = true;
      this.$axios
        .post("updateRegStatus", {
          slug: regObj.slug,
        })
        .then(async (res) => {
          console.log("res.data.status");
          console.log(res.data.status);
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            // this.$router.push({ name: "registration_list" });
            this.getRegDetails();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
          this.isBtnLoading = false;
        })
        .catch((err) => {
          this.$toast.error(res.data.message);
          console.log("this error" + err);
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
