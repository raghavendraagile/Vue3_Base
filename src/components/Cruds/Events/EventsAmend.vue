<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_events')"
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
                    v-model="events[0].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(events[0].stor_type)"
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
                <v-tooltip :text="labelText" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="events[0].store_id"
                      :label="labelText"
                      @update:modelValue="(value) => updateStore(value)"
                      variant="outlined"
                      density="compact"
                      :disabled="
                        user.rolename == 'MallAdmin' &&
                        events[0].stor_type == 'MallAdmin'
                      "
                      :loading="store_loader"
                      :items="stores_en"
                      item-title="name"
                      item-value="header_id"
                      class="required_field"
                      :rules="fieldRules"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="events[0].title"
                      :rules="fieldRules"
                      v-bind:label="$t('title')"
                      v-bind="props"
                      required
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      class="required_field"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="4">
                <v-tooltip :text="this.$t('email_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="events[0].email"
                      @update:modelValue="(value) => updateEmail(value, 1)"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('start_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('start_date_en')"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="events[0].start_date"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('end_date_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('end_date_en')"
                      :min="events[0].start_date"
                      :stored_date="events[0].end_date"
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
              <v-col cols="12" xs="12" sm="12" md="2">
                <v-tooltip :text="$t('mobile_code_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind:label="$t('mobile_code_en')"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      item-key="header_id"
                      item-value="mobile_code"
                      item-title="mobile_code"
                      v-model="events[0].mobile_code"
                      @update:modelValue="(value) => updateMobileCode(value, 1)"
                      :items="country_array_en"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="2">
                <v-tooltip :text="$t('mobile_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      @update:modelValue="
                        (value) => updateEventsMobile(value, 1)
                      "
                      v-model="events[0].mobile"
                      v-on:keypress="NumbersOnly"
                      maxlength="12"
                      v-bind:label="$t('mobile_en')"
                      required
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('floor_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="events[0].floor"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="events[0].meta_title"
                      :rules="fieldRules"
                      v-bind:label="$t('meta_title')"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      class="required_field"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('sequence')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="events[0].seq"
                      v-on:keypress="NumbersOnly"
                      maxlength="5"
                      :rules="seqRules"
                      @update:modelValue="
                        (value) => updateEventsSequence(value, 1)
                      "
                      v-bind:label="$t('sequence')"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-card-title class="text-left" style="font-size: 17px">{{
                  $t("description_en")
                }}</v-card-title>
                <v-tooltip :text="this.$t('description_en')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <quill-editor
                        :options="editorOptions_en"
                        class="hide_quill_input"
                        v-bind:id="
                          quill_item == true
                            ? 'quill_item'
                            : 'quill_item_border'
                        "
                        v-model:value="events[0].description"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                        @change="onEditorChange($event)"
                      />
                      <small
                        v-if="quill_item"
                        class="text-danger ml-5 required_item shake"
                        >Field Required</small
                      >
                    </div>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-tooltip
                  :text="this.$t('meta_description')"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-model="events[0].meta_description"
                      :rules="fieldRules"
                      maxlength="2000"
                      counter="true"
                      v-bind="props"
                      v-bind:label="$t('meta_description')"
                      variant="outlined"
                      class="required_field"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("meta_description") }}</span>
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
                          v-if="
                            events[0].image_path == '' ||
                            events[0].image_path == null
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-else
                          :src="envImagePath + events[0].image_path"
                          width="100"
                          height="85
                          "
                          alt
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
                            v-if="events[0].image_path"
                            v-bind="props"
                            class="mr-2"
                            @click="downloadImage(events[0].image_path)"
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
                          v-if="events[0].image_path"
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
                  :folder="'events'"
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
                    v-model="events[1].stor_type"
                    inline
                    class="radio_item"
                    @change="updateType(events[1].stor_type)"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip
                  :text="label_text_ar"
                  location="bottom"
                  v-if="user.rolename != 'StoreAdmin'"
                >
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="events[1].store_id"
                      @update:modelValue="(value) => updateStore(value)"
                      :label="label_text_ar"
                      variant="outlined"
                      density="compact"
                      :disabled="
                        user.rolename == 'MallAdmin' &&
                        events[1].stor_type == 'MallAdmin'
                      "
                      :items="stores_ar"
                      item-title="name"
                      item-value="header_id"
                      :rules="fieldRulesAR"
                      class="required_field rtl"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('title')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="events[1].title"
                      :rules="fieldRulesAR"
                      v-bind:label="$t('title_ar')"
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
              <v-col cols="12" xs="12" sm="12" md="4">
                <v-tooltip :text="this.$t('email_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="events[1].email"
                      @update:modelValue="(value) => updateEmail(value, 0)"
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
                <v-tooltip :text="this.$t('start_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('start_date_ar')"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="events[1].start_date"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('end_date_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <DatePicker
                      v-bind="props"
                      :label="$t('end_date_ar')"
                      :rules="fieldRulesAR"
                      :translation="'arabic'"
                      :min="new Date().toISOString().substr(0, 10)"
                      :stored_date="events[1].end_date"
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
              <v-col cols="12" xs="12" sm="12" md="2">
                <v-tooltip :text="$t('mobile_code_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind:label="$t('mobile_code_ar')"
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      required
                      index="id"
                      item-key="header_id"
                      item-value="mobile_code"
                      item-title="mobile_code"
                      v-model="events[1].mobile_code"
                      @update:modelValue="(value) => updateMobileCode(value, 0)"
                      :items="country_array_en"
                    ></v-autocomplete>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="2">
                <v-tooltip :text="$t('mobile_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      @update:modelValue="
                        (value) => updateEventsMobile(value, 0)
                      "
                      v-model="events[1].mobile"
                      v-on:keypress="NumbersOnly"
                      maxlength="12"
                      v-bind:label="$t('mobile_ar')"
                      required
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('floor_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-autocomplete
                      v-bind="props"
                      v-model="events[1].floor"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="this.$t('meta_title_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-on="on"
                      v-model="events[1].meta_title"
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
              <v-col cols="12" sm="12" md="4">
                <v-tooltip :text="$t('sequence_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="events[1].seq"
                      @update:modelValue="
                        (value) => updateEventsSequence(value, 0)
                      "
                      maxlength="5"
                      :rules="seqRulesAR"
                      v-bind:label="$t('sequence_ar')"
                      v-on:keypress="NumbersOnly"
                      required
                      class="rtl"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-card-title class="text-right" style="font-size: 17px">{{
                  $t("description_ar")
                }}</v-card-title>
                <v-tooltip :text="this.$t('description_ar')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <quill-editor
                        ref="quill_editor_ref"
                        :options="editorOptions"
                        class="arabclassquill"
                        v-bind:id="
                          quill_item_ar == true
                            ? 'quill_item'
                            : 'quill_item_border'
                        "
                        v-model:value="events[1].description"
                        @blur="onEditorBlurAR($event)"
                        @focus="onEditorFocusAR($event)"
                        @ready="setRtlDirection"
                        @change="onEditorChangeAR($event)"
                      />
                      <small
                        v-if="quill_item_ar"
                        class="text-danger ml-5 required_item shake"
                        >Field Required</small
                      >
                    </div>
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
                      v-model="events[1].meta_description"
                      :rules="fieldRulesAR"
                      maxlength="2000"
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
                          v-if="
                            events[1].image_path == '' ||
                            events[1].image_path == null
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-else
                          :src="envImagePath + events[1].image_path"
                          width="100"
                          height="85
                          "
                          alt
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
                              v-if="events[1].image_path"
                              v-bind="props"
                              class="mr-2"
                              @click="downloadImage(events[1].image_path)"
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
                            v-if="events[1].image_path"
                            v-bind="props"
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
                  :folder="'events'"
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
                  name: 'events',
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
import { quillEditor } from "vue3-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default {
  components: { DatePicker, Imageupload, quillEditor },
  setup() {
    const onEditorFocus = () => {
      // console.log("editor focus!", quill);
    };
    const onEditorFocusAR = () => {
      // console.log("editor focus!", quill);
    };
    const onEditorReady = () => {
      // console.log("editor ready!", quill);
    };
    const onEditorReadyAR = () => {
      // console.log("editor ready!", quill);
    };

    return { onEditorReady, onEditorFocus, onEditorFocusAR, onEditorReadyAR };
  },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    editorOptions: {
      theme: "snow",
      direction: "rtl",
      placeholder: "أدخل المحتوى هنا",
    },
    editorOptions_en: {
      theme: "snow",
      direction: "ltr",
      placeholder: "Enter the content here",
    },
    labelText: "Mall",
    label_text_ar: "مجمع تجاري",
    tabs: 1,
    role_array: [],
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    valid: false,
    validAR: false,
    quill_item: false,
    quill_item_ar: false,
    error_valid: false,
    loader: false,
    stores_data_en: [],
    stores_data_ar: [],
    file: "",
    isBtnLoading: false,
    showupload: "",
    sel_lang: "",
    isDisabled: false,
    checkbox_value: false,
    uploadfile: false,
    events_en: [],
    events_ar: [],
    stores_en: [],
    stores_ar: [],
    country_array_en: [],
    user: "",
    events: [
      {
        id: 0,
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        image_path: "",
        email: "",
        mobile_code: null,
        mobile: "",
        seq: "",
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
        start_date: "",
        end_date: "",
        image_path: "",
        email: "",
        mobile_code: null,
        mobile: "",
        seq: "",
        meta_title: "",
        meta_description: "",
        lang: "ar",
        store_id: null,
        stor_type: "",
        floor: "",
      },
    ],
    uploadfilear: false,
    noimagepreview: "",
    items: [],
    floors_en: [],
    floors_ar: [],
    mall_id: null,
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
    numberRules() {
      return [(v) => (v >= 0 && v <= 999999999999) || this.$t("entered_value")];
    },

    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAR() {
      return [(v) => !!v || this.$t("field_required_ar")];
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
  },
  mounted() {
    this.get_stores();
    this.fetchMall();
  },
  created() {
    this.fetchLookup();
    this.get_countries();
    this.fetchRoles();
    this.user = JSON.parse(localStorage.getItem("user_data"));
    // if (this.user.store_id && this.user.rolename == "StoreAdmin") {
    //   this.events[0].store_id = this.user.store_id;
    //   this.events[1].store_id = this.user.store_id;
    // }
  },
  watch: {
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
                "edit_events/" +
                this.$route.query.slug
            )
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.events = res.data.events;
              this.assignType(this.events[0].stor_type);

              this.loader = false;
            });
        }
      },
    },
    "$route.query.s_tab": {
      immediate: true,
      handler() {
        if (this.$route.query.s_tab) {
          if (this.$route.query.s_tab == 1) {
            this.tabs = 1;
          } else {
            this.tabs = 2;
          }
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
    fetchLookup() {
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
    updateEventsSequence(value, index) {
      this.events[index].seq = value;
    },
    updateFloor(value, index) {
      this.events[index].floor = value;
    },
    updateType(stor_type) {
      this.events[1].store_id = null;
      this.events[0].store_id = null;
      this.assignType(stor_type);
    },
    setRtlDirection(quill) {
      quill.on("text-change", () => {
        const text = quill.getText();
        const rtlChar = /[\u0590-\u05FF\u0600-\u06FF]/;
        console.log("rtl char ", rtlChar);
        if (rtlChar.test(text)) {
          quill.root.setAttribute("dir", "rtl");
        } else {
          quill.root.setAttribute("dir", "ltr");
        }
      });
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
    assignType(stor_type) {
      setTimeout(() => {
        if (this.tabs == 1) {
          this.events[1].stor_type = stor_type;
          if (stor_type == "MallAdmin" && this.user.rolename == "MallAdmin") {
            // alert(stor_type);
            if (!this.$route.query.slug) {
              this.events[1].store_id = this.mall_id;
              this.events[0].store_id = this.mall_id;
            }
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
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
          this.events[0].stor_type = stor_type;
          if (stor_type == "MallAdmin" && this.user.rolename == "MallAdmin") {
            console.log("asdasd", this.stores_en);
            if (!this.$route.query.slug) {
              this.events[1].store_id = this.mall_id;
              this.events[0].store_id = this.mall_id;
            }
            this.labelText = this.$t("mall");
            this.label_text_ar = this.$t("mall_ar");
            this.stores_en = this.mal_data_en;
            this.stores_ar = this.mal_data_ar;
          } else if (stor_type == "MallAdmin") {
            // this.events[1].store_id = this.mall_id;
            // this.events[0].store_id = this.mall_id;
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
                this.events[0].store_id = ele.header_id;
                this.events[1].store_id = ele.header_id;
                this.mall_id = ele.header_id;
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
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

    fetchRoles() {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch_reg_roles")
        .then((response) => {
          this.loader = false;
          this.role_array = response.data.roles;
          if (!this.$route.query.slug && this.user.rolename == "SuperUser") {
            this.events[0].stor_type = this.role_array[0].rolename;
            this.events[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.events[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            !this.$route.query.slug
          ) {
            // this.role_array = response.data.roles.filter(
            //   (role) => role.rolename == "StoreAdmin"
            // );
            this.events[0].stor_type = this.role_array[0].rolename;
            this.events[1].stor_type = this.role_array[0].rolename;
            this.updateType(this.events[0].stor_type);
          } else if (
            this.user.rolename === "MallAdmin" &&
            this.$route.query.slug
          ) {
            this.assignType(this.events[0].stor_type);
          }
        })
        .catch((err) => {
          this.loader = false;
          console.log(err);
        });
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    updateStore(store) {
      if (this.tabs == 1) {
        this.events[1].store_id = store;
      } else {
        this.events[0].store_id = store;
      }
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
    get_stores() {
      this.initval = true;
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
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploaded_image(img_src) {
      //alert('uploaded image');
      //alert(img_src);
      if (this.tabs == 1) {
        this.events[0].image_path = img_src;
      } else {
        this.events[1].image_path = img_src;
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
      this.events[0].start_date = formatted_date;
      this.events[1].start_date = formatted_date;
      if (this.events[0].end_date < formatted_date) {
        this.events[0].end_date = "";
      }
      if (this.events[1].end_date < formatted_date) {
        this.events[1].end_date = "";
      }
    },
    formatted_start_date_ar(formatted_date) {
      this.events[1].start_date = formatted_date;
      this.events[0].start_date = formatted_date;
      if (this.events[0].end_date < formatted_date) {
        this.events[0].end_date = "";
      }
      if (this.events[1].end_date < formatted_date) {
        this.events[1].end_date = "";
      }
    },
    formatted_end_date(formatted_date) {
      this.events[0].end_date = formatted_date;
      this.events[1].end_date = formatted_date;
    },
    formatted_end_date_ar(formatted_date) {
      this.events[1].end_date = formatted_date;
      this.events[0].end_date = formatted_date;
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    presubmitvalidation() {
      if (this.tabs == 1) {
        if (
          this.events[0].description == "" ||
          this.events[0].description == null
        ) {
          this.quill_item = true;
        } else {
          this.quill_item = false;
        }
        if (
          this.$refs.form.validate() &&
          this.valid == true &&
          this.quill_item == false &&
          this.validAR == true &&
          this.quill_item_ar == false
        ) {
          this.error_valid = false;
          this.submit();
        } else {
          if (this.valid == true && this.quill_item == false) {
            this.error_valid = true;
            this.tabs = 2;
          }
        }
      } else {
        if (
          this.events[1].description == "" ||
          this.events[1].description == null
        ) {
          this.quill_item_ar = true;
        } else {
          this.quill_item_ar = false;
        }
        if (
          this.$refs.form.validate() &&
          this.validAR == true &&
          this.quill_item_ar == false &&
          this.valid == true &&
          this.quill_item == false
        ) {
          this.error_valid = false;
          this.submit();
        } else {
          if (this.validAR == true && this.quill_item_ar == false) {
            this.error_valid = true;
            this.valid = false;
            this.tabs = 1;
          }
        }
      }
    },
    submit() {
      if (
        this.validAR == true &&
        this.quill_item_ar == false &&
        this.valid == true &&
        this.quill_item == false
      ) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        if (this.user.rolename == "StoreAdmin") {
          this.events[0].store_id = this.user.store_id;
          this.events[1].store_id = this.user.store_id;
          this.events[0].stor_type = this.user.rolename;
          this.events[1].stor_type = this.user.rolename;
        }
        // Form is valid, process
        this.$axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "save_events", this.events)
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
                name: "events",
                query: {
                  s_tab: this.tabs,
                },
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
    onEditorChange(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    onEditorChangeAR(event) {
      if (event.text.length == 1) {
        this.quill_item_ar = true;
      } else {
        this.quill_item_ar = false;
      }
    },
    onEditorBlur() {
      // console.log(event.options);
      if (this.events.description == "") {
        this.quill_item = true;
      }
    },
    onEditorBlurAR(event) {
      console.log(event.options);
      if (this.events.description_ar == "") {
        this.quill_item_ar = true;
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    updateMobileCode(value, index) {
      this.events[index].mobile_code = value;
    },
    updateEventsMobile(value, index) {
      this.events[index].mobile = value;
    },
    updateEmail(value, index) {
      this.events[index].email = value;
    },
    removeImage(index) {
      if (index == 1) {
        this.events[1].image_path = null;
      } else {
        this.events[0].image_path = null;
      }
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

.rtl :deep() input {
  text-align: right;
  direction: rtl;
}

.arabdirection /deep/ .v-field {
  direction: rtl !important;
}

.arabclassquill /deep/ .ql-editor {
  text-align: right !important;
}

.arabdirection /deep/ .v-input {
  direction: rtl !important;
}

.delete_icon_ar {
  position: relative;
  right: 77px;
  bottom: 90px;
}

.delete_icon {
  position: relative;
  left: 83px;
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

#quill_item {
  border: 1px solid #b00020;
}

#quill_item_border {
  border: 1px solid #d1d5db;
}

.dimension_text {
  text-align-last: start;
}
</style>
