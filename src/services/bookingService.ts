import {
  apiService,
  handleApiError,
  buildPaginationParams,
  PaginationParams,
} from "./api";
import type {
  Booking,
  BookingFilters,
  PaginatedResponse,
  ApiResponse,
} from "../types";
import { BookingStatus } from "../types";

export interface CreateBookingRequest {
  customerId: string;
  stylistId: string;
  serviceId: string;
  bookingDate: string;
  startTime: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  stylistId?: string;
  serviceId?: string;
  bookingDate?: string;
  startTime?: string;
  status?: string;
  notes?: string;
}

export interface BookingAvailability {
  stylistId: string;
  date: string;
  availableSlots: {
    startTime: string;
    endTime: string;
    duration: number;
  }[];
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

class BookingService {
  // Get all bookings with pagination and filters
  async getBookings(
    filters?: BookingFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const params = { ...filters, ...pagination };
      const response = await apiService.getPaginated<Booking>(
        "/bookings",
        params,
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiService.get<Booking>(`/bookings/${id}`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Booking not found");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create new booking
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiService.post<Booking>("/bookings", bookingData);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update booking
  async updateBooking(
    id: string,
    bookingData: UpdateBookingRequest,
  ): Promise<Booking> {
    try {
      const response = await apiService.put<Booking>(
        `/bookings/${id}`,
        bookingData,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update booking status
  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(
        `/bookings/${id}/status`,
        { status },
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update booking status");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Cancel booking
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(
        `/bookings/${id}/cancel`,
        { reason },
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to cancel booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete booking
  async deleteBooking(id: string): Promise<void> {
    try {
      const response = await apiService.delete<void>(`/bookings/${id}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete booking");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get booking availability for a stylist
  async getStylistAvailability(
    stylistId: string,
    date: string,
    serviceId?: string,
  ): Promise<BookingAvailability> {
    try {
      const params: any = { date };
      if (serviceId) params.serviceId = serviceId;

      const response = await apiService.get<BookingAvailability>(
        `/bookings/availability/stylist/${stylistId}`,
        params,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch availability");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Check if time slot is available
  async checkTimeSlotAvailability(
    stylistId: string,
    date: string,
    startTime: string,
    duration: number,
    excludeBookingId?: string,
  ): Promise<boolean> {
    try {
      const params: any = {
        date,
        startTime,
        duration,
      };

      if (excludeBookingId) {
        params.excludeBookingId = excludeBookingId;
      }

      const response = await apiService.get<{ available: boolean }>(
        `/bookings/availability/check/${stylistId}`,
        params,
      );

      if (!response.success || response.data === undefined) {
        throw new Error(response.message || "Failed to check availability");
      }

      return response.data.available;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get bookings by customer
  async getCustomerBookings(
    customerId: string,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const response = await apiService.getPaginated<Booking>(
        `/bookings/customer/${customerId}`,
        pagination,
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get all bookings (for admin/manager)
  async getAllBookings(filters?: any): Promise<Booking[]> {
    try {
      const response = await apiService.get<Booking[]>("/bookings", filters);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch bookings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get bookings by stylist
  async getStylistBookings(
    stylistId: string,
    filters?: any,
    pagination?: PaginationParams,
  ): Promise<Booking[]> {
    try {
      const params = { ...filters, ...pagination };
      const response = await apiService.get<Booking[]>(
        `/bookings/stylist/${stylistId}`,
        params,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch stylist bookings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get bookings by stylist (paginated version)
  async getStylistBookingsPaginated(
    stylistId: string,
    filters?: { date?: string; status?: string },
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Booking>> {
    try {
      const params = { ...filters, ...pagination };
      const response = await apiService.getPaginated<Booking>(
        `/bookings/stylist/${stylistId}`,
        params,
      );
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get today's bookings
  async getTodaysBookings(stylistId?: string): Promise<Booking[]> {
    try {
      const params: any = {};
      if (stylistId) params.stylistId = stylistId;

      const response = await apiService.get<Booking[]>(
        "/bookings/today",
        params,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch today's bookings");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get upcoming bookings
  async getUpcomingBookings(
    limit: number = 10,
    stylistId?: string,
  ): Promise<Booking[]> {
    try {
      const params: any = { limit };
      if (stylistId) params.stylistId = stylistId;

      const response = await apiService.get<Booking[]>(
        "/bookings/upcoming",
        params,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch upcoming bookings",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get booking statistics
  async getBookingStats(filters?: BookingFilters): Promise<BookingStats> {
    try {
      const response = await apiService.get<BookingStats>(
        "/bookings/stats",
        filters,
      );

      if (!response.success || !response.data) {
        throw new Error(
          response.message || "Failed to fetch booking statistics",
        );
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Reschedule booking
  async rescheduleBooking(
    id: string,
    newDate: string,
    newStartTime: string,
  ): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(
        `/bookings/${id}/reschedule`,
        {
          bookingDate: newDate,
          startTime: newStartTime,
        },
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to reschedule booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Confirm booking
  async confirmBooking(id: string): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(
        `/bookings/${id}/confirm`,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to confirm booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Start booking (mark as in progress)
  async startBooking(id: string): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(`/bookings/${id}/start`);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to start booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Complete booking
  async completeBooking(id: string): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(
        `/bookings/${id}/complete`,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to complete booking");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mark as no show
  async markNoShow(id: string): Promise<Booking> {
    try {
      const response = await apiService.patch<Booking>(
        `/bookings/${id}/no-show`,
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to mark as no show");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get calendar events for bookings
  async getCalendarEvents(
    startDate: string,
    endDate: string,
    stylistId?: string,
  ): Promise<
    {
      id: string;
      title: string;
      start: string;
      end: string;
      status: string;
      customer: string;
      service: string;
      stylist: string;
    }[]
  > {
    try {
      const params: any = { startDate, endDate };
      if (stylistId) params.stylistId = stylistId;

      const response = await apiService.get("/bookings/calendar", params);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch calendar events");
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Export bookings
  async exportBookings(
    filters?: BookingFilters,
    format: "csv" | "xlsx" = "csv",
  ): Promise<Blob> {
    try {
      const response = await apiService.api.get("/bookings/export", {
        params: { ...filters, format },
        responseType: "blob",
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();

// Export class for testing
export { BookingService };
