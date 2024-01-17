<template>
  <div class="mx-0 mt-3 p-0">
    <page-title
      class="col-md-4 ml-2"
      :heading="$t('tradie_safe_wizard')"
      :google_icon="google_icon"
    ></page-title>
    <content-loader v-if="loader"></content-loader>
    <div style="position: relative">
      <div
        class="px-16"
        v-if="wizardstatus == 'Completed' || wizardstatus == 'Approved'"
      >
        <wizardLastpage></wizardLastpage>
      </div>
      <div v-else-if="wizardstatus == 'Rejected'" style="position: relative">
        <div class="px-16">
          <v-row class="justify-content-center">
            <img
              src="../../../../src/assets/images/wizard_last_page_form.png"
              style="width: 333px"
            />
          </v-row>
          <v-row class="justify-content-center">
            <h2 class="mt-6">{{ $t("form_rejected") }}</h2>
          </v-row>
          <v-row>
            <p class="mt-4 px-4 text-justify">
              Your Form is Rejected Do you wish to Submit again?
            </p>
          </v-row>
          <v-row class="pl-4">
            <div style="display: flex">
              <p v-if="rejectReason">
                <span style="font-size: 16px; font-weight: 500">
                  {{ $t("reason_for_rejection") }} :&nbsp;
                </span>
                <span style="color: darkred">
                  {{ rejectReason }}
                </span>
              </p>
            </div>
          </v-row>
          <v-divider></v-divider>
          <v-row class="mt-8 pb-13">
            <v-tooltip
              :text="this.$t('begin')"
              location="bottom"
              v-if="is_rejected != 'Rejected'"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  @click="countinueWizard"
                  v-bind="props"
                  variant="flat"
                  color="blue"
                  >{{ $t("countinue") }}</v-btn
                >
              </template></v-tooltip
            >
            <v-tooltip :text="this.$t('begin')" location="bottom" v-else>
              <template v-slot:activator="{ props }">
                <v-btn
                  @click="StartWizard"
                  v-bind="props"
                  :disabled="!agreecheck || isBtnLoading"
                  variant="flat"
                  color="blue"
                  >{{ $t("begin") }}
                  <v-progress-circular
                    v-if="isBtnLoading"
                    indeterminate
                    width="1"
                    color="cancel"
                    size="x-small"
                    class="ml-2"
                  ></v-progress-circular>
                </v-btn> </template
            ></v-tooltip>
            <v-spacer></v-spacer>
          </v-row>
        </div>
      </div>
      <div class="px-16" v-else style="position: relative">
        <v-row class="justify-content-center">
          <img
            src="../../../../src/assets/images/wizard_landing_page.png"
            style="width: 333px"
          />
        </v-row>
        <v-row class="justify-content-center">
          <h2 class="mt-6">Begin TradieSafe Wizard</h2>
        </v-row>
        <v-row>
          <p class="mt-4 px-4 text-justify">
            Welcome to the TradieSafe Assessment Wizard. This wizard will take
            you through the process of assessing your WHS compliance. If there
            are any aspects missing or not up to standard you will get to add or
            update the information after we complete the assessment process.
          </p>
          <v-col cols="12" md="8" lg="8" class="text-left">
            <b> Before you start, you'll need the following</b>:
          </v-col>
          <v-col cols="12" md="8" lg="8" class="text-left">
            <v-icon color="primary">mdi-check-circle-outline</v-icon>
            <span class="ml-5">
              A PDF or Picture of your licenses and qualifications.
            </span>
          </v-col>
          <v-col cols="12" md="8" lg="8" class="text-left">
            <v-icon color="primary">mdi-check-circle-outline</v-icon>
            <span class="ml-5"> A PDF or picture of your WHS Policy. </span>
          </v-col>
          <v-col cols="12" md="8" lg="8" class="text-left">
            <v-icon color="primary">mdi-check-circle-outline</v-icon>
            <span class="ml-5">
              A PDF or picture of other Procedures or Policies that may be
              required.
            </span>
          </v-col>
          <v-col cols="12" md="8" lg="8" class="text-left">
            <v-icon color="primary">mdi-check-circle-outline</v-icon>
            <span class="ml-5">
              A PDF or picture of Safe Work Method Statements or SWMS that may
              be required.
            </span>
          </v-col>
          <v-col cols="12" md="12" lg="12" class="text-left">
            <p>
              If you have all of this to hand we estimate that this process will
              take approx. 10-15 minutes.
            </p>
          </v-col>
          <v-col cols="12" md="12" lg="12" class="text-left">
            <!-- terms and conditions dialog starts -->
            <v-row style="position: relative">
              <v-checkbox
                v-model="agreecheck"
                color="primary"
                :readonly="wizard_entry"
              ></v-checkbox>
              <span class="agreementspan text-left">
                <a href="javascript:;" @click="agreefunction()">{{
                  $t("tradie_t_c")
                }}</a>
              </span>
              <v-dialog v-model="dialog" width="800">
                <!-- <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
                  </template> -->
                <v-card>
                  <v-card-title>
                    <span class="text-h5 text-orange">
                      Tradie Safe Platform Terms and Conditions
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <p>
                      Welcome to TradieSafe! We provide a cloud-based platform
                      (<b>Platform</b>) where you can upload and manage your
                      relevant insurances, licences and any other information
                      related to your services. We provide our Platform
                      verification once your documents are approved, improving
                      your ability to receive work from principal contractors.
                    </p>
                    <p>
                      In these Terms, when we say <b>you</b> or <b>your</b>, we
                      mean both you and any entity you are authorised to
                      represent (such as your employer). When we say <b>we</b>,
                      <b>us</b>, or <b>our</b>, we mean Tradiesafe Pty Ltd (ACN
                      653 865 108).
                    </p>
                    <p>
                      These Terms form our contract with you, and set out our
                      obligations as a service provider and your obligations as
                      a customer. You cannot use our Services unless you agree
                      to these Terms.
                    </p>
                    <p>
                      Some capitalised words in these Terms have defined
                      meanings, and each time that word is used in these Terms
                      it has the same meaning. You can find a list of the
                      defined words and their meaning at the end of these Terms.
                    </p>
                    <p>
                      For questions about these Terms, or to get in touch with
                      us, please email: info@tradiesafe.com.au.
                    </p>
                    <p>
                      <i>These Terms were last updated on 24 July 2023.</i>
                    </p>
                    <v-divider></v-divider>
                    <p>
                      Please read these Terms carefully before you accept. We
                      draw your attention to the fact that:
                    </p>
                    <h5 class="text-orange">OUR DISCLOSURES</h5>
                    <ul>
                      <li>
                        we will handle your personal information in accordance
                        with our privacy policy, available at
                        www.tradiesafe.com.au/privacy;
                      </li>
                      <li>
                        subject to your Consumer Law Rights:
                        <ul>
                          <li>
                            (where our Services are not ordinarily acquired for
                            personal, domestic or household use or consumption)
                            in respect of any failure by us to comply with
                            relevant Consumer Law Rights, our Liability is
                            limited (at our discretion) to supplying the
                            Services again or paying the cost of having the
                            Services supplied again;
                          </li>
                          <li>
                            our aggregate liability to you for any Liability
                            arising from or in connection with these Terms will
                            be limited to the amount of any Subscription Fees
                            paid by you to us in respect of the supply of the
                            relevant Services;
                          </li>
                          <li>
                            we will not be liable for Consequential Loss or
                            delays or failures in performance caused or
                            contributed to by an event or circumstance beyond
                            our reasonable control;
                          </li>
                          <li>
                            your Subscription is for the Subscription Period and
                            cannot be cancelled early, except where these Terms
                            are terminated;
                          </li>
                        </ul>
                      </li>
                      <li>
                        at the end of your Subscription Period, your
                        Subscription will automatically renew for the same
                        Subscription Period unless you cancel your Subscription
                        prior to the renewal date;
                      </li>
                      <li>
                        we may amend these Terms at any time, by providing
                        written notice to you, and by clicking “I accept” or
                        continuing to use our Platform after the notice or 30
                        days after notification (whichever date is earlier), you
                        agree to the amended Terms. If you do not agree to the
                        amendment, you may close your Account and cancel your
                        Subscription with effect from the date of the change in
                        these Terms by providing written notice to us. If you
                        cancel your Subscription and have paid Subscription Fees
                        upfront, you will be issued a pro-rata refund based on
                        the portion of the Subscription Period remaining; and
                      </li>
                      <li>
                        where you engage third parties to operate alongside our
                        Services (for example, any third-party software systems
                        you wish to integrate with our Platform), those third
                        parties are independent of us and you are responsible
                        for (meaning we will not be liable for) the goods or
                        services they provide, unless we expressly agree
                        otherwise under clause 2.7.
                      </li>
                    </ul>
                    <p>
                      <b
                        >These Terms do not intend to limit your rights and
                        remedies at law, including any of your Consumer Law
                        Rights.</b
                      >
                    </p>
                    <v-divider></v-divider>
                    <h6 class="text-orange">1. Engagement and Term</h6>
                    <p>
                      1.1 These Terms apply from when you sign up for an
                      Account, until the date on which your Account is
                      terminated in accordance with these Terms. We grant you a
                      right to use our Services for this period of time only
                      (which may be suspended or revoked in accordance with
                      these Terms).
                    </p>
                    <p>
                      1.2 You must be at least 18 years old to use our Platform.
                    </p>
                    <p>
                      1.3 <b>Variations:</b> We may amend these Terms at any
                      time, by providing written notice to you. By clicking “I
                      accept” or continuing to use our Platform after the notice
                      or 30 days after notification (whichever date is earlier),
                      you agree to the amended Terms. If you do not agree to the
                      amendment, you may close your Account and cancel your
                      Subscription with effect from the date of the change in
                      these Terms by providing written notice to us. If you
                      cancel your Subscription:
                    </p>
                    <p>
                      (a) you will no longer be able to access our Services
                      (including our Platform) on and from the date of
                      cancellation; and
                    </p>
                    <p>
                      (b) if you have paid Subscription Fees upfront, you will
                      be issued a pro-rata refund based on the portion of the
                      Subscription Period remaining.
                    </p>
                    <h6 class="text-orange">2. Our Services</h6>
                    <p>2.1 We provide the following services to you:</p>
                    <p>(a) access to our Platform; and</p>
                    <p>
                      (b) access to our troubleshooting support (<b
                        >Support Services</b
                      >),
                    </p>
                    <p>(collectively, our <b>Services</b>).</p>
                    <p>
                      2.2 If you require Support Services, you may request these
                      by getting in touch with us through our Platform.
                    </p>
                    <p>
                      2.3 Unless we agree otherwise, Support Services cannot be
                      used to support any other products or services, and does
                      not include training, installation of software or
                      hardware, software development or the modification,
                      deletion or recovery of data or any on-site services.
                    </p>
                    <p>
                      2.4 Where we require access to your premises or computer
                      systems in order to provide our Services, you agree to
                      provide us with such access free from risk to the safety
                      of our employees and contractors.
                    </p>
                    <p>
                      2.5 Our Services do not constitute, and are not a
                      substitute for, financial, legal or risk management
                      advice.
                    </p>
                    <p>
                      2.6 We will not be responsible for any other services
                      unless expressly set out on in these Terms or on our
                      Platform.
                    </p>
                    <p>
                      2.7 <b>Additional Services:</b> If you require additional
                      services, we may, in our sole discretion, provide such
                      additional services (to be scoped and priced in a separate
                      contract provided by us).
                    </p>
                    <p>
                      2.8 <b>Beta Services:</b> If we provide you with access to
                      any new or beta services, you acknowledge that because of
                      the developmental nature of such services, you use them at
                      your own risk and we have no obligation to maintain or
                      provide error corrections. Any new or beta services we
                      provide you with access to are for evaluation purposes
                      only and not for production use, and we may discontinue
                      those services at any time at our sole discretion.
                    </p>
                    <p>
                      2.9 Third Party Products or Services: Where you engage
                      third parties to operate alongside our Services (for
                      example, any third-party software systems you wish to
                      integrate with our Platform), those third parties are
                      independent of us and you are responsible for (meaning we
                      will not be liable for) the goods or services they
                      provide, unless we expressly agree otherwise under clause
                      2.7.
                    </p>
                    <h6 class="text-orange">3. Account</h6>
                    <p>
                      3.1 You must sign up for an Account in order to access and
                      use our Platform.
                    </p>
                    <p>3.2 While you have an Account with us, you agree to:</p>
                    <p>
                      (a) keep your information up-to-date (and ensure it
                      remains true, accurate and complete);
                    </p>
                    <p>
                      (b) keep usernames and passwords secure and confidential,
                      and protect them from misuse or being stolen; and
                    </p>
                    <p>
                      (c) notify us if you become aware of, or have reason to
                      suspect, any unauthorised access to your Account or any
                      logins linked to your Account.
                    </p>
                    <p>
                      3.3 We may suspend your access to our Services where we
                      reasonably believe there has been any unauthorised access
                      to or use of our Services (such as the unauthorised
                      sharing of login details for our Platform). If we suspend
                      your access to our Services, we will let you know within a
                      reasonable time of doing so, and we will work with you to
                      resolve the matter, or if it cannot be resolved, then we
                      may terminate your Account and your access to our Services
                      will end.
                    </p>
                    <h6 class="text-orange">4. Subscriptions</h6>
                    <p>
                      4.1 Once you have created your Account, you must choose a
                      Subscription.
                    </p>
                    <p>
                      4.2 The Subscriptions we offer will be set out on our
                      Platform, including details of each Subscription’s
                      features and limitations, Subscription Fees and
                      Subscription Periods.
                    </p>
                    <p>
                      4.3 During the Subscription Period, you will be billed for
                      the Subscription Fees on an annual recurring basis, as set
                      out on our Platform (<b>Billing Cycle</b>).
                    </p>
                    <p>
                      4.4 Your Subscription can be upgraded or downgraded at any
                      time. If you require your Subscription to be upgraded or
                      downgraded you are required to notify us at our email for
                      notices (as set out in clause 14.8). Any upgrades to your
                      Subscription will take effect immediately (and you will be
                      charged the difference between your current Subscription
                      and your new Subscription on a pro-rata basis). Any
                      downgrades to your Subscription will take effect from the
                      beginning of the next Subscription Period.
                    </p>
                    <p>
                      4.5 You will be billed for any Subscription Fees due at
                      the beginning of each Billing Cycle. Our payments methods
                      will be set out on our Platform. If you choose to pay your
                      Subscription Fees using one of our third-party payment
                      processors, you may need to accept their terms and
                      conditions (if this is the case, these will be set out on
                      our Platform).
                    </p>
                    <p>
                      4.6 You must not pay, or attempt to pay, any Subscription
                      Fees by fraudulent or unlawful means. If you make payment
                      by debit or credit card, you must be the authorised card
                      holder. If payment is made by direct debit, by providing
                      your bank account details and accepting these Terms, you
                      authorise our nominated third-party payment processor to
                      debit your bank account in accordance with your chosen
                      Subscription, and you confirm that you are either the
                      holder or an authorised signatory of that bank account.
                    </p>
                    <p>
                      4.7 <b>Cancellation:</b> Your Subscription continues for
                      the Subscription Period, and at the end of each
                      Subscription Period, provided you have paid all
                      Subscription Fees owing, your Subscription will be
                      automatically renewed for the same Subscription Period. If
                      you wish to cancel your Subscription, you may do so
                      through your Account. Your cancellation will take effect
                      at the end of your current Subscription Period, and your
                      Subscription will not be renewed. As the Subscription is
                      an annual Subscription, we will provide you with a renewal
                      reminder at least 30 days prior to your Subscription
                      renewing.
                    </p>
                    <p>
                      4.8 <b>Late Payments:</b> If any Subscription Fees are not
                      paid on time, we may:
                    </p>
                    <p>
                      (a) suspend your access our Services (including access to
                      our Platform); and
                    </p>
                    <p>
                      (b) charge interest on any overdue payments at a rate
                      equal to the Reserve Bank of Australia’s cash rate, from
                      time-to-time, plus 2% per annum, calculated daily and
                      compounding monthly.
                    </p>
                    <p>
                      4.9 <b>Taxes:</b> You are responsible for paying any
                      levies or taxes associated with your use of our Services,
                      for example sales taxes, value-added taxes or withholding
                      taxes (unless we are required by law to collect these on
                      your behalf).
                    </p>
                    <h6 class="text-orange">5. Platform Licence</h6>
                    <p>
                      5.1 While you have an Account, we grant you a right to use
                      our Platform (which may be suspended or revoked in
                      accordance with these Terms). This right cannot be passed
                      on or transferred to any other person and, if you have a
                      Subscription, will also be subject to the conditions of
                      your Subscription (as set out on our Platform or in your
                      Account).
                    </p>
                    <p>5.2 You must not:</p>
                    <p>
                      (a) access or use our Platform in any way that is improper
                      or breaches any laws, infringes any person's rights (for
                      example, intellectual property rights and privacy rights),
                      or gives rise to any civil or criminal liability;
                    </p>
                    <p>
                      (b) interfere with or interrupt the supply of our
                      Platform, or any other person’s access to or use of our
                      Platform;
                    </p>
                    <p>
                      (c) introduce any viruses or other malicious software code
                      into our Platform;
                    </p>
                    <p>
                      (d) use any unauthorised or modified version of our
                      Platform, including but not limited to for the purpose of
                      building similar or competitive software or for the
                      purpose of obtaining unauthorised access to our Platform;
                    </p>
                    <p>
                      (e) attempt to access any data or log into any server or
                      account that you are not expressly authorised to access;
                    </p>
                    <p>
                      (f) use our Platform in any way that involves service
                      bureau use, outsourcing, renting, reselling, sublicensing,
                      concurrent use of a single user login, or time-sharing;
                    </p>
                    <p>
                      (g) circumvent user authentication or security of any of
                      our networks, accounts or hosts or those of any third
                      party; or
                    </p>
                    <p>
                      (h) access or use our Platform to transmit, publish or
                      communicate material that is, defamatory, offensive,
                      abusive, indecent, menacing, harassing or unwanted.
                    </p>
                    <h6 class="text-orange">
                      6. Availability, Disruption and Downtime
                    </h6>
                    <p>
                      6.1 While we strive to always make our Services available
                      to you, we do not make any promises that these will be
                      available 100% of the time. Our Services may be disrupted
                      during certain periods, including, for example, as a
                      result of scheduled or emergency maintenance.
                    </p>
                    <p>
                      6.2 Our Services (including our Platform) may interact
                      with, or be reliant on, products or services provided by
                      third parties, such as cloud hosting service providers. To
                      the maximum extent permitted by law, we are not liable for
                      disruptions or downtime caused or contributed to by these
                      third parties.
                    </p>
                    <p>
                      6.3 We will try to provide you with reasonable notice,
                      where possible, of any disruptions to your access to our
                      Services.
                    </p>
                    <h6 class="text-orange">
                      7. Intellectual Property and Data
                    </h6>
                    <p>
                      7.1 We own all intellectual property rights in our
                      Services (including our Platform). This includes how our
                      Platform looks and functions, as well as our copyrighted
                      works, trademarks, inventions, designs and other
                      intellectual property. You agree not to copy or otherwise
                      misuse our intellectual property without our written
                      permission (for example, to reverse engineer or discover
                      the source code of our intellectual property), and you
                      must not alter or remove any confidentiality, copyright or
                      other ownership notice placed on our Platform.
                    </p>
                    <p>
                      7.2 We may use any feedback or suggestions that you give
                      us in any manner which we see fit (for example, to develop
                      new features), and no benefit will be owed to you as a
                      result of any use by us of your feedback or suggestions.
                    </p>
                    <p><b>Your Data</b></p>
                    <p>
                      7.3 We do not own any of Your Data, but when you enter or
                      upload any of Your Data into our Platform, you grant us
                      the right to access, analyse, backup, copy, store,
                      transmit, and otherwise use Your Data while you have an
                      Account with us (and for a reasonable period of time
                      afterwards). We may use Your Data (or disclose it to third
                      party service providers) to:
                    </p>
                    <p>
                      (a) supply our Services to you (for example, to enable you
                      to access and use our Services), and otherwise perform our
                      obligations under these Terms;
                    </p>
                    <p>(b) diagnose problems with our Services;</p>
                    <p>(c) improve, develop and protect our Services;</p>
                    <p>
                      (d) send you information we think may be of interest to
                      you based on your marketing preferences;
                    </p>
                    <p>
                      (e) perform analytics for the purpose of remedying bugs or
                      issues with our Platform; or
                    </p>
                    <p>
                      (f) perform our obligations under these Terms (as
                      reasonably required).
                    </p>
                    <p>
                      7.4 You acknowledge and agree that because of the nature
                      of the internet, the processing and transmission of Your
                      Data by us may occur of various networks, and may be
                      transferred unencrypted.
                    </p>
                    <p>
                      7.5 You are responsible for (meaning we are not liable
                      for):
                    </p>
                    <p>
                      (a) the integrity of Your Data on your systems, networks
                      or any device controlled by you; and
                    </p>
                    <p>(b) backing up Your Data.</p>
                    <p>
                      7.6 When you use our Services, we may create anonymised
                      statistical data from Your Data and usage of our Services
                      (for example, through aggregation). Once anonymised, we
                      own that data and may use it for our own purposes, such as
                      to provide and improve our Services, to develop new
                      services or product offerings, to identify business
                      trends, and for other uses we communicate to you. This may
                      include making such anonymised data publicly available,
                      provided it is not compiled using a sample size small
                      enough to make underlying portions of Your Data
                      identifiable.
                    </p>
                    <p>
                      7.7 If you do not provide Your Data to us, it may impact
                      your ability to receive our Services.
                    </p>
                    <h6 class="text-orange">
                      8. Confidential Information and Personal Information
                    </h6>
                    <p>
                      8.1 While using our Services, you may share confidential
                      information with us, and you may become aware of
                      confidential information about us. You agree not to use
                      our confidential information, and to take reasonable steps
                      to protect our confidential information from being
                      disclosed without our permission, and we agree to do the
                      same for your confidential information. This also means
                      making sure that any employees, contractors, professional
                      advisors or agents of ours or yours only have access to
                      confidential information on a ‘need-to-know basis’ (in
                      other words, the disclosure is absolutely necessary), and
                      that they also agree to not misuse or disclose such
                      confidential information.
                    </p>
                    <p>
                      8.2 However, either you or we may share confidential
                      information with legal or regulatory authorities if
                      required by law to do so.
                    </p>
                    <p>
                      8.3 We collect, hold and disclose and use any Personal
                      Information you provide to us in accordance with our
                      privacy policy, available at
                      www.tradiesafe.com.au/privacy, and applicable privacy
                      laws.
                    </p>
                    <p>
                      8.4 You must only disclose Personal Information to us if
                      you have the right to do so (such as having the
                      individual’s express consent).
                    </p>
                    <p>
                      8.5 We may need to disclose Personal Information to third
                      parties, such as our related companies or our service
                      providers (for example, IT and administrative service
                      providers and our professional advisors).
                    </p>
                    <h6 class="text-orange">9. Consumer Law Rights</h6>
                    <p>
                      9.1 In some jurisdictions, you may have guarantees, rights
                      or other remedies provided by law (<b
                        >Consumer Law Rights</b
                      >), and these Terms do not restrict your Consumer Law
                      Rights. We will only be bound by your Consumer Law Rights
                      and the express wording of these Terms. Our liability for
                      a breach of your Consumer Law Rights is, unless the laws
                      of your jurisdiction state otherwise, limited to either
                      resupplying our Services, or paying the cost of having our
                      Services resupplied.
                    </p>
                    <p>
                      9.2 Subject to your Consumer Law Rights, we do not provide
                      a refund for a change of mind or change in circumstance.
                    </p>
                    <p>
                      9.3 If you accept these Terms in Australia, nothing in
                      these Terms should be interpreted to exclude, restrict or
                      modify the application of, or any rights or remedies you
                      may have under, any part of the Australian Consumer Law
                      (as set out in Schedule 2 of the Competition and Consumer
                      Act 2010 (Cth)).
                    </p>
                    <h6 class="text-orange">10. Liability</h6>
                    <p>
                      10.1 To the maximum extent permitted by law, we will not
                      be liable for, and you release us from liability for, any
                      Liability caused or contributed to by, arising from or in
                      connection with:
                    </p>
                    <p>
                      (a) your computing environment (for example, your
                      hardware, software, information technology and
                      telecommunications services and systems); or
                    </p>
                    <p>
                      (b) any use of our Services by a person or entity other
                      than you.
                    </p>
                    <p>
                      10.2 Regardless of whatever else is stated in these Terms,
                      to the maximum extent permitted by law:
                    </p>
                    <p>
                      (a) neither we or you are liable for any Consequential
                      Loss;
                    </p>
                    <p>
                      (b) a party’s liability for any Liability under these
                      Terms will be reduced proportionately to the extent the
                      relevant Liability was caused or contributed to by the
                      actions (or inactions) of the other party, including any
                      failure by the other party to mitigate its loss;
                    </p>
                    <p>
                      (c) (where our Services are not ordinarily acquired for
                      personal, domestic or household use or consumption) in
                      respect of any failure by us to comply with relevant
                      Consumer Law Rights, our Liability is limited (at our
                      discretion) to supplying the Services again or paying the
                      cost of having the Services supplied again; and
                    </p>
                    <p>
                      (d) our aggregate liability to you for any Liability
                      arising from or in connection with these Terms will be
                      limited to the amount of any Subscription Fees paid by you
                      to us in respect of the supply of the relevant Services to
                      which the Liability relates.
                    </p>
                    <h6 class="text-orange">11. Termination</h6>
                    <p>
                      11.1 We may terminate these Terms (meaning you will lose
                      access to our Services, including access to your Account,
                      and any Subscription will be cancelled) if:
                    </p>
                    <p>
                      (a) you fail to pay your Subscription Fees when they are
                      due;
                    </p>
                    <p>
                      (b) you breach these Terms and do not remedy that breach
                      within 14 days of us notifying you of that breach;
                    </p>
                    <p>
                      (c) you breach these Terms and that breach cannot be
                      remedied; or
                    </p>
                    <p>
                      (d) you experience an insolvency event (including but not
                      limited to bankruptcy, receivership, voluntary
                      administration, liquidation, or entering into creditors’
                      schemes of arrangement).
                    </p>
                    <p>11.2 You may terminate these Terms if:</p>
                    <p>
                      (a) we breach these Terms and do not remedy that breach
                      within 14 days of you notifying us of that breach; or
                    </p>
                    <p>
                      (b) we breach these Terms and that breach cannot be
                      remedied, and
                    </p>
                    <p>
                      if you have paid Subscription Fees upfront, you will be
                      issued a pro-rata refund of any unused Subscription Fees
                      based on the portion of the then-current Subscription
                      Period remaining.
                    </p>
                    <p>
                      11.3 You may also terminate these Terms at any time by
                      notifying us through your Account or to our email for
                      notices (as set out in clause 14.8), and if you have a
                      Subscription, termination will take effect at the end of
                      your current Subscription Period.
                    </p>
                    <p>
                      11.4 Upon termination of these Terms, we will retain Your
                      Data (including copies) as required by law or regulatory
                      requirements.
                    </p>
                    <p>
                      11.5 Termination of these Terms will not affect any other
                      rights or liabilities that we or you may have.
                    </p>
                    <h6 class="text-orange">12. General</h6>
                    <p>
                      12.1 <b>Assignment:</b> You may not transfer or assign
                      these Terms (including any benefits or obligations you
                      have under these Terms) to any third party without our
                      prior written consent. We may assign or transfer these
                      Terms to a third party, or transfer any debt owed by you
                      to us to a debt collector or other third party.
                    </p>
                    <p>
                      12.2 <b>Disputes:</b> Neither we or you may commence court
                      proceedings relating to any dispute, controversy or claim
                      arising from, or in connection with, these Terms
                      (including any question regarding its existence, validity
                      or termination) (Dispute) unless we and you first meet (in
                      good faith) to resolve the Dispute. Nothing in this clause
                      will operate to prevent us or you from seeking urgent
                      injunctive or equitable relief from a court of appropriate
                      jurisdiction.
                    </p>
                    <p>
                      If the Dispute is not resolved at that initial meeting:
                    </p>
                    <p>
                      (a) where you are resident or incorporated in Australia,
                      refer the matter to mediation, administered by the
                      Australian Disputes Centre in accordance with Australian
                      Disputes Centre Guidelines for Commercial Mediation; or
                    </p>
                    <p>
                      (b) where you are not resident or incorporated in
                      Australia, refer the matter to arbitration administered by
                      the Australian Centre for International Commercial
                      Arbitration, with such arbitration to be conducted in
                      Brisbane, Queensland, before one arbitrator, in English
                      and in accordance with the ACICA Arbitration Rules.
                    </p>
                    <p>
                      12.3 <b>Events Outside Our Control:</b> We will not be
                      liable for any delay or failure to perform our obligations
                      (including our Services), if such delay or failure is
                      caused or contributed to by an event or circumstance
                      beyond our reasonable control.
                    </p>
                    <p>
                      12.4 <b>Governing law:</b> These Terms are governed by the
                      laws of Queensland, and any matter relating to these Terms
                      is to be determined exclusively by the courts in
                      Queensland and any courts entitled to hear appeals from
                      those courts.
                    </p>
                    <p>
                      12.5 <b>Illegal Requests:</b> We reserve the right to
                      refuse any request for or in relation to our Services that
                      we deem inappropriate, unethical, unreasonable, illegal or
                      otherwise non-compliant with these Terms.
                    </p>
                    <p>
                      12.6 <b>Marketing:</b> You agree that we may send you
                      electronic communications about our products and services.
                      You may opt-out at any time by using the unsubscribe
                      function in our electronic communications.
                    </p>
                    <p>
                      12.7 <b>Nature of Legal Relationship:</b> These Terms do
                      not create, and should not be interpreted so as to create,
                      a partnership, joint venture, employment or agency
                      relationship between us and you.
                    </p>
                    <p>
                      12.8 <b>Notices:</b> Any notice you send to us must be
                      sent to <b>info@tradiesafe.com.au</b>. Any notice we send
                      to you will be sent to the email address registered
                      against your Account.
                    </p>
                    <p>
                      12.9 <b>Publicity:</b> You agree that, subject to your
                      prior written consent, we may advertise or publicise the
                      fact you are a customer of ours, for example on our
                      website or in our promotional material, and you grant us a
                      right to display and use your logo and branding solely for
                      that purpose.
                    </p>
                    <p>
                      12.10 <b>Survival:</b> Clauses 8 to 13 will survive the
                      termination or expiry of these Terms.
                    </p>
                    <p>
                      12.11 <b>Third Party Sites:</b> Our Platform may contain
                      links to websites operated by third parties. Unless we
                      tell you otherwise, we do not control, endorse or approve,
                      and are not responsible for, the content on those
                      websites. We recommend that you make your own
                      investigations in relation to the suitability of those
                      websites. If you purchase goods or services from a third
                      party website linked from our Platform, those goods or
                      services are being provided by that third party, not us.
                      We may receive a benefit (which may include a referral fee
                      or a commission) should you visit certain third party
                      websites through a link on our Platform, or for featuring
                      certain goods or services on our Platform. We will make it
                      clear by notice to you which (if any) goods or services,
                      or website links, we receive a benefit from by featuring
                      them on our Platform.
                    </p>
                    <h6 class="text-orange">13. Definitions</h6>
                    <p>13.1 In these Terms:</p>
                    <p>
                      <b>Account</b> means an account accessible to the
                      individual or entity who signed up to our Services.
                    </p>
                    <p>
                      <b>Consequential Loss</b> includes any consequential loss,
                      special or indirect loss, real or anticipated loss of
                      profit, loss of benefit, loss of revenue, loss of
                      business, loss of goodwill, loss of opportunity, loss of
                      savings, loss of reputation, loss of use and/or loss or
                      corruption of data, whether under statute, contract,
                      equity, tort (including negligence), indemnity or
                      otherwise. However, your obligation to pay us any amounts
                      for access to or use of our Services (including our
                      Platform) will not constitute “Consequential Loss”.
                    </p>
                    <p>
                      <b>Liability</b> means any expense, cost, liability, loss,
                      damage, claim, notice, entitlement, investigation, demand,
                      proceeding or judgment (whether under statute, contract,
                      equity, tort (including negligence), indemnity or
                      otherwise), howsoever arising, whether direct or indirect
                      and/or whether present, unascertained, future or
                      contingent and whether involving a third party or us or
                      you or otherwise.
                    </p>
                    <p>
                      <b>Personal Information</b> means any information or
                      opinion about an identified individual, or an individual
                      who is reasonably identifiable, whether the information or
                      opinion is true or not, and whether the information or
                      opinion is recorded in a tangible form or not.
                    </p>
                    <p>
                      <b>Platform</b> means our cloud-based platform, available
                      at www.tradiesafe.com.au.
                    </p>
                    <p>
                      <b>Services</b> means the services we provide to you, as
                      detailed in clause 2.1.
                    </p>
                    <p>
                      <b>Subscription</b> means the Subscription plan you have
                      chosen through our Platform, which you use to access
                      certain features and benefits.
                    </p>
                    <p>
                      <b>Subscription Fees</b> means the fees you pay to us to
                      access your chosen Subscription.
                    </p>
                    <p>
                      <b>Subscription Period</b> means the duration of your
                      Subscription (such as monthly, annually, or as otherwise
                      set out on our Platform).
                    </p>
                    <p>
                      <b>Your Data</b> means the information, materials, logos,
                      documents, qualifications and other intellectual property
                      or data supplied by you when receiving our Services or
                      stored by or generated by your use of our Services,
                      including any Personal Information collected, used,
                      disclosed, stored or otherwise handled in connection with
                      our Services. Your Data does not include any data or
                      information that is generated as a result of your usage of
                      our Services that is a back-end or internal output or an
                      output otherwise generally not available to users of our
                      Services.
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="text" @click="disagreeTC()">
                      close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
            <!-- terms and conditions dialog ends -->
            <!-- privacy dialog starts -->
            <v-row style="position: relative" class="mt-0">
              <v-checkbox
                v-model="privacyagree"
                color="primary"
                :readonly="wizard_entry"
              ></v-checkbox>
              <span class="agreementspan text-left">
                I have read and agree with the
                <a href="javascript:;" @click="privacyPolicy()"
                  >Privacy and Data Collection</a
                >. View our
                <a href="javascript:;" @click="privacyAgree()"
                  >Privacy Collection Notice</a
                >
                to learn how we manage your personal information collected via
                the Assessment Wizard
              </span></v-row
            >
            <v-dialog v-model="dialog1" width="800">
              <!-- <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
                  </template> -->
              <v-card>
                <v-card-title>
                  <span class="text-h5 text-orange">
                    TRADIESAFE PTY LTD – PRIVACY COLLECTION NOTICE
                  </span>
                </v-card-title>
                <v-card-text>
                  <p>
                    This Privacy Collection Notice describes how TradieSafe Pty
                    Ltd ABN (21 653 865 108) (we, us or our) collect and handle
                    your personal information when you sign up for our platform
                    or make an enquiry with us. We collect personal information
                    from you so that we can provide our platform to you or
                    respond to your enquiry and for related purposes set out in
                    our Privacy Policy, available at:
                    www.tradiesafe.com.au/privacy.
                  </p>
                  <p>
                    We may disclose this personal information to third parties,
                    including related entities, any third parties engaged by us
                    and acting on our behalf and as otherwise set out in our
                    Privacy Policy (linked above).
                  </p>
                  <p>
                    While we store personal information in Australia, where we
                    disclose your personal information to the third parties
                    listed above, these third parties may store, transfer or
                    access personal information outside of Australia.
                  </p>
                  <p>
                    If you do not provide your personal information to us, it
                    may affect our ability to provide our services to you and
                    your use of our services
                  </p>
                  <p>
                    Please see our Privacy Policy (linked above) for more
                    information about how we collect, store, use and disclose
                    your personal information, including details about overseas
                    disclosure, access, correction, how you can make a
                    privacy-related complaint and our complaint-handling
                    process.
                  </p>
                  <p>
                    If you have questions about our privacy practices, please
                    contact us by email at: info@tradiesafe.com.au. By providing
                    your personal information to us, you agree to the
                    collection, use, storage and disclosure of that information
                    as described in this privacy collection notice.
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" variant="text" @click="disagreePrivacy()">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- privacy dialog ends -->
            <!-- privacy policy dialog starts -->

            <v-dialog v-model="dialog2" width="800">
              <!-- <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> Open Dialog </v-btn>
                  </template> -->
              <v-card>
                <v-card-title>
                  <span class="text-h5 text-orange">
                    TRADIESAFE PTY LTD – PRIVACY POLICY
                  </span>
                </v-card-title>
                <v-card-text>
                  <p>
                    TradieSafe Pty Ltd ABN (21 653 865 108) (<b>we</b>,
                    <b>us</b> or <b>our</b>), understands that protecting your
                    personal information is important. This Privacy Policy sets
                    out our commitment to protecting the privacy of personal
                    information provided to us, or collected by us, when
                    interacting with you.
                  </p>
                  <h6 class="text-orange">The information we collect</h6>
                  <p>
                    Personal information: is information or an opinion, whether
                    true or not and whether recorded in a material form or not,
                    about an individual who is identified or reasonably
                    identifiable.
                  </p>
                  <p>
                    The types of personal information we may collect about you
                    include:
                  </p>
                  <ul>
                    <li>
                      <b>Identity Data</b> including your name, age, profession,
                      and gender.
                    </li>
                    <li>
                      <b>Contact Data</b> including your telephone number,
                      address and email.
                    </li>
                    <li>
                      <b>Financial Data</b> including bank account and payment
                      card details (through our third party payment processor,
                      who stores such information and we do not have access to
                      that information).
                    </li>
                    <li>
                      <b>Transaction Data</b> including details about payments
                      to you from us and from you to us and other details of
                      products and services you have purchased from us or we
                      have purchased from you.
                    </li>
                    <li>
                      <b>Technical and Usage Data</b> when you access any of our
                      websites or platforms, details about your internet
                      protocol (IP) address, login data, browser session and
                      geo-location data, statistics on page views and sessions,
                      device and network information, acquisition sources,
                      search queries and/or browsing behaviour, access and use
                      of our website (including through the use of Internet
                      cookies or analytics), and communications with our
                      website.
                    </li>
                    <li>
                      <b>Profile Data</b> including your username and password
                      for the TradieSafe platform, profile picture, purchases or
                      orders you have made with us, content you post, send
                      receive and share through our platform (including
                      qualifications, licences and any insurance policies you
                      hold), information you have shared with our social media
                      platforms, and support requests you have made.
                    </li>
                    <li>
                      <b>Interaction Data</b> including information you provide
                      to us when you participate in any interactive features,
                      including surveys, contests, promotions, activities or
                      events.
                    </li>
                    <li>
                      <b>Marketing and Communications Data</b> including your
                      preferences in receiving marketing from us and our third
                      parties and your communication preferences.
                    </li>
                    <li>
                      <b>Professional data</b> including where you are a worker
                      of ours or applying for a role with us, your professional
                      history such as your previous positions and professional
                      experience.
                    </li>
                    <li>
                      <b>Sensitive information</b> is a sub-set of personal
                      information that is given a higher level of protection.
                      Sensitive information means information relating to your
                      racial or ethnic origin, political opinions, religion,
                      trade union or other professional associations or
                      memberships, philosophical beliefs, sexual orientation or
                      practices, criminal records, health information or
                      biometric information. We do not actively request
                      sensitive information about you. If at any time we need to
                      collect sensitive information about you, unless otherwise
                      permitted by law, we will first obtain your consent and we
                      will only use it as required or authorised by law.
                    </li>
                  </ul>
                  <h6 class="text-orange">
                    How we collect personal information
                  </h6>
                  <p>
                    We collect personal information in a variety of ways,
                    including:
                  </p>
                  <ul>
                    <li>
                      when you interact directly with us, including
                      face-to-face, over the phone, over email, or online;
                    </li>
                    <li>
                      when you complete a form, such as registering for any
                      events or newsletters, or responding to surveys;
                    </li>
                    <li>when you apply for a job with us; or</li>
                    <li>
                      from third parties, such as details of your use of any
                      website we operate (from our analytics and cookie
                      providers and marketing providers. See the “Cookies”
                      section below for more detail on the use of cookies).
                    </li>
                  </ul>
                  <h6 class="text-orange">
                    Why we collect, hold, use and disclose personal information
                  </h6>
                  <p>
                    <b>Personal information:</b> We collect, hold, use and
                    disclose your personal information for the following
                    purposes:
                  </p>
                  <ul>
                    <li>
                      to enable you to access and use our platform, including to
                      provide you with a login;
                    </li>
                    <li>to do business with you;</li>
                    <li>
                      to contact and communicate with you about our business,
                      including in response to any support requests you lodge
                      with us or other enquiries you make with us;
                    </li>
                    <li>
                      to contact and communicate with you about any enquiries
                      you make with us via any website we operate;
                    </li>
                    <li>
                      for internal record keeping, administrative, invoicing and
                      billing purposes;
                    </li>
                    <li>
                      for analytics (including profiling on our website), market
                      research and business development, including to operate
                      and improve our business, associated applications and
                      associated social media platforms;
                    </li>
                    <li>
                      for advertising and marketing, including to send you
                      promotional information about our events and experiences
                      and information that we consider may be of interest to
                      you;
                    </li>
                    <li>
                      to run promotions, competitions and/or offer additional
                      benefits to you;
                    </li>
                    <li>
                      if you have applied for employment with us, to consider
                      your employment application; and
                    </li>
                    <li>
                      to comply with our legal obligations or if otherwise
                      required or authorised by law.
                    </li>
                  </ul>
                  <h6 class="text-orange">
                    Our disclosures of personal information to third parties
                  </h6>
                  <p>
                    <b>Personal information:</b> We may disclose personal
                    information to:
                  </p>
                  <ul>
                    <li>our employees, contractors and/or related entities;</li>
                    <li>
                      IT service providers, data storage, web-hosting and server
                      providers;
                    </li>
                    <li>marketing or advertising providers;</li>
                    <li>
                      professional advisors, bankers, auditors, our insurers and
                      insurance brokers;
                    </li>
                    <li>payment systems operators or processors;</li>
                    <li>
                      our existing or potential agents or business partners;
                    </li>
                    <li>
                      sponsors or promoters of any promotions or competition we
                      run;
                    </li>
                    <li>
                      anyone to whom our business or assets (or any part of
                      them) are, or may (in good faith) be, transferred;
                    </li>
                    <li>
                      courts, tribunals and regulatory authorities, in the event
                      you fail to pay for goods or services we have provided to
                      you;
                    </li>
                    <li>
                      courts, tribunals, regulatory authorities and law
                      enforcement officers, as required or authorised by law, in
                      connection with any actual or prospective legal
                      proceedings, or in order to establish, exercise or defend
                      our legal rights;
                    </li>
                    <li>
                      third parties to collect and process data, such as
                      analytics providers and cookies; and
                    </li>
                    <li>
                      any other third parties as required or permitted by law,
                      such as where we receive a subpoena.
                    </li>
                  </ul>
                  <p>
                    <b>Google Analytics:</b> We have enabled Google Analytics
                    Advertising Features. We and third-party vendors may use
                    first-party cookies (such as the Google Analytics cookie) or
                    other first-party identifiers, and third-party cookies (such
                    as Google advertising cookies) or other third-party
                    identifiers together. These cookies and identifiers may
                    collect Technical and Usage Data about you.
                  </p>
                  <p>
                    You can opt-out of Google Analytics Advertising Features
                    including using a Google Analytics Opt-out Browser add-on
                    found
                    <a
                      href="https://tools.google.com/dlpage/gaoptout/"
                      target="_blank"
                    >
                      here</a
                    >. To opt-out of personalised ad delivery on the Google
                    content network, please visit Google’s Ads Preferences
                    Manager
                    <a
                      href="https://adssettings.google.com/anonymous?hl=en"
                      target="_blank"
                    >
                      here</a
                    >
                    or if you wish to opt-out permanently even when all cookies
                    are deleted from your browser you can install their plugin
                    <a
                      href="https://support.google.com/My-Ad-Center-Help/answer/12155656?visit_id=638270731211074924-3054041300&rd=1"
                      target="_blank"
                    >
                      here</a
                    >. To opt out of interest-based ads on mobile devices,
                    please follow these instructions for your mobile device: On
                    android open the Google Settings app on your device and
                    select “ads” to control the settings. On iOS devices with
                    iOS 6 and above use Apple’s advertising identifier. To learn
                    more about limiting ad tracking using this identifier, visit
                    the settings menu on your device.
                  </p>
                  <p>
                    To find out how Google uses data when you use third party
                    websites or applications, please see
                    <a
                      href="https://policies.google.com/technologies/partner-sites"
                      target="_blank"
                    >
                      here </a
                    >.
                  </p>
                  <h6 class="text-orange">Overseas disclosure</h6>
                  <p>
                    While we store personal information in Australia, where we
                    disclose your personal information to the third parties
                    listed above, these third parties may store, transfer or
                    access personal information outside of Australia. We will
                    only disclose your personal information overseas in
                    accordance with the Australian Privacy Principles.
                  </p>
                  <h6 class="text-orange">
                    Your rights and controlling your personal information
                  </h6>
                  <p>
                    <b>Your choice:</b> Please read this Privacy Policy
                    carefully. If you provide personal information to us, you
                    understand we will collect, hold, use and disclose your
                    personal information in accordance with this Privacy Policy.
                    You do not have to provide personal information to us,
                    however, if you do not, it may affect our ability to do
                    business with you.
                  </p>
                  <p>
                    <b>Information from third parties:</b> If we receive
                    personal information about you from a third party, we will
                    protect it as set out in this Privacy Policy. If you are a
                    third party providing personal information about somebody
                    else, you represent and warrant that you have such person’s
                    consent to provide the personal information to us.
                  </p>
                  <p>
                    <b>Restrict and unsubscribe:</b> To object to processing for
                    direct marketing/unsubscribe from our email database or
                    opt-out of communications (including marketing
                    communications), please contact us using the details below
                    or opt-out using the opt-out facilities provided in the
                    communication.
                  </p>
                  <p>
                    <b>Access:</b> You may request access to the personal
                    information that we hold about you. An administrative fee
                    may be payable for the provision of such information. Please
                    note, in some situations, we may be legally permitted to
                    withhold access to your personal information. If we cannot
                    provide access to your information, we will advise you as
                    soon as reasonably possible and provide you with the reasons
                    for our refusal and any mechanism available to complain
                    about the refusal. If we can provide access to your
                    information in another form that still meets your needs,
                    then we will take reasonable steps to give you such access.
                  </p>
                  <p>
                    <b>Correction:</b> If you believe that any information we
                    hold about you is inaccurate, out of date, incomplete,
                    irrelevant or misleading, please contact us using the
                    details below. We will take reasonable steps to promptly
                    correct any information found to be inaccurate, out of date,
                    incomplete, irrelevant or misleading. Please note, in some
                    situations, we may be legally permitted to not correct your
                    personal information. If we cannot correct your information,
                    we will advise you as soon as reasonably possible and
                    provide you with the reasons for our refusal and any
                    mechanism available to complain about the refusal.
                  </p>
                  <p>
                    <b>Complaints:</b> If you wish to make a complaint, please
                    contact us using the details below and provide us with full
                    details of the complaint. We will promptly investigate your
                    complaint and respond to you, in writing, setting out the
                    outcome of our investigation and the steps we will take in
                    response to your complaint. If you are not satisfied with
                    our response, you may contact the Office of the Australian
                    Information Commissioner.
                  </p>
                  <h6 class="text-orange">Storage and security</h6>
                  <p>
                    We are committed to ensuring that the personal information
                    we collect is secure. In order to prevent unauthorised
                    access or disclosure, we have put in place suitable
                    physical, electronic and managerial procedures, to safeguard
                    and secure personal information and protect it from misuse,
                    interference, loss and unauthorised access, modification and
                    disclosure.
                  </p>
                  <p>
                    While we are committed to security, we cannot guarantee the
                    security of any information that is transmitted to or by us
                    over the Internet. The transmission and exchange of
                    information is carried out at your own risk.
                  </p>
                  <h6 class="text-orange">Cookies</h6>
                  <p>
                    We may use cookies on our website from time to time. Cookies
                    are text files placed in your computer's browser to store
                    your preferences. Cookies, by themselves, do not tell us
                    your email address or other personally identifiable
                    information. However, they do recognise you when you return
                    to our online website and allow third parties to cause our
                    advertisements to appear on your social media and online
                    media feeds as part of our retargeting campaigns. If and
                    when you choose to provide our online website with personal
                    information, this information may be linked to the data
                    stored in the cookie.
                  </p>
                  <p>
                    You can block cookies by activating the setting on your
                    browser that allows you to refuse the setting of all or some
                    cookies. However, if you use your browser settings to block
                    all cookies (including essential cookies) you may not be
                    able to access all or parts of our website.
                  </p>
                  <h6 class="text-orange">Links to other websites</h6>
                  <p>
                    Our website may contain links to other party’s websites. We
                    do not have any control over those websites and we are not
                    responsible for the protection and privacy of any personal
                    information which you provide whilst visiting those
                    websites. Those websites are not governed by this Privacy
                    Policy.
                  </p>
                  <h6 class="text-orange">Amendments</h6>
                  <p>
                    We may, at any time and at our discretion, vary this Privacy
                    Policy by publishing the amended Privacy Policy on our
                    website. We recommend you check our website regularly to
                    ensure you are aware of our current Privacy Policy.
                  </p>
                  <p>
                    <b> For any questions or notices, please contact us at: </b>
                  </p>
                  <p>TradieSafe Pty Ltd ABN (21 653 865 108)</p>
                  <p>Email: info@legalvision.com.au</p>
                  <p>
                    ©
                    <a href="https://legalvision.com.au/" target="_blank"
                      >LegalVision ILP Pty Ltd</a
                    >
                  </p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red" variant="text" @click="closePrivacy()">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- privacy policy dialog ends -->
          </v-col>
        </v-row>
        <v-row class="mt-11"> <v-divider></v-divider></v-row>
        <v-row class="mt-8 pb-13">
          <v-spacer></v-spacer>

          <v-tooltip
            :text="this.$t('countinue')"
            location="bottom"
            v-if="wizard_entry"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                @click="countinueWizard"
                v-bind="props"
                variant="flat"
                color="blue"
                >{{ $t("countinue") }}</v-btn
              >
            </template></v-tooltip
          >
          <v-tooltip :text="this.$t('begin')" location="bottom" v-else>
            <template v-slot:activator="{ props }">
              <v-btn
                @click="StartWizard"
                v-bind="props"
                :disabled="!agreecheck || !privacyagree || isBtnLoading"
                variant="flat"
                color="blue"
                >{{ $t("begin") }}
                <v-progress-circular
                  v-if="isBtnLoading"
                  indeterminate
                  width="1"
                  color="cancel"
                  size="x-small"
                  class="ml-2"
                ></v-progress-circular>
              </v-btn> </template
          ></v-tooltip>
        </v-row>
      </div>

      <div
        class="row ml-10 pb-9"
        v-if="selectedwizardarray.length > 0"
        v-bind:class="[
          wizardstatus == 'Approved' || wizardstatus == 'Rejected'
            ? ''
            : 'beginformwizardversionrow',
        ]"
      >
        <div
          v-for="(wizard, i) in selectedwizardarray"
          :key="i"
          style="display: contents"
        >
          <v-chip
            @click="showpreviousWizardbtn(wizard.id)"
            class="ma-2"
            style="background-color: #109e18; color: white"
          >
            <v-tooltip
              :text="showversiontooltip(wizard.version)"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props"> {{ $t("v") }} {{ wizard.version }}</span>
              </template>
            </v-tooltip>
          </v-chip>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import wizardLastpage from "./WizardLastPage.vue";
