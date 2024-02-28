<template>
  <div>
    <iframe
      width="100%"
      height="800px"
      :src="webpath"
      frameborder="0"
      allowfullscreen
    ></iframe>
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
        console.log(newParams);
        this.webpath =
          this.web_url + "/" + newParams.lang + "/" + newParams.page;
      },
    },
  },
};
</script>

<style>
</style>