<template>
  <div class="container">
    <div class="dash-parent">
      <div class="card" v-for="(data,k) in dashboard_data" :key="k">
        <div class="d-flex">
        <div class="card-title">{{data.title}}</div>
        <div class="icon-wrapper rounded-circle">
          <div v-bind:class="[data.title == 'Events' ? 'bg-primary' : 'bg-primary']" class="icon-wrapper-bg"></div>
          <i v-bind:class="[data.title == 'Events' ? 'text-primary' : 'text-primary']" class="fa fa-user"></i></div>
        </div>
        <div>
          <div>Total: {{data.count}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tabs: 1,
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    valid: true,
    loader: false,

    dashboard_data: [
      {
        id: 1,
        title: "Users",
        description: "Users",
        count: 5,
      },
      {
        id: 2,
        title: "Events",
        description: "Events",
        count: 5,
      },
      {
        id: 3,
        title: "Promotions",
        description: "Promotions",
        count: 6,
      },
      {
        id: 4,
        title: "Products",
        description: "Products",
        count: 30,
      },
    ],
    noimagepreview: "",
    items: [],
  }),

  created() {},

  methods: {},
};
</script>
<style scoped>
.d-flex{justify-content: space-between;}
::after, ::before
{
  text-decoration: inherit;
  vertical-align: inherit;
}
.icon-wrapper i::before
{
  margin-top: -3px;
}
.lnr-cog::before
{
  content: "\E810";
}
.bg-primary
{
  background-color: #3f6ad8 !important;
}
.icon-wrapper .icon-wrapper-bg
{
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 3;
  opacity: .2;
}
.icon-wrapper
{
  width: 54px;
  height: 54px;
  /* margin: 0 auto; */
  position: relative;
  overflow: hidden;
}
.icon-wrapper
{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.icon-wrapper i
{
  margin: 0 auto;
  font-size: 1.7rem;
  position: relative;
  z-index: 5;
}
.rounded-circle
{
  border-radius: 50% !important;
}
.card-title{font-weight: 600;
  font-size: 23px;}
.text-label {
  position: absolute;
  left: 50%;
  top: 50%;
  font-weight: bold;
  font-size: 40px;
  color: #808080ba;
  animation: fadeInUp 1s forwards;
}
 .col-lg-3
{
    -webkit-box-flex: 0;
    -ms-flex: 0 0 25%;
    flex: 0 0 25%;
    max-width: 25%;
  }
  .dash-parent{
display: flex;
  justify-content: space-between;
  align-items: center;
  }
.dash-parent>div {
  box-shadow: 0 0.46875rem 2.1875rem rgba(63, 106, 216, 0.03),
    0 0.9375rem 1.40625rem rgba(63, 106, 216, 0.03),
    0 0.25rem 0.53125rem rgba(63, 106, 216, 0.05),
    0 0.125rem 0.1875rem rgba(63, 106, 216, 0.03);
  margin: 20px 0px;
  margin: 20px 0px;
  width: 291px;
  padding: 20px;border-bottom: 4px solid #bf1f1f;
}
</style>