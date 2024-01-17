
<template>
  <div>
    <div flat color="white" class="row pt-5 pl-5 align-items-center">
      <page-title
        class="col-md-3"
        :heading="$t('tradie_profile')"
        :google_icon="google_icon"
      ></page-title>
      <div class="add_new_button">
        <v-tooltip :text="this.$t('back')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              size="small"
              @click="gobackrouter"
              class="mb-2 ml-2"
              color="cancel"
              v-bind="props"
              >{{ $t("back") }}</v-btn
            >
          </template>
        </v-tooltip>
      </div>
    </div>
    <div class="row pl-6">
      <h4>
        {{ user_details.salutation }}&nbsp;{{ user_details.name }}&nbsp;{{
          user_details.lastname
        }}
      </h4>
      <v-row class="my-3 pl-6" v-if="tradie_versions.length > 1">
        <div v-for="(version, i) in tradie_versions" :key="i">
          <v-chip
            @click="selectversion(version.id)"
            class="ma-2"
            v-bind:class="[
              tradie_version_id == version.id ||
              (tradie_version_id == 0 && i == tradie_versions.length - 1)
                ? 'activevchip'
                : '',
            ]"
          >
            <v-tooltip
              :text="showversiontooltip(version.version)"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props"> {{ $t("v") }} {{ version.version }}</span>
              </template>
            </v-tooltip>
          </v-chip>
          <span
            v-if="i == tradie_versions.length - 1"
            class="showcurrentversion"
          >
            {{ $t("current_version") }}</span
          >
        </div>
      </v-row>
      <!-- incidents & licenses starts -->
      <div class="col-md-8">
        <v-tabs v-model="tab" color="blue">
          <v-tab value="one">{{ $t("tradie_questions") }}</v-tab>
          <v-tab value="two">{{ $t("all_licenses") }}</v-tab>
          <v-tab value="three">{{ $t("activity_log") }}</v-tab>
        </v-tabs>
        <v-card-text>
          <content-loader v-if="loader"></content-loader>
          <v-window v-model="tab">
            <!-- Tab one starts -->
            <v-window-item value="one">
              <v-card>
                <div class="coming_soon_container">
                  <InsuranceAndClaims
                    :user_id="user_details.id"
                    :version_id="tradie_version_id"
                    @startstoploading="EmitLoader"
                  >
                  </InsuranceAndClaims>
                </div>
              </v-card>
            </v-window-item>
            <!-- Tab one ends -->
            <!-- Tab two starts -->
            <v-window-item value="two">
              <v-card>
                <v-row>
                  <v-col md="10" sm="10" lg="10">
                    <v-data-table
                      :headers="headers"
                      :items="files_uploaded"
                      :search="search"
                      :loading="initval"
                      :sort-by="[{ key: 'id', order: 'asc' }]"
                      v-bind:no-data-text="$t('no_data_available')"
                      :footer-props="{
                        'items-per-page-text': $t('rows_per_page'),
                      }"
                    >
                      <template v-slot:item="props">
                        <tr class="vdatatable_tbody">
                          <td>
                            {{ props.item.selectable.doc_name }}
                          </td>
                          <td>
                            <span v-if="props.item.selectable.doc_date">
                              {{ formatDate(props.item.selectable.doc_date) }}
                            </span>
                            <span v-else>{{ $t("not_appllicable") }}</span>
                          </td>
                          <td>
                            <a
                              :href="
                                envImagePath + props.item.selectable.doc_url
                              "
                              download
                              target="_blank"
                            >
                              <v-tooltip
                                :text="this.$t('download_license')"
                                location="bottom"
                              >
                                <template v-slot:activator="{ props }">
                                  <v-icon
                                    plain
                                    v-bind="props"
                                    dense
                                    class="mr-2 edit_btn icon_size"
                                    >mdi-download</v-icon
                                  >
                                </template>
                              </v-tooltip>
                            </a>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-card>
            </v-window-item>
            <!-- Tab two starts -->
            <!-- Tab three starts -->
            <v-window-item value="three">
              <v-card>
                <ActivityLog :user_id="user_details.id"></ActivityLog>
              </v-card>
            </v-window-item>
            <!-- Tab three starts -->
          </v-window>
        </v-card-text>
      </div>
      <!-- incidents & licenses ends -->
      <!-- tradie details starts -->
      <div class="col-md-4">
        <v-card>
          <div class="row mt-3">
            <div class="col-4 col-md-4 text-end">
              <v-avatar
                v-if="user_details.image_url != null"
                size="60"
                :image="envImagePath + user_details.image_url"
              ></v-avatar>
              <v-avatar v-else size="60">
                <v-img
                  :src="require('@/assets/images/avatars/default.png')"
                ></v-img>
              </v-avatar>
            </div>

            <div class="col-8 col-md-8 text-start">
              <div class="text-start">
                <h5>
                  {{ user_details.salutation }}&nbsp;{{
                    user_details.name
                  }}&nbsp;{{ user_details.lastname }}
                </h5>
              </div>
              <!-- <v-chip class="ma-2" color="green" text-color="white">
                Verified
              </v-chip>-->
              <!-- <router-link to="" class> -->

              <v-tooltip :text="$t('my_profile')" location="bottom">
                <template v-slot:activator="{ props }">
                  <router-link
                    :to="{
                      name: 'view-my-profile',
                      query: {
                        slug: user_details.slug,
                        from: 'view_only',
                      },
                    }"
                  >
                    <a class="w-100 ml-2" v-bind="props">
                      <small>
                        {{ $t("view_profile_details") }}
                      </small>
                    </a>
                  </router-link>
                </template>
              </v-tooltip>

              <!-- </router-link> -->
            </div>
          </div>
          <v-divider class="mx-8"></v-divider>
          <div class="d-flex px-8 pb-2">
            <div class="left-details">{{ $t("profession") }}</div>
            <div class="field_label" v-if="user_details.profession">
              {{ user_details.profession }}
            </div>
            <div v-else>{{ $t("not_applicable") }}</div>
          </div>
          <div class="d-flex px-8 pb-2">
            <div class="left-details">{{ $t("phone") }}</div>

            <div class="field_label" v-if="user_details.phone">
              {{ user_details.phone }}
            </div>
            <div v-else>{{ $t("not_applicable") }}</div>
          </div>
          <div class="d-flex px-8 pb-2">
            <div class="left-details">{{ $t("email") }}</div>

            <div class="field_label" v-if="user_details.email">
              {{ user_details.email }}
            </div>
            <div v-else>{{ $t("not_applicable") }}</div>
          </div>
          <div class="d-flex px-8 pb-2">
            <div class="left-details">{{ $t("city") }}</div>

            <div class="field_label" v-if="user_details.city">
              {{ user_details.city }}
            </div>
            <div v-else>{{ $t("not_applicable") }}</div>
          </div>
          <v-divider class="mx-8"></v-divider>

          <div v-if="user_details.header_answers">
            <div v-if="is_not_latest_version">
              <div class="d-flex justify-content-between px-8 pb-2">
                <div class="left-details">
                  <h6>{{ $t("form_status") }}</h6>
                </div>
                <div>
                  <v-chip
                    v-if="user_details.header_answers.status == 'Approved'"
                    size="small"
                    class
                    color="green"
                    text-color="white"
                  >
                    <v-icon size="small" start icon="mdi-check"></v-icon
                    >Approved
                  </v-chip>
                  <v-chip
                    v-if="user_details.header_answers.status == 'Rejected'"
                    class
                    color="red-accent-2"
                    text-color="white"
                  >
                    <v-icon size="small" start icon="mdi-close"></v-icon
                    >Rejected
                  </v-chip>
                  <v-chip
                    v-if="user_details.header_answers.status == 'Completed'"
                    class
                    color="yellow-darken-4"
                    text-color="white"
                  >
                    <v-icon
                      size="small"
                      start
                      icon="mdi-dots-horizontal"
                    ></v-icon
                    >Pending
                  </v-chip>
                </div>
              </div>
              <div class="d-flex px-8 pb-2">
                <div class="left-details">{{ $t("submitted") }}</div>
                <div class="field_label date_font">
                  {{
                    formatDateTime(user_details.header_answers.submitted_date)
                  }}
                </div>
              </div>
              <div
                v-if="
                  user_details.header_answers &&
                  user_details.header_answers.status == 'Approved'
                "
                class="d-flex px-8 pb-2"
              >
                <div class="left-details">{{ $t("approved") }}</div>
                <div class="field_label date_font">
                  {{
                    formatDateTime(
                      user_details.header_answers.approve_reject_date
                    )
                  }}
                </div>
              </div>
              <div
                v-if="
                  user_details.header_answers &&
                  user_details.header_answers.status == 'Rejected'
                "
                class="d-flex px-8 pb-2"
              >
                <div class="left-details">{{ $t("rejected") }}</div>
                <div class="field_label date_font">
                  {{
                    formatDateTime(
                      user_details.header_answers.approve_reject_date
                    )
                  }}
                </div>
              </div>
              <div
                v-if="
                  user_details.header_answers &&
                  user_details.header_answers.approver_id != null
                "
                class="d-flex px-8 pb-2"
              >
                <div
                  v-if="
                    user_details.header_answers &&
                    user_details.header_answers.status == 'Approved'
                  "
                  class="left-details"
                >
                  {{ $t("approved_by") }}
                </div>
                <div
                  v-else-if="
                    user_details.header_answers &&
                    user_details.header_answers.status == 'Rejected'
                  "
                  class="left-details"
                >
                  {{ $t("rejected_by") }}
                </div>

                <div class>
                  <v-avatar
                    v-if="
                      user_details.header_answers.approver_details &&
                      user_details.header_answers.approver_details.image_url !=
                        null
                    "
                    size="30"
                    :image="
                      envImagePath +
                      user_details.header_answers.approver_details.image_url
                    "
                  ></v-avatar>
                  <v-avatar v-else size="30">
                    <v-img
                      :src="require('@/assets/images/avatars/default.png')"
                    ></v-img>
                  </v-avatar>
                  <span class="field_label ml-2"
                    >{{ user_details.header_answers.approver_details.name }}
                    {{
                      user_details.header_answers.approver_details.lastname
                    }}</span
                  >
                </div>
              </div>
            </div>

            <div v-else>
              <div v-if="wizard_version">
                <div class="d-flex justify-content-between px-8 pb-2">
                  <div class="left-details">
                    <h6>{{ $t("form_status") }}</h6>
                  </div>
                  <div>
                    <v-chip
                      v-if="wizard_version.status == 'Approved'"
                      size="small"
                      class
                      color="green"
                      text-color="white"
                    >
                      <v-icon size="small" start icon="mdi-check"></v-icon
                      >Approved
                    </v-chip>
                    <v-chip
                      v-if="wizard_version.status == 'Rejected'"
                      class
                      color="red-accent-2"
                      text-color="white"
                    >
                      <v-icon size="small" start icon="mdi-close"></v-icon
                      >Rejected
                    </v-chip>
                    <v-chip
                      v-if="wizard_version.status == 'Completed'"
                      class
                      color="yellow-darken-4"
                      text-color="white"
                    >
                      <v-icon
                        size="small"
                        start
                        icon="mdi-dots-horizontal"
                      ></v-icon
                      >Pending
                    </v-chip>
                  </div>
                </div>
                <div class="d-flex px-8 pb-2">
                  <div class="left-details">{{ $t("submitted") }}</div>
                  <div class="field_label date_font">
                    {{ formatDateTime(wizard_version.submitted_date) }}
                  </div>
                </div>
                <div
                  v-if="wizard_version.status == 'Approved'"
                  class="d-flex px-8 pb-2"
                >
                  <div class="left-details">{{ $t("approved") }}</div>
                  <div class="field_label date_font">
                    {{ formatDateTime(wizard_version.approve_reject_date) }}
                  </div>
                </div>
                <div
                  v-if="wizard_version.status == 'Rejected'"
                  class="d-flex px-8 pb-2"
                >
                  <div class="left-details">{{ $t("rejected") }}</div>
                  <div class="field_label date_font">
                    {{ formatDateTime(wizard_version.approve_reject_date) }}
                  </div>
                </div>
                <div
                  v-if="wizard_version.approver_id != null"
                  class="d-flex px-8 pb-2"
                >
                  <div
                    v-if="wizard_version.status == 'Approved'"
                    class="left-details"
                  >
                    {{ $t("approved_by") }}
                  </div>
                  <div
                    v-else-if="wizard_version.status == 'Rejected'"
                    class="left-details"
                  >
                    {{ $t("rejected_by") }}
                  </div>
                  <div class>
                    <v-avatar
                      v-if="
                        wizard_version.approver_details &&
                        wizard_version.approver_details.image_url != null
                      "
                      size="30"
                      :image="
                        envImagePath + wizard_version.approver_details.image_url
                      "
                    ></v-avatar>
                    <v-avatar v-else size="30">
                      <v-img
                        :src="require('@/assets/images/avatars/default.png')"
                      ></v-img>
                    </v-avatar>
                    <span class="field_label ml-2"
                      >{{ wizard_version.approver_details.name }}
                      {{ wizard_version.approver_details.lastname }}</span
                    >
                  </div>
                </div>
                <div
                  v-if="wizard_version.status == 'Rejected'"
                  class="d-flex px-8 pb-2"
                >
                  <p>
                    <span style="color: red; font-size: 14px; font-weight: 500"
                      >{{ $t("reason_for_rejection") }} :</span
                    >
                    &nbsp;
                    <span style="font-size: 13px"
                      >{{ wizard_version.reason_for_reject }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="px-8 py-3 text-center"
              v-if="
                this.user.rolename == 'SuperUser' ||
                this.user.rolename == 'Admin'
              "
            >
              <div v-if="is_not_latest_version">
                <p
                  class="text-left"
                  v-if="user_details.header_answers.status == 'Rejected'"
                >
                  <span style="color: red; font-size: 14px; font-weight: 500"
                    >{{ $t("reason_for_rejection") }} :</span
                  >
                  &nbsp;
                  <span style="font-size: 13px"
                    >{{ user_details.header_answers.reason_for_reject }}
                  </span>
                </p>
                <v-btn
                  v-if="
                    user_details.header_answers.status == 'Approved' ||
                    user_details.header_answers.status == 'Rejected'
                  "
                  variant="outlined"
                  size="small"
                  block
                  color="blue"
                  @click="changeStatus(user_details.header_answers.status)"
                >
                  {{ $t("change_status") }}</v-btn
                >
              </div>
            </div>
            <div
              class="d-flex px-7 py-3 justify-content-around"
              v-if="
                this.user.rolename == 'SuperUser' ||
                this.user.rolename == 'Admin'
              "
            >
              <v-dialog
                persistent
                v-model="dialog"
                width="500px"
                v-if="is_not_latest_version"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-if="
                      user_details.header_answers &&
                      user_details.header_answers.status == 'Completed'
                    "
                    min-width="115"
                    size="small"
                    color="green-lighten-1"
                    v-bind="props"
                    >{{ $t("approve") }}</v-btn
                  >
                </template>
                <v-card>
                  <v-card-text>
                    <div class="d-flex justify-content-between">
                      <h5>{{ $t("approve_submission") }}</h5>
                      <v-tooltip :text="$t('cancel')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon @click="close" v-bind="props" v-on="on"
                            >mdi-close</v-icon
                          >
                        </template>
                      </v-tooltip>
                    </div>

                    <div
                      class="d-flex mt-3 mx-1 py-2 profile_container align-items-center"
                    >
                      <div class="ml-3">
                        <v-avatar
                          v-if="user_details.image_url != null"
                          size="55"
                          :image="envImagePath + user_details.image_url"
                        ></v-avatar>
                        <v-avatar
                          v-else
                          size="55"
                          color="grey-darken-3"
                          image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                        ></v-avatar>
                      </div>

                      <div class="text-start ml-2">
                        <div class="text-start">
                          <h6 class="mb-0 ml-2">
                            {{ user_details.salutation }}&nbsp;{{
                              user_details.name
                            }}&nbsp;{{ user_details.lastname }}
                          </h6>
                          <small class="field_label">{{
                            user_details.profession
                          }}</small>
                        </div>
                      </div>
                    </div>
                    <v-form ref="form">
                      <v-tooltip
                        :text="this.$t('reason_for_approval')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-textarea
                            v-model="approver_comment"
                            rows="3"
                            v-bind="props"
                            variant="outlined"
                            counter="true"
                            density="compact"
                            class="pt-4"
                            maxlength="200"
                            v-bind:label="$t('approver_coments')"
                            required
                          ></v-textarea>
                        </template>
                      </v-tooltip>
                      <v-checkbox
                        class="mt-3 checkbox_item"
                        v-model="approve_check"
                      >
                        <template v-slot:label>
                          <p style="font-size: 16px" color="black" class="mb-0">
                            (Confirmation T&C) Lorem Ipsum is simply dummy text
                            of the printing and typesetting industry.
                          </p>
                        </template>
                      </v-checkbox>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-content-end">
                    <div class="text-center">
                      <v-tooltip :text="$t('cancel')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            size="small"
                            color="cancel"
                            class="cancel mr-2"
                            @click="close()"
                            >{{ $t("cancel") }}</v-btn
                          >
                        </template>
                      </v-tooltip>
                    </div>

                    <v-tooltip
                      :text="$t('approve_submission')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          size="small"
                          color
                          class="bg-green-lighten-1 mr-2"
                          @click="Submit('Approved')"
                          :loading="isDisabled"
                          :disabled="!approve_check || isDisabled"
                          >{{ $t("approve_submission") }}</v-btn
                        >
                      </template>
                    </v-tooltip>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog
                persistent
                v-model="dialog1"
                width="500px"
                v-if="is_not_latest_version"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-if="
                      user_details.header_answers &&
                      user_details.header_answers.status == 'Completed'
                    "
                    min-width="115"
                    size="small"
                    color="red-accent-2"
                    v-bind="props"
                    >{{ $t("reject") }}</v-btn
                  >
                </template>
                <v-card>
                  <v-card-text>
                    <div class="d-flex justify-content-between">
                      <h5>{{ $t("reject_submission") }}</h5>

                      <v-tooltip :text="$t('cancel')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-icon @click="close()" v-bind="props" v-on="on"
                            >mdi-close</v-icon
                          >
                        </template>
                      </v-tooltip>
                    </div>

                    <div
                      class="d-flex mt-3 mx-1 py-2 profile_container align-items-center"
                    >
                      <div class="ml-3">
                        <v-avatar
                          v-if="user_details.image_url != null"
                          size="55"
                          :image="envImagePath + user_details.image_url"
                        ></v-avatar>
                        <v-avatar
                          v-else
                          size="55"
                          color="grey-darken-3"
                          image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
                        ></v-avatar>
                      </div>

                      <div class="text-start ml-2">
                        <div class="text-start">
                          <h6 class="mb-0 ml-2">
                            {{ user_details.salutation }}&nbsp;{{
                              user_details.name
                            }}&nbsp;{{ user_details.lastname }}
                          </h6>
                          <small class="field_label">{{
                            user_details.profession
                          }}</small>
                        </div>
                      </div>
                    </div>
                    <v-form ref="form">
                      <v-tooltip
                        :text="this.$t('reason_for_rejection')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <v-textarea
                            rows="3"
                            v-model="reason_for_reject"
                            v-bind="props"
                            variant="outlined"
                            counter="true"
                            density="compact"
                            class="pt-4"
                            maxlength="200"
                            v-bind:label="$t('reason_for_rejection')"
                            required
                          ></v-textarea>
                        </template>
                      </v-tooltip>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-content-end">
                    <div class="text-center">
                      <v-tooltip :text="$t('cancel')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            size="small"
                            color="cancel"
                            class="cancel mr-2"
                            @click="close()"
                            >{{ $t("cancel") }}</v-btn
                          >
                        </template>
                      </v-tooltip>
                    </div>

                    <v-tooltip
                      :text="$t('reject_submission')"
                      location="bottom"
                    >
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          size="small"
                          color
                          class="bg-red-accent-2"
                          @click="Submit('Rejected')"
                          :loading="isDisabled"
                          :disabled="!reason_for_reject || isDisabled"
                          >{{ $t("reject_submission") }}</v-btn
                        >
                      </template>
                    </v-tooltip>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- reject button and reject submission dialog ends -->
            </div>
          </div>
        </v-card>
      </div>
      <!-- tradie details ends -->
    </div>
  </div>
  <ConfirmDialog
    :show="showdeleteDialog"
    :cancel="cancel"
    :confirm="confirm"
    v-bind:title="$t('confirm')"
    v-bind:description="$t('update_confirm')"
  />
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import ConfirmDialog from "../../CustomComponents/ConfirmDialog.vue";
import InsuranceAndClaims from "../../CustomComponents/InsuranceAndClaims.vue";
import ActivityLog from "../../Cruds/ActivityLog/ActivityLog.vue";
export default {
  components: {
    PageTitle,
    InsuranceAndClaims,
    ConfirmDialog,
    ActivityLog,
  },
  data: () => ({
    envImagePath: process.env.VUE_APP_IMAGE_PATH,
    envPath: process.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    allLicenses: [],
    tradie_version_id: 0,
    tradie_versions: [],
    files_uploaded: [],
    wizard_version: [],
    tab: null,
    approve_check: false,
    loader: false,
    initval: false,
    isDisabled: false,
    showdeleteDialog: false,
    is_not_latest_version: null,
    approver_comment: "",
    reason_for_reject: "",
    delete_id: "",
    user_details: [],
    dialog: false,
    dialog1: false,
    user: [],
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    headers: [
      {
        title: "License Name",
        align: "left",
        key: "doc_name",
      },
      {
        title: "Expiry Date",
        align: "left",
        key: "doc_date",
      },
      {
        title: "Actions",
        key: "",
        align: "left",
      },
    ],
  }),
  computed: {},
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchuserDetails(this.$route.query.slug);
        }
      },
    },
    user_details: {
      immediate: true,
      handler() {
        if (this.user_details.id > 0) {
          this.fetchTradieVersions();
          this.fetchTradiesurveyFiles(0);
        }
      },
    },
  },
  methods: {
    showversiontooltip(version) {
      var versiondisplay = this.$t("version") + " " + version;
      return versiondisplay;
    },
    gobackrouter() {
      this.$router.go(-1);
    },
    selectversion(id) {
      this.tradie_version_id = id;
      this.fetchTradiesurveyFiles(id);
    },
    EmitLoader(startstoploading) {
      this.loader = startstoploading;
    },
    fetchTradiesurveyFiles(version_id) {
      this.initval = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "fetch_tradiesurvey_files", {
          user_id: this.user_details.id,
          version_id: version_id,
        })
        .then((res) => {
          this.is_not_latest_version = res.data.latest_version;
          this.wizard_version = res.data.wizard_version;
          this.files_uploaded = res.data.files;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },

    fetchTradieVersions() {
      this.loader = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "fetch_tradies_versions", {
          user_id: this.user_details.id,
        })
        .then((res) => {
          this.tradie_versions = res.data.versions;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(" error" + err);
        });
    },

    fetchuserDetails(slug) {
      this.loader = true;
      this.$axios
        .get(process.env.VUE_APP_API_URL_ADMIN + "fetchuserbyslug/" + slug)
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.user_details = res.data.user;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },

    changeStatus(status) {
      if (status == "Rejected") {
        this.dialog = true;
      } else {
        this.dialog1 = true;
      }
      // this.showdeleteDialog = true;
    },
    cancel() {
      this.showdeleteDialog = false;
    },
    confirm() {
      this.formstatusupdateconfirm();
      this.showdeleteDialog = false;
    },
    formstatusupdateconfirm() {
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "change_form_status/", {
          id: this.user_details.header_answers.id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchuserDetails(this.$route.query.slug);
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
    },
    close() {
      this.$refs.form.reset();
      this.dialog = false;
      this.dialog1 = false;
    },
    Submit(status) {
      this.isDisabled = true;
      this.$axios
        .post(process.env.VUE_APP_API_URL_ADMIN + "update_form_status", {
          id: this.user_details.header_answers.id,
          user_id: this.user_details.header_answers.user_id,
          status: status,
          approver_comment: this.approver_comment,
          reason_for_reject: this.reason_for_reject,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.isDisabled = false;
            // console.log(this.$refs.form);
            this.close();
            this.fetchuserDetails(this.$route.query.slug);
            this.$toast.success(this.array_data);
            this.initval = true;
          } else if (res.data.status == "E") {
            this.isDisabled = false;
            this.$toast.error(this.$t("something_went_wrong"));
            this.$refs.form.reset();
          } else {
            this.isDisabled = false;
            this.$refs.form.reset();
            this.$toast.error(this.array_data);
            this.initval = true;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          this.close();
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
/* .v-text-field /deep/ .v-input__slot {
  min-height: 38px !important;
  width: 353px;
} */

.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.userindexcodechip:hover {
  cursor: pointer;
}

.usernamehoverstyle:hover {
  /* cursor: pointer; */
  font-weight: 500;
}

.usernamehoverstyle {
  font-weight: 500;
  color: rgb(71, 174, 110);
}

.delete_icon_size {
  font-size: 20px !important;
}

.left-details {
  min-width: 100px;
  font-weight: 600;
  text-align: initial;
  font-size: 14px;
}

.coming_soon_container {
  min-height: 100px;
}

.date_font {
  font-size: 14px;
}

.field_label {
  font-size: 14px;
}

.profile_container {
  border: 1px solid grey;
  border-radius: 10px;
}

.cancel {
  background-color: rgb(45, 45, 45) !important;
  color: white !important;
}

.checkbox_item /deep/ .v-input__details {
  display: none;
}

.showcurrentversion {
  display: block;
  margin-left: -4px;
  font-size: 11px;
  color: blue;
  font-weight: 600;
}

.activevchip {
  background-color: #66bb6a;
}
</style>