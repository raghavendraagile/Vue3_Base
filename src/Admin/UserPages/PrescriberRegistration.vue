<template>
  <div class="register-page pa-0">
    <content-loader v-if="loading"></content-loader>
    <!-- Progress Header -->
    <div class="progress-wrapper">
      <div class="progress-content">
        <span>Progress</span>

        <v-progress-linear
          :model-value="progress"
          height="6"
          stream
          color="white"
        ></v-progress-linear>

        <span>Complete</span>
      </div>
    </div>

    <div>
      <div class="content-wrapper">
        <v-card class="form-card" elevation="0">
          <!-- FORM WRAPPER -->
          <v-form ref="formRef" v-model="isFormValid">
            <!-- Header -->
            <div class="form-header">
              <span class="theme-header">Prescriber registration form</span>

              <div class="header-actions">
                <v-btn
                  size="small"
                  variant="outlined"
                  class="btn-outline"
                  rounded="pill"
                  @click="returnToSelection()"
                >
                  ← Return to selection
                </v-btn>

                <v-btn size="small" class="btn-filled theme-bg" rounded="pill">
                  Prescriber
                </v-btn>
              </div>
            </div>

            <!-- ================= STEP 1 ================= -->
            <div v-if="step === 1">
              <!-- PRESCRIBER DETAILS -->
              <h6 class="section-title mt-5 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader">
                    Prescriber details
                  </span>
                  <v-divider class="ml-4"></v-divider>
                </div>
              </h6>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Prescriber First Name"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.lastname"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Prescriber Last Name"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.reg_no"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Registration Number"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.job_title"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Job Title"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.institution_id"
                    :items="hospitals"
                    item-title="name"
                    item-value="id"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Hospital Name"
                    class="custom-field field-required"
                    @update:modelValue="populateAddress"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="form.institution_id">
                  <div class="custom-field plain-wrapper">
                    <label class="plain-label">Hospital Address</label>
                    <div class="plain-value">
                      {{ form.address }}
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- MEDICATION -->
              <h6 class="section-title mt-8 mb-4">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader">
                    * Medication
                  </span>
                  <v-divider class="ml-4"></v-divider>
                </div>
              </h6>

              <p class="mb-4" style="font-size: 14px">
                Please select the medication in which you want to prescribe.
              </p>

              <v-row dense>
                <v-col v-for="med in medications" :key="med" cols="12" md="3">
                  <v-checkbox
                    v-model="form.medications"
                    :label="med"
                    :value="med"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>

              <div
                v-if="medicationError"
                style="color: red; font-size: 12px; margin-top: 8px"
              >
                Please select at least one medication.
              </div>

              <p class="mt-4" style="font-size: 13px">
                <strong>IMPORTANT:</strong> You will only be able to receive
                PAEs for molecules in which you have checked and registered
                with.
              </p>

              <!-- ACCOUNT DETAILS -->
              <h6 class="section-title mt-8 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader">
                    Account Details
                  </span>
                  <v-divider class="ml-4"></v-divider>
                </div>
              </h6>

              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    :rules="[...requiredRule, ...emailRules]"
                    density="compact"
                    variant="outlined"
                    label="Email Address (A link will be sent to verify your email address)"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.password"
                    type="password"
                    :rules="[...requiredRule, ...passwordRules]"
                    density="compact"
                    variant="outlined"
                    label="Create Password"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.confirmPassword"
                    type="password"
                    :rules="[...requiredRule, ...confirmPasswordRules]"
                    density="compact"
                    variant="outlined"
                    label="Confirm Password"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                  />
                </v-col>
              </v-row>

              <!-- ACTION BUTTON -->
              <div class="form-actions">
                <div class="mandatory-legend">
                  <span class="mandatory-star">* </span>
                  <span class="theme-color"
                    >Symbol indicates a mandatory field</span
                  >
                </div>

                <v-btn
                  size="small"
                  class="btn-filled theme-bg"
                  rounded="pill"
                  @click="goToNextStep"
                >
                  Next
                </v-btn>
              </div>
            </div>

            <!-- ================= STEP 2 ================= -->
            <div v-if="step === 2">
              <h6 class="section-title mt-5 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader">
                    Prescriber Confirmation
                  </span>
                  <v-divider class="ml-4"></v-divider>
                </div>
              </h6>

              <div>
                <div v-for="med in form.medications" :key="med" class="mb-8">
                  <h6 class="theme-subheader mb-3">
                    Prescriber {{ med }} Confirmation
                  </h6>

                  <v-checkbox
                    v-for="(term, index) in medicationTerms[med]"
                    :key="index"
                    v-model="confirmationChecks[med][index]"
                    :label="term"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />
                </div>

                <div
                  v-if="confirmationError"
                  style="color: red; font-size: 12px; margin-top: 8px"
                >
                  Please accept all terms and conditions before submitting.
                </div>

                <div>
                  <p class="mt-6 mb-6" style="font-size: 14px">
                    By clicking 'Register', I confirm that I am a prescriber
                    appropriately experienced in managing immunomodulatory drugs
                    and that I have read and understand the Healthcare
                    Professional Brochure and agree to comply with all the
                    elements of the Pregnancy Prevention Programme described
                    within it.
                  </p>

                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="custom-field plain-wrapper">
                        <label class="plain-label">Prescriber Name</label>
                        <div class="plain-value">
                          {{ form.signature }}
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="custom-field plain-wrapper">
                        <label class="plain-label">Date</label>
                        <div class="plain-value">
                          {{ formatDate(form.signature_date) }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="form-actions d-flex justify-space-between">
                <v-btn
                  size="small"
                  variant="outlined"
                  class="btn-outline"
                  rounded="pill"
                  @click="goToPreviousStep"
                  :disabled="btndisable"
                >
                  ← Previous
                </v-btn>
                <v-btn
                  size="small"
                  class="btn-filled theme-bg"
                  rounded="pill"
                  @click="submitForm"
                  :disabled="btndisable"
                >
                  Register
                </v-btn>
              </div>
            </div>
          </v-form>
          <v-dialog
            v-model="showConfirmationDialog"
            width="520"
            persistent
            transition="dialog-transition"
            scrim="rgba(0,0,0,0.6)"
          >
            <v-card class="animated-card pa-10 text-center">
              <div class="icon-wrapper mb-6">
                <v-icon
                  icon="mdi-alert-circle"
                  size="70"
                  class="warning-icon"
                ></v-icon>
              </div>

              <h2 class="mb-4 dialog-title">Action Required</h2>

              <p class="dialog-text mb-6">
                You must agree to all required statements before submitting the
                form. Please review the checkboxes and confirm your agreement.
              </p>

              <v-btn
                class="continue-btn"
                rounded="pill"
                size="large"
                @click="showConfirmationDialog = false"
              >
                Continue
              </v-btn>
            </v-card>
          </v-dialog>

          <!-- SUCCESS DIALOG -->
          <v-dialog
            v-model="showSuccessDialog"
            width="680"
            persistent
            scrim="rgba(0,0,0,0.65)"
            transition="dialog-transition"
          >
            <v-card class="success-dialog-card text-center" elevation="6">
              <!-- Icon Section -->
              <div class="success-icon-wrapper">
                <div class="success-circle">
                  <v-icon size="48" class="success-icon"> mdi-check </v-icon>
                </div>
              </div>

              <!-- Title -->
              <h2 class="success-title">Registration is in Progress</h2>

              <!-- Description -->
              <p class="success-description">
                Thank you for registering for the Pathfinder.<br />
                A representative will validate your account and you will receive
                an email confirmation within one working day.
              </p>

              <!-- Divider -->
              <v-divider class="my-6"></v-divider>

              <!-- Action Button -->
              <v-btn
                class="success-login-btn"
                rounded="pill"
                size="large"
                @click="goToLogin()"
              >
                Go to Login
              </v-btn>
            </v-card>
          </v-dialog>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      isFormValid: false,
      medicationError: false,
      loading: false,

      hospitals: [],

      medications: [
        "Lenalidomide",
        "50mg - Thalidomide",
        "Pomalidomide",
        "100mg - Thalidomide Tablet",
      ],

      form: {
        name: "",
        lastname: "",
        reg_no: "",
        job_title: "",
        institution_id: "",
        address: "",
        medications: [],
        email: "",
        password: "",
        confirmPassword: "",
        signature: "",
        signature_date: "",
      },
      confirmationError: false,
      showSuccessDialog: false,
      btndisable: false,

      medicationTerms: {
        Lenalidomide: [
          "I have read and understand the Lenalidomide Healthcare Professional Information Guide.",
          "I comply with all Pregnancy Prevention Programme requirements.",
          "I confirm that lenalidomide treatment will be initiated and monitored under the supervision of a physician experienced in managing immunomodulatory agents.",
          "I understand the maximum prescription lengths: 4 weeks for women of childbearing potential and 12 weeks for all other patients.",
          "I acknowledge the need for a negative pregnancy test (sensitivity ≥25 mIU/mL) before starting treatment for women of childbearing potential.",
        ],
        "50mg - Thalidomide": [
          "I have read and understand the Thalidomide Healthcare Professional Information Guide.",
          "I commit to counseling patients on contraception requirements, including at least one highly effective method during and after therapy.",
          "I will register with the Pregnancy Prevention Programme platform if dispensing lenalidomide as a pharmacist.",
          "I confirm that patients are capable of complying with the Pregnancy Prevention Programme requirements.",
        ],
        Pomalidomide: [
          "I have read and understand the Pomalidomide Healthcare Professional Information Guide.",
          "I have reviewed the risks of second primary malignancies and other key safety information for lenalidomide use.",
        ],
        "100mg - Thalidomide Tablet": [
          "I have read and understand the Thalidomide Healthcare Professional Information Guide.",
          "I will ensure a Prescription Authorisation Form is completed for each initial prescription and provided to the pharmacy.",
          "I will provide patients with the Patient Brochure, Risk Awareness Form, and Patient Pocket Information Card.",
          "I acknowledge the controlled distribution system and prescription limits for lenalidomide.",
        ],
      },

      confirmationChecks: {},
      showConfirmationDialog: false,
    };
  },
  mounted() {
    this.fetchInstitutions();
  },

  watch: {
    step(val) {
      if (val === 2) {
        this.initializeConfirmations();

        // Set prescriber name automatically
        this.form.signature = this.form.name + " " + this.form.lastname;

        // Set current date (DD / MM / YYYY)
        const today = new Date().toISOString().substr(0, 10);

        this.form.signature_date = today;
      }
    },
  },

  computed: {
    allConfirmationsChecked() {
      return this.form.medications.every((med) =>
        this.confirmationChecks[med]?.every((val) => val === true)
      );
    },
    progress() {
      return this.step === 1 ? 50 : 100;
    },

    //field rules
    requiredRule() {
      return [(v) => !!v || "This field is required"];
    },

    emailRules() {
      return [
        (v) => !!v || "Email is required",
        (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
      ];
    },

    passwordRules() {
      return [
        (v) => !!v || "Password required",
        (v) => v.length >= 12 || "Minimum length of 12 characters required",
        (v) => /[A-Z]/.test(v) || "Minimum of 1 uppercase letter required",
        (v) => /\d/.test(v) || "At least 1 number required",
        (v) =>
          /[~!@#$%]/.test(v) ||
          "At least 1 non-alphanumeric character (~!@#$%) required",
      ];
    },

    confirmPasswordRules() {
      return [
        (v) => !!v || "Confirm Password required",
        (v) => v === this.form.password || "Passwords do not match",
      ];
    },
  },

  methods: {
    async fetchInstitutions() {
      try {
        const res = await this.$axios.get("fetchactiveinstitutions");
        console.log("res");
        console.log(res);

        if (res.data.status === "S") {
          this.hospitals = res.data.institutions;
        }
      } catch (error) {
        this.hospitals = [];
      }
    },
    initializeConfirmations() {
      this.form.medications.forEach((med) => {
        if (!this.confirmationChecks[med]) {
          this.confirmationChecks[med] = this.medicationTerms[med].map(
            () => false
          );
        }
      });
    },
    populateAddress(id) {
      const hospital = this.hospitals.find((h) => h.id === id);
      this.form.address = hospital ? hospital.address : "";
    },

    async goToNextStep() {
      this.medicationError = this.form.medications.length === 0;

      const { valid } = await this.$refs.formRef.validate();

      if (!valid || this.medicationError) return;

      this.step = 2;
    },
    goToPreviousStep() {
      this.resetConfirmation();
      this.step = 1;
    },
    resetConfirmation() {
      // Clear all confirmation checks
      this.confirmationChecks = {};

      // Also reset error state if any
      this.confirmationError = false;
    },

    goToLogin() {
      this.btndisable = true;
      this.showSuccessDialog = false;
      this.$router.push({ name: "login" });
    },

    submitForm() {
      if (!this.allConfirmationsChecked) {
        this.showConfirmationDialog = true;
        return;
      }

      this.confirmationError = false;
      this.loading = true;

      const payload = {
        name: this.form.name,
        lastname: this.form.lastname,
        reg_no: this.form.reg_no,
        job_title: this.form.job_title,
        institution_id: this.form.institution_id,
        address: this.form.address,
        medications: this.form.medications,
        email: this.form.email,
        password: this.form.password,
        signature: this.form.signature,
        signature_date: this.form.signature_date,
      };

      this.$axios
        .post("prescriber_register", payload)
        .then((res) => {
          if (res.data.status == "E") {
            this.$toast.error(res.data.message);
            this.loading = false;
          } else {
            this.showSuccessDialog = true;
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.error(
            err?.response?.data?.message || "Something went wrong"
          );
        });
    },

    returnToSelection() {
      this.$emit("category-selected", null);
    },
  },
};
</script>

<style scoped>
/* PAGE BACKGROUND */
.register-page {
  margin: 15px;
  padding-top: 40px;
  width: 60vw;
}

/* PROGRESS BAR */
.progress-wrapper {
  max-width: 1200px;
  background: var(--theme-gradient);
  padding: 10px 60px;
  border-radius: 20px 20px 0 0;
  color: white;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* MAIN CARD */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 0 20px 60px 20px; */
}

.form-card {
  background: #f4f4f4;
  border-radius: 28px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  height: 80vh;
  overflow-y: auto;
}

/* HEADER */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 16px;
}

/* BUTTON STYLES */
.btn-outline {
  border: 2px solid var(--theme-color) !important;
  color: var(--theme-color) !important;
  font-weight: 600;
  text-transform: none;
}

.btn-filled {
  color: white;
  font-weight: 600;
  text-transform: none;
}

/* SECTION TITLE */
.section-title {
  font-weight: 600;
  color: #555;
}

/* INPUT FIELD CUSTOM */
.custom-field :deep(.v-field) {
  border-radius: 18px !important;
  background: white;
}

/* ADDITIONAL LOCATION LINK */
.additional-location {
  margin-top: 20px;
  font-size: 14px;
  color: #6c63ff;
  cursor: pointer;
}

.additional-location:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
}

