# Agri-Chain: Agricultural Supply Chain Traceability System

## Problem Statement

### The Core Problem

**Agricultural supply chains suffer from a fundamental lack of transparency, traceability, and trust.** From farm to fork, produce passes through multiple intermediaries—farmers, collection centers, transporters, wholesalers, retailers—yet consumers have zero visibility into where their food came from, how it was handled, or whether claims about quality, origin, and safety are genuine.

This opacity creates cascading failures across the entire ecosystem:

---

### 1. Consumer Trust Crisis

- **Food fraud is rampant**: Mislabeling of origin, variety, organic status, and harvest dates costs the global food industry **$40+ billion annually** (FAO/WHO estimates).
- **No verification mechanism**: A consumer paying premium for "organic, locally-sourced, farm-fresh" produce has no way to verify any of those claims.
- **Safety recalls are slow and imprecise**: When contamination occurs, entire product categories are recalled instead of targeted batches, wasting safe food and eroding confidence.

---

### 2. Farmer Disempowerment

- **Price asymmetry**: Farmers sell at farm-gate prices while retailers capture 60-80% of final consumer price. Farmers have no visibility into downstream pricing.
- **No proof of quality**: Farmers investing in better practices (organic, GAP, sustainable water use) cannot prove or monetize those investments.
- **Market access barriers**: Smallholders lack direct channels to premium buyers who value traceability.

---

### 3. Intermediary Inefficiencies

- **Collection centers**: Paper-based or fragmented digital records; quality assessments, storage conditions, and processing dates are lost or inconsistent.
- **Retailers**: Cannot differentiate truly premium produce; shelf-life management is reactive (visual inspection) rather than data-driven.
- **Logistics**: No shared source of truth for handoffs—disputes over quality degradation during transit are unresolvable.

---

### 4. Regulatory & Compliance Gaps

- **Increasing mandates**: EU Deforestation Regulation (EUDR), US FSMA 204, India's FSSAI traceability rules require end-to-end traceability.
- **Current systems don't comply**: Most agri-businesses rely on spreadsheets, WhatsApp, or siloed ERPs that cannot produce auditable, immutable chain-of-custody records.
- **Certification fraud**: Organic, Fair Trade, Rainforest Alliance certifications are frequently forged with no real-time verification.

---

### 5. The "Blockchain" Hype vs. Reality

- **Over-engineered solutions**: Many "blockchain traceability" pilots use permissioned ledgers that add cost/complexity without solving the data capture problem at source.
- **Adoption failure**: Solutions requiring farmers/collection centers to run nodes or manage keys see near-zero adoption.
- **Wrong trust model**: The value isn't in the ledger—it's in **structured, verifiable data capture at each handoff** with cryptographic proofs that can be independently verified.

---

## Solution: Agri-Chain

Agri-Chain is a **pragmatic, role-based traceability platform** that captures structured data at every supply chain handoff, generates verifiable QR-coded batch identities, and exposes a public consumer-facing view—all without blockchain overhead.

### Core Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Role-based UIs** | Tailored dashboards for Farmer, Collection Center, Retail, Customer—each sees only their actions |
| **Progressive data capture** | Each actor adds their layer (harvest → quality → retail) without modifying prior data |
| **QR as the bridge** | Retail generates QR pointing to public `/customer?batchId=` page—no app install needed |
| **Immutable audit trail** | MongoDB with timestamps + cryptographic batch IDs; future: anchor hashes to public ledger |
| **Offline-first friendly** | Forms work on mobile; sync when online (planned) |

---

