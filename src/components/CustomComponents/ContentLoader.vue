<template>
  <v-overlay persistent v-model="loader" class="overlay_class">
    <img src="@/assets/logo.png" class="logo-animation" alt="App Logo"/>
  </v-overlay>
</template>

<script>
export default {
  data: () => ({
    loader: true,
  }),
};
</script>
<style scoped>
.overlay_class {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-animation {
  width: 60px; 
  height: auto; 
  animation: zoomInOut 2s infinite; 
}

@keyframes zoomInOut {
  0%, 100% {
    transform: scale(1); 
  }
  50% {
    transform: scale(1.2); 
  }
}
</style>
