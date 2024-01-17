<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_section')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col sm="5" md="5">
              <v-tooltip :text="this.$t('parent_menu')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind:label="$t('parent_menu')"
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    disabled="true"
                    v-model="section.parent_menu_display"
                    class="pr-2"
                  >
                  </v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col sm="4" md="4">
              <v-tooltip :text="this.$t('section')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    :items="sectionOrderArray"
                    v-bind:label="$t('section')"
                    index="id"
                    v-bind="props"
                    item-value="shortname"
                    variant="outlined"
                    density="compact"
                    item-title="shortname"
                    v-model="section.section"
                    class="required_field"
                    :rules="fieldRules"
                  >
                  </v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col sm="3" md="3">
              <v-tooltip :text="this.$t('visible_to')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    :items="RoleArray"
                    v-bind:label="$t('visible_to')"
                    index="id"
                    v-bind="props"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    item-title="rolename"
                    v-model="section.visible_to"
                    class="required_field"
                    :rules="fieldRules"
                  >
                  </v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col md="5" sm="5" class="pr-5">
              <v-tooltip :text="this.$t('section_name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="section.section_name"
                    maxlength="100"
                    :rules="fieldRules"
                    v-bind:label="$t('section_name')"
                    required
                    density="compact"
                    class="required_field"
                    variant="outlined"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col sm="7" md="7">
              <v-tooltip :text="this.$t('description')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="section.description"
                    v-bind:label="$t('description')"
                    required
                    variant="outlined"
                    density="compact"
                    class="pr-2"
                    maxlength="200"
                  ></v-text-field>
                </template>
              </v-tooltip>
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
                  @click="submitsection"
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
    sectionarray: [],
    RoleArray: [],
    sectionOrderArray: [],
    section: {
      id: 0,
      description: "",
      parent_menu: null,
      visible_to: null,
      section: null,
      parent_menu_display: "",
      section_name: "",
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  mounted() {
    this.fetchlookup();
  },

  watch: {
    "$route.query.parent": {
      immediate: true,
      handler() {
        if (this.$route.query.parent != "") {
          this.section.parent_menu_display = this.$route.query.parent;
          this.section.parent_menu = this.$route.query.id;
        }
      },
    },
    "$route.query.section_id": {
      immediate: true,
      handler() {
        if (this.$route.query.section_id > 0) {
          this.fetchSectionbyID(this.$route.query.section_id);
        }
      },
    },
  },

  methods: {
    fetchSectionbyID(id) {
      this.loader = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetchsectionbyidforedit/" + id
        )
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.section = res.data.section;
            this.loader = false;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          console.log("this error" + err);
        });
    },

    submitsection() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.section.parent_menu = this.$route.query.id;
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "savesections",
            this.section
          )
          .then((res) => {
            if (res.data.status == "S") {
              this.$toast.success(res.data.message);
              this.$router.push({
                name: "section_index",
                query: {
                  id: this.$route.query.id,
                  name: this.$route.query.parent,
                },
              });
            } else {
              this.$toast.error(this.$t("something_went_wrong"));
              this.isDisabled = false;
            }
          })
          .catch((err) => {
            this.$toast.error(this.$t("something_went_wrong"));
            this.isDisabled = false;
            console.log("this error" + err);
          });
      }
    },

    fetchlookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "SECTIONS",
          },
        })
        .then((response) => {
          this.sectionOrderArray = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchrole")
        .then((response) => {
          this.RoleArray = response.data.roles;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
  <style>
</style>