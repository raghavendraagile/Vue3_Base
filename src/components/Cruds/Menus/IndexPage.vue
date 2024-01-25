<template>
  <div>
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar position-relative"
    >
      <page-title
        class="col-md-3"
        :heading="$t('menus')"
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
            <router-link :to="{ name: 'menu_amend' }" style="color: white">
              <v-btn size="small" class="mb-2 green_btn_color" v-bind="props">
                {{ $t("add_new") }}
              </v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="menu"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :footer-props="{
        'items-per-page-text': $t('rows_per_page'),
      }"
      v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <span v-if="props.item.selectable.title">{{
              props.item.selectable.title
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.href">{{
              props.item.selectable.href
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.parent_name">{{
              props.item.selectable.parent_name
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.selectable.seq">{{
              props.item.selectable.seq
            }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>

          <td class="px-0 text-center">
            <router-link
              :to="{
                name: 'menu_amend',
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

            <span @click="deleteItem(props.item.selectable.id)">
              <v-tooltip :text="this.$t('delete')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    type="button"
                    class="delete_btn icon_size"
                    v-bind="props"
                    dense
                    color="error"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </span>
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
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
export default {
  components: { PageTitle, ConfirmDialog },
  data: () => ({
    showConfirmDialog: false,
    search: "",
    dialog: false,
    menu: [],
    initval: true,
    message: "",
    delete_id: null,
    google_icon: {
      icon_name: "menu",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: this.$t("title"),
          align: "left",
          sortable: true,
          key: "title",
        },
        {
          title: this.$t("link"),
          key: "href",
        },
        {
          title: this.$t("parent"),
          key: "parent_name",
        },
        {
          title: this.$t("sequence"),
          key: "seq",
        },
        {
          title: this.$t("action"),
          key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },
  mounted() {
    this.initialize();
  },

  methods: {
    cancel() {
      this.showConfirmDialog = false;
    },
    confirm() {
      this.deleteMenu();
      this.showConfirmDialog = false;
    },
    deleteItem(deleteID) {
      this.delete_id = deleteID;
      this.showConfirmDialog = true;
    },

    deleteMenu() {
      this.initval = true;
      this.$axios
        .delete(process.env.VUE_APP_API_URL_ADMIN + "menu/" + this.delete_id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.initval = false;
            this.$toast.error(this.array_data);
            this.initialize();
          } else {
            this.initval = false;
            this.$toast.success(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.initval = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    initialize() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "menu")
        .then((res) => {
          this.menu = res.data.menu;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
};
</script>
<style scoped></style>
