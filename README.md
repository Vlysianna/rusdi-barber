# Rusdi Barber Dashboard

Dashboard admin untuk sistem manajemen barbershop Rusdi Barber. Dashboard ini dibangun dengan React, TypeScript, dan Tailwind CSS untuk mengelola booking, stylist, layanan, pembayaran, dan analitik bisnis.

## 🚀 Features

### Dashboard Utama
- **Statistik Real-time**: Total pelanggan, booking, pendapatan, dan rating rata-rata
- **Grafik Performa**: Visualisasi data booking dan pendapatan bulanan
- **Quick Actions**: Akses cepat ke fitur-fitur utama
- **Notifikasi**: Alert untuk booking baru, pembayaran, dan review

### Manajemen Booking
- **CRUD Booking**: Create, Read, Update, Delete booking pelanggan
- **Status Management**: Ubah status booking (Pending, Confirmed, In Progress, Completed, Cancelled, No Show)
- **Filter & Search**: Cari berdasarkan nama pelanggan, tanggal, status, dan stylist
- **Export Data**: Export booking ke format CSV/Excel
- **Calendar View**: Tampilan kalender untuk jadwal booking

### Manajemen Stylist
- **Profile Management**: Kelola data stylist, foto profil, dan bio
- **Spesialisasi**: Set dan edit keahlian khusus stylist
- **Jam Kerja**: Atur jadwal kerja per hari dalam seminggu
- **Performance Tracking**: Monitor performa dan rating stylist
- **Availability Calendar**: Jadwal ketersediaan stylist

### Manajemen Layanan
- **Service Catalog**: CRUD layanan barbershop
- **Kategori Layanan**: Organisir layanan berdasarkan kategori
- **Pricing Management**: Atur harga dan durasi layanan
- **Popular Services**: Track layanan paling diminati

### Manajemen Pembayaran
- **Payment Tracking**: Monitor status pembayaran semua booking
- **Multiple Payment Methods**: Cash, Credit Card, Digital Wallet, Bank Transfer
- **Refund Management**: Proses refund dan partial refund
- **Financial Reports**: Laporan keuangan dan pendapatan

### Ulasan & Rating
- **Review Management**: Moderasi ulasan pelanggan
- **Rating Analytics**: Analisis rating dan feedback
- **Content Moderation**: Hapus atau sembunyikan review tidak pantas
- **Response Management**: Balas ulasan pelanggan

### Manajemen Pelanggan
- **Customer Database**: Database lengkap pelanggan
- **Booking History**: Riwayat booking setiap pelanggan
- **Loyalty Program**: Sistem poin dan reward pelanggan
- **Customer Insights**: Analisis perilaku pelanggan

### Promo & Loyalty
- **Discount Codes**: Buat dan kelola kode promo
- **Loyalty Points**: Sistem poin reward untuk pelanggan setia
- **Campaign Management**: Atur kampanye marketing
- **Usage Analytics**: Track penggunaan promo dan efektivitas

### Laporan & Analitik
- **Revenue Reports**: Laporan pendapatan harian, mingguan, bulanan
- **Performance Metrics**: KPI bisnis dan metrik performa
- **Customer Analytics**: Analisis demografi dan behavior pelanggan
- **Trend Analysis**: Analisis tren bisnis dan seasonal patterns
- **Export Reports**: Export laporan ke PDF/Excel

## 🛠 Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Utility-first CSS Framework
- **React Router** - Client-side Routing
- **Lucide React** - Icon Library
- **Recharts** - Charts & Data Visualization
- **Axios** - HTTP Client

### Backend Integration
- **Node.js API** - RESTful API
- **JWT Authentication** - Secure Authentication
- **Role-based Access Control** - User Permissions
- **Real-time Updates** - WebSocket Integration

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Backend API (Rusdi Barber API)

## 🚀 Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/rusdi-barber-dashboard.git
   cd rusdi-barber-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file dengan konfigurasi yang sesuai:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   VITE_APP_NAME=Rusdi Barber Dashboard
   VITE_APP_VERSION=1.0.0
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI Components
│   ├── ui/              # Base UI Components (Button, Card, Modal, etc.)
│   └── dashboard/       # Dashboard-specific Components
├── pages/               # Page Components
├── services/            # API Services
├── hooks/               # Custom React Hooks
├── types/               # TypeScript Type Definitions
├── utils/               # Utility Functions
└── assets/              # Static Assets
```

## 🔐 Authentication

Dashboard menggunakan JWT-based authentication dengan role-based access control:

- **ADMIN**: Full access ke semua fitur
- **MANAGER**: Access ke manajemen operational
- **STYLIST**: Access terbatas ke booking dan schedule pribadi
- **CUSTOMER**: Read-only access (future feature)

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first, tablet, dan desktop friendly
- **Dark/Light Mode**: Theme switching (future feature)
- **Accessibility**: WCAG compliant
- **Loading States**: Skeleton loading dan progress indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Modal Dialogs**: Contextual actions dan confirmations

## 📊 Dashboard Analytics

- **Real-time Metrics**: Live updates via WebSocket
- **Interactive Charts**: Hover effects dan drill-down capabilities
- **Date Range Filters**: Custom date selection
- **Export Functionality**: PDF, Excel, CSV exports
- **Print Friendly**: Optimized print layouts

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1

# App Configuration  
VITE_APP_NAME=Rusdi Barber Dashboard
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_EXPORT=true

# UI Configuration
VITE_DEFAULT_PAGE_SIZE=10
VITE_MAX_PAGE_SIZE=100
```

### API Endpoints
Dashboard terintegrasi dengan endpoints berikut:
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/bookings` - Booking management
- `GET /api/v1/stylists` - Stylist management
- `GET /api/v1/services` - Service management
- `GET /api/v1/payments` - Payment tracking
- `GET /api/v1/reviews` - Review management

## 🧪 Testing

```bash
# Run Tests
npm run test

# Run Tests with Coverage
npm run test:coverage

# E2E Tests
npm run test:e2e
```

## 📱 Mobile Support

Dashboard fully responsive dan mendukung:
- **Touch Gestures**: Swipe, tap, long press
- **Mobile Navigation**: Hamburger menu dan bottom navigation
- **Optimized Forms**: Mobile-friendly input fields
- **Fast Loading**: Optimized bundle size untuk mobile

## 🚀 Performance

- **Code Splitting**: Lazy loading components
- **Bundle Optimization**: Tree shaking dan minimization
- **Image Optimization**: WebP format dan lazy loading
- **Caching Strategy**: Service worker caching
- **Fast Refresh**: Hot module replacement

## 📈 Monitoring

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Web Vitals tracking
- **Usage Analytics**: Google Analytics integration
- **Real User Monitoring**: Performance metrics

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: Your Name
- **UI/UX Designer**: Designer Name  
- **Backend Developer**: Backend Developer Name
- **Product Owner**: Product Owner Name

## 📞 Support

Untuk support dan pertanyaan:
- Email: support@rusdibarber.com
- Phone: +62 XXX XXX XXXX
- Website: https://rusdibarber.com

## 🔄 Changelog

### Version 1.0.0
- ✅ Dashboard utama dengan statistik
- ✅ Manajemen booking lengkap
- ✅ Manajemen stylist dan layanan
- ✅ Authentication dan authorization
- ✅ Responsive design
- ✅ Export functionality

### Upcoming Features
- 🔄 Real-time notifications
- 🔄 Advanced analytics
- 🔄 Mobile app integration
- 🔄 WhatsApp integration
- 🔄 Multi-location support

---

Made with ❤️ by Rusdi Barber Team