<template>
  <v-container fluid class="page-wrapper background">
    <div class="main-section">
      <!-- Stats section -->
      <stats-page :stats="stats" />
      <!-- Stats section -->
      <!-- Search Bar -->
      <div class="search-wrapper">
        <v-text-field
          v-model="search"
          placeholder="Search patient ID, prescriber name, initials or date of birth..."
          append-inner-icon="mdi-magnify"
          variant="solo"
          flat
          hide-details
          density="comfortable"
          class="search-field"
        />
      </div>
      <!-- Data Table Card -->
      <v-card class="table-card pa-4">
        <v-data-table
          :headers="headers"
          :items="filteredItems"
          item-key="id"
          class="custom-table mt-3"
          hide-default-footer
        >
          <template #item="{ item }">
            <tr>
              <td>
                <a href="#">{{ item.id }}</a>
              </td>
              <td>{{ item.prescriber }}</td>
              <td>{{ item.initials }}</td>
              <td>{{ item.gender }}</td>
              <td>{{ item.dob }}</td>
              <td>{{ item.indication }}</td>
              <td>{{ item.molecule }}</td>
              <td>
                <span
                  :class="[
                    'status-text',
                    item.status === 'Submitted'
                      ? 'status-submitted'
                      : 'status-rejected',
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td>
                <v-btn icon size="x-small" class="pdf-btn">
                  <v-icon size="18">mdi-arrow-down</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>
<script>
export default {
  name: "PatientsTable",
  data() {
    return {
      stats: [
        { label: "Total patients", value: 58 },
        { label: "Active patients", value: 9 },
        { label: "Overdue PAF", value: 7 },
        { label: "Rejected PAF", value: 0 },
      ],
      search: "",
      headers: [
        { title: "Patient ID", key: "id" },
        { title: "Prescriber", key: "prescriber" },
        { title: "Initials", key: "initials" },
        { title: "Gender", key: "gender" },
        { title: "DOB", key: "dob" },
        { title: "Indication", key: "indication" },
        { title: "Molecule", key: "molecule" },
        { title: "Status", key: "status" },
        { title: "PDF", key: "pdf", sortable: false },
      ],
      items: [
        {
          id: "WCBPAC9708:12001",
          prescriber: "Nikka Calma",
          initials: "AC",
          gender: "Female",
          dob: "12/08/1997",
          indication: "Multiple Myeloma",
          molecule: "Linalidomide",
          status: "Submitted",
        },
        {
          id: "WCBPAC9709:12001",
          prescriber: "Nikka Calma",
          initials: "AB",
          gender: "Male",
          dob: "12/09/2000",
          indication: "Relapsed & Refractory Multiple Myeloma",
          molecule: "50mg - Thalidomide",
          status: "Not submitted",
        },
      ],
    };
  },

  computed: {
    filteredItems() {
      if (!this.search) return this.items;
      const searchLower = this.search.toLowerCase();
      return this.items.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchLower)
      );
    },
  },

  mounted() {
    // You can fetch or initialize data here if needed
    console.log("PatientsTable component mounted");
  },

  created() {
    // Initialization logic here
    console.log("PatientsTable component created");
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
