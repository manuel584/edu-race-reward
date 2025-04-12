
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'supervisor', 'counselor', 'teacher'],
  requiredPermissions = []
}) => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const { toast } = useToast();

  // Handle authentication check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the allowed role
  if (user && !allowedRoles.includes(user.role)) {
    // Using useEffect to avoid state updates during render
    useEffect(() => {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
    }, []);
    
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user has all required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      // Using useEffect to avoid state updates during render
      useEffect(() => {
        toast({
          title: "Permission denied",
          description: "You don't have the necessary permissions to access this feature.",
          variant: "destructive"
        });
      }, []);
      
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
