
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

type UserProfile = {
  subject?: string;
  gradeLevel?: string;
  email?: string;
  picture?: string;
  authMethod?: string;
  googleId?: string;
  [key: string]: any;
};

type User = {
  name: string;
  role: string;
  profile?: UserProfile;
  authToken?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (name: string, role: string, profile?: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => void;
};

// Define the GoogleAccountsType interface to match what's available in the window object
interface GoogleAccountsType {
  id: {
    initialize: (config: any) => void;
    renderButton: (element: HTMLElement, options: any) => void;
    prompt: () => void;
    // Don't include revoke if it might not exist
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

  const login = (name: string, role: string, profile?: UserProfile) => {
    // Generate a simulated auth token (in a real app, this would come from the backend)
    const authToken = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const userData = { 
      name, 
      role,
      profile,
      authToken
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Auth logging for security tracking
    console.log(`User authenticated: ${name}, Method: ${profile?.authMethod || 'standard'}`);
    
    toast({
      title: "Login successful",
      description: `Welcome, ${name}!`,
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

  const logout = () => {
    // If the user was authenticated with Google, handle Google sign-out
    const authMethod = user?.profile?.authMethod;
    if (authMethod === 'google' && window.google?.accounts?.id) {
      try {
        // Check if Google's accounts.id exists
        const googleId = window.google.accounts.id;
        
        // Since TypeScript doesn't know about the revoke method, we'll use a safer approach
        // to avoid TypeScript errors
        if (typeof (googleId as any).revoke === 'function') {
          (googleId as any).revoke(user?.profile?.googleId || '', () => {
            console.log('Google ID token revoked');
          });
        }
        
        // Note: We're not calling disableAutoSelect since it might not exist
        // and was causing TypeScript errors
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
