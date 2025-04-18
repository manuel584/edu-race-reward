import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'admin' | 'supervisor' | 'counselor' | 'teacher';

export type UserProfile = {
  subject?: string;
  gradeLevel?: string;
  email?: string;
  picture?: string;
  authMethod?: string;
  googleId?: string;
  departments?: string[];
  assignedGrades?: string[];
  assignedSections?: string[];
  subjects?: string[];
  [key: string]: any;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  profile?: UserProfile;
  authToken?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => void;
  hasPermission: (permission: string) => boolean;
};

// Define the GoogleAccountsType interface to match what's available in the window object
interface GoogleAccountsType {
  id: {
    initialize: (config: any) => void;
    renderButton: (element: HTMLElement, options: any) => void;
    prompt: () => void;
    revoke?: (tokenId: string, callback: () => void) => void;
  }
}

// Extend the Window interface to include google property
declare global {
  interface Window {
    google?: {
      accounts?: GoogleAccountsType;
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Permission mapping for different roles
const rolePermissions = {
  admin: [
    'manage_users', 'view_all_students', 'edit_all_students', 'delete_students',
    'view_all_classes', 'edit_all_classes', 'create_classes', 'delete_classes',
    'view_all_exams', 'create_exams', 'edit_exams', 'delete_exams',
    'view_all_reports', 'view_system_settings', 'edit_system_settings',
    'import_data', 'export_data', 'manage_sections', 'assign_teachers',
    'view_teachers', 'manage_teachers', 'assign_teachers'
  ],
  supervisor: [
    'view_department_students', 'view_department_classes', 'view_department_exams',
    'view_department_reports', 'create_exams', 'edit_exams', 'view_teacher_performance',
    'view_curriculum', 'export_data',
    'view_teachers', 'manage_teachers'
  ],
  counselor: [
    'view_all_students', 'view_student_behavior', 'view_student_academics', 
    'view_recognitions', 'create_interventions', 'parent_communication',
    'export_data'
  ],
  teacher: [
    'view_assigned_students', 'view_assigned_classes', 'create_exams', 
    'edit_own_exams', 'grade_exams', 'create_recognitions', 'export_own_data'
  ]
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Set up token refresh (simulated)
    const tokenInterval = setInterval(() => {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          // In a real app, this would be an actual token refresh call
          if (userData.authToken) {
            userData.authToken = `refreshed_${Date.now()}`;
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }
    }, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(tokenInterval);
  }, []);

  const login = (userData: User) => {
    // Generate a simulated auth token (in a real app, this would come from the backend)
    if (userData && !userData.authToken) {
      userData.authToken = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Auth logging for security tracking
    console.log(`User authenticated: ${userData?.name}, Role: ${userData?.role}, Method: ${userData?.profile?.authMethod || 'standard'}`);
    
    toast({
      title: "Login successful",
      description: `Welcome, ${userData?.name}!`,
    });
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // If user is admin, they have all permissions
    if (user.role === 'admin') return true;
    
    // Check if the user's role has the specified permission
    return rolePermissions[user.role].includes(permission);
  };

  const logout = () => {
    // If the user was authenticated with Google, handle Google sign-out
    const authMethod = user?.profile?.authMethod;
    if (authMethod === 'google' && window.google?.accounts?.id) {
      try {
        // Check if Google's accounts.id exists
        const googleId = window.google.accounts.id;
        
        // Since TypeScript doesn't know about the revoke method, we'll use a safer approach
        if (googleId.revoke && user?.profile?.googleId) {
          googleId.revoke(user.profile.googleId, () => {
            console.log('Google ID token revoked');
          });
        }
      } catch (error) {
        console.error('Error during Google sign-out:', error);
      }
    }
    
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_state');
    sessionStorage.removeItem('auth_provider');
    
    // Clear any other auth-related data
    const authKeys = ['token_expiry', 'refresh_token'];
    authKeys.forEach(key => localStorage.removeItem(key));
    
    navigate('/login');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    updateProfile,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
