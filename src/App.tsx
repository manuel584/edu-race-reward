
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppSidebarProvider } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

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
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppSidebarProvider>
              <Dashboard />
            </AppSidebarProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <AppSidebarProvider>
              <Students />
            </AppSidebarProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/:id"
        element={
          <ProtectedRoute>
            <AppSidebarProvider>
              <StudentView />
            </AppSidebarProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/import"
        element={
          <ProtectedRoute>
            <AppSidebarProvider>
              <Import />
            </AppSidebarProvider>
          </ProtectedRoute>
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
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
