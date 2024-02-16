<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_ammend_e_magazine')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
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
              <v-layout v-if="user && user.rolename != 'StoreAdmin'">
                <v-row class="px-6 mt-2">
                  <v-col xs="12" md="12" lg="12">
                    <!-- :disabled="$route.query.slug" -->
                    <v-radio-group
                      v-model="e_magazine[0].stor_type"
                      inline
                      class="radio_item"
                      @change="updateType(e_magazine[0].stor_type)"
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
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col
                    cols="4"
                    sm="12"
                    md="4"
                    v-if="user.rolename != 'StoreAdmin'"
                  >
                    <v-tooltip :text="this.$t('store')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="e_magazine[0].store_id"
                          v-bind:label="$t('store')"
                          variant="outlined"
                          class="required_field"
                          :rules="fieldRules"
                          density="compact"
                          :items="stores_en"
                          item-title="name"
                          item-value="header_id"
                          @update:model-value="
                            updateStore(e_magazine[0].store_id)
                          "
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="e_magazine[0].title"
                          :rules="fieldRules"
                          maxlength="100"
                          class="required_field"
                          v-bind:label="$t('title')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('meta_title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="e_magazine[0].meta_title"
                          :rules="fieldRules"
                          maxlength="100"
                          class="required_field"
                          v-bind:label="$t('meta_title')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
                    <v-tooltip :text="this.$t('description')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="e_magazine[0].description"
                          v-bind="props"
                          v-bind:label="$t('description')"
                          required
                          variant="outlined"
                          maxlength="100"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col md="12">
                    <v-tooltip
                      :text="this.$t('meta_description')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="e_magazine[0].meta_description"
                          v-bind="props"
                          v-bind:label="$t('meta_description')"
                          required
                          variant="outlined"
                          maxlength="100"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="6" sm="6" md="6" class="d-flex">
                    <v-tooltip
                      :text="this.$t('show_file')"
                      location="bottom"
                      v-if="e_magazine[0].file_upload"
                    >
                      <template v-slot:activator="{ props }">
                        <div class="col-md-1">
                          <a
                            :href="envImagePath + e_magazine[0].file_upload"
                            download
                            ><v-icon v-bind="props">mdi mdi-file</v-icon></a
                          >
                        </div>
                        <div class="col-md-9">
                          <a
                            :href="envImagePath + e_magazine[0].file_upload"
                            download
                          >
                            <v-chip size="small" v-bind="props">{{
                              e_magazine[0].file_upload
                            }}</v-chip>
                          </a>
                        </div>
                        <div class="col-md-1">
                          <a @click="e_magazine[0].file_upload = ''"
                            ><v-icon v-bind="props">mdi mdi-delete</v-icon></a
                          >
                        </div>
                      </template>
                    </v-tooltip>
                    <v-tooltip
                      :text="this.$t('upload_file')"
                      location="bottom"
                      v-else
                    >
                      <template v-slot:activator="{ props }">
                        <v-file-input
                          :disabled="is_disabled"
                          v-bind="props"
                          show-size
                          :label="$t('file_input')"
                          outlined
                          :rules="fileRules"
                          :error="errorUpload"
                          :error-messages="errorUploadMessage"
                          @input="clearUploadErrors"
                          prepend-icon=""
                          append-inner-icon="mdi mdi-file-document-plus"
                          accept="*"
                          required
                          class="required_field"
                          variant="outlined"
                          density="compact"
                          @click="updateFileIndex(index)"
                          @change="onFileChange"
                          ><template v-slot:selection="{ fileNames }">
                            <template
                              v-for="fileName in fileNames"
                              :key="fileName"
                            >
                              <v-chip size="small" label class="me-2">
                                {{ fileName }}
                              </v-chip>
                            </template>
                          </template>
                        </v-file-input>
                      </template>
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
                              v-if="e_magazine[0].image_path != null"
                              :src="envImagePath + e_magazine[0].image_path"
                              width="100"
                              height="65
                          "
                              alt
                            />
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-else
                              src="@/assets/images/upload_image_default.png"
                              width="100"
                            />
                            <div v-show="isHovering" class="camera-icon">
                              <v-icon @click="uploadFile">mdi-camera</v-icon>
                            </div>
                          </div>
                        </v-hover>
                      </div>
                      <a
                        class="text-center pointer"
                        @click="downloadImage(e_magazine[0].image_path)"
                      >
                        <span
                          v-if="e_magazine[0].image_path"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'e_magazine'"
                      :resizewidth="200"
                      :resizeheight="200"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadfile"
                    />
                  </v-col>
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ENGLISH TAB END -->
          <!-- ARABIC TAB STARTS -->
          <v-window-item :value="2">
            <v-form ref="form" v-model="valid">
              <v-layout v-if="user.rolename != 'StoreAdmin'">
                <!-- :disabled="$route.query.slug" -->
                <v-row class="px-6 mt-2">
                  <v-col xs="12" md="12" lg="12">
                    <v-radio-group
                      v-model="e_magazine[1].stor_type"
                      inline
                      class="radio_item"
                      @change="updateType(e_magazine[1].stor_type)"
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
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col
                    cols="4"
                    sm="12"
                    md="4"
                    v-if="user.rolename != 'StoreAdmin'"
                  >
                    <v-tooltip :text="this.$t('store_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="e_magazine[1].store_id"
                          v-bind:label="$t('store_ar')"
                          class="required_field rtl"
                          :rules="fieldRules"
                          variant="outlined"
                          density="compact"
                          :items="stores_ar"
                          item-title="name"
                          item-value="header_id"
                          @update:model-value="
                            updateStore(e_magazine[1].store_id)
                          "
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="12" md="4">
                    <v-tooltip :text="$t('title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="e_magazine[1].title"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('title_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="12" md="4">
                    <v-tooltip :text="$t('meta_title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="e_magazine[1].meta_title"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('title_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
                    <v-tooltip
                      :text="this.$t('description_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="e_magazine[1].description"
                          v-bind="props"
                          v-bind:label="$t('description_ar')"
                          required
                          class="rtl"
                          variant="outlined"
                          maxlength="100"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col md="12">
                    <v-tooltip
                      :text="this.$t('meta_description_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="e_magazine[1].meta_description"
                          v-bind="props"
                          v-bind:label="$t('meta_description_ar')"
                          required
                          class="rtl"
                          variant="outlined"
                          maxlength="100"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="6" sm="6" md="6" class="d-flex">
                    <v-tooltip
                      :text="this.$t('show_file')"
                      location="bottom"
                      v-if="e_magazine[1].file_upload"
                    >
                      <template v-slot:activator="{ props }">
                        <div class="col-md-1">
                          <a
                            :href="envImagePath + e_magazine[1].file_upload"
                            download
                            ><v-icon v-bind="props">mdi mdi-file</v-icon></a
                          >
                        </div>
                        <div class="col-md-9">
                          <a
                            :href="envImagePath + e_magazine[1].file_upload"
                            download
                          >
                            <v-chip size="small" v-bind="props">{{
                              e_magazine[1].file_upload
                            }}</v-chip>
                          </a>
                        </div>
                        <div class="col-md-1">
                          <a @click="e_magazine[1].file_upload = ''"
                            ><v-icon v-bind="props">mdi mdi-delete</v-icon></a
                          >
                        </div>
                      </template>
                    </v-tooltip>
                    <v-tooltip
                      :text="this.$t('file_input_ar')"
                      location="bottom"
                      v-else
                    >
                      <template v-slot:activator="{ props }">
                        <v-file-input
                          :disabled="is_disabled"
                          v-bind="props"
                          show-size
                          :label="$t('file_input_ar')"
                          outlined
                          :rules="fileRules"
                          :error="errorUpload"
                          :error-messages="errorUploadMessage"
                          @input="clearUploadErrors"
                          prepend-icon=""
                          append-inner-icon="mdi mdi-file-document-plus"
                          accept="*"
                          required
                          class="required_field"
                          variant="outlined"
                          density="compact"
                          @click="updateFileIndex(index)"
                          @change="onFileChange"
                          ><template v-slot:selection="{ fileNames }">
                            <template
                              v-for="fileName in fileNames"
                              :key="fileName"
                            >
                              <v-chip size="small" label class="me-2">
                                {{ fileName }}
                              </v-chip>
                            </template>
                          </template>
                        </v-file-input>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <div>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="e_magazine[1].image_path != null"
                              :src="envImagePath + e_magazine[1].image_path"
                              width="100"
                              height="65
                          "
                              alt
                            />
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-else
                              src="@/assets/images/upload_image_default.png"
                              width="100"
                            />
                            <div v-show="isHovering" class="camera-icon">
                              <v-icon @click="uploadFileAr">mdi-camera</v-icon>
                            </div>
                          </div>
                        </v-hover>
                      </div>
                      <a
                        class="text-center pointer"
                        @click="downloadImage(e_magazine[1].image_path)"
                      >
                        <span
                          v-if="e_magazine[1].image_path"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'e_magazine'"
                      :resizewidth="200"
                      :resizeheight="200"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadfilear"
                    />
                  </v-col>
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ARABIC TAB END -->
        </v-window>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
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
  </div>
