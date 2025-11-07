import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  UserPlus,
  Edit,
  Trash,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  customerService,
  type Customer,
  type CustomerFilter,
} from "../services/customerService";

const Pelanggan: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<CustomerFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statistics, setStatistics] = useState<{
    totalCustomers: number;
    newCustomersThisMonth: number;
    customerRetentionRate: number;
    averageLifetimeValue: number;
  }>({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    customerRetentionRate: 0,
    averageLifetimeValue: 0,
  });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await customerService.getCustomers(page, 10, {
        ...filters,
        search: searchTerm,
      });
      setCustomers(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Failed to fetch customer data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters, searchTerm]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await customerService.getCustomerStatistics();
      setStatistics(response.data);
    } catch (err) {
      console.error("Failed to fetch customer statistics:", err);
    }
  }, []);

  const handleFilterChange = (newFilters: CustomerFilter) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  useEffect(() => {
    fetchCustomers();
    fetchStatistics();
  }, [fetchCustomers, fetchStatistics]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      } catch (err) {
        console.error("Failed to delete customer:", err);
      }
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && customers.length === 0) {
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
          Manajemen Pelanggan
        </h1>
        <p className="text-gray-600">
          Kelola data pelanggan dan riwayat booking
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Pelanggan
              </p>
              <h3 className="text-xl font-bold">{statistics.totalCustomers}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pelanggan Baru
              </p>
              <h3 className="text-xl font-bold">
                {statistics.newCustomersThisMonth}
              </h3>
              <p className="text-xs text-gray-500">Bulan ini</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Retensi Pelanggan
              </p>
              <h3 className="text-xl font-bold">
                {statistics.customerRetentionRate}%
              </h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Nilai Rata-rata
              </p>
              <h3 className="text-xl font-bold">
                {formatCurrency(statistics.averageLifetimeValue)}
              </h3>
              <p className="text-xs text-gray-500">Per pelanggan</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-lg border border-gray-200">
        <Button
          onClick={() => navigate("/dashboard/customers/new")}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Pelanggan Baru
        </Button>

        <div className="flex gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-l-md w-full"
                placeholder="Cari pelanggan..."
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

      {/* Customers Table */}
      {error ? (
        <Card>
          <div className="text-center p-4 text-red-600">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p>{error}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={fetchCustomers}
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
                    Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Sejak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Booking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pengeluaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                            {customer.avatar ? (
                              <img
                                src={customer.avatar}
                                alt={customer.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
                                {customer.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.name}
                            </div>
                            {customer.gender && (
                              <div className="text-sm text-gray-500">
                                {customer.gender === "male" ? "Pria" : "Wanita"}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />{" "}
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />{" "}
                            {customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.totalBookings || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.membershipLevel && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {customer.membershipLevel}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(`/dashboard/customers/${customer.id}`)
                            }
                          >
                            Detail
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/dashboard/customers/edit/${customer.id}`,
                              )
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
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
                      Tidak ada data pelanggan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {customers.length > 0 && (
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

export default Pelanggan;
