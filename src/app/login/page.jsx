"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  ArrowLeft, 
  Sparkles,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to chat (for now, since role isn't defined in mock auth)
        router.push('/chat');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Shield className="w-5 h-5" />, text: "Secure & Encrypted" },
    { icon: <Zap className="w-5 h-5" />, text: "Real-time Messaging" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Admin Dashboard" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Brand & Features */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <div className="text-center lg:text-left">
            {/* Back to Home */}
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="mb-8 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            {/* Brand Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  Rexxie
                </h1>
              </div>
              <p className="text-xl lg:text-2xl text-gray-600 font-medium mb-2">
                India's own work official chat box
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto lg:mx-0 rounded-full"></div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 text-gray-700 transition-all duration-500 delay-${index * 100}`}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {feature.icon}
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm max-w-md mx-auto">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
              <p className="text-gray-600">Sign in to continue to your workspace</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      disabled={isLoading}
                      autoFocus
                      className="h-12 pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="h-12 pl-10 pr-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isLoading || !username.trim() || !password.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In to Rexxie"
                  )}
                </Button>
              </form>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-blue-100">
                <h3 className="font-semibold mb-4 text-gray-800 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                  Demo Access
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-600">Admin Account</p>
                        <p className="text-sm text-gray-600">Full system access</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        username: admin
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">password: admin123</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Admin can manage users, monitor conversations, and configure the system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Powered by Rexxie • Secure • Reliable • Made in India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
