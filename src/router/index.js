import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/:lang?/",
    name: "login",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/LoginPage.vue"),
  },
  {
    path: "/:lang?/forgot_password",
    name: "forgot_password",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/ForgotPassword.vue"),
  },
  {
    path: "/:lang?/reset_password_form/:email?&:name?",
    name: "reset_password_form",
    component: () => import("../Admin/UserPages/ResetPasswordForm.vue"),
    meta: { layout: "userpages" },
  },
  // reset password from profile section
  {
    name: "reset_password",
    path: "/:lang?/reset_password",
    beforeEnter: guardMyroute,
    component: () => import("../Admin/UserPages/ResetPassword.vue"),
  },
  {
    path: "/:lang?/dashboard",
    name: "dashboard",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Dashboard/MainDashboard.vue"),
  },
  {
    path: "/:lang?/users",
    name: "users",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/IndexPage.vue"),
  },
  {
    path: "/:lang?/user_creation",
    name: "user_creation",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/UserAmend.vue"),
  },
  {
    path: "/:lang?/menus",
    name: "menus",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Menus/IndexPage.vue"),
  },
  {
    path: "/:lang?/menu_amend",
    name: "menu_amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Menus/MenuAmend.vue"),
  },
  {
    path: "/:lang?/roles",
    name: "roles",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/IndexPage.vue"),
  },
  {
    path: "/:lang?/roles_amend/:slug?",
    name: "roles_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesAmend.vue"),
  },
  {
    path: "/:lang?/roles_menu",
    name: "roles_menu",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesMenu.vue"),
  },

  //system parameters
  {
    path: "/:lang?/system_parameter",
    name: "system_parameter",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/SystemParameter/SystemParameterIndex.vue"),
  },
  {
    path: "/:lang?/system_parameter_amend",
    name: "system_parameter_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/SystemParameter/SystemParameterAmend.vue"),
  },
  //lookup
  {
    path: "/:lang?/lookups",
    name: "lookups",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Lookups/LookupsIndex.vue"),
  },
  {
    path: "/:lang?/lookups_amend",
    name: "lookups_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Lookups/LookupsAmend.vue"),
  },
  {
    path: "/:lang?/child_lookup",
    name: "child_lookup",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Lookups/ChildLookupsIndex.vue"),
  },
  {
    path: "/:lang?/child_lookups_amend",
    name: "child_lookups_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Lookups/ChildLookupsAmend.vue"),
  },

  //email template
  {
    path: "/:lang?/email_template",
    name: "email_template",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/EmailTemplates/EmailTemplateIndex.vue"),
  },
  {
    path: "/:lang?/email_template_amend",
    name: "email_template_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/EmailTemplates/EmailTemplateAmend.vue"),
  },

  {
    path: "/:lang?/navigate_invite",
    name: "navigate_invite",
    beforeEnter: guardMyroute,
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/NavigateInvitation.vue"),
  },

  //countries
  {
    name: "countries",
    path: "/:lang?/countries",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CountriesIndex.vue"),
  },
  {
    name: "countries_amend",
    path: "/:lang?/countries_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CountriesAmend.vue"),
  },
  //states
  {
    name: "states",
    path: "/:lang?/states",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/StatesIndex.vue"),
  },
  {
    name: "states_amend",
    path: "/:lang?/states_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/StatesAmend.vue"),
  },
  //cities
  {
    name: "cities",
    path: "/:lang?/cities",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CitiesIndex.vue"),
  },
  {
    name: "cities_amend",
    path: "/:lang?/cities_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CitiesAmend.vue"),
  },
  //registration

  {
    path: "/:lang?/register_user",
    name: "register_user",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/RegisterUser.vue"),
  },
  {
    path: "/:lang?/register",
    name: "register",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/OtpValidation.vue"),
  },
  //memberlist
  {
    path: "/:lang?/memberlist",
    name: "memberlist",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/MemberList/IndexPage.vue"),
  },
  {
    path: "/:lang?/view-licenses",
    name: "view-licenses",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/MemberList/ViewPage.vue"),
  },
  //frontend user profile page
  {
    path: "/:lang?/view-my-profile",
    name: "view-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ViewProfile.vue"),
  },
  {
    path: "/:lang?/update-my-profile",
    name: "update-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ProfileAmend.vue"),
  },
  //Activity Log
  {
    name: "activity_log",
    path: "/:lang?/activity_log",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ActivityLog/ActivityLog.vue"),
  },
  //Notification
  {
    name: "notification",
    path: "/:lang?/notification",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Notification/NotificationIndex.vue"),
  },
  {
    name: "notification_amend",
    path: "/:lang?/notification_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Notification/NotificationAmend.vue"),
  },
  {
    name: "career_amend",
    path: "/:lang?/career_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Careers/CareerAmend.vue"),
  },
  {
    name: "careers",
    path: "/:lang?/careers",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Careers/IndexPage.vue"),
  },
  {
    path: "/:lang?/careers-review",
    name: "careers-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Careers/ReviewCareer.vue"),
  },
  {
    name: "promotions_amend",
    path: "/:lang?/promotions_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Promotions_Offers/PromotionsAmend.vue"),
  },
  {
    name: "events",
    path: "/:lang?/events",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Events/IndexPage.vue"),
  },
  {
    name: "events_amend",
    path: "/:lang?/events_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Events/EventsAmend.vue"),
  },
  {
    path: "/:lang?/events-review",
    name: "events-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Events/ReviewEvents.vue"),
  },
  {
    name: "products",
    path: "/:lang?/products",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Products/IndexPage.vue"),
  },
  {
    name: "products_amend",
    path: "/:lang?/products_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Products/ProductsAmend.vue"),
  },
  {
    name: "promotions_offers",
    path: "/:lang?/promotions_offers",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Promotions_Offers/IndexPage.vue"),
  },
  {
    path: "/:lang?/promotions-review",
    name: "promotions-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Promotions_Offers/ReviewPromotions.vue"),
  },
  //Mall Timings
  {
    path: "/:lang?/mall-timings",
    name: "mall-timings",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/MallTimings/IndexPage.vue"),
  },
  {
    path: "/:lang?/mall-timings-amend",
    name: "mall-timings-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () =>
      import("../components/Cruds/MallTimings/MallTimingsAmend.vue"),
  },
  // E-Magazine
  {
    path: "/:lang?/e-magazine",
    name: "e-magazine",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/EMagazine/IndexPage.vue"),
  },
  {
    path: "/:lang?/e-magazine-amend",
    name: "e-magazine-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/EMagazine/EMagazineAmend.vue"),
  },
  {
    path: "/:lang?/e-magazine-review",
    name: "e-magazine-review",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/EMagazine/ReviewEMagazine.vue"),
  },
  // Reviews & Testimonials
  {
    path: "/:lang?/reviews-testimonials",
    name: "reviews-testimonials",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Testimonials/IndexPage.vue"),
  },
  // Stores
  {
    path: "/:lang?/stores",
    name: "stores",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Stores/IndexPage.vue"),
  },
  {
    path: "/:lang?/stores-amend",
    name: "stores-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Stores/StoresAmend.vue"),
  },
  {
    path: "/:lang?/stores-review",
    name: "stores-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Stores/ReviewStores.vue"),
  },
  //categories
  {
    path: "/:lang?/categories",
    name: "categories",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Category/IndexPage.vue"),
  },
  {
    path: "/:lang?/categories-amend",
    name: "categories-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Category/CategoryAmend.vue"),
  },
  {
    path: "/:lang?/home-sliders",
    name: "home-sliders",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/HomeSlider/IndexPage.vue"),
  },
  {
    path: "/:lang?/home-slider-amend",
    name: "home-slider-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/HomeSlider/HomeSliderAmend.vue"),
  },
  {
    path: "/:lang?/home-slider-review",
    name: "home-slider-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/HomeSlider/ReviewSlider.vue"),
  },
  {
    path: "/:lang?/categories-review",
    name: "categories-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Category/ReviewCategory.vue"),
  },
  {
    path: "/:lang?/store-timings",
    name: "store-timings",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/StoreTimings/IndexPage.vue"),
  },
  {
    path: "/:lang?/store-timing-amend",
    name: "store-timing-amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/StoreTimings/StoreTimingAmend.vue"),
  },
  {
    path: "/:lang?/store-timing-review",
    name: "store-timing-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/StoreTimings/ReviewStoreTiming.vue"),
  },
  {
    path: "/:lang?/products-review",
    name: "products-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Products/ReviewProducts.vue"),
  },

  //
  {
    path: "/:lang?/customer-newsletter",
    name: "customer-newsletter",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/CustomerNewsletter/IndexPage.vue"),
  },

  //MyStores
    // Stores
    {
      path: "/:lang?/my_stores",
      name: "my_stores",
      beforeEnter: guardMyroute,
      // meta: { layout: "userpages" },
      component: () => import("../components/Cruds/MyStores/IndexPage.vue"),
    },
   
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// var isAuthenticated = store.getters["auth/authentication"];

router.beforeEach((to, from, next) => {
  const lang = localStorage.getItem("pref_lang") || "en";
  const isAuthenticated = store.getters["auth/authentication"];
  if (!to.params.lang) {
    if (isAuthenticated || to.name === "login") {
      if (!to.redirectedFrom) {
        const redirectpath = "/" + lang + to.path;
        next({
          path: redirectpath,
          query: to.query,
        });
      } else {
        const redirectpathlogin = "/" + lang + to.redirectedFrom.fullPath;
        next({ path: redirectpathlogin });
        // next({ path: `/${lang}${to.fullPath}` });
      }
    } else {
      next({ path: "/" });
    }
  } else {
    next();
  }
});

function guardMyroute(to, from, next) {
  const isAuthenticated = store.getters["auth/authentication"];
  if (isAuthenticated) {
    next();
  } else {
    next({ path: "/" });
  }
}

export default router;
