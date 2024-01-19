import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";

function guardMyroute(to, from, next) {
  const isAuthenticated = store.getters["auth/authentication"];
  // console.log("inside router.js");
  // console.log(isAuthenticated);

  if (isAuthenticated) {
    next(); // allow to enter route
  } else {
    next("/"); // go to '/login';
  }
}

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
    component: () => import("../components/Cruds/Dashboard/MainDashboard.vue"),
    beforeEnter: guardMyroute,
  },
  // {
  //   path: "/configuration",
  //   name: "configuration",
  //   meta: { layout: "userpages" },
  //   component: () => import("../components/Cruds/Configuration/Index.vue"),
  // },
  {
    path: "/users",
    name: "users",
    component: () => import("../components/Cruds/Users/IndexPage.vue"),
  },
  {
    path: "/user_creation",
    name: "user_creation",
    component: () => import("../components/Cruds/Users/UserAmend.vue"),
  },
  {
    path: "/menus",
    name: "menus",
    component: () => import("../components/Cruds/Menus/IndexPage.vue"),
  },
  {
    path: "/menu_amend",
    name: "menu_amend",
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Menus/MenuAmend.vue"),
  },
  {
    path: "/roles",
    name: "roles",
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Roles/IndexPage.vue"),
  },
  {
    path: "/roles_amend",
    name: "roles_amend",
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Roles/RolesAmend.vue"),
  },
  {
    path: "/roles_menu",
    name: "roles_menu",
    // meta: { layout: "userpages" },
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
    meta: { layout: "userpages" },
    component: () =>
      import("../Admin/UserPages/NavigateInvitation.vue"),
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
  //memberlist
  {
    path: "/memberlist",
    name: "memberlist",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/MemberList/IndexPage.vue"),
  },
  {
    path: "/view-licenses",
    name: "view-licenses",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/MemberList/ViewPage.vue"),
  },
  //frontend user profile page
  {
    path: "/view-my-profile",
    name: "view-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ViewProfile.vue")
  },
  {
    path: "/update-my-profile",
    name: "update-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ProfileAmend.vue")
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
    component: () => import("../components/Cruds/Notification/NotificationIndex.vue"),
  },
  {
    name: "notification_amend",
    path: "/notification_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Notification/NotificationAmend.vue"),
  },
  //tradie submission
  

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
