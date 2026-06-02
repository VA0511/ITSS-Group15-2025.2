import { ROLES } from "./constants";

export const menus = {
  [ROLES.OWNER]: [
    { title: "layout:menu.overview",        path: "/owner/dashboard", icon: "LayoutDashboard" },
    { title: "layout:menu.rooms",           path: "/owner/rooms",     icon: "Home" },
    { title: "layout:menu.staffs",          path: "/owner/staffs",    icon: "Users" },
    { title: "layout:menu.members",         path: "/owner/members",   icon: "UserCheck" },
    { title: "layout:menu.packages",        path: "/owner/packages",  icon: "Package" },
    { title: "layout:menu.equipment",       path: "/owner/equipment", icon: "Dumbbell" },
    { title: "layout:menu.feedback",        path: "/owner/feedbacks", icon: "MessageSquare" },
    { title: "layout:menu.accounts",        path: "/owner/accounts",  icon: "KeyRound" },
    { title: "layout:menu.reports",         path: "/owner/reports",   icon: "BarChartBig" },
    { title: "layout:menu.profile",         path: "/owner/profile",   icon: "User" },
  ],
  [ROLES.MANAGER]: [
    { title: "layout:menu.overview",        path: "/manager/dashboard",    icon: "LayoutDashboard" },
    { title: "layout:menu.members",         path: "/manager/members",      icon: "Users" },
    { title: "layout:menu.transactions",    path: "/manager/transactions", icon: "CreditCard" },
    { title: "layout:menu.pt_schedule",     path: "/manager/schedule",     icon: "Calendar" },
    { title: "layout:menu.feedback",        path: "/manager/feedbacks",    icon: "MessageSquare" },
    { title: "layout:menu.packages",        path: "/manager/packages",     icon: "Package" },
    { title: "layout:menu.reports",         path: "/manager/report",       icon: "BarChartBig" },
    { title: "layout:menu.profile",         path: "/manager/profile",      icon: "User" },
  ],
  [ROLES.TRAINER]: [
    { title: "layout:menu.profile",           path: "/trainer/profile",      icon: "User" },
    { title: "layout:menu.students",          path: "/trainer/students",     icon: "Users" },
    { title: "layout:menu.teaching_schedule", path: "/trainer/schedule",     icon: "CalendarCheck" },
    { title: "layout:menu.availability",      path: "/trainer/availability", icon: "Settings" },
    { title: "layout:menu.evaluation",        path: "/trainer/evaluation",   icon: "ClipboardList" },
  ],
  [ROLES.MEMBER]: [
    { title: "layout:menu.overview",          path: "/member/dashboard", icon: "LayoutDashboard" },
    { title: "layout:menu.register_package",  path: "/member/register",  icon: "ShoppingCart" },
    { title: "layout:menu.my_package",        path: "/member/my-package",icon: "Package" },
    { title: "layout:menu.training_schedule", path: "/member/schedule",  icon: "Calendar" },
    { title: "layout:menu.renew",             path: "/member/renew",     icon: "CreditCard" },
    { title: "layout:menu.send_feedback",     path: "/member/feedback",  icon: "MessageCircle" },
    { title: "layout:menu.profile",           path: "/member/profile",   icon: "User" },
  ],
};
