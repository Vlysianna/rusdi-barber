import { apiService } from "./api";
import {
  ApiResponse,
  PaginatedResponse,
  Payment,
  PaymentFilter,
} from "../types/customTypes";

class PaymentService {
  private baseUrl = "/payments";

  async getPayments(
    page: number = 1,
    limit: number = 10,
    filters?: PaymentFilter,
  ): Promise<PaginatedResponse<Payment>> {
    return apiService.getPaginated<Payment>(this.baseUrl, {
      page,
      limit,
      ...filters,
    });
  }

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    return apiService.get<Payment>(`${this.baseUrl}/${id}`);
  }

  async createPayment(
    paymentData: Partial<Payment>,
  ): Promise<ApiResponse<Payment>> {
    return apiService.post<Payment>(this.baseUrl, paymentData);
  }

  async updatePayment(
    id: string,
    paymentData: Partial<Payment>,
  ): Promise<ApiResponse<Payment>> {
    return apiService.put<Payment>(`${this.baseUrl}/${id}`, paymentData);
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getPaymentsByBookingId(
    bookingId: string,
  ): Promise<ApiResponse<Payment[]>> {
    return apiService.get<Payment[]>(`${this.baseUrl}/booking/${bookingId}`);
  }

  async processPayment(
    bookingId: string,
    paymentMethod: string,
    amount: number,
  ): Promise<ApiResponse<Payment>> {
    return apiService.post<Payment>(`${this.baseUrl}/process`, {
      bookingId,
      paymentMethod,
      amount,
    });
  }
}

export const paymentService = new PaymentService();
