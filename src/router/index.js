import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "login",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/LoginPage.vue"),
  },
  {
    path: "/forgot_password",
    name: "forgot_password",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/ForgotPassword.vue"),
  },
  {
    path: "/set_password",
    name: "set_password",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/SetPassword.vue"),
  },
  {
    path: "/reset_password_form/:email?&:name?",
    name: "reset_password_form",
    component: () => import("../Admin/UserPages/ResetPasswordForm.vue"),
    meta: { layout: "userpages" },
  },
  // reset password from profile section
  {
    name: "reset_password",
    path: "/reset_password",
    beforeEnter: guardMyroute,
    component: () => import("../Admin/UserPages/ResetPassword.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: { requiresAuth: true },
    component: () => import("../components/Cruds/Dashboard/MainDashboard.vue"),
  },
  {
    path: "/users",
    name: "users",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/IndexPage.vue"),
  },
  {
    path: "/user_creation",
    name: "user_creation",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/UserAmend.vue"),
  },
  {
    path: "/menus",
    name: "menus",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Menus/IndexPage.vue"),
  },
  {
    path: "/menu_amend",
    name: "menu_amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Menus/MenuAmend.vue"),
  },
  {
    path: "/roles",
    name: "roles",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/IndexPage.vue"),
  },
  {
    path: "/roles_amend/:slug?",
    name: "roles_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesAmend.vue"),
  },
  {
    path: "/roles_menu",
    name: "roles_menu",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesMenu.vue"),
  },

  //system parameters
  {
    path: "/system_parameter",
    name: "system_parameter",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/SystemParameter/SystemParameterIndex.vue"),
  },
  {
    path: "/system_parameter_amend",
    name: "system_parameter_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/SystemParameter/SystemParameterAmend.vue"),
  },
  //lookup
  {
    path: "/lookups",
    name: "lookups",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Lookups/LookupsIndex.vue"),
  },
  {
    path: "/lookups_amend",
    name: "lookups_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Lookups/LookupsAmend.vue"),
  },
  {
    path: "/child_lookup",
    name: "child_lookup",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Lookups/ChildLookupsIndex.vue"),
  },
  {
    path: "/child_lookups_amend",
    name: "child_lookups_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Lookups/ChildLookupsAmend.vue"),
  },

  //email template
  {
    path: "/email_template",
    name: "email_template",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/EmailTemplates/EmailTemplateIndex.vue"),
  },
  {
    path: "/email_template_amend",
    name: "email_template_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/EmailTemplates/EmailTemplateAmend.vue"),
  },

  {
    path: "/navigate_invite",
    name: "navigate_invite",
    beforeEnter: guardMyroute,
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/NavigateInvitation.vue"),
  },

  //countries
  {
    name: "countries",
    path: "/countries",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CountriesIndex.vue"),
  },
  {
    name: "countries_amend",
    path: "/countries_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CountriesAmend.vue"),
  },
  //states
  {
    name: "states",
    path: "/states",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/StatesIndex.vue"),
  },
  {
    name: "states_amend",
    path: "/states_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/StatesAmend.vue"),
  },
  //cities
  {
    name: "cities",
    path: "/cities",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CitiesIndex.vue"),
  },
  {
    name: "cities_amend",
    path: "/cities_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CitiesAmend.vue"),
  },
  //registration

  {
    path: "/register_user",
    name: "register_user",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/RegisterUser.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/OtpValidation.vue"),
  },
 
  //frontend user profile page
  {
    path: "/view-my-profile",
    name: "view-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ViewProfile.vue"),
  },
  {
    path: "/update-my-profile",
    name: "update-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ProfileAmend.vue"),
  },
  //Activity Log
  {
    name: "activity_log",
    path: "/activity_log",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ActivityLog/ActivityLog.vue"),
  },
  //Notification
  {
    name: "notification",
    path: "/notification",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Notification/NotificationIndex.vue"),
  },
  {
    name: "notification_amend",
    path: "/notification_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Notification/NotificationAmend.vue"),
  },
  {
    name: "career_amend",
    path: "/career_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Careers/CareerAmend.vue"),
  },
  {
    name: "careers",
    path: "/careers",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Careers/IndexPage.vue"),
  },
  {
    path: "/careers-review",
    name: "careers-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Careers/ReviewCareer.vue"),
  },
  {
    name: "promotions_amend",
    path: "/promotions_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Promotions_Offers/PromotionsAmend.vue"),
  },
  {
    name: "events",
    path: "/events",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Events/IndexPage.vue"),
  },
  {
    name: "events_amend",
    path: "/events_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Events/EventsAmend.vue"),
  },
  {
    path: "/events-review",
    name: "events-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Events/ReviewEvents.vue"),
  },
  {
    name: "products",
    path: "/products",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Products/IndexPage.vue"),
  },
  {
    name: "products_amend",
    path: "/products_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Products/ProductsAmend.vue"),
  },
  {
    name: "promotions_offers",
    path: "/promotions_offers",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Promotions_Offers/IndexPage.vue"),
  },
  {
    path: "/promotions-review",
    name: "promotions-review",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Promotions_Offers/ReviewPromotions.vue"),
  },
  //Mall Timings
  {
    path: "/mall-timings",
    name: "mall-timings",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/MallTimings/IndexPage.vue"),
  },
  {
    path: "/mall-timings-amend",
    name: "mall-timings-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () =>
      import("../components/Cruds/MallTimings/MallTimingsAmend.vue"),
  },
  // E-Magazine
  {
    path: "/e-magazine",
    name: "e-magazine",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/EMagazine/IndexPage.vue"),
  },
  {
    path: "/e-magazine-amend",
    name: "e-magazine-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/EMagazine/EMagazineAmend.vue"),
  },
  {
    path: "/e-magazine-review",
    name: "e-magazine-review",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () =>
      import("../components/Cruds/EMagazine/ReviewEMagazine.vue"),
  },
  // Reviews & Testimonials
  {
    path: "/reviews-testimonials",
    name: "reviews-testimonials",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Testimonials/IndexPage.vue"),
  },
  {
    path: "/view-reviews",
    name: "view-reviews",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Testimonials/ViewReviews.vue"),
  },
  // Stores
  {
    path: "/stores",
    name: "stores",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Stores/IndexPage.vue"),
  },
  {
    path: "/stores-amend",
    name: "stores-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Stores/StoresAmend.vue"),
  },
  {
    path: "/stores-review",
    name: "stores-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Stores/ReviewStores.vue"),
  },
  //categories
  {
    path: "/categories",
    name: "categories",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Category/IndexPage.vue"),
  },
  {
    path: "/categories-amend",
    name: "categories-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Category/CategoryAmend.vue"),
  },
  {
    path: "/home-sliders",
    name: "home-sliders",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/HomeSlider/IndexPage.vue"),
  },
  {
    path: "/home-slider-amend",
    name: "home-slider-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () =>
      import("../components/Cruds/HomeSlider/HomeSliderAmend.vue"),
  },
  {
    path: "/home-slider-review",
    name: "home-slider-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/HomeSlider/ReviewSlider.vue"),
  },
  {
    path: "/categories-review",
    name: "categories-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Category/ReviewCategory.vue"),
  },
  {
    path: "/store-timings",
    name: "store-timings",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/StoreTimings/IndexPage.vue"),
  },
  {
    path: "/store-timing-amend",
    name: "store-timing-amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/StoreTimings/StoreTimingAmend.vue"),
  },
  
  {
    path: "/store-timing-review",
    name: "store-timing-review",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/StoreTimings/ReviewStoreTiming.vue"),
  },
  {
    path: "/products-review",
    name: "products-review",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Products/ReviewProducts.vue"),
  },

  //
  {
    path: "/customer-newsletter",
    name: "customer-newsletter",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () =>
      import("../components/Cruds/CustomerNewsletter/IndexPage.vue"),
  },

  //MyStores
  {
    path: "/my_stores",
    name: "my_stores",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/MyStores/IndexPage.vue"),
  },

  {
    path: "/preview_webapp/:page?",
    name: "preview_webapp",
    beforeEnter: guardMyroute,
    meta: { layout: "userpages" },
    component: () => import("../components/CustomComponents/PreviewWebapp.vue"),
  },

  //Page Builder
  {
    path: "/page-builder",
    name: "page-builder",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/PageBuilder/IndexPage.vue"),
  },
  {
    path: "/page-builder-amend",
    name: "page-builder-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () =>
      import("../components/Cruds/PageBuilder/PageBuilderAmend.vue"),
  },
  {
    path: "/page-builder-review",
    name: "page-builder-review",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/PageBuilder/ReviewPageBuilder.vue"),
  },
  {
    name: "not-found",
    path: "/not-found",
    meta: { layout: "userpages" },
    component: () => import("../../src/components/PageNotFound.vue"),
  },
  {
    path: "/store-code",
    name: "store-code",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/StoreCode/IndexPage.vue"),
  },
  {
    path: "/store-code-amend",
    name: "store-code-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/StoreCode/StoreCodeAmend.vue"),
  },
  {
    path: "/leasing",
    name: "leasing",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Leasing/IndexPage.vue"),
  },
  {
    path: "/leasing-amend",
    name: "leasing-amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Leasing/LeasingAmend.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// var isAuthenticated = store.getters["auth/authentication"];
router.beforeEach((to, from, next) => {
  console.log('to');
  console.log(to);
  const isAuthenticated = store.getters["auth/authentication"];
  // const isAuthenticated=true;
  console.log("isAuthenticated", isAuthenticated, "to.name:", to.name);
  if (to.matched.length === 0) {
    next("/not-found");
    return;
  }

  // Redirect logged in users from login/register to dashboard
  if (isAuthenticated && ["login", "register", "forgot_password"].includes(to.name)) {
    next({ name: "dashboard" });
    return;
  }

  // Protect routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
    return;
  }

  next();
});




function guardMyroute(to, from, next) {
  const isAuthenticated = store.getters["auth/authentication"];
  if (isAuthenticated) next();
  else next({ name: "login" });
}


export default router;
