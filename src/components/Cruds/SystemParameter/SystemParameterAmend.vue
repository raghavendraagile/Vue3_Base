<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_system_parameter')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6" v-if="system_params.parameter_name == 'APP_LOGO'">
            <!-- :value="system_params.is_file_upload" -->
            <v-col md="6">
              <!-- <v-checkbox
                  class="larger"
                  v-model="system_params.is_file_upload"
                  @click="uploadImagestatus(system_params.is_file_upload)"
                />
                {{ $t("is_file_upload") }}       v-bind:label="$t("is_file_upload")" -->
              <v-checkbox
                v-model="system_params.is_file_upload"
                v-bind:label="$t('is_file_upload')"
                color="green"
                @click="uploadImagestatus(system_params.is_file_upload)"
                :value="1"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col cols="12" md="6">
              <v-tooltip :text="this.$t('parameter_name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="system_params.parameter_name"
                    :rules="fieldRules"
                    v-bind:label="$t('parameter_name')"
                    required
                    v-bind="props"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col md="6" v-if="system_params.is_file_upload == false">
              <v-tooltip :text="this.$t('parameter_value')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="system_params.parameter_value"
                    :rules="fieldRules"
                    v-bind="props"
                    v-bind:label="$t('parameter_value')"
                    required
                    class="required_field"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col
              md="6"
              v-if="
                system_params.is_file_upload == true &&
                system_params.parameter_name == 'APP_LOGO'
              "
            >
              <div>
                <div class="image-container">
                  <v-hover v-slot="{ isHovering, props }">
                    <div style="position: relative" v-bind="props">
                      <img
                        v-bind:style="
                          isHovering == true ? 'filter: blur(1px);' : ''
                        "
                        v-if="system_params.parameter_value != null"
                        :src="envImagePath + system_params.parameter_value"
                        width="100"
                        height="85
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
                <v-tooltip :text="this.$t('download')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <a class="text-center pointer download_icon">
                      <span
                        ><v-icon
                          v-if="
                            system_params.parameter_value &&
                            system_params.parameter_name == 'APP_LOGO' &&
                            system_params.is_file_upload == true
                          "
                          v-bind="props"
                          class="mr-2"
                          @click="downloadImage(system_params.parameter_value)"
                          >mdi mdi-download</v-icon
                        ></span
                      >
                    </a>
                  </template>
                </v-tooltip>
                <span
                  v-if="
                    system_params.parameter_value &&
                    system_params.parameter_name == 'APP_LOGO' &&
                    system_params.is_file_upload == true
                  "
                >
                  <v-tooltip :text="this.$t('delete')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-on="on"
                        v-bind="props"
                        small
                        class="mr-2 edit_btn icon_size delete_icon"
                        @click="removeImage"
                        >mdi mdi-trash-can-outline</v-icon
                      >
                    </template>
                  </v-tooltip></span
                >
              </div>
              <br />
              <Imageupload
                :folder="'user_profile'"
                :resizewidth="400"
                :resizeheight="150"
                @uploaded_image="uploaded_image"
                :upload_profile="uploadfile"
              />
            </v-col>
          </v-row>
          <v-layout class="pt-3">
            <v-row class="px-6">
              <v-col md="12">
                <v-tooltip :text="this.$t('description')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-bind="props"
                      v-model="system_params.description"
                      :rules="fieldRules"
                      v-bind:label="$t('description')"
                      required
                      counter="250"
                      counter-value="250"
                      maxlength="250"
                      class="required_field"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("description") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="cancel"
                :disabled="isDisabled"
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
                :disabled="
                  system_params.parameter_value == '' ||
                  system_params.parameter_value == null
                    ? isSubmitDisabled == false
                    : isSubmitDisabled == true
                "
                :loading="isDisabled"
                @click="submit"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}
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
import Imageupload from "../../CustomComponents/ImageUpload.vue";
import localStorageWrapper from "../../../localStorageWrapper.js";
export default {
  components: { PageTitle, Imageupload },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: false,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    isSubmitDisabled: false,
    checkbox_value: false,
    system_params: {
      id: 0,
      parameter_name: "",
      parameter_value: "",
      description: "",
      is_file_upload: false,
    },
    noimagepreview: "",
    uploadfile: false,
    items: [],
    sel_lang: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_system_params/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.system_params = res.data.systemparameter;
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
  },
  methods: {
    cancel() {
      this.$router.push({
        name: "system_parameter",
      });
    },
    uploaded_image(img_src) {
      this.system_params.parameter_value = img_src;
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_system_params",
            this.system_params
          )
          .then((res) => {
            this.btnloading = false;
            let app_image_url = res.data.systemparameter.image_full_url;
            if (app_image_url) {
              localStorageWrapper.setItem("App_Image_Url", app_image_url);
              this.emitter.emit("app_image_update");
            }
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "system_parameter",
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
      }
    },
    //  addfilename(filename) {
    //   this.upload_cv.filename = filename;
    // },
    //  fileExtension(file_extension) {
    //   this.upload_cv.mime_type = file_extension;
    // },
    uploadImagestatus(value) {
      if (value == false) {
        this.system_params.is_file_upload = true;
      } else {
        this.system_params.is_file_upload = false;
      }
    },
    updateFile(filepath) {
      this.system_params.parameter_value = filepath;

      // this.updateCV();
    },

    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    clear() {
      this.$refs.form.reset();
    },
    removeImage() {
      this.system_params.parameter_value = null;
      this.isSubmitDisabled = false;
      this.$router.push({
        name: "system_parameter_amend",
      });
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}
/* .image-container {
  max-width: 110px;
  border: 1px double black;
  border-radius: 3px;
} */
.camera-icon {
  position: absolute;
  bottom: 20px;
  left: 40px;
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
  border: 2px solid black;
  padding: 1px;
}
.delete_icon {
  position: relative;
  left: 83px;
  bottom: 90px;
}
.download_icon {
  position: relative;
  left: 116px;
  bottom: 52px;
}
</style>
