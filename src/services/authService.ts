import { apiService, handleApiError } from "./api";
import type { User, LoginForm, ApiResponse } from "../types";

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private currentUser: User | null = null;
  private authToken: string | null = null;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    // Check for existing auth data
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        this.authToken = token;
        this.currentUser = JSON.parse(user);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        this.clearAuth();
      }
    }
  }

  async login(credentials: LoginForm): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        "/auth/login",
        credentials,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Login failed");
      }

      const { user, token, refreshToken } = response.data;

      // Store auth data
      this.authToken = token;
      this.currentUser = user;

      // Persist to storage based on remember preference
      const storage = credentials.remember ? localStorage : sessionStorage;
      storage.setItem("authToken", token);
      storage.setItem("refreshToken", refreshToken);

      localStorage.setItem("user", JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.post("/auth/logout");
    } catch (error) {
      console.warn("Error during logout:", error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiService.post<{ token: string }>(
        "/auth/refresh",
        {
          refreshToken,
        },
      );

      if (!response.success || !response.data) {
        throw new Error("Token refresh failed");
      }

      const newToken = response.data.token;

      // Update stored token
      const storage = localStorage.getItem("authToken")
        ? localStorage
        : sessionStorage;
      storage.setItem("authToken", newToken);
      this.authToken = newToken;

      return newToken;
    } catch (error) {
      this.clearAuth();
      throw new Error(handleApiError(error));
    }
  }

  async getCurrentUser(): Promise<User> {
    if (!this.isAuthenticated()) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await apiService.get<User>("/auth/me");

      if (!response.success || !response.data) {
        throw new Error("Failed to fetch current user");
      }

      // Update current user data
      this.currentUser = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const response = await apiService.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      if (!response.success) {
        throw new Error(response.message || "Password change failed");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  private clearAuth(): void {
    this.authToken = null;
    this.currentUser = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
  }

  // Getters
  getToken(): string | null {
    return this.authToken;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!(this.authToken && this.currentUser);
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole("ADMIN");
  }

  isManager(): boolean {
    return this.hasAnyRole(["ADMIN", "MANAGER"]);
  }

  isStylist(): boolean {
    return this.hasRole("STYLIST");
  }

  isCustomer(): boolean {
    return this.hasRole("CUSTOMER");
  }

  // Token validation
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.authToken;
    if (!tokenToCheck) return true;

    try {
      // Simple JWT payload extraction (without verification)
      const payload = JSON.parse(atob(tokenToCheck.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<string> {
    if (!this.authToken) {
      throw new Error("No token available");
    }

    if (this.isTokenExpired()) {
      return await this.refreshToken();
    }

    return this.authToken;
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await apiService.post("/auth/forgot-password", {
        email,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to send reset email");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post("/auth/reset-password", {
        token,
        newPassword,
      });

      if (!response.success) {
        throw new Error(response.message || "Password reset failed");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Verify email with token
  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiService.post("/auth/verify-email", {
        token,
      });

      if (!response.success) {
        throw new Error(response.message || "Email verification failed");
      }

      // Update current user if logged in
      if (this.currentUser) {
        this.currentUser.emailVerified = true;
        localStorage.setItem("user", JSON.stringify(this.currentUser));
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    try {
      const response = await apiService.post("/auth/resend-verification");

      if (!response.success) {
        throw new Error(
          response.message || "Failed to send verification email",
        );
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update user profile
  async updateProfile(profileData: {
    fullName?: string;
    phone?: string;
    avatar?: string;
  }): Promise<User> {
    try {
      const response = await apiService.patch<User>(
        "/auth/profile",
        profileData,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Profile update failed");
      }

      // Update current user data
      this.currentUser = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Auth state for React context
  getAuthState(): AuthState {
    return {
      user: this.currentUser,
      token: this.authToken,
      isAuthenticated: this.isAuthenticated(),
    };
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing
export { AuthService };
