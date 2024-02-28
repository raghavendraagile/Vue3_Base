<template>
  <div class="mx-2 mt-3 p-0">
    <div class="text-center" v-bind:class="[is_arabic ? 'rtl-page-title' : '']">
      <page-title
        class="col-md-4"
        :heading="$t('amend_email_template')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3">
      <content-loader v-if="loader"></content-loader>
      <div class="card-body" style="box-shadow: none !important">
        <v-form ref="form" v-model="valid">
          <v-row
            class="px-6 mt-4"
            v-bind:class="fieldItem.lang == 'ar' ? 'arabclass' : ''"
          >
            <v-col cols="12" sm="6" md="6">
              <v-tooltip
                v-bind:text="
                  fieldItem.lang == 'en' ? $t('name') : $t('name_ar')
                "
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    :disabled="fieldItem.id == 0 ? disabled : ''"
                    v-bind="props"
                    maxlength="100"
                    class="required_field"
                    v-model="fieldItem.template_name"
                    v-bind:rules="
                      fieldItem.lang == 'en' ? fieldRules : fieldRulesAR
                    "
                    v-bind:label="
                      fieldItem.lang == 'en' ? $t('name') : $t('name_ar')
                    "
                    required
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-tabs v-model="tabs" color="blue">
            <v-tab :value="1" @click="fieldItem.lang = 'en'">
              <span>{{ $t("english") }}</span>
            </v-tab>
            <v-tab :value="2" @click="fieldItem.lang = 'ar'">
              <span>{{ $t("arabic") }}</span>
            </v-tab>
          </v-tabs>
          <div>
            <div>
              <v-row
                class="px-6 mt-4"
                v-bind:class="fieldItem.lang == 'ar' ? 'arabclass' : ''"
              >
                <v-col cols="12" sm="12" md="4">
                  <v-tooltip
                    :text="
                      fieldItem.lang == 'en'
                        ? $t('select_mode_en')
                        : $t('select_mode_ar')
                    "
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        class="rtl-dir required_field"
                        v-bind:class="fieldItem.lang == 'ar' ? 'arabclass' : ''"
                        v-bind:rules="
                          fieldItem.lang == 'en' ? fieldRules : fieldRulesAR
                        "
                        v-bind:label="
                          fieldItem.lang == 'en'
                            ? $t('select_mode_en')
                            : $t('select_mode_ar')
                        "
                        item-value="header_id"
                        item-title="shortname"
                        density="compact"
                        variant="outlined"
                        v-bind="props"
                        index="id"
                        v-model="fieldItem.template_type_id"
                        :items="tabs == 1 ? temp_type_en : temp_type_ar"
                        outlined
                        required
                        dense
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" sm="12" md="8">
                  <v-tooltip
                    :text="
                      fieldItem.lang == 'en'
                        ? $t('subject_en')
                        : $t('subject_ar')
                    "
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="fieldItem.template_subject"
                        v-bind:rules="
                          fieldItem.lang == 'en' ? fieldRules : fieldRulesAR
                        "
                        v-bind:class="fieldItem.lang == 'ar' ? 'arabclass' : ''"
                        maxlength="100"
                        class="required_field"
                        v-bind:label="
                          fieldItem.lang == 'en'
                            ? $t('subject_en')
                            : $t('subject_ar')
                        "
                        required
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="px-6 pt-0">
                <v-col
                  cols="12"
                  md="12"
                  lg="12"
                  sm="12"
                  class="pt-0"
                  v-bind:class="fieldItem.lang == 'ar' ? 'arabclass' : ''"
                >
                  <v-card-title
                    v-bind:class="
                      fieldItem.lang == 'ar' ? 'text-right' : 'text-left'
                    "
                    style="font-size: 17px"
                  >
                    <span v-if="fieldItem.lang == 'ar'">
                      {{ $t("body_ar") }}
                    </span>
                    <span v-else> {{ $t("body_en") }}</span>
                  </v-card-title>
                  <v-tooltip
                    :text="
                      fieldItem.lang == 'en' ? $t('body_en') : $t('body_ar')
                    "
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <div v-bind="props">
                        <quill-editor
                          :key="quill_d"
                          :options="editorOptions"
                          v-bind:style="tabs == 2 ? 'rt-input' : ''"
                          v-bind:class="tabs == 2 ? 'arabclassquill' : ''"
                          class="hide_quill_input"
                          v-bind:id="
                            quill_item == true
                              ? 'quill_item'
                              : 'quill_item_border'
                          "
                          v-model:value="fieldItem.template_body"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @ready="onEditorReady($event)"
                          @change="onEditorChange($event)"
                        />
                        <small
                          v-if="quill_item"
                          class="text-danger ml-5 required_item shake"
                          ><span v-if="tabs == 2">{{
                            $t("field_required_ar")
                          }}</span>
                          <span v-else>{{ $t("field_required") }}</span>
                        </small>
                      </div>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="px-6 mb-2">
                <v-col
                  cols="12"
                  md="12"
                  lg="12"
                  sm="12"
                  v-bind:class="fieldItem.lang == 'ar' ? 'arabclass' : ''"
                >
                  <v-card-title
                    v-bind:class="
                      fieldItem.lang == 'ar' ? 'text-right' : 'text-left'
                    "
                    style="font-size: 17px"
                  >
                    <span v-if="fieldItem.lang == 'ar'">{{
                      $t("signature_ar")
                    }}</span>
                    <span v-else>{{ $t("signature_en") }}</span>
                  </v-card-title>
                  <v-tooltip
                    :text="
                      fieldItem.lang == 'en'
                        ? $t('signature_en')
                        : $t('signature_ar')
                    "
                    location="top"
                  >
                    <template v-slot:activator="{ props }">
                      <div v-bind="props">
                        <quill-editor
                          :key="quill_key"
                          :options="editorOptions"
                          v-bind:style="tabs == 2 ? 'rt-input' : ''"
                          v-bind:class="tabs == 2 ? 'arabclassquill' : ''"
                          class="hide_quill_input"
                          v-bind:id="
                            quill_sign == true
                              ? 'quill_item1'
                              : 'quill_item_border1'
                          "
                          v-model:value="fieldItem.template_signature"
                          v-bind:label="$t('body')"
                          @change="onEditorChangeSignature($event)"
                          @blur="onEditorBlurSign($event)"
                        />
                        <small
                          v-if="quill_sign"
                          class="text-danger ml-3 required_item shake"
                          ><span v-if="tabs == 2">{{
                            $t("field_required_ar")
                          }}</span>
                          <span v-else>{{ $t("field_required") }}</span></small
                        >
                        <!-- <QuillEditor theme="snow" v-model:content="fieldItem.template_signature"
                    contentType="html" name="template_body" v-bind:label="$t('body')" />-->
                      </div>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
        <v-tooltip :text="$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="cancel()"
                :disabled="loading"
                class="ma-1"
                color="cancel"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
        </v-tooltip>
        <v-tooltip :text="$t('submit')" location="bottom">
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
import { quillEditor } from "vue3-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
    quillEditor,
  },

  setup() {
    const onEditorFocus = (quill) => {
      console.log("editor focus!", quill);
    };
    const onEditorFocusAR = (quill) => {
      console.log("editor focus!", quill);
    };
    const onEditorReady = (quill) => {
      console.log("editor ready!", quill);
    };
    const onEditorReadyAR = (quill) => {
      console.log("editor ready!", quill);
    };

    return { onEditorReady, onEditorFocus, onEditorFocusAR, onEditorReadyAR };
  },
  data: () => ({
    quill_key: 0,
    quill_item: false,
    quill_sign: false,
    tabs: 1,
    quill_d: 0,
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
      template_name: "",
      template_subject: "",
      template_body: "",
      lang: "en",
      template_signature: "",
      can_override: "N",
      template_type_id: "",
    },
    template_slug: "",
    passwordvalue: String,
    mode_items: [],
    item: [],
    orgs: [],
    is_arabic: false,
    disabled: false,
    showerrmsg: false,
    email: "",
    editorOptions: {
      placeholder: "Enter the content here",
      direction: "rtl",
      theme: "snow",
    },
    temp_type_en: [],
    temp_type_ar: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAR() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },
  },

  created() {
    this.fetchLookup();
  },
  mounted() {
    this.editorOptions.placeholder = this.$t("enter_the_content_here_en");
  },
  watch: {
    tabs(newVal) {
      if (newVal === 2) {
        this.editorOptions.direction = "rtl";
        this.quill_key++;
        this.quill_d++;
        this.editorOptions.placeholder = this.$t("enter_the_content_here_ar");
      } else {
        this.editorOptions.direction = "ltr";
        this.quill_d++;
        this.quill_key++;
        this.editorOptions.placeholder = this.$t("enter_the_content_here_en");
      }
    },
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.is_arabic = true;
      } else {
        this.is_arabic = false;
      }
    },
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab) {
          if (this.$route.query.s_tab == 1) {
            this.fieldItem.lang = "en";
          } else {
            this.fieldItem.lang = "ar";
          }
        }
        // if (this.fieldItem.lang == "en") {
        //   this.tabs = 1;
        // } else {
        //   this.tabs = 2;
        // }
      },
    },
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.template_slug = this.$route.query.slug;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "emailtemplates/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.loader = false;
              this.fieldItem = res.data.email_template;
              if (this.fieldItem.lang == "en") {
                this.tabs = 1;
              } else {
                this.tabs = 2;
              }
              this.loading = false;
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              this.loader = false;
              console.log("this error", err);
            });
        }
      },
    },
  },

  methods: {
    onEditorChange(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    onEditorChangeAR(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    onEditorChangeSignature(event) {
      if (event.text.length == 1) {
        this.quill_sign = true;
      } else {
        this.quill_sign = false;
      }
    },
    onEditorChangeSignatureAR(event) {
      if (event.text.length == 1) {
        this.quill_sign = true;
      } else {
        this.quill_sign = false;
      }
    },

    onEditorBlur(event) {
      console.log(event.options);
      if (this.fieldItem.template_body == "") {
        this.quill_item = true;
      }
    },

    onEditorBlurSign(event) {
      console.log(event);
      if (this.fieldItem.template_signature == "") {
        this.quill_sign = true;
      }
    },

    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
          params: {
            lookup_type: "TEMPLATE_TYPE",
          },
        })
        .then((response) => {
          this.temp_type_en = response.data.lookup_en;
          this.temp_type_ar = response.data.lookup_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    submit() {
      if (this.fieldItem.template_signature == "") {
        this.quill_sign = true;
      }
      if (this.fieldItem.template_body == "") {
        this.quill_item = true;
      }

      if (this.$refs.form.validate() && this.valid == true) {
        if (
          this.fieldItem.template_body == "" ||
          this.fieldItem.template_signature == ""
        ) {
          return;
        }
        this.isDisabled = true;
        if (this.template_slug == "") {
          this.$axios
            .post(
              process.env.VUE_APP_API_URL_ADMIN + "emailtemplates",
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
                this.cancel();
              } else if (res.data.status == "E") {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              } else {
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("this error" + err);
            });
        } else {
          this.$axios
            .patch(
              process.env.VUE_APP_API_URL_ADMIN +
                "emailtemplates/" +
                this.template_slug,
              this.fieldItem
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
                this.cancel();
              } else if (res.data.status == "E") {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              } else {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      }
    },
    cancel() {
      this.$router.push({
        name: "email_template",
        query: { s_tab: this.tabs },
      });
    },
  },
};
</script>
<style lang="css">
/* @import "~quill/dist/quill.core.css";
  @import "~quill/dist/quill.snow.css";
  @import "~quill/dist/quill.bubble.css"; */

.rtl-dir :deep(.v-field) {
  direction: rtl;
  text-align: right;
}

#quill_item {
  border: 1px solid #b00020;
}

#quill_item_border {
  border: 1px solid #d1d5db;
}

#quill_item1 {
  border: 1px solid #b00020;
}

#quill_item_border1 {
  border: 1px solid #d1d5db;
}

.ql-tooltip {
  display: none !important;
}

.hide_quill_input >>> input {
  display: none !important;
}

.required_item {
  position: absolute !important;
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

.arabclass .v-field {
  direction: rtl !important;
}

.arabclass {
  direction: rtl !important;
}
.arabclassquill .ql-editor {
  text-align: justify;
}
.arabclass .v-messages__message {
  text-align: right !important;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
  