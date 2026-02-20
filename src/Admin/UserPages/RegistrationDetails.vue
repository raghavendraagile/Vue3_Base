<template>
  <v-container fluid class="page-wrapper background">
    <content-loader v-if="loader"></content-loader>

    <!-- Confirmation Dialog -->
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    />
    <!-- {{ reg_deatils }} -->
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
        <v-divider class="ml-4"></v-divider>
        <!-- Registration Details -->

        <v-row dense>
          <v-col cols="12" md="6">
            <!-- <div class="custom-field plain-wrapper mb-4">
              <label class="plain-label">Dispensing Pharmacy Address</label>
              <div class="plain-value">
                {{ form.dispensing_address }}
              </div>
            </div> -->
            <v-text-field
              v-model="reg_deatils.name"
              :rules="requiredRule"
              density="compact"
              readonly
              variant="outlined"
              label="Pharmacist (or appointed deputy) First Name"
              class="custom-field field-required"
              maxlength="30"
              counter
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="reg_deatils.lastname"
              :rules="requiredRule"
              density="compact"
              aria-readonly="readonly"
              variant="outlined"
              label="Pharmacist (or appointed deputy) Last Name"
              class="custom-field field-required"
              maxlength="30"
              counter
              readonly
            />
          </v-col>

          <v-col cols="12" md="6" v-if="reg_deatils.pharmacist">
            <v-text-field
              v-model="reg_deatils.pharmacist.reg_no"
              :rules="requiredRule"
              density="compact"
              variant="outlined"
              label="GPhC / PSNI Registration Number"
              class="custom-field field-required"
              maxlength="30"
              counter
              readonly
            />
          </v-col>
          <v-col cols="12" md="6" v-if="reg_deatils.pharmacist">
            <v-select
              v-model="reg_deatils.pharmacist.institution_type"
              :items="institutionTypes"
              item-title="longname"
              item-value="shortname"
              :rules="requiredRule"
              density="compact"
              variant="outlined"
              label="Institution Type"
              class="custom-field field-required"
              readonly
            />
          </v-col>

          <v-col cols="12" md="6" v-show="reg_deatils.pharmacist">
            <v-text-field
              v-model="reg_deatils.pharmacist.phone_no"
              density="compact"
              variant="outlined"
              label="Phone Number"
              class="custom-field field-required"
              type="tel"
              inputmode="numeric"
              maxlength="22"
              counter
              readonly
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="reg_deatils.pharmacist.institution_id"
              :items="institutions"
              item-title="name"
              item-value="id"
              :rules="requiredRule"
              density="compact"
              variant="outlined"
              label="Institution Name"
              class="custom-field field-required"
              readonly
            />
          </v-col>
        </v-row>

        <!-- Role -->
        <v-row dense>
          <v-col cols="12" md="6">
            <p class="mb-2">
              Please select the role that matches your level of responsibility
            </p>

            <v-row dense>
              <v-checkbox
                v-model="reg_deatils.pharmacist.role"
                label="Chief Pharmacist"
                value="Chief Pharmacist"
                hide-details
                class="pr-3"
                readonly
              />
              <v-checkbox
                v-model="reg_deatils.pharmacist.role"
                label="Pharmacist"
                value="Pharmacist"
                hide-details
                readonly
              />
            </v-row>

            <!-- <div v-if="roleError" class="required-text">
                At least one role type is required
              </div> -->
          </v-col>

          <v-col cols="12" md="6">
            <div>
              <strong>Note:</strong>
              If the institution you require does not appear in the drop down
              menu, please contact
              <a href="mailto:support@pharmacaregroup.co.uk">
                support@pharmacaregroup.co.uk
              </a>
            </div>
          </v-col>
        </v-row>

        <!-- Addresses -->

        <!-- <v-col cols="12" md="6" v-if="form.institution_id"> -->
        <div class="custom-field plain-wrapper mb-4">
          <label class="plain-label">Dispensing Pharmacy Address</label>
          <div class="plain-value">
            {{ reg_deatils.pharmacist.dispensing_address }}
          </div>
        </div>
        <!-- </v-col> -->
        <!-- <v-text-field
          v-model="reg_deatils.pharmacist.dispensing_address"
          :rules="requiredRule"
          density="compact"
          variant="outlined"
          label="Dispensing Pharmacy Address"
          class="custom-field field-required mt-6"
        /> -->

        <v-text-field
          v-model="reg_deatils.pharmacist.delivery_address"
          density="compact"
          variant="outlined"
          label="Delivery Address (if different)"
          class="custom-field"
          maxlength="80"
          counter
        />

        <v-text-field
          v-model="reg_deatils.pharmacist.ordering_address"
          density="compact"
          variant="outlined"
          label="Ordering Address (if different to delivery address)"
          class="custom-field"
          maxlength="80"
          counter
        />

        <!-- Wholesaler -->
        <!-- <h6 class="section-title mt-4 mb-6">
          <div class="d-flex align-center">
            <span class="section-text theme-subheader">
              Wholesaler Details
            </span>
            <v-divider class="ml-4"></v-divider>
          </div>
        </h6> -->
        <!-- <v-row dense>
          <v-col v-for="wh in wholesalers" :key="wh.id" cols="12" md="6">
            <v-text-field
              v-model="reg_deatils.wholesaler_accounts[wh.id]"
              :label="wh.name + ' Account Number'"
              variant="outlined"
              density="compact"
              class="custom-field"
            />
          </v-col>
        </v-row> -->

        <v-divider class="mb-4"></v-divider>

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
      reg_deatils: {
        id: 0,
        name: "",
        lastname: " ",
        email: "",
        email_verified_at: null,
        token_id: null,
        role_id: 3,
        salutation: null,
        gender: null,
        dob: null,
        address: null,
        postcode: null,
        description: null,
        image_url: null,
        country: null,
        state: null,
        city: null,
        mobile: null,
        mobile_code: null,
        otp: null,
        otp_valid_until: null,
        is_otp_validated: 1,
        status: 0,
        reg_status: "Awaiting Approval",
        rejection_reason: null,
        slug: "",
        expired: 0,
        signature_date: "2026-02-20 00:00:00",
        signature: "",
        created_by: null,
        updated_by: null,
        created_at: "",
        updated_at: "",
        rolename: "",
        full_name: "",
        role: {
          id: 0,
          rolename: "",
          role_display_name: "",
          roledescription: "",
          status: 1,
          slug: "",
          created_by: null,
          updated_by: null,
          created_at: null,
          updated_at: null,
        },
        pharmacist: {
          id: 0,
          user_id: 0,
          reg_no: "",
          phone_no: "",
          dispensing_address: "",
          delivery_address: "",
          ordering_address: "",
          institution_type: "",
          institution_id: 1,
          slug: "",
          role: "",
          created_by: 5,
          updated_by: null,
          created_at: "2026-02-20T09:29:26.000000Z",
          updated_at: "2026-02-20T09:29:26.000000Z",
        },
      },

      dialogTitle: "",
      dialogMessage: "",
      loader: false,
      institutionTypes: [],
      institutions: [],
      rejectDialog: false,
      rejectReason: "",
      rejectObj: null,
    };
  },
  created() {},
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
  computed: {
    requiredRule() {
      return [(v) => !!v || "This field is required"];
    },

    phoneRules() {
      return [
        (v) => !!v || "Phone number is required",
        (v) => /^[0-9+\s()-]*$/.test(v) || "Only numbers and + - allowed",
        (v) => v.replace(/\D/g, "").length >= 8 || "Enter a valid phone number",
      ];
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
          this.fetchInstitutionList(
            this.reg_deatils.pharmacist.institution_type
          );
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
          name: regObj.name,
          email: regObj.email,
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
    fetchInstitutionList(type) {
      this.institutions = [];
      // this.reg_deatils.pharmacist.institution_id = null;
      this.$axios
        .get("fetch_institution_by_type", {
          params: {
            type: type,
          },
        })
        .then((response) => {
          this.institutions = response.data.institutions;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    fetchLov() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "INSTITUTION_TYPE",
          },
        })
        .then((res) => {
          this.institutionTypes = res.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      // this.$axios
      //   .get("fetch_active_drugs")
      //   .then((res) => {
      //     this.medications = res.data.drugs;

      //     // Build terms structure dynamically (temporary hardcoded example)
      //     this.medicationTerms = this.medications.map((drug) => ({
      //       id: drug.id,
      //       name: drug.drug_name,
      //       terms: this.getDefaultTerms(drug.id),
      //     }));
      //   })
      //   .catch((err) => {
      //     this.$toast.error(this.$t("something_went_wrong"));
      //     console.log(err);
      //   });

      // this.$axios
      //   .get("fetch_active_wholesalers")
      //   .then((res) => {
      //     this.wholesalers = res.data.wholesalers;

      //     // Initialize empty account numbers dynamically
      //     this.wholesalers.forEach((wh) => {
      //       this.form.wholesaler_accounts[wh.id] = "";
      //     });
      //   })
      //   .catch((err) => {
      //     this.$toast.error(this.$t("something_went_wrong"));
      //     console.log(err);
      //   });
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
          name: this.rejectObj.name,
          email: this.rejectObj.email,
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
  border-radius: 5px;
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
