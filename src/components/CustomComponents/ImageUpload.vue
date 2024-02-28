<template>
  <div>
    <v-dialog v-model="dialogVisible" max-width="750px" persistent>
      <content-loader v-if="loader"></content-loader>

      <v-card>
        <div class="d-flex justify-content-between">
          <div>
            <v-card-title>{{ $t("crop_image") }} </v-card-title>
          </div>
          <div class="btn_margin">
            <v-btn color="success" @click="cropImage">{{ $t("upload") }}</v-btn>
            <v-btn color="error" @click="cancelCrop" class="ml-2">{{
              $t("cancel")
            }}</v-btn>
          </div>
        </div>
        <v-card-text>
          <div class="cropper-container" ref="cropperContainer">
            <!-- Below one is porp can be used where we can define all the props in data and pass like below one -->
            <!-- :options="cropperOptions" -->
            <!-- :min-container-width="250"
              :min-container-height="180" -->
            <VueCropper
              ref="cropper"
              :guides="true"
              :view-mode="0"
              drag-mode="none"
              :min-canvas-width="0"
              :min-canvas-height="0"
              :cropBoxResizable="false"
              :cropBoxMovable="true"
              :src="selectedFile"
              :zoomable="true"
              alt="Source Image"
              @crop="handleCrop"
              :img-style="{ width: '800px', height: '500px' }"
              @ready="cropperReady"
            ></VueCropper>
            <!--  <VueCropper
             ref="cropper"
              :dragMode="'none'"
              :src="selectedFile"
              :view-mode="2"
              :cropBoxResizable="false"
              :cropBoxMovable="true"
              :minCropBoxWidth="250"
              :minCropBoxHeight="180"
              :autoCrop="true"
              :img-style="{ width: '500px', height: '400px' }"
              v-bind="$attrs"
              @crop="handleCrop"
              @ready="cropperReady"
            ></VueCropper> -->
          </div>
        </v-card-text>

        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="cropImage">{{ $t("upload") }}</v-btn>
          <v-btn color="error" @click="cancelCrop">{{ $t("cancel") }}</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
    <input
      type="file"
      @change="onFileChange"
      accept="image/*"
      ref="fileInput"
      style="display: none"
      id="file"
    />
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import VueCropper from "vue-cropperjs";

export default {
  name: "ImageUploadCropper",
  components: {
    VueCropper,
  },
  props: {
    resizewidth: {
      type: Number,
      default: 200,
    },
    resizeheight: {
      type: Number,
      default: 80,
    },
    folder: {
      type: String,
      default: "others",
    },
    upload_profile: {},
  },
  data() {
    return {
      selectedFile: null,
      message: "",
      dialogVisible: false,
      loader: false,
      //Below are the options that are there in Cropper
      cropperOptions: {
        // aspectRatio: 12 / 12,
        viewMode: 1,
        autoCropArea: 1,
        movable: false,
        scalable: false,
        zoomable: false,
        rotatable: false,
        checkCrossOrigin: false,
        checkOrientation: false,
        cropBoxResizable: false,
      },
      cropper: null,
      cropperInstance: null,
      imagedata: "",
    };
  },
  watch: {
    upload_profile() {
      document.getElementById("file").click();
    },
  },
  methods: {
    handleCrop() {
      if (this.selectedFile && this.$refs.cropper) {
        const croppedCanvas = this.$refs.cropper.getCroppedCanvas();
        // Use the cropped canvas as needed
        this.imagedata = croppedCanvas.toDataURL();
      }
    },
    cropperReady() {
      const fixedWidth = this.resizewidth;
      const fixedHeight = this.resizeheight;

      this.$nextTick(() => {
        const containerData = this.$refs.cropper.getContainerData();
        const cropBoxData = {
          left: Math.max(0, (containerData.width - fixedWidth) / 2),
          top: Math.max(0, (containerData.height - fixedHeight) / 2),
          width: Math.min(fixedWidth, containerData.width),
          height: Math.min(fixedHeight, containerData.height),
        };
        this.$refs.cropper.setCropBoxData(cropBoxData);
      });
    },

    openFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const filename = event.target.files[0].name;
      if (file) {
        this.resizeImage(file, (resizedImage) => {
          this.selectedFile = URL.createObjectURL(resizedImage);
          this.dialogVisible = true;
        });
        const lastDot = filename.lastIndexOf(".");
        const fileNameWithoutExt = filename.substring(0, lastDot);
        const ext = filename.substring(lastDot + 1);
        console.log("FileName => " + fileNameWithoutExt);
        this.filename = fileNameWithoutExt;
        console.log("Extension => " + ext);
        this.extension = ext;
        // this.dialogVisible = true;
        event.target.value = "";
      } else {
        this.selectedFile = null;
        this.dialogVisible = false;
      }
    },

    cropImage() {
      if (this.imagedata) {
        this.upload(this.imagedata);
      }
    },
    resizeImage(file, callback) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          // Set your desired image size
          canvas.width = 800; // Example width
          canvas.height = 600; // Example height
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            callback(blob);
          }, file.type);
        };
        img.src = e.target.result;
        // this.loader = false;
      };
      reader.readAsDataURL(file);
      // this.loader = false;
    },
    upload(imagedata) {
      this.loader = true;
      if (!imagedata) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";
      this.$axios
        .post("imageupload", {
          image: imagedata,
          folder: this.folder,
          filename: this.filename,
          extension: this.extension,
        })
        .then((res) => {
          this.loader = false;
          console.log(res.data);
          this.imageloading = false;
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.icon = res.data.filepath;
            this.selectedFile = null;
            this.dialogVisible = false;
            this.$emit("uploaded_image", res.data.filepath);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          this.loader = false;
          this.imageloading = false;
          alert("Unable to upload file, try later");
          console.log("this error -> " + err);
        });
    },
    cancelCrop() {
      // Reset the selected file and cropper
      this.selectedFile = null;
      this.dialogVisible = false;
      // this.cropperInstance.reset();
    },
  },
};
</script>

<style scoped>
.cropper-container .cropper-view-box,
.cropper-container .cropper-face {
  min-width: 200px !important; /* Set your desired minimum width here */
  min-height: 10px !important; /* Set your desired minimum width here */
}
.btn_margin {
  margin: 10px 26px 0px 0px;
}
</style>
