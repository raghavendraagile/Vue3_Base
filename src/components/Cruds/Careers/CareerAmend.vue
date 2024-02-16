<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0" v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '',]">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_career')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="card-body">
      <content-loader v-if="loader"></content-loader>
      <v-tabs v-model="tabs" color="blue">
        <v-tab :value="1">
          <span>{{ $t("english") }}</span>
        </v-tab>
        <v-tab :value="2">
          <span>{{ $t("arabic") }}</span>
        </v-tab>
      </v-tabs>
      <v-window v-model="tabs">
        <!-- ENGLISH TAB STARTS -->
        <v-window-item :value="1">
          <v-form ref="form" v-model="valid">
            <v-layout>
              <v-row class="px-6 mt-2">
                <v-col xs="12" md="12" lg="12">
                  <!-- :disabled="$route.query.slug" -->
                  <v-radio-group
                    v-model="careers[0].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(careers[0].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :label="role_data.rolename"
                      :value="role_data.rolename"
                      class="text--primary"
                    >
                    </v-radio>
                    <!-- <v-radio :label="$t('mall')" value="Mall"></v-radio>
                    <v-radio value="Store" :label="$t('store')"></v-radio> -->
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-layout>
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col cols="4" sm="12" md="4" v-if="!user.store_id">
                <v-tooltip :text="this.$t('store')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="careers[0].store_id"
                      :rules="fieldRules"
                      class="required_field"
                      v-bind:label="$t('store')"
                      variant="outlined"
                      density="compact"
                      :items="stores_en"
                      item-title="name"
                      item-value="id"
                      @update:model-value="updateStore(careers[0].store_id)"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers[0].title"
                      :rules="fieldRules"
                      v-bind:label="$t('title')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('vacancy')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers[0].vacancy"
                      :rules="vacancyRules"
                      v-bind:label="$t('vacancy')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers[0].meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="8">
                <v-tooltip
                  :text="this.$t('meta_description')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers[0].meta_description"
                      :rules="fieldRules"
                      maxlength="1000"
                      v-bind="props"
                      v-bind:label="$t('meta_description')"
                      required
                      class="required_field"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
              </v-col>
              <v-col md="12">
                <v-tooltip :text="this.$t('description')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers[0].description"
                      :rules="fieldRules"
                      maxlength="2000"
                      v-bind="props"
                      v-bind:label="$t('description')"
                      required
                      class="required_field"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form ref="form" v-model="valid">
            <v-layout>
              <!-- :disabled="$route.query.slug" -->
              <v-row class="px-6 mt-2">
                <v-col xs="12" md="12" lg="12">
                  <v-radio-group
                    v-model="careers[1].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(careers[1].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :label="changeStatusAr(role_data.rolename)"
                      :value="role_data.rolename"
                      class="text--primary"
                    >
                    </v-radio>
                    <!-- <v-radio :label="$t('mall')" value="Mall"></v-radio>
                    <v-radio value="Store" :label="$t('store')"></v-radio> -->
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-layout>
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col cols="4" sm="12" md="4" v-if="!user.store_id">
                <v-tooltip :text="this.$t('store_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="careers[1].store_id"
                      v-bind:label="$t('store_ar')"
                      variant="outlined"
                      density="compact"
                      :rules="fieldRules"
                      class="required_field rtl"
                      :items="stores_en"
                      item-title="name"
                      item-value="id"
                      @update:model-value="updateStore(careers[1].store_id)"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers[1].title"
                      :rules="fieldRules"
                      v-bind:label="$t('title_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('vacancy_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers[1].vacancy"
                      :rules="vacancyRules"
                      v-bind:label="$t('vacancy_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                  <span>{{ $t("vacancy_ar") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers[1].meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>

              <v-col md="8">
                <v-tooltip
                  :text="this.$t('meta_description_ar')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers[1].meta_description"
                      :rules="fieldRules"
                      maxlength="100"
                      v-bind="props"
                      v-bind:label="$t('meta_description_ar')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("meta_description_ar") }}</span>
                </v-tooltip>
              </v-col>
              <v-col md="12">
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers[1].description"
                      :rules="fieldRules"
                      maxlength="2000"
                      v-bind="props"
                      v-bind:label="$t('description_ar')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
      </v-window>
    </div>
    <div class="d-block mr-4 mt-3 pb-3 text-right">
      <v-tooltip :text="this.$t('cancel')" location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-inline-block mr-2">
            <v-btn
              v-bind="props"
              size="small"
              @click="cancel"
              :disabled="loading"
              class="ma-1 rtl"
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
              @click="submit"
              size="small"
              class="mr-2"
              color="success"
            >
              {{ $t("submit") }}
              <v-progress-circular
                v-if="isBtnLoading"
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
</template>

<script>
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tabs: 1,
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    careers_en: [],
    careers_ar: [],
    careers: [
      {
        id: 0,
        title: "",
        description: "",
        vacancy: "",
        seq: "",
        meta_title: "",
        meta_description: "",
        stor_type: "",
        lang: "en",
        store_id: null,
      },
      {
        id: 0,
        title: "",
        description: "",
        vacancy: "",
        seq: "",
        meta_title: "",
        meta_description: "",
        stor_type: "",
        lang: "ar",
        store_id: null,
      },
    ],
    noimagepreview: "",
    items: [],
    stores_en: [],
    stores_ar: [],
    role_array: [],
    sel_lang: "",
    user: "",
  }),
  mounted() {
    this.get_stores();
    this.fetchRoles();
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
    vacancyRules() {
      return [(v) => (v >= 0 && v <= 9999) || this.$t("number_required")];
    },
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    if (this.user.store_id) {
      this.careers[0].store_id = this.user.store_id;
      this.careers[1].store_id = this.user.store_id;
    }
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        // alert('Inside watch');
        // alert(this.$route.query.slug);
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_careers/" +
                this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.careers = res.data.careers;
              this.loader = false;
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
    changeStatusAr(status) {
      switch (status) {
        case "MallAdmin":
          return this.$t("mall_admin_ar");
        case "StoreAdmin":
          return this.$t("store_admin_ar");
        // case "Rejected":
        //   return this.$t("rejected_ar");
        default:
          return "";
      }
    },
    updateType(stor_type) {
      if (this.tabs == 1) {
        this.careers[1].stor_type = stor_type;
      } else {
        this.careers[0].stor_type = stor_type;
      }
    },
    updateStore(stor_type) {
      if (this.tabs == 1) {
        this.careers[1].store_id = stor_type;
      } else {
        this.careers[0].store_id = stor_type;
      }
    },
    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_reg_roles")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;
          if (!this.$route.query.slug) {
            this.careers[0].stor_type = this.role_array[0].rolename;
            this.careers[1].stor_type = this.role_array[0].rolename;
          }
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
    get_stores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
          console.log(response);
          this.stores_en = response.data.stores_en;
          this.stores_ar = response.data.stores_ar;

          // const default_en = {
          //   id: 0,
          //   name: this.$t("select_en"),
          //   header_id: 0,
          // };
          // const default_ar = {
          //   id: 0,
          //   name: this.$t("select_ar"),
          //   header_id: 0,
          // };

          // this.stores_en = [default_en, ...this.stores_en];
          // this.stores_ar = [default_ar, ...this.stores_ar];
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancel() {
      this.$router.push({
        name: "careers",
      });
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        console.log(this.careers);
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_careers",
            this.careers
          )
          .then((res) => {
            this.btnloading = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "careers",
              });
            } else if (res.data.status == "E") {
              this.$toast.error(this.array_data);
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        this.loader = false;
      } else {
        //alert("Form is Invalid");
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}
.upload_doc {
  margin-top: -14px;
}
.upload_image {
  margin-bottom: 3px;
}
.download_btn_color {
  color: blue;
}
.image-width {
  border: 2px solid black;
  padding: 1px;
}
</style>
