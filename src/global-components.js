import PageTitle from "@/components/CustomComponents/PageTitle.vue";
import ContentLoader from "@/components/CustomComponents/ContentLoader.vue";
import ConfirmationDialog from "@/components/CustomComponents/ConfirmationDialog.vue";
import NoDataFound from "@/components/CustomComponents/NoDataFound.vue";
import DocumentUpload from "@/components/CustomComponents/DocumentUpload.vue";

import VOtpInput from "vue3-otp-input";

export default {
  install(app) {
    app.component("page-title", PageTitle);
    app.component("content-loader", ContentLoader);
    app.component("v-otp-input", VOtpInput);
    app.component("confirmation-dialog", ConfirmationDialog);
    app.component("no-data-found", NoDataFound);
    app.component("document-upload", DocumentUpload);
  },
};
