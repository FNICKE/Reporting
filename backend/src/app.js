const express = require("express");
const cors = require("cors");
const path = require("path");

// =====================================================
// MASTER ROUTES
// =====================================================

const districtRoutes = require("./routes/district.routes");

const talukaRoutes = require("./routes/taluka.routes");

const vibhagRoutes = require("./routes/vibhag.routes");

const trainerRoutes = require("./routes/trainer.routes");

const authRoutes = require("./routes/auth.routes");

// =====================================================
// REPORT ROUTES
// =====================================================

const districtReportRoutes = require("./routes/districtReport.routes");

const talukaReportRoutes = require("./routes/talukaReport.routes");

const vibhagReportRoutes = require("./routes/vibhagReport.routes");

const trainerReportRoutes = require("./routes/trainerReport.routes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// ALLOWED CORS ORIGINS
// =====================================================

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://reporting.sainikshetkari.org",
  "http://reporting.sainikshetkari.org",
  "https://www.reporting.sainikshetkari.org",
  "http://www.reporting.sainikshetkari.org",
  "https://reportbackend.sainikshetkari.org",
  "http://reportbackend.sainikshetkari.org",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/+$/, "").toLowerCase();
  if (allowedOrigins.map((o) => o.toLowerCase()).includes(cleanOrigin)) {
    return true;
  }
  // Allow any sainikshetkari.org subdomain
  if (
    /^https?:\/\/([a-z0-9-]+\.)*sainikshetkari\.org(:[0-9]+)?$/i.test(
      cleanOrigin,
    )
  ) {
    return true;
  }
  // Allow localhost/127.0.0.1
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/i.test(cleanOrigin)) {
    return true;
  }
  return false;
};

// Universal CORS headers & preflight handler
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept, Origin, X-Requested-With",
    );
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    console.warn("⚠️ CORS Warning: Unknown origin:", origin);
    return callback(null, true); // Allow to prevent hard 500 error on preflights
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  optionsSuccessStatus: 204,
};

// =====================================================
// APPLY CORS & PREFLIGHT
// =====================================================

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =====================================================
// UPLOADS
// =====================================================
//
// Backend structure:
//
// backend/
//   app.js
//   uploads/
//
// =====================================================

const uploadsPath = path.join(__dirname, "uploads");

console.log("========================================");

console.log("UPLOADS PATH:", uploadsPath);

console.log("========================================");

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use("/uploads", express.static(uploadsPath));
app.use("/api/uploads", express.static(uploadsPath));

// =====================================================
// TEST UPLOAD ROUTE
// =====================================================
//
// GET:
// /uploads
//
// =====================================================

app.get("/uploads", (req, res) => {
  res.status(200).json({
    success: true,

    message: "Uploads folder is available",

    path: uploadsPath,
  });
});

// =====================================================
// TEST API
// =====================================================
//
// GET:
// /
//
// =====================================================

app.get(["/", "/api", "/api/health"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dashboard Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// AUTH ROUTES
// =====================================================
//
// Login URL:
//
// POST
// https://reportbackend.sainikshetkari.org/api/auth/login
//
// Local:
//
// POST
// http://localhost:5000/api/auth/login
//
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// MASTER ROUTES
// =====================================================

app.use("/api/district", districtRoutes);

app.use("/api/taluka", talukaRoutes);

app.use("/api/vibhag", vibhagRoutes);

app.use("/api/trainer", trainerRoutes);

// =====================================================
// DISTRICT REPORT ROUTES
// =====================================================

app.use("/api/district-reports", districtReportRoutes);

// =====================================================
// TALUKA REPORT ROUTES
// =====================================================

app.use("/api/taluka-reports", talukaReportRoutes);

// =====================================================
// VIBHAG REPORT ROUTES
// =====================================================

app.use("/api/vibhag-reports", vibhagReportRoutes);

// =====================================================
// TRAINER REPORT ROUTES
// =====================================================

app.use("/api/trainer-reports", trainerReportRoutes);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  console.log("========================================");

  console.log("❌ 404 ROUTE");

  console.log("METHOD:", req.method);

  console.log("URL:", req.originalUrl);

  console.log("ORIGIN:", req.headers.origin);

  console.log("========================================");

  res.status(404).json({
    success: false,

    message: "Route not found",

    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("========================================");

  console.error("❌ SERVER ERROR");

  console.error("METHOD:", req.method);

  console.error("URL:", req.originalUrl);

  console.error("ORIGIN:", req.headers.origin);

  console.error("ERROR:", err);

  console.error("========================================");

  // =================================================
  // CORS ERROR
  // =================================================

  if (err.message && err.message.includes("CORS not allowed")) {
    return res.status(403).json({
      success: false,

      message: "CORS origin not allowed",

      error: err.message,
    });
  }

  // =================================================
  // MULTER UNEXPECTED FILE
  // =================================================

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,

      message: `Unexpected file field: ${err.field}`,
    });
  }

  // =================================================
  // MULTER FILE SIZE
  // =================================================

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,

      message: "File size must be less than 10MB",
    });
  }

  // =================================================
  // MULTER ERROR
  // =================================================

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,

      message: err.message || "File upload error",
    });
  }

  // =================================================
  // IMAGE TYPE ERROR
  // =================================================

  if (err.message && err.message.includes("Only JPG")) {
    return res.status(400).json({
      success: false,

      message: err.message,
    });
  }

  // =================================================
  // GENERAL ERROR
  // =================================================

  return res.status(500).json({
    success: false,

    message: err.message || "Internal server error",
  });
});

// =====================================================
// EXPORT
// =====================================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}

module.exports = app;
