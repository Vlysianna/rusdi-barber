import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { authService } from "../services/authService";
import type { User, LoginForm, UserRole } from "../types";

// Authentication context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is already authenticated
      if (authService.isAuthenticated()) {
        const currentUser = authService.getUser();
        const currentToken = authService.getToken();

        if (currentUser && currentToken) {
          setUser(currentUser);
          setToken(currentToken);

          // Try to refresh user data from backend
          try {
            const freshUser = await authService.getCurrentUser();
            if (freshUser) {
              setUser(freshUser);
            }
          } catch (refreshError) {
            // If refresh fails but we have local data, keep using it
            console.warn("Failed to refresh user data:", refreshError);
          }
        } else {
          // Clear invalid auth state
          setUser(null);
          setToken(null);
        }
      } else {
        // Ensure clean state
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setError("Failed to initialize authentication");

      // Clear potentially corrupted auth data
      setUser(null);
      setToken(null);
      try {
        await authService.logout();
      } catch (logoutError) {
        console.warn("Failed to logout during error cleanup:", logoutError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
      } else {
        throw new Error("Invalid login response from server");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);

      // Don't update state on login failure
      setUser(null);
      setToken(null);

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.logout();

      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Force local logout even if server call fails
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setError(null);

      if (!authService.isAuthenticated()) {
        throw new Error("Not authenticated");
      }

      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to refresh user data";
      setError(errorMessage);

      // If refresh fails due to auth issues, logout
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("unauthorized")
      ) {
        await logout();
      }

      throw error;
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Hook for checking user permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.role === role;
    },
    [user],
  );

  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      return user ? roles.includes(user.role) : false;
    },
    [user],
  );

  const isAdmin = useCallback((): boolean => {
    return hasRole(UserRole.ADMIN);
  }, [hasRole]);

  const isManager = useCallback((): boolean => {
    return hasRole(UserRole.MANAGER);
  }, [hasRole]);

  const isAdminOrManager = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const isStylist = useCallback((): boolean => {
    return hasRole(UserRole.STYLIST);
  }, [hasRole]);

  const isCustomer = useCallback((): boolean => {
    return hasRole(UserRole.CUSTOMER);
  }, [hasRole]);

  const canAccessDashboard = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STYLIST]);
  }, [hasAnyRole]);

  const canManageUsers = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const canManageStylists = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const canManageAllBookings = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const canManageBookings = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STYLIST]);
  }, [hasAnyRole]);

  const canManageServices = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const canManagePayments = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const canViewAllAnalytics = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  const canViewAnalytics = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.STYLIST]);
  }, [hasAnyRole]);

  const canManageSystemSettings = useCallback((): boolean => {
    return hasRole(UserRole.ADMIN);
  }, [hasRole]);

  const canViewFinancialReports = useCallback((): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.MANAGER]);
  }, [hasAnyRole]);

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isAdminOrManager,
    isStylist,
    isCustomer,
    canAccessDashboard,
    canManageUsers,
    canManageStylists,
    canManageAllBookings,
    canManageBookings,
    canManageServices,
    canManagePayments,
    canViewAllAnalytics,
    canViewAnalytics,
    canManageSystemSettings,
    canViewFinancialReports,
  };
};

// Hook for handling authentication redirects
export const useAuthRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const requireAuth = useCallback(
    (redirectTo: string = "/login") => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo;
        return false;
      }
      return true;
    },
    [isAuthenticated, isLoading],
  );

  const requireGuest = useCallback(
    (redirectTo: string = "/dashboard") => {
      if (!isLoading && isAuthenticated) {
        window.location.href = redirectTo;
        return false;
      }
      return true;
    },
    [isAuthenticated, isLoading],
  );

  return {
    requireAuth,
    requireGuest,
    isLoading,
    isAuthenticated,
  };
};

// Hook for token management
export const useToken = () => {
  const { token } = useAuth();

  const isTokenExpired = useCallback((): boolean => {
    if (!token) return true;
    return authService.isTokenExpired(token);
  }, [token]);

  const getTokenPayload = useCallback(() => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }, [token]);

  const refreshToken = useCallback(async (): Promise<string> => {
    try {
      return await authService.refreshToken();
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }, []);

  return {
    token,
    isTokenExpired,
    getTokenPayload,
    refreshToken,
  };
};

export default useAuth;
