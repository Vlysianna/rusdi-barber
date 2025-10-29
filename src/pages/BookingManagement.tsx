import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  User,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Download,
  Eye,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { bookingService } from "../services/bookingService";
import type { Booking, BookingFilters } from "../types";
import { BookingStatus } from "../types";

export interface UpdateBookingRequest {
  stylistId?: string;
  serviceId?: string;
  bookingDate?: string;
  startTime?: string;
  status?: string;
  notes?: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<BookingFilters>({
    status: [],
    search: "",
    dateFrom: "",
    dateTo: "",
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [pagination.page, filters]);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bookingService.getBookings(filters, {
        page: pagination.page,
        limit: pagination.limit,
      });

      setBookings(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const handleStatusChange = async (status: string) => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);
      await bookingService.updateBookingStatus(selectedBooking.id, status);

      // Update booking in the list
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id ? { ...booking, status } : booking,
        ),
      );

      setShowStatusModal(false);
      setSelectedBooking(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update booking status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      setActionLoading(true);
      await bookingService.deleteBooking(selectedBooking.id);

      // Remove booking from the list
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== selectedBooking.id),
      );

      setShowDeleteModal(false);
      setSelectedBooking(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await bookingService.exportBookings(filters, "csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to export bookings",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case BookingStatus.CONFIRMED:
      case BookingStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case BookingStatus.CANCELLED:
      case BookingStatus.NO_SHOW:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4" />;
      case BookingStatus.CANCELLED:
      case BookingStatus.NO_SHOW:
        return <XCircle className="w-4 h-4" />;
      case BookingStatus.PENDING:
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <Card.Body>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Booking
          </h1>
          <p className="text-gray-600">
            Kelola semua booking pelanggan dan ubah status booking
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>
            Booking Baru
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="form-input pl-10"
                placeholder="Cari nama pelanggan..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>

            {/* Status Filter */}
            <select
              className="form-input"
              value={filters.status?.[0] || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value ? [e.target.value] : [],
                }))
              }
            >
              <option value="">Semua Status</option>
              <option value={BookingStatus.PENDING}>Pending</option>
              <option value={BookingStatus.CONFIRMED}>Confirmed</option>
              <option value={BookingStatus.IN_PROGRESS}>In Progress</option>
              <option value={BookingStatus.COMPLETED}>Completed</option>
              <option value={BookingStatus.CANCELLED}>Cancelled</option>
              <option value={BookingStatus.NO_SHOW}>No Show</option>
            </select>

            {/* Date From */}
            <input
              type="date"
              className="form-input"
              value={filters.dateFrom || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
            />

            {/* Date To */}
            <input
              type="date"
              className="form-input"
              value={filters.dateTo || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Menampilkan {bookings.length} dari {pagination.total} booking
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({
                  status: [],
                  search: "",
                  dateFrom: "",
                  dateTo: "",
                });
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              Reset Filter
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Pelanggan</th>
                <th className="table-header-cell">Stylist</th>
                <th className="table-header-cell">Layanan</th>
                <th className="table-header-cell">Tanggal & Waktu</th>
                <th className="table-header-cell">Total</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Aksi</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {booking.customer.avatar ? (
                          <img
                            src={booking.customer.avatar}
                            alt={booking.customer.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.customer.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {booking.stylist.user.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ⭐ {booking.stylist.rating.toFixed(1)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {booking.service.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.service.duration} menit
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {formatDate(booking.bookingDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(booking.startTime)} -{" "}
                      {formatTime(booking.endTime)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(booking.totalPrice)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="ml-1">
                        {booking.status.replace("_", " ")}
                      </span>
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        icon={<Eye className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowStatusModal(true);
                        }}
                        icon={<Edit className="w-4 h-4" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDeleteModal(true);
                        }}
                        icon={<Trash2 className="w-4 h-4" />}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Halaman {pagination.page} dari {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Ubah Status Booking"
        size="md"
      >
        <Modal.Body>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Detail Booking
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Pelanggan: {selectedBooking.customer.fullName}</p>
                  <p>Stylist: {selectedBooking.stylist.user.fullName}</p>
                  <p>Layanan: {selectedBooking.service.name}</p>
                  <p>Tanggal: {formatDate(selectedBooking.bookingDate)}</p>
                  <p>Status Saat Ini: {selectedBooking.status}</p>
                </div>
              </div>

              <div>
                <label className="form-label">Pilih Status Baru</label>
                <div className="space-y-2 mt-2">
                  {Object.values(BookingStatus).map((status: string) => (
                    <button
                      key={status}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedBooking.status === status
                          ? "border-gray-300 bg-gray-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => handleStatusChange(status)}
                      disabled={
                        selectedBooking.status === status || actionLoading
                      }
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(status)}
                        <span className="font-medium">
                          {status.replace("_", " ")}
                        </span>
                      </div>
                      {selectedBooking.status === status && (
                        <span className="text-sm text-gray-500">Current</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setShowStatusModal(false)}
            disabled={actionLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detail Booking"
        size="lg"
      >
        <Modal.Body>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Informasi Pelanggan
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedBooking.customer.avatar ? (
                        <img
                          src={selectedBooking.customer.avatar}
                          alt={selectedBooking.customer.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {selectedBooking.customer.fullName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedBooking.customer.email}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedBooking.customer.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Informasi Layanan
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Layanan</div>
                      <div className="font-medium">
                        {selectedBooking.service.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Stylist</div>
                      <div className="font-medium">
                        {selectedBooking.stylist.user.fullName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Durasi</div>
                      <div className="font-medium">
                        {selectedBooking.service.duration} menit
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Harga</div>
                      <div className="font-medium">
                        {formatCurrency(selectedBooking.totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Informasi Booking
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Tanggal</div>
                      <div className="font-medium">
                        {formatDate(selectedBooking.bookingDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Waktu</div>
                      <div className="font-medium">
                        {formatTime(selectedBooking.startTime)} -{" "}
                        {formatTime(selectedBooking.endTime)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Status</div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}
                        >
                          {getStatusIcon(selectedBooking.status)}
                          <span className="ml-1">
                            {selectedBooking.status.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Dibuat</div>
                      <div className="font-medium">
                        {new Date(selectedBooking.createdAt).toLocaleDateString(
                          "id-ID",
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-600">Catatan</div>
                      <div className="font-medium">{selectedBooking.notes}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              {selectedBooking.payment && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Informasi Pembayaran
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">
                          Metode Pembayaran
                        </div>
                        <div className="font-medium">
                          {selectedBooking.payment.paymentMethod}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Status Pembayaran
                        </div>
                        <div className="font-medium">
                          {selectedBooking.payment.status}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="font-medium">
                          {formatCurrency(selectedBooking.payment.amount)}
                        </div>
                      </div>
                      {selectedBooking.payment.paidAt && (
                        <div>
                          <div className="text-sm text-gray-600">
                            Dibayar Pada
                          </div>
                          <div className="font-medium">
                            {new Date(
                              selectedBooking.payment.paidAt,
                            ).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedBooking(selectedBooking);
              setShowDetailsModal(false);
              setShowStatusModal(true);
            }}
          >
            Ubah Status
          </Button>
          <Button variant="ghost" onClick={() => setShowDetailsModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Konfirmasi Hapus"
        size="md"
      >
        <Modal.Body>
          {selectedBooking && (
            <div>
              <p className="text-gray-600 mb-4">
                Apakah Anda yakin ingin menghapus booking dari{" "}
                <span className="font-medium">
                  {selectedBooking.customer.fullName}
                </span>{" "}
                pada tanggal{" "}
                <span className="font-medium">
                  {formatDate(selectedBooking.bookingDate)}
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  ⚠️ Tindakan ini tidak dapat dibatalkan. Booking akan dihapus
                  secara permanen.
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleDeleteBooking}
            loading={actionLoading}
          >
            Hapus Booking
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(false)}
            disabled={actionLoading}
          >
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingManagement;
