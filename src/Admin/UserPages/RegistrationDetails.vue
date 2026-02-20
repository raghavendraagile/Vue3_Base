<template>
  <v-container fluid class="page-wrapper background">
    <content-loader v-if="loader"></content-loader>

    <!-- Confirmation Dialog -->
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    />

    <!-- Rejection Reason Dialog -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Rejection Reason</v-card-title>

        <v-card-text>
          <v-textarea
            v-model="rejectReason"
            label="Enter rejection reason"
            rows="3"
            auto-grow
            outlined
            required
          />
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn
            variant="outlined"
            class="register-btn"
            rounded="pill"
            @click="closeRejectDialog"
            >Cancel</v-btn
          >
          <v-btn
            variant="outlined"
            rounded="pill"
            class="btn-approved ml-2"
            :disabled="!rejectReason"
            @click="confirmReject"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="main-section">
      <v-btn
        variant="outlined"
        class="register-btn"
        rounded="pill"
        @click="goBackToDetails"
      >
        Back
      </v-btn>

      <v-card class="details-card pa-6 mt-4" elevation="0">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="heading">Registration Details</h2>

          <v-chip
            size="small"
            variant="flat"
            class="text-white"
            :class="getStatusClass(reg_deatils.reg_status)"
          >
            {{ formatStatus(reg_deatils.reg_status) }}
          </v-chip>
        </div>

        <v-divider class="mb-4"></v-divider>

        <v-row dense>
          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">ID</span>
              <span class="detail-value">{{ reg_deatils.id }}</span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">Prescriber</span>
              <span class="detail-value">
                {{ reg_deatils.salutation }}. {{ reg_deatils.name }}
              </span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">Gender</span>
              <span class="detail-value">{{ reg_deatils.gender }}</span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">Date of Birth</span>
              <span class="detail-value">{{ reg_deatils.dob }}</span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">Indication</span>
              <span class="detail-value">{{ reg_deatils.rolename }}</span>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">Molecule</span>
              <span class="detail-value">{{ reg_deatils.rolename }}</span>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value">
                <v-chip
                  size="small"
                  variant="flat"
                  :class="
                    reg_deatils.status === 1
                      ? 'status-approved'
                      : 'status-warning'
                  "
                  class="text-white"
                >
                  {{ reg_deatils.status == 1 ? "Active" : "Inactive" }}
                </v-chip></span
              >
            </div>
          </v-col>
          <v-col cols="12" md="6" v-if="reg_deatils.reg_status == 'Rejected'">
            <div class="detail-item">
              <span class="detail-label">Rejection Reason</span>
              <span class="detail-value">{{
                reg_deatils.rejection_reason
              }}</span>
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <!-- Action Buttons -->
        <div class="d-flex justify-end">
          <v-btn
            v-if="reg_deatils.reg_status != 'Rejected'"
            size="small"
            rounded="pill"
            class="status-approved mr-3 text-white"
            :disabled="reg_deatils.reg_status === 'Approved'"
            @click="updateStatus(reg_deatils, 'Approved')"
          >
            Approve
          </v-btn>

          <v-btn
            v-if="reg_deatils.reg_status != 'Approved'"
            size="small"
            rounded="pill"
            color="red"
            :disabled="reg_deatils.reg_status === 'Rejected'"
            @click="openRejectDialog(reg_deatils)"
          >
            Reject
          </v-btn>
        </div>
      </v-card>
    </div>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      reg_deatils: {},
      dialogTitle: "",
      dialogMessage: "",
      loader: false,

      rejectDialog: false,
      rejectReason: "",
      rejectObj: null,
    };
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.getRegDetails();
        }
      },
    },
  },

  methods: {
    formatStatus(status) {
      if (status === "Approved" || status === 1) return "Approved";
      if (status === "Rejected" || status === 0) return "Rejected";
      return "Awaiting Approval";
    },

    getStatusClass(status) {
      if (status === "Approved" || status === 1) return "status-approved";
      if (status === "Rejected" || status === 0) return "status-rejected";
      return "status-warning";
    },

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
        })
        .finally(() => {
          this.loader = false;
        });
    },

    goBackToDetails() {
      this.$router.push({ name: "registration_list" });
    },

    async updateStatus(regObj, reg_status) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update the status?"
      );
      if (!result) return;

      this.loader = true;
      this.$axios
        .post("updateRegStatus", {
          slug: regObj.slug,
          reg_status: reg_status,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.getRegDetails();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },

    openRejectDialog(regObj) {
      this.rejectObj = regObj;
      this.rejectReason = "";
      this.rejectDialog = true;
    },

    closeRejectDialog() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },

    async confirmReject() {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to reject this registration?"
      );
      if (!result) return;

      this.rejectDialog = false;
      this.loader = true;

      this.$axios
        .post("updateRegStatus", {
          slug: this.rejectObj.slug,
          reg_status: "Rejected",
          reject_reason: this.rejectReason,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.getRegDetails();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
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
.details-card {
  border-radius: 20px;
  background: #e9edf7;
}

.detail-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.detail-label {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
</style>
