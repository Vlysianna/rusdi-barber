import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { authService } from "../services/authService";
import { healthService } from "../services/healthService";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ForgotPasswordModal from "../components/ui/ForgotPasswordModal";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login: authLogin,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Backend connection status
  const [connectionStatus, setConnectionStatus] = useState<{
    isConnected: boolean;
    message: string;
    checking: boolean;
  }>({
    isConnected: false,
    message: "Checking backend connection...",
    checking: true,
  });

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, isAuthenticated]);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const status = await healthService.checkConnection();
      setConnectionStatus({
        isConnected: status.isConnected,
        message: status.message,
        checking: false,
      });
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        message: "Failed to connect to backend server",
        checking: false,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear auth errors
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Always try real API first regardless of connection status
      try {
        await authLogin(formData);

        // Get redirect path from location state or default to dashboard
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
        return; // Exit early on successful real login
      } catch (apiError) {
        // If real API fails and backend is not connected, fall back to demo
        if (!connectionStatus.isConnected) {
          console.log("Real API failed, falling back to demo mode");
          await handleMockLogin();
          return;
        }
        // If backend is connected but login failed, throw the error
        throw apiError;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      // Handle specific error cases
      if (
        errorMessage.includes("Invalid credentials") ||
        errorMessage.includes("401")
      ) {
        setErrors({ general: "Invalid email or password. Please try again." });
      } else if (
        errorMessage.includes("Network Error") ||
        errorMessage.includes("timeout")
      ) {
        setErrors({
          general: "Network error. Please check your connection and try again.",
        });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = async () => {
    // Validate demo credentials or allow any credentials in demo mode
    const validDemoCredentials = [
      { email: "admin@example.com", password: "password123" },
      { email: "admin@rusdibarber.com", password: "Admin123!" },
      { email: "manager@example.com", password: "manager123" },
      { email: "stylist@example.com", password: "stylist123" },
    ];

    const isValidDemo = validDemoCredentials.some(
      (cred) =>
        cred.email === formData.email && cred.password === formData.password,
    );

    if (!isValidDemo) {
      throw new Error(
        "Invalid credentials. For demo mode, use: admin@example.com / password123",
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determine role based on email
    let role = "ADMIN";
    let fullName = "Demo Admin";

    if (formData.email.includes("manager")) {
      role = "MANAGER";
      fullName = "Demo Manager";
    } else if (formData.email.includes("stylist")) {
      role = "STYLIST";
      fullName = "Demo Stylist";
    }

    // Mock successful login
    const mockUser = {
      id: "1",
      email: formData.email,
      username: "demo_user",
      fullName: fullName,
      phone: "+62812345678",
      role: role,
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockToken = "mock-jwt-token-demo-mode";

    // Store in localStorage or sessionStorage based on remember preference
    const storage = formData.remember ? localStorage : sessionStorage;
    storage.setItem("authToken", mockToken);
    storage.setItem("refreshToken", "mock-refresh-token");
    localStorage.setItem("user", JSON.stringify(mockUser));

    // Navigate to dashboard
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    navigate(from, { replace: true });
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "admin@example.com",
      password: "password123",
      remember: true,
    });
    setErrors({});
  };

  const handleRealLogin = () => {
    setFormData({
      email: "admin@rusdibarber.com",
      password: "",
      remember: false,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and Title */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Rusdi Barber Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Connection Status */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm">
              {connectionStatus.checking ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                  <span>Checking connection...</span>
                </div>
              ) : connectionStatus.isConnected ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected to backend</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Demo mode - Backend offline</span>
                </div>
              )}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error */}
            {(errors.general || authError) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Login Failed
                    </h3>
                    <p className="mt-2 text-sm text-red-700">
                      {errors.general || authError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`
                    block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.email ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
                  `}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`
                    block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.password ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"}
                  `}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              <Button
                type="submit"
                fullWidth
                loading={loading || authLoading}
                className="justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || authLoading}
              >
                {loading || authLoading ? "Signing in..." : "Sign in"}
              </Button>

              {/* Quick Login Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={handleDemoLogin}
                  className="justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Use Demo Credentials
                </Button>

                {connectionStatus.isConnected && (
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={handleRealLogin}
                    className="justify-center py-1 px-4 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Use Real API Login
                  </Button>
                )}
              </div>
            </div>

            {/* Login Mode Info */}
            <div className="mt-4 p-3 border rounded-md">
              {connectionStatus.isConnected ? (
                <div className="bg-green-50 border-green-200">
                  <div className="text-sm text-green-800 p-3">
                    <strong>✅ Backend Connected:</strong> You can use real API
                    login or demo mode.
                    <div className="mt-2 text-xs space-y-1">
                      <div>
                        <strong>Demo:</strong> admin@example.com / password123
                      </div>
                      <div>
                        <strong>Real API:</strong> Use your actual credentials
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border-blue-200">
                  <div className="text-sm text-blue-800 p-3">
                    <strong>🔄 Demo Mode:</strong> Backend offline. Using demo
                    data only.
                    <div className="mt-2 text-xs">
                      <strong>Available demo accounts:</strong>
                      <br />
                      • admin@example.com / password123 (Admin)
                      <br />
                      • manager@example.com / manager123 (Manager)
                      <br />• stylist@example.com / stylist123 (Stylist)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <span>Don't have an account? </span>
                  <button className="font-medium text-blue-600 hover:text-blue-500">
                    Contact administrator
                  </button>
                </div>
                <div>
                  <button
                    onClick={checkBackendConnection}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Check connection again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-500">
          © 2024 Rusdi Barber. All rights reserved.
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Login;
