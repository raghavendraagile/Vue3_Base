<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_amend_home_slider')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-tabs
          v-model="tabs"
          color="blue"
          @update:modelValue="have_noimage = false"
        >
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
                          v-model="home_slider[0].store_id"
                          v-bind:label="$t('mall_en')"
                          @update:modelValue="(value) => updateStore(value)"
                          variant="outlined"
                          density="compact"
                          :disabled="user.rolename == 'MallAdmin'"
                          :loading="store_loader"
                          :items="stores_en"
                          item-title="name"
                          item-value="header_id"
                          class="required_field"
                          :rules="fieldRules"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('title_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[0].title"
                          maxlength="100"
                          v-bind:label="$t('title_en')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('action_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[0].action"
                          maxlength="100"
                          v-bind:label="$t('action_en')"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('target_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-if="home_slider[0].action != ''"
                          v-model="home_slider[0].target"
                          v-bind:label="$t('target_en')"
                          variant="outlined"
                          density="compact"
                          :items="targets_en"
                          :rules="fieldRules"
                          class="required_field"
                          item-title="shortname"
                          item-value="shortname"
                        ></v-autocomplete>
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
                            class="hide_quill_input"
                            v-bind:id="
                              quill_item == true
                                ? 'quill_item'
                                : 'quill_item_border'
                            "
                            v-model:value="home_slider[0].description"
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
                  <v-col cols="12" sm="2" md="2">
                    <v-tooltip :text="$t('sequence_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[0].seq"
                          maxlength="100"
                          v-bind:label="$t('sequence_en')"
                          class="required_field rtl"
                          required
                          :rules="[...fieldRules, ...seqRules]"
                          variant="outlined"
                          density="compact"
                          v-on:keypress="NumbersOnly"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="2" md="2">
                    <div>
                      <div
                        class="image-container"
                        v-bind:class="[have_noimage ? 'errorborder' : '']"
                      >
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="
                                home_slider[0].image == '' ||
                                home_slider[0].image == null
                              "
                              src="@/assets/images/upload_image_default.png"
                              width="100"
                            />
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-else
                              :src="envImagePath + home_slider[0].image"
                              width="100"
                              height="65
                          "
                              alt
                            />
                            <div v-show="isHovering" class="camera-icon">
                              <v-icon @click="uploadFile">mdi-camera</v-icon>
                            </div>
                          </div>
                        </v-hover>
                      </div>
                      <a
                        class="text-center pointer"
                        @click="downloadImage(home_slider[0].image)"
                      >
                        <span
                          v-if="home_slider[0].image"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                      <span>
                        <v-icon
                          small
                          v-if="home_slider[0].image"
                          class="mr-2 edit_btn icon_size delete_icon"
                          @click="removeImage(0)"
                          >mdi mdi-trash-can-outline</v-icon
                        >
                      </span>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'home_slider'"
                      :resizewidth="'2000px'"
                      :resizeheight="'400px'"
                      :no_image_trans="'en'"
                      :no_image="have_noimage"
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
          <v-window-item :value="2" style="direction: rtl">
            <v-form ref="form" v-model="valid">
              <v-layout>
                <v-row class="px-6 mt-2">
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
                          v-model="home_slider[1].store_id"
                          v-bind:label="$t('mall_ar')"
                          @update:modelValue="(value) => updateStore(value)"
                          variant="outlined"
                          density="compact"
                          :disabled="user.rolename == 'MallAdmin'"
                          :loading="store_loader"
                          :items="stores_ar"
                          item-title="name"
                          item-value="header_id"
                          class="required_field"
                          :rules="fieldRules"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[1].title"
                          class="rtl"
                          maxlength="100"
                          v-bind:label="$t('title_ar')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('action_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[1].action"
                          maxlength="100"
                          class="rtl"
                          v-bind:label="$t('action_ar')"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-tooltip :text="$t('target_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-if="home_slider[1].action != ''"
                          v-model="home_slider[1].target"
                          v-bind:label="$t('target_ar')"
                          variant="outlined"
                          density="compact"
                          :rules="fieldRulesAR"
                          class="required_field rtl"
                          :items="targets_ar"
                          item-title="shortname"
                          item-value="shortname"
                        ></v-autocomplete>
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
                          <quill-editor
                            class="hide_quill_input"
                            v-bind:id="
                              quill_item == true
                                ? 'quill_item'
                                : 'quill_item_border'
                            "
                            v-model:value="home_slider[1].description"
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
                <v-row class="mt-2 px-6 arabdirection" max-width="344">
                  <v-col cols="12" sm="2" md="2">
                    <v-tooltip :text="$t('sequence_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[1].seq"
                          maxlength="100"
                          v-bind:label="$t('sequence_ar')"
                          required
                          class="required_field rtl"
                          :rules="[...fieldRulesAR, ...seqRulesAR]"
                          variant="outlined"
                          density="compact"
                          v-on:keypress="NumbersOnly"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <div>
                      <div
                        class="image-container"
                        v-bind:class="[have_noimage ? 'errorborder' : '']"
                      >
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="
                                home_slider[1].image == '' ||
                                home_slider[1].image == null
                              "
                              src="@/assets/images/upload_image_default.png"
                              width="100"
                            />
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-else
                              :src="envImagePath + home_slider[1].image"
                              width="100"
                              height="65
                          "
                              alt
                            />
                            <div v-show="isHovering" class="camera-icon">
                              <v-icon @click="uploadFile">mdi-camera</v-icon>
                            </div>
                          </div>
                        </v-hover>
                      </div>
                      <a
                        class="text-center pointer"
                        @click="downloadImage(home_slider[1].image)"
                      >
                        <span
                          v-if="home_slider[1].image"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                      <span>
                        <v-icon
                          small
                          v-if="home_slider[1].image"
                          class="mr-2 edit_btn icon_size delete_icon_ar"
                          @click="removeImage(1)"
                          >mdi mdi-trash-can-outline</v-icon
                        >
                      </span>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'home_slider'"
                      :resizewidth="'2000px'"
                      :resizeheight="'400px'"
                      :no_image_trans="'ar'"
                      :no_image="have_noimage"
                      :viewmodeslider="3"
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
import Imageupload from "../../CustomComponents/ImageUploadSlider.vue";
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
      icon_name: "transition_push",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: true,
    successmessage: "",
    message: "",
    have_noimage: false,
    valid_error: false,
    file: "",
    sel_lang: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    tabs: 1,
    uploadfile: false,
    uploadfilear: false,
    user: "",
    store_loader: false,
    mall_id: null,
    stores_en: [],
    stores_ar: [],
    home_slider: [
      {
        id: 0,
        title: "",
        description: "",
        image: "",
        action: "",
        target: "",
        header_id: 0,
        lang: "en",
        seq: null,
      },
      {
        id: 0,
        title: "",
        description: "",
        image: "",
        action: "",
        blank: "",
        header_id: 0,
        lang: "ar",
        seq: null,
      },
    ],
    targets_en: [
      {
        id: 0,
        shortname: "Blank",
        longname: "Blank",
      },
      {
        id: 0,
        shortname: "Existing",
        longname: "Existing",
      },
    ],
    targets_ar: [
      {
        id: 0,
        shortname: "فارغ",
        longname: "فارغ",
      },
      {
        id: 0,
        shortname: "موجود",
        longname: "موجود",
      },
    ],
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

    phoneRules() {
      return [
        (v) => (v >= 0 && v <= 999999999999) || this.$t("number_required"),
      ];
    },
    seqRules() {
      return [(v) => (v >= 0 && v <= 9999999) || this.$t("number_required")];
    },
    seqRulesAR() {
      return [(v) => (v >= 0 && v <= 9999999) || this.$t("number_required_ar")];
    },
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  mounted() {
    this.fetchMall();
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
                "edit-home-sliders/" +
                this.$route.query.slug
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.home_slider = res.data.home_slider;
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
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab) {
          if (this.$route.query.s_tab == 1) {
            this.tabs = 1;
          } else {
            this.tabs = 2;
          }
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
    removeImage(index) {
      if (index == 1) {
        this.home_slider[1].image = null;
      } else {
        this.home_slider[0].image = null;
      }
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
    uploaded_image(img_src) {
      if (this.tabs == 1) {
        this.home_slider[0].image = img_src;
        this.have_noimage = false;
      } else {
        this.home_slider[1].image = img_src;
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
    submit() {
      if (this.home_slider.description == "") {
        this.quill_item = true;
      }
      if (this.home_slider.description_ar == "") {
        this.quill_item_ar = true;
      }
      if (
        this.$refs.form.validate() &&
        this.valid == true &&
        ((this.tabs == 1 &&
          this.home_slider[0].image != "" &&
          this.home_slider[0].image != null) ||
          (this.tabs == 2 &&
            this.home_slider[1].image != "" &&
            this.home_slider[1].image != null))
      ) {
        if (
          this.home_slider.description == "" ||
          this.home_slider.description_ar == ""
        ) {
          return;
        }
        this.have_noimage = false;
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-home-slider",
            this.home_slider
          )
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "home-sliders",
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
          })
          .finally(() => {
            this.isDisabled = false;
            this.isBtnLoading = false;
          });
      } else {
        if (
          (this.tabs == 1 &&
            (this.home_slider[0].image == "" ||
              this.home_slider[0].image == null)) ||
          (this.tabs == 2 &&
            (this.home_slider[1].image == "" ||
              this.home_slider[1].image == null))
        ) {
          this.have_noimage = true;
        }
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
      if (this.home_slider.description == "") {
        this.quill_item = true;
      }
    },
    onEditorBlurAR(event) {
      console.log(event.options);
      if (this.home_slider.description_ar == "") {
        this.quill_item = true;
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    updateStore(store) {
      if (this.tabs == 1) {
        this.home_slider[1].store_id = store;
      } else {
        this.home_slider[0].store_id = store;
      }
    },
    fetchMall() {
      this.initval = true;
      this.store_loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-malls")
        .then((response) => {
          console.log(response);
          this.stores_en = response.data.malls_en;
          this.stores_ar = response.data.malls_ar;
          if (this.user.rolename == "MallAdmin" && !this.$route.query.slug) {
            this.stores_en.filter((ele) => {
              if (ele.header_id === this.user.store_id) {
                this.home_slider[0].store_id = ele.header_id;
                this.home_slider[1].store_id = ele.header_id;
                this.mall_id = ele.header_id;
              }
            });
            this.store_loader = false;
          }
        })
        .catch((err) => {
          console.log(err);
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

.errorborder {
  border: solid red 2px;
  text-align: center;
}
.arabdirection /deep/ .v-messages__message {
  text-align: right !important;
}
.arabdirection /deep/ .v-field {
  direction: rtl !important;
}
.delete_icon_ar {
  position: relative;
  right: 35px;
  bottom: 90px;
}
.delete_icon {
  position: relative;
  left: 45px;
  bottom: 90px;
}
</style>
