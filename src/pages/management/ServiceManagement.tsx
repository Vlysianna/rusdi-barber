import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  DollarSign,
  Clock,
  Users,
  Filter,
  Tag,
  MoreVertical,
  Star,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { usePermissions } from "../../hooks/useAuth";
import { serviceService } from "../../services/serviceService";
import type { Service } from "../../types";

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  isPopular: boolean;
  requirements?: string[];
  instructions?: string;
  image?: string;
  tags?: string[];
}

const ServiceManagement: React.FC = () => {
  const { canManageServices, isAdmin } = usePermissions();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    price: 0,
    duration: 30,
    category: "haircut",
    isActive: true,
    isPopular: false,
    requirements: [],
    instructions: "",
    tags: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { value: "haircut", label: "Haircut", icon: "✂️" },
    { value: "beard_trim", label: "Beard Trim", icon: "🧔" },
    { value: "hair_wash", label: "Hair Wash", icon: "🧴" },
    { value: "styling", label: "Hair Styling", icon: "💇" },
    { value: "coloring", label: "Hair Coloring", icon: "🎨" },
    { value: "treatment", label: "Hair Treatment", icon: "💆" },
    { value: "package", label: "Package Deal", icon: "📦" },
  ];

  const commonTags = [
    "Premium",
    "Quick Service",
    "Popular",
    "Men's Special",
    "Wedding Package",
    "Student Discount",
    "Senior Friendly",
    "Trendy",
    "Classic",
    "Modern",
  ];

  useEffect(() => {
    if (canManageServices) {
      loadServices();
    }
  }, [canManageServices]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || service.category === filterCategory;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && service.isActive) ||
      (filterStatus === "inactive" && !service.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      duration: 30,
      category: "haircut",
      isActive: true,
      isPopular: false,
      requirements: [],
      instructions: "",
      tags: [],
    });
  };

  const handleCreateService = () => {
    resetForm();
    setSelectedService(null);
    setShowCreateModal(true);
  };

  const handleEditService = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      price: parseFloat(service.price),
      duration: service.duration,
      category: service.category,
      isActive: service.isActive,
      isPopular: service.isPopular || false,
      requirements: service.requirements || [],
      instructions: service.instructions || "",
      image: service.image,
      tags: service.tags || [],
    });
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const serviceData = {
        ...formData,
        price: formData.price.toString(),
        requirements: formData.requirements?.filter(req => req.trim() !== "") || [],
        tags: formData.tags || [],
      };

      if (selectedService) {
        await serviceService.updateService(selectedService.id, serviceData);
        setSuccess("Service updated successfully!");
        setShowEditModal(false);
      } else {
        await serviceService.createService(serviceData);
        setSuccess("Service created successfully!");
        setShowCreateModal(false);
      }

      await loadServices();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      await serviceService.updateService(service.id, {
        isActive: !service.isActive,
      });
      setSuccess(`Service ${!service.isActive ? 'activated' : 'deactivated'} successfully!`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service status");
    }
  };

  const handleTogglePopular = async (service: Service) => {
    try {
      await serviceService.updateService(service.id, {
        isPopular: !service.isPopular,
      });
      setSuccess(`Service ${!service.isPopular ? 'marked as popular' : 'unmarked as popular'}!`);
      await loadServices();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update popular status");
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!isAdmin) {
      setError("Only administrators can delete services");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
      try {
        await serviceService.deleteService(service.id);
        setSuccess("Service deleted successfully!");
        await loadServices();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete service");
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...(prev.requirements || []), ""],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements?.map((req, i) => (i === index ? value : req)) || [],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || [],
    }));
  };

  const renderServiceModal = (isEdit: boolean) => (
    <Modal
      isOpen={isEdit ? showEditModal : showCreateModal}
      onClose={() => {
        isEdit ? setShowEditModal(false) : setShowCreateModal(false);
        resetForm();
      }}
      title={isEdit ? "Edit Service" : "Create New Service"}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              placeholder="e.g., Classic Haircut"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (IDR) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              min="0"
              step="1000"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
              min="15"
              step="15"
              placeholder="30"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            required
            placeholder="Describe what this service includes..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonTags.map((tag) => (
              <label key={tag} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tags?.includes(tag) || false}
                  onChange={() => handleTagToggle(tag)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Customer Requirements/Preparations
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addRequirement}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {formData.requirements?.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={req}
                  onChange={(
e) => updateRequirement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Hair should be clean and dry"
                />
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions for Stylists
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={3}
            placeholder="Any special notes or techniques for this service..."
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Service is Active (Available for booking)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
              Mark as Popular Service
            </label>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              isEdit ? setShowEditModal(false) : setShowCreateModal(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Modal>
  );

  const renderDetailsModal = () => (
    <Modal
      isOpen={showDetailsModal}
      onClose={() => setShowDetailsModal(false)}
      title="Service Details"
      size="medium"
    >
      {selectedService && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl">
                {getCategoryInfo(selectedService.category).icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedService.name}</h3>
                <p className="text-gray-600">{getCategoryInfo(selectedService.category).label}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(parseFloat(selectedService.price))}
              </div>
              <div className="text-sm text-gray-500">{formatDuration(selectedService.duration)}</div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              selectedService.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {selectedService.isActive ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
              {selectedService.isActive ? "Active" : "Inactive"}
            </span>
            {selectedService.isPopular && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                Popular
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700">{selectedService.description}</p>
          </div>

          {/* Tags */}
          {selectedService.tags && selectedService.tags.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedService.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {selectedService.requirements && selectedService.requirements.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Customer Requirements</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedService.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {selectedService.instructions && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Stylist Instructions</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedService.instructions}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{selectedService.bookingCount || 0}</div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{selectedService.rating?.toFixed(1) || "0.0"}</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency((selectedService.bookingCount || 0) * parseFloat(selectedService.price))}
              </div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  if (!canManageServices) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage services.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Manage services, pricing, and availability</p>
        </div>
        <Button onClick={handleCreateService} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popular Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter(s => s.isPopular).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.length > 0 ? formatCurrency(
                    services.reduce((sum, s) => sum + parseFloat(s.price), 0) / services.length
                  ) : formatCurrency(0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <Card.Body>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-
2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow">
              <Card.
