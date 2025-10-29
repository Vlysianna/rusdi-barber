// Mock service for dashboard data - used for demo purposes
import type { DashboardStats } from '../types';

// Mock data
const mockDashboardStats: DashboardStats = {
  totalCustomers: 456,
  totalBookings: 1234,
  totalRevenue: "15750000",
  averageRating: 4.8,
  todayBookings: 23,
  monthlyBookings: 342,
  pendingBookings: 8,
  completedBookings: 18,
  cancelledBookings: 5,
  topStylists: [
    {
      id: "1",
      name: "Ahmad Stylist",
      avatar: undefined,
      rating: 4.9,
      totalBookings: 156,
      revenue: "2450000"
    },
    {
      id: "2",
      name: "Budi Barber",
      avatar: undefined,
      rating: 4.8,
      totalBookings: 134,
      revenue: "2100000"
    },
    {
      id: "3",
      name: "Candra Hair",
      avatar: undefined,
      rating: 4.7,
      totalBookings: 128,
      revenue: "1980000"
    }
  ],
  recentBookings: [
    {
      id: "1",
      customerId: "c1",
      customer: {
        id: "c1",
        email: "john@example.com",
        username: "john_doe",
        fullName: "John Doe",
        phone: "+628123456789",
        role: "CUSTOMER",
        isActive: true,
        emailVerified: true,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z"
      },
      stylistId: "s1",
      stylist: {
        id: "s1",
        userId: "u1",
        user: {
          id: "u1",
          email: "ahmad@example.com",
          username: "ahmad_stylist",
          fullName: "Ahmad Stylist",
          phone: "+628111111111",
          role: "STYLIST",
          isActive: true,
          emailVerified: true,
          createdAt: "2024-01-01T08:00:00Z",
          updatedAt: "2024-01-01T08:00:00Z"
        },
        bio: "Experienced stylist with 5+ years",
        profileImage: undefined,
        specializations: ["Classic Cut", "Modern Style"],
        experience: 5,
        rating: 4.9,
        totalReviews: 156,
        isActive: true,
        workingHours: [],
        createdAt: "2024-01-01T08:00:00Z",
        updatedAt: "2024-01-01T08:00:00Z"
      },
      serviceId: "sv1",
      service: {
        id: "sv1",
        categoryId: "cat1",
        category: {
          id: "cat1",
          name: "Hair Cut",
          description: "Professional hair cutting services",
          isActive: true,
          createdAt: "2024-01-01T08:00:00Z",
          updatedAt: "2024-01-01T08:00:00Z"
        },
        name: "Classic Hair Cut",
        description: "Traditional professional hair cut",
        price: "50000",
        duration: 45,
        isActive: true,
        createdAt: "2024-01-01T08:00:00Z",
        updatedAt: "2024-01-01T08:00:00Z"
      },
      bookingDate: "2024-01-20",
      startTime: "10:00",
      endTime: "10:45",
      status: "CONFIRMED",
      notes: "Customer prefers shorter sides",
      totalPrice: "50000",
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z"
    }
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: "12500000", bookings: 156 },
    { month: "Feb", revenue: "14200000", bookings: 178 },
    { month: "Mar", revenue: "15750000", bookings: 195 }
  ],
  bookingsByStatus: [
    { status: "COMPLETED", count: 890, percentage: 72.1 },
    { status: "CONFIRMED", count: 156, percentage: 12.6 },
    { status: "PENDING", count: 98, percentage: 7.9 },
    { status: "CANCELLED", count: 67, percentage: 5.4 },
    { status: "NO_SHOW", count: 23, percentage: 1.9 }
  ]
};

export class MockDashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockDashboardStats;
  }
}

export const mockDashboardService = new MockDashboardService();
