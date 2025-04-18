import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppSidebarProvider } from "@/components/AppSidebar";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import GradeRecognition from "./pages/GradeRecognition";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Scores from "./pages/Scores";
import ExamCenter from "./pages/ExamCenter";
import RoleBasedRoute from "./components/RoleBasedRoute";
import UserManagement from "./pages/UserManagement";
import TeacherManagement from "./pages/TeacherManagement";
import ReportsPage from "./pages/ReportsPage";
import ClassSections from "./pages/ClassSections";
import TeacherAssignment from "./pages/TeacherAssignment";

const queryClient = new QueryClient();

// Component that redirects authenticated users away from login page
const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Refactored App component to use route protection
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public login route that redirects to dashboard if already authenticated */}
      <Route 
        path="/login" 
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        } 
      />
      
      {/* Redirect root path to login or dashboard based on auth status */}
      <Route 
        path="/" 
        element={<Navigate to="/dashboard" replace />}
      />
      
      {/* Protected routes - accessible by all authenticated users */}
      <Route
        path="/dashboard"
        element={
          <RoleBasedRoute>
            <AppSidebarProvider>
              <Dashboard />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      {/* Student routes - accessible based on roles */}
      <Route
        path="/students"
        element={
          <RoleBasedRoute requiredPermissions={['view_assigned_students']}>
            <AppSidebarProvider>
              <Students />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      <Route
        path="/student/:id"
        element={
          <RoleBasedRoute requiredPermissions={['view_assigned_students']}>
            <AppSidebarProvider>
              <StudentView />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      {/* Grade routes */}
      <Route
        path="/grade/:grade"
        element={
          <RoleBasedRoute requiredPermissions={['view_assigned_classes']}>
            <AppSidebarProvider>
              <GradeRecognition />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      {/* Admin-only routes */}
      <Route
        path="/import"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'supervisor']} requiredPermissions={['import_data']}>
            <AppSidebarProvider>
              <Import />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <RoleBasedRoute allowedRoles={['admin']} requiredPermissions={['manage_users']}>
            <AppSidebarProvider>
              <UserManagement />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />

      <Route
        path="/teachers"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'supervisor']} requiredPermissions={['manage_users']}>
            <AppSidebarProvider>
              <TeacherManagement />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      <Route
        path="/class-sections"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'supervisor']} requiredPermissions={['manage_sections']}>
            <AppSidebarProvider>
              <ClassSections />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      {/* Exam and Score routes */}
      <Route
        path="/scores"
        element={
          <RoleBasedRoute requiredPermissions={['view_assigned_students']}>
            <AppSidebarProvider>
              <Scores />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      <Route
        path="/exam-center"
        element={
          <RoleBasedRoute requiredPermissions={['create_exams']}>
            <AppSidebarProvider>
              <ExamCenter />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      {/* Reports route */}
      <Route
        path="/reports"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'supervisor', 'counselor']} requiredPermissions={['view_all_reports']}>
            <AppSidebarProvider>
              <ReportsPage />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      {/* Teacher Assignment route */}
      <Route
        path="/teacher-assignments"
        element={
          <RoleBasedRoute allowedRoles={['admin', 'supervisor']} requiredPermissions={['manage_users']}>
            <AppSidebarProvider>
              <TeacherAssignment />
            </AppSidebarProvider>
          </RoleBasedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main app component with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <AppProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
