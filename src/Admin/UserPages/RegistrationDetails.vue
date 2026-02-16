<template>
  <v-container fluid class="page-wrapper">
    <!-- Back section -->
    <button class="btn-outline" @click="goBackToDetails()">Back</button>
    <!-- Search Bar -->

    <!-- Data Table Card -->
    <v-card class="table-card pa-4">
      <h2 class="heading">Registration Details</h2>
      {{ selectedItem }}
    </v-card>
  </v-container>
</template>
<script>
export default {
  props: ["selectedItem"],
  data() {
    return {
      stats: [
        { label: "Total patients", value: 58 },
        { label: "Active patients", value: 9 },
        { label: "Overdue PAF", value: 7 },
        { label: "Rejected PAF", value: 0 },
      ],
    };
  },

  computed: {},

  mounted() {
    // You can fetch or initialize data here if needed
    console.log("PatientsTable component mounted");
  },

  created() {
    // Initialization logic here
    console.log("PatientsTable component created");
  },
  methods: {
    goBackToDetails() {
      // alert();
      this.$emit("back", false);
      // this.$router.push({ name: 'PatientDetails', params: { id: item.id } })
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
