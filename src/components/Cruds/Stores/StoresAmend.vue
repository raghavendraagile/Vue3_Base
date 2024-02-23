<template>
  <div class="mx-2 mt-3 p-0">
    <div
      class="my-3 p-0"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_amend_stores')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
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
        <v-window v-model="tabs">
          <!-- ENGLISH TAB STARTS -->
          <v-window-item :value="1">
            <v-form ref="form" v-model="valid">
              <v-layout v-if="user.rolename != 'StoreAdmin'">
                <v-row class="px-6 mt-2">
                  <v-col xs="12" md="12" lg="12">
                    <!-- {{user.rolename}} -->
                    <v-radio-group
                      v-model="stores[0].stor_type"
                      inline
                      class="radio_item"
                      :disabled="$route.query.slug"
                      @change="updateType(stores[0].stor_type)"
                    >
                      <v-radio
                        :label="$t('mall')"
                        value="Mall"
                        v-if="user.rolename === 'SuperUser'"
                      ></v-radio>
                      <v-radio
                        value="Store"
                        :label="$t('store')"
                        v-if="
                          user.rolename == 'SuperUser' ||
                          user.rolename == 'MallAdmin'
                        "
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="headings">
                  <v-col xs="12" md="12" lg="12">
                    <h6 class="m-4" v-if="stores[0].stor_type == 'Mall'">
                      <b>{{ $t("mall_details") }}</b>
                    </h6>
                    <h6 class="m-4" v-else>
                      <b>{{ $t("store_details") }}</b>
                    </h6>
                  </v-col>
                </v-row>
              </v-layout>
              <!-- {{stores[0].categories}} -->
              <v-layout v-if="stores[0].stor_type == 'Store'">
                <v-row class="px-6 mt-2">
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-tooltip :text="this.$t('category')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[0].categories"
                          @update:modelValue="
                            (value) => updateCategories(value)
                          "
                          :rules="fieldRulesArray"
                          v-bind:label="$t('category')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                          index="id"
                          multiple
                          :items="categories_en"
                          item-value="header_id"
                          item-title="name"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="user.rolename != 'StoreAdmin'"
                  >
                    <v-tooltip :text="this.$t('mall_name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[0].mall_name"
                          @update:modelValue="(value) => updateMallName(value)"
                          :rules="fieldRules"
                          v-bind:label="$t('mall_name')"
                          variant="outlined"
                          density="compact"
                          :disabled="user.rolename == 'MallAdmin'"
                          class="required_field"
                          required
                          index="id"
                          :items="mall_names_en"
                          item-value="header_id"
                          item-title="name"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col
                    cols="12"
                    xs="12"
                    sm="6"
                    :md="stores[0].stor_type == 'Store' ? 3 : 6"
                  >
                    <v-tooltip :text="$t('name_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].name"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('name_en')"
                          class="required_field"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="3">
                    <v-tooltip :text="$t('email_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallEmail(value, 1)
                          "
                          v-model="stores[0].email"
                          :rules="[...fieldRules, ...emailRules]"
                          maxlength="100"
                          v-bind:label="$t('email_en')"
                          class="required_field"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="2" md="1">
                    <v-tooltip :text="$t('mobile_code_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('mobile_code_en')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          :rules="fieldRules"
                          class="required_field"
                          required
                          index="id"
                          item-key="header_id"
                          item-value="header_id"
                          item-title="mobile_code"
                          v-model="stores[0].mobile_code"
                          @update:modelValue="
                            (value) => updateMobileCode(value)
                          "
                          :items="country_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4" md="2">
                    <v-tooltip :text="$t('phone_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallPhone(value, 1)
                          "
                          v-model="stores[0].phone"
                          :rules="phoneRules"
                          v-on:keypress="NumbersOnly"
                          maxlength="12"
                          v-bind:label="$t('phone_en')"
                          required
                          class="required_field"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="3"
                    v-if="stores[0].stor_type == 'Store'"
                  >
                    <v-tooltip :text="$t('store_code')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallSCode(value, 1)
                          "
                          v-model="stores[0].store_code"
                          v-bind:label="$t('store_code')"
                          variant="outlined"
                          density="compact"
                          required
                          index="id"
                          :items="shop_codes"
                          item-value="shop_code"
                          item-title="shop_code"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" md="3" xs="6" sm="6" lg="3">
                    <v-tooltip :text="$t('country_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('country_en')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          class="required_field"
                          item-value="header_id"
                          item-title="name"
                          required
                          :rules="fieldRules"
                          v-model="stores[0].country"
                          @update:model-value="
                            fetchStates(stores[0].country);
                            updateCountryF(stores[0].country, 1);
                          "
                          :items="country_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" xs="6" sm="6" lg="3">
                    <v-tooltip :text="$t('state_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('state_en')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          index="id"
                          item-key="name"
                          item-title="name"
                          item-value="header_id"
                          required
                          :rules="fieldRules"
                          v-model="stores[0].state"
                          @update:model-value="
                            fetch_cities(stores[0].state);
                            updateStateF(stores[0].state, 1);
                          "
                          :items="state_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" xs="6" sm="6" lg="3">
                    <v-tooltip :text="$t('city_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('city_en')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          class="required_field"
                          item-value="header_id"
                          item-title="name"
                          required
                          :rules="fieldRules"
                          v-model="stores[0].city"
                          @update:model-value="updateCityF(stores[0].city, 1)"
                          :items="city_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" lg="3" xs="6" sm="6" px-2>
                    <v-tooltip :text="$t('postcode_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind:label="$t('postcode_en')"
                          :rules="postcodeRules"
                          v-on:keypress="AlphanumericAndArabic"
                          v-bind="props"
                          variant="outlined"
                          class="required_field"
                          density="compact"
                          maxlength="12"
                          @update:modelValue="
                            (value) => updateMallPost(value, 1)
                          "
                          v-model="stores[0].post_code"
                          required
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" md="4" xs="12" sm="12" lg="6">
                    <v-tooltip :text="$t('address_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          maxlength="250"
                          counter="true"
                          :rules="fieldRules"
                          v-model="stores[0].address"
                          v-bind:label="$t('address_en')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="8" xs="12" sm="12" lg="6">
                    <v-tooltip :text="$t('description_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          maxlength="2000"
                          counter="true"
                          :rules="descriptionRules"
                          v-model="stores[0].description"
                          v-bind:label="$t('description_en')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <!-- :rules="fieldRules" -->
                  <!-- class="required_field" -->

                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-tooltip :text="$t('website_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallweb(value, 1)
                          "
                          v-model="stores[0].website"
                          maxlength="100"
                          v-bind:label="$t('website_en')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="2">
                    <v-tooltip :text="$t('sequence_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].seq"
                          maxlength="5"
                          v-on:keypress="NumbersOnly"
                          v-bind:label="$t('sequence_en')"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-tooltip :text="$t('meta_title_en')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].meta_title"
                          :rules="fieldRules"
                          maxlength="70"
                          class="required_field"
                          v-bind:label="$t('meta_title_en')"
                          required
                          counter="true"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                    <v-tooltip
                      :text="$t('meta_description_en')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          :rules="descriptionRules"
                          maxlength="160"
                          counter="true"
                          class="required_field"
                          v-model="stores[0].meta_description"
                          v-bind:label="$t('meta_description_en')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <div>
                      <span class="mb-5">{{ $t("logo_en") }}</span>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="stores[0].icon != null"
                              :src="envImagePath + stores[0].icon"
                              width="100"
                              height="65
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
                      <span>
                        <v-tooltip
                          :text="this.$t('delete_en')"
                          location="bottom"
                        >
                          <template v-slot:activator="{ props }">
                            <v-icon
                              small
                              v-bind="props"
                              v-if="stores[0].icon"
                              class="mr-2 edit_btn icon_size delete_icon"
                              @click="removeImage(0)"
                              >mdi mdi-trash-can-outline</v-icon
                            >
                          </template>
                        </v-tooltip>
                      </span>
                      <v-tooltip
                        :text="this.$t('download_en')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <a class="text-center pointer download_icon">
                            <span
                              ><v-icon
                                v-if="stores[0].icon"
                                v-bind="props"
                                class="mr-2"
                                @click="downloadImage(stores[0].icon)"
                                >mdi mdi-download</v-icon
                              ></span
                            >
                          </a>
                        </template>
                      </v-tooltip>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'stores'"
                      :resizewidth="250"
                      :resizeheight="250"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadfile"
                    />
                  </v-col>
                  <!-- <v-col cols="3" sm="3" md="3">
                    <div>
                      <span class="mb-5">{{ $t("background_image") }}</span>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="stores[0].background_image != ''"
                              :src="envImagePath + stores[0].background_image"
                              width="100"
                              height="65
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
                              <v-icon @click="uploadBIFile">mdi-camera</v-icon>
                            </div>
                          </div>
                        </v-hover>
                      </div>
                      <a
                        class="text-center pointer"
                        @click="downloadImage(stores[0].background_image)"
                      >
                        <span
                          v-if="stores[0].background_image"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'backgroundimg'"
                      :resizewidth="0.4"
                      :resizeheight="0.1"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadbifile"
                    />
                  </v-col> -->
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ENGLISH TAB END -->
          <!-- ARABIC TAB STARTS -->
          <v-window-item :value="2">
            <v-form ref="form" v-model="valid" class="rtl-direction">
              <v-layout v-if="user.rolename != 'StoreAdmin'">
                <v-row class="px-6 mt-2">
                  <v-col xs="12" sm="12" md="12" lg="12">
                    <v-radio-group
                      v-model="stores[1].stor_type"
                      inline
                      style="direction: rtl"
                      class="radio_item"
                      :disabled="$route.query.slug"
                      @change="updateType(stores[1].stor_type)"
                    >
                      <v-radio
                        :label="$t('mall_ar')"
                        value="Mall"
                        v-if="user.rolename === 'SuperUser'"
                      ></v-radio>
                      <v-radio
                        value="Store"
                        :label="$t('store_ar')"
                        v-if="
                          user.rolename == 'SuperUser' ||
                          user.rolename == 'MallAdmin'
                        "
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="headings">
                  <v-col xs="12" sm="12" md="12" lg="12">
                    <h6 class="m-4" v-if="stores[1].stor_type == 'Mall'">
                      <b>{{ $t("mall_details_ar") }}</b>
                    </h6>
                    <h6 class="m-4" v-else>
                      <b>{{ $t("store_details_ar") }}</b>
                    </h6>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout v-if="stores[1].stor_type == 'Store'">
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col xs="12" sm="12" md="6">
                    <v-tooltip :text="this.$t('category_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[1].categories"
                          @update:modelValue="
                            (value) => updateCategories(value)
                          "
                          :rules="fieldRulesAr"
                          v-bind:label="$t('category_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field rtl"
                          required
                          index="id"
                          multiple
                          :items="categories_ar"
                          item-value="header_id"
                          item-title="name"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    xs="12"
                    sm="12"
                    md="6"
                    v-if="user.rolename != 'StoreAdmin'"
                  >
                    <v-tooltip :text="this.$t('mall_name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[1].mall_name"
                          @update:modelValue="(value) => updateMallName(value)"
                          :rules="fieldRulesAr"
                          v-bind:label="$t('mall_name_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field rtl"
                          :disabled="user.rolename == 'MallAdmin'"
                          required
                          index="id"
                          :items="mall_names_ar"
                          item-value="header_id"
                          item-title="name"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    :md="stores[0].stor_type == 'Store' ? 3 : 6"
                  >
                    <v-tooltip :text="$t('name_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].name"
                          :rules="fieldRulesAr"
                          maxlength="100"
                          v-bind:label="$t('name_ar')"
                          required
                          variant="outlined"
                          density="compact"
                          class="required_field rtl"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="3">
                    <v-tooltip :text="$t('email_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          @update:modelValue="
                            (value) => updateMallEmail(value, 0)
                          "
                          v-bind="props"
                          v-model="stores[1].email"
                          :rules="[...fieldRulesAr, ...emailRulesAr]"
                          maxlength="100"
                          v-bind:label="$t('email_ar')"
                          required
                          variant="outlined"
                          density="compact"
                          class="required_field rtl"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="2" md="1">
                    <v-tooltip :text="$t('mobile_code_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('mobile_code_ar')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          :rules="fieldRulesAr"
                          class="required_field"
                          required
                          index="id"
                          item-key="header_id"
                          item-value="header_id"
                          item-title="mobile_code"
                          v-model="stores[1].mobile_code"
                          @update:modelValue="
                            (value) => updateMobileCode(value)
                          "
                          :items="country_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4" md="2">
                    <v-tooltip :text="$t('phone_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallPhone(value, 0)
                          "
                          v-model="stores[1].phone"
                          :rules="phoneRulesAr"
                          v-on:keypress="NumbersOnly"
                          maxlength="12"
                          v-bind:label="$t('phone_ar')"
                          required
                          variant="outlined"
                          density="compact"
                          class="required_field rtl"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="3"
                    v-if="stores[0].stor_type == 'Store'"
                  >
                    <v-tooltip :text="$t('store_code_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallSCode(value, 0)
                          "
                          v-model="stores[1].store_code"
                          v-bind:label="$t('store_code_ar')"
                          variant="outlined"
                          density="compact"
                          required
                          counter="true"
                          index="id"
                          :items="shop_codes"
                          item-value="shop_code"
                          item-title="shop_code"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" md="3" xs="6" sm="6" lg="3">
                    <v-tooltip :text="$t('country_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('country_ar')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          item-value="header_id"
                          class="required_field rtl"
                          item-title="name"
                          required
                          :rules="fieldRulesAr"
                          v-model="stores[1].country"
                          @update:model-value="
                            fetchStates(stores[1].country);
                            updateCountryF(stores[1].country, 0);
                          "
                          :items="country_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" xs="6" sm="6" lg="3">
                    <v-tooltip :text="$t('state_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('state_ar')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          class="required_field rtl"
                          item-key="name"
                          item-value="header_id"
                          item-title="name"
                          required
                          :rules="fieldRulesAr"
                          v-model="stores[1].state"
                          @update:model-value="
                            fetch_cities(stores[1].state, 0);
                            updateStateF(stores[1].country, 0);
                          "
                          :items="state_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" xs="6" sm="6" lg="3">
                    <v-tooltip :text="$t('city_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('city_ar')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          item-title="name"
                          class="required_field rtl"
                          required
                          :rules="fieldRulesAr"
                          item-value="header_id"
                          v-model="stores[1].city"
                          @update:model-value="updateCityF(stores[1].city, 0)"
                          :items="city_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" lg="3" xs="6" sm="6" px-2>
                    <v-tooltip :text="$t('postcode_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind:label="$t('postcode_ar')"
                          :rules="postcodeRulesAr"
                          v-on:keypress="AlphanumericAndArabic"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="12"
                          class="required_field rtl"
                          @update:modelValue="
                            (value) => updateMallPost(value, 0)
                          "
                          v-model="stores[1].post_code"
                          required
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" md="4" xs="12" sm="12" lg="6">
                    <v-tooltip :text="$t('address_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="250"
                          counter="true"
                          class="required_field rtl"
                          :rules="fieldRulesAr"
                          v-model="stores[1].address"
                          v-bind:label="$t('address_ar')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="8" xs="12" sm="12" lg="6">
                    <v-tooltip :text="$t('description_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="2000"
                          counter="true"
                          class="required_field rtl"
                          :rules="descriptionRulesAr"
                          v-model="stores[1].description"
                          v-bind:label="$t('description_ar')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <v-tooltip :text="$t('website_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          @update:modelValue="
                            (value) => updateMallweb(value, 0)
                          "
                          v-model="stores[1].website"
                          maxlength="100"
                          v-bind:label="$t('website_ar')"
                          required
                          counter="true"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="2">
                    <v-tooltip :text="$t('sequence_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].seq"
                          v-on:keypress="NumbersOnly"
                          maxlength="5"
                          v-bind:label="$t('sequence_ar')"
                          class="rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6">
                    <v-tooltip :text="$t('meta_title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].meta_title"
                          :rules="fieldRulesAr"
                          maxlength="70"
                          v-bind:label="$t('meta_title_ar')"
                          required
                          counter="true"
                          class="required_field rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <!-- :rules="fieldRules" -->
                  <!-- class="required_field" -->
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" md="12" xs="12" sm="12" lg="12">
                    <v-tooltip
                      :text="$t('meta_description_ar')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          :rules="descriptionRulesAr"
                          maxlength="160"
                          counter="true"
                          class="required_field rtl"
                          v-model="stores[1].meta_description"
                          v-bind:label="$t('meta_description_ar')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2 arabdirection">
                  <v-col cols="12" xs="12" sm="12" md="4">
                    <div>
                      <span class="mb-5">{{ $t("logo_ar") }}</span>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="stores[1].icon != null"
                              :src="envImagePath + stores[1].icon"
                              width="100"
                              height="65
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
                      <span>
                        <v-tooltip
                          :text="this.$t('delete_ar')"
                          location="bottom"
                        >
                          <template v-slot:activator="{ props }">
                            <v-icon
                              v-bind="props"
                              small
                              v-if="stores[1].icon"
                              class="mr-2 edit_btn icon_size delete_icon_ar"
                              @click="removeImage(1)"
                              >mdi mdi-trash-can-outline</v-icon
                            >
                          </template>
                        </v-tooltip>
                      </span>

                      <v-tooltip
                        :text="this.$t('download_ar')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <a class="text-center pointer download_icon_ar">
                            <span
                              ><v-icon
                                v-if="stores[1].icon"
                                v-bind="props"
                                class="mr-2"
                                @click="downloadImage(stores[1].icon)"
                                >mdi mdi-download</v-icon
                              ></span
                            >
                          </a>
                        </template>
                      </v-tooltip>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'stores'"
                      :resizewidth="250"
                      :resizeheight="250"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadfilear"
                    />
                  </v-col>
                  <!-- <v-col cols="3" sm="3" md="3">
                    <div>
                      <span class="mb-5">{{ $t("background_image_ar") }}</span>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="stores[1].background_image != null"
                              :src="envImagePath + stores[1].background_image"
                              width="100"
                              height="65
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
                              <v-icon @click="uploadBIFile">mdi-camera</v-icon>
                            </div>
                          </div>
                        </v-hover>
                      </div>
                      <a
                        class="text-center pointer"
                        @click="downloadImage(stores[1].background_image)"
                      >
                        <span
                          v-if="stores[1].background_image"
                          class="download_btn_color"
                          >{{ $t("download_ar") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'stores'"
                      :resizewidth="0.4"
                      :resizeheight="0.1"
                      @uploaded_image="uploaded_image"
                      :upload_profile="uploadbifile"
                    />
                  </v-col> -->
                </v-row>
              </v-layout>
            </v-form>
          </v-window-item>
          <!-- ARABIC TAB END -->
        </v-window>
      </div>
      <div v-if="social_media_en.length > 0 && social_media_ar.length > 0">
        <div class="headings">
          <h6 class="m-4" v-if="tabs == 1">
            <b>{{ $t("social_media") }}</b>
          </h6>
          <h6 class="m-4 arabdirection" v-else>
            <b>{{ $t("social_media_ar") }}</b>
          </h6>
        </div>
        <v-layout>
          <v-row class="px-6 mt-2" v-if="tabs == 1">
            <v-col
              v-for="(media_data, media_index) in social_media_en"
              :key="media_index"
              cols="12"
              sm="4"
              md="4"
            >
              <v-tooltip :text="media_data.longname" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-if="social_media[media_index]"
                    v-bind="props"
                    v-model="social_media[media_index].link"
                    maxlength="100"
                    v-bind:label="media_data.longname"
                    required
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6 mt-2 arabdirection" v-else>
            <v-col
              v-for="(media_data, media_index) in social_media_ar"
              :key="media_index"
              cols="12"
              sm="4"
              md="4"
            >
              <v-tooltip :text="media_data.longname" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-if="social_media[media_index]"
                    v-model="social_media[media_index].link"
                    maxlength="100"
                    v-bind:label="media_data.longname"
                    required
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-layout>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
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
                @click="submit"
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
  </div>
</template>

<script>
import Imageupload from "../../CustomComponents/ImageUpload.vue";
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
    Imageupload,
  },
  data: () => ({
    google_icon: {
      icon_name: "storefront",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: true,
    message: "",
    sel_lang: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    tabs: 1,
    social_media: [],
    stores: [
      {
        id: 0,
        lang: "en",
        stor_type: "Mall",
        categories: [],
        mall_name: "",
        icon: null,
        background_image: "",
        store_code: "",
        website: "",
        mobile_code: null,
        seq: null,
      },
      {
        id: 0,
        lang: "ar",
        stor_type: "Mall",
        categories: [],
        store_code: "",
        mobile_code: null,
        mall_name: "",
        icon: null,
        background_image: "",
        website: "",
        seq: null,
      },
    ],
    categories_en: [],
    categories_ar: [],
    mall_names_en: [],
    mall_names_ar: [],
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    uploadfile: false,
    uploadfilear: false,
    uploadbifile: false,
    country_array_en: [],
    country_array_ar: [],
    state_array_en: [],
    state_array_ar: [],
    city_array_en: [],
    city_array_ar: [],
    social_media_en: [],
    social_media_ar: [],
    shop_codes: [],
    user: "",
    page_type: "add",
  }),

  computed: {
    fieldRulesArray() {
      return [
        (v) => (Array.isArray(v) && v.length > 0) || this.$t("field_required"),
      ];
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fieldRulesAr() {
      return [(v) => !!v || this.$t("field_required_ar")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },
    descriptionRulesAr() {
      return [(v) => !!v || this.$t("description_required_ar")];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) => /.+@.+/.test(v) || this.$t("email_valid"),
      ];
    },
    emailRulesAr() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) => /.+@.+/.test(v) || this.$t("email_valid_ar"),
      ];
    },

    phoneRules() {
      return [
        (v) => {
          const digitsOnly = (v || "").replace(/\D+/g, "");
          return (
            (digitsOnly.length > 0 &&
              digitsOnly.length <= 12 &&
              /^\d+$/.test(digitsOnly)) ||
            this.$t("valid_number_required")
          );
        },
      ];
    },
    phoneRulesAr() {
      return [
        (v) => {
          const digitsOnly = (v || "").replace(/\D+/g, "");
          return (
            (digitsOnly.length > 0 &&
              digitsOnly.length <= 12 &&
              /^\d+$/.test(digitsOnly)) ||
            this.$t("valid_number_required_ar")
          );
        },
      ];
    },

    postcodeRules() {
      const alphanumericRegex = /^[a-z0-9\u0600-\u06FF]+$/i;
      return [(v) => alphanumericRegex.test(v) || this.$t("postcode_valid")];
      // return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },
    postcodeRulesAr() {
      const alphanumericRegex = /^[a-z0-9\u0600-\u06FF]+$/i;
      return [(v) => alphanumericRegex.test(v) || this.$t("postcode_valid")];
      // return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid_ar")];
    },
  },

  created() {
    this.get_countries();
    this.fetchShopCodes();
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.get_categories();

    if (!this.$route.query.slug) {
      this.fetch_social_media();
    }
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.page_type = "edit";
          this.loader = true;
          this.$axios
            .get(
              process.env.VUE_APP_API_URL_ADMIN +
                "edit-stores/" +
                this.$route.query.slug
            )
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.stores = res.data.stores;
                this.social_media = res.data.social_media;
                this.fetchStates(this.stores[0].country);
                this.fetch_cities(this.stores[0].state);
                this.get_categories();
                this.loader = false;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            });

          this.$axios
            .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-social-media")
            .then((response) => {
              console.log(response);
              this.social_media_en = response.data.social_media_en;
              this.social_media_ar = response.data.social_media_ar;
              response.data.social_media_en.forEach((element) => {
                if (this.social_media.store_id > 0) {
                  this.social_media.longname = element.longname;
                }
              });
              console.log("social_media");
              console.log(this.social_media);
              this.initval = false;
            })
            .catch((err) => {
              console.log(err);
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
    updateMallEmail(value, index) {
      this.stores[index].email = value;
    },
    updateMallPhone(value, index) {
      this.stores[index].phone = value;
    },
    updateMallPost(value, index) {
      this.stores[index].post_code = value;
    },
    updateMallweb(value, index) {
      this.stores[index].website = value;
    },
    updateMallSCode(value, index) {
      this.stores[index].store_code = value;
    },
    updateMobileCode(header_id) {
      if (this.tabs == 1) {
        this.stores[1].mobile_code = header_id;
      } else {
        this.stores[0].mobile_code = header_id;
      }
      this.stores[0].country = header_id;
      this.stores[1].country = header_id;
      this.stores[0].state = null;
      this.stores[1].state = null;
      this.stores[0].city = null;
      this.stores[1].city = null;
      this.fetchStates(this.stores[0].country);
    },
    cancel() {
      if (this.user.rolename == "StoreAdmin") {
        this.$router.push({
          name: "my_stores",
          query: { s_tab: this.$route.query.s_tab },
        });
      } else {
        this.$router.push({
          name: "stores",
          query: { s_tab: this.$route.query.s_tab },
        });
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
    AlphanumericAndArabic(evt) {
      evt = evt || window.event;
      var charCode = evt.which || evt.keyCode;
      var char = String.fromCharCode(charCode);

      // Combine alphanumeric characters and Arabic unicode range in a regex pattern
      var regex = /^[0-9a-zA-Z\u0600-\u06FF]+$/;

      // Check if the character is not a match, and if so, prevent the input
      if (
        !regex.test(char) &&
        charCode > 31 &&
        !evt.ctrlKey &&
        !evt.metaKey &&
        !evt.altKey
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    updateType(stor_type) {
      if (this.tabs == 1) {
        this.stores[1].stor_type = stor_type;
      } else {
        this.stores[0].stor_type = stor_type;
      }
    },

    updateCategories(categories) {
      if (this.tabs == 1) {
        this.stores[1].categories = categories;
      } else {
        this.stores[0].categories = categories;
      }
    },

    updateMallName(mall_name) {
      if (this.tabs == 1) {
        this.stores[1].mall_name = mall_name;
      } else {
        this.stores[0].mall_name = mall_name;
      }
    },

    fetch_social_media() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-social-media")
        .then((response) => {
          this.social_media_en = response.data.social_media_en;
          this.social_media_ar = response.data.social_media_ar;
          response.data.social_media_en.forEach((element) => {
            this.social_media.push({
              id: 0,
              store_id: null,
              lookup_id: element.header_id,
              longname: element.longname,
              link: "",
              description: "",
              seq: 1,
            });
          });
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    get_categories() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-malls-categories")
        .then((response) => {
          console.log(response);
          this.categories_en = response.data.category_en;
          this.categories_ar = response.data.category_ar;
          this.mall_names_en = response.data.mall_names_en;
          this.mall_names_ar = response.data.mall_names_ar;
          if (this.user.rolename == "MallAdmin") {
            this.stores[0].stor_type = "Store";
            this.stores[1].stor_type = "Store";
            this.stores[0].mall_name = this.user.store_id;
            this.stores[1].mall_name = this.user.store_id;
          }
          // } else {

          // }
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchShopCodes() {
      this.initval = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetch-shop-codes")
        .then((response) => {
          this.shop_codes = response.data.shop_codes;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
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
    fetchStates(country_id) {
      this.stores[1].mobile_code = country_id;
      this.stores[0].mobile_code = country_id;
      this.initval = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_states_name/" + country_id
        )
        .then((response) => {
          this.state_array_en = response.data.states_en;
          this.state_array_ar = response.data.states_ar;
          this.initval = false;
          this.city_array_en = [];
          this.city_array_ar = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetch_cities(state_id) {
      this.initval = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "fetch_cities_name/" + state_id
        )
        .then((response) => {
          console.log(response);
          this.city_array_en = response.data.cities_en;
          this.city_array_ar = response.data.cities_ar;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateCountryF(country_id, index = null) {
      this.stores[index].country = country_id;
      this.stores[0].state = null;
      this.stores[0].city = null;
      this.stores[1].state = null;
      this.stores[1].city = null;
    },
    updateStateF(state_id, index = null) {
      this.stores[index].state = state_id;
      this.stores[0].city = null;
      this.stores[1].city = null;
    },
    updateCityF(city_id, index = null) {
      this.stores[index].city = city_id;
    },
    // Uploading a image
    uploaded_image(img_src) {
      if (this.tabs == 1) {
        console.log("img_src path", img_src);
        this.stores[0].icon = img_src;
      } else {
        this.stores[1].icon = img_src;
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
    uploadBIFile() {
      if (this.uploadbifile == false) {
        this.uploadbifile = true;
      } else {
        this.uploadbifile = false;
      }
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },

    //---submit---
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post(process.env.VUE_APP_API_URL_ADMIN + "save-stores", {
            store: this.stores,
            social_media: this.social_media,
          })
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              if (this.user.rolename == "StoreAdmin") {
                this.$router.push({
                  name: "my_stores",
                  query: { s_tab: this.$route.query.s_tab },
                });
              } else {
                this.$router.push({
                  name: "stores",
                  query: { s_tab: this.$route.query.s_tab },
                });
              }
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("error", err);
          })
          .finally(() => {
            this.isDisabled = false;
            this.isBtnLoading = false;
          });
        // this.isDisabled = false;
        // this.isBtnLoading = false;
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    removeImage(index) {
      if (index == 1) {
        this.stores[1].icon = null;
      } else {
        this.stores[0].icon = null;
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

.image-container {
  max-width: 110px;
  border: 5px double black;
  border-radius: 3px;
}

.camera-icon {
  position: absolute;
  bottom: 35px;
  left: 35px;
  animation: fadeInUp 0.5s forwards;
}

.upload_doc {
  margin-top: -14px;
}

.pointer {
  cursor: pointer;
}

.upload_image {
  margin-bottom: 3px;
}

.download_btn_color {
  color: blue;
}

.headings {
  color: #2196f3;
}

.image-width {
  border: 3px solid black;
  padding: 1px;
}

.arabdirection /deep/ .v-field {
  direction: rtl !important;
}

.arabdirection /deep/ .v-input {
  direction: rtl !important;
}
.delete_icon {
  position: relative;
  left: 122px;
  bottom: 90px;
}
.delete_icon_ar {
  position: relative;
  right: 120px;
  bottom: 90px;
}
.download_icon {
  position: relative;
  left: 90px;
  bottom: 52px;
}
.download_icon_ar {
  position: relative;
  bottom: 45px;
  right: 88px;
}
</style>
