import { ApiResponse as BaseApiResponse } from "./index";

// Extended PaginatedResponse that includes direct access to pagination properties
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  avatar?: string;
  birthDate?: string;
  gender?: string;
  totalBookings?: number;
  totalSpent?: number;
  membershipLevel?: string;
  loyaltyPoints?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilter {
  search?: string;
  membershipLevel?: string;
  startDate?: string;
  endDate?: string;
  minBookings?: number;
  maxBookings?: number;
  minSpent?: number;
  maxSpent?: number;
}

// Payment types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: "pending" | "completed" | "cancelled" | "failed";
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  bookingId?: string;
  paymentMethod?: string;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  bookingId: string;
  stylistId: string;
  serviceId: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ReviewFilter {
  status?: string;
  rating?: number;
  stylistId?: string;
  serviceId?: string;
  startDate?: string;
  endDate?: string;
}

// Helper type for our API responses
export type ApiResponse<T> = BaseApiResponse<T>;
