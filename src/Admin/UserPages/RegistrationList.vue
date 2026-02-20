<template>
  <v-container fluid class="page-wrapper background">
    <content-loader v-if="loader"></content-loader>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <div class="main-section">
      <div>
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
            :loading="initval"
            loading-text="Loading data..."
            class="custom-table mt-3"
            hide-default-footer
          >
            <template #item="{ item }">
              <tr>
                <td>
                  {{ item.id }}
                </td>
                <td>
                  <a href="#" @click.prevent="goToDetailsPage(item)"
                    >{{ item.salutation }}.{{ item.name }}</a
                  >
                </td>

                <td>{{ item.gender }}</td>
                <td>{{ formatDate(item.dob) }}</td>
                <td>{{ item.rolename }}</td>
                <!-- <td>{{ item.description }}</td> -->
                <td>
                  <v-chip
                    @click="changeStatus(item.id)"
                    size="small"
                    variant="flat"
                    :class="
                      item.status === 1 ? 'status-approved' : 'status-warning'
                    "
                    class="text-white"
                  >
                    {{ item.status == 1 ? "Active" : "Inactive" }}
                  </v-chip>
                </td>
                <td>
                  <v-chip
                    size="small"
                    variant="flat"
                    class="text-white"
                    :class="getStatusClass(item.reg_status)"
                  >
                    {{ item.reg_status }}
                  </v-chip>
                </td>
                <!-- <td>
                  <v-btn icon size="x-small" class="pdf-btn">
                    <v-icon size="18">mdi-arrow-down</v-icon>
                  </v-btn>
                </td> -->
                <td class="d-flex align-center">
                  <router-link
                    :to="{
                      name: 'user_creation',
                      query: { slug: item.slug },
                    }"
                  >
                    <v-tooltip :text="this.$t('edit')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-pencil-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </router-link>
                  <div @click="redirectView(item.slug)">
                    <v-tooltip :text="this.$t('view')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-eye</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
      <!-- <div v-else>
        <RegistrationDetails :selectedId="selectedId" @back="handleBackClick" />
      </div> -->
    </div>
  </v-container>
</template>
<script>
import RegistrationDetails from "./RegistrationDetails.vue";
export default {
  components: { RegistrationDetails },
  name: "PatientsTable",
  data() {
    return {
      dialogMessage: "",
      dialogTitle: "",
      selectedId: "",
      stats: [
        { label: "Total patients", value: 58 },
        { label: "Active patients", value: 9 },
        { label: "Overdue PAF", value: 7 },
        { label: "Rejected PAF", value: 0 },
      ],
      search: "",
      showDetails: false,
      reg_list: [],
      loader: false,
      initval: false,
      headers: [
        { title: "Patient ID", key: "id" },
        { title: "Prescriber", key: "prescriber" },
        // { title: "Initials", key: "initials" },
        { title: "Gender", key: "gender" },
        { title: "DOB", key: "dob" },
        { title: "Indication", key: "indication" },
        // { title: "Molecule", key: "molecule" },
        { title: "Status", key: "status" },
        { title: "Reg Status", key: "reg_status" },
        { title: "Actions", key: "actions", sortable: false },
      ],
    };
  },

  computed: {
    filteredItems() {
      if (!this.search) return this.reg_list;
      const searchLower = this.search.toLowerCase();
      return this.reg_list.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchLower)
      );
    },
  },

  mounted() {},

  created() {
    this.initialize();
  },
  methods: {
    getStatusClass(status) {
      if (status === "Awaiting Approval") {
        return "status-warning";
      } else if (status === "Approved") {
        return "status-approved";
      } else if (status === "Rejected") {
        return "status-rejected";
      }
      return "";
    },
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    initialize() {
      this.initval = true;
      this.$axios
        .get("fetch_reg_list")
        .then((res) => {
          console.log("res.data");
          console.log(res.data.reg_list);
          this.reg_list = res.data.reg_list;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
        });
    },
    goToDetailsPage(item) {
      console.log("item");
      console.log(item.slug);
      this.$router.push({
        name: "registration_details",
        query: { slug: item.slug },
      });
      // this.showDetails = true;
      // this.selectedId = id;
    },
    async changeStatus(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to change the status of this user ?"
      );

      if (!result) return;
      this.$axios
        .post("updateuserstatus", {
          id: id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.initval = true;
            this.initialize();
          } else if (res.data.status == "E") {
            this.$toast.success(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    redirectView(slug) {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: slug,
          from: "view",
        },
      });
    },
    handleBackClick(value) {
      this.showDetails = value;
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
