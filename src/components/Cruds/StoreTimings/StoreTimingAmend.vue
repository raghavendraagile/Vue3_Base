<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_store_timings')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-layot>
            <v-row class="px-6">
              <v-col xs="4" md="4" lg="4">
                <v-tooltip :text="this.$t('store_name')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="store_timings.store_id"
                      :rules="fieldRules"
                      v-bind:label="$t('store_name')"
                      variant="outlined"
                      density="compact"
                      class="required_field"
                      required
                      index="id"
                      :items="stores_en"
                      item-value="id"
                      item-title="name"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-layot>
          <v-row class="px-6">
            <v-col cols="12" md="6">
              <v-tooltip :text="this.$t('parameter_name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="store_timings.parameter_name"
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
            <v-col md="6">
              <v-tooltip :text="this.$t('parameter_value')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="store_timings.parameter_value"
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
                      v-model="store_timings.description"
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
                @click="$router.go(-1)"
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
                :disabled="isDisabled"
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
import localStorageWrapper from "../../../localStorageWrapper.js";
export default {
  components: { PageTitle },
  data: () => ({
    google_icon: {
      icon_name: "punch_clock",
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
    checkbox_value: false,
    store_timings: {
      id: 0,
      parameter_name: "",
      parameter_value: "",
    },
    stores_en: [],
    stores_ar: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {
    this.get_stores();
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
                "edit_store_timings/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.store_timings = res.data.systemparameter;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
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

    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_store_timings",
            this.store_timings
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
</style>

