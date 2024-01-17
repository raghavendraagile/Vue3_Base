
<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
    >
      <page-title
        class="col-md-4"
        :heading="section_header"
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
      <div class="add_new_cancel_button">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              @click="$router.go(-1)"
              :disabled="loading"
              class="mr-3"
              color="cancel"
              >{{ $t("cancel") }}</v-btn
            >
          </template>
        </v-tooltip>
      </div>
      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{
                name: 'questions_amend',
                query: {
                  section_id: $route.query.id,
                  section_name: $route.query.section_name,
                },
              }"
              style="color: white"
            >
              <v-btn size="small" class="green_btn_color" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="questions_array"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <!-- <td>
            <span v-if="props.item.selectable.role_type_id">{{
              props.item.selectable.fetch_role_name.role_display_name
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td> -->
          <td>
            <span v-if="props.item.selectable.questions">
              {{ props.item.selectable.questions }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.field_type">{{
              props.item.selectable.field_type
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.is_field_required">{{
              props.item.selectable.is_field_required
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.sequence">{{
              props.item.selectable.sequence
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <div v-on="on" class="d-inline-block">
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
            </div>
          </td>
          <td class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <router-link
                  :to="{
                    name: 'questions_amend',
                    query: {
                      section_id: $route.query.id,
                      section_name: $route.query.section_name,
                      question_id: props.item.selectable.id,
                    },
                  }"
                >
                  <v-icon class="mr-2 edit_btn icon_size" v-on="on"
                    >mdi-pencil-outline</v-icon
                  >
                </router-link>
              </template>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  class="mr-2 edit_btn icon_size"
                  @click="deleteQuestion(props.item.selectable.id)"
                  color="error"
                  v-on="on"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
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
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_question')"
    />
  </div>
</template>
    
<script>
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: {
    ConfirmDialog,
  },
  data: () => ({
    google_icon: {
      icon_name: "help",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    user: [],
    user_id: "",
    section_header: "",
    questions_array: [],
    showStatusDialog: false,
    showdeleteDialog: false,
    initval: false,
    status_id: null,
    delete_id: null,
    next_seq: "",
    headers: [
      // {
      //   title: "Role Type",
      //   align: "left",
      //   key: "fetch_role_name.rolename",
      // },
      {
        title: "Questions",
        align: "left",
        key: "questions",
      },

      {
        title: "Field Type",
        align: "left",
        key: "field_type",
      },
      {
        title: "Reqiured Field",
        align: "left",
        key: "is_field_required",
      },
      {
        title: "Sequence",
        align: "left",
        key: "sequence",
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
        sortable: false,
        align: "center",
      },
    ],

    search: "",
  }),
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id > 0) {
          this.fetchQuestions(this.$route.query.id);
        }
      },
    },
    "$route.query.section_name": {
      immediate: true,
      handler() {
        if (this.$route.query.section_name) {
          this.section_header =
            this.$t("questions") + " (" + this.$route.query.section_name + ")";
          // this.fetchSections(this.$route.query.id);
        }
      },
    },
  },
  mounted() {
    // this.user = JSON.parse(localStorage.getItem("user"));
    // this.user_id = this.user.emp_id;
  },
  methods: {
    cancelStatus() {
      this.showStatusDialog = false;
    },
    confirmStatus() {
      this.statusUpdate();
      this.showStatusDialog = false;
    },
    cancel() {
      this.showdeleteDialog = false;
    },

    canceldelete() {
      this.showdeleteDialog = false;
    },
    confirmdelete() {
      this.confirmdeleteQuestion();
      this.showdeleteDialog = false;
    },

    fetchQuestions(id) {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchallquestions/" + id)
        .then((res) => {
          this.questions_array = res.data.questions;
          this.initval = false;
        })
        .catch((err) => {
          console.log(" error" + JSON.stringify(err));
          this.initval = false;
        });
    },

    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },

    deleteQuestion(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    statusUpdate() {
      this.initval = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updatequestionstatus", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.initval = false;
            this.fetchQuestions(this.$route.query.id);
          } else {
            this.initval = false;
            this.fetchQuestions(this.$route.query.id);
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log("this error" + err);
        });
    },

    confirmdeleteQuestion() {
      this.initval = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "deletequestions", {
          id: this.delete_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.initval = false;
            this.fetchQuestions(this.$route.query.id);
          } else {
            this.$toast.error(res.data.message);
            this.initval = false;
            this.fetchQuestions(this.$route.query.id);
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped></style>