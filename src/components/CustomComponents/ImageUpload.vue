<template>
  <div>
    <content-loader v-if="loader"></content-loader>
    <v-dialog v-model="dialogVisible" :max-width="1000" persistent>
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
          </div>
        </v-card-text>
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
import Compressor from "compressorjs";

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
      originalAspectRatio: 0,
      cropperOptions: {
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
  this.$nextTick(() => {
    const croppedCanvas = this.$refs.cropper.getCroppedCanvas();
    if (croppedCanvas) {
      const canvas = document.createElement("canvas");
      canvas.width = this.resizewidth; 
      canvas.height = this.resizeheight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(croppedCanvas, 0, 0, this.resizewidth, this.resizeheight);
      this.imagedata = canvas.toDataURL(); 
      // console.log("Cropped image data: ", this.imagedata);
    }
  });
},


    cropperReady() {
      this.$nextTick(() => {
        this.adjustCropperCanvas();
        this.loader = false;
      });
    },
    adjustCropperCanvas() {
      const containerData = this.$refs.cropper.getContainerData();
      const imageData = this.$refs.cropper.getImageData();
      const originalAspectRatio =
        imageData.naturalWidth / imageData.naturalHeight;

      let canvasData = {
        width: containerData.width,
        height: containerData.width / originalAspectRatio,
      };

      if (canvasData.height > containerData.height) {
        canvasData.height = containerData.height;
        canvasData.width = containerData.height * originalAspectRatio;
      }

      canvasData.left = (containerData.width - canvasData.width) / 2;
      canvasData.top = (containerData.height - canvasData.height) / 2;

      this.$refs.cropper.setCanvasData(canvasData);

      const cropBoxData = {
        left: (containerData.width - this.resizewidth) / 2,
        top: (containerData.height - this.resizeheight) / 2,
        width: this.resizewidth,
        height: this.resizeheight,
      };

      this.$refs.cropper.setCropBoxData(cropBoxData);
    },

    openFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.loader = true; // Show loading indicator immediately
      const file = event.target.files[0];
      if (!file) {
        this.loader = false;
        return;
      }
      const filename = event.target.files[0].name;
      const lastDot = filename.lastIndexOf(".");
      const fileNameWithoutExt = filename.substring(0, lastDot);
      const ext = filename.substring(lastDot + 1);
      this.filename = fileNameWithoutExt;
      this.extension = ext;
      if (file.size > 6 * 1024 * 1024) {
        // 5 MB threshold
        alert(
          "The file size is too large. Please upload an image that is 6MB or less."
        );
        this.loader = false;
      } else if (file.size == 6 * 1024 * 1024) {
        this.compressAndLoadImage(file);
      } else {
        this.loadImageDirectly(file);
      }

      event.target.value = "";
    },
    compressAndLoadImage(file) {
      new Compressor(file, {
        quality: 0,
        success: (compressedResult) => {
          this.prepareImageForCropper(compressedResult);
        },
        error: (err) => {
          console.error("Compression error:", err.message);
          this.loader = false;
        },
      });
    },

    loadImageDirectly(file) {
      this.prepareImageForCropper(file);
    },

    prepareImageForCropper(file) {
      this.selectedFile = URL.createObjectURL(file);

      this.dialogVisible = true;
      setTimeout(() => {
        this.loader = false;
      }, 1000);
    },

    cropImage() {
      console.log(this.imagedata)
      if (this.imagedata) {
        this.upload(this.imagedata);
      }
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
  min-width: 200px !important;
  min-height: 10px !important;
}
.btn_margin {
  margin: 10px 26px 0px 0px;
}
</style>
