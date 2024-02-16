<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0" v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '',]">
      <page-title class="col-md-4 ml-2" :heading="$t('create_promotion')" :google_icon="google_icon"></page-title>
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
                    <v-autocomplete v-bind="props" v-model="promotions[0].store_id"
                      @update:modelValue="(value) => updateMall(value)" v-bind:label="$t('store_en')" variant="outlined"
                      density="compact" :items="stores_en" item-title="name" item-value="header_id"
                      class="required_field"></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[0].title" :rules="fieldRules"
                      v-bind:label="$t('title_en')" v-bind="props" required class="required_field" variant="outlined"
                      density="compact" maxlength="70"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('phone_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[0].phone" v-bind:label="$t('phone_en')"
                      :rules="phoneRules" v-bind="props" class="required_field" variant="outlined" density="compact"
                      maxlength="12" v-on:keypress="NumbersOnly" required></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('email_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[0].email" :rules="emailRules"
                      v-bind:label="$t('email_en')" v-bind="props" required class="required_field" variant="outlined"
                      density="compact" maxlength="500"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('type_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select v-bind="props" v-model="promotions[0].type"
                      @update:modelValue="(value) => updateType(value)" :rules="fieldRules" v-bind:label="$t('type_en')"
                      variant="outlined" density="compact" class="required_field" required index="id" :items="p_type_en"
                      item-value="header_id" item-title="longname"></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('start_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker v-bind="props" :label="$t('start_date_en')" :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="promotions[0].start_date" @formatted_date="formatted_start_date" dense
                      :class_required="'RequiredField'" v-on="on" />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('end_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker v-bind="props" :label="$t('end_date_en')" :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="promotions[0].end_date" @formatted_date="formatted_end_date" dense
                      :class_required="'RequiredField'" v-on="on" />
                  </template>
                  <span>{{ $t("end_date") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[0].meta_title" :rules="fieldRules"
                      v-bind:label="$t('meta_title_en')" v-bind="props" variant="outlined" class="required_field"
                      density="compact" maxlength="70"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea v-on="on" rows="2" v-model="promotions[0].description" :rules="fieldRules"
                      class="required_field"  maxlength="2000"
                        counter="true" v-bind="props" v-bind:label="$t('description_en')"
                      variant="outlined" ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('meta_description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea v-on="on" rows="2" v-model="promotions[0].meta_description" :rules="fieldRules"
                    maxlength="160"
                        counter="true" v-bind="props" class="required_field" v-bind:label="$t('meta_description_en')"
                      variant="outlined"></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="2" sm="2" md="2">
                <v-tooltip :text="$t('sequence_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" v-model="promotions[0].seq" maxlength="100" :rules="phoneRules"
                      v-bind:label="$t('sequence_en')" required variant="outlined" density="compact"
                      v-on:keypress="NumbersOnly"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img v-bind:style="isHovering == true ? 'filter: blur(1px);' : ''
                          " v-if="promotions[0].image_path != ''" :src="envImagePath + promotions[0].image_path"
                          width="100" height="65
                          " alt />
                        <img v-bind:style="isHovering == true ? 'filter: blur(1px);' : ''
                          " v-else src="@/assets/images/upload_image_default.png" width="100" />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                  <a class="text-center image_cursor" @click="downloadImage(promotions[0].image_path)">
                    <span v-if="promotions[0].image_path" class="download_btn_color">{{ $t("download_en") }}</span>
                  </a>
                </div>

                <br />
                <Imageupload :folder="'promotions_offers'" :resizewidth="200" :resizeheight="200"
                  @uploaded_image="uploaded_image" :upload_profile="uploadfile" />
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form ref="form" v-model="valid">
            <v-row class="mx-auto mt-2 arabdirection" max-width="344">
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('store_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete v-bind="props" v-model="promotions[1].store_id"
                      @update:modelValue="(value) => updateMall(value)" v-bind:label="$t('store_ar')" variant="outlined"
                      density="compact" :items="stores_ar" item-title="name" item-value="header_id"
                      class="required_field rtl"></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[1].title" :rules="fieldRules"
                      v-bind:label="$t('title_ar')" v-bind="props" required class="required_field rtl" variant="outlined"
                      density="compact" maxlength="70"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('phone_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[1].phone" v-bind:label="$t('phone_ar')"
                      :rules="phoneRules" v-bind="props" class="required_field rtl" variant="outlined" density="compact"
                      maxlength="12" v-on:keypress="NumbersOnly" required></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('email_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[1].email" :rules="emailRules"
                      v-bind:label="$t('email_ar')" v-bind="props" required class="required_field rtl" variant="outlined"
                      density="compact" maxlength="500"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('type_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select v-bind="props" v-model="promotions[1].type"
                      @update:modelValue="(value) => updateType(value)" :rules="fieldRules" v-bind:label="$t('type_ar')"
                      variant="outlined" density="compact" class="required_field" required index="id" :items="p_type_ar"
                      item-value="header_id" item-title="longname"></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('start_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker v-bind="props" :label="$t('start_date_ar')" :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="promotions[1].start_date" @formatted_date="formatted_start_date_ar" dense
                      :class_required="'RequiredField'" v-on="on" />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('end_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker v-bind="props" :label="$t('end_date_ar')" :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="promotions[1].end_date" @formatted_date="formatted_end_date_ar" dense
                      :class_required="'RequiredField'" v-on="on" />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-on="on" v-model="promotions[1].meta_title" :rules="fieldRules"
                      v-bind:label="$t('meta_title_ar')" v-bind="props" required class="required_field rtl"
                      variant="outlined" density="compact" maxlength="70"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea v-on="on" rows="2" v-model="promotions[1].description" :rules="fieldRules"
                      maxlength="2000" v-bind="props" v-bind:label="$t('description_ar')" required
                      class="required_field rtl" variant="outlined" counter="true"></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="4">
                <v-tooltip :text="this.$t('meta_description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea v-on="on" rows="2" v-model="promotions[1].meta_description" :rules="fieldRules"
                      maxlength="160" v-bind="props" v-bind:label="$t('meta_description_ar')" required
                      class="required_field rtl" variant="outlined" counter="true"></v-textarea>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="2" sm="2" md="2">
                <v-tooltip :text="$t('sequence_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-bind="props" v-model="promotions[1].seq" maxlength="100" :rules="phoneRules"
                      v-bind:label="$t('sequence_ar')" required variant="outlined" density="compact"
                      v-on:keypress="NumbersOnly"></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img v-bind:style="isHovering == true ? 'filter: blur(1px);' : ''
                          " v-if="promotions[1].image_path != ''" :src="envImagePath + promotions[1].image_path"
                          width="100" height="65
                          " alt />
                        <img v-bind:style="isHovering == true ? 'filter: blur(1px);' : ''
                          " v-else src="@/assets/images/upload_image_default.png" width="100" />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                  <a class="text-center image_cursor" @click="downloadImage(promotions[1].image_path)">
                    <span v-if="promotions[1].image_path" class="download_btn_color">{{ $t("download_ar") }}</span>
                  </a>
                </div>

                <br />
                <Imageupload :folder="'promotions_offers'" :resizewidth="0.4" :resizeheight="0.1"
                  @uploaded_image="uploaded_image" :upload_profile="uploadfile" />
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
            <v-btn v-bind="props" size="small" @click="$router.push('promotions_offers')" :disabled="loading" class="ma-1"
              color="cancel">{{ $t("cancel") }}</v-btn>
          </div>
        </template>
      </v-tooltip>
      <v-tooltip :text="this.$t('submit')" location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-inline-block">
            <v-btn :disabled="isDisabled" @click="submit" size="small" class="mr-2" color="success">
              {{ $t("submit") }}
              <v-progress-circular v-if="isBtnLoading" indeterminate width="1" color="cancel" size="x-small"
                class="ml-2"></v-progress-circular>
            </v-btn>
          </div>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import DatePicker from "../../CustomComponents/DatePicker.vue";
import Imageupload from "../../CustomComponents/ImageUpload.vue";
export default {
  components: { DatePicker, Imageupload },
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
    sel_lang: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    uploadfile: false,
    p_type_en: [],
    p_type_ar: [],
    stores_en: [],
    stores_ar: [],
    promotions: [
      {
        id: 0,
        title: "",
        description: "",
        phone: "",
        email: "",
        type: "",
        start_date: "",
        end_date: "",
        seq: "",
        image_path: "",
        meta_title: "",
        meta_description: "",
        lang: "en",
        store_id: null,
      },
      {
        id: 0,
        title: "",
        description: "",
        phone: "",
        email: "",
        type: "",
        start_date: "",
        end_date: "",
        seq: "",
        image_path: "",
        meta_title: "",
        meta_description: "",
        lang: "ar",
        store_id: null,
      },
    ],

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
    // this.promotions[0].type = "promotions";
    // this.promotions[1].type = "promotions";
    this.fetchLookup();
    this.get_stores();
  },
  created() { },
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
              "edit_promotions_offers/" +
              this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.promotions = res.data.promotions_offers;
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
    updateType(type) {
      if (this.tabs == 1) {
        this.promotions[1].type = type;
      } else {
        this.promotions[0].type = type;
      }
    },
    updateMall(promo) {
      if (this.tabs == 1) {
        this.promotions[1].store_id = promo;
      } else {
        this.promotions[0].store_id = promo;
      }
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    get_stores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
          console.log(response);
          this.stores_en = response.data.stores_en;
          this.stores_ar = response.data.stores_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
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
    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
          params: {
            lookup_type: "PROMOTION_TYPE",
          },
        })
        .then((response) => {
          this.p_type_en = response.data.lookup_en;
          this.p_type_ar = response.data.lookup_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    uploaded_image(img_src) {
      //alert('uploaded image');
      //alert(img_src);
      if (this.tabs == 1) {
        this.promotions[0].image_path = img_src;
      } else {
        this.promotions[1].image_path = img_src;
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
      this.promotions[0].start_date = formatted_date;
      this.promotions[1].start_date = formatted_date;
    },
    formatted_start_date_ar(formatted_date) {
      this.promotions[1].start_date = formatted_date;
      this.promotions[0].start_date = formatted_date;
    },
    formatted_end_date(formatted_date) {
      this.promotions[0].end_date = formatted_date;
      this.promotions[1].end_date = formatted_date;
    },
    formatted_end_date_ar(formatted_date) {
      this.promotions[1].end_date = formatted_date;
      this.promotions[0].end_date = formatted_date;
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      //Do whatever you need with the file, liek reading it with FileReader
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_promotions",
            this.promotions
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
                name: "promotions_offers",
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

.rtl :deep() input {
  text-align: right;
  direction: rtl;
}

.image_cursor {
  cursor: pointer;
}

.arabdirection /deep/ .v-field{
  direction:rtl;
}
</style>
