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
              <v-col cols="12" sm="12" md="6">
                <v-tooltip :text="this.$t('shortname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.shortname"
                      :rules="fieldRules"
                      v-bind:label="$t('shortname')"
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
              <v-col md="6">
                <v-tooltip :text="this.$t('longname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.longname"
                      :rules="fieldRules"
                      v-bind:label="$t('longname')"
                      v-bind="props"
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
                  <v-tooltip :text="this.$t('longname')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        v-on="on"
                        rows="2"
                        v-model="lookup.description"
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
                    <span>{{ $t("description") }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-layout>
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form ref="form" v-model="valid">
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col cols="12" sm="12" md="6">
                <v-tooltip :text="this.$t('shortname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.shortname_ar"
                      :rules="fieldRules"
                      v-bind:label="$t('shortname')"
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
                <v-tooltip :text="this.$t('longname')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="lookup.longname_ar"
                      :rules="fieldRules"
                      v-bind:label="$t('longname')"
                      v-bind="props"
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
                  <v-tooltip :text="this.$t('longname')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        v-on="on"
                        rows="2"
                        v-model="lookup.description_ar"
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
                    <span>{{ $t("description") }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-layout>
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
    lookup: {
      id: 0,
      shortname: "",
      longname: "",
      description: "",
      shortname_ar: "",
      longname_ar: "",
      description_ar: "",
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
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.lookup = res.data.lookup;
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
          .post(process.env.VUE_APP_API_URL_ADMIN + "save_lookups", this.lookup)
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
                name: "lookups",
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
