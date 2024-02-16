<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_products')"
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
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('store')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[0].store_id"
                      v-bind:label="$t('store')"
                      variant="outlined"
                      density="compact"
                      :items="stores_en"
                      item-title="name"
                      item-value="id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
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
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[0].description"
                      :rules="fieldRules"
                      maxlength="2000"
                      v-bind="props"
                      class="required_field"
                      v-bind:label="$t('description_en')"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="$t('sequence_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[0].seq"
                      maxlength="100"
                      v-bind:label="$t('sequence_en')"
                      required
                      variant="outlined"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
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
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>

              <v-col md="4">
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
                      maxlength="100"
                      v-bind="props"
                      v-bind:label="$t('meta_description_en')"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("meta_description_en") }}</span>
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
                          v-if="products[0].image_path != null"
                          :src="envImagePath + products[0].image_path"
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
                    @click="downloadImage(products[0].image_path)"
                  >
                    <span
                      v-if="products[0].image_path"
                      class="download_btn_color"
                      >{{ $t("download") }}</span
                    >
                  </a>
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
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form ref="form" v-model="valid">
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('store_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[1].store_id"
                      v-bind:label="$t('store_ar')"
                      variant="outlined"
                      density="compact"
                      :items="stores_ar"
                      item-title="name"
                      class="required_field rtl"
                      item-value="id"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[1].title"
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
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[1].description"
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
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="$t('sequence_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[1].seq"
                      maxlength="100"
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
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[1].meta_title"
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

              <v-col md="4">
                <v-tooltip
                  :text="this.$t('meta_description_ar')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[1].meta_description"
                      :rules="fieldRules"
                      maxlength="2000"
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
              <v-col md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-if="products[1].image_path != null"
                          :src="envImagePath + products[1].image_path"
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
                    @click="downloadImage(products[1].image_path)"
                  >
                    <span
                      v-if="products[1].image_path"
                      class="download_btn_color"
                      >{{ $t("download") }}</span
                    >
                  </a>
                </div>
                <br />
                <Imageupload
                  :folder="'products'"
                  :resizewidth="0.4"
                  :resizeheight="0.1"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfile"
                />
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
    isDisabled: false,
    checkbox_value: false,
    uploadfile: false,
    products: [
      {
        id: 0,
        title: "",
        store_id: null,
        description: "",
        start_date: "",
        end_date: "",
        image_path: null,
        meta_title: "",
        meta_description: "",
        lang: "en",
      },
      {
        id: 0,
        title: "",
        store_id: null,
        description: "",
        start_date: "",
        end_date: "",
        image_path: null,
        meta_title: "",
        meta_description: "",
        lang: "ar",
      },
    ],
    stores_en: [],
    stores_ar: [],

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
  },
  mounted() {
    this.get_stores();
  },
  created() {},
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
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
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
    uploaded_image(img_src) {
      //alert('uploaded image');
      //alert(img_src);
      if (this.tabs == 1) {
        this.products[0].image_path = img_src;
      } else {
        this.products[1].image_path = img_src;
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
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
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
