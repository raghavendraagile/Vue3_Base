<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        heading="Create Document"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Drug Name" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.drug_name"
                    :rules="fieldRules"
                    label="Drug Name"
                    variant="outlined"
                    density="compact"
                    required
                    counter="100"
                    counter-value="100"
                    class="required_field"
                    maxlength="100"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Capsule Strength" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.capsule_strength"
                    :rules="fieldRules"
                    label="Capsule Strength"
                    variant="outlined"
                    density="compact"
                    required
                    counter="100"
                    counter-value="100"
                    class="required_field"
                    maxlength="100"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col cols="12" sm="3" md="3" class="pb-0">
              <v-tooltip text="Capsules Per Cyle" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.capsules_per_cyle"
                    :rules="numberRules"
                    label="Capsules Per Cyle"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="20"
                    @input="calculateTotal"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="pb-0">
              <v-tooltip text="Number Of Cycles" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.number_of_cycles"
                    :rules="numberRules"
                    label="Number Of Cycles"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="20"
                    @input="calculateTotal"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="pb-0">
              <v-tooltip text="Total Capsules" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.total_capsules"
                    :rules="numberRules"
                    label="Total Capsules"
                    variant="outlined"
                    density="compact"
                    required
                    class="required_field"
                    maxlength="20"
                    type="number"
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
export default {
  data: () => ({
    google_icon: {
      icon_name: "domain_add",
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
    drug: {
      id: 0,
      drug_name: "",
      capsule_strength: "",
      capsules_per_cyle: "",
      number_of_cycles: "",
      total_capsules: "",
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [
        (v) => !!v || this.$t("number_required"),
        (v) => /^\d+$/.test(v) || "Only numbers allowed",
      ];
    },
  },
  mounted() {},
  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("edit_drug/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status == "S") {
                this.drug = res.data.drug;
                this.loader = false;
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
  },
  methods: {
    cancel() {
      this.$router.push({
        name: "drug",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;
        this.$axios
          .post("create_drug", this.drug)
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
                name: "drug",
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
    calculateTotal() {
      const perCycle = Number(this.drug.capsules_per_cyle);
      const cycles = Number(this.drug.number_of_cycles);

      if (perCycle && cycles) {
        this.drug.total_capsules = perCycle * cycles;
      } else {
        this.drug.total_capsules = "";
      }
    }
  },
};
</script>
