<template>
  <div class="preview-boundry">
    <div class="container-fluid header-preview">
      {{ $t("preview") }}
    </div>
    <div>
      <iframe
        width="100%"
        height="800px"
        :src="webpath"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      web_url: process.env.VUE_APP_WEB_URL,
      webpath: "",
    };
  },
  watch: {
    "$route.params": {
      immediate: true,
      deep: true,
      handler(newParams) {
        // localStorage.setItem('preview','Y');
        if (newParams.page) {
          this.webpath =
            this.web_url +
            "/" +
            newParams.lang +
            "/" +
            newParams.page +
            "/preview";
        } else {
          this.webpath = this.web_url + "/" + newParams.lang + "/preview";
        }
      },
    },
  },
};
</script>

<style scoped>
.header-preview {
  background: rgb(19, 19, 19);
  color: white;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  text-transform: full-width;
  margin: 0px;
}
.icon-r {
  font-size: 40px;
}
.preview-boundry{
  border: 10px solid rgb(19, 19, 19);
  margin: 0px;
}
</style>