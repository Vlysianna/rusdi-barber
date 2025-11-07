import { apiService } from "./api";
import {
  ApiResponse,
  PaginatedResponse,
  Review,
  ReviewFilter,
} from "../types/customTypes";

class ReviewService {
  private baseUrl = "/reviews";

  async getReviews(
    page: number = 1,
    limit: number = 10,
    filters?: ReviewFilter,
  ): Promise<PaginatedResponse<Review>> {
    return apiService.getPaginated<Review>(this.baseUrl, {
      page,
      limit,
      ...filters,
    });
  }

  async getReviewById(id: string): Promise<ApiResponse<Review>> {
    return apiService.get<Review>(`${this.baseUrl}/${id}`);
  }

  async createReview(
    reviewData: Partial<Review>,
  ): Promise<ApiResponse<Review>> {
    return apiService.post<Review>(this.baseUrl, reviewData);
  }

  async updateReview(
    id: string,
    reviewData: Partial<Review>,
  ): Promise<ApiResponse<Review>> {
    return apiService.put<Review>(`${this.baseUrl}/${id}`, reviewData);
  }

  async deleteReview(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  async approveReview(id: string): Promise<ApiResponse<Review>> {
    return apiService.patch<Review>(`${this.baseUrl}/${id}/approve`, {});
  }

  async rejectReview(
    id: string,
    reason?: string,
  ): Promise<ApiResponse<Review>> {
    return apiService.patch<Review>(`${this.baseUrl}/${id}/reject`, { reason });
  }

  async getReviewsByUserId(userId: string): Promise<ApiResponse<Review[]>> {
    return apiService.get<Review[]>(`${this.baseUrl}/user/${userId}`);
  }

  async getReviewsByStylistId(
    stylistId: string,
  ): Promise<ApiResponse<Review[]>> {
    return apiService.get<Review[]>(`${this.baseUrl}/stylist/${stylistId}`);
  }

  async getReviewsByServiceId(
    serviceId: string,
  ): Promise<ApiResponse<Review[]>> {
    return apiService.get<Review[]>(`${this.baseUrl}/service/${serviceId}`);
  }

  async getReviewStatistics(): Promise<
    ApiResponse<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<string, number>;
    }>
  > {
    return apiService.get<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Record<string, number>;
    }>(`${this.baseUrl}/statistics`);
  }
}

export const reviewService = new ReviewService();
