
      <template>
  <div>
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-3"
        :heading="$t('users')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-text-field
              dense
              density="compact"
              v-on="on"
              variant="outlined"
              v-model="search"
              append-icon="search"
              label="Search"
              class="srch_bar"
              small
              hide-details
            ></v-text-field>
          </template>
          <span>{{ $t("search") }}</span>
        </v-tooltip>
      </div>
      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link :to="{ name: 'user_creation' }" style="color: white">
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
      :items="allUsers"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <span v-if="props.item.selectable.full_name">
              {{ props.item.selectable.full_name }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.email">
              {{ props.item.selectable.email }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.phone">
              {{ props.item.selectable.phone }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.postcode">
              {{ props.item.selectable.postcode }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.rolename">
              {{ props.item.selectable.role.role_display_name }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <v-btn
              class="hover_shine btn mr-2"
              :disabled="isDisabled"
              size="small"
              @click="changeStatus(props.item.selectable.id)"
              v-bind:color="[
                props.item.selectable.status == 1 ? 'success' : 'warning',
              ]"
            >
              <span
                v-if="props.item.selectable.status == 1"
                class="spanactivesize"
                >{{ $t("active") }}</span
              >
              <span
                v-if="props.item.selectable.status == 0"
                class="spanactivesize"
                >{{ $t("inactive") }}</span
              >
            </v-btn>
          </td>
          <td>
            <router-link
              :to="{
                name: 'user_creation',
                query: { slug: props.item.selectable.slug },
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
          </td>
        </tr>
      </template>
    </v-data-table>
    <ConfirmDialog
      :show="showStatusDialog"
      :cancel="cancelStatus"
      :confirm="confirmStatus"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('status_change')"
    />
    <ConfirmDialog
      :show="showConfirmDialog"
      :cancel="cancel"
      :confirm="confirm"
      :id="delete_id"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('delete_confirmation')"
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
    allUsers: [],
    initval: false,
    status_id: null,
    isDisabled: false,
    showConfirmDialog: false,
    delete_id: "",
    headers: [
      {
        title: "Name",
        align: "left",
        key: "full_name",
      },
      {
        title: "Email ID",
        key: "email",
      },
      {
        title: "Phone",
        key: "phone",
      },
      {
        title: "Postcode",
        key: "postcode",
      },

      {
        title: "Role",
        key: "role_display_name",
      },
      {
        title: "Status",
        align: "left",
        sortable: false,
        key: "status",
      },
      {
        title: "Actions",
        key: "",
        align: "left",
      },
    ],
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    user: "",
    showStatusDialog: false,
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchUsers();
  },
  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm(id) {
      this.deleteConfirm(id);
      this.showConfirmDialog = false;
    },
    deleteItem(template_id) {
      this.delete_id = template_id;
      this.showConfirmDialog = true;
    },
    deleteConfirm(id) {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "delete_draft_user/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchUsers();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchUsers();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.initval = true;
      this.showStatusDialog = false;
      this.statusUpdate();
    },
    fetchUsers() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchuser")
        .then((res) => {
          this.allUsers = res.data.usersdata;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },
    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },
    routereditusers(slug, empno, role) {
      if (role) {
        return;
      }
      if (empno != null) {
        this.$router.push({
          name: "users.view",
          query: {
            slug: slug,
            view: "userview",
          },
        });
      } else {
        this.$router.push({
          name: "employee_creation",
          query: {
            slug: slug,
            pathname: "userview",
          },
        });
      }
    },

    statusUpdate() {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updateuserstatus", {
          id: this.status_id,
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
            this.fetchUsers();
          } else if (res.data.status == "E") {
            this.$toast.success(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchUsers();
          }
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
/* .v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
} */

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.userindexcodechip:hover {
  cursor: pointer;
}

.usernamehoverstyle:hover {
  /* cursor: pointer; */
  font-weight: 500;
}

.usernamehoverstyle {
  font-weight: 500;
  color: rgb(71, 174, 110);
}

.delete_icon_size {
  font-size: 20px !important;
}
</style>