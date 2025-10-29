import { apiService, handleApiError } from "./api";
import type { User, UserRole } from "../types";

export interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
  username?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  username?: string;
  avatar?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  preferences?: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    marketing: boolean;
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  registrationTrend: {
    date: string;
    count: number;
  }[];
}

class UserService {
  /**
   * Get all users
   */
  async getUsers(filters?: UserFilters): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>("/users", filters);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch users");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiService.get<User>(`/users/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await apiService.post<User>("/users", data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create user");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await apiService.patch<User>(`/users/${id}`, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update user");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/users/${id}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete user");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user status (active/inactive)
   */
  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    try {
      const response = await apiService.patch<User>(`/users/${id}/status`, {
        isActive,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update user status");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Change user password (by admin)
   */
  async changeUserPassword(id: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post(`/users/${id}/change-password`, {
        newPassword,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to change user password");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(id: string): Promise<UserProfile> {
    try {
      const response = await apiService.get<UserProfile>(`/users/${id}/profile`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user profile");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const response = await apiService.patch<UserProfile>(`/users/${id}/profile`, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update user profile");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(id: string, imageFile: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append("avatar", imageFile);

      const response = await apiService.post<User>(
        `/users/${id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to upload avatar");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>(`/users/role/${role}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch users by role");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search users
   */
  async searchUsers(query: string, filters?: Partial<UserFilters>): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>("/users/search", {
        query,
        ...filters,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to search users");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiService.get<UserStats>("/users/stats");

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user statistics");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Bulk update users
   */
  async bulkUpdateUsers(
    userIds: string[],
    updates: Partial<UpdateUserData>
  ): Promise<User[]> {
    try {
      const response = await apiService.patch<User[]>("/users/bulk-update", {
        userIds,
        updates,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to bulk update users");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      const response = await apiService.post("/users/forgot-password", {
        email,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to send password reset email");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Verify user email
   */
  async verifyUserEmail(id: string): Promise<User> {
    try {
      const response = await apiService.post<User>(`/users/${id}/verify-email`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to verify user email");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(id: string): Promise<void> {
    try {
      const response = await apiService.post(`/users/${id}/resend-verification`);

      if (!response.success) {
        throw new Error(response.message || "Failed to resend verification email");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user activity log
   */
  async getUserActivityLog(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    activities: {
      id: string;
      action: string;
      description: string;
      ipAddress: string;
      userAgent: string;
      createdAt: string;
    }[];
    total: number;
  }> {
    try {
      const response = await apiService.get<any>(`/users/${id}/activity`, {
        page,
        limit,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user activity log");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Export users data
   */
  async exportUsers(
    format: "csv" | "excel" = "csv",
    filters?: UserFilters
  ): Promise<Blob> {
    try {
      const response = await apiService.get(`/users/export`, {
        format,
        ...filters,
      }, {
        responseType: "blob",
      });

      if (!response.data) {
        throw new Error("Failed to export users data");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's booking history
   */
  async getUserBookings(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    bookings: any[];
    total: number;
    totalSpent: string;
  }> {
    try {
      const response = await apiService.get<any>(`/users/${id}/bookings`, {
        page,
        limit,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch user bookings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Block/Unblock user
   */
  async toggleUserBlock(id: string): Promise<User> {
    try {
      const response = await apiService.post<User>(`/users/${id}/toggle-block`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to toggle user block status");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const userService = new UserService();

// Export class for testing
export { UserService };
