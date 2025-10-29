# Getting Started - Rusdi Barber Dashboard

Selamat datang di Rusdi Barber Dashboard! Panduan ini akan membantu Anda menjalankan aplikasi dashboard admin untuk sistem manajemen barbershop.

## 🚀 Quick Start

### 1. Instalasi Dependencies

```bash
npm install
```

### 2. Konfigurasi Environment

Salin file environment example:
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi yang sesuai:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Rusdi Barber Dashboard
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
```

### 3. Memastikan Backend API Berjalan

Pastikan backend API Rusdi Barber sudah running di `http://localhost:3000`:

```bash
# Di folder rusdi-barber-be
cd ../rusdi-barber-be
npm run dev
```

Cek apakah backend berjalan dengan mengakses: `http://localhost:3000/api/v1/health`

### 4. Menjalankan Aplikasi

Untuk development (dengan TypeScript checking):
```bash
npm run dev
```

Untuk development (tanpa TypeScript checking - recommended saat ini):
```bash
npm run dev:nocheck
```

Aplikasi akan berjalan di: `http://localhost:5173`

### 5. Mode Operasi

Dashboard memiliki 2 mode operasi:

#### 🌐 **Online Mode** (Backend Connected)
- Menggunakan data real dari backend API
- Menampilkan indikator "Online" di header
- Semua fitur fully functional

#### 🔄 **Demo Mode** (Backend Offline)  
- Menggunakan mock data untuk demo
- Menampilkan indikator "Demo Mode" di header
- Interface tetap berfungsi dengan sample data

### 6. Login ke Dashboard

Gunakan kredensial demo berikut:
- **Email**: `admin@example.com`
- **Password**: `password`

Atau klik tombol "Login" langsung (mock authentication aktif).

## 📱 Fitur yang Tersedia

### ✅ Sudah Implementasi
- **Dashboard Utama**: Statistik real-time (backend + mock data)
- **Manajemen Booking**: Interface lengkap untuk kelola booking
- **Authentication**: Mock login system
- **Responsive Design**: Mobile-friendly UI
- **Navigation**: Sidebar dengan role-based access
- **Connection Status**: Auto-detect backend availability
- **Error Handling**: Error boundary untuk crash protection

### 🔄 Dalam Pengembangan
- **Backend Integration**: Complete API integration
- **Manajemen Stylist**: CRUD stylist dan jadwal  
- **Manajemen Layanan**: CRUD services dan kategori
- **Manajemen Pembayaran**: Payment tracking dan refund
- **Ulasan & Rating**: Review moderation system
- **Laporan & Analitik**: Advanced reporting tools

## 🛠 Development Status

### Current Implementation
```
✅ Project Setup & Configuration
✅ UI Components (Button, Card, Modal, etc.)
✅ Dashboard Layout & Navigation
✅ Authentication Flow
✅ Dashboard Statistics (Mock Data)
✅ Booking Management Interface
✅ Responsive Design
✅ TypeScript Configuration
✅ Tailwind CSS Styling
```

