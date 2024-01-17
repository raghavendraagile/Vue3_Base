import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL_ADMIN,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );

  export default {
    install(app) {
      app.config.globalProperties.$axios = instance;
    }
  };
