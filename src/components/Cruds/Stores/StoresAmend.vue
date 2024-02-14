<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
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
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col xs="12" md="12" lg="12">
                    <v-radio-group
                      v-model="stores[0].stor_type"
                      inline
                      class="radio_item"
                      :disabled="$route.query.slug"
                      @change="updateType(stores[0].stor_type)"
                    >
                      <v-radio :label="$t('mall')" value="Mall"></v-radio>
                      <v-radio value="Store" :label="$t('store')"></v-radio>
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
              <v-layout v-if="stores[0].stor_type == 'Store'">
                <v-row class="px-6 mt-2">
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('category')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[0].categories"
                          @update:modelValue="
                            (value) => updateCategories(value)
                          "
                          :rules="fieldRules"
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
                  <v-col xs="4" md="4" lg="4">
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
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].name"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('name')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('email')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].email"
                          :rules="[...fieldRules, ...emailRules]"
                          maxlength="100"
                          v-bind:label="$t('email')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('phone')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].phone"
                          :rules="phoneRules"
                          v-on:keypress="NumbersOnly"
                          maxlength="100"
                          v-bind:label="$t('phone')"
                          required
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
                  <v-col cols="12" md="3" sm="3" lg="3">
                    <v-tooltip :text="$t('country')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('country')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          item-value="header_id"
                          item-title="name"
                          required
                          :rules="fieldRules"
                          v-model="stores[0].country"
                          @update:model-value="fetchStates(stores[0].country)"
                          :items="country_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" sm="3" lg="3">
                    <v-tooltip :text="$t('state')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('state')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          item-title="name"
                          item-value="header_id"
                          required
                          :rules="fieldRules"
                          v-model="stores[0].state"
                          @update:model-value="fetch_cities(stores[0].state)"
                          :items="state_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" sm="3" lg="3">
                    <v-tooltip :text="$t('city')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('city')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          item-value="header_id"
                          item-title="name"
                          required
                          :rules="fieldRules"
                          v-model="stores[0].city"
                          :items="city_array_en"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="12" md="3" lg="3" sm="3" px-2>
                    <v-tooltip :text="$t('postcode')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind:label="$t('postcode')"
                          :rules="postcodeRules"
                          v-on:keypress="NumbersOnly"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="12"
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
                  <v-col cols="12" md="4" sm="4" lg="4">
                    <v-tooltip :text="$t('address')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="250"
                          :rules="fieldRules"
                          counter="true"
                          v-model="stores[0].address"
                          v-bind:label="$t('address')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="8" sm="8" lg="8">
                    <v-tooltip :text="$t('description')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="250"
                          :rules="descriptionRules"
                          counter="true"
                          v-model="stores[0].description"
                          v-bind:label="$t('description')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('meta_title')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].meta_title"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('meta_title')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="8" sm="8" lg="8">
                    <v-tooltip :text="$t('meta_description')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          :rules="descriptionRules"
                          maxlength="250"
                          counter="true"
                          v-model="stores[0].meta_description"
                          v-bind:label="$t('meta_description')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('website')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].website"
                          maxlength="100"
                          v-bind:label="$t('website')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="2" sm="2" md="2">
                    <v-tooltip :text="$t('sequence')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[0].seq"
                          maxlength="100"
                          :rules="phoneRules"
                          v-on:keypress="NumbersOnly"
                          v-bind:label="$t('sequence')"
                          required
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="3" sm="3" md="3">
                    <div>
                      <span class="mb-5">{{ $t("logo") }}</span>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="stores[0].icon != ''"
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
                      <a
                        class="text-center pointer"
                        @click="downloadImage(stores[0].icon)"
                      >
                        <span
                          v-if="stores[0].icon"
                          class="download_btn_color"
                          >{{ $t("download") }}</span
                        >
                      </a>
                    </div>
                    <br />
                    <Imageupload
                      :folder="'stores'"
                      :resizewidth="0.4"
                      :resizeheight="0.1"
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
            <v-form ref="form" v-model="valid">
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col xs="12" md="12" lg="12">
                    <v-radio-group
                      v-model="stores[1].stor_type"
                      inline
                      class="radio_item"
                      :disabled="$route.query.slug"
                      @change="updateType(stores[1].stor_type)"
                    >
                      <v-radio :label="$t('mall_ar')" value="Mall"></v-radio>
                      <v-radio :label="$t('store_ar')" value="Store"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="headings">
                  <v-col xs="12" md="12" lg="12">
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
                <v-row class="px-6 mt-2">
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('category_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[1].categories"
                          @update:modelValue="
                            (value) => updateCategories(value)
                          "
                          :rules="fieldRules"
                          v-bind:label="$t('category_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
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
                  <v-col xs="4" md="4" lg="4">
                    <v-tooltip :text="this.$t('mall_name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind="props"
                          v-model="stores[1].mall_name"
                          @update:modelValue="(value) => updateMallName(value)"
                          :rules="fieldRules"
                          v-bind:label="$t('mall_name_ar')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
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
                <v-row class="px-6 mt-2">
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('name_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].name"
                          :rules="fieldRules"
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
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('email_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].email"
                          :rules="[...fieldRules, ...emailRules]"
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
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('phone_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].phone"
                          :rules="phoneRules"
                          v-on:keypress="NumbersOnly"
                          maxlength="100"
                          v-bind:label="$t('phone_ar')"
                          required
                          variant="outlined"
                          density="compact"
                          class="required_field rtl"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" md="3" sm="3" lg="3">
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
                          item-title="name"
                          required
                          :rules="fieldRules"
                          v-model="stores[1].country"
                          @update:model-value="fetchStates(stores[1].country)"
                          :items="country_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" sm="3" lg="3">
                    <v-tooltip :text="$t('state_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-autocomplete
                          v-bind:label="$t('state_ar')"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          index="id"
                          item-key="name"
                          item-value="header_id"
                          item-title="name"
                          required
                          :rules="fieldRules"
                          v-model="stores[1].state"
                          @update:model-value="fetch_cities(stores[1].state)"
                          :items="state_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" sm="3" lg="3">
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
                          required
                          :rules="fieldRules"
                          item-value="header_id"
                          v-model="stores[1].city"
                          :items="city_array_ar"
                        ></v-autocomplete>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="3" lg="3" sm="3" px-2>
                    <v-tooltip :text="$t('postcode_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind:label="$t('postcode_ar')"
                          :rules="postcodeRules"
                          v-on:keypress="NumbersOnly"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="12"
                          class="required_field rtl"
                          v-model="stores[1].post_code"
                          required
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-layout>
              <v-layout>
                <v-row class="px-6 mt-2">
                  <v-col cols="12" md="4" sm="4" lg="4">
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
                          :rules="fieldRules"
                          v-model="stores[1].address"
                          v-bind:label="$t('address_ar')"
                          required
                        ></v-textarea>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="8" sm="8" lg="8">
                    <v-tooltip :text="$t('description_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-textarea
                          rows="3"
                          v-bind="props"
                          variant="outlined"
                          density="compact"
                          maxlength="250"
                          class="required_field rtl"
                          :rules="descriptionRules"
                          counter="true"
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
                <v-row class="px-6 mt-2">
                  <v-col cols="4" sm="4" md="4">
                    <v-tooltip :text="$t('meta_title_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].meta_title"
                          :rules="fieldRules"
                          maxlength="100"
                          v-bind:label="$t('meta_title_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" md="8" sm="8" lg="8">
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
                          :rules="descriptionRules"
                          maxlength="250"
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
                <v-row class="px-6 mt-2">
                  <v-col cols="6" sm="6" md="4">
                    <v-tooltip :text="$t('website_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].website"
                          maxlength="100"
                          v-bind:label="$t('website_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="2" sm="2" md="2">
                    <v-tooltip :text="$t('sequence_ar')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="stores[1].seq"
                          v-on:keypress="NumbersOnly"
                          maxlength="100"
                          :rules="phoneRules"
                          v-bind:label="$t('sequence_ar')"
                          required
                          class="required_field rtl"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="3" sm="3" md="3">
                    <div>
                      <span class="mb-5">{{ $t("logo_ar") }}</span>
                      <div class="image-container">
                        <v-hover v-slot="{ isHovering, props }">
                          <div style="position: relative" v-bind="props">
                            <img
                              v-bind:style="
                                isHovering == true ? 'filter: blur(1px);' : ''
                              "
                              v-if="stores[1].icon != ''"
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
                      <a
                        class="text-center pointer"
                        @click="downloadImage(stores[1].icon)"
                      >
                        <span
                          v-if="stores[1].icon"
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
      <div class="headings">
        <h6 class="m-4" v-if="tabs == 1">
          <b>{{ $t("social_media") }}</b>
        </h6>
        <h6 class="m-4" v-else>
          <b>{{ $t("social_media_ar") }}</b>
        </h6>
      </div>
      <div>
        <v-layout>
          <v-row class="px-6 mt-2">
            <v-col
              v-for="(media_data, media_index) in social_media_en"
              :key="media_index"
              cols="4"
              sm="4"
              md="4"
            >
              <v-tooltip :text="media_data.longname" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
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
        </v-layout>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
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
        icon: "",
        background_image: "",
        website: "",
      },
      {
        id: 0,
        lang: "ar",
        stor_type: "Mall",
        categories: [],
        mall_name: "",
        icon: "",
        background_image: "",
        website: "",
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
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },

    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) => /.+@.+/.test(v) || this.$t("email_valid"),
      ];
    },
    phoneRules() {
      return [
        (v) =>
          (v >= 0 && v <= 999999999999) || this.$t("valid_number_required"),
      ];
    },
    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },
  },

  created() {
    this.get_categories();
    this.get_countries();
  },

  mounted() {
    if (!this.$route.query.slug) {
      this.fetch_social_media();
    }
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
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
              // this.social_media_ar = response.data.social_media_ar;
              response.data.social_media_en.forEach((element) => {
                console.log(element.longname);
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
  },

  methods: {
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
          console.log(response);
          this.social_media_en = response.data.social_media_en;
          // this.social_media_ar = response.data.social_media_ar;
          response.data.social_media_en.forEach((element) => {
            console.log(element.longname);
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
          console.log("social_media");
          console.log(this.social_media);
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
                name: "stores",
              });
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("error", err);
          });
        this.isDisabled = false;
        this.isBtnLoading = false;
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
</style>
