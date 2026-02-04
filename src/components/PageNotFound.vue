<template>
  <div>
    <div class="not_found_p1">404</div>
    <div class="errorimage"><h1 class="text-center"></h1></div>
    <div class="not_found_p2">{{$t('not_found_p2')}}</div>
    <div class="not_found_p3">{{$t('not_found_p3')}}</div>
    <div class="d-flex justify-center mt-5">
    <v-btn class="back-btn" @click="redirectBack()">{{$t('take_me_back')}}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
  methods:{
    redirectBack(){
      this.$router.go(-2);
    }
  }
};
</script>

<style scoped>
.errorimage {
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
  background-position: 50%;
  background-repeat: no-repeat;
  height: 400px;
}
.not_found_p1{
    text-align: center;
    font-weight: bold;
    font-size: 70px;
}
.not_found_p2{
    text-align: center;
    font-weight: bold;
    font-size: 50px;
}
.not_found_p3{
    text-align: center;
    font-weight: bold;
    font-size: 20px;
}
.back-btn{
    background: #ee611cd9;
    color: white;
    font-weight: bold;
}
</style>
