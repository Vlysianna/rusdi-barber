import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  reviewService,
  type Review,
  type ReviewFilter,
} from "../services/reviewService";

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-600">{rating}/5</span>
    </div>
  );
};

const ReviewStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { color: string; bg: string; text: string }
  > = {
    pending: {
      color: "text-yellow-700",
      bg: "bg-yellow-100",
      text: "Menunggu Moderasi",
    },
    approved: {
      color: "text-green-700",
      bg: "bg-green-100",
      text: "Disetujui",
    },
    rejected: {
      color: "text-red-700",
      bg: "bg-red-100",
      text: "Ditolak",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
    >
      {config.text}
    </span>
  );
};

const UlasanRating: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<ReviewFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statistics, setStatistics] = useState<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<string, number>;
  }>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await reviewService.getReviews(page, 10, filters);
      setReviews(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch reviews data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await reviewService.getReviewStatistics();
      setStatistics(response.data);
    } catch (err) {
      console.error("Failed to fetch review statistics:", err);
    }
  }, []);

  const handleFilterChange = (newFilters: ReviewFilter) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  useEffect(() => {
    fetchReviews();
    fetchStatistics();
  }, [fetchReviews, fetchStatistics]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would update the filters with the search term
    console.log("Searching for:", searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      await reviewService.approveReview(id);
      // Update the review in the local state
      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, status: "approved" } : review,
        ),
      );
    } catch (err) {
      console.error("Failed to approve review:", err);
    }
  };

  const handleRejectReview = async (id: string) => {
    try {
      await reviewService.rejectReview(id);
      // Update the review in the local state
      setReviews(
        reviews.map((review) =>
          review.id === id ? { ...review, status: "rejected" } : review,
        ),
      );
    } catch (err) {
      console.error("Failed to reject review:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Ulasan & Rating
        </h1>
        <p className="text-gray-600">Moderasi ulasan dan kelola rating</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Rating Rata-rata
              </p>
              <h3 className="text-xl font-bold">
                {statistics.averageRating.toFixed(1)}/5.0
              </h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ulasan</p>
              <h3 className="text-xl font-bold">{statistics.totalReviews}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ulasan Disetujui
              </p>
              <h3 className="text-xl font-bold">
                {statistics.ratingDistribution?.approved || 0}
              </h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Menunggu Moderasi
              </p>
              <h3 className="text-xl font-bold">
                {statistics.ratingDistribution?.pending || 0}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex gap-2">
          <div>
            <Button
              variant={filters.status === undefined ? "primary" : "secondary"}
              onClick={() => handleFilterChange({ status: undefined })}
              size="sm"
            >
              Semua
            </Button>
          </div>
          <div>
            <Button
              variant={filters.status === "approved" ? "primary" : "secondary"}
              onClick={() => handleFilterChange({ status: "approved" })}
              size="sm"
            >
              Disetujui
            </Button>
          </div>
          <div>
            <Button
              variant={filters.status === "pending" ? "primary" : "secondary"}
              onClick={() => handleFilterChange({ status: "pending" })}
              size="sm"
            >
              Menunggu
            </Button>
          </div>
          <div>
            <Button
              variant={filters.status === "rejected" ? "primary" : "secondary"}
              onClick={() => handleFilterChange({ status: "rejected" })}
              size="sm"
            >
              Ditolak
            </Button>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-l-md w-full"
                placeholder="Cari ulasan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button type="submit" className="rounded-l-none">
              Cari
            </Button>
          </form>

          <Button variant="secondary" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>

          <Button variant="secondary" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Reviews */}
      {error ? (
        <Card>
          <div className="text-center p-4 text-red-600">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={fetchReviews}
            >
              Coba Lagi
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                        {review.userDetails?.avatar ? (
                          <img
                            src={review.userDetails.avatar}
                            alt={review.userDetails.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
                            {review.userDetails?.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {review.userDetails?.name || "Anonymous User"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <RatingStars rating={review.rating} />
                    </div>

                    <p className="text-gray-700 mb-2">{review.comment}</p>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Layanan: Haircut
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Stylist: John Doe
                        </span>
                      </div>
                    </div>

                    <div>
                      <ReviewStatusBadge status={review.status} />
                    </div>
                  </div>

                  {review.status === "pending" && (
                    <div className="flex flex-row sm:flex-col gap-2 justify-end">
                      <Button
                        onClick={() => handleApproveReview(review.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Setujui
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleRejectReview(review.id)}
                        className="flex items-center gap-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Tolak
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center p-8 text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Tidak ada ulasan yang ditemukan</p>
              </div>
            </Card>
          )}

          {/* Pagination */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{(page - 1) * 10 + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(page * 10, totalPages * 10)}
                    </span>{" "}
                    of <span className="font-medium">{totalPages * 10}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Page numbers would go here */}
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {page}
                    </button>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UlasanRating;
