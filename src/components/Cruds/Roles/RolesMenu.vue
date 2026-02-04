<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0" v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '',]"> 
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('assign_menu_accessto') + $route.query.name"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-list class="pl-16 role_list" color="#212529">
          <v-list-group v-for="(item, i) in items" :key="i">
            <template v-slot:activator="{ props }">
              <v-list-item
                active="false"
                v-bind:class="[
                  item.children.length < 1 ? 'sibebarvlistmenu' : '',
                ]"
                class="v_list_menu_title role_list_item"
                style="display: flex; justify-content: start"
                v-bind="props"
              >
                <div>
                  <v-checkbox
                    v-if="selected.includes(item.id)"
                    :model-value="true"
                    @click.stop="updateMenuAssignment(false, item)"
                    :label="item.name"
                  ></v-checkbox>
                  <v-checkbox
                    v-else
                    :model-value="false"
                    @click.stop="updateMenuAssignment(true, item)"
                    :label="item.name"
                  ></v-checkbox>
                </div>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :value="child.name"
              class="v_child_list_title role_list_child_item"
            >
              <v-checkbox
                v-if="selected.includes(child.id)"
                :model-value="true"
                @click.stop="updateMenuAssignment(false, child)"
                :label="child.name"
              ></v-checkbox>
              <v-checkbox
                v-else
                :model-value="false"
                @click.stop="updateMenuAssignment(true, child)"
                :label="child.name"
              ></v-checkbox>
            </v-list-item>
          </v-list-group>
        </v-list>
      </div>
      <div class="d-block mr-4 mt-3 text-right pb-3">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="loading"
                class="ma-1"
                color="cancel"
                >{{ $t("cancel") }}</v-btn
              >
            </div>
          </template>
        </v-tooltip>
        <v-tooltip :text="this.$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                @click="save()"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}
                <v-progress-circular
                  v-if="isDisabled"
                  indeterminate
                  width="1"
                  color="cancel"
                  size="x-small"
                  class="ml-2"
                ></v-progress-circular>
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>
  
<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    selected: [],
    items: [],
    message: "",
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    isChecked: [],
  }),

  mounted() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "rolemenu")
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.items = res.data.menu;
                this.selectedmenus(this.$route.query.id);
              } else {
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("this error" + err);
            });
        }
      },
    },
    '$i18n.locale'(newLocale) {
      if (newLocale === 'ar') {
        this.sel_lang = 'ar';
      } else {''
        this.sel_lang = 'en';
      }
    }
  },
  methods: {
    updateMenuAssignment(value, item) {
      if (value === true) {
        if (item.children.length == 0) {
          this.selected.push(item.id);
        } else {
          this.selected.push(item.id);
          item.children.forEach((child) => {
            this.selected.push(child.id);
          });
        }
      } else {
        if (item.children.length == 0) {
          this.selected = this.selected.filter((menu) => menu !== item.id);
        } else {
          this.selected = this.selected.filter((menu) => menu !== item.id);
          item.children.forEach((child) => {
            this.selected = this.selected.filter((menu) => menu !== child.id);
          });
        }
      }
    },
    selectedmenus(roleid) {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "getmenuaccess/" + roleid)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            // this.selected = res.data.selected_menu;
            this.selected = JSON.parse(JSON.stringify(res.data.selected_menu));
            this.selected1 = res.data.selected_menu;
            this.loader = false;
          } else if (res.data.status == "E") {
            this.loader = false;
            console.log("error_message", this.array_data);
          } else {
            this.loader = false;
            console.log("error_message", this.array_data);
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },

    save() {
      this.isDisabled = true;
      this.loader = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "storemenuaccess", {
          role_id: this.$route.query.id,
          role_access: this.selected,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          this.loader = false;
          if (res.data.status == "S") {
            this.emitter.emit("fetchAssignedMenus");
            this.message = res.data.message;
            this.$toast.success(this.message);
            this.$router.push({
              name: "roles",
            });
          } else {
            this.isDisabled = false;
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("error", err);
        });
    },
  },
};
</script>
<style scoped>
.checkboxmenuaccess {
  display: flex;
  /* flex: 0 0 auto !important; */
  max-height: 55px !important;
}

.menuaccessitemname {
  margin-top: 16px;
}

.checkbox-value {
  display: flex !important;
  justify-content: flex-start !important;
}
</style>