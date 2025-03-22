
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { AppSidebarProvider } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <AppSidebarProvider>
                  <Index />
                </AppSidebarProvider>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AppSidebarProvider>
                  <Dashboard />
                </AppSidebarProvider>
              }
            />
            <Route
              path="/students"
              element={
                <AppSidebarProvider>
                  <Students />
                </AppSidebarProvider>
              }
            />
            <Route
              path="/student/:id"
              element={
                <AppSidebarProvider>
                  <StudentView />
                </AppSidebarProvider>
              }
            />
            <Route
              path="/import"
              element={
                <AppSidebarProvider>
                  <Import />
                </AppSidebarProvider>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
