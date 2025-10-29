import { apiService, handleApiError, buildPaginationParams } from "./api";
import type {
  DashboardStats,
  TopStylist,
  MonthlyRevenue,
  BookingStatusCount,
  Booking,
  ApiResponse,
} from "../types";

export interface DashboardFilters {
  dateFrom?: string;
  dateTo?: string;
  stylistId?: string;
  serviceId?: string;
}

export interface RevenueAnalytics {
  totalRevenue: string;
  monthlyGrowth: number;
  dailyRevenue: { date: string; amount: string }[];
  revenueByService: { serviceName: string; revenue: string; count: number }[];
  revenueByPaymentMethod: {
    method: string;
    amount: string;
    percentage: number;
  }[];
}

export interface BookingAnalytics {
  totalBookings: number;
  monthlyGrowth: number;
  bookingsByStatus: BookingStatusCount[];
  bookingsByHour: { hour: number; count: number }[];
  bookingsByDay: { day: string; count: number }[];
  averageBookingValue: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: number;
  topCustomers: {
    id: string;
    name: string;
    avatar?: string;
    totalBookings: number;
    totalSpent: string;
    lastBooking: string;
  }[];
  customerRetentionRate: number;
}

export interface StylistAnalytics {
  totalStylists: number;
  averageRating: number;
  topStylists: TopStylist[];
  stylistPerformance: {
    stylistId: string;
    name: string;
    avatar?: string;
    bookingsCount: number;
    revenue: string;
    rating: number;
    utilizationRate: number;
  }[];
}

class DashboardService {
  // Get main dashboard statistics
  async getDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
    try {
      const response = await apiService.get<DashboardStats>(
        "/dashboard/stats",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch dashboard stats");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(
    filters?: DashboardFilters,
  ): Promise<RevenueAnalytics> {
    try {
      const response = await apiService.get<RevenueAnalytics>(
        "/dashboard/analytics/revenue",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch revenue analytics",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get booking analytics
  async getBookingAnalytics(
    filters?: DashboardFilters,
  ): Promise<BookingAnalytics> {
    try {
      const response = await apiService.get<BookingAnalytics>(
        "/dashboard/analytics/bookings",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch booking analytics",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get customer analytics
  async getCustomerAnalytics(
    filters?: DashboardFilters,
  ): Promise<CustomerAnalytics> {
    try {
      const response = await apiService.get<CustomerAnalytics>(
        "/dashboard/analytics/customers",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch customer analytics",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get stylist analytics
  async getStylistAnalytics(
    filters?: DashboardFilters,
  ): Promise<StylistAnalytics> {
    try {
      const response = await apiService.get<StylistAnalytics>(
        "/dashboard/analytics/stylists",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch stylist analytics",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get recent bookings
  async getRecentBookings(limit: number = 10): Promise<Booking[]> {
    try {
      const params = buildPaginationParams(1, limit, "createdAt", "desc");
      const response = await apiService.get<Booking[]>(
        "/dashboard/recent-bookings",
        params,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch recent bookings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get top performing stylists
  async getTopStylists(
    limit: number = 5,
    period: "week" | "month" | "year" = "month",
  ): Promise<TopStylist[]> {
    try {
      const response = await apiService.get<TopStylist[]>(
        "/dashboard/top-stylists",
        {
          limit,
          period,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch top stylists");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get monthly revenue trend
  async getMonthlyRevenue(months: number = 12): Promise<MonthlyRevenue[]> {
    try {
      const response = await apiService.get<MonthlyRevenue[]>(
        "/dashboard/monthly-revenue",
        {
          months,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch monthly revenue");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get booking status distribution
  async getBookingStatusDistribution(
    filters?: DashboardFilters,
  ): Promise<BookingStatusCount[]> {
    try {
      const response = await apiService.get<BookingStatusCount[]>(
        "/dashboard/booking-status",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch booking status distribution",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Export reports
  async exportReport(
    type: "revenue" | "bookings" | "customers" | "stylists",
    format: "csv" | "xlsx" | "pdf",
    filters?: DashboardFilters,
  ): Promise<Blob> {
    try {
      const response = await apiService.api.get(`/dashboard/export/${type}`, {
        params: { format, ...filters },
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get real-time stats (WebSocket would be better for this)
  async getRealTimeStats(): Promise<{
    onlineStylists: number;
    todayBookings: number;
    pendingPayments: number;
    activeCustomers: number;
  }> {
    try {
      const response = await apiService.get("/dashboard/realtime-stats");

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch real-time stats");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get service popularity
  async getServicePopularity(limit: number = 10): Promise<
    {
      serviceId: string;
      serviceName: string;
      bookingsCount: number;
      revenue: string;
      averageRating: number;
    }[]
  > {
    try {
      const response = await apiService.get("/dashboard/service-popularity", {
        limit,
      });

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch service popularity",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get peak hours analysis
  async getPeakHours(): Promise<
    {
      hour: number;
      bookingsCount: number;
      utilizationRate: number;
    }[]
  > {
    try {
      const response = await apiService.get("/dashboard/peak-hours");

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch peak hours");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get customer satisfaction metrics
  async getCustomerSatisfaction(): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { rating: number; count: number; percentage: number }[];
    satisfactionTrend: { month: string; rating: number }[];
  }> {
    try {
      const response = await apiService.get("/dashboard/customer-satisfaction");

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch customer satisfaction",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();

// Export class for testing
export { DashboardService };