### Next Steps
```
🔄 Connect to Real API
🔄 Complete Stylist Management
🔄 Complete Service Management
🔄 Payment Integration
🔄 Review System
🔄 Real-time Notifications
🔄 Advanced Analytics
🔄 Testing Suite
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive**: Works on desktop, tablet, dan mobile
- **Dark Theme Ready**: Prepared for dark mode (future)
- **Accessibility**: WCAG compliant components
- **Loading States**: Skeleton loading dan progress indicators
- **Interactive Elements**: Hover effects, transitions
- **Modal Dialogs**: Contextual actions dan confirmations

## 📊 Dashboard Features

### Main Dashboard
- Total customers, bookings, revenue, average rating
- Monthly performance charts
- Top performing stylists
- Recent bookings list
- Quick status overview

### Booking Management
- Complete CRUD operations
- Status management (Pending → Confirmed → Completed)
- Advanced filtering dan search
- Export functionality (CSV/Excel)
- Calendar integration ready

### User Management
- Role-based access control
- Profile management
- Authentication flow
- Session management

## 🔧 Technical Architecture

### Frontend Stack
```
React 19          - UI Library
TypeScript        - Type Safety
Vite             - Build Tool
Tailwind CSS     - Styling
React Router     - Routing
Axios            - HTTP Client
Lucide React     - Icons
```

### Project Structure
```
src/
├── components/
│   ├── ui/           - Reusable UI components
│   └── dashboard/    - Dashboard-specific components
├── pages/            - Page components
├── services/         - API services & mock data
├── types/            - TypeScript definitions
├── hooks/            - Custom React hooks (future)
└── utils/            - Utility functions (future)
```

## 🚨 Known Issues & Solutions

### Backend Connection Issues
Jika backend tidak terhubung:
1. **Check Backend Status**: Pastikan `rusdi-barber-be` berjalan di port 3000
2. **CORS Issues**: Pastikan `CORS_ORIGIN=http://localhost:5173` di backend .env  
3. **Demo Mode**: Dashboard akan otomatis switch ke mock data

### TypeScript Errors
Jika mengalami TypeScript errors, gunakan:
```bash
npm run dev:nocheck
```

### Port Conflicts
Jika port 5173 sedang digunakan, Vite akan otomatis mencari port lain.

### CSS Hot Reload
Jika Tailwind CSS tidak reload dengan baik, restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev:nocheck
```

### Connection Indicators
- **🟢 Online**: Backend terhubung, data real
- **🟠 Demo Mode**: Backend offline, menggunakan mock data
- **🔴 Error**: Ada masalah koneksi atau aplikasi

## 📝 Development Workflow

### 1. Branching Strategy
```bash
git checkout -b feature/nama-fitur
```

### 2. Code Style
- Gunakan TypeScript untuk type safety
- Follow React best practices
- Gunakan Tailwind untuk styling
- Implement responsive design

### 3. Testing
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build:nocheck
```

### 4. Commit Messages
```
feat: add new feature
fix: bug fix
docs: documentation
style: code formatting
refactor: code refactoring
test: add tests
```

## 🔗 API Integration

### Current Status
- ✅ Backend API detection
- ✅ Automatic fallback to mock data
- ✅ Health check service implemented  
- ✅ Connection status indicators
- ✅ Error boundary protection
- ✅ CORS configuration ready

### Backend Requirements
Backend API harus menyediakan endpoints:
```
GET  /api/v1/health                 - Health check
GET  /api/v1/dashboard/stats        - Dashboard statistics  
GET  /api/v1/bookings              - Booking management
POST /api/v1/auth/login            - Authentication
GET  /api/v1/auth/me               - Current user info
```

### Next Steps
1. ✅ Connect to backend API
2. 🔄 Complete all CRUD operations
3. 🔄 Implement real-time updates
4. 🔄 Add comprehensive error handling

## 📱 Mobile Support

Dashboard fully responsive dengan:
- Touch-friendly interface
- Mobile navigation
- Optimized forms
- Fast loading
- Swipe gestures ready

## 🆘 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev:nocheck
```

### Build Errors
```bash
# Build without TypeScript checking
npm run build:nocheck
```

### Styling Issues
```bash
# Restart server untuk Tailwind reload
# Ctrl+C kemudian
npm run dev:nocheck
```

## 📞 Support

Untuk bantuan dan pertanyaan:
- **GitHub Issues**: Create issue untuk bug reports
- **Documentation**: Cek README.md untuk info lengkap
- **Email**: support@rusdibarber.com

## 🎯 Next Milestones

### Phase 1 (Current)
- ✅ Basic dashboard
- ✅ Authentication
- ✅ Booking interface

### Phase 2 (Next)
- 🔄 Complete CRUD operations
- 🔄 API integration
- 🔄 Real-time features

### Phase 3 (Future)
- 📊 Advanced analytics
- 📱 Mobile app integration
- 🔔 Push notifications
- 🌐 Multi-language support

---

**Happy Coding!** 🚀

Made with ❤️ by Rusdi Barber Team