### Data Model — The Chain of Custody

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    FARMER       │     │  COLLECTION CENTER   │     │     RETAIL       │     │   CUSTOMER      │
├─────────────────┤     ├──────────────────────┤     ├──────────────────┤     ├─────────────────┤
│ ProductBatch    │────▶│ CollectionUpdate     │────▶│ RetailUpdate     │────▶│ Public View     │
│ - batchId       │     │ - qualityGrade       │     │ - shopName       │     │ - timeline      │
│ - cropName      │     │ - processingDate     │     │ - location       │     │ - farmer info   │
│ - quantity      │     │ - storageDays/temp   │     │ - arrivalDate    │     │ - collection    │
│ - harvestDate   │     │ - remarks            │     │ - price/stock    │     │ - retail        │
│ - location      │     │                      │     │ - QR code        │     │ - journey days  │
│ - status:       │     │ status:              │     │ status:          │     │ - AI narrative  │
│   Created       │     │   AtCollectionCenter │     │   AtRetailer     │     │                 │
└─────────────────┘     └──────────────────────┘     └──────────────────┘     └─────────────────┘
```

**Key invariant**: `ProductBatch.currentStatus` moves **forward only**—`Created → AtCollectionCenter → AtRetailer → Sold`. No backward transitions, no overwrites.

---

### User Flows

#### Farmer Dashboard (`/farmer`)
1. **Generate Product ID** — Auto-assigned `BATCH-{timestamp}` + optional farmer-friendly `AGRI-XXX`
2. **Create Batch** — Crop name, variety, quantity/unit, harvest date, location, transport date
3. **View My Batches** — Filterable table with status badges (Created / At Collection / At Retail / Sold)
4. **Real-time stats** — Total products, at collection, at retail counts

#### Collection Center Dashboard (`/collection`) — *Planned/Partial*
1. **Receive batch** — Scan/search by batchId
2. **Log quality assessment** — Grade (A/B/C), processing date, storage days, temperature, remarks
3. **Auto-advance status** — Batch → `AtCollectionCenter`

#### Retail Dashboard (`/retail`) — *Planned/Partial*
1. **Receive batch** — Scan/search by batchId
2. **Log retail entry** — Shop name, location, arrival date, available stock, unit price
3. **Generate QR** — Creates PNG in `/qr/{batchId}.png` pointing to `https://domain/customer?batchId=...`
4. **Auto-advance status** — Batch → `AtRetailer`

#### Customer Public Page (`/customer`) — **Fully Implemented**
1. **Search** — By batchId or crop name (debounced, URL-synced for shareable links)
2. **Scan QR** — Direct link opens modal with full history
3. **View details** — Farmer, collection center, retail shop, prices, dates
4. **Visual timeline** — Animated Framer Motion timeline with icons per stage
5. **AI Journey Narrator** — *Unique feature*: Generates human-readable story of the product's journey
6. **Journey metrics** — Days since harvest, total farm-to-shelf days

---

### Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AGRI-CHAIN SYSTEM                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐   │
│  │   FRONTEND   │     │   BACKEND    │     │    DATABASE      │   │
│  │  (React 19)  │◀───▶│  (Express)   │◀───▶│    (MongoDB)     │   │
│  │   Port 5173  │     │   Port 5000  │     │                  │   │
│  └──────────────┘     └──────────────┘     └──────────────────┘   │
│        │                    │                    │                  │
│        ▼                    ▼                    ▼                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐   │
│  │  Components  │     │   Routes     │     │     Models       │   │
│  │  - Dashboard │     │  /auth       │     │  User            │   │
│  │  - Customer  │     │  /farmer     │     │  ProductBatch    │   │
│  │  - QR/Modal  │     │  /collection │     │  CollectionUpdate│   │
│  │  - Timeline  │     │  /retail     │     │  RetailUpdate    │   │
│  │  - AI Narr.  │     │  /customer   │     │                  │   │
│  └──────────────┘     └──────────────┘     └──────────────────┘   │
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐   │
│  │   SERVICES   │     │  MIDDLEWARE  │     │     UTILS        │   │
│  │  - batch.id  │     │  - JWT auth  │     │  - ApiResponse   │   │
│  │  - QR gen    │     │  - role guard│     │  - ApiError      │   │
│  └──────────────┘     └──────────────┘     └──────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Backend Stack
- **Runtime**: Node.js 18+, Express 4
- **Database**: MongoDB + Mongoose 8 (ODM)
- **Auth**: JWT (access tokens), bcryptjs for password hashing
- **QR**: `qrcode` library → PNG files served statically from `/qr`
- **Validation**: Custom `ApiError`/`ApiResponse` wrapper (no external validator)
- **Logging**: Morgan (dev only)

#### Frontend Stack
- **Framework**: React 19 + Vite 6
- **Routing**: React Router v7 (data routes not yet used)
- **Styling**: Tailwind CSS 3 + custom glass-morphism components
- **Animation**: Framer Motion (page transitions, timeline, modal)
- **State**: React Context (Auth, Theme) + local component state
- **HTTP**: Axios instance with interceptors (JWT attachment, error toast)
- **Icons**: react-icons (Fi, Bs) + react-hot-toast for notifications

---

