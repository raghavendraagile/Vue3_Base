<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_amend_home_slider')"
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
                    <v-tooltip :text="$t('title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[0].title"
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
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('action')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[0].action"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('action')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('target')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="home_slider[0].target"
                          v-bind:label="$t('target')"
                          variant="outlined"
                          density="compact"
                          :items="targets_en"
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
                  <v-col cols="2" sm="2" md="2">
                    <v-tooltip :text="$t('sequence')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[0].seq"
                          :rules="phoneRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('sequence')"
                          required
                          variant="outlined"
                          density="compact"
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
                              v-if="home_slider[0].image != ''"
                              :src="envImagePath + home_slider[0].image"
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
                        @click="downloadImage(home_slider[0].image)"
                      >
                        <span
                          v-if="home_slider[0].image"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'home_slider'"
                      :resizewidth="1.3"
                      :resizeheight="1"
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
                    <v-tooltip :text="$t('title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[1].title"
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
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('action')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[1].action"
                          :rules="fieldRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('action')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="6" sm="12" md="4">
                    <v-tooltip :text="$t('target')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="home_slider[1].target"
                          v-bind:label="$t('target')"
                          variant="outlined"
                          density="compact"
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
                <v-row class="px-6 pt-0">
                  <v-col cols="12" md="12" lg="12" sm="12" class="pt-0">
                    <v-card-title class="text-left" style="font-size: 17px">{{
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
                <v-row class="mt-2 px-6" max-width="344">
                  <v-col cols="2" sm="2" md="2">
                    <v-tooltip :text="$t('sequence_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="home_slider[1].seq"
                          :rules="phoneRules"
                          class="required_field"
                          maxlength="100"
                          v-bind:label="$t('sequence_ar')"
                          required
                          variant="outlined"
                          density="compact"
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
                              v-if="home_slider[1].image != ''"
                              :src="envImagePath + home_slider[1].image"
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
                        @click="downloadImage(home_slider[1].image)"
                      >
                        <span
                          v-if="home_slider[1].image"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'home_slider'"
                      :resizewidth="1.3"
                      :resizeheight="1"
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
    valid_error: false,
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    tabs: 1,
    uploadfile: false,
    uploadfilear: false,
    home_slider: [
      {
        id: 0,
        title: "",
        description: "",
        image: "",
        header_id: 0,
        lang: "en",
      },
      {
        id: 0,
        title: "",
        description: "",
        image: "",
        header_id: 0,
        lang: "ar",
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

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },

    phoneRules() {
      return [
        (v) => (v >= 0 && v <= 999999999999) || this.$t("number_required"),
      ];
    },
  },

  created() {},
  mounted() {},

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
  },

  methods: {
    uploaded_image(img_src) {
      if (this.tabs == 1) {
        this.home_slider[0].image = img_src;
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
      if (this.$refs.form.validate() && this.valid == true) {
        if (
          this.home_slider.description == "" ||
          this.home_slider.description_ar == ""
        ) {
          return;
        }
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-home_slider",
            this.home_slider
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
</style>
    