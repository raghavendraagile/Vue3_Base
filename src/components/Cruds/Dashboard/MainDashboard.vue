<template>
  <div>
    <page-title
      :heading="$t('dashboard')"
      :google_icon="google_icon"
    ></page-title>

    <ComingSoon></ComingSoon>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ComingSoon from "../../CustomComponents/ComingSoon.vue";
export default {
  components: {
    ComingSoon,
  },
  computed: {
    ...mapGetters("auth", ["loggedin"]),
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    search: "",
    loader: false,
    role_id: "",
    menuitems: [],
    google_icon: {
      icon_name: "dashboard",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },

  methods: {},
};
</script>
