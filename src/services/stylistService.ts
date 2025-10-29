import { apiService, handleApiError } from "./api";
import type { Stylist } from "../types";

export interface CreateStylistData {
  userId: string;
  specialties: string[];
  experience: number;
  commissionRate: number;
  isAvailable: boolean;
  schedule: {
    [key: string]: {
      isWorking: boolean;
      startTime: string;
      endTime: string;
    };
  };
  bio?: string;
}

export interface UpdateStylistData {
  specialties?: string[];
  experience?: number;
  commissionRate?: number;
  isAvailable?: boolean;
  schedule?: {
    [key: string]: {
      isWorking: boolean;
      startTime: string;
      endTime: string;
    };
  };
  bio?: string;
}

export interface StylistFilters {
  isAvailable?: boolean;
  specialties?: string[];
  page?: number;
  limit?: number;
  search?: string;
}

export interface StylistPerformance {
  stylistId: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: string;
  averageRating: number;
  monthlyStats: {
    month: string;
    bookings: number;
    revenue: string;
  }[];
}

class StylistService {
  /**
   * Get all stylists
   */
  async getAllStylists(filters?: StylistFilters): Promise<Stylist[]> {
    try {
      const response = await apiService.get<Stylist[]>("/stylists", filters);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylists");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stylist by ID
   */
  async getStylistById(id: string): Promise<Stylist> {
    try {
      const response = await apiService.get<Stylist>(`/stylists/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create new stylist
   */
  async createStylist(data: CreateStylistData): Promise<Stylist> {
    try {
      const response = await apiService.post<Stylist>("/stylists", data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create stylist");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update stylist
   */
  async updateStylist(id: string, data: UpdateStylistData): Promise<Stylist> {
    try {
      const response = await apiService.patch<Stylist>(`/stylists/${id}`, data);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update stylist");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete stylist
   */
  async deleteStylist(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/stylists/${id}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete stylist");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get available stylists for a specific date and time
   */
  async getAvailableStylists(date: string, time: string): Promise<Stylist[]> {
    try {
      const response = await apiService.get<Stylist[]>("/stylists/available", {
        date,
        time,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch available stylists");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stylist performance metrics
   */
  async getStylistPerformance(
    id: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<StylistPerformance> {
    try {
      const response = await apiService.get<StylistPerformance>(
        `/stylists/${id}/performance`,
        { dateFrom, dateTo }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist performance");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update stylist availability
   */
  async updateAvailability(id: string, isAvailable: boolean): Promise<Stylist> {
    try {
      const response = await apiService.patch<Stylist>(`/stylists/${id}/availability`, {
        isAvailable,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update stylist availability");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update stylist schedule
   */
  async updateSchedule(
    id: string,
    schedule: {
      [key: string]: {
        isWorking: boolean;
        startTime: string;
        endTime: string;
      };
    }
  ): Promise<Stylist> {
    try {
      const response = await apiService.patch<Stylist>(`/stylists/${id}/schedule`, {
        schedule,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update stylist schedule");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stylist bookings
   */
  async getStylistBookings(
    id: string,
    filters?: {
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<any[]> {
    try {
      const response = await apiService.get<any[]>(`/stylists/${id}/bookings`, filters);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist bookings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stylist specialties
   */
  async getStylistSpecialties(): Promise<string[]> {
    try {
      const response = await apiService.get<string[]>("/stylists/specialties");

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist specialties");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stylist earnings
   */
  async getStylistEarnings(
    id: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalEarnings: string;
    commission: string;
    totalBookings: number;
    averageBookingValue: string;
    monthlyBreakdown: {
      month: string;
      earnings: string;
      bookings: number;
    }[];
  }> {
    try {
      const response = await apiService.get<any>(`/stylists/${id}/earnings`, {
        dateFrom,
        dateTo,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist earnings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Add stylist to service
   */
  async assignServiceToStylist(stylistId: string, serviceId: string): Promise<void> {
    try {
      const response = await apiService.post(`/stylists/${stylistId}/services`, {
        serviceId,
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to assign service to stylist");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Remove stylist from service
   */
  async removeServiceFromStylist(stylistId: string, serviceId: string): Promise<void> {
    try {
      const response = await apiService.delete(`/stylists/${stylistId}/services/${serviceId}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to remove service from stylist");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update stylist profile image
   */
  async updateProfileImage(id: string, imageFile: File): Promise<Stylist> {
    try {
      const formData = new FormData();
      formData.append("avatar", imageFile);

      const response = await apiService.post<Stylist>(
        `/stylists/${id}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update profile image");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stylist reviews
   */
  async getStylistReviews(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    reviews: any[];
    total: number;
    averageRating: number;
  }> {
    try {
      const response = await apiService.get<any>(`/stylists/${id}/reviews`, {
        page,
        limit,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist reviews");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const stylistService = new StylistService();

// Export class for testing
export { StylistService };
