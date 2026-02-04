<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('amend_store_code')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col cols="12" sm="4" md="4">
              <v-tooltip :text="this.$t('shop_code')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.shop_code"
                    :rules="fieldRules"
                    v-bind:label="$t('shop_code')"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="1000"
                    v-bind:class="[fieldRules ? 'form-group--error' : '']"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-tooltip :text="this.$t('parent')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    :items="items"
                    v-bind:label="$t('floor_no')"
                    index="shortname"
                    v-bind="props"
                    item-value="shortname"
                    variant="outlined"
                    density="compact"
                    item-title="shortname"
                    v-model="fieldItem.floor_no"
                    class="pr-2"
                  >
                  </v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col cols="12" sm="4" md="4">
              <v-tooltip :text="this.$t('altitude')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.altitude"
                    :rules="fieldRules"
                    v-bind:label="$t('altitude')"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="1000"
                    v-bind:class="[fieldRules ? 'form-group--error' : '']"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-tooltip :text="this.$t('latitude')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.latitude"
                    :rules="fieldRules"
                    v-bind:label="$t('latitude')"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="1000"
                    v-bind:class="[fieldRules ? 'form-group--error' : '']"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-tooltip :text="this.$t('longitude')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.longitude"
                    :rules="fieldRules"
                    v-bind:label="$t('longitude')"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="100"
                    v-bind:class="[fieldRules ? 'form-group--error' : '']"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 text-right pb-3">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="cancel()"
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
                  v-if="isDisabled"
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
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: false,
    valid_error: false,
    message: "",
    loader: false,
    disabled: false,
    loading: false,
    isDisabled: false,
    fieldItem: {
      id: 0,
      shop_code: "",
      floor_no: "",
      altitude: 0,
      latitude: "",
      longitude: "",
    },
    items: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.$axios
      .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
        params: {
          lookup_type: "FLOORS",
        },
      })
      .then((response) => {
        this.items = response.data.lookup_en;
      })
      .catch((err) => {
        this.$toast.error(this.$t("something_went_wrong"));
        console.log(err);
      });
  },
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "view-store-code/" +
                this.$route.query.id
            )
            .then((res) => {
              if (res.data.status == "S") {
                this.loader = false;
                this.fieldItem = res.data.geo_measures;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              this.loader = false;
              console.log("error", err);
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
        name: "store-code",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save-store-code",
            this.fieldItem
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
                name: "store-code",
              });
            } else if (res.data.status == "E") {
              this.$toast.error(this.array_data);
              this.isDisabled = false;
            } else {
              this.$toast.error(this.array_data);
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.$toast.error(this.$t("something_went_wrong"));
            this.isDisabled = false;
            console.log("error", err);
          });
      }
    },
  },
};
</script>