</template>

<script>
import Imageupload from "../../CustomComponents/ImageUpload.vue";
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
    Imageupload,
  },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: true,
    successmessage: "",
    message: "",
    valid_error: false,
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    tabs: 1,
    e_magazine_en: [],
    e_magazine_ar: [],
    e_magazine: [
      {
        id: 0,
        title: "",
        store_id: "",
        description: "",
        image_path: null,
        file_upload: "",
        seq: "",
        meta_title: "",
        meta_description: "",
        lang: "en",
        stor_type: "",
      },
      {
        id: 0,
        title: "",
        store_id: "",
        description: "",
        image_path: null,
        file_upload: "",
        seq: "",
        meta_title: "",
        meta_description: "",
        lang: "ar",
        stor_type: "",
      },
    ],
    stores_en: [],
    stores_ar: [],
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    uploadfile: false,
    uploadfilear: false,
    is_arabic_image: false,
    sel_file_index: null,
    errorNameMessage: "",
    errorUploadMessage: "",
    file_name: "",
    fileurl: "",
    sel_lang: "",
    folder: "e_magazin_file_upload",
    is_disabled: false,
    user: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },
    fileRules() {
      return [(v) => v.length > 0 || this.$t("field_required")];
    },
  },

  created() {
    this.fetchRoles();
  },
  mounted() {
    this.get_stores();

    this.user = JSON.parse(localStorage.getItem("user_data"));
    if (this.user.store_id && this.user.rolename == "StoreAdmin") {
      this.e_magazine[0].store_id = this.user.store_id;
      this.e_magazine[1].store_id = this.user.store_id;
    }
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit-e-magazine/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.e_magazine = res.data.e_magazine;

              //   if (Array.isArray(res.data.message)) {
              //     this.e_magazine = res.data.message.toString();
              //   } else {
              //     this.e_magazine = res.data.message;
              //   }
              //   if (res.data.status == "S") {
              //     this.e_magazine = res.data.e_magazine;
              //     this.loader = false;
              //   } else {
              //     this.$toast.error(this.$t("something_went_wrong"));
              //     this.loader = false;
              //   }
              // })
              // .catch((err) => {
              //   this.loader = false;
              //   this.$toast.error(this.$t("something_went_wrong"));
              //   console.log(err);
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
  },

  methods: {
    updateType(stor_type) {
      if (this.tabs == 1) {
        this.e_magazine[1].stor_type = stor_type;
      } else {
        this.e_magazine[0].stor_type = stor_type;
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
    updateStore(stor_type) {
      if (this.tabs == 1) {
        this.e_magazine[1].store_id = stor_type;
      } else {
        this.e_magazine[0].store_id = stor_type;
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
    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_reg_roles")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;
          if (!this.$route.query.slug && this.user.rolename == "SuperUser") {
            this.e_magazine[0].stor_type = this.role_array[0].rolename;
            this.e_magazine[1].stor_type = this.role_array[0].rolename;
          } else if (
            this.user.rolename === "MallAdmin" &&
            !this.$route.query.slug
          ) {
            this.role_array = response.data.roles.filter(
              (role) => role.rolename !== "MallAdmin"
            );
            this.e_magazine[0].stor_type = this.role_array[0].rolename;
            this.e_magazine[1].stor_type = this.role_array[0].rolename;
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
    // Uploading a image
    uploaded_image(img_src) {
      if (this.is_arabic_image) {
        this.e_magazine[1].image_path = img_src;
      } else {
        this.e_magazine[0].image_path = img_src;
      }
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.is_arabic_image = false;
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    uploadFileAr() {
      if (this.uploadfilear == false) {
        this.is_arabic_image = true;
        this.uploadfilear = true;
      } else {
        this.uploadfilear = false;
      }
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    //---Upload file----
    updateFileIndex(index) {
      this.sel_file_index = index;
    },
    onFileChange(e) {
      console.log("evnrnt target", this.sel_file_index);
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
      const filename = event.target.files[0].name;
      const lastDot = filename.lastIndexOf(".");
      const fileNameWithoutExt = filename.substring(0, lastDot);
      const ext = filename.substring(lastDot + 1);
      console.log("FileName => " + fileNameWithoutExt);
      this.filename = fileNameWithoutExt;
      console.log("Extension => " + ext);
      this.extension = ext;
    },
    createImage(file) {
      this.emitData();
      //var imagex = new Image();
      var reader = new FileReader();
      this.progress = 0;
      reader.onload = (e) => {
        this.$emit("updateImage", e.target.result);
        this.upload(e.target.result);
      };
      reader.readAsDataURL(file);
      //this.upload(this.image);
    },
    emitData() {
      var index_path = {
        index1: this.section_index,
        index2: this.question_index,
      };
      console.log("index path will be ", index_path);
      this.$emit("update-data", this.documents, index_path);
    },
    upload(imagedata) {
      this.loader = true;
      if (!imagedata) {
        this.message = "Please select a file!";
        return;
      }
      this.message = "";
      return this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "file_upload", {
          image: imagedata,
          folder: this.folder,
          filename: this.filename,
          extension: this.extension,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.fileurl = res.data.filepath;
            this.file_name = this.fileurl.replace(/^.*[/]/, "");
            if (this.tabs == 1) {
              this.e_magazine[0].file_upload = res.data.filepath;
            } else {
              this.e_magazine[1].file_upload = res.data.filepath;
            }
            for (let index in this.documents) {
              if (this.sel_file_index == index) {
                this.documents[index].doc_url = this.fileurl;
              }
            }
            this.loader = false;
          }
        })
        .catch((err) => {
          alert("Unable to upload file, try later");
          console.log("this error -> " + err);
        });
    },

    //---submit---
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;

        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-e-magazine",
            this.e_magazine
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
                name: "e-magazine",
              });
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("error", err);
          });
        this.isDisabled = false;
        this.isBtnLoading = false;
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
.image-container {
  max-width: 110px;
  border: 5px double black;
  border-radius: 3px;
}
.camera-icon {
  position: absolute;
  bottom: 35px;
  left: 35px;
  animation: fadeInUp 0.5s forwards;
}
.upload_doc {
  margin-top: -14px;
}
.pointer {
  cursor: pointer;
}
.upload_image {
  margin-bottom: 3px;
}
.download_btn_color {
  color: blue;
}
.image-width {
  border: 3px solid black;
  padding: 1px;
}
.d-flex {
  display: flex;
}
</style>
