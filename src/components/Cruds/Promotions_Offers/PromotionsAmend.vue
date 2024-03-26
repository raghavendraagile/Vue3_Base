<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_promotion')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="card-body">
      <content-loader v-if="loader"></content-loader>
      <v-tabs v-model="tabs" color="blue">
        <v-tab :value="1">
          <span>{{ $t("english") }}</span>
        </v-tab>
        <v-tab :value="2">
          <span>{{ $t("arabic") }}</span>
        </v-tab>
      </v-tabs>
      <v-alert
        closable
        close-label="Close Alert"
        density="compact"
        color="rgb(var(--v-theme-error))"
        v-if="error_valid"
        variant="tonal"
        @click:close="error_valid = false"
        class="mb-4"
        v-bind:class="[tabs == 1 ? '' : 'arabdirectionalert']"
        :title="
          tabs == 1 ? $t('validation_error_en') : $t('validation_error_ar')
        "
        :text="
          tabs == 1
            ? $t('please_fill_required_fields_en')
            : $t('please_fill_required_fields_ar')
        "
      ></v-alert>
      <v-window v-model="tabs">
        <!-- ENGLISH TAB STARTS -->
        <v-window-item :value="1">
          <v-form ref="form" v-model="valid">
            <v-layout
              v-if="user.rolename != 'StoreAdmin'"
              style="direction: rtl"
            >
              <v-row class="px-6 mt-2">
                <v-col xs="12" md="12" lg="12">
                  <!-- :disabled="$route.query.slug" -->
                  <!-- {{promotions[0].stor_type}} -->
                  <v-radio-group
                    v-model="promotions[0].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(promotions[0].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :disabled="this.$route.query.slug"
                      :label="changeRoleName(role_data.rolename)"
                      :value="role_data.rolename"
                      class="text--primary"
                    >
                    </v-radio>
                    <!-- <v-radio :label="$t('mall')" value="Mall"></v-radio>
                    <v-radio value="Store" :label="$t('store')"></v-radio> -->
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-layout>
            <v-row class="mx-auto mt-2" max-width="344">
              <v-col
                cols="12"
                sm="12"
                md="4"
                v-if="user.rolename != 'StoreAdmin'"
              >
                <!-- v-bind:label="$t('store_en')" -->
                <v-tooltip :text="labelText" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="promotions[0].store_id"
                      @update:modelValue="(value) => updateMall(value)"
                      :label="labelText"
                      variant="outlined"
                      :disabled="
                        user.rolename == 'MallAdmin' &&
                        promotions[0].stor_type == 'MallAdmin'
                      "
                      :loading="store_loader"
                      density="compact"
                      :rules="fieldRules"
                      :items="stores_en"
                      item-title="name"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <!--  -->
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[0].title"
                      :rules="fieldRules"
                      v-bind:label="$t('title_en')"
                      v-bind="props"
                      required
                      class="required_field"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="6" md="2" sm="6" lg="2">
                <v-tooltip :text="$t('mobile_code_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind:label="$t('mobile_code_en')"
                      v-bind="props"
                      required
                      variant="outlined"
                      density="compact"
                      index="id"
                      item-key="mobile_code"
                      item-value="mobile_code"
                      item-title="mobile_code"
                      v-model="promotions[0].mobile_code"
                      @update:modelValue="(value) => updateMobileCode(value)"
                      :items="country_array_en"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="6" sm="6" md="2">
                <v-tooltip :text="this.$t('phone_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[0].phone"
                      @update:modelValue="(value) => updatePOPhone(value, 1)"
                      v-bind:label="$t('phone_en')"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      maxlength="12"
                      v-on:keypress="NumbersOnly"
                      required
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('email_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[0].email"
                      @update:modelValue="(value) => updatePOEmail(value, 1)"
                      v-bind:label="$t('email_en')"
                      v-bind="props"
                      required
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <!-- :rules="fieldRules" -->
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('type_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="promotions[0].type"
                      v-bind:label="$t('type_en')"
                      variant="outlined"
                      @update:modelValue="
                        (value) => updatePromotionType(value, 1)
                      "
                      density="compact"
                      class="required_field"
                      :rules="fieldRules"
                      required
                      index="id"
                      :items="p_type_en"
                      item-value="header_id"
                      item-title="longname"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-tooltip :text="$t('floor_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="promotions[0].floor"
                      v-bind:label="$t('floor_en')"
                      @update:modelValue="(value) => updateFloor(value, 1)"
                      variant="outlined"
                      density="compact"
                      :items="floors_en"
                      item-title="longname"
                      item-value="shortname"
                      class="required_field"
                      :rules="fieldRules"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-tooltip :text="$t('sequence_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="promotions[0].seq"
                      @update:modelValue="(value) => updatePOSequence(value, 1)"
                      maxlength="5"
                      :rules="seqRules"
                      v-bind:label="$t('sequence_en')"
                      required
                      variant="outlined"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('start_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('start_date_en')"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="promotions[0].start_date"
                      @formatted_date="formatted_start_date"
                      dense
                      :class_required="'RequiredField'"
                      v-on="on"
                    />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('end_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('end_date_en')"
                      :min="promotions[0].start_date"
                      :stored_date="promotions[0].end_date"
                      @formatted_date="formatted_end_date"
                      dense
                      :class_required="'RequiredField'"
                      v-on="on"
                    />
                  </template>
                  <span>{{ $t("end_date") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[0].meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title_en')"
                      v-bind="props"
                      variant="outlined"
                      class="required_field"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip :text="this.$t('description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="promotions[0].description"
                      :rules="fieldRules"
                      class="required_field"
                      maxlength="2000"
                      counter="true"
                      v-bind="props"
                      v-bind:label="$t('description_en')"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip
                  :text="this.$t('meta_description_en')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="promotions[0].meta_description"
                      :rules="fieldRules"
                      maxlength="160"
                      counter="true"
                      v-bind="props"
                      class="required_field"
                      v-bind:label="$t('meta_description_en')"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-if="promotions[0].image_path != null"
                          :src="envImagePath + promotions[0].image_path"
                          width="100"
                          height="85
                          "
                          alt
                        />
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-else
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                  <v-tooltip :text="this.$t('download_en')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <a class="text-center pointer download_icon">
                        <span
                          ><v-icon
                            v-if="promotions[0].image_path"
                            v-bind="props"
                            class="mr-2"
                            @click="downloadImage(promotions[0].image_path)"
                            >mdi mdi-download</v-icon
                          ></span
                        >
                      </a>
                    </template>
                  </v-tooltip>
                  <span>
                    <v-tooltip :text="this.$t('delete_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          small
                          v-bind="props"
                          v-if="promotions[0].image_path"
                          class="mr-2 edit_btn icon_size delete_icon"
                          @click="removeImage(0)"
                          >mdi mdi-trash-can-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </span>
                </div>

                <br />
                <Imageupload
                  :folder="'promotions_offers'"
                  :resizewidth="200"
                  :resizeheight="200"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfile"
                />
                <div class="dimension_text">200 : 200</div>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
        <!-- ENGLISH TAB STOPS -->
        <!-- ARABIC TAB STARTS -->
        <v-window-item :value="2">
          <v-form
            ref="form"
            v-model="validAR"
            style="direction: rtl; text-align: end"
          >
            <v-layout v-if="user.rolename != 'StoreAdmin'">
              <!-- :disabled="$route.query.slug" -->
              <v-row class="px-6 mt-2 arabdirection">
                <v-col xs="12" md="12" lg="12">
                  <v-radio-group
                    v-model="promotions[1].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(promotions[1].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :disabled="this.$route.query.slug"
                      :label="changeStatusAr(role_data.rolename)"
                      :value="role_data.rolename"
                      class="text--primary"
                    >
                    </v-radio>
                    <!-- <v-radio :label="$t('mall')" value="Mall"></v-radio>
                    <v-radio value="Store" :label="$t('store')"></v-radio> -->
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-layout>
            <v-row class="mx-auto mt-2 arabdirection" max-width="344">
              <v-col
                cols="12"
                sm="12"
                md="4"
                v-if="user.rolename != 'StoreAdmin'"
              >
                <v-tooltip :text="label_text_ar" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="promotions[1].store_id"
                      @update:modelValue="(value) => updateMall(value)"
                      :label="label_text_ar"
                      :rules="fieldRulesAr"
                      variant="outlined"
                      :loading="store_loader"
                      density="compact"
                      :disabled="
                        user.rolename == 'MallAdmin' &&
                        promotions[0].stor_type == 'MallAdmin'
                      "
                      :items="stores_ar"
                      item-title="name"
                      item-value="header_id"
                      class="required_field rtl"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[1].title"
                      :rules="fieldRulesAr"
                      v-bind:label="$t('title_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="6" md="2" sm="6" lg="2">
                <v-tooltip :text="$t('mobile_code_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind:label="$t('mobile_code_ar')"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      item-key="mobile_code"
                      item-value="mobile_code"
                      item-title="mobile_code"
                      v-model="promotions[1].mobile_code"
                      @update:modelValue="(value) => updateMobileCode(value)"
                      :items="country_array_ar"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="6" md="2" sm="6" lg="2">
                <v-tooltip :text="this.$t('phone_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[1].phone"
                      @update:modelValue="(value) => updatePOPhone(value, 0)"
                      v-bind:label="$t('phone_ar')"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      maxlength="12"
                      v-on:keypress="NumbersOnly"
                      required
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('email_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[1].email"
                      @update:modelValue="(value) => updatePOEmail(value, 0)"
                      v-bind:label="$t('email_ar')"
                      v-bind="props"
                      required
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('type_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-select
                      v-bind="props"
                      v-model="promotions[1].type"
                      @update:modelValue="
                        (value) => updatePromotionType(value, 0)
                      "
                      :rules="fieldRulesAr"
                      v-bind:label="$t('type_ar')"
                      variant="outlined"
                      density="compact"
                      class="required_field"
                      required
                      index="id"
                      :items="p_type_ar"
                      item-value="header_id"
                      item-title="longname"
                    ></v-select>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-tooltip :text="$t('floor_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="promotions[1].floor"
                      v-bind:label="$t('floor_ar')"
                      @update:modelValue="(value) => updateFloor(value, 0)"
                      variant="outlined"
                      density="compact"
                      :items="floors_ar"
                      item-title="longname"
                      item-value="shortname"
                      class="required_field"
                      :rules="fieldRules"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="2">
                <v-tooltip :text="$t('sequence_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="promotions[1].seq"
                      @update:modelValue="(value) => updatePOSequence(value, 0)"
                      maxlength="5"
                      :rules="seqRulesAR"
                      v-bind:label="$t('sequence_ar')"
                      required
                      variant="outlined"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('start_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('start_date_ar')"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="promotions[1].start_date"
                      @formatted_date="formatted_start_date_ar"
                      dense
                      :class_required="'RequiredField'"
                      v-on="on"
                    />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('end_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('end_date_ar')"
                      :min="promotions[1].start_date"
                      :stored_date="promotions[1].end_date"
                      @formatted_date="formatted_end_date_ar"
                      dense
                      :class_required="'RequiredField'"
                      v-on="on"
                    />
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="promotions[1].meta_title"
                      :rules="fieldRulesAr"
                      v-bind:label="$t('meta_title_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="promotions[1].description"
                      :rules="fieldRulesAr"
                      maxlength="2000"
                      v-bind="props"
                      v-bind:label="$t('description_ar')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip
                  :text="this.$t('meta_description_ar')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="promotions[1].meta_description"
                      :rules="fieldRulesAr"
                      maxlength="160"
                      v-bind="props"
                      v-bind:label="$t('meta_description_ar')"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      counter="true"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("meta_description_ar") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-if="promotions[1].image_path != null"
                          :src="envImagePath + promotions[1].image_path"
                          width="100"
                          height="85
                          "
                          alt
                        />
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-else
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                  <div class="text-right">
                    <v-tooltip :text="this.$t('download_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <a class="text-center pointer download_icon_ar">
                          <span
                            ><v-icon
                              v-if="promotions[1].image_path"
                              v-bind="props"
                              class="mr-2"
                              @click="downloadImage(promotions[1].image_path)"
                              >mdi mdi-download</v-icon
                            ></span
                          >
                        </a>
                      </template>
                    </v-tooltip>
                    <span>
                      <v-tooltip :text="this.$t('delete_ar')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            small
                            v-bind="props"
                            v-if="promotions[1].image_path"
                            class="mr-2 edit_btn icon_size delete_icon_ar"
                            @click="removeImage(1)"
                            >mdi mdi-trash-can-outline</v-icon
                          >
                        </template>
                      </v-tooltip>
                    </span>
                  </div>
                </div>

                <br />
                <Imageupload
                  :folder="'promotions_offers'"
                  :resizewidth="200"
                  :resizeheight="200"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfilear"
                />
                <div class="dimension_text">200 : 200</div>
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
      </v-window>
    </div>
    <div class="d-block mr-4 mt-3 pb-3 text-right">
      <v-tooltip :text="this.$t('cancel')" location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-inline-block mr-2">
            <v-btn
              v-bind="props"
              size="small"
              @click="
                $router.push({
                  name: 'promotions_offers',
                  query: { s_tab: this.tabs },
                })
              "
              :disabled="loading"
              class="ma-1"
              color="cancel"
              >{{ $t("cancel") }}</v-btn
            >
          </div>
        </template>
      </v-tooltip>
      <v-tooltip :text="this.$t('submit')" location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-inline-block">
            <v-btn
              :disabled="isDisabled"
              @click="presubmitvalidation"
              size="small"
              class="mr-2"
              color="success"
            >
              {{ $t("submit") }}
              <v-progress-circular
                v-if="isBtnLoading"
                indeterminate
                width="1"
                color="cancel"
                size="x-small"
                class="ml-2"
              ></v-progress-circular>
            </v-btn>
          </div>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import DatePicker from "../../CustomComponents/DatePicker.vue";
import Imageupload from "../../CustomComponents/ImageUpload.vue";
export default {
  components: { DatePicker, Imageupload },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    tabs: 1,
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: false,
    validAR: false,
    error_valid: false,
    loader: false,
    store_loader: false,
    file: "",
    sel_lang: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    uploadfile: false,
    uploadfilear: false,
    p_type_en: [],
    p_type_ar: [],
    stores_en: [],
    stores_ar: [],
    mal_data_en: [],
    mal_data_er: [],
    role_array: [],
    stores_data_ar: [],
    stores_data_en: [],
    country_array_en: [],
    country_array_ar: [],
    user: "",
    labelText: "Mall",
    label_text_ar: "مجمع تجاري",
    mall_id: null,
    promotions: [
      {
        id: 0,
        title: "",
        description: "",
        phone: "",
        mobile_code: "",
        email: "",
        type: "",
        start_date: "",
        end_date: "",
        seq: "",
        image_path: null,
        meta_title: "",
        meta_description: "",
        lang: "en",
        store_id: null,
        stor_type: "",
        floor: "",
      },
      {
        id: 0,
        title: "",
        description: "",
        phone: "",
        mobile_code: "",
        email: "",
        type: "",
        start_date: "",
        end_date: "",
        seq: "",
        image_path: null,
        meta_title: "",
        meta_description: "",
        lang: "ar",
        store_id: null,
        stor_type: "",
        floor: "",
      },
    ],

    noimagepreview: "",
    items: [],
    floors_en: [],
    floors_ar: [],
  }),

  computed: {
    seqRules() {
      return [(v) => (v >= 0 && v <= 9999999) || this.$t("number_required")];
    },
    seqRulesAR() {
      return [(v) => (v >= 0 && v <= 9999999) || this.$t("number_required_ar")];
    },
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    emailRulesAr() {
      return [
        (v) => !!v || this.$t("email_required_ar"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    phoneRules() {
      return [
        (v) => (v >= 0 && v <= 999999999999) || this.$t("number_required"),
      ];
    },
    numberRules() {
      return [(v) => (v >= 0 && v <= 999999999999) || this.$t("entered_value")];
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    fieldRulesAr() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },
  },
  mounted() {
    // this.promotions[0].type = "promotions";
    // this.promotions[1].type = "promotions";
    this.fetchLookup();
    this.get_stores();
    this.fetchMall();
    this.get_countries();
  },
  created() {
    this.fetchRoles();
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  watch: {
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab == 1) {
          this.tabs = 1;
        } else {
          this.tabs = 2;
        }
      },
    },
    "$route.query.slug": {
      immediate: true,
      handler() {
        // alert('Inside watch');
        // alert(this.$route.query.slug);
        if (this.$route.query.slug) {
          this.valid = true;
          this.validAR = true;
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_promotions_offers/" +
                this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.promotions = res.data.promotions_offers;
              this.assignType(this.promotions[0].stor_type);

              this.loader = false;
            });
        }
      },
    },
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
  },
  methods: {
    updatePromotionType(value, index) {
      this.promotions[index].type = value;
    },
    updateFloor(value, index) {
      this.promotions[index].floor = value;
    },
    updatePOSequence(value, index) {
      this.promotions[index].seq = value;
    },
    updatePOEmail(value, index) {
      this.promotions[index].email = value;
    },
    changeRoleName(role_name) {
      switch (role_name) {
        case "MallAdmin":
          return this.$t("mall");
        case "StoreAdmin":
          return this.$t("store");
        // case "Rejected":
        //   return this.$t("rejected_ar");
        default:
          return "";
      }
    },
    changeStatusAr(status) {
      switch (status) {
        case "MallAdmin":
          return this.$t("mall_admin_ar");
        case "StoreAdmin":
          return this.$t("store_admin_ar");
        // case "Rejected":
        //   return this.$t("rejected_ar");
        default:
          return "";
      }
    },
    removeImage(index) {
      if (index == 1) {
        this.promotions[1].image_path = null;
      } else {
        this.promotions[0].image_path = null;
      }
    },
    fetchMall() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-malls")
        .then((response) => {
          console.log(response);
          this.mal_data_en = response.data.malls_en;
          this.mal_data_ar = response.data.malls_ar;
          if (this.user.rolename == "MallAdmin" && !this.$route.query.slug) {
            this.mal_data_en.filter((ele) => {
              if (ele.header_id === this.user.store_id) {
                this.promotions[0].store_id = ele.header_id;
                this.promotions[1].store_id = ele.header_id;
                this.mall_id = ele.header_id;
              }
            });
          }

          // const default_en = {
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_reg_roles")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;
          if (!this.$route.query.slug && this.user.rolename == "SuperUser") {
            this.promotions[0].stor_type = this.role_array[0].rolename;
            this.promotions[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.promotions[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            !this.$route.query.slug
          ) {
            // this.role_array = response.data.roles.filter(
            //   (role) => role.rolename == "StoreAdmin"
            // );
            this.promotions[0].stor_type = this.role_array[0].rolename;
            this.promotions[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.promotions[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            this.$route.query.slug
          ) {
            this.assignType(this.promotions[0].stor_type);
          }
          // if (!this.$route.query.slug) {

          // }
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
    updateType(stor_type) {
      this.promotions[1].store_id = null;
      this.promotions[0].store_id = null;
      this.assignType(stor_type);
    },
    updatePOPhone(value, index) {
      this.promotions[index].phone = value;
    },
    assignType(stor_type) {
      this.store_loader = true;
      setTimeout(() => {
        this.store_loader = false;

        if (this.tabs == 1) {
          this.promotions[1].stor_type = stor_type;
          if (stor_type == "MallAdmin" && this.user.rolename == "MallAdmin") {
            // alert(stor_type);
            if (!this.$route.query.slug) {
              this.promotions[1].store_id = this.mall_id;
              this.promotions[0].store_id = this.mall_id;
            }
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else if (stor_type == "MallAdmin") {
            // this.promotions[1].store_id = this.mall_id;
            // this.promotions[0].store_id = this.mall_id;
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else {
            // alert("sadasd");
            this.labelText = this.$t("store");
            this.label_text_ar = this.$t("store_ar");
            this.stores_en = this.stores_data_en;
            this.stores_ar = this.stores_data_ar;
            // console.log("asdasd", this.stores_data_en);
          }
        } else {
          this.promotions[0].stor_type = stor_type;
          if (stor_type == "MallAdmin" && this.user.rolename == "MallAdmin") {
            console.log("asdasd", this.stores_en);
            if (!this.$route.query.slug) {
              this.promotions[1].store_id = this.mall_id;
              this.promotions[0].store_id = this.mall_id;
            }
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else if (stor_type == "MallAdmin") {
            // this.promotions[1].store_id = this.mall_id;
            // this.promotions[0].store_id = this.mall_id;
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else {
            this.labelText = this.$t("store");
            this.label_text_ar = this.$t("store_ar");
            this.stores_en = this.stores_data_en;
            this.stores_ar = this.stores_data_ar;
          }
        }
      }, 1500);
    },
    updateMall(promo) {
      if (this.tabs == 1) {
        this.promotions[1].store_id = promo;
      } else {
        this.promotions[0].store_id = promo;
      }
    },
    updateMobileCode(mobile_code) {
      if (this.tabs == 1) {
        this.promotions[1].mobile_code = mobile_code;
      } else {
        this.promotions[0].mobile_code = mobile_code;
      }
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    get_stores() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
          console.log(response);
          this.stores_data_en = response.data.stores_en;
          this.stores_data_ar = response.data.stores_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
          params: {
            lookup_type: "PROMOTION_TYPE",
          },
        })
        .then((response) => {
          this.p_type_en = response.data.lookup_en;
          this.p_type_ar = response.data.lookup_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      //---fetch_lang_lookup-----
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
          params: {
            lookup_type: "FLOORS",
          },
        })
        .then((response) => {
          this.floors_en = response.data.lookup_en;
          this.floors_ar = response.data.lookup_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    uploaded_image(img_src) {
      //alert('uploaded image');
      //alert(img_src);
      if (this.tabs == 1) {
        this.promotions[0].image_path = img_src;
      } else {
        this.promotions[1].image_path = img_src;
      }
    },
    uploadFile() {
      if (this.tabs == 1) {
        if (this.uploadfile == false) {
          this.uploadfile = true;
        } else {
          this.uploadfile = false;
        }
      } else {
        if (this.uploadfilear == false) {
          this.uploadfilear = true;
        } else {
          this.uploadfilear = false;
        }
      }
    },
    formatted_start_date(formatted_date) {
      this.promotions[0].start_date = formatted_date;
      this.promotions[1].start_date = formatted_date;
      if (this.promotions[0].end_date < formatted_date) {
        this.promotions[0].end_date = "";
      }
    },
    formatted_start_date_ar(formatted_date) {
      this.promotions[1].start_date = formatted_date;
      this.promotions[0].start_date = formatted_date;
      if (this.promotions[1].end_date < formatted_date) {
        this.promotions[1].end_date = "";
      }
    },
    formatted_end_date(formatted_date) {
      this.promotions[0].end_date = formatted_date;
      this.promotions[1].end_date = formatted_date;
    },
    formatted_end_date_ar(formatted_date) {
      this.promotions[1].end_date = formatted_date;
      this.promotions[0].end_date = formatted_date;
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];
      //Do whatever you need with the file, liek reading it with FileReader
    },
    presubmitvalidation() {
      if (this.tabs == 1) {
        if (
          this.$refs.form.validate() &&
          this.valid == true &&
          this.validAR == true
        ) {
          this.error_valid = false;
          this.submit();
        } else {
          if (this.valid == true) {
            this.error_valid = true;
            this.tabs = 2;
          }
        }
      } else {
        if (
          this.$refs.form.validate() &&
          this.validAR == true &&
          this.valid == true
        ) {
          this.error_valid = false;
          this.submit();
        } else {
          if (this.validAR == true) {
            this.tabs = 1;
            this.error_valid = true;
          }
        }
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        if (this.user.rolename == "StoreAdmin") {
          this.promotions[0].store_id = this.user.store_id;
          this.promotions[1].store_id = this.user.store_id;
          this.promotions[0].stor_type = this.user.rolename;
          this.promotions[1].stor_type = this.user.rolename;
        }
        // Form is valid, process
        this.$axios
          .post(
            process.env.VUE_APP_API_URL_ADMIN + "save_promotions",
            this.promotions
          )
          .then((res) => {
            this.btnloading = false;
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "promotions_offers",
                query: { s_tab: this.tabs },
              });
            } else if (res.data.status == "E") {
              this.$toast.error(this.array_data);
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
        this.loader = false;
      } else {
        //alert("Form is Invalid");
      }
    },
    get_countries() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_countries")
        .then((response) => {
          console.log(response);
          this.country_array_en = response.data.countries_en;
          this.country_array_ar = response.data.countries_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}

.upload_doc {
  margin-top: -14px;
}

.upload_image {
  margin-bottom: 3px;
}

.download_btn_color {
  color: blue;
}

.image-width {
  border: 2px solid black;
  padding: 1px;
}
.dimension_text {
  text-align-last: start;
}
.rtl :deep() input {
  text-align: right;
  direction: rtl;
}

.image_cursor {
  cursor: pointer;
}

.arabdirection /deep/ .v-field {
  direction: rtl;
}

.arabdirection /deep/ .v-input {
  direction: rtl !important;
}
.delete_icon_ar {
  position: relative;
  right: 79px;
  bottom: 90px;
}
.delete_icon {
  position: relative;
  left: 82px;
  bottom: 90px;
}
.download_icon {
  position: relative;
  left: 116px;
  bottom: 52px;
}
.download_icon_ar {
  position: relative;
  bottom: 45px;
  right: 110px;
}
/* .arabdirection /deep/ .v-input {
  direction: rtl !important;
} */
</style>
