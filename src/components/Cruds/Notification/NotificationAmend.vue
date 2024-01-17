<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_ammend_notification')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col xs="12" md="12" lg="12">
              <v-tooltip :text="this.$t('title')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    maxlength="50"
                    v-bind="props"
                    v-model="notification.title"
                    :rules="fieldRules"
                    v-bind:label="$t('title')"
                    variant="outlined"
                    density="compact"
                    class="required_field"
                    required
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col xs="12" md="12" lg="12">
              <v-tooltip :text="this.$t('body')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-textarea
                    rows="3"
                    v-bind="props"
                    maxlength="250"
                    v-model="notification.description"
                    :rules="fieldRules"
                    v-bind:label="$t('body')"
                    variant="outlined"
                    density="compact"
                    class="required_field"
                    counter="true"
                    required
                  ></v-textarea>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col xs="4" md="4" lg="4">
              <v-tooltip :text="this.$t('type')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-select
                    v-bind="props"
                    v-model="notification.type"
                    :rules="fieldRules"
                    v-bind:label="$t('type')"
                    variant="outlined"
                    density="compact"
                    class="required_field"
                    required
                    index="id"
                    :items="notification_type"
                    item-value="shortname"
                    item-title="shortname"
                  ></v-select>
                </template>
              </v-tooltip>
            </v-col>
            <v-col
              xs="4"
              md="4"
              lg="4"
              v-if="
                notification.type == 'Individuals' ||
                notification.type == 'Principal'
              "
            >
              <v-tooltip :text="this.$t('principal')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    v-bind="props"
                    v-model="notification.principal_id"
                    chips
                    small-chips
                    multiple="true"
                    :rules="fieldRules"
                    v-bind:label="$t('principal')"
                    variant="outlined"
                    density="compact"
                    class="required_field"
                    required
                    :items="principal_array"
                    item-value="id"
                    item-title="full_name"
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col
              xs="4"
              md="4"
              lg="4"
              v-if="
                notification.type == 'Individuals' ||
                notification.type == 'Tradies'
              "
            >
              <v-tooltip :text="this.$t('tradies')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    v-bind="props"
                    v-model="notification.tradies_id"
                    chips
                    small-chips
                    multiple="true"
                    :rules="fieldRules"
                    v-bind:label="$t('tradies')"
                    variant="outlined"
                    density="compact"
                    class="required_field"
                    required
                    :items="tradies_array"
                    item-value="id"
                    item-title="full_name"
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
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
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
  data: () => ({
    google_icon: {
      icon_name: "notifications",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    notification_type: [],
    tradies_array: [],
    principal_array: [],
    valid: true,
    message: "",
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    notification: {
      title: "",
      description: "",
      type: "",
      principal_id: [],
      tradies_id: [],
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchLookup();
    this.fetchtradiesandprincipal();
  },

  methods: {
    fetchtradiesandprincipal() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchtradiesandprincipal")
        .then((response) => {
          this.principal_array = response.data.principal;
          this.tradies_array = response.data.tradies;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "NOTIFICATION_TYPE",
          },
        })
        .then((response) => {
          // console.log(response);
          this.notification_type = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "savenotifications",
            this.notification
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
                name: "notification",
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
      }
    },
  },
};
</script>
<style scoped></style>
    