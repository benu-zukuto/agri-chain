backend/
│
├── package.json
├── .env
├── .gitignore
├── server.js
├── qr/                     # Empty folder for QR images
├── uploads/                # Empty folder for future uploads
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── farmer.controller.js
    │   ├── collection.controller.js
    │   ├── retail.controller.js
    │   └── customer.controller.js
    ├── middleware/
    │   └── auth.middleware.js
    ├── models/
    │   ├── User.js
    │   ├── ProductBatch.js
    │   ├── CollectionUpdate.js
    │   └── RetailUpdate.js
    ├── routes/
    │   ├── index.js
    │   ├── health.routes.js
    │   ├── auth.routes.js
    │   ├── farmer.routes.js
    │   ├── collection.routes.js
    │   ├── retail.routes.js
    │   └── customer.routes.js
    ├── services/
    │   ├── batch.service.js
    │   └── qr.service.js
    └── utils/
        ├── apiResponse.js
        └── apiError.js
