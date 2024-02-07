<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_amend_category')"
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
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateParent('en', value)
                          "
                          v-model="category[0].parent_id"
                          v-bind:label="$t('parent_category')"
                          variant="outlined"
                          density="compact"
                          :items="category_en"
                          item-title="name"
                          item-value="id"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].name"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('name')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].title"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('title')"
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
                <v-row class="px-6 pt-0">
                  <v-col cols="12" md="12" lg="12" sm="12" class="pt-0">
                    <v-card-title class="text-left" style="font-size: 17px">{{
                      $t("description")
                    }}</v-card-title>
                    <v-tooltip :text="$t('description')" location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props">
                          <quill-editor
                            class="hide_quill_input"
                            v-bind:id="
                              quill_item == true
                                ? 'quill_item'
                                : 'quill_item_border'
                            "
                            v-model:value="category[0].description"
                            @blur="onEditorBlur($event)"
                            @focus="onEditorFocus($event)"
                            @ready="onEditorReady($event)"
                            @change="onEditorChange($event)"
                          />
                          <small
                            v-if="quill_item"
                            class="text-danger ml-5 required_item shake"
                            >Field Required</small
                          >
                        </div>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
                    <v-tooltip :text="this.$t('meta_title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].meta_title"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="150"
                          v-bind:label="$t('meta_title')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
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
                          v-model="category[0].meta_description"
                          v-bind="props"
                          :rules="descriptionRules"
                          v-bind:label="$t('meta_description')"
                          required
                          class="required_field"
                          variant="outlined"
                          maxlength="250"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col md="6">
                    <div>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="category[0].image_path != null"
                              :src="envImagePath + category[0].image_path"
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
                        @click="downloadImage(category[0].image_path)"
                      >
                        <span
                          v-if="category[0].image_path"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'category'"
                      :resizewidth="0.4"
                      :resizeheight="0.1"
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
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          @update:modelValue="
                            (value) => updateParent('ar', value)
                          "
                          v-bind="props"
                          v-model="category[1].parent_id"
                          v-bind:label="$t('parent_category')"
                          variant="outlined"
                          density="compact"
                          :items="category_ar"
                          item-title="name"
                          item-value="id"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('name_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].name"
                          :rules="fieldRules"
                          class="required_field rtl"
                          maxlength="100"
                          v-bind:label="$t('name_ar')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].title"
                          :rules="fieldRules"
                          class="required_field rtl"
                          maxlength="100"
                          v-bind:label="$t('title_ar')"
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
                <v-row class="px-6 pt-0">
                  <v-col cols="12" md="12" lg="12" sm="12" class="pt-0">
                    <v-card-title class="text-left" style="font-size: 17px">{{
                      $t("description_ar")
                    }}</v-card-title>
                    <v-tooltip :text="$t('description_ar')" location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props">
                          <quill-editor
                            class="hide_quill_input rtl"
                            v-bind:id="
                              quill_item == true
                                ? 'quill_item'
                                : 'quill_item_border'
                            "
                            v-model:value="category[1].description"
                            @blur="onEditorBlurAR($event)"
                            @focus="onEditorFocusAR($event)"
                            @ready="onEditorReadyAR($event)"
                            @change="onEditorChangeAR($event)"
                          />
                          <small
                            v-if="quill_item"
                            class="text-danger ml-5 required_item shake"
                            >Field Required</small
                          >
                        </div>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col md="12">
                    <v-tooltip
                      :text="this.$t('meta_title_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].meta_title"
                          :rules="fieldRules"
                          class="required_field rtl"
                          maxlength="150"
                          v-bind:label="$t('meta_title_ar')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
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
                          v-model="category[1].meta_description"
                          v-bind="props"
                          :rules="descriptionRules"
                          v-bind:label="$t('meta_description_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          maxlength="250"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col md="6">
                    <div>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="category[1].image_path != null"
                              :src="envImagePath + category[1].image_path"
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
                        @click="downloadImage(category[1].image_path)"
                      >
                        <span
                          v-if="category[1].image_path"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'category'"
                      :resizewidth="0.4"
                      :resizeheight="0.1"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadfile"
                    />
                  </v-col>
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ARABIC TAB END -->
        </v-window>
      </div>
      <v-layout>
        <v-row class="mt-2 px-6" max-width="344">
          <v-col md="6">
            <v-tooltip
              :text="this.$t('display_in_header_menu')"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-switch
                  v-bind="props"
                  color="blue"
                  :model-value="category[0].display_header_menu === 1"
                  @update:model-value="
                    (value) => (category[0].display_header_menu = value ? 1 : 0)
                  "
                  hide-details
                  inset
                  :label="$t('display_in_header_menu')"
                ></v-switch>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-layout>
      <div class="d-block mr-4 mt-3 pb-3 text-right">

        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <router-link :to="{ name: 'categories' }">
                <v-btn
                  v-bind="props"
                  size="small"
                  @click="$router.go(-1)"
                  :disabled="loading"
                  class="ma-1"
                  color="cancel"
                  >{{ $t("cancel") }}</v-btn
                >
              </router-link>
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
import { quillEditor } from "vue3-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default {
  components: {
    PageTitle,
    Imageupload,
    quillEditor,
  },
  setup() {
    const onEditorFocus = () => {
      // console.log("editor focus!", quill);
    };
    const onEditorFocusAR = () => {
      // console.log("editor focus!", quill);
    };
    const onEditorReady = () => {
      // console.log("editor ready!", quill);
    };
    const onEditorReadyAR = () => {
      // console.log("editor ready!", quill);
    };

    return { onEditorReady, onEditorFocus, onEditorFocusAR, onEditorReadyAR };
  },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
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
    default_sel: {
      id: 0,
      name: "--SELECT--",
    },
    category_en: [],
    category_ar: [],
    uploadfile: false,
    category: [
      {
        id: 0,
        name: "",
        title: "",
        description: "",
        meta_title: "",
        image_path: "",
        meta_description: "",
        display_header_menu: 0,
        header_id: 0,
        parent_id: 0,
        lang: "en",
      },
      {
        id: 0,
        name: "",
        title: "",
        description: "",
        meta_title: "",
        image_path: "",
        meta_description: "",
        display_header_menu: 0,
        header_id: 0,
        parent_id: 0,
        lang: "ar",
      },
    ],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },
  },

  created() {},
  mounted() {
    this.fetchParentCategories();
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
                "edit-category/" +
                this.$route.query.slug
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.category = res.data.category;
                this.loader = false;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            });
        }
      },
    },
  },

  methods: {
    uploaded_image(img_src) {
      //alert('uploaded image');
      //alert(img_src);
      if (this.tabs == 1) {
        this.category[0].image_path = img_src;
      } else {
        this.category[1].image_path = img_src;
      }
    },
    uploadFile() {
      //alert('hai');
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    updateParent(lang, value) {
      if (lang == "en") {
        if (value == 0) {
          this.category[1].parent_id = 0;
        } else {
          let header = this.category_en.filter((record) => record.id === value);
          let pr_id = this.category_ar.filter(
            (record) => record.header_id === header[0].header_id
          );
          this.category[1].parent_id = pr_id[0].id;
        }
      } else {
        if (value == 0) {
          this.category[0].parent_id = 0;
        } else {
          let header = this.category_ar.filter((record) => record.id === value);
          let pr_id = this.category_en.filter(
            (record) => record.header_id === header[0].header_id
          );
          this.category[0].parent_id = pr_id[0].id;
        }
      }
    },
    fetchParentCategories() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-parent-categories")
        .then((res) => {
          this.category_en = res.data.category_en;
          this.category_ar = res.data.category_ar;

          const default_en = {
            id: 0,
            name: this.$t("select_en"),
            header_id: 0,
          };
          const default_ar = {
            id: 0,
            name: this.$t("select_ar"),
            header_id: 0,
          };

          this.category_en = [default_en, ...this.category_en];
          this.category_ar = [default_ar, ...this.category_ar];
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    submit() {
      if (this.category.description == "") {
        this.quill_item = true;
      }
      if (this.category.description_ar == "") {
        this.quill_item_ar = true;
      }
      if (this.$refs.form.validate() && this.valid == true) {
        if (
          this.category.description == "" ||
          this.category.description_ar == ""
        ) {
          return;
        }
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-category",
            this.category
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
                name: "categories",
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
    onEditorChange(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    onEditorChangeAR(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    onEditorBlur() {
      // console.log(event.options);
      if (this.category.description == "") {
        this.quill_item = true;
      }
    },
    onEditorBlurAR(event) {
      console.log(event.options);
      if (this.category.description_ar == "") {
        this.quill_item = true;
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
  <style scoped>
#quill_item {
  border: 1px solid #b00020;
}
#quill_item_border {
  border: 1px solid #d1d5db;
}
</style>
    