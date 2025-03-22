
import React, { useState } from "react";
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
import { Google, Apple, Mail, KeyRound, Check } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

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

    // Simulate email verification step
    setTimeout(() => {
      setIsLoading(false);
      setVerificationMode(true);
    }, 1000);
  };

  const handleVerification = () => {
    setIsLoading(true);
    
    // Check if verification code is valid (6 digits for this example)
    if (verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      setIsLoading(false);
      return;
    }

    // Mock verification
    setTimeout(() => {
      // Complete login process
      login(username, "teacher");
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
      
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      // For demo, we'll use a fixed name based on the provider
      const name = provider === 'google' ? 'John Teacher' : 
                  provider === 'apple' ? 'Sarah Teacher' : 
                  'Alex Teacher';
      
      login(name, "teacher");
      
      toast({
        title: "Login successful via " + provider,
        description: `Welcome back, ${name}!`,
      });
      
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
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
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              
              <div className="text-center text-sm">
                <a href="#" onClick={(e) => { e.preventDefault(); setVerificationMode(false); }} className="text-primary hover:underline">
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
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to access your student management system
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="standard">Standard Login</TabsTrigger>
              <TabsTrigger value="sso">SSO & Social</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standard" className="mt-0">
              <form onSubmit={handleStandardLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username / Email
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login with Email"}
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
                <Google className="mr-2 h-4 w-4" /> Continue with Google
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('apple')} 
                variant="outline" 
                className="w-full justify-start"
                disabled={isLoading}
              >
                <Apple className="mr-2 h-4 w-4" /> Continue with Apple
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('microsoft')} 
                variant="outline" 
                className="w-full justify-start"
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" /> Continue with Microsoft
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
            Don't have an account? <a href="#" className="text-primary hover:underline">Contact administrator</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