export default {
  components: { PageTitle, wizardLastpage },
  data: () => ({
    agreecheck: false,
    privacyagree: false,
    dialog: false,
    dialog1: false,
    dialog2: false,
    google_icon: {
      icon_name: "steppers",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    loader: false,
    isBtnLoading: false,
    selectedwizardarray: [],
    selectedwizard: "",
    is_rejected: "",
    rejectReason: "",
    wizard_entry: false,
    user: [],
    user_id: "",
    wizardstatus: "",
  }),

  computed: {},

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    if (this.user) {
      this.user_id = this.user.id;
    }
  },

  watch: {
    user_id: {
      immediate: true,
      handler() {
        if (this.user_id > 0) {
          this.CheckWizardBegin();
        }
      },
    },
  },

  methods: {
    disagreeTC() {
      this.dialog = false;
    },
    closePrivacy() {
      this.dialog2 = false;
    },
    agreefunction() {
      // if (this.wizard_entry == false) {
        this.dialog = true;
      //}
    },
    disagreePrivacy() {
      this.dialog1 = false;
    },
    privacyAgree() {
      //if (this.wizard_entry == false) {
        this.dialog1 = true;
     // }
    },
    privacyPolicy() {
      this.dialog2 = true;
    },
    countinueWizard() {
      this.$router.push({
        name: "tradie_questions",
      });
    },
    StartWizard() {
      this.isBtnLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN + "startempwizard/" + this.user_id
        )
        .then((res) => {
          if (res.data.status == "S") {
            this.isBtnLoading = false;
            this.$router.push({
              name: "tradie_questions",
            });
          } else {
            this.isBtnLoading = false;
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.isBtnLoading = false;
        });
    },
    showpreviousWizardbtn(header_id) {
      this.$router.replace({
        name: "tradie_questions",
        query: {
          type: "view",
          header_id: header_id,
        },
      });
    },
    CheckWizardBegin() {
      this.loader = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL_ADMIN +
            "checkempwizardbegin/" +
            this.user_id
        )
        .then((res) => {
          this.is_rejected = res.data.is_rejected;
          if (res.data.status == "START") {
            this.wizardstatus = res.data.wizardstatus;
            this.rejectReason = res.data.lastrejectreason;
            this.selectedwizardarray = res.data.allwizards;
            this.selectedwizardarray.map((ele) => {
              ele["version_name"] = this.$t("version") + " " + ele.version;
            });
            this.loader = false;
            this.agreecheck = true;
            this.privacyagree = true;
            this.wizard_entry = true;
          } else {
            this.loader = false;
            this.wizard_entry = false;
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.loader = false;
        });
    },
    showversiontooltip(version) {
      var versiondisplay = this.$t("version") + " " + version;
      return versiondisplay;
    },
  },
};
</script>
<style scoped>
.agreementspan {
  position: absolute;
  top: 16px;
  left: 40px;
  font-weight: 500;
  font-size: 15px;
}
.beginformwizardversionrow {
  position: absolute;
  bottom: 13px;
  left: 13px;
}
.text-orange {
  color: orangered;
}
</style> 

