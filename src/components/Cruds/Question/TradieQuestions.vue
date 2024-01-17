<template>
  <div class="mt-3 p-0">
    <div class="my-3 p-0">
      <v-row>
        <page-title class="col-md-4 ml-2" :heading="$t('tradie_safe_wizard')" :google_icon="google_icon"></page-title>
        <v-spacer></v-spacer>
        <div class="mt-5 pr-8">
          <v-tooltip :text="this.$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="d-inline-block mr-2">
                <router-link to="trade_safe_wizard" class="a-underline">
                  <v-btn v-bind="props" size="small" :disabled="btnloading" color="cancel">{{ $t("cancel") }}</v-btn>
                </router-link>
              </div>
            </template>
          </v-tooltip>

          <v-tooltip :text="this.$t('submit_for_approval')" location="bottom" v-if="wizard_status == 'Draft'">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" color="blue" @click="submitlastwizard()" :disabled="btnloading">{{
                $t("submit_for_approval") }}
                <v-progress-circular v-if="btnloading" indeterminate width="1" color="cancel" size="x-small"
                  class="ml-2"></v-progress-circular></v-btn> </template></v-tooltip>

          <v-tooltip :text="this.$t('reason_for_rejection')" location="bottom" v-if="wizard_status == 'Rejected'">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" size="small" color="error" @click="showreason_for_rejection()"
                :disabled="btnloading">{{ $t("reason_for_rejection") }}
                <v-progress-circular v-if="btnloading" indeterminate width="1" color="cancel" size="x-small"
                  class="ml-2"></v-progress-circular></v-btn> </template></v-tooltip>
        </div>
      </v-row>
    </div>
    <content-loader v-if="loader"></content-loader>

    <div style="position: relative">
      <form-wizard color="#094899" ref="formWizard" class="wizardcircle">
        <tab-content :title="section.section_name" v-for="(section, s_index) in tradie_section" :key="s_index"
          v-model="wizardmodel">
          <v-form v-model="section.valid" ref="questionform" lazy-validation>
            <div class="container" v-for="(question, q_index) in section.Questions" :key="q_index">
              <v-row v-if="question.question_header">
                <v-col md="8" lg="8" class="text-left pb-0 pl-3">
                  <h4>{{ question.question_header }}</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="8" lg="8" class="text-left">
                  <b>{{ question.questions }}</b>
                </v-col>
              </v-row>
              <v-row v-if="question.additional_field == 'NULL' && question.sub_heading" style="margin-top: -11px">
                <v-col md="6" lg="6" class="text-left">
                  <h6>{{ question.sub_heading }}</h6>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-left" v-bind:class="question.field_type == 'DOCUMENT_UPLOAD_WITH_NAME' ||
                  question.field_type == 'DOCUMENT_UPLOAD'
                  ? 'col-md-10, col-lg-10'
                  : 'col-md-6 , col-lg-6'
                  ">
                  <div v-if="question.field_type == 'LOV'">
                    <v-select :rules="question.is_field_required == true ? fieldRules : ''
                      " :required="question.is_field_required == true" v-bind:class="[
    question.is_field_required == true
      ? 'required_field'
      : '',
  ]" v-model="question.answer" v-bind:label="$t('select')" :disabled="submitwizard" :items="question.lookup_value"
                      variant="outlined" density="compact" item-title="shortname" item-value="shortname"></v-select>
                  </div>
                  <div v-if="question.field_type == 'AUTOCOMPLETE'">
                    <v-select :rules="question.is_field_required == true ? fieldRules : ''
                      " :required="question.is_field_required == true" v-bind:class="[
    question.is_field_required == true
      ? 'required_field'
      : '',
  ]" v-model="question.answer" v-bind:label="$t('select')" :items="question.lookup_value" variant="outlined"
                      :disabled="submitwizard" density="compact" item-title="shortname" item-value="shortname"></v-select>
                  </div>
                  <div v-if="question.field_type == 'TEXTAREA'">
                    <v-textarea :rules="question.is_field_required == true ? fieldRules : ''
                      " :required="question.is_field_required == true" v-bind:class="[
    question.is_field_required == true
      ? 'required_field'
      : '',
  ]" :disabled="submitwizard" maxlength="500" counter="true" rows="3" v-model="question.answer"
                      v-bind:label="$t('enter_here')" variant="outlined" density="compact"></v-textarea>
                  </div>

                  <div v-if="question.field_type == 'TEXTFIELD'">
                    <v-text-field :rules="question.is_field_required == true ? fieldRules : ''
                      " :required="question.is_field_required == true" v-bind:class="[
    question.is_field_required == true
      ? 'required_field'
      : '',
  ]" :disabled="submitwizard" maxlength="250" counter="true" v-model="question.answer" v-bind:label="$t('enter_here')"
                      variant="outlined" density="compact"></v-text-field>
                  </div>

                  <div v-if="question.field_type == 'RADIOBUTTON'">
                    <v-radio-group inline="true" v-model="question.answer" color="primary" :rules="question.is_field_required == true ? fieldRules : ''
                      " :required="question.is_field_required == true" v-bind:class="[
    question.is_field_required == true
      ? 'required_field'
      : '',
  ]" :disabled="submitwizard" row>
                      <v-radio v-for="(radio, checkindex) in question.lookup_value" :key="checkindex"
                        :disabled="submitwizard" :label="radio.shortname" :value="radio.shortname">
                      </v-radio>
                    </v-radio-group>
                  </div>
                  <div v-if="question.field_type == 'CHECKBOX'">
                    <div class="row" v-for="(check, checkindex) in question.lookup_value" :key="checkindex">
                      <v-checkbox v-model="question.answer" :label="check.shortname" color="blue" :value="check.shortname"
                        hide-details :disabled="submitwizard"></v-checkbox>
                    </div>
                  </div>

                  <div v-if="question.field_type == 'DOCUMENT_UPLOAD_WITH_NAME'">
                    <FileUpload :is_disabled="submitwizard" :array_data="question.doc_with_name" :question_index="q_index"
                      :section_index="s_index" :invalid_id="not_valid_doc_q_id"
                      :doc_upload_type="question.file_upload_type" @update-data="updateData">
                    </FileUpload>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="question.additional_field != 'NULL' &&
                question.sub_heading &&
                question.answer == 'Yes'
                " style="margin-top: -31px">
                <v-col md="6" lg="6" class="text-left">
                  <h6>{{ question.sub_heading }}</h6>
                </v-col>
              </v-row>
              <v-row v-if="question.additional_field == 'TEXTAREA' &&
                question.answer == 'Yes'
                ">
                <v-col md="6" lg="6" class="text-left">
                  <div>
                    <v-textarea :rules="fieldRules" class="required_field" :disabled="submitwizard" maxlength="500"
                      counter="true" v-model="question.additional_answer" v-bind:label="$t('enter_here')"
                      variant="outlined" density="compact" rows="3"></v-textarea>
                  </div>
                </v-col>
              </v-row>
            </div>
            <v-row class="mt-6 px-5">
              <v-tooltip :text="this.$t('previous')" location="bottom" v-if="s_index != 0">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="small" color="blue" @click="previouswizard()"
                    v-if="btnloadingwizard != true">{{ $t("previous") }}
                  </v-btn>
                </template></v-tooltip>
              <v-spacer></v-spacer>

              <v-tooltip :text="savenextcondition" location="bottom" v-if="s_index < tradie_section.length - 1">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="small" color="blue" :disabled="btnloadingwizard"
                    @click="nextwizard(s_index)">
                    <span v-if="submitwizard">
                      {{ $t("next") }}
                    </span>
                    <span v-else> {{ $t("save_n_next") }}</span>
                    <v-progress-circular v-if="btnloadingwizard" indeterminate width="1" color="cancel" size="x-small"
                      class="ml-2"></v-progress-circular></v-btn> </template></v-tooltip>

              <v-tooltip :text="this.$t('save')" location="bottom" v-else>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="small" color="blue" :disabled="btnloadingwizard"
                    @click="finishwizard(s_index)" v-if="!submitwizard">{{ $t("save") }}
                    <v-progress-circular v-if="btnloadingwizard" indeterminate width="1" color="cancel" size="x-small"
                      class="ml-2"></v-progress-circular></v-btn> </template></v-tooltip>
            </v-row>
          </v-form>
        </tab-content>
      </form-wizard>
    </div>

    <v-dialog persistent v-model="reason_for_reject_dialog" width="500px">
      <v-card class="rounded-lg">
        <v-card-text class="mx-0 p-0 rounded-xl">
          <div class="py-3 mb-2 d-flex justify-content-between">
            <h5 color="success" class="px-5">
              {{ $t("reason_for_rejection") }}
            </h5>
            <v-spacer></v-spacer>
            <v-tooltip :text="$t('cancel')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon @click="reason_for_reject_dialog = false" v-bind="props" class="mr-2" v-on="on">mdi-close</v-icon>
              </template>
            </v-tooltip>
          </div>
          <div class="px-3">
            <div class="reasonforrejectdivdialog">
              <span v-if="reject_reason != null"> {{ reject_reason }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import FileUpload from "../../CustomComponents/FileUpload.vue";
export default {
  components: { PageTitle, FileUpload },
  data: () => ({
    wizardmodel: "",
    not_valid_doc_q_id: "",
    google_icon: {
      icon_name: "steppers",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tradie_section: [],
    user: [],
    user_id: "",
    reject_reason: "",
    loader: true,
    reason_for_reject_dialog: false,
    btnloading: false,
    btnloadingwizard: false,
    submitwizard: false,
    wizard_status: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fileRules() {
      return [(v) => v.length > 0 || this.$t("field_required")];
    },
    savenextcondition() {
      var returntooltiptext = "";
      if (this.submitwizard == true) {
        returntooltiptext = this.$t("next");
      } else {
        returntooltiptext = this.$t("save_n_next");
      }
      return returntooltiptext;
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    if (this.user) {
      this.user_id = this.user.id;
    }
  },
  created() { },
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id > 0 && !this.$route.query.header_id) {
          this.fetchTradiesections(0);
        } else if (this.user_id > 0 && this.$route.query.header_id) {
          this.fetchTradiesections(this.$route.query.header_id);
        }
      },
    },

    "$route.query.header_id": {
      immediate: true,
      handler() {
        if (this.$route.query.header_id > 0 && this.user_id > 0) {
          this.fetchTradiesections(this.$route.query.header_id);
        }
      },
    },
  },
  methods: {
    showreason_for_rejection() {
      this.reason_for_reject_dialog = true;
    },
    updateData(data, index_path) {
      console.log("data", data);
      this.tradie_section[index_path.index1].Questions[
        index_path.index2
      ].doc_with_name = data;
      // this.tradie_section[index_path.index1].valid = index_path.field_valid;
    },

    previouswizard() {
      this.$refs.formWizard.prevTab();
    },

    nextwizard(index) {
      this.not_valid_doc_q_id = "";
      if (this.submitwizard != true) {
        this.tradie_section[index].Questions.map((ele) => {
          if (ele.field_type == "DOCUMENT_UPLOAD_WITH_NAME") {
            if (ele.doc_with_name.length == 0) {
              this.not_valid_doc_q_id = ele.id;
              return;
            }
          }
        });
        if (
          this.$refs[`questionform`][index].validate() &&
          this.tradie_section[index].valid == true
        ) {
          this.tradie_section.type = "Tradie";
          this.btnloadingwizard = true;
          this.$axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "savetradieanswers", {
              section: this.tradie_section[index],
              type: "Tradie",
              user_id: this.user_id,
              button: "next",
            })
            .then((res) => {
              if (res.data.status == "S") {
                this.btnloadingwizard = false;
                this.$refs.formWizard.nextTab();
                this.$toast.success(res.data.message);
                this.fetchTradiesections(0);
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.btnloadingwizard = false;
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
              this.btnloadingwizard = false;
            });
        }
      } else {
        this.$refs.formWizard.nextTab();
      }
    },

    finishwizard(index) {
      this.not_valid_doc_q_id = "";
      if (this.submitwizard != true) {
        this.tradie_section[index].Questions.map((ele) => {
          if (ele.field_type == "DOCUMENT_UPLOAD_WITH_NAME") {
            if (ele.doc_with_name.length == 0) {
              this.not_valid_doc_q_id = ele.id;
              return;
            }
          }
        });
        if (
          this.$refs[`questionform`][index].validate() &&
          this.tradie_section[index].valid == true
        ) {
          this.tradie_section.type = "Tradie";
          this.btnloadingwizard = true;
          this.$axios
            .post(process.env.VUE_APP_API_URL_ADMIN + "savetradieanswers", {
              section: this.tradie_section[index],
              type: "Tradie",
              user_id: this.user_id,
              button: "last",
            })
            .then((res) => {
              if (res.data.status == "S") {
                this.$toast.success(res.data.message);
                this.btnloadingwizard = false;
                this.fetchTradiesections(0);
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.btnloadingwizard = false;
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
              this.btnloadingwizard = false;
            });
        }
      }
    },

    fetchTradiesections(header_id) {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchtradiesections", {
          params: {
            user_id: this.user_id,
            header_id: header_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.tradie_section = res.data.tradiesection;
            this.reject_reason = res.data.reject_reason;
            this.wizard_status = res.data.wizardstatus;
            if (
              res.data.wizardstatus == "Completed" ||
              res.data.wizardstatus == "Approved" ||
              res.data.wizardstatus == "Rejected"
            ) {
              this.submitwizard = true;
            } else {
              this.submitwizard = false;
            }
            this.loader = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.loader = false;
        });
    },
    submitlastwizard() {
      this.btnloading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "submitlastwizard/" + this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.btnloading = false;
            this.$router.push({
              name: "trade_safe_wizard",
            });
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.btnloading = false;
        });
    },
  },
};
</script>
<style scoped>
.wizardcircle /deep/ .wizard-btn {
  display: none !important;
}

.wizardcircle /deep/ .wizard-progress-with-circle {
  height: 2px !important;
}

.wizardcircle /deep/ .wizard-icon-circle {
  width: 50px !important;
  height: 50px !important;
  font-family: none !important;
}

.wizardcircle /deep/ .wizard-progress-with-circle {
  top: 31px !important;
}

/* .wizardcircle /deep/ .wizard-icon-circle {
    width: 50px !important;
    height: 50px !important;
    font-size: 19px !important;
    margin-top: 6px !important;
} */
</style> 