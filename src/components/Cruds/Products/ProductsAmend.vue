<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_products_services')"
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
        class="my-3"
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
            <v-layout v-if="user.rolename != 'StoreAdmin'">
              <v-row class="px-6 mt-2">
                <v-col xs="12" md="12" lg="12">
                  <!-- :disabled="$route.query.slug" -->
                  <v-radio-group
                    v-model="products[0].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(products[0].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :disabled="$route.query.slug"
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
                md="3"
                v-if="user.rolename != 'StoreAdmin'"
              >
                <v-tooltip :text="labelText" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[0].store_id"
                      :label="labelText"
                      variant="outlined"
                      density="compact"
                      :items="stores_en"
                      :disabled="
                        user.rolename == 'MallAdmin' &&
                        products[0].stor_type == 'MallAdmin'
                      "
                      :rules="fieldRules"
                      item-title="name"
                      @update:modelValue="(value) => updateStore(value)"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="this.$t('type_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[0].type"
                      :label="this.$t('type_en')"
                      variant="outlined"
                      density="compact"
                      :disabled="$route.query.slug"
                      :items="types_en"
                      :rules="fieldRules"
                      item-title="shortname"
                      @update:modelValue="(value) => updateTypes(value)"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="this.$t('title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[0].title"
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
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="this.$t('meta_title_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[0].meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title_en')"
                      class="required_field"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3" v-if="service_type == 'Services'">
                <v-tooltip :text="this.$t('start_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('start_date_en')"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="products[0].start_date"
                      @formatted_date="formatted_start_date"
                      dense
                      :rules="fieldRules"
                      :class_required="'RequiredField'"
                      v-on="on"
                    />
                  </template>
                  <span>{{ $t("start_date_en") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3" v-if="service_type == 'Services'">
                <v-tooltip :text="this.$t('end_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('end_date_en')"
                      :min="products[0].start_date"
                      :stored_date="products[0].end_date"
                      @formatted_date="formatted_end_date"
                      dense
                      :rules="fieldRules"
                      :class_required="'RequiredField'"
                      v-on="on"
                    />
                  </template>
                  <span>{{ $t("end_date_en") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="$t('sequence_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[0].seq"
                      :rules="seqRules"
                      @update:modelValue="(value) => updateSeq(value, 1)"
                      maxlength="5"
                      v-bind:label="$t('sequence_en')"
                      required
                      variant="outlined"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="$t('icon_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[0].icon"
                      maxlength="100"
                      counter
                      v-bind:label="$t('icon_en')"
                      placeholder="Home"
                      required
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
                <a
                  class="get_icons"
                  target="_blank"
                  href="https://mui.com/material-ui/material-icons/"
                  >{{ $t("get_icons_en") }}</a
                >
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip :text="this.$t('description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[0].description"
                      :rules="fieldRules"
                      maxlength="2000"
                      counter="true"
                      v-bind="props"
                      class="required_field"
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
                      v-model="products[0].meta_description"
                      class="required_field"
                      :rules="fieldRules"
                      maxlength="160"
                      counter="true"
                      v-bind="props"
                      v-bind:label="$t('meta_description_en')"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("meta_description_en") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="6" sm="6" md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                </div>
                <br />
                <Imageupload
                  :folder="'products'"
                  :resizewidth="200"
                  :resizeheight="200"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfile"
                />
                <div class="dimension_text">200 : 200</div>
              </v-col>
            </v-row>
            <div class="mx-auto d-flex" max-width="344">
              <div
                class="mr-10 m-2"
                v-for="(img_en, img_index) in products[0].image_path"
                :key="img_index"
              >
                <div class="image-container">
                  <img
                    v-bind:style="
                      isHovering == true ? 'filter: blur(1px);' : ''
                    "
                    :src="envImagePath + img_en"
                    width="100"
                    height="85"
                    alt
                  />
                </div>
                <v-tooltip :text="this.$t('download_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <a class="text-center pointer download_icon">
                      <span
                        ><v-icon
                          v-bind="props"
                          class="mr-2"
                          @click="downloadImage(img_en)"
                          >mdi mdi-download</v-icon
                        ></span
                      >
                    </a>
                  </template>
                </v-tooltip>
                <v-tooltip :text="this.$t('delete_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <span>
                      <v-icon
                        small
                        v-bind="props"
                        class="mr-2 edit_btn icon_size delete_icon"
                        @click="removeImage(img_index)"
                        >mdi mdi-trash-can-outline</v-icon
                      >
                    </span>
                  </template>
                </v-tooltip>
              </div>
            </div>
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
                    v-model="products[1].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(products[1].stor_type)"
                  >
                    <v-radio
                      v-for="(role_data, rindex) in role_array"
                      :key="rindex"
                      :disabled="$route.query.slug"
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
                md="3"
                v-if="user.rolename != 'StoreAdmin'"
              >
                <v-tooltip :text="label_text_ar" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[1].store_id"
                      :label="label_text_ar"
                      variant="outlined"
                      density="compact"
                       :disabled="
                        user.rolename == 'MallAdmin' &&
                        products[0].stor_type == 'MallAdmin'
                      "
                      :rules="fieldRulesAR"
                      :items="stores_ar"
                      @update:modelValue="(value) => updateStore(value)"
                      item-title="name"
                      class="required_field rtl"
                      item-value="header_id"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="this.$t('type_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="products[1].type"
                      :disabled="$route.query.slug"
                      :label="this.$t('type_ar')"
                      variant="outlined"
                      density="compact"
                      :items="types_ar"
                      :rules="fieldRules"
                      item-title="shortname"
                      @update:modelValue="(value) => updateTypes(value)"
                      item-value="header_id"
                      class="required_field"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
          
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="this.$t('title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[1].title"
                      :rules="fieldRulesAR"
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
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="products[1].meta_title"
                      :rules="fieldRulesAR"
                      v-bind:label="$t('meta_title_ar')"
                      v-bind="props"
                      required
                      class="required_field rtl"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3" v-if="service_type == 'Services'">
                <v-tooltip :text="this.$t('start_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('start_date_ar')"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="products[1].start_date"
                      @formatted_date="formatted_start_date_ar"
                      dense
                      :translation="'arabic'"
                      :class_required="'RequiredField rtl'"
                      :rules="fieldRulesAR"
                      v-on="on"
                    />
                  </template>
                  <span>{{ $t("start_date_ar") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3" v-if="service_type == 'Services'">
                <v-tooltip :text="this.$t('end_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('end_date_ar')"
                      :rules="fieldRulesAR"
                      :translation="'arabic'"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="products[1].end_date"
                      @formatted_date="formatted_end_date_ar"
                      dense
                      :class_required="'RequiredField rtl'"
                      required
                      v-on="on"
                    />
                  </template>
                  <span>{{ $t("end_date_ar") }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="$t('sequence_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[1].seq"
                      maxlength="5"
                      :rules="seqRulesAR"
                      v-bind:label="$t('sequence_ar')"
                      @update:modelValue="(value) => updateSeq(value, 0)"
                      required
                      variant="outlined"
                      class="rtl"
                      density="compact"
                      v-on:keypress="NumbersOnly"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="3">
                <v-tooltip :text="$t('icon_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="products[1].icon"
                      maxlength="100"
                      counter
                      v-bind:label="$t('icon_ar')"
                      placeholder="Home"
                      required
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
                <a
                  class="get_icons"
                  target="_blank"
                  href="https://mui.com/material-ui/material-icons/"
                  >{{ $t("get_icons_ar") }}</a
                >
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="products[1].description"
                      :rules="fieldRulesAR"
                      maxlength="2000"
                      counter="true"
                      v-bind="props"
                      v-bind:label="$t('description_ar')"
                      required
                      class="required_field rtl"
                      variant="outlined"
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
                      v-model="products[1].meta_description"
                      :rules="fieldRulesAR"
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
              <v-col cols="6" sm="12" md="6">
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                </div>
                <br />
                <Imageupload
                  :folder="'products'"
                  :resizewidth="200"
                  :resizeheight="200"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfilear"
                />
                <div class="dimension_text">200 : 200</div>
              </v-col>
            </v-row>
            <div class="mx-auto d-flex" max-width="344">
              <div
                class="mr-10 m-2"
                v-for="(img_ar, ar_img_index) in products[1].image_path"
                :key="ar_img_index"
              >
                <div class="image-container">
                  <img
                    v-bind:style="
                      isHovering == true ? 'filter: blur(1px);' : ''
                    "
                    :src="envImagePath + img_ar"
                    width="100"
                    height="85"
                    alt
                  />
                </div>
                <v-tooltip :text="this.$t('download_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <a class="text-center pointer download_icon_ar">
                      <span
                        ><v-icon
                          v-bind="props"
                          class="mr-2"
                          @click="downloadImage(img_ar)"
                          >mdi mdi-download</v-icon
                        ></span
                      >
                    </a>
                  </template>
                </v-tooltip>
                <v-tooltip :text="this.$t('delete_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <span>
                      <v-icon
                        small
                        v-bind="props"
                        class="mr-2 edit_btn icon_size delete_icon_ar"
                        @click="removeImage(ar_img_index)"
                        >mdi mdi-trash-can-outline</v-icon
                      >
                    </span>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </v-form>
        </v-window-item>
        <!-- SERVICE SLOT TAB STARTS -->
        <div v-if="service_type == 'Services'">
          <v-form ref="form" v-model="slotvalid">
            <v-layout v-bind:class="tabs == 2 ? 'arabclass' : ''">
              <v-row class="headings">
                <v-col xs="12" md="12" lg="12">
                  <h5 class="m-4" v-if="tabs == 1">
                    <b>{{ $t("services_slots_en") }}</b>
                  </h5>
                  <h5 class="m-4 arabdirection" v-else>
                    <b>{{ $t("services_slots_ar") }}</b>
                  </h5>
                </v-col>
              </v-row>
            </v-layout>
            <div class="mx-5" v-bind:class="tabs == 2 ? 'arabclass' : ''">
              <v-tooltip
                :text="tabs == 1 ? $t('add_weekday_en') : $t('add_weekday_ar')"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="small"
                    elevation="0"
                    color="blue"
                    rounded
                    v-bind="props"
                    @click="addWeekday()"
                  >
                    <span v-if="tabs == 1">
                      {{ $t("add_weekday_en") }}
                    </span>
                    <span v-else> {{ $t("add_weekday_ar") }}</span>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
            <div
              v-for="(service, sindex) in service_slots"
              :key="sindex"
              class="service-container"
            >
              <v-layout>
                <v-row
                  class="px-6 mt-2 ml-8"
                  v-bind:class="tabs == 2 ? 'arabclass mr-8' : ''"
                >
                  <v-col
                    cols="12"
                    sm="12"
                    md="3"
                    v-if="service_type == 'Services'"
                  >
                    <v-tooltip
                      :text="tabs == 1 ? $t('date_en') : $t('date_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <DatePicker
                          v-bind="props"
                          :label="tabs == 1 ? $t('date_en') : $t('date_ar')"
                          :min="
                            min_slot_date[sindex]
                              ? min_slot_date[sindex]
                              : products[0].start_date
                          "
                          :max="products[0].end_date"
                          :stored_date="service.slot_date"
                          :slot_index="sindex"
                          @formatted_service_start_date="
                            formatted_service_start_date
                          "
                          dense
                          :rules="fieldRules"
                          :class_required="'RequiredField'"
                          v-on="on"
                        />
                      </template>
                      <span v-if="tabs == 1">
                        {{ $t("date_en") }}
                      </span>
                      <span v-else> {{ $t("date_ar") }}</span>
                    </v-tooltip>
                  </v-col>
                  <!-- @change="getDay(sindex)" -->
                  <v-col cols="12" sm="12" md="2">
                    <v-tooltip
                      :text="tabs == 1 ? $t('week_day_en') : $t('week_day_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-bind:class="tabs == 2 ? 'arabclass' : ''"
                          v-model="service.weekday"
                          v-bind:label="
                            tabs == 1 ? $t('week_day_en') : $t('week_day_ar')
                          "
                          disabled
                          variant="outlined"
                          density="compact"
                          :items="tabs == 1 ? weekdays_en : weekdays_ar"
                          item-title="shortname"
                          item-value="header_id"
                          class="required_field"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                    <!-- :rules="getWeekdayRules(sindex)" -->
                  </v-col>
                  <div
                    v-if="sindex === service_slots.length - 1"
                    v-bind:class="
                      tabs == 2 ? 'copy_weekday_ar' : 'copy_weekday_en'
                    "
                  >
                    <v-tooltip
                      :text="
                        tabs == 1
                          ? $t('copy_to_next_date_en')
                          : $t('copy_to_next_date_ar')
                      "
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          class="btn-theme-blue"
                          small
                          :disabled="!canCopyServiceSlot"
                          @click="copyNextDate(service, sindex)"
                        >
                          <span v-if="tabs == 1">
                            {{ $t("copy_to_next_date_en") }}
                          </span>
                          <span v-else> {{ $t("copy_to_next_date_ar") }}</span>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                  <div
                    v-bind:class="
                      tabs == 2 ? 'delete_weekday_ar' : 'delete_weekday_en'
                    "
                    v-if="sindex != 0"
                  >
                    <v-tooltip
                      :text="
                        tabs == 1
                          ? $t('delete_slots_en')
                          : $t('delete_slots_ar')
                      "
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          color="error"
                          variant="icon"
                          icon="mdi-delete"
                          @click="deleteWeekday(sindex)"
                        >
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </v-row>
              </v-layout>
              <div v-for="(slot, cindex) in service.slot" :key="cindex">
                <div
                  class="error-message"
                  v-if="slotErrors[sindex] && slotErrors[sindex][cindex]"
                >
                  {{ slotErrors[sindex][cindex] }}
                </div>

                <v-layout v-bind:class="tabs == 2 ? 'arabclass mr-4' : 'ml-4'">
                  <div class="mt-7" style="width: 30px">
                    <v-tooltip
                      :text="
                        tabs == 1 ? $t('add_slots_en') : $t('add_slots_ar')
                      "
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon
                          v-if="cindex == 0"
                          v-bind="props"
                          @click="addSlots(sindex)"
                          color="error"
                          icon="mdi-plus"
                          size="x-large"
                        ></v-icon>
                      </template>
                    </v-tooltip>
                  </div>
                  <v-row class="px-6 mt-2">
                    <v-col cols="12" sm="12" md="2">
                      <v-tooltip
                        :text="
                          tabs == 1 ? $t('from_time_en') : $t('from_time_ar')
                        "
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-autocomplete
                            v-bind="props"
                            v-bind:class="tabs == 2 ? 'arabclass' : ''"
                            v-model="slot.from_time"
                            v-bind:label="
                              tabs == 1
                                ? $t('from_time_en')
                                : $t('from_time_ar')
                            "
                            variant="outlined"
                            density="compact"
                            @update:model-value="
                              checkValidation(sindex, cindex)
                            "
                            :items="service_time"
                            :rules="fieldRules"
                            item-title="shortname"
                            item-value="shortname"
                            class="rtl-dir required_field"
                          ></v-autocomplete>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-tooltip
                        :text="
                          tabs == 1
                            ? $t('from_meridiem_en')
                            : $t('from_meridiem_ar')
                        "
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-autocomplete
                            v-bind="props"
                            v-bind:class="tabs == 2 ? 'arabclass' : ''"
                            v-model="slot.from_meridiem"
                            @update:model-value="
                              checkValidation(sindex, cindex)
                            "
                            v-bind:label="
                              tabs == 1
                                ? $t('from_meridiem_en')
                                : $t('from_meridiem_ar')
                            "
                            variant="outlined"
                            density="compact"
                            class="rtl-dir required_field"
                            :items="meridiem"
                            :rules="fieldRules"
                            item-title="shortname"
                            item-value="shortname"
                          ></v-autocomplete>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-tooltip
                        :text="tabs == 1 ? $t('to_time_en') : $t('to_time_ar')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-autocomplete
                            v-bind="props"
                            v-model="slot.to_time"
                            class="rtl-dir required_field"
                            v-bind:class="tabs == 2 ? 'arabclass' : ''"
                            v-bind:label="
                              tabs == 1 ? $t('to_time_en') : $t('to_time_ar')
                            "
                            variant="outlined"
                            density="compact"
                            :items="service_time"
                            :rules="fieldRules"
                            @update:model-value="
                              checkValidation(sindex, cindex)
                            "
                            item-title="shortname"
                            item-value="shortname"
                          ></v-autocomplete>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-tooltip
                        :text="
                          tabs == 1
                            ? $t('to_meridiem_en')
                            : $t('to_meridiem_ar')
                        "
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-autocomplete
                            v-bind="props"
                            class="rtl-dir required_field"
                            v-bind:class="tabs == 2 ? 'arabclass' : ''"
                            v-model="slot.to_meridiem"
                            v-bind:label="
                              tabs == 1
                                ? $t('to_meridiem_en')
                                : $t('to_meridiem_ar')
                            "
                            variant="outlined"
                            @update:model-value="
                              checkValidation(sindex, cindex)
                            "
                            density="compact"
                            :items="meridiem"
                            :rules="fieldRules"
                            item-title="shortname"
                            item-value="shortname"
                          ></v-autocomplete>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" sm="12" md="1">
                      <v-tooltip
                        :text="tabs == 1 ? $t('slots_en') : $t('slots_ar')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="slot.slots"
                            maxlength="5"
                            v-bind:label="
                              tabs == 1 ? $t('slots_en') : $t('slots_ar')
                            "
                            required
                            variant="outlined"
                            class="rtl"
                            density="compact"
                            v-on:keypress="NumbersOnly"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="12" sm="12" md="2">
                      <v-tooltip
                        :text="
                          tabs == 1
                            ? $t('max_reservation_en')
                            : $t('max_reservation_ar')
                        "
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            v-model="slot.max_reservation"
                            maxlength="5"
                            v-bind:label="
                              tabs == 1
                                ? $t('max_reservation_en')
                                : $t('max_reservation_ar')
                            "
                            required
                            variant="outlined"
                            density="compact"
                            v-on:keypress="NumbersOnly"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                      md="1"
                      class="mt-2"
                      v-if="cindex != 0"
                    >
                      <v-tooltip
                        :text="
                          tabs == 1
                            ? $t('delete_slots_en')
                            : $t('delete_slots_ar')
                        "
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            color="error"
                            variant="icon"
                            icon="mdi-delete"
                            @click="deleteSlots(cindex, sindex)"
                          >
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-layout>
              </div>
            </div>
          </v-form>
        </div>
        <!-- SERVICE SLOT TAB END -->
      </v-window>
    </div>
    <div class="d-block mr-4 mt-3 pb-3 text-right">
      <v-tooltip :text="this.$t('cancel')" location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-inline-block mr-2">
            <v-btn
              v-bind="props"
              size="small"
              @click="cancel"
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
import moment from "moment";
export default {
  components: { Imageupload, DatePicker },
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
    slotvalid: false,
    error_valid: false,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    sel_lang: "",
    isDisabled: false,
    checkbox_value: false,
    uploadfile: false,
    uploadfilear: false,
    mal_data_en: [],
    mal_data_er: [],
    role_array: [],
    stores_data_ar: [],
    stores_data_en: [],
    min_slot_date: [],
    user: "",
    label_text_ar: "مجمع تجاري",
    labelText: "Mall",
    service_slots: [
      {
        weekday: null,
        slot_date: "",
        slot: [
          {
            id: 0,
            from_time: "",
            from_meridiem: "AM",
            to_time: "",
            to_meridiem: "AM",
            max_reservation: 1,
            slots: null,
          },
        ],
      },
    ],
    slotErrors: {},
    products: [
      {
        id: 0,
        title: "",
        store_id: null,
        description: "",
        start_date: "",
        end_date: "",
        image_path: [],
        meta_title: "",
        meta_description: "",
        lang: "en",
        seq: null,
        icon: "",
        stor_type: "",
      },
      {
        id: 0,
        title: "",
        store_id: null,
        description: "",
        start_date: "",
        end_date: "",
        image_path: [],
        meta_title: "",
        meta_description: "",
        lang: "ar",
        seq: null,
        icon: "",
        stor_type: "",
      },
    ],
    images_en: [],
    images_ar: [],
    stores_en: [],
    stores_ar: [],
    types_en: [],
    types_ar: [],
    noimagepreview: "",
    service_type: "",
    items: [],
    weekdays_en: [],
    weekdays_ar: [],
    service_time: [],
    meridiem: [
      {
        id: 0,
        shortname: "AM",
      },
      {
        id: 0,
        shortname: "PM",
      },
    ],
    show_er_msg: null,
    temp_slot: [],
  }),

  computed: {
    seqRules() {
      return [(v) => (v >= 0 && v <= 9999999) || this.$t("number_required")];
    },
    seqRulesAR() {
      return [(v) => (v >= 0 && v <= 9999999) || this.$t("number_required_ar")];
    },
    canCopyServiceSlot() {
      return this.service_slots.every((service) => {
        if (!service.slot_date) return false;

        return service.slot.every((slot) => {
          return (
            // slot.id !== null &&
            slot.from_time &&
            slot.from_meridiem &&
            slot.to_time &&
            slot.to_meridiem &&
            slot.max_reservation !== null &&
            slot.slots !== null
          );
        });
      });
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAR() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },
  },
  mounted() {
    this.get_stores();
    this.fetchMall();
  },
  created() {
    this.fetchRoles();
    this.get_weekdays();
    this.fetchLookup();
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchLookup();
          this.valid = true;
          this.validAR = true;
          this.slotvalid = true;
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit_products/" +
                this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.products = res.data.products;
              this.service_slots = res.data.service_slots;
              this.assignType(this.products[0].stor_type);
              this.get_weekdays();
              this.updateTypes(this.products[0].type);
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
  },

  methods: {
    checkValidation(week_index, slot_index) {
      let isValid = true;
      const currentSlot = this.service_slots[week_index].slot[slot_index];
      console.log("current_slot", currentSlot);
      const formatTime = (time, meridiem) =>
        moment(time + " " + meridiem, "hh:mm A");

      const currentFromTime = formatTime(
        currentSlot.from_time,
        currentSlot.from_meridiem
      );
      const currentToTime = formatTime(
        currentSlot.to_time,
        currentSlot.to_meridiem
      );

      let errorMessage = "";
      // Ensure "to time" is after "from time"
      if (
        !currentToTime.isSameOrAfter(currentFromTime) &&
        currentSlot.to_time
      ) {
        isValid = false;
        errorMessage = "The 'to time' must be later than the 'from time'.";
      }

      this.service_slots[week_index].slot.forEach((slot_data, index) => {
        if (isValid && slot_index !== index) {
          const comparingFromTime = formatTime(
            slot_data.from_time,
            slot_data.from_meridiem
          );
          const comparingToTime = formatTime(
            slot_data.to_time,
            slot_data.to_meridiem
          );

          if (
            currentSlot.from_time === slot_data.from_time &&
            currentSlot.to_time === slot_data.to_time &&
            currentSlot.from_meridiem === slot_data.from_meridiem &&
            currentSlot.to_meridiem === slot_data.to_meridiem
          ) {
            isValid = false;
            errorMessage = "This slot timing is duplicated.";
          }

          // Check for overlapping times
          if (
            currentFromTime.isBefore(comparingToTime) &&
            currentToTime.isAfter(comparingFromTime)
          ) {
            isValid = false;
            errorMessage = "This slot timing overlaps with another slot.";
          }
        }
      });

      if (!isValid) {
        if (!this.slotErrors[week_index]) {
          this.slotErrors[week_index] = {};
        }
        this.slotErrors[week_index][slot_index] = errorMessage;
      } else {
        if (
          this.slotErrors[week_index] &&
          this.slotErrors[week_index][slot_index]
        ) {
          this.slotErrors[week_index][slot_index] = "";
        }
      }

      return isValid;
    },

    copyNextDate(service_data, index) {
      const newServiceData = JSON.parse(JSON.stringify(service_data));

      const nextDay = moment(
        this.service_slots[index].slot_date,
        "YYYY-MM-DD"
      ).add(1, "days");
      var formatted_day = moment(nextDay).format("dddd");
      newServiceData.slot_date = nextDay;
      if (this.$route.query.slug) {
        newServiceData.slot.forEach((slot) => {
          slot.id = 0;
        });
      }
      if (this.tabs == 1) {
        this.weekdays_en.filter((day) => {
          if (day.shortname == formatted_day) {
            return (newServiceData.weekday = day.header_id);
          }
        });
      } else {
        this.weekdays_ar.filter((day) => {
          if (day.shortname == formatted_day) {
            return (newServiceData.weekday = day.header_id);
          }
        });
      }
      console.log("all service date", newServiceData);
      this.service_slots.push(newServiceData);
      // var slot_date = moment(service_data.start_date, "YYYY-MM-DD");
      // var formatted_day = nextDay.format("dddd");

      // this.min_slot_date[index + 1] = nextDay;
    },
    getWeekdayRules(sindex) {
      return [
        (value) => !!value || this.$t("weekday_required"),
        (value) => this.isUniqueWeekday(value, sindex),
      ];
    },
    isUniqueWeekday(value, index) {
      const duplicate = this.service_slots.some(
        (service, idx) => service.weekday === value && idx !== index
      );
      return !duplicate || this.$t("weekday_unique");
    },
    addWeekday() {
      this.service_slots.push({
        weekday: null,
        slot: [
          {
            id: 0,
            from_time: "",
            from_meridiem: "AM",
            max_reservation: 1,
            to_time: "",
            to_meridiem: "AM",
            slots: null,
          },
        ],
      });
    },
    deleteSlots(cindex, sindex) {
      this.service_slots[sindex].slot.splice(cindex, 1);
    },
    deleteWeekday(sindex) {
      this.service_slots.splice(sindex, 1);
    },
    updateSeq(value, index) {
      this.products[index].seq = value;
    },
    get_weekdays() {
      this.initval = true;
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-weekdays")
        .then((response) => {
          this.service_time = response.data.store_time_en;
          this.weekdays_en = response.data.weekdays_en;
          this.weekdays_ar = response.data.weekdays_ar;
          this.initval = false;
          if (this.page_type == "add") {
            this.initializeTimingArray();
          }
          this.loader = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeImage(index) {
      if (this.tabs == 1) {
        this.products[0].image_path.splice(index, 1);
      } else {
        this.products[1].image_path.splice(index, 1);
      }
    },
    addSlots(index) {
      this.service_slots[index].slot.push({
        id: 0,
        from_time: "",
        from_meridiem: "AM",
        max_reservation: 1,
        to_time: "",
        to_meridiem: "AM",
        slots: null,
      });
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
    updateStore(store) {
      if (this.tabs == 1) {
        this.products[1].store_id = store;
      } else {
        this.products[0].store_id = store;
      }
    },
    updateTypes(type) {
      if (this.tabs == 1) {
        this.products[1].type = type;
      } else {
        this.products[0].type = type;
      }
      this.types_en.map((data) => {
        if (data.id == type) {
          this.service_type = data.shortname;
        }
      });
      if (this.service_type == "Products") {
        this.slotvalid = true;
      } else {
        this.slotvalid = false;
      }
    },
    updateType(stor_type) {
      this.products[1].store_id = null;
      this.products[0].store_id = null;
      this.assignType(stor_type);
    },
    assignType(stor_type) {
      setTimeout(() => {
        if (this.tabs == 1) {
          this.products[1].stor_type = stor_type;
          if (stor_type == "MallAdmin" && this.user.rolename == "MallAdmin") {
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");

            if (!this.$route.query.slug) {
              this.products[1].store_id = this.mall_id;
              this.products[0].store_id = this.mall_id;
            }
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else if (stor_type == "MallAdmin") {
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
          }
        } else {
          this.products[0].stor_type = stor_type;
          if (stor_type == "MallAdmin" && this.user.rolename == "MallAdmin") {
            if (!this.$route.query.slug) {
              this.products[1].store_id = this.mall_id;
              this.products[0].store_id = this.mall_id;
            }
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else if (stor_type == "MallAdmin") {
            // this.products[1].store_id = this.mall_id;
            // this.products[0].store_id = this.mall_id;
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
      }, 1000);
    },
    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_reg_roles")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;
          if (!this.$route.query.slug && this.user.rolename == "SuperUser") {
            this.products[0].stor_type = this.role_array[0].rolename;
            this.products[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.products[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            !this.$route.query.slug
          ) {
            // this.role_array = response.data.roles.filter(
            //   (role) => role.rolename == "StoreAdmin"
            // );
            this.products[0].stor_type = this.role_array[0].rolename;
            this.products[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.products[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            this.$route.query.slug
          ) {
            this.role_array = response.data.roles.filter(
              (role) => role.rolename == "StoreAdmin"
            );
            this.assignType(this.products[0].stor_type);
          }
          // if (!this.$route.query.slug) {

          // }
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
    fetchLookup() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_lang_lookup", {
          params: {
            lookup_type: "PRODUCTS_SERVICES_TYPE",
          },
        })
        .then((response) => {
          this.types_en = response.data.lookup_en;
          this.types_ar = response.data.lookup_ar;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
     fetchMall() {
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-malls")
        .then((response) => {
          console.log(response);
          this.mal_data_en = response.data.malls_en;
          this.mal_data_ar = response.data.malls_ar;
           if (this.user.rolename == "MallAdmin" && !this.$route.query.slug) {
            this.mal_data_en.filter((ele) => {
              if (ele.header_id === this.user.store_id) {
                this.products[0].store_id = ele.header_id;
                this.products[1].store_id = ele.header_id;
                this.mall_id = ele.header_id;
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
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
    cancel() {
      this.$router.push({
        name: "products",
        query: { s_tab: this.tabs },
      });
    },
    get_stores() {
      // this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-stores")
        .then((response) => {
          console.log(response);
          this.stores_data_en = response.data.stores_en;
          this.stores_data_ar = response.data.stores_ar;
          if (this.user.rolename == "MallAdmin") {
            //      this.role_array = response.data.roles.filter(
            //   (role) => role.rolename == "StoreAdmin"
            // );
            this.stores_data_en = this.stores_data_en.filter((x) => {
              console.log("x", x);
              return x.mall_name == this.user.store_id;
            });
            this.user.store_id;
            this.stores_data_ar = this.stores_data_ar.filter((x) => {
              return x.mall_name == this.user.store_id;
            });
          }
          // this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploaded_image(img_src) {
      if (this.tabs == 1) {
        this.products[0].image_path.push(img_src);
        // this.products[0].image_path = img_src;
      } else {
        this.products[1].image_path.push(img_src);
        // this.products[1].image_path = img_src;
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
      this.products[0].start_date = formatted_date;
      this.products[1].start_date = formatted_date;
      // this.min_slot_date = formatted_date;
      if (this.products[0].end_date < formatted_date) {
        this.products[0].end_date = "";
      }
      if (this.products[1].end_date < formatted_date) {
        this.products[1].end_date = "";
      }
    },
    formatted_service_start_date(index, formatted_date) {
      if (formatted_date) {
        var slot_formatted_date = moment(formatted_date, "YYYY-MM-DD");

        // console.log("sadasdasd",);
        this.service_slots[index].slot_date =
          slot_formatted_date.format("YYYY-MM-DD");
        this.service_slots[index].slot_date =
          slot_formatted_date.format("YYYY-MM-DD");

        var formatted_day = slot_formatted_date.format("dddd");
        var nextDay = moment(formatted_date)
          .add(1, "days")
          .format("YYYY-MM-DD");
        this.min_slot_date[index + 1] = nextDay;
        // this.$set(this.min_slot_date, index + 1, nextDay);

        // min_slot_dateindex+1
        if (this.tabs == 1) {
          this.weekdays_en.filter((day) => {
            if (day.shortname == formatted_day) {
              return (this.service_slots[index].weekday = day.header_id);
            }
          });
        } else {
          this.weekdays_ar.filter((day) => {
            if (day.shortname == formatted_day) {
              return (this.service_slots[index].weekday = day.header_id);
            }
          });
        }
      }
    },
    formatted_start_date_ar(formatted_date) {
      this.products[1].start_date = formatted_date;
      this.products[0].start_date = formatted_date;
      if (this.products[0].end_date < formatted_date) {
        this.products[0].end_date = "";
      }
      if (this.products[1].end_date < formatted_date) {
        this.products[1].end_date = "";
      }
    },
    formatted_end_date(formatted_date) {
      this.products[0].end_date = formatted_date;
      this.products[1].end_date = formatted_date;
    },
    formatted_end_date_ar(formatted_date) {
      this.products[1].end_date = formatted_date;
      this.products[0].end_date = formatted_date;
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    presubmitvalidation() {
      if (this.tabs == 1) {
        if (
          this.$refs.form.validate() &&
          this.valid == true &&
          this.validAR == true &&
          this.slotvalid == true
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
          this.slotvalid == true &&
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
      if (
        this.validAR == true &&
        this.slotvalid == true &&
        this.valid == true
      ) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        if (this.user.rolename == "StoreAdmin") {
          this.products[0].store_id = this.user.store_id;
          this.products[1].store_id = this.user.store_id;
          this.products[0].stor_type = this.user.rolename;
          this.products[1].stor_type = this.user.rolename;
        } // Form is valid, process
        this.loader = true;
        // Form is valid, process
        this.$axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "save_products", {
            products: this.products,
            service_slots: this.service_slots,
          })
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
                name: "products",
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
  cursor: pointer;
}

.image-width {
  border: 2px solid black;
  padding: 1px;
}

.arabdirection /deep/ .v-field {
  direction: rtl;
}

.arabdirection /deep/ .v-input {
  direction: rtl !important;
}
.arabdirection /deep/ .v-messages__message {
  text-align: right !important;
}
.delete_icon_ar {
  position: relative;
  right: 35px;
  bottom: 90px;
}
.delete_icon {
  position: relative;
  left: 80px;
  bottom: 90px;
}
.download_icon {
  position: relative;
  left: 112px;
  bottom: 52px;
}
.download_icon_ar {
  position: relative;
  bottom: 45px;
  right: 67px;
}
.d-flex {
  display: flex !important;
  align-items: center;
  /* justify-content: space-between !important; */
  flex-wrap: wrap;
  background: #fff;
}
.headings {
  color: #2196f3;
}
.service-container {
  margin: 10px 20px;
  background: #e7e7e78c;
  border-radius: 6px;
}
.get_icons {
  font-size: 12px;
  padding-left: 5px;
}
.wd-message {
  color: #b10525;
  top: -20px;
  position: relative;
  font-size: 14px;
}
.arabclass .v-field {
  direction: rtl !important;
}
.dimension_text {
  text-align-last: start;
}
.arabclass {
  direction: rtl !important;
}
.delete_weekday_ar {
  position: absolute;
  left: 20px;
  top: 16px;
}
.delete_weekday_en {
  position: absolute;
  right: 20px;
  top: 16px;
}
.copy_weekday_ar {
  position: absolute;
  left: 65px;
  top: 16px;
}
.copy_weekday_en {
  position: absolute;
  right: 65px;
  top: 16px;
}
.arabclassquill .ql-editor {
  text-align: justify;
}
.arabclass .v-messages__message {
  text-align: right !important;
}
.error-message {
  color: #b10525;
  margin-top: 4px;
  font-size: 0.9em;
}
</style>
