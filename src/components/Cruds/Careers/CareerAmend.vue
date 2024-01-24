<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_career')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="card-body">
      <content-loader v-if="loader"></content-loader>
      <v-tabs v-model="tabs" color="blue">
        <v-tab :value="1">
          <span>English</span>
        </v-tab>
        <v-tab :value="2">
          <span>Arabic</span>
        </v-tab>
      </v-tabs>
      <v-window v-model="tabs">
        <!-- ENGLISH TAB STARTS -->
        <v-window-item :value="1">
          <v-form ref="form" v-model="valid">
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers.title"
                      :rules="fieldRules"
                      v-bind:label="$t('title')"
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
                <v-tooltip :text="this.$t('vacancy')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers.vacancy"
                      :rules="fieldRules"
                      v-bind:label="$t('vacancy')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers.meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title')"
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
              <v-col md="6">
                <v-tooltip :text="this.$t('description')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers.description"
                      :rules="fieldRules"
                      maxlength="100"
                      v-bind="props"
                      v-bind:label="$t('description')"
                      required
                      class="required_field"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="6">
                <v-tooltip
                  :text="this.$t('meta_description')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers.meta_description"
                      :rules="fieldRules"
                      maxlength="100"
                      v-bind="props"
                      v-bind:label="$t('meta_description')"
                      required
                      class="required_field"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
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
                <v-tooltip :text="this.$t('title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers.title_ar"
                      :rules="fieldRules"
                      v-bind:label="$t('title')"
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
                <v-tooltip :text="this.$t('vacancy')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers.vacancy"
                      :rules="fieldRules"
                      v-bind:label="$t('vacancy')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="4" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="careers.meta_title_ar"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title')"
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
              <v-col md="6">
                <v-tooltip :text="this.$t('description')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers.description_ar"
                      :rules="fieldRules"
                      maxlength="100"
                      v-bind="props"
                      v-bind:label="$t('description')"
                      required
                      class="required_field"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col md="6">
                <v-tooltip
                  :text="this.$t('meta_description')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="careers.meta_description_ar"
                      :rules="fieldRules"
                      maxlength="100"
                      v-bind="props"
                      v-bind:label="$t('meta_description')"
                      required
                      class="required_field"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("vacancy") }}</span>
                </v-tooltip>
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
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tabs: 1,
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    valid: true,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    careers: {
      id: 0,
      title: "",
      title_ar: "",
      vacancy:"",
      description: "",
      description_ar: "",
      meta_title: "",
      meta_title_ar: "",
      meta_description: "",
      meta_description_ar: "",
    },
    noimagepreview: "",
    items: [],
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
        // alert('Inside watch');
        // alert(this.$route.query.slug);
        if (this.$route.query.slug) {
          
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_careers/" +
                this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.careers = res.data.careers;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
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
          .post(process.env.VUE_APP_API_URL_ADMIN + "save_careers", this.careers)
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
                name: "careers",
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
</style>
