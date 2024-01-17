<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('assign_sections')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div>
      <v-row class="px-10">
        <v-col
          col="12"
          md="4"
          sm="4"
          lg="4"
          v-for="(section, i) in assign_sections"
          :key="i"
          class="mb-6"
        >
          <v-card
            max-width="344"
            min-height="150"
            elevation="3"
            class="section_card mx-auto"
          >
            <div class="align-self-center mt-7">
              <v-card-item>
                <div class="text-h5">
                  {{ section.shortname }}
                </div>
              </v-card-item>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-tooltip :text="this.$t('manage_sections')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <router-link
                      :to="{
                        name: 'section_index',
                        query: { id: section.id, name: section.shortname },
                      }"
                      style="color: white"
                    >
                      <v-btn
                        variant="flat"
                        density="compact"
                        class="py-1"
                        color="success"
                        v-bind="props"
                        >{{ $t("manage_sections") }}</v-btn
                      >
                    </router-link>
                  </template>
                </v-tooltip>
                <v-spacer></v-spacer>
              </v-card-actions>
            </div>
          </v-card>
        </v-col>
      </v-row>
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
    assign_sections: [],
    loader: true,
  }),

  computed: {},

  created() {
    this.fetchlookup();
  },
  watch: {},
  methods: {
    fetchlookup() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchlookup", {
          params: {
            lookup_type: "TRADIE_SECTIONS",
          },
        })
        .then((response) => {
          this.assign_sections = response.data.lookup_details;
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
          this.loader = false;
        });
    },
  },
};
</script>
<style scoped>
.section_card {
  background: #fbfdfb;
}

.section_card:hover {
  background: #dbe5e1;
}
</style> 