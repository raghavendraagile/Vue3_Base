
<template>
  <div>
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-3"
        :heading="$t('member_list')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4 row py-5 pl-5 align-items-center">
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
    </div>
    <v-tabs v-model="tab" color="blue" class="row m-0 col-md-12">
      <v-tab value="one">{{ $t("tradies") }}</v-tab>
      <v-tab value="two">{{ $t("blacklist_tradies") }}</v-tab>
      <v-tab
        value="three"
        v-if="
          logged_in_userdetails.role &&
          (logged_in_userdetails.role.rolename == 'SuperUser' ||
            logged_in_userdetails.role.rolename == 'Admin')
        "
        >{{ $t("principal") }}</v-tab
      >
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <!-- tab one starts LIST OF ALL TRADIES -->
        <v-window-item value="one">
          <!-- <div class="col-md-4 row py-5 pl-5 align-items-center">
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
          </div>-->
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
                  <span v-if="props.item.selectable.full_name">{{
                    props.item.selectable.full_name
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.selectable.email">{{
                    props.item.selectable.email
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.selectable.phone">{{
                    props.item.selectable.phone
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <!-- @click="changeStatus(props.item.selectable.id)" -->
                  <v-btn
                    v-if="logged_in_userdetails.rolename == 'Principal'"
                    class="hover_shine status_btn btn mr-2"
                    :disabled="isDisabled"
                    size="small"
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

                  <v-btn
                    v-else
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
                      name: 'view-licenses',
                      query: {
                        slug: props.item.selectable.slug,
                      },
                    }"
                  >
                    <v-tooltip
                      :text="this.$t('view_license')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-eye-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </router-link>
                  <!-- blacklist tradie dialog starts -->
                  <!-- {{ props.item.selectable }} -->

                  <!-- dialog1 -->

                  <span
                    v-if="logged_in_userdetails.rolename != 'Principal'"
                    @click="blacklistDialog(props.item.selectable)"
                  >
                    <v-tooltip
                      :text="this.$t('blacklist_user')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          type="button"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-account-minus</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </span>

                  <!-- blacklist tradie dialog ends -->
                </td>
              </tr>
            </template>
          </v-data-table>

          <ConfirmDialog
            :show="showConfirmDialog"
            :cancel="cancel"
            :confirm="confirm"
            :id="delete_id"
            v-bind:title="$t('confirm')"
            v-bind:description="$t('delete_confirmation')"
          />
        </v-window-item>
        <!-- tab one ends LIST OF ALL TRADIES-->
        <!-- tab two starts LIST OF BLACKLISTED TRADIES-->
        <v-window-item value="two">
          <!-- <div class="col-md-4 row py-5 pl-5 align-items-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  density="compact"
                  v-on="on"
                  variant="outlined"
                  v-model="search1"
                  append-icon="search"
                  label="Search"
                  class="srch_bar"
                  small
                  hide-details
                ></v-text-field>
              </template>
              <span>{{ $t("search") }}</span>
            </v-tooltip>
          </div>-->
          <v-data-table
            :headers="headersblacklist"
            :items="blacklistUsers"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :footer-props="{
              'items-per-page-text': $t('rows_per_page'),
            }"
          >
            <template v-slot:item="props">
              <tr class>
                <td>
                  <span v-if="props.item.selectable.full_name">{{
                    props.item.selectable.full_name
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.selectable.email">{{
                    props.item.selectable.email
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.selectable.phone">{{
                    props.item.selectable.phone
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td class="reasonforblacklistclass">
                  <span v-if="props.item.selectable.blacklist_comments">{{
                    props.item.selectable.blacklist_comments
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <!-- @click="changeStatus(props.item.selectable.id)" -->
                  <v-btn
                    class="hover_shine btn mr-2"
                    :disabled="isDisabled"
                    size="small"
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
                  <!-- <router-link
                    :to="{
                      name: 'view-licenses',
                      query: {
                        slug: props.item.selectable.slug,
                      },
                    }"
                  >
                    <v-tooltip
                      :text="this.$t('view_license')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-eye-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </router-link> -->
                  <span
                    v-if="logged_in_userdetails.rolename != 'Principal'"
                    @click="whitelistDialog(props.item.selectable)"
                  >
                    <v-tooltip
                      :text="this.$t('whitelist_user')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          type="button"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-account-check</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-window-item>
        <!-- tab two ends LIST OF BLACKLISTED TRADIES-->
        <!-- tab three starts LIST OF PRINCIPALS-->
        <v-window-item value="three">
          <!-- <div class="col-md-4 row py-5 pl-5 align-items-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  density="compact"
                  v-on="on"
                  variant="outlined"
                  v-model="search1"
                  append-icon="search"
                  label="Search"
                  class="srch_bar"
                  small
                  hide-details
                ></v-text-field>
              </template>
              <span>{{ $t("search") }}</span>
            </v-tooltip>
          </div>-->
          <v-data-table
            :headers="headers"
            :items="principalUsers"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :footer-props="{
              'items-per-page-text': $t('rows_per_page'),
            }"
          >
            <template v-slot:item="props">
              <tr class>
                <td>
                  <span v-if="props.item.selectable.full_name">{{
                    props.item.selectable.full_name
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.selectable.email">{{
                    props.item.selectable.email
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.selectable.phone">{{
                    props.item.selectable.phone
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <v-btn
                    class="hover_shine btn mr-2"
                    :disabled="isDisabled"
                    @click="changeStatus(props.item.selectable.id)"
                    size="small"
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
                      name: 'view-my-profile',
                      query: {
                        slug: props.item.selectable.slug,
                        from: 'view_only',
                      },
                    }"
                  >
                    <v-tooltip
                      :text="this.$t('view_member_profile')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-eye-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </router-link>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-window-item>
        <!-- tab three ends LIST OF PRINCIPALS-->
      </v-window>
      <ConfirmDialog
        :show="showStatusDialog"
        :cancel="cancelStatus"
        :confirm="confirmStatus"
        v-bind:title="$t('confirm')"
        v-bind:description="$t('status_change')"
      />
    </v-card-text>
  </div>

  <v-dialog persistent v-model="dialog1" width="500px">
    <v-card class="rounded-lg">
      <v-card-text class="mx-0 p-0 rounded-xl">
        <div class="py-3 mb-2 d-flex justify-content-between">
          <h5 color="success" class="px-5">{{ $t("blacklist_user") }}</h5>
          <v-tooltip :text="$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon @click="close" v-bind="props" class="mr-2" v-on="on"
                >mdi-close</v-icon
              >
            </template>
          </v-tooltip>
        </div>
        <div class="px-3">
          <v-form ref="form" lazy-validation v-model="valid">
            <v-tooltip
              :text="this.$t('reason_for_blacklist')"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-textarea
                  rows="3"
                  :rules="fieldRules"
                  v-model="blacklist_reason"
                  v-bind="props"
                  variant="outlined"
                  density="compact"
                  class="pt-4"
                  maxlength="200"
                  v-bind:label="$t('reason_for_blacklist')"
                  counter="true"
                  required
                ></v-textarea>
              </template>
            </v-tooltip>
          </v-form>
        </div>
      </v-card-text>
      <v-card-actions class="justify-content-end">
        <div class="text-center">
          <v-tooltip :text="$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                :disabled="isDisabled"
                v-bind="props"
                size="small"
                class="cancel mr-2"
                @click="close()"
                >{{ $t("cancel") }}</v-btn
              >
            </template>
          </v-tooltip>
        </div>
        <v-tooltip :text="$t('blacklist_user')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              :loading="isDisabled"
              :disabled="isDisabled"
              size="small"
              v-bind="props"
              class="bg-red-accent-2 mr-2"
              @click="blacklistUser(user_details.id)"
              >{{ $t("blacklist_user") }}</v-btn
            >
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- whitelist tradie dialog starts -->
  <v-dialog v-model="dialog2" width="500px">
    <v-card class="rounded-lg">
      <v-card-text class="mx-0 p-0">
        <div class="py-3 mb-2 d-flex justify-content-between">
          <h5 color="success" class="px-5">{{ $t("whitelist_user") }}</h5>
          <v-tooltip :text="$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon @click="close" v-bind="props" class="mr-2" v-on="on"
                >mdi-close</v-icon
              >
            </template>
          </v-tooltip>
        </div>
        <div class="px-3">
          <v-form ref="form">
            <v-tooltip
              :text="this.$t('reason_for_whitelist')"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-textarea
                  rows="3"
                  v-model="blacklist_reason"
                  v-bind="props"
                  variant="outlined"
                  density="compact"
                  class="pt-4"
                  maxlength="200"
                  counter="true"
                  v-bind:label="$t('reason_for_whitelist')"
                  required
                ></v-textarea>
              </template>
            </v-tooltip>
          </v-form>
        </div>
      </v-card-text>
      <v-card-actions class="justify-content-end">
        <div class="text-center">
          <v-tooltip :text="$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-on="on"
                size="small"
                v-bind="props"
                :disabled="isDisabled"
                class="cancel mr-2"
                color="cancel"
                @click="close"
                >{{ $t("cancel") }}</v-btn
              >
            </template>
          </v-tooltip>
        </div>
        <v-tooltip :text="this.$t('whitelist_user')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              :loading="isDisabled"
              :disabled="isDisabled"
              v-bind="props"
              size="small"
              class="bg-blue"
              @click="whitelistUser(user_details.id)"
              >{{ $t("whitelist_user") }}</v-btn
            >
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- whitelist tradie dialog ends -->
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
    blacklistUsers: [],
    principalUsers: [],
    initval: false,
    status_id: null,
    dialog1: false,
    dialog2: false,
    isDisabled: false,
    showConfirmDialog: false,
    delete_id: "",
    user_details: "",
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
    headersblacklist: [
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
        title: "Reason for Blacklisted",
        align: "left",
        sortable: false,
        key: "blacklist_comments",
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
    search1: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    user: "",
    showStatusDialog: false,
    blacklist_reason: "",
    tab: null,
    logged_in_userdetails: [],
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.logged_in_userdetails = JSON.parse(localStorage.getItem("user_data"));
    console.log("this.user");
    console.log(this.logged_in_userdetails);
    this.fetchUsers();
    this.fetchBlackListUsers();
    this.fetchPrincipalUsers();
  },
  methods: {
    blacklistDialog(user_details) {
      this.dialog1 = true;
      this.user_details = user_details;
    },
    whitelistDialog(user_details) {
      this.dialog2 = true;
      this.user_details = user_details;
    },
    close() {
      this.$refs.form.reset();
      this.dialog1 = false;
      this.dialog2 = false;
    },
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
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_tradie_user")
        .then((res) => {
          this.allUsers = res.data.usersdata;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },
    fetchBlackListUsers() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_tradie_blacklist_user")
        .then((res) => {
          this.blacklistUsers = res.data.usersdata;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },
    fetchPrincipalUsers() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_principal_user")
        .then((res) => {
          this.principalUsers = res.data.usersdata;
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
            this.fetchPrincipalUsers();
          } else if (res.data.status == "E") {
            this.$toast.success(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchUsers();
            this.fetchPrincipalUsers();
          }
        })
        .catch((err) => {
          this.$toast.success(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    blacklistUser(id) {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.$axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "update_blacklist_status", {
            id: id,
            blacklist_reason: this.blacklist_reason,
          })
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.isDisabled = false;
              // console.log(this.$refs.form);
              this.close();
              this.$toast.success(this.array_data);
              this.initval = true;
              this.fetchUsers();
              this.fetchBlackListUsers();
              this.fetchPrincipalUsers();
            } else if (res.data.status == "E") {
              this.isDisabled = false;
              this.$toast.error(this.$t("something_went_wrong"));
              this.$refs.form.reset();
            } else {
              this.isDisabled = false;
              this.$refs.form.reset();
              this.$toast.error(this.array_data);
              this.initval = true;
              this.fetchUsers();
              this.fetchBlackListUsers();
              this.fetchPrincipalUsers();
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.close();
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("this error" + err);
          });
      }
    },

    whitelistUser(id) {
      this.isDisabled = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_blacklist_status", {
          id: id,
          blacklist_reason: this.blacklist_reason,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.isDisabled = false;
            // console.log(this.$refs.form);
            this.close();
            this.$toast.success(this.array_data);
            this.initval = true;
            this.fetchUsers();
            this.fetchBlackListUsers();
            this.fetchPrincipalUsers();
          } else if (res.data.status == "E") {
            this.isDisabled = false;
            this.$toast.error(this.$t("something_went_wrong"));
            this.$refs.form.reset();
          } else {
            this.isDisabled = false;
            this.$refs.form.reset();
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchUsers();
            this.fetchBlackListUsers();
            this.fetchPrincipalUsers();
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          this.close();
          this.$toast.error(this.$t("something_went_wrong"));
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

.cancel {
  background-color: rgb(45, 45, 45) !important;
  color: white !important;
}

.status_btn {
  cursor: text;
}

.reasonforblacklistclass {
  max-width: 220px;
  text-align: justify;
}
</style>