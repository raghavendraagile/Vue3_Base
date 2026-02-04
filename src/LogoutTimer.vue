<template>
  <div>
    <v-dialog v-model="showPopup" width="auto" persistent>
      <v-card>
        <v-card-title class="text-center" style="font-weight: 600"
          >Session Expired</v-card-title
        >
        <v-card-text class="pt-0"> Please log in again. </v-card-text>
        <v-divider class="ma-0"></v-divider>
        <v-card-actions>
          <v-btn color="blue" block @click="showPopup = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  data() {
    return {
      logoutTimer: null,
      inactiveTime: 30 * 60 * 1000, // 30 minutes in milliseconds
      showPopup: false,
    };
  },
  mounted() {
    // Attach activity event listeners when the component is mounted
    window.addEventListener("mousemove", this.resetLogoutTimer);
    window.addEventListener("keydown", this.resetLogoutTimer);
    this.startLogoutTimer();
  },
  beforeUnmount() {
    // Remove event listeners when the component is about to be unmounted
    window.removeEventListener("mousemove", this.resetLogoutTimer);
    window.removeEventListener("keydown", this.resetLogoutTimer);
    this.clearLogoutTimer();
  },
  methods: {
    // Reset the logout timer on user activity
    resetLogoutTimer: debounce(function () {
      this.clearLogoutTimer();
      this.startLogoutTimer();
    }, 200), // Adjust the debounce time based on your preference

    // Start the logout timer
    startLogoutTimer() {
      this.logoutTimer = setTimeout(this.logoutPopup, this.inactiveTime);
    },

    // Clear the logout timer
    clearLogoutTimer() {
      clearTimeout(this.logoutTimer);
    },

    // Logout the user
    logoutPopup() {
      this.showPopup = true;
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>
