<template>
  <div class="register-page pa-0">
    <!-- Progress Header -->
    <div class="progress-wrapper">
      <div class="progress-content">
        <span>Progress</span>

        <v-progress-linear
          :model-value="progress"
          height="6"
          rounded
          class="progress-bar"
        ></v-progress-linear>

        <span>Complete</span>
      </div>
    </div>

    <!-- Main Card -->
    <div>
      <div class="content-wrapper">
        <v-card class="form-card" elevation="0">
          <!-- Header -->
          <div class="form-header">
            <h4>Prescriber registration form</h4>

            <div class="header-actions">
              <v-btn
                variant="outlined"
                class="btn-outline"
                rounded="pill"
                @click="$router.back()"
              >
                ← Return to selection
              </v-btn>

              <v-btn class="btn-filled theme-bg" rounded="pill"> Prescriber </v-btn>
            </div>
          </div>

          <!-- STEP 1 -->
          <div v-if="step === 1">
            <h6 class="section-title mt-5 mb-6">
              <div class="d-flex align-center">
                <span class="section-text">Prescriber details</span>
                <v-divider class="ml-4"></v-divider>
              </div>
            </h6>

            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.firstName"
                  density="compact"
                  variant="outlined"
                  label="* First name"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.institution"
                  density="compact"
                  variant="outlined"
                  label="* Institution name"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.surname"
                  density="compact"
                  variant="outlined"
                  label="* Surname"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  density="compact"
                  variant="outlined"
                  label="* Phone number"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.registrationNumber"
                  density="compact"
                  variant="outlined"
                  label="* GPhC / PSNI registration number"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea
                  v-model="form.address"
                  density="compact"
                  variant="outlined"
                  rows="2"
                  label="* Address"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.institutionType"
                  :items="institutionTypes"
                  density="compact"
                  variant="outlined"
                  label="* Institution type"
                  class="custom-field"
                />
              </v-col>
            </v-row>
          </div>

          <!-- STEP 2 -->
          <div v-if="step === 2">
            <h6 class="section-title mt-5 mb-6">
              <div class="d-flex align-center">
                <span class="section-text">Account details</span>
                <v-divider class="ml-4"></v-divider>
              </div>
            </h6>

            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  density="compact"
                  variant="outlined"
                  label="* Email address (verification link will be sent)"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.password"
                  type="password"
                  density="compact"
                  variant="outlined"
                  label="* Create password"
                  class="custom-field"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.confirmPassword"
                  type="password"
                  density="compact"
                  variant="outlined"
                  label="* Confirm password"
                  class="custom-field"
                />
              </v-col>
            </v-row>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="form-actions">
            <v-btn v-if="step > 1" variant="text" @click="previousStep">
              Back
            </v-btn>

            <v-btn class="btn-filled theme-bg" rounded="pill" @click="nextStep">
              {{ step === 2 ? "Submit" : "Next →" }}
            </v-btn>
          </div>
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

      institutionTypes: [
        'Hospital',
        'Community Pharmacy',
        'Clinic'
      ],

      form: {
        firstName: '',
        surname: '',
        institution: '',
        phone: '',
        registrationNumber: '',
        address: '',
        institutionType: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },

  computed: {
    progress() {
      return this.step === 1 ? 50 : 100
    }
  },

  methods: {
    nextStep() {
      if (this.step < 2) {
        this.step++
      } else {
        this.submitForm()
      }
    },

    previousStep() {
      if (this.step > 1) {
        this.step--
      }
    },

    submitForm() {
      console.log('Form submitted:', this.form)
      // API call here
    }
  }
}
</script>

<style scoped>
/* PAGE BACKGROUND */
.register-page {
  margin: 20px;
  padding-top: 40px;
  width: 70vw;
}

/* PROGRESS BAR */
.progress-wrapper {
  max-width: 1200px;
  background: linear-gradient(90deg, #6c63ff, #7c4dff);
  padding: 10px 60px;
  border-radius: 20px 20px 0 0;
  color: white;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.progress-bar {
  flex: 1;
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
  border: 2px solid #6c63ff !important;
  color: #6c63ff !important;
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
  margin-top: 40px;
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
</style>