### API Contract (v1)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | Public | Register user (role in body) |
| POST | `/api/v1/auth/login` | Public | Login → returns JWT |
| POST | `/api/v1/farmer/create-batch` | Farmer | Create ProductBatch |
| GET | `/api/v1/farmer/my-batches` | Farmer | List own batches |
| POST | `/api/v1/collection/update` | CollectionCenter | Log CollectionUpdate |
| POST | `/api/v1/retail/update` | Retail | Log RetailUpdate |
| POST | `/api/v1/retail/generate-qr` | Retail | Generate QR for batchId |
| GET | `/api/v1/customer/history/:batchId` | Public | Full batch + collection + retail + timeline |
| GET | `/api/v1/customer/products?search=` | Public | Search batches by cropName |

---

### Environment Variables

#### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agri-chain
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d
HOST_IP=192.168.x.x          # LAN IP for QR code URLs
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

### Current Implementation Status

| Module | Status | Notes |
|--------|--------|-------|
| **Backend Core** | ✅ Complete | Express, MongoDB, Auth, all routes, models, services |
| **Farmer Dashboard** | ✅ Complete | Full CRUD for batches, stats, search, generate ID |
| **Customer Page** | ✅ Complete | Search, QR deep-link, modal, timeline, AI narrator |
| **Collection Dashboard** | 🚧 Scaffolded | Routes/controllers exist; UI not built |
| **Retail Dashboard** | 🚧 Scaffolded | Routes/controllers exist; UI not built |
| **QR Generation** | ✅ Working | Generates PNG to `/qr/{batchId}.png` |
| **Auth Context** | ✅ Complete | JWT storage, role guards, ProtectedRoute |
| **Theme System** | ✅ Complete | Light/dark with persistence |

---

### Differentiators vs. Existing Solutions

| Feature | Typical "Blockchain Traceability" | Agri-Chain |
|---------|-----------------------------------|------------|
| **Farmer onboarding** | Wallet, keys, gas fees | Email/password, role select |
| **Data capture** | Transaction hashes only | Rich structured data at each step |
| **Consumer access** | Separate app, wallet connect | Web page via QR, no install |
| **Cost** | $50K+ pilot, per-tx fees | Self-hosted, near-zero marginal cost |
| **Time to value** | Months | Days (farmer + customer work today) |
| **Offline support** | None | Planned (service workers) |

---

### Future Roadmap

#### Phase 1: Complete Role Coverage (Weeks 1-3)
- [ ] Collection Center dashboard UI
- [ ] Retail dashboard UI + QR print/export
- [ ] End-to-end integration testing

#### Phase 2: Trust & Verification (Weeks 4-6)
- [ ] Cryptographic batch sealing (hash chain: `hash(prev) + currentData`)
- [ ] Optional anchor to public ledger (Polygon, Base) for immutability proof
- [ ] Verifiable Credentials (W3C VC) for certifications

#### Phase 3: Intelligence & Scale (Weeks 7-12)
- [ ] AI-powered quality prediction from storage params
- [ ] Farmer analytics: price trends, demand signals
- [ ] Multi-language support (Hindi, Tamil, Spanish, French)
- [ ] Offline-first PWA with background sync
- [ ] IoT sensor integration (temp/humidity loggers → auto CollectionUpdate)

#### Phase 4: Ecosystem (Month 4+)
- [ ] Certification body integration (verifiable organic/Fair Trade claims)
- [ ] Marketplace: farmers list batches, retailers bid
- [ ] Carbon footprint tracking per batch
- [ ] API for third-party traceability consumers (insurers, lenders)

---

### Success Metrics

| Metric | Target (6 months) |
|--------|-------------------|
| Active farmers | 500+ |
| Batches traced | 10,000+ |
| Consumer scans | 50,000+ |
| Collection centers onboarded | 50+ |
| Retail partners | 200+ |
| Avg. farm-to-shelf visibility | < 48 hours |

---

### Why This Matters

**Food is the only product we put inside our bodies that we know the least about.**

Agri-Chain doesn't require a consortium, a token, or a permissioned ledger. It requires:
1. **Farmers** willing to record what they grow
2. **Collection centers** willing to record what they receive
3. **Retailers** willing to record what they sell
4. **Consumers** who scan a QR code

The technology is the easy part. The **behavioral change**—making structured data capture the default at every handoff—is the hard part. Agri-Chain makes that easy enough to start today.

---

*Document version: 1.0*  
*Last updated: 2026*  
*Project: Agri-Chain — Traceability that works*