.section-text {
  min-width: 200px;
}

.custom-field :deep(.v-field) {
  border-radius: 18px !important;
  background: white;
}

.custom-field :deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

.plain-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 56px;
  padding: 12px;
  background: white;
  border-radius: 12px;
}

.plain-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.plain-value {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}
/* Dialog Card Animation */
.animated-card {
  border-radius: 24px;
  backdrop-filter: blur(10px);
  background: white;
  animation: cardPop 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Card entrance */
@keyframes cardPop {
  0% {
    transform: scale(0.7) translateY(40px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Icon Pulse */
.warning-icon {
  color: #ff3b3b;
  animation: pulse 1.5s infinite;
}

/* Icon floating circle */
.icon-wrapper {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(255, 59, 59, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatIn 0.5s ease;
}

/* Pulse effect */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
  }
}

/* Float entrance */
@keyframes floatIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Text styling */
.dialog-title {
  font-weight: 600;
  color: #222;
}

.dialog-text {
  font-size: 14px;
  color: #555;
}

/* Button styling */
.continue-btn {
  background: linear-gradient(135deg, #ff3b3b, #d32f2f);
  color: white;
  font-weight: 600;
  padding: 0 40px;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 59, 59, 0.3);
}

/* Simple Animated Mandatory Legend */
.mandatory-legend {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
  animation: fadeSlideIn 0.4s ease;
  font-size: 12px;
  font-style: italic;
}

/* Animated star */
.mandatory-star {
  color: var(--required-color);
  font-weight: bold;
  font-size: 15px;
  animation: pulseStar 1.5s infinite ease-in-out;
}

/* Smooth appearance */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Soft pulse animation */
@keyframes pulseStar {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.success-dialog {
  border-radius: 28px;
}

.success-circle {
  width: 110px;
  height: 110px;
  border: 3px solid #94c11f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.success-title {
  font-size: 32px;
  font-weight: 500;
  color: #4a4a4a;
}

.success-text {
  font-size: 18px;
  color: #6c6c6c;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto;
}

.login-btn {
  background-color: #0e5a74;
  color: white;
  min-width: 200px;
  height: 50px;
  font-size: 16px;
}

/* SUCCESS DIALOG CARD */
.success-dialog-card {
  border-radius: 32px;
  padding: 60px 50px;
  background: white;
  animation: popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Entrance Animation */
@keyframes popIn {
  0% {
    transform: scale(0.85) translateY(40px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* ICON WRAPPER */
.success-icon-wrapper {
  margin-bottom: 30px;
}

.success-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--theme-color);
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: scalePulse 1.8s infinite ease-in-out;
}

.success-icon {
  color: var(--theme-color);
}

/* Subtle pulse animation */
@keyframes scalePulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* TITLE */
.success-title {
  font-size: 30px;
  font-weight: 600;
  color: var(--theme-color);
  margin-bottom: 18px;
}

/* DESCRIPTION */
.success-description {
  font-size: 16px;
  color: #5f6368;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
}

/* LOGIN BUTTON */
.success-login-btn {
  background: var(--theme-gradient);
  color: white;
  font-weight: 600;
  padding: 0 50px;
  height: 52px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.success-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}
</style>
