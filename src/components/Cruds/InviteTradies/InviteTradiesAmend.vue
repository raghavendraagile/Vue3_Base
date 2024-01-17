<template>
  <div class="mx-2-fluid mt-3 p-0">
    <div class="text-center">
      <page-title
        class="col-md-4"
        :heading="$t('invite_tradies')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3">
      <content-loader v-if="loader"></content-loader>
      <div class="card-body" style="box-shadow: none !important">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6 mt-4">
            <v-col sm="6" md="6">
              <v-combobox
                required
                class="field_required"
                :label="this.$t('email')"
                :rules="emailRules"
                v-model="fieldItem.email"
                variant="outlined"
                chips
                density="compact"
                clearable
                multiple
                filled
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    small
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="remove(item)"
                    >{{ item }}</v-chip
                  >
                </template>
              </v-combobox>
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
                :disabled="loading"
                class="ma-1"
                color="cancel"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
        </v-tooltip>
        <v-tooltip :text="this.$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="fieldItem.email.length == 0"
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
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    btnloading: false,
    flowerbraceleft: "{{",
    flowerbraceright: "}}",
    orgcolumns: [],
    customercolumns: [],
    appointmentcolumns: [],
    // editor2: ClassicEditor,
    selectmode: null,
    loader: false,
    editorConfig: {
      required: true,
    },
    editor: "",
    valid: true,
    show: true,
    showsmsarea: false,
    message: "",
    errmsgsign: false,
    errmsgbody: false,
    valid_error: false,
    valid_success: false,
    successmessage: "",
    loading: false,
    isDisabled: false,
    fieldItem: {
      id: 0,
      email: [],
    },
    template_slug: "",
    passwordvalue: String,
    mode_items: [],
    item: [],
    orgs: [],
    disabled: false,
    showerrmsg: false,
    email: "",
  }),

  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v[v.length - 1]) ||
          this.$t("email_valid"),
      ];
    },
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    fieldRules1() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchLookup();
  },
  mounted() {},
  watch: {
    // "$route.query.slug": {
    //   immediate: true,
    //   handler() {
    //     if (this.$route.query.slug) {
    //       this.loader = true;
    //       this.template_slug = this.$route.query.slug;
    //       this.$axios
    //         .get(
    //           process.env.VUE_APP_API_URL_ADMIN +
    //             "emailtemplates/" +
    //             this.$route.query.slug
    //         )
    //         .then(res => {
    //           this.loader = false;
    //           this.fieldItem = res.data.email_template;
    //           this.loading = false;
    //         })
    //         .catch(err => {
    //           this.$toast.error(this.$t("something_went_wrong"));
    //           this.loader = false;
    //           console.log("this error", err);
    //         });
    //     }
    //   }
    // }
  },

  methods: {
    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TEMPLATE_TYPE",
          },
        })
        .then((response) => {
          console.log(response);
          this.mode_items = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        // if (this.template_slug == "") {
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createinvitetradies",
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
                name: "invite_tradies",
              });
            } else if (res.data.status == "E") {
              this.isDisabled = false;
              this.$toast.error(this.array_data);
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("this error" + err);
          });
        // }
        // else {
        //   this.$axios
        //     .patch(
        //       process.env.VUE_APP_API_URL_ADMIN +
        //         "emailtemplates/" +
        //         this.template_slug,
        //       this.fieldItem
        //     )
        //     .then(res => {
        //       this.btnloading = false;
        //       if (Array.isArray(res.data.message)) {
        //         this.array_data = res.data.message.toString();
        //       } else {
        //         this.array_data = res.data.message;
        //       }
        //       if (res.data.status == "S") {
        //         this.$toast.success(this.array_data);
        //         this.message = res.data.message;
        //         this.$router.push({
        //           name: "email_template"
        //         });
        //       } else if (res.data.status == "E") {
        //         this.isDisabled = false;
        //         this.$toast.error(this.array_data);
        //       } else {
        //         this.isDisabled = false;
        //         this.$toast.error(this.array_data);
        //       }
        //     })
        //     .catch(err => {
        //       this.$toast.error(this.$t("something_went_wrong"));
        //       this.isDisabled = false;
        //       console.log("this error" + err);
        //     });
        // }
      }
    },
    cancel() {
      this.$router.push({
        name: "email_template",
      });
    },
  },
};
</script>
<style lang="css">
/* @import "~quill/dist/quill.core.css";
  @import "~quill/dist/quill.snow.css";
  @import "~quill/dist/quill.bubble.css"; */

.v-card {
  box-shadow: none !important;
}
</style>
  