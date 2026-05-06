import { ROLES } from "./constants";

export const menus = {
  [ROLES.OWNER]: [
    { title: "Tổng quan", path: "/owner/dashboard", icon: "LayoutDashboard" },
    { title: "Phòng tập", path: "/owner/rooms", icon: "Home" },
    { title: "Nhân sự", path: "/owner/staffs", icon: "Users" },
    { title: "Hội viên", path: "/owner/members", icon: "UserCheck" },
    { title: "Gói tập", path: "/owner/packages", icon: "Package" },
    { title: "Thiết bị", path: "/owner/equipment", icon: "Dumbbell" },
    { title: "Phản hồi", path: "/owner/feedbacks", icon: "MessageSquare" },
    { title: "Tài khoản", path: "/owner/accounts", icon: "KeyRound" },
    { title: "Báo cáo", path: "/owner/reports", icon: "BarChartBig" },
  ],
  [ROLES.MANAGER]: [
    { title: "Tổng quan", path: "/manager/dashboard", icon: "LayoutDashboard" },
    { title: "Hội viên", path: "/manager/members", icon: "Users" },
    { title: "Giao dịch", path: "/manager/transactions", icon: "CreditCard" },
    { title: "Lịch PT", path: "/manager/schedule", icon: "Calendar" },
    { title: "Phản hồi", path: "/manager/feedbacks", icon: "MessageSquare" },
    { title: "Báo cáo", path: "/manager/report", icon: "BarChartBig" },
    { title: "Gói tập", path: "/manager/packages", icon: "Package" },
  ],
  [ROLES.TRAINER]: [
    { title: "Thông tin cá nhân", path: "/trainer/profile", icon: "User" },
    { title: "Học viên", path: "/trainer/students", icon: "Users" },
    { title: "Lịch dạy", path: "/trainer/schedule", icon: "CalendarCheck" },
    { title: "Thiết lập lịch", path: "/trainer/availability", icon: "Settings" },
    { title: "Đánh giá buổi tập", path: "/trainer/evaluation", icon: "ClipboardList" }
  ],
  [ROLES.MEMBER]: [
    { title: "Tổng quan", path: "/member/dashboard", icon: "LayoutDashboard" },
    { title: "Đăng ký gói tập mới", path: "/member/register", icon: "ShoppingCart" },
    { title: "Gói tập của tôi", path: "/member/my-package", icon: "Package" },
    { title: "Lịch tập", path: "/member/schedule", icon: "Calendar" },
    { title: "Gia hạn", path: "/member/renew", icon: "CreditCard" },
    { title: "Gửi phản hồi", path: "/member/feedback", icon: "MessageCircle" },
    { title: "Hồ sơ cá nhân", path: "/member/profile", icon: "User" },
  ],
};
