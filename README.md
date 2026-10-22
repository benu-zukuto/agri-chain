# Agri-Chain

**End-to-end agricultural supply chain traceability — from farm to fork, verifiable by anyone.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)

---

## The Problem

**Consumers don't know where their food comes from.** Farmers don't know where their produce goes. Collection centers and retailers operate in information silos. The result: food fraud ($40B+/year), unfair farmer economics, slow safety recalls, and zero accountability.

## The Solution

Agri-Chain captures structured data at every supply chain handoff — **Farmer → Collection Center → Retail → Customer** — and exposes a public, QR-accessible timeline that anyone can verify. No blockchain required, no app install needed, just a web browser.

### Key Features

| Role | Capability |
|------|------------|
| 👨‍🌾 **Farmer** | Create batches with crop details, harvest date, location; track status in real-time |
| 🏭 **Collection Center** | Log quality grade, storage conditions, processing date; auto-advance batch status |
| 🏪 **Retail** | Record shop details, pricing, stock; generate QR codes for consumer access |
| 🛒 **Customer** | Scan QR or search by name/ID; view full journey timeline with AI-generated narrative |

### Consumer Experience

```
QR Scan → /customer?batchId=BATCH-123456
         ├── Farmer: "Ramesh Kumar, Punjab" — Harvested 2024-01-15
         ├── Collection: "A-Grade, 3 days at 4°C" — Processed 2024-01-18
         ├── Retail: "FreshMart, Delhi" — Arrived 2024-01-22, ₹45/kg
         └── 📊 Total journey: 7 days | 🤖 AI Narrator: "This wheat traveled..."
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 3, React Router 7, Framer Motion |
| **Backend** | Node.js 18+, Express 4, Mongoose 8, JWT Auth |
| **Database** | MongoDB (local or Atlas) |
| **QR Codes** | `qrcode` library → static PNG served from `/qr` |
| **Icons** | react-icons (Feather, Bootstrap) |
| **Notifications** | react-hot-toast |

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or [Atlas](https://www.mongodb.com/atlas))
- npm or pnpm

### 1. Clone & Install

```bash
git clone https://github.com/your-org/agri-chain.git
cd agri-chain

# Backend
cd backend
cp .env.example .env   # Edit with your values
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-chain
JWT_SECRET=your-super-secret-min-32-chars
JWT_EXPIRE=7d
HOST_IP=192.168.1.xxx    # Your LAN IP for QR codes to work on mobile
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

> **Important**: `HOST_IP` must be your machine's **LAN IP** (not `localhost`) so QR codes work when scanned from a phone on the same network. Find it with `ipconfig` (Windows) or `ifconfig` / `ip a` (Linux/Mac).

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/api/v1/health

---

## Project Structure

```
agri-chain/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── controllers/           # Role-based controllers
│   │   ├── middleware/auth.middleware.js
│   │   ├── models/                # User, ProductBatch, CollectionUpdate, RetailUpdate
│   │   ├── routes/                # /auth, /farmer, /collection, /retail, /customer
│   │   ├── services/              # batch.id generator, QR generator
│   │   ├── utils/                 # ApiResponse, ApiError
│   │   ├── app.js                 # Express setup
│   │   └── index.js               # Entry point
│   ├── qr/                        # Generated QR PNGs (gitignored)
│   └── uploads/                   # Future file uploads
│
├── frontend/
│   ├── src/
│   │   ├── api/axiosInstance.js   # Axios + JWT interceptor
│   │   ├── components/
│   │   │   ├── common/            # Button, Card, Spinner, StatusBadge, PrivateRoute
│   │   │   ├── layout/            # DashboardLayout, Navbar
│   │   │   └── ui/                # Timeline, ProductJourneyNarrator
│   │   ├── context/               # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── Customer.jsx       # Public traceability page
│   │   │   └── dashboards/        # FarmerDashboard, CollectionDashboard, RetailDashboard
│   │   ├── routes/AppRoutes.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/
│
├── project.md                     # Detailed problem statement & architecture
└── README.md                      # This file
```

---

## API Reference

Base URL: `http://localhost:5000/api/v1`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register (body: name, email, password, phone, role) |
| POST | `/auth/login` | Login → returns `{ token, user }` |

> Include `Authorization: Bearer <token>` header for protected routes.

### Farmer (role: `Farmer`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/farmer/create-batch` | Create batch (cropName, cropCategory, quantity, unit, harvestDate, farmerLocation, transportDate, description) |
| GET | `/farmer/my-batches` | List own batches |

### Collection Center (role: `CollectionCenter`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/collection/update` | Log quality grade, processingDate, storageDays, storageTemperature, remarks |

### Retail (role: `Retail`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/retail/update` | Log retailShopName, retailLocation, arrivalDate, availableStock, price |
| POST | `/retail/generate-qr` | Generate QR for batchId → returns `{ url, filePath }` |

### Customer (public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/history/:batchId` | Full batch + collection + retail + timeline |
| GET | `/customer/products?search=` | Search batches by cropName |

---

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed, select: false),
  phone: String,
  role: Enum['Farmer', 'CollectionCenter', 'Retail', 'Customer'],
  timestamps: true
}
```

### ProductBatch
```javascript
{
  batchId: String (unique, e.g. "BATCH-123456"),
  farmer: ObjectId → User,
  cropName: String,
  cropCategory: String,
  quantity: Number,
  unit: String,
  harvestDate: Date,
  farmerName: String,
  farmerLocation: String,
  description: String,
  currentStatus: Enum['Created', 'AtCollectionCenter', 'AtRetailer', 'Sold'],
  timestamps: true
}
```

### CollectionUpdate
```javascript
{
  batch: ObjectId → ProductBatch,
  collectionCenter: ObjectId → User,
  qualityGrade: String,
  processingDate: Date,
  storageDays: Number,
  storageTemperature: String,
  remarks: String,
  status: String,
  timestamps: true
}
```

### RetailUpdate
```javascript
{
  batch: ObjectId → ProductBatch,
  retailer: ObjectId → User,
  retailShopName: String,
  retailLocation: String,
  arrivalDate: Date,
  availableStock: Number,
  price: Number,
  status: String,
  timestamps: true
}
```

---

## Screenshots

> *Add screenshots here: Farmer dashboard, Customer page with timeline, QR code scan demo*

---

## Roadmap

- [ ] Collection Center dashboard UI
- [ ] Retail dashboard UI + QR print/export
- [ ] Cryptographic batch sealing (hash chain)
- [ ] Optional public ledger anchoring (Polygon/Base)
- [ ] W3C Verifiable Credentials for certifications
- [ ] Offline-first PWA with background sync
- [ ] Multi-language support (Hindi, Tamil, Spanish, French)
- [ ] IoT sensor auto-logging (temp/humidity)
- [ ] Farmer marketplace & price discovery

See [project.md](project.md) for detailed roadmap.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style (ESLint + Prettier config in frontend)
- Write meaningful commit messages (conventional commits)
- Test both frontend and backend before PR
- Update documentation for new features

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Inspired by the need for **practical, adoptable traceability** — not blockchain theater
- Built with React, Express, MongoDB — the boring stack that works
- QR code approach from [GS1 Digital Link](https://www.gs1.org/standards/digital-link) concepts

---

## Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/your-org/agri-chain/issues)
- 💡 **Feature requests**: [GitHub Discussions](https://github.com/your-org/agri-chain/discussions)
- 📧 **Contact**: your-email@example.com

---

**Made with ❤️ for farmers, consumers, and everyone in between.**