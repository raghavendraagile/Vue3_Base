<template>
  <div v-if="tradie_answers.length > 0 && !loader_tradie">
    <div v-for="(answer, index) in tradie_answers" :key="index">
      <h6
        size="small"
        v-bind:class="[index != 0 ? 'h6_section' : 'first_h6_section']"
        v-if="
          index == 0 ||
          answer.section_name != tradie_answers[index - 1].section_name
        "
      >
        {{ answer.section_name }}
      </h6>
      <h6 size="small" class="h6_question">{{ answer.question }}</h6>
      <h6
        size="small"
        class="h6_answer"
        v-if="answer.answer != 'DOCUMENT UPLOAD'"
      >
        {{ answer.answer }}
      </h6>

      <h6 size="small" class="pb-2 h6_answer" v-if="answer.additional_answer">
        {{ answer.additional_answer }}
        <v-divider></v-divider>
      </h6>

      <div v-if="answer.file_uploads.length > 0">
        <v-row wrap class="pb-1">
          <v-col md="4" sm="4" lg="4" class="header_licence_upload_name">
            {{ $t("license_name") }}
          </v-col>
          <v-col md="4" sm="4" lg="4" class="header_licence_upload_name">
            {{ $t("expiry_date") }}
          </v-col>
          <v-col md="4" sm="4" lg="4" class="header_licence_upload_name">
            {{ $t("actions") }}
          </v-col>
        </v-row>
        <div class="row mt-2" v-for="(file, i) in answer.file_uploads" :key="i">
          <div class="col-md-4 col-sm-4 col-lg-4 body_licence_upload_name">
            {{ file.doc_name }}
          </div>
          <div class="col-md-4 col-sm-4 col-lg-4 body_licence_upload_name">
            <span v-if="file.doc_date">{{ formatDate(file.doc_date) }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </div>
          <div class="col-md-4 col-sm-4 col-lg-4 body_licence_upload_name pb-3">
            <a :href="envImagePath + file.doc_url" download target="_blank">
              <v-tooltip :text="this.$t('download_license')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    plain
                    v-bind="props"
                    dense
                    class="mr-2 edit_btn icon_size"
                    >mdi-download</v-icon
                  >
                </template>
              </v-tooltip>
            </a>
          </div>
          <v-divider></v-divider>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h6 v-if="!loader_tradie" class="nodatavailable">
      {{ $t("no_data_available") }}
    </h6>
  </div>
</template>
<script>
export default {
  components: {},
  data: () => ({
    loader_tradie: true,
    tradie_answers: [],
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
  }),
  props: ["user_id", "version_id"],
  mounted() {},
  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id > 0) {
          this.fetchTradiesurveyAnswer(0);
        }
      },
    },
    version_id: {
      immediate: true,
      handler() {
        if (this.version_id > 0) {
          this.fetchTradiesurveyAnswer(this.version_id);
        }
      },
    },
  },
  methods: {
    fetchTradiesurveyAnswer(version) {
      this.loader_tradie = true;
      this.$emit("startstoploading", this.loader_tradie);
      this.$axios
        .post(import.meta.env.VITE_API_URL_ADMIN + "fetch_tradiesurvey_answer", {
          user_id: this.user_id,
          version_id: version,
        })
        .then((res) => {
          this.tradie_answers = res.data.answers;
          this.loader_tradie = false;
          this.$emit("startstoploading", this.loader_tradie);
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(" error" + err);
          this.loader_tradie = false;
          this.$emit("startstoploading", this.loader_tradie);
        });
    },
  },
};
</script>
<style scoped>
.h6_answer {
  color: #0000009c;
}

.h6_question {
  color: dodgerblue;
  font-weight: 700;
  margin-top: 15px;
}

.h6_section {
  font-size: 18px;
  font-weight: 700;
  color: #000000b7;
  margin-top: 30px;
}

.first_h6_section {
  font-size: 18px;
  margin-top: 10px;
  font-weight: 700;
  color: #000000b7;
}

.header_licence_upload_name {
  font-size: 14px;
  font-weight: 500;
}
.nodatavailable {
  text-align: center;
  margin-top: 60px;
  font-size: 21px;
}
</style>