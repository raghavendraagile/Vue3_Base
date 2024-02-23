<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_products_services')"
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
            <v-layout v-if="user.rolename != 'StoreAdmin'">
              <v-row class="px-6 mt-2">
                <v-col xs="12" md="12" lg="12">
                  <!-- :disabled="$route.query.slug" -->
                  <v-radio-group
                    v-model="products[0].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(products[0].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :label="changeRoleName(role_data.rolename)"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('type_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[0].type"
                      :label="this.$t('type_en')"
                      variant="outlined"
                      density="compact"
                      :items="types_en"
                      :rules="fieldRules"
                      item-title="shortname"
                      @update:modelValue="(value) => updateTypes(value)"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="4"
                v-if="user.rolename != 'StoreAdmin'"
              >
                <v-tooltip :text="labelText" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[0].store_id"
                      :label="labelText"
                      variant="outlined"
                      density="compact"
                      :items="stores_en"
                      :rules="fieldRules"
                      item-title="name"
                      @update:modelValue="(value) => updateStore(value)"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[0].title"
                      :rules="fieldRules"
                      v-bind:label="$t('title_en')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip :text="this.$t('description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[0].description"
                      :rules="fieldRules"
                      maxlength="2000"
                      counter="true"
                      v-bind="props"
                      class="required_field"
                      v-bind:label="$t('description_en')"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('sequence_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[0].seq"
                      maxlength="5"
                      v-bind:label="$t('sequence_en')"
                      required
                      variant="outlined"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[0].meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title_en')"
                      class="required_field"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip
                  :text="this.$t('meta_description_en')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[0].meta_description"
                      class="required_field"
                      :rules="fieldRules"
                      maxlength="160"
                      counter="true"
                      v-bind="props"
                      v-bind:label="$t('meta_description_en')"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("meta_description_en") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                </div>
                <br />
                <Imageupload
                  :folder="'products'"
                  :resizewidth="200"
                  :resizeheight="200"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfile"
                />
              </v-col>
            </v-row>
            <div class="mx-auto d-flex" max-width="344">
              <div
                class="mr-10 m-2"
                v-for="(img_en, img_index) in products[0].image_path"
                :key="img_index"
              >
                <div class="image-container">
                  <img
                    v-bind:style="
                      isHovering == true ? 'filter: blur(1px);' : ''
                    "
                    :src="envImagePath + img_en"
                    width="100"
                    height="65"
                    alt
                  />
                </div>
                <v-tooltip :text="this.$t('download_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <a class="text-center pointer download_icon">
                      <span
                        ><v-icon
                          v-bind="props"
                          class="mr-2"
                          @click="downloadImage(img_en)"
                          >mdi mdi-download</v-icon
                        ></span
                      >
                    </a>
                  </template>
                </v-tooltip>
                <v-tooltip :text="this.$t('delete_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <span>
                      <v-icon
                        small
                        v-bind="props"
                        class="mr-2 edit_btn icon_size delete_icon"
                        @click="removeImage(img_index)"
                        >mdi mdi-trash-can-outline</v-icon
                      >
                    </span>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form
            ref="form"
            v-model="valid"
            style="direction: rtl; text-align: end"
          >
            <v-layout v-if="user.rolename != 'StoreAdmin'">
              <!-- :disabled="$route.query.slug" -->
              <v-row class="px-6 mt-2 arabdirection">
                <v-col xs="12" md="12" lg="12">
                  <v-radio-group
                    v-model="products[1].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(products[1].stor_type)"
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
            <v-row class="mx-auto mt-2 arabdirection" max-width="344">
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('type_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[1].type"
                      :label="this.$t('type_ar')"
                      variant="outlined"
                      density="compact"
                      :items="types_ar"
                      :rules="fieldRules"
                      item-title="shortname"
                      @update:modelValue="(value) => updateTypes(value)"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="4"
                v-if="user.rolename != 'StoreAdmin'"
              >
                <v-tooltip :text="label_text_ar" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[1].store_id"
                      :label="label_text_ar"
                      variant="outlined"
                      density="compact"
                      :rules="fieldRulesAR"
                      :items="stores_ar"
                      @update:modelValue="(value) => updateStore(value)"
                      item-title="name"
                      class="required_field rtl"
                      item-value="header_id"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[1].title"
                      :rules="fieldRulesAR"
                      v-bind:label="$t('title_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[1].description"
                      :rules="fieldRulesAR"
                      maxlength="2000"
                      counter="true"
                      v-bind="props"
                      v-bind:label="$t('description_ar')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('sequence_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[1].seq"
                      maxlength="5"
                      v-bind:label="$t('sequence_ar')"
                      required
                      variant="outlined"
                      class="rtl"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[1].meta_title"
                      :rules="fieldRulesAR"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip
                  :text="this.$t('meta_description_ar')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[1].meta_description"
                      :rules="fieldRulesAR"
                      maxlength="160"
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
              <v-col cols="6" sm="12" md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                </div>
                <br />
                <Imageupload
                  :folder="'products'"
                  :resizewidth="0.4"
                  :resizeheight="0.1"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfilear"
                />
              </v-col>
            </v-row>
            <div class="mx-auto d-flex" max-width="344">
              <div
                class="mr-10 m-2"
                v-for="(img_ar, ar_img_index) in products[1].image_path"
                :key="ar_img_index"
              >
                <div class="image-container">
                  <img
                    v-bind:style="
                      isHovering == true ? 'filter: blur(1px);' : ''
                    "
                    :src="envImagePath + img_ar"
                    width="100"
                    height="65"
                    alt
                  />
                </div>
                <v-tooltip :text="this.$t('download_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <a class="text-center pointer download_icon_ar">
                      <span
                        ><v-icon
                          v-bind="props"
                          class="mr-2"
                          @click="downloadImage(img_ar)"
                          >mdi mdi-download</v-icon
                        ></span
                      >
                    </a>
                  </template>
                </v-tooltip>
                <v-tooltip :text="this.$t('delete_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <span>
                      <v-icon
                        small
                        v-bind="props"
                        class="mr-2 edit_btn icon_size delete_icon_ar"
                        @click="removeImage(ar_img_index)"
                        >mdi mdi-trash-can-outline</v-icon
                      >
                    </span>
                  </template>
                </v-tooltip>
              </div>
            </div>
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
// import DatePicker from "../../CustomComponents/DatePicker.vue";
import Imageupload from "../../CustomComponents/ImageUpload.vue";
export default {
  components: { Imageupload },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tabs: 1,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    sel_lang: "",
    isDisabled: false,
    checkbox_value: false,
    uploadfile: false,
    uploadfilear: false,
    mal_data_en: [],
    mal_data_er: [],
    role_array: [],
    stores_data_ar: [],
    stores_data_en: [],
    user: "",
    label_text_ar: "مجمع تجاري",
    labelText: "Mall",
    products: [
      {
        id: 0,
        title: "",
        store_id: null,
        description: "",
        start_date: "",
        end_date: "",
        image_path: [],
        meta_title: "",
        meta_description: "",
        lang: "en",
        seq: null,
        stor_type: "",
      },
      {
        id: 0,
        title: "",
        store_id: null,
        description: "",
        start_date: "",
        end_date: "",
        image_path: [],
        meta_title: "",
        meta_description: "",
        lang: "ar",
        seq: null,
        stor_type: "",
      },
    ],
    images_en: [],
    images_ar: [],
    stores_en: [],
    stores_ar: [],
    types_en: [],
    types_ar: [],
    noimagepreview: "",
    items: [],
  }),

  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    phoneRules() {
      return [
        (v) => (v >= 0 && v <= 999999999999) || this.$t("number_required"),
      ];
    },
    numberRules() {
      return [(v) => (v >= 0 && v <= 999999999999) || this.$t("entered_value")];
    },

    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAR() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },
  },
  mounted() {
    this.get_stores();
    this.fetchMall();
  },
  created() {
    this.fetchRoles();
    this.fetchLookup();
    this.user = JSON.parse(localStorage.getItem("user_data"));
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
                "edit_products/" +
                this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.products = res.data.products;
              this.assignType(this.products[0].stor_type);

              this.loader = false;
            });
        }
      },
    },
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab == 1) {
          this.tabs = 1;
        } else {
          this.tabs = 2;
        }
      },
    },
  },

  methods: {
    removeImage(index) {
      if (this.tabs == 1) {
        this.products[0].image_path.splice(index, 1);
      } else {
        this.products[1].image_path.splice(index, 1);
      }
    },
    changeRoleName(role_name) {
      switch (role_name) {
        case "MallAdmin":
          return this.$t("mall");
        case "StoreAdmin":
          return this.$t("store");
        // case "Rejected":
        //   return this.$t("rejected_ar");
        default:
          return "";
      }
    },
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
    updateStore(store) {
      if (this.tabs == 1) {
        this.products[1].store_id = store;
      } else {
        this.products[0].store_id = store;
      }
    },
    updateTypes(type) {
      if (this.tabs == 1) {
        this.products[1].type = type;
      } else {
        this.products[0].type = type;
      }
    },
    updateType(stor_type) {
      this.products[1].store_id = null;
      this.products[0].store_id = null;
      this.assignType(stor_type);
    },
    assignType(stor_type) {
      setTimeout(() => {
        if (this.tabs == 1) {
          this.products[1].stor_type = stor_type;
          if (stor_type == "MallAdmin") {
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else {
            // alert("asdsad");
            this.labelText = this.$t("store");
            this.label_text_ar = this.$t("store_ar");
            this.stores_en = this.stores_data_en;
            this.stores_ar = this.stores_data_ar;
            // console.log("asdasd", this.stores_data_en);
          }
        } else {
          this.products[0].stor_type = stor_type;
          if (stor_type == "MallAdmin") {
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else {
            this.labelText = this.$t("store");
            this.label_text_ar = this.$t("store_ar");
            this.stores_en = this.stores_data_en;
            this.stores_ar = this.stores_data_ar;
          }
        }
      }, 1000);
    },
    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_reg_roles")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;
          if (!this.$route.query.slug && this.user.rolename == "SuperUser") {
            this.products[0].stor_type = this.role_array[0].rolename;
            this.products[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.products[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            !this.$route.query.slug
          ) {
            this.role_array = response.data.roles.filter(
              (role) => role.rolename == "StoreAdmin"
            );
            this.products[0].stor_type = this.role_array[0].rolename;
            this.products[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.products[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            this.$route.query.slug
          ) {
            this.role_array = response.data.roles.filter(
              (role) => role.rolename == "StoreAdmin"
            );
            this.assignType(this.products[0].stor_type);
          }
          // if (!this.$route.query.slug) {

          // }
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
          params: {
            lookup_type: "PRODUCTS_SERVICES_TYPE",
          },
        })
        .then((response) => {
          this.types_en = response.data.lookup_en;
          this.types_ar = response.data.lookup_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    fetchMall() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-malls")
        .then((response) => {
          console.log(response);
          this.mal_data_en = response.data.malls_en;
          this.mal_data_ar = response.data.malls_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    cancel() {
      this.$router.push({
        name: "products",
        query: { 's_tab': this.$route.query.s_tab },
      });
    },
    get_stores() {
      // this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
          console.log(response);
          this.stores_data_en = response.data.stores_en;
          this.stores_data_ar = response.data.stores_ar;
          if (this.user.rolename == "MallAdmin") {
            //      this.role_array = response.data.roles.filter(
            //   (role) => role.rolename == "StoreAdmin"
            // );
            this.stores_data_en = this.stores_data_en.filter((x) => {
              console.log("x", x);
              return x.mall_name == this.user.store_id;
            });
            this.user.store_id;
            this.stores_data_ar = this.stores_data_ar.filter((x) => {
              return x.mall_name == this.user.store_id;
            });
          }
          // this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploaded_image(img_src) {
      if (this.tabs == 1) {
        this.products[0].image_path.push(img_src);
        // this.products[0].image_path = img_src;
      } else {
        this.products[1].image_path.push(img_src);
        // this.products[1].image_path = img_src;
      }
    },

    uploadFile() {
      if (this.tabs == 1) {
        if (this.uploadfile == false) {
          this.uploadfile = true;
        } else {
          this.uploadfile = false;
        }
      } else {
        if (this.uploadfilear == false) {
          this.uploadfilear = true;
        } else {
          this.uploadfilear = false;
        }
      }
    },
    formatted_start_date(formatted_date) {
      this.products[0].start_date = formatted_date;
    },
    formatted_start_date_ar(formatted_date) {
      this.products[1].start_date = formatted_date;
    },
    formatted_end_date(formatted_date) {
      this.products[0].end_date = formatted_date;
    },
    formatted_end_date_ar(formatted_date) {
      this.products[1].end_date = formatted_date;
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.user.rolename == "StoreAdmin") {
          this.products[0].store_id = this.user.store_id;
          this.products[1].store_id = this.user.store_id;
          this.products[0].stor_type = this.user.rolename;
          this.products[1].stor_type = this.user.rolename;
        } // Form is valid, process
        this.loader = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_products",
            this.products
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
                name: "products",
                query: { s_tab: this.$route.query.s_tab },
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
  cursor: pointer;
}

.image-width {
  border: 2px solid black;
  padding: 1px;
}

.arabdirection /deep/ .v-field {
  direction: rtl;
}

.arabdirection /deep/ .v-input {
  direction: rtl !important;
}
.arabdirection /deep/ .v-messages__message {
  text-align: right !important;
}
.delete_icon_ar {
  position: relative;
  right: 35px;
  bottom: 90px;
}
.delete_icon {
  position: relative;
  left: 80px;
  bottom: 90px;
}
.download_icon {
  position: relative;
  left: 112px;
  bottom: 52px;
}
.download_icon_ar {
  position: relative;
  bottom: 45px;
  right: 67px;
}
.d-flex {
  display: flex !important;
  align-items: center;
  /* justify-content: space-between !important; */
  flex-wrap: wrap;
  background: #fff;
}
</style>
