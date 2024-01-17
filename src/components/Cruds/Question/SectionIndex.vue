<template>
  <div class="main-20">
    <div flat color="white" class="row py-5 pl-5 align-items-center">
      <page-title
        class="col-md-4"
        :heading="section_header"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-text-field
              variant="outlined"
              density="compact"
              outlined
              rounded
              small
              v-bind="props"
              v-model="search"
              append-icon="search"
              label="Search"
              class="srch_bar"
              hide-details
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
                name: 'section_amend',
                query: { parent: $route.query.name, id: $route.query.id },
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
      :items="sections_array"
      :loading="initval"
      :search="search"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <span v-if="props.item.selectable.section">{{
              props.item.selectable.section
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.section_name">{{
              props.item.selectable.section_name
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <v-tooltip
              bottom
              v-if="props.item.selectable.description"
              max-width="370"
              color="white"
            >
              <template v-slot:activator="{ on }">
                <div class="description_hover_div" v-on="on">
                  {{ props.item.selectable.description }}
                </div>
              </template>
              <v-sheet class="pa-4 b">{{
                props.item.selectable.description
              }}</v-sheet>
            </v-tooltip>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>

          <td>
            <span v-if="props.item.selectable.fetch_role_name">{{
              props.item.selectable.fetch_role_name.rolename
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
            <router-link
              small
              :to="{
                name: 'section_amend',
                query: {
                  parent: $route.query.name,
                  id: $route.query.id,
                  section_id: props.item.selectable.id,
                },
              }"
            >
              <v-tooltip :text="this.$t('edit')" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" small class="mr-2 edit_btn icon_size"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <v-tooltip :text="this.$t('delete')" location="top">
              <template v-slot:activator="{ toolprops }">
                <v-icon
                  color="error"
                  v-bind="toolprops"
                  small
                  @click="deleteSections(props.item.selectable.id)"
                  >mdi-trash-can-outline</v-icon
                >
              </template>
              <span>{{ $t("delete") }}</span>
            </v-tooltip>
          </td>
          <td>
            <router-link
              :to="{
                name: 'questions_index',
                query: {
                  section_name: props.item.selectable.section_name,
                  id: props.item.selectable.id,
                },
              }"
              style="color: white"
            >
              <v-tooltip :text="this.$t('assign_question')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="small"
                    class="assign_question_btn"
                    v-bind="props"
                  >
                    {{ $t("assign_question") }}
                  </v-btn>
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
      :show="showdeleteDialog"
      :cancel="canceldelete"
      :confirm="confirmdelete"
      v-bind:title="$t('confirm')"
      v-bind:description="$t('want_to_delete_section')"
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
    sections_array: [],
    section_header: "",
    showdeleteDialog: false,
    initval: false,
    status_id: null,
    delete_id: null,
    headers: [
      {
        title: "Order",
        align: "left",
        key: "section",
      },
      {
        title: "Section Name",
        align: "left",
        key: "section_name",
      },
      {
        title: "Description",
        align: "left",
        key: "description",
      },
      {
        title: "Visible To",
        align: "left",
        key: "fetch_role_name.rolename",
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
      {
        title: "",
        align: "left",
      },
    ],
    google_icon: {
      icon_name: "folder_copy",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    showStatusDialog: false,
  }),
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id > 0) {
          this.section_header =
            this.$t("sections") + " (" + this.$route.query.name + ")";
          this.fetchSections(this.$route.query.id);
        }
      },
    },
  },
  mounted() {},
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
      this.confirmdeleteSection();
      this.showdeleteDialog = false;
    },

    fetchSections(id) {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchsectionbymenu/" + id)
        .then((res) => {
          this.sections_array = res.data.sections;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(" error" + err);
          this.initval = false;
        });
    },

    changeStatus(id) {
      this.status_id = id;
      this.showStatusDialog = true;
    },

    deleteSections(id) {
      this.delete_id = id;
      this.showdeleteDialog = true;
    },

    statusUpdate() {
      this.initval = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "updatesectionstatus", {
          id: this.status_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.initval = false;
            this.fetchSections(this.$route.query.id);
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.initval = false;
            this.fetchSections(this.$route.query.id);
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.initval = false;
          console.log("this error" + err);
        });
    },

    confirmdeleteSection() {
      this.initval = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "deletesections", {
          id: this.delete_id,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.initval = false;
            this.fetchSections(this.$route.query.id);
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.initval = false;
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
<style scoped>
.assign_question_btn {
  background: #0959f1;
  color: white;
  padding-top: 6px;
  font-size: 10px;
  padding-bottom: 5px;
}
</style>