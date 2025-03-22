
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Mail, KeyRound, MessageSquare, GithubIcon, ExternalLink, User, SendIcon, RotateCw } from "lucide-react";

// Generate a random state string for CSRF protection
const generateStateParam = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [codeExpiry, setCodeExpiry] = useState(300); // 5 minutes in seconds
  const [attemptCount, setAttemptCount] = useState(0);
  const [authState, setAuthState] = useState("");
  const [countdownActive, setCountdownActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  // Initialize CSRF state on component mount
  useEffect(() => {
    const state = generateStateParam();
    setAuthState(state);
    // Store state in sessionStorage for verification
    sessionStorage.setItem("auth_state", state);
  }, []);

  // Countdown timer for verification code
  useEffect(() => {
    let timer;
    if (countdownActive && codeExpiry > 0) {
      timer = setInterval(() => {
        setCodeExpiry(prev => prev - 1);
      }, 1000);
    } else if (codeExpiry === 0) {
      setError("Verification code expired. Please request a new one.");
      setCountdownActive(false);
    }
    
    return () => clearInterval(timer);
  }, [countdownActive, codeExpiry]);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(codeExpiry / 60);
    const seconds = codeExpiry % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    // Simulate server authentication
    setTimeout(() => {
      setIsLoading(false);
      // Initialize verification with new verification code
      setVerificationMode(true);
      setCodeExpiry(300); // Reset to 5 minutes
      setAttemptCount(0);  // Reset attempt count
      setCountdownActive(true);
      
      toast({
        title: "Verification code sent",
        description: "Check your email for the 6-digit verification code",
      });
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation for sign-up
    if (!username || !password || !name) {
      setError("Please fill out all required fields");
      setIsLoading(false);
      return;
    }

    // Simulate email domain verification for educational institutions
    const emailDomain = username.split('@')[1];
    const allowedDomains = ['edu', 'school', 'k12', 'ac']; // Example educational domains
    
    // Simple check if domain ends with an educational TLD
    const isEducationalDomain = allowedDomains.some(domain => 
      emailDomain && emailDomain.endsWith(domain)
    );
    
    if (!isEducationalDomain) {
      toast({
        title: "Notice",
        description: "We recommend using an educational email address",
        variant: "default"
      });
    }

    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      setVerificationMode(true);
      setCodeExpiry(300);
      setAttemptCount(0);
      setCountdownActive(true);
      
      toast({
        title: "Account created",
        description: "Verify your email to complete registration",
      });
    }, 1000);
  };

  const handleResendCode = () => {
    setCodeExpiry(300);
    setAttemptCount(0);
    setCountdownActive(true);
    
    toast({
      title: "New code sent",
      description: "Check your email for the new verification code",
    });
  };

  const handleVerification = () => {
    setIsLoading(true);
    
    // Increment attempt counter
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    
    // Check if max attempts reached (5 max)
    if (newAttemptCount >= 5) {
      setError("Too many failed attempts. Please request a new code.");
      setIsLoading(false);
      setCountdownActive(false);
      return;
    }
    
    // Check if verification code is valid (6 digits for this example)
    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setIsLoading(false);
      return;
    }

    // Simulate server verification
    setTimeout(() => {
      // In a real app, this would be a secure server-side verification

      // Complete login process - with different flows for login vs. signup
      if (isSignUp) {
        login(name, "teacher", {
          subject,
          gradeLevel
        });
        
        toast({
          title: "Registration successful",
          description: `Welcome, ${name}!`,
        });
      } else {
        login(username, "teacher");
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
      }
      
      // Redirect to dashboard
      navigate("/dashboard");
      
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Store auth state for verification when the OAuth provider redirects back
    // This prevents CSRF attacks
    const state = authState || generateStateParam();
    sessionStorage.setItem("auth_state", state);
    sessionStorage.setItem("auth_provider", provider);
    
    // Simulate OAuth flow (in a real app, this would redirect to the provider)
    // Here we're just simulating the flow
    setTimeout(() => {
      // Verify returned state (simulated here)
      const storedState = sessionStorage.getItem("auth_state");
      if (storedState !== state) {
        setError("Authentication failed: Invalid state parameter");
        setIsLoading(false);
        return;
      }
      
      // For demo purposes, simulate successful login with different names based on provider
      const name = provider === 'google' ? 'John Teacher' : 
                  provider === 'apple' ? 'Sarah Teacher' : 
                  'Alex Teacher';
      
      login(name, "teacher");
      
      toast({
        title: "Login successful via " + provider,
        description: `Welcome back, ${name}!`,
      });
      
      // Clean up auth state
      sessionStorage.removeItem("auth_state");
      sessionStorage.removeItem("auth_provider");
      
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  if (verificationMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verification Required</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification code to your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleVerification(); }} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-center pb-4">
                  <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                {countdownActive && (
                  <div className="text-center text-sm text-muted-foreground">
                    Code expires in: {formatTimeRemaining()}
                  </div>
                )}
                
                {attemptCount > 0 && (
                  <div className="text-center text-sm text-muted-foreground">
                    Attempts: {attemptCount}/5
                  </div>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              
              <div className="flex justify-between text-center text-sm">
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    handleResendCode(); 
                  }} 
                  className="text-primary hover:underline flex items-center"
                >
                  <RotateCw className="h-3 w-3 mr-1" /> Resend code
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setVerificationMode(false); 
                  }} 
                  className="text-primary hover:underline"
                >
                  Back to login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? "Sign up to access your student management system" 
              : "Login to access your student management system"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={isSignUp ? "signup" : "standard"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger 
                value="standard" 
                onClick={() => setIsSignUp(false)}
              >
                {isSignUp ? "Sign Up" : "Standard Login"}
              </TabsTrigger>
              <TabsTrigger value="sso">SSO & Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standard" className="mt-0">
              <form onSubmit={isSignUp ? handleSignUp : handleStandardLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="username"
                    type="email"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="email"
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </label>
                    {!isSignUp && (
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject Taught
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="e.g. Mathematics, Science"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="gradeLevel" className="text-sm font-medium">
                        Grade Level
                      </label>
                      <Input
                        id="gradeLevel"
                        type="text"
                        placeholder="e.g. K-5, 6-8, 9-12"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? (isSignUp ? "Creating Account..." : "Logging in...") 
                    : (isSignUp ? "Create Account" : "Login with Email")
                  }
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="sso" className="mt-0 space-y-4">
              <Button 
                onClick={() => handleSocialLogin('google')} 
                variant="outline" 
                className="w-full justify-start"
                disabled={isLoading}
              >
                <MessageSquare className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('apple')} 
                variant="outline" 
                className="w-full justify-start"
                disabled={isLoading}
              >
                <GithubIcon className="mr-2 h-4 w-4" /> Continue with Apple
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('microsoft')} 
                variant="outline" 
                className="w-full justify-start"
                disabled={isLoading}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Continue with Microsoft
              </Button>
              
              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                <p>For educational institution SSO, contact your administrator</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            {isSignUp 
              ? "Already have an account? " 
              : "Don't have an account? "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                toggleSignUpMode();
              }} 
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
