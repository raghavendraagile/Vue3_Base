<template>
  <div class="mx-2 mt-3 p-0">
    <div class="mb-3 mx-auto">
      <page-title
        class="col-md-4"
        :heading="$t('create_amend_question')"
        :google_icon="google_icon"
      ></page-title>
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-form ref="form" v-model="valid">
          <v-row class="px-5">
            <v-col md="3" lg="3" v-if="$route.query.section_name">
              <v-text-field
                density="compact"
                variant="outlined"
                v-bind:label="$t('section_name')"
                disabled="true"
                v-model="$route.query.section_name"
              ></v-text-field>
            </v-col>
            <v-col md="8" lg="8">
              <v-textarea
                density="compact"
                variant="outlined"
                rows="1"
                v-bind:label="$t('question')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.questions"
                maxlength="500"
                counter="500"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row class="px-5">
            <v-col md="4" lg="4">
              <v-text-field
                density="compact"
                variant="outlined"
                v-bind:label="$t('question_header')"
                v-model="question_array.question_header"
                maxlength="50"
              ></v-text-field>
            </v-col>
            <v-col md="4" lg="4">
              <v-text-field
                density="compact"
                variant="outlined"
                v-bind:label="$t('sub_heading')"
                v-model="question_array.sub_heading"
                maxlength="100"
              ></v-text-field>
            </v-col>
            <v-col md="2" lg="2">
              <v-text-field
                type="number"
                density="compact"
                variant="outlined"
                v-bind:label="$t('sequence')"
                maxlength="2"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.sequence"
              ></v-text-field>
            </v-col>
            <v-col md="2" sm="2" lg="2">
              <div class="checkboxcomponent">
                <v-checkbox
                  v-model="question_array.is_field_required"
                  density="compact"
                  v-bind:label="$t('is_field_required')"
                ></v-checkbox>
              </div>
            </v-col>
          </v-row>

          <v-row class="px-5">
            <v-col md="3" lg="3">
              <v-autocomplete
                density="compact"
                variant="outlined"
                rows="2"
                v-bind:label="$t('field_type')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.field_type"
                :items="field_type_array"
                item-title="shortname"
                item-value="longname"
              ></v-autocomplete>
            </v-col>
            <v-col
              md="3"
              lg="3"
              v-if="
                question_array.field_type == 'LOV' ||
                question_array.field_type == 'AUTOCOMPLETE' ||
                question_array.field_type == 'CHECKBOX' ||
                question_array.field_type == 'RADIOBUTTON'
              "
            >
              <v-autocomplete
                density="compact"
                variant="outlined"
                rows="2"
                v-bind:label="$t('lookup_parent')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.lookup_parent_name"
                :items="lookup_array"
                item-title="shortname"
                item-value="longname"
              ></v-autocomplete>
            </v-col>
            <v-col
              md="3"
              lg="3"
              v-if="
                question_array.lookup_parent_name == 'YES_OR_NO' &&
                question_array.field_type == 'RADIOBUTTON'
              "
            >
              <v-autocomplete
                density="compact"
                variant="outlined"
                v-bind:label="$t('additional_field_type')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.additional_field"
                :items="additional_field_array"
                item-title="shortname"
                item-value="longname"
              ></v-autocomplete>
            </v-col>

            <v-col
              md="3"
              lg="3"
              v-if="
                question_array.field_type == 'DOCUMENT_UPLOAD' ||
                question_array.field_type == 'DOCUMENT_UPLOAD_WITH_NAME'
              "
            >
              <v-select
                density="compact"
                variant="outlined"
                v-bind:label="$t('doc_type')"
                class="required_field"
                :rules="fieldRules"
                v-model="question_array.file_upload_type"
                :items="document_types_upload"
                item-title="longname"
                item-value="shortname"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
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
                  @click="saveQuestions"
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
  </div>
</template>
  
<script>
export default {
  components: {},
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: false,
    loader: false,
    isDisabled: false,
    role_array: [],
    lookup_array: [],
    field_type_array: [],
    question_array: {
      id: 0,
      questions: "",
      section_id: null,
      registered_name: "",
      lookup_parent_name: "",
      field_type: "",
      question_header: "",
      file_upload_type: "",
      sequence: 0,
      sub_heading: "",
      is_field_required: false,
      additional_field: "",
      status: "",
    },
    document_types_upload: [
      {
        shortname: "Single",
        longname: "Single Upload",
      },
      {
        shortname: "Multiple",
        longname: "Multiple Upload",
      },
    ],
    additional_field_array: [],
    section_head: [],
    section_name: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchlookup();
    this.fetchAllRole();
    this.fetchAllLookupParent();
  },
  watch: {
    "$route.query.section_id": {
      immediate: true,
      handler() {
        if (this.$route.query.section_id > 0) {
          this.question_array.section_id = this.$route.query.section_id;
        }
      },
    },

    "$route.query.question_id": {
      immediate: true,
      handler() {
        if (this.$route.query.question_id) {
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "fetchquestionbyid/" +
                this.$route.query.question_id
            )
            .then((res) => {
              if (res.data.status == "S") {
                this.loader = false;
                this.question_array = res.data.question;
                //this.question_array.is_field_required = res.data.field;
              }
            })
            .catch((err) => {
              this.loader = false;
              console.log("this error" + err);
            });
        }
      },
    },
  },

  methods: {
    fetchsectionname(id) {
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchsectionnamefromheader/" + id
        )
        .then((response) => {
          this.section_name = response.data.section;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchsectionrole(id) {
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchrolenamefromsection/" + id
        )
        .then((response) => {
          this.role_array = [];
          this.role_array = response.data.role;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveQuestions() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "createamendquestions",
            this.question_array
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.$toast.success(res.data.message);
              // this.$router.push({
              //     name: "questions_index",
              //     query: { section_name: this.$route.query.section_name, id: this.$route.query.section_id }
              // });
              this.isDisabled = false;
              this.$router.go(-1);
            } else {
              this.$toast.error(this.$t("something_went_wrong"));
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.$toast.error(this.$t("something_went_wrong"));
            console.log(err);
            this.isDisabled = false;
          });
      }
    },

    fetchlookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "FIELD_TYPE",
          },
        })
        .then((response) => {
          this.field_type_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "ADDITIONAL_FIELD_TYPE",
          },
        })
        .then((response) => {
          this.additional_field_array = response.data.lookup_details;
          this.additional_field_array.unshift({
            id: 0,
            shortname: "None",
            longname: "None",
          });
          //this.question_array.additional_field = "NULL";
        })
        .catch((err) => {
          console.log(err);
        });

      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "HEADER_MENU_SECTION",
          },
        })
        .then((response) => {
          this.section_head = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchAllRole() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchalluserroles")
        .then((response) => {
          this.role_array = response.data.roles;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchAllLookupParent() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchalllookupparentsvalues")
        .then((response) => {
          this.lookup_array = response.data.lookup;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
.v-input__slot {
  padding-left: 3px !important;
}

.checkboxcomponent /deep/ .v-label {
  font-size: 16px !important;
  padding-top: 6px !important;
}
</style>