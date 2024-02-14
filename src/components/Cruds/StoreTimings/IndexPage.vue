<template>
  <div class="main-20">
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar position-relative"
    >
      <page-title
        class="col-md-3"
        :heading="$t('store_timings')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-text-field
              rounded
              density="compact"
              variant="outlined"
              elevation="24"
              v-bind="props"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>
      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{ name: 'store-timing-amend' }"
              style="color: white"
            >
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="store_timings"
      :search="search"
      :loading="initval"
      v-model:expanded="expanded"
      show-expand
      item-value="name"
      v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
    >
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="child_table p-4">
            <v-data-table
              :headers="child_headers"
              :items="item.selectable.store_timings"
              item-value="name"
              v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
              class="child_table"
            >
              <template v-slot:item="props">
                <tr class="vdatatable_tbody">
                  <td>{{ props.item.selectable.week_day }}</td>
                  <td>
                    {{ props.item.selectable.from_time }}
                    {{ props.item.selectable.from_meridiem }}
                  </td>
                  <td>
                    {{ props.item.selectable.to_time }}
                    {{ props.item.selectable.to_meridiem }}
                  </td>
                  <td>
                    <v-chip
                      v-bind:color="[
                        props.item.selectable.is_holiday == 1
                          ? 'success'
                          : 'warning',
                      ]"
                      variant="outlined"
                    >
                      <span
                        v-if="props.item.selectable.is_holiday == 1"
                        class="spanactivesize"
                        >{{ $t("Yes") }}</span
                      >
                      <span
                        v-if="props.item.selectable.is_holiday == 0"
                        class="spanactivesize"
                        >{{ $t("No") }}</span
                      >
                    </v-chip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </td>
        </tr>
      </template>
      <!-- <template v-slot:item="{ props, columns }">
        <tr class="vdatatable_tbody parent_row">
          <td class="text-start" :colspan="columns.length">
            More info about {{ props.item.selectable.name }}
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-if="isExpanded == false" v-on="on">
                  <v-icon class="text-primary">mdi mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn icon v-else>
                  <v-icon class="text-danger">mdi mdi-minus-circle</v-icon>
                </v-btn>
              </template>
              <span>{{ $t("view_extend_timing_details") }}</span>
            </v-tooltip>
          </td>
          <td>{{ props.item.selectable.name }}</td>
          <td>{{ props.item.selectable.email }}</td>
          <td>{{ props.item.selectable.approval_status }}</td>
          <td>{{ props.item.selectable.website }}</td>

          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'store-timing-amend',
                query: { slug: props.item.selectable.slug },
              }"
            >
              <v-tooltip :text="this.$t('edit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-on="on"
                    small
                    class="mr-2 edit_btn icon_size"
                    v-bind="props"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </router-link>
            <span @click="deleteItem(props.item.selectable.id)">
              <v-tooltip :text="this.$t('delete')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    class="delete_btn icon_size"
                    v-bind="props"
                    v-on="on"
                    small
                    type="button"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </span>
          </td>
        </tr>
      </template> -->
    </v-data-table>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
    <ConfirmDialog
      :show="showdeleteDialog"
      :cancel="cancel"
      :confirm="confirm"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_record')"
    />
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: {
    PageTitle,
    ConfirmDialog,
  },
  data: () => ({
    store_timings: [],
    showdeleteDialog: false,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    initval: false,
    expanded: [],
    singleExpand: false,
    isExpanded: false,
    google_icon: {
      icon_name: "punch_clock",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "store_timing_id",
        },
        {
          title: this.$t("name_en"),
          key: "name",
        },
        {
          title: this.$t("email"),
          key: "email",
        },
        {
          title: this.$t("status_en"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("approval_en"),
          key: "approval_status",
        },
        {
          title: this.$t("action_en"),
          align: "center",
          key: "action",
        },
      ];
    },
    child_headers() {
      return [
        {
          title: this.$t("week_day"),
          key: "week_day",
        },
        {
          title: this.$t("from_time"),
          key: "from_time",
        },
        {
          title: this.$t("to_time"),
          key: "to_time",
        },
        {
          title: this.$t("is_holiday"),
          key: "is_holiday",
        },
      ];
    },
  },
  mounted() {
    this.fetchStoreTimings();
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "Approved":
          return "green";
        case "In Review":
          return "orange";
        case "Rejected":
          return "red";
        default:
          return "";
      }
    },
    cancel() {
      this.showdeleteDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showdeleteDialog = false;
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    fetchStoreTimings() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "get-store-timings")
        .then((res) => {
          this.initval = false;
          let store_timing = [];
          res.data.store_timings.map((ele) => {
            if (ele.header_id == ele.id) {
              console.log(ele);
              store_timing.push(ele);
            }
          });
          this.store_timings = store_timing;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },
    deleteConfirm() {
      this.deletestoretimings(this.delete_id);
    },
    deleteItem($id) {
      this.delete_id = $id;
      this.showdeleteDialog = true;
    },
    deletestoretimings(id) {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete-store-timings/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchStoreTimings();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
    },
    updateStoreTimingStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    statusUpdate() {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL_ADMIN + "update_system_param_status",
          {
            id: this.status_id,
          }
        )
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchStoreTimings();
            this.$eventBus.$emit("app_logo");
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
.v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
}

.v-btn:not(.v-btn--round).v-size--small {
  min-width: 90px !important;
}
.parent_row {
  background: #eeeeee;
}
.child_row {
  background: #ffffff;
}

.child_table {
  border: 2px solid #8080808a !important;
  padding: 5px;
}
</style>