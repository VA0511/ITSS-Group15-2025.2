import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import TrainerLayout from '@/components/Layout/TrainerLayout';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import Login from '@/pages/Login/Login';
import OwnerDashboard from '@/pages/Owner/OwnerDashboard';
import MemberList from '@/pages/Owner/MemberManagement/MemberList';
import MemberFormPage from '@/pages/Owner/MemberManagement/MemberForm';
import MemberDetail from '@/pages/Owner/MemberManagement/MemberDetail';
import PackageList from '@/pages/Owner/PackageManagement/PackageList';
import PackageFormPage from '@/pages/Owner/PackageManagement/PackageForm';
import EquipmentList from '@/pages/Owner/EquipmentManagement/EquipmentList';
import EquipmentFormPage from '@/pages/Owner/EquipmentManagement/EquipmentForm';
import StaffList from '@/pages/Owner/StaffManagement/StaffList';
import StaffFormPage from '@/pages/Owner/StaffManagement/StaffForm';
import StaffSalary from '@/pages/Owner/StaffManagement/StaffSalary';
import RoomList from '@/pages/Owner/RoomManagement/RoomList';
import RoomDetail from '@/pages/Owner/RoomManagement/RoomDetail';
import RoomFormPage from '@/pages/Owner/RoomManagement/RoomForm';
import FeedbackList from '@/pages/Owner/FeedbackManagement/FeedbackList';
import AccountList from '@/pages/Owner/AccountManagement/AccountList';
import RevenueReport from '@/pages/Owner/Reports/RevenueReport';

import MemberReport from '@/pages/Owner/Reports/MemberReport';
import StaffPerformanceReport from '@/pages/Owner/Reports/StaffPerformanceReport';
import ReportsOverview from '@/pages/Owner/Reports/ReportsOverview';

import ManagerDashboard from '@/pages/Manager/ManagerDashboard';
import MemberListView from '@/pages/Manager/MemberManagement/MemberListView';
import MemberDetailView from '@/pages/Manager/MemberManagement/MemberDetailView';
import CreateMemberWithAccount from '@/pages/Manager/MemberManagement/CreateMemberWithAccount';
import TransactionsView from '@/pages/Manager/Transactions/TransactionsView';
import ScheduleCalendarView from '@/pages/Manager/Schedule/ScheduleCalendarView';
import FeedbacksView from '@/pages/Manager/FeedbackManagement/FeedbacksView';
import ReportsView from '@/pages/Manager/Reports/ReportsView';
import ManagerPackageList from '@/pages/Manager/PackageManagement/PackageListView';
import ManagerPackageDetail from '@/pages/Manager/PackageManagement/PackageDetail';
import TrainerDashboard from '@/pages/Trainer/TrainerDashboard';
import TrainerProfile from '@/pages/Trainer/TrainerProfile';
import StudentList from '@/pages/Trainer/StudentManagement/StudentList';
import TrackProgress from '@/pages/Trainer/StudentManagement/TrackProgress';
import ScheduleList from '@/pages/Trainer/Schedule/ScheduleList';
import TrainerAvailability from '@/pages/Trainer/Availability/TrainerAvailability';
import EvaluationList from '@/pages/Trainer/Evaluation/EvaluationList';
import MemberDashboard from '@/pages/Member/MemberDashboard';
import PackageInfo from '@/pages/Member/MyPackage/PackageInfo';
import TrainingHistory from '@/pages/Member/MyPackage/TrainingHistory';
import RenewPackage from '@/pages/Member/RenewPackage/RenewPackage';
import PaymentCheckout from '@/pages/Member/RenewPackage/PaymentCheckout';
import RegisterGymPackage from '@/pages/Member/RegisterPackage/RegisterGymPackage';
import RegisterGymPackageCheckout from '@/pages/Member/RegisterPackage/RegisterGymPackageCheckout';
import SendFeedback from '@/pages/Member/Feedback/SendFeedback';
import ProfileInfo from '@/pages/Member/Profile/ProfileInfo';
import EditProfile from '@/pages/Member/Profile/EditProfile';
import ChangePassword from '@/pages/Member/Profile/ChangePassword';
import Schedule from '@/pages/Member/Schedule/Schedule';

