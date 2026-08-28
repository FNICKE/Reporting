const express = require("express");
const cors = require("cors");
const path = require("path");

// =====================================================
// MASTER ROUTES
// =====================================================

const districtRoutes =
    require("./routes/district.routes");

const talukaRoutes =
    require("./routes/taluka.routes");

const vibhagRoutes =
    require("./routes/vibhag.routes");

const trainerRoutes =
    require("./routes/trainer.routes");

const authRoutes =
    require("./routes/auth.routes");

// =====================================================
// REPORT ROUTES
// =====================================================

const districtReportRoutes =
    require("./routes/districtReport.routes");

const talukaReportRoutes =
    require("./routes/talukaReport.routes");

const vibhagReportRoutes =
    require("./routes/vibhagReport.routes");

const trainerReportRoutes =
    require("./routes/trainerReport.routes");

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
    "https://reporting.sainikshetkari.org",
];

const corsOptions = {

    origin: function (origin, callback) {

        console.log(
            "CORS REQUEST:",
            origin
        );

        // Postman / curl / server-to-server
        if (!origin) {
            return callback(null, true);
        }

        if (
            allowedOrigins.includes(origin)
        ) {

            console.log(
                "✅ CORS ALLOWED:",
                origin
            );

            return callback(
                null,
                true
            );
        }

        console.log(
            "❌ CORS BLOCKED:",
            origin
        );

        return callback(
            new Error(
                `CORS not allowed for origin: ${origin}`
            )
        );
    },

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

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
// APPLY CORS
// =====================================================

app.use(
    cors(corsOptions)
);

// =====================================================
// PREFLIGHT REQUEST
// =====================================================


// =====================================================
// BODY PARSER
// =====================================================

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true,
    })
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

const uploadsPath = path.join(
    __dirname,
    "uploads"
);

console.log(
    "========================================"
);

console.log(
    "UPLOADS PATH:",
    uploadsPath
);

console.log(
    "========================================"
);

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use(
    "/uploads",
    express.static(
        uploadsPath
    )
);

// =====================================================
// TEST UPLOAD ROUTE
// =====================================================
//
// GET:
// /uploads
//
// =====================================================

app.get(
    "/uploads",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Uploads folder is available",

            path:
                uploadsPath,

        });

    }
);

// =====================================================
// TEST API
// =====================================================
//
// GET:
// /
//
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Dashboard Backend API is running",

        });

    }
);

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

app.use(
    "/api/auth",
    authRoutes
);

// =====================================================
// MASTER ROUTES
// =====================================================

app.use(
    "/api/district",
    districtRoutes
);

app.use(
    "/api/taluka",
    talukaRoutes
);

app.use(
    "/api/vibhag",
    vibhagRoutes
);

app.use(
    "/api/trainer",
    trainerRoutes
);

// =====================================================
// DISTRICT REPORT ROUTES
// =====================================================

app.use(
    "/api/district-reports",
    districtReportRoutes
);

// =====================================================
// TALUKA REPORT ROUTES
// =====================================================

app.use(
    "/api/taluka-reports",
    talukaReportRoutes
);

// =====================================================
// VIBHAG REPORT ROUTES
// =====================================================

app.use(
    "/api/vibhag-reports",
    vibhagReportRoutes
);

// =====================================================
// TRAINER REPORT ROUTES
// =====================================================

app.use(
    "/api/trainer-reports",
    trainerReportRoutes
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use(
    (req, res) => {

        console.log(
            "========================================"
        );

        console.log(
            "❌ 404 ROUTE"
        );

        console.log(
            "METHOD:",
            req.method
        );

        console.log(
            "URL:",
            req.originalUrl
        );

        console.log(
            "ORIGIN:",
            req.headers.origin
        );

        console.log(
            "========================================"
        );

        res.status(404).json({

            success: false,

            message:
                "Route not found",

            path:
                req.originalUrl,

        });

    }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (
        err,
        req,
        res,
        next
    ) => {

        console.error(
            "========================================"
        );

        console.error(
            "❌ SERVER ERROR"
        );

        console.error(
            "METHOD:",
            req.method
        );

        console.error(
            "URL:",
            req.originalUrl
        );

        console.error(
            "ORIGIN:",
            req.headers.origin
        );

        console.error(
            "ERROR:",
            err
        );

        console.error(
            "========================================"
        );

        // =================================================
        // CORS ERROR
        // =================================================

        if (
            err.message &&
            err.message.includes(
                "CORS not allowed"
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "CORS origin not allowed",

                error:
                    err.message,

            });

        }

        // =================================================
        // MULTER UNEXPECTED FILE
        // =================================================

        if (
            err.code ===
            "LIMIT_UNEXPECTED_FILE"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Unexpected file field: ${err.field}`,

            });

        }

        // =================================================
        // MULTER FILE SIZE
        // =================================================

        if (
            err.code ===
            "LIMIT_FILE_SIZE"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "File size must be less than 10MB",

            });

        }

        // =================================================
        // MULTER ERROR
        // =================================================

        if (
            err.name ===
            "MulterError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    err.message ||
                    "File upload error",

            });

        }

        // =================================================
        // IMAGE TYPE ERROR
        // =================================================

        if (
            err.message &&
            err.message.includes(
                "Only JPG"
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    err.message,

            });

        }

        // =================================================
        // GENERAL ERROR
        // =================================================

        return res.status(500).json({

            success: false,

            message:
                err.message ||
                "Internal server error",

        });

    }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;