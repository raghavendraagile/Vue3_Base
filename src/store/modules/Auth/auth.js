import axios from "axios";
import localStorageWrapper from "../../../localStorageWrapper.js";
const state = {
  isAuthenticated: false,
  userData: null,
  loggedIn: true,
};

const getters = {
  user: (state) => state.userData,
  authentication: (state) => state.isAuthenticated,
  loggedin: (state) => state.loggedIn,
};

const mutations = {
  setAuthentication(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated;
  },
  setUserData(state, user) {
    state.userData = user;
  },
  storeImageUrl(state, url) {
    state.ImageFullUrl = url;
  },
  updateLoggedIn(state) {
    state.loggedIn = false;
  },
};

const actions = {
  loginRequest({ commit }, data) {
    // commit("setErrors", {}, { root: true });
    return axios
      .post(process.env.VUE_APP_API_URL_ADMIN + "login", data)
      .then((res) => {
        if (res.data.status == "S") {
          commit("setUserData", res.data.userdata);
          commit("setAuthentication", true);
          // const parsedUserData = JSON.stringify(res.data.userdata);
          localStorageWrapper.setItem("access_token", res.data.access_token);
          localStorageWrapper.setItem("user_data", JSON.stringify(res.data.userdata));
          setTimeout(() => {
            commit("updateLoggedIn");
          }, 3000);
        }else{
          return res.data;
        }
      })
      // .catch((error) => {
      //   console.log(error);
      // });
  },

  // logoutRequest({ commit }) {
  //   axios
  //     .post(process.env.VUE_APP_API_URL_ADMIN + "logout")
  //     .then(() => {
  //       commit("setUserData", null);
  //       commit("setAuthentication", false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
