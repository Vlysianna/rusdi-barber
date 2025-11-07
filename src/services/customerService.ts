import { apiService } from "./api";
import {
  ApiResponse,
  PaginatedResponse,
  Customer,
  CustomerFilter,
} from "../types/customTypes";

class CustomerService {
  private baseUrl = "/customers";

  async getCustomers(
    page: number = 1,
    limit: number = 10,
    filters?: CustomerFilter,
  ): Promise<PaginatedResponse<Customer>> {
    return apiService.getPaginated<Customer>(this.baseUrl, {
      page,
      limit,
      ...filters,
    });
  }

  async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
    return apiService.get<Customer>(`${this.baseUrl}/${id}`);
  }

  async createCustomer(
    customerData: Partial<Customer>,
  ): Promise<ApiResponse<Customer>> {
    return apiService.post<Customer>(this.baseUrl, customerData);
  }

  async updateCustomer(
    id: string,
    customerData: Partial<Customer>,
  ): Promise<ApiResponse<Customer>> {
    return apiService.put<Customer>(`${this.baseUrl}/${id}`, customerData);
  }

  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getCustomerBookingHistory(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<any>> {
    return apiService.getPaginated<any>(`${this.baseUrl}/${id}/bookings`, {
      page,
      limit,
    });
  }

  async getCustomerPaymentHistory(
    id: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<any>> {
    return apiService.getPaginated<any>(`${this.baseUrl}/${id}/payments`, {
      page,
      limit,
    });
  }

  async addLoyaltyPoints(
    id: string,
    points: number,
    reason?: string,
  ): Promise<ApiResponse<Customer>> {
    return apiService.post<Customer>(`${this.baseUrl}/${id}/loyalty-points`, {
      points,
      reason,
    });
  }

  async getCustomerStatistics(): Promise<
    ApiResponse<{
      totalCustomers: number;
      newCustomersThisMonth: number;
      customerRetentionRate: number;
      averageLifetimeValue: number;
    }>
  > {
    return apiService.get<{
      totalCustomers: number;
      newCustomersThisMonth: number;
      customerRetentionRate: number;
      averageLifetimeValue: number;
    }>(`${this.baseUrl}/statistics`);
  }

  async importCustomers(file: File): Promise<
    ApiResponse<{
      imported: number;
      failed: number;
      errors: any[];
    }>
  > {
    const formData = new FormData();
    formData.append("file", file);
    return apiService.upload<{
      imported: number;
      failed: number;
      errors: any[];
    }>(`${this.baseUrl}/import`, formData);
  }

  async exportCustomers(filters?: CustomerFilter): Promise<Blob> {
    const response = await apiService.api.get(`${this.baseUrl}/export`, {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  }
}

export const customerService = new CustomerService();
