import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/loading';

const Login = lazy(() => import('@/pages/Login'));
const Home = lazy(() => import('@/pages/Home'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('@/pages/TeacherDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));

const RoleBasedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return <Navigate to="/unauthorized" />;
};

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const routes = [
    {
      path: '/',
      element: isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />,
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/home" /> : <Login />,
    },
    {
      path: '/home',
      element: (
        <RoleBasedRoute allowedRoles={['admin', 'supervisor', 'counselor', 'teacher']}>
          <Home />
        </RoleBasedRoute>
      ),
    },
    {
      path: '/student-dashboard',
      element: (
        <RoleBasedRoute allowedRoles={['admin', 'supervisor', 'counselor', 'teacher']}>
          <StudentDashboard />
        </RoleBasedRoute>
      ),
    },
    {
      path: '/teacher-dashboard',
      element: (
        <RoleBasedRoute allowedRoles={['teacher']}>
          <TeacherDashboard />
        </RoleBasedRoute>
      ),
    },
    {
      path: '/admin-dashboard',
      element: (
        <RoleBasedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </RoleBasedRoute>
      ),
    },
    {
      path: '/user-management',
      element: <RoleBasedRoute allowedRoles={['admin']}>
        <UserManagement />
      </RoleBasedRoute>
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default App;
