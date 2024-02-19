<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
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
              <v-col cols="12" sm="12" md="4" class="ml-3 pr-5">
                <v-tooltip :text="this.$t('mall_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-if="user_role == 'SuperUser'"
                      v-bind="props"
                      v-model="category[0].store_id"
                      @update:modelValue="(value) => updateMall(value)"
                      v-bind:label="$t('mall_en')"
                      variant="outlined"
                      density="compact"
                      :items="malls_en"
                      item-title="name"
                      item-value="header_id"
                      class="required_field"
                      :rules="fieldRules"
                      required
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('name_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateParent('en', value)
                          "
                          v-model="category[0].parent_id"
                          v-bind:label="$t('parent_category_en')"
                          variant="outlined"
                          density="compact"
                          :items="category_en"
                          item-title="name"
                          item-value="header_id"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('name_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].name"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('name_en')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('title_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].title"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('title_en')"
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
                      $t("description_en")
                    }}</v-card-title>
                    <v-tooltip :text="$t('description_en')" location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props">
                          <quill-editor
                            :options="editorOptions_en"
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
                    <v-tooltip
                      :text="this.$t('meta_title_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].meta_title"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="70"
                          counter="true"
                          v-bind:label="$t('meta_title_en')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col md="12">
                    <v-tooltip
                      :text="this.$t('meta_description_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          v-on="on"
                          rows="2"
                          v-model="category[0].meta_description"
                          v-bind="props"
                          :rules="descriptionRules"
                          v-bind:label="$t('meta_description_en')"
                          required
                          class="required_field"
                          variant="outlined"
                          maxlength="160"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-tooltip :text="$t('sequence_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[0].seq"
                          maxlength="100"
                          :rules="phoneRules"
                          v-bind:label="$t('sequence_en')"
                          required
                          variant="outlined"
                          density="compact"
                          v-on:keypress="NumbersOnly"
                        ></v-text-field>
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
                        class="text-center"
                        style="cursor: pointer"
                        @click="downloadImage(category[0].image_path)"
                      >
                        <span
                          v-if="category[0].image_path"
                          class="download_btn_color"
                          >{{ $t("download_en") }}</span
                        >
                      </a>
                    </div>

                    <br />
                    <Imageupload
                      :folder="'category'"
                      :resizewidth="150"
                      :resizeheight="100"
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
              <v-row class="arabdirection">
                <v-col cols="12" sm="12" md="4" class="mx-6">
                  <v-tooltip :text="this.$t('mall_ar')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-if="user_role == 'SuperUser'"
                        v-bind="props"
                        v-model="category[1].store_id"
                        @update:modelValue="(value) => updateMall(value)"
                        v-bind:label="$t('mall_ar')"
                        variant="outlined"
                        density="compact"
                        :items="malls_ar"
                        item-title="name"
                        item-value="header_id"
                        class="required_field"
                        :rules="fieldRulesAR"
                        required
                      ></v-autocomplete>
                    </template>
                  </v-tooltip> </v-col
              ></v-row>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip
                      :text="$t('parent_category_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          @update:modelValue="
                            (value) => updateParent('ar', value)
                          "
                          v-bind="props"
                          v-model="category[1].parent_id"
                          v-bind:label="$t('parent_category_ar')"
                          variant="outlined"
                          density="compact"
                          :items="category_ar"
                          item-title="name"
                          item-value="header_id"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('name_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].name"
                          :rules="fieldRulesAR"
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
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].title"
                          :rules="fieldRulesAR"
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
                <v-row class="px-6 pt-0 arabdirection">
                  <v-col cols="12" md="12" lg="12" sm="12" class="pt-0">
                    <v-card-title class="text-right" style="font-size: 17px">{{
                      $t("description_ar")
                    }}</v-card-title>
                    <v-tooltip :text="$t('description_ar')" location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props">
                          <!-- @ready="setRtlDirection" -->
                          <quill-editor
                            :options="editorOptions"
                            class="arabclassquill"
                            v-bind:id="
                              quill_item == true
                                ? 'quill_item'
                                : 'quill_item_border'
                            "
                            v-model:value="category[1].description"
                            @blur="onEditorBlurAR($event)"
                            @focus="onEditorFocusAR($event)"
                            @ready="setRtlDirection"
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
                <v-row class="mt-2 px-6 arabdirection" max-width="344">
                  <v-col md="12">
                    <v-tooltip
                      :text="this.$t('meta_title_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].meta_title"
                          :rules="fieldRulesAR"
                          class="required_field rtl"
                          maxlength="70"
                          counter="true"
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
                          :rules="descriptionRulesAr"
                          v-bind:label="$t('meta_description_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          maxlength="160"
                          counter="true"
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <v-tooltip :text="$t('sequence_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="category[1].seq"
                          maxlength="100"
                          :rules="phoneRules"
                          v-bind:label="$t('sequence_ar')"
                          required
                          variant="outlined"
                          density="compact"
                          v-on:keypress="NumbersOnly"
                        ></v-text-field>
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
                        style="cursor: pointer"
                        @click="downloadImage(category[1].image_path)"
                      >
                        <span
                          v-if="category[1].image_path"
                          class="download_btn_color"
                          >{{ $t("download_ar") }}</span
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
          <v-col md="12">
            <div>
              <v-tooltip
                :text="
                  tabs == 1
                    ? $t('display_in_header_menu')
                    : $t('display_in_header_menu_ar')
                "
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-switch
                    v-bind:style="tabs == 1 ? 'direction:ltr' : 'direction:rtl'"
                    v-bind="props"
                    color="blue"
                    :model-value="category[0].display_header_menu === 1"
                    @update:model-value="
                      (value) =>
                        (category[0].display_header_menu = value ? 1 : 0)
                    "
                    hide-details
                    inset
                    :label="
                      tabs == 1
                        ? $t('display_in_header_menu')
                        : $t('display_in_header_menu_ar')
                    "
                  ></v-switch>
                </template>
              </v-tooltip>
            </div>
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
                  @click="cancel()"
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
    malls_en: [],
    malls_ar: [],
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    editorOptions: {
      theme: "snow",
      direction: "rtl",
      placeholder: "أدخل المحتوى هنا",
    },
    editorOptions_en: {
      theme: "snow",
      placeholder: "Enter the content here",
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
        image_path: null,
        seq: "",
        meta_description: "",
        display_header_menu: 0,
        header_id: 0,
        parent_id: null,
        lang: "en",
        store_id: null,
      },
      {
        id: 0,
        name: "",
        title: "",
        description: "",
        meta_title: "",
        image_path: null,
        seq: "",
        meta_description: "",
        display_header_menu: 0,
        header_id: 0,
        parent_id: null,
        lang: "ar",
        store_id: null,
      },
    ],
    user_role: "",
    sel_lang: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAR() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },
    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },
    descriptionRulesAr() {
      return [(v) => !!v || this.$t("description_required_ar")];
    },
  },

  mounted() {
    this.fetchParentCategories();
    this.user_role = JSON.parse(localStorage.getItem("user_data")).rolename;
    const storeid = JSON.parse(localStorage.getItem("user_data")).store_id;

    this.get_malls();
    if (this.user_role == "MallAdmin") {
      this.category[0].store_id = storeid;
      this.category[1].store_id = storeid;
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
    updateMall(categories) {
      if (this.tabs == 1) {
        this.category[1].store_id = categories;
      } else {
        this.category[0].store_id = categories;
      }
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
    get_malls() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-malls")
        .then((response) => {
          console.log(response);
          this.malls_en = response.data.malls_en;
          this.malls_ar = response.data.malls_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setRtlDirection(quill) {
      quill.on("text-change", () => {
        const text = quill.getText();
        const rtlChar = /[\u0590-\u05FF\u0600-\u06FF]/;
        console.log("rtl char ", rtlChar);
        if (rtlChar.test(text)) {
          quill.root.setAttribute("dir", "rtl");
        } else {
          quill.root.setAttribute("dir", "ltr");
        }
      });
    },
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
        this.category[1].parent_id = value;
      } else {
        this.category[0].parent_id = value;
      }
    },
    fetchParentCategories() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-parent-categories")
        .then((res) => {
          this.category_en = res.data.category_en;
          this.category_ar = res.data.category_ar;

          const default_en = {
            id: null,
            name: this.$t("select_en"),
            header_id: null,
          };
          const default_ar = {
            id: null,
            name: this.$t("select_ar"),
            header_id: null,
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
    cancel() {
      this.$router.push({
        name: "categories",
      });
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
.ql-container.ql-snow {
  direction: rtl;
  text-align: right;
}

.ql-editor {
  direction: rtl !important;
  text-align: right !important;
}
.arabdirection /deep/ .v-field {
  direction: rtl !important;
}
.arabclassquill /deep/ .ql-editor {
  text-align: justify !important;
}
.arabdirection /deep/ .v-messages__message {
  text-align: right !important;
}
</style>
