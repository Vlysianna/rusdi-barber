import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  paymentService,
  type Payment,
  type PaymentFilter,
} from "../services/paymentService";

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { color: string; bg: string; text: string }
  > = {
    pending: {
      color: "text-yellow-700",
      bg: "bg-yellow-100",
      text: "Menunggu Pembayaran",
    },
    completed: {
      color: "text-green-700",
      bg: "bg-green-100",
      text: "Pembayaran Selesai",
    },
    cancelled: {
      color: "text-gray-700",
      bg: "bg-gray-100",
      text: "Dibatalkan",
    },
    failed: {
      color: "text-red-700",
      bg: "bg-red-100",
      text: "Gagal",
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

const Pembayaran: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<PaymentFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await paymentService.getPayments(page, 10, filters);
      setPayments(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payments data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleFilterChange = (newFilters: PaymentFilter) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would update the filters
    console.log("Searching for:", searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && payments.length === 0) {
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
          Manajemen Pembayaran
        </h1>
        <p className="text-gray-600">
          Kelola pembayaran dan transaksi pelanggan
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Pendapatan
              </p>
              <h3 className="text-xl font-bold">Rp 15.750.000</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pembayaran Selesai
              </p>
              <h3 className="text-xl font-bold">125 transaksi</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Menunggu Pembayaran
              </p>
              <h3 className="text-xl font-bold">12 transaksi</h3>
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
              variant={filters.status === "completed" ? "primary" : "secondary"}
              onClick={() => handleFilterChange({ status: "completed" })}
              size="sm"
            >
              Selesai
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
              variant={filters.status === "failed" ? "primary" : "secondary"}
              onClick={() => handleFilterChange({ status: "failed" })}
              size="sm"
            >
              Gagal
            </Button>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-l-md w-full"
                placeholder="Cari transaksi..."
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

      {/* Payments Table */}
      {error ? (
        <Card>
          <div className="text-center p-4 text-red-600">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={fetchPayments}
            >
              Coba Lagi
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Transaksi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* This would be replaced with real data from API */}
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.transactionId || payment.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* This would come from related booking data */}
                        John Doe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PaymentStatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(`/dashboard/payments/${payment.id}`)
                            }
                          >
                            Detail
                          </Button>
                          {payment.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                // Process payment logic
                                console.log("Process payment", payment.id);
                              }}
                            >
                              Proses
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {payments.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
        </Card>
      )}
    </div>
  );
};

export default Pembayaran;