export const router = createBrowserRouter([
  // Public Route: Bất kỳ ai cũng vào được (Login, Register)
  {
    path: '/login',
    element: <Login />,
  },
  // Private Routes: Phải có Token JWT (Bọc bởi PrivateRoute)

  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      // 1. Nếu gõ / thay vì /owner thì đá tự động về dashboard
      {
        path: '/',
        element: <Navigate to="/member/dashboard" replace />,
      },
      // 2. Trainer Area - SEPARATE LAYOUT (Not inside MainLayout)
      {
        path: 'trainer',
        element: <TrainerLayout />,
        children: [
          {
            path: '',
            element: <RoleBasedRoute allowedRoles={['trainer']} />,
            children: [
              { path: 'profile', element: <TrainerProfile /> },
              { path: 'dashboard', element: <TrainerDashboard /> },
              { path: 'students', element: <StudentList /> },
              { path: 'students/:id/progress', element: <TrackProgress /> },
              { path: 'schedule', element: <ScheduleList /> },
              { path: 'availability', element: <TrainerAvailability /> },
              { path: 'evaluation', element: <EvaluationList /> }
            ]
          }
        ]
      },
      // 3. Other Roles - Use MainLayout
      {
        element: <MainLayout />,
        children: [
          // Member Dashboard
          {
            path: 'member',
            element: <RoleBasedRoute allowedRoles={['member', 'owner', 'manager']} />,
            children: [
              { path: 'dashboard', element: <MemberDashboard /> },
              { path: 'schedule', element: <Schedule /> },
              { path: 'my-package', element: <PackageInfo /> },
              { path: 'history', element: <TrainingHistory /> },
              { path: 'register', element: <RegisterGymPackage /> },
              { path: 'register/checkout', element: <RegisterGymPackageCheckout /> },
              { path: 'renew', element: <RenewPackage /> },
              { path: 'renew/checkout', element: <PaymentCheckout /> },
              { path: 'feedback', element: <SendFeedback /> },
              { path: 'profile', element: <ProfileInfo /> },
              { path: 'profile/edit', element: <EditProfile /> },
              { path: 'change-password', element: <ChangePassword /> }
            ]
          },
          // System Owner Area
          {
            path: 'owner',
            element: <RoleBasedRoute allowedRoles={['owner']} />,
            children: [
              { path: 'dashboard', element: <OwnerDashboard /> },
              { path: 'members', element: <MemberList /> },
              { path: 'members/create', element: <MemberFormPage /> },
              { path: 'members/:id', element: <MemberDetail /> },
              { path: 'members/:id/edit', element: <MemberFormPage /> },
              { path: 'packages', element: <PackageList /> },
              { path: 'packages/create', element: <PackageFormPage /> },
              { path: 'packages/:id/edit', element: <PackageFormPage /> },
              { path: 'equipment', element: <EquipmentList /> },
              { path: 'equipment/create', element: <EquipmentFormPage /> },
              { path: 'equipment/:id/edit', element: <EquipmentFormPage /> },
              { path: 'staffs', element: <StaffList /> },
              { path: 'staffs/create', element: <StaffFormPage /> },
              { path: 'staffs/:id/edit', element: <StaffFormPage /> },
              { path: 'staffs/:id/salary', element: <StaffSalary /> },
              { path: 'rooms', element: <RoomList /> },
              { path: 'rooms/create', element: <RoomFormPage /> },
              { path: 'rooms/:id', element: <RoomDetail /> },
              { path: 'rooms/:id/edit', element: <RoomFormPage /> },
              { path: 'feedbacks', element: <FeedbackList /> },
              { path: 'accounts', element: <AccountList /> },
              { path: 'reports', element: <ReportsOverview /> },
              { path: 'reports/revenue', element: <RevenueReport /> },
              { path: 'reports/members', element: <MemberReport /> },
              { path: 'reports/staff', element: <StaffPerformanceReport /> }
            ]
          },
          // Manager Area
          {
            path: 'manager',
            element: <RoleBasedRoute allowedRoles={['manager', 'owner']} />,
            children: [
              { path: 'dashboard', element: <ManagerDashboard /> },
              // Members Management
              { path: 'members', element: <MemberListView /> },
              { path: 'members/create-with-account', element: <CreateMemberWithAccount /> },
              { path: 'members/:id', element: <MemberDetailView /> },
              // Transactions
              { path: 'transactions', element: <TransactionsView /> },
              // Schedule
              { path: 'schedule', element: <ScheduleCalendarView /> },
              // Feedbacks
              { path: 'feedbacks', element: <FeedbacksView /> },
              // Reports
              { path: 'report', element: <ReportsView /> },
              // Packages (View Only)
              { path: 'packages', element: <ManagerPackageList /> },
              { path: 'packages/:id', element: <ManagerPackageDetail /> }
            ]
          }
        ]
      }
    ]
  },

  // 404 Not Found Handle
  {
    path: '*',
    element: (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Trang bạn tìm không tồn tại</p>
      </div>
    ),
  }
]);
