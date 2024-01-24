<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_lookup')"
        :google_icon="google_icon"
      ></page-title>
    </div>

    <div class="card-body">
      <content-loader v-if="loader"></content-loader>
      <v-tabs v-model="tabs" color="blue">
        <v-tab :value="1" @click="checkUploadImage">
          <span>{{ $t("english") }}</span>
        </v-tab>
        <v-tab :value="2" @click="checkUploadImage">
          <span>{{ $t("arabic") }}</span>
        </v-tab>
      </v-tabs>
      <v-window v-model="tabs">
        <!-- ENGLISH TAB STARTS -->
        <v-window-item :value="1">
          <v-form ref="form" v-model="valid">
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col md="6">
                <v-tooltip :text="this.$t('shortname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.shortname"
                      :disabled="lookup.id == 0 ? disabled : ''"
                      v-bind="props"
                      :rules="fieldRules"
                      v-bind:label="$t('shortname')"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="6">
                <v-tooltip :text="this.$t('longname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.longname"
                      v-bind="props"
                      :rules="fieldRules"
                      v-bind:label="$t('longname')"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-layout>
              <v-row class="mx-auto mt-2" max-width="344">
                <v-col md="12">
                  <v-tooltip :text="this.$t('description')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        v-on="on"
                        rows="2"
                        v-model="lookup.description"
                        v-bind="props"
                        :rules="fieldRules"
                        v-bind:label="$t('description')"
                        required
                        class="required_field"
                        variant="outlined"
                        maxlength="100"
                        counter="true"
                      ></v-textarea>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-layout>
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col md="6" v-if="enable_upload_image == 1">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-if="lookup.icon != ''"
                          :src="envImagePath + lookup.icon"
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
                    @click="downloadImage(lookup.icon)"
                  >
                    <span v-if="lookup.icon" class="download_btn_color">{{
                      $t("download")
                    }}</span>
                  </a>
                </div>
                <br />
                <Imageupload
                  :folder="'lookups'"
                  :resizewidth="0.4"
                  :resizeheight="0.1"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfile"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form ref="form" v-model="valid">
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col md="6">
                <v-tooltip :text="this.$t('shortname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.shortname_ar"
                      :disabled="lookup.shortname_ar != '' ? disabled : ''"
                      v-bind="props"
                      :rules="fieldRules"
                      v-bind:label="$t('shortname')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="6">
                <v-tooltip :text="this.$t('longname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.longname_ar"
                      v-bind="props"
                      :rules="fieldRules"
                      v-bind:label="$t('longname')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-layout>
              <v-row class="mx-auto mt-2" max-width="344">
                <v-col md="12">
                  <v-tooltip :text="this.$t('description')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        v-on="on"
                        rows="2"
                        v-model="lookup.description_ar"
                        v-bind="props"
                        :rules="fieldRules"
                        v-bind:label="$t('description')"
                        required
                        class="required_field rtl"
                        variant="outlined"
                        maxlength="100"
                        counter="true"
                      ></v-textarea>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-layout>
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-if="lookup.icon_ar != '' && lookup.icon_ar != null"
                          :src="envImagePath + lookup.icon_ar"
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
                          <v-icon @click="uploadFile_ar">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                  <a
                    class="text-center pointer"
                    @click="downloadImage(lookup.icon_ar)"
                  >
                    <span v-if="lookup.icon_ar" class="download_btn_color">{{
                      $t("download")
                    }}</span>
                  </a>
                </div>
                <br />
                <Imageupload
                  :folder="'lookups'"
                  :resizewidth="0.4"
                  :resizeheight="0.1"
                  @uploaded_image="uploaded_image_ar"
                  :upload_profile="uploadfile_ar"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
      </v-window>
      <!--  ARABIC TAB ENDS-->
    </div>
    <div class="d-block mr-4 mt-3 pb-3 text-right">
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
</template>

<script>
import Imageupload from "../../CustomComponents/ImageUpload.vue";
export default {
  components: { Imageupload },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    lookup: {
      id: 0,
      shortname: "",
      longname: "",
      description: "",
      parentslug: "",
      shortname_ar: "",
      longname_ar: "",
      description_ar: "",
      icon: "",
      icon_ar: "",
    },
    noimagepreview: "",
    items: [],
    parentlookup: [],
    tabs: 1,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    enable_upload_image: 1,
    uploadfile: false,
    uploadfile_ar: false,
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
                "lookups/" +
                this.$route.query.slug +
                "/edit"
            )
            .then((res) => {
              this.lookup = res.data.lookup;
              // this.lookup.parentslug = this.lookup.parentlookup.slug;
              this.parentlookup = this.lookup.parentlookup;
              this.loader = false;
            });
        }
      },
    },
    "$route.query.parentslug": {
      immediate: true,
      handler() {
        if (this.$route.query.parentslug) {
          this.lookup.parentslug = this.$route.query.parentslug;
          this.fetchparentlookup();
        }
      },
    },
  },
  methods: {
    checkUploadImage() {
      this.enable_upload_image = this.tabs;
      // alert(this.enable_upload_image);
    },
    uploaded_image(img_src) {
      this.lookup.icon = img_src;
    },
    uploaded_image_ar(img_src_ar) {
      this.lookup.icon_ar = img_src_ar;
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    uploadFile_ar() {
      if (this.uploadfile_ar == false) {
        this.uploadfile_ar = true;
      } else {
        this.uploadfile_ar = false;
      }
    },
    updateFile(filepath) {
      this.lookup.icon = filepath;
    },
    updateFile_ar(filepath_ar) {
      this.lookup.icon_ar = filepath_ar;
    },

    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_child_lookups",
            this.lookup
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
              this.lookup.slug = res.data.lookups.slug;
              this.$router.push({
                name: "child_lookup",
                query: {
                  slug: this.parentlookup.slug,
                  parentname: this.parentlookup.shortname,
                },
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
      } else {
        //alert("Form is Invalid");
      }
    },
    fetchparentlookup() {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "fetch_parent_lookup", {
          slug: this.lookup.parentslug,
        })
        .then((res) => {
          this.parentlookup = res.data.lookups;
          this.loader = false;
        });
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
