const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// =====================================================
// DELETE OLD IMAGE
// =====================================================

const deleteOldImage = (imagePath) => {
    if (!imagePath) {
        return;
    }

    try {
        const cleanPath = String(imagePath)
            .replace(/^\/+/, "")
            .replace(/^uploads[\\/]/, "");

        const fullPath = path.join(
            __dirname,
            "..",
            "uploads",
            cleanPath
        );

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error(
            "OLD IMAGE DELETE ERROR:",
            error.message
        );
    }
};

// =====================================================
// CREATE TRAINER REPORT
// POST /api/trainer-reports
// =====================================================

const createTrainerReport = async (req, res) => {
    try {
        console.log("=================================");
        console.log("CREATE TRAINER REPORT");
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        console.log("=================================");

        const {
            name,
            designation,
            taluka,
            district,
            mobile_number,
            report_date,
            total_shops_visited_today,
            total_panel_registration_amount,
            payment_mode,
        } = req.body;

        // =================================================
        // REQUIRED FIELD VALIDATION
        // =================================================

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        if (!designation || !String(designation).trim()) {
            return res.status(400).json({
                success: false,
                message: "Designation is required",
            });
        }

        if (!taluka || !String(taluka).trim()) {
            return res.status(400).json({
                success: false,
                message: "Taluka is required",
            });
        }

        if (!district || !String(district).trim()) {
            return res.status(400).json({
                success: false,
                message: "District is required",
            });
        }

        if (!report_date) {
            return res.status(400).json({
                success: false,
                message: "Report date is required",
            });
        }

        const shops = Number(total_shops_visited_today) >= 0 ? Number(total_shops_visited_today) : 0;
        const amount = Number(total_panel_registration_amount) >= 0 ? Number(total_panel_registration_amount) : 0;
        const validPaymentModes = ["Cash", "UPI", "Online", "Bank Transfer"];
        const cleanPaymentMode = payment_mode && validPaymentModes.includes(payment_mode)
            ? payment_mode
            : null;
        const filePath = (field) =>
            req.files?.[field]?.[0]
                ? `trainer-reports/${req.files[field][0].filename}`
                : null;
        const shopPhoto = filePath("shop_photo");
        const registrationPhoto = filePath("shopkeeper_registration_photo");
        const workPhotoVideo = filePath("work_photo_video");

        // =================================================
        // INSERT
        // =================================================

        const submittedUserId = String(req.body.user_id || req.body.created_by_id || "").trim() || null;
        const submittedRole   = String(req.body.role || req.body.created_by_role || "").trim() || null;

        const [result] = await db.query(
            `
            INSERT INTO trainer_reports
            (
                user_id,
                created_by_role,

                name,
                designation,
                taluka,
                district,
                mobile_number,
                report_date,

                total_shops_visited_today,
                total_panel_registration_amount,
                payment_mode,
                shop_photo,
                shopkeeper_registration_photo,
                work_photo_video,

                status
            )
            VALUES
            (
                ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                'active'
            )
            `,
            [
                submittedUserId,
                submittedRole,

                String(name).trim(),
                String(designation).trim(),
                String(taluka).trim(),
                String(district).trim(),

                mobile_number
                    ? String(mobile_number).trim()
                    : null,

                report_date,

                shops,
                amount,
                cleanPaymentMode,
                shopPhoto,
                registrationPhoto,
                workPhotoVideo,
            ]
        );

        // =================================================
        // GET CREATED REPORT
        // =================================================

        const [rows] = await db.query(
            `
            SELECT *
            FROM trainer_reports
            WHERE id = ?
            LIMIT 1
            `,
            [result.insertId]
        );

        return res.status(201).json({
            success: true,
            message: "Trainer report created successfully",
            report: rows[0],
            data: rows[0],
        });
    } catch (error) {
        console.error(
            "CREATE TRAINER REPORT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create trainer report",
        });
    }
};
// =====================================================
// GET ALL TRAINER REPORTS
// GET /api/trainer-reports
// =====================================================

const getTrainerReports = async (req, res) => {
    try {
        // Role-based filtering:
        // admin/superadmin → all reports
        // others → only their own (filtered by user_id or mobile_number)
        const role      = String(req.query.role          || "").trim().toLowerCase();
        const userId    = String(req.query.user_id       || "").trim();
        const mobileNum = String(req.query.mobile_number || "").trim();
        const userName  = String(req.query.user_name     || req.query.name || "").trim();
        const isAdmin   = role === "admin" || role === "superadmin" || (!role && !userId && !mobileNum && !userName);

        let rows;
        if (isAdmin) {
            [rows] = await db.query(`SELECT * FROM trainer_reports ORDER BY id DESC`);
        } else if (userId) {
            if (mobileNum || userName) {
                [rows] = await db.query(
                    `SELECT * FROM trainer_reports 
                     WHERE user_id = ? 
                        OR (user_id IS NULL AND (mobile_number = ? OR name = ?)) 
                     ORDER BY id DESC`,
                    [userId, mobileNum || "__none__", userName || "__none__"]
                );
            } else {
                [rows] = await db.query(
                    `SELECT * FROM trainer_reports WHERE user_id = ? ORDER BY id DESC`,
                    [userId]
                );
            }
        } else if (mobileNum || userName) {
            [rows] = await db.query(
                `SELECT * FROM trainer_reports 
                 WHERE mobile_number = ? OR name = ? 
                 ORDER BY id DESC`,
                [mobileNum || "__none__", userName || "__none__"]
            );
        } else {
            [rows] = await db.query(`SELECT * FROM trainer_reports ORDER BY id DESC`);
        }

        return res.status(200).json({
            success: true,
            count: rows.length,
            total: rows.length,
            reports: rows,
            data: rows,
        });
    } catch (error) {
        console.error("GET TRAINER REPORTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trainer reports",
        });
    }
};


// =====================================================
// GET SINGLE TRAINER REPORT
// GET /api/trainer-reports/:id
// =====================================================

const getTrainerReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM trainer_reports
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer report not found",
            });
        }

        return res.status(200).json({
            success: true,
            report: rows[0],
            data: rows[0],
        });
    } catch (error) {
        console.error(
            "GET TRAINER REPORT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch trainer report",
        });
    }
};

// =====================================================
// UPDATE TRAINER REPORT
// PUT /api/trainer-reports/:id
// =====================================================

const updateTrainerReport = async (req, res) => {
    try {
        const { id } = req.params;

        // =================================================
        // GET OLD REPORT
        // =================================================

        const [oldRows] = await db.query(
            `
            SELECT *
            FROM trainer_reports
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (oldRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer report not found",
            });
        }

        const oldReport = oldRows[0];

        // =================================================
        // REQUEST BODY
        // =================================================

        const {
            name,
            designation,
            taluka,
            district,
            mobile_number,
            report_date,
            total_shops_visited_today,
            total_panel_registration_amount,
            payment_mode,
            status,
        } = req.body;

        // =================================================
        // REQUIRED FIELD VALIDATION
        // =================================================

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        if (!designation || !String(designation).trim()) {
            return res.status(400).json({
                success: false,
                message: "Designation is required",
            });
        }

        if (!taluka || !String(taluka).trim()) {
            return res.status(400).json({
                success: false,
                message: "Taluka is required",
            });
        }

        if (!district || !String(district).trim()) {
            return res.status(400).json({
                success: false,
                message: "District is required",
            });
        }

        if (!report_date) {
            return res.status(400).json({
                success: false,
                message: "Report date is required",
            });
        }

        const shops = total_shops_visited_today !== undefined && Number(total_shops_visited_today) >= 0
            ? Number(total_shops_visited_today)
            : (oldReport.total_shops_visited_today || 0);

        const amount = total_panel_registration_amount !== undefined && Number(total_panel_registration_amount) >= 0
            ? Number(total_panel_registration_amount)
            : (oldReport.total_panel_registration_amount || 0);

        const validPaymentModes = ["Cash", "UPI", "Online", "Bank Transfer"];
        const cleanPaymentMode = payment_mode && validPaymentModes.includes(payment_mode)
            ? payment_mode
            : (payment_mode === undefined ? oldReport.payment_mode : null);

        const submittedUserId = String(req.body.user_id || req.body.created_by_id || "").trim() || null;

        // =================================================
        // OLD PHOTOS
        // =================================================

        const media = [
            ["shop_photo", "shop_photo"],
            ["shopkeeper_registration_photo", "shopkeeper_registration_photo"],
            ["work_photo_video", "work_photo_video"],
        ];
        const fileValues = {};
        media.forEach(([field, column]) => {
            fileValues[column] = oldReport[column];
            if (req.files?.[field]?.[0]) {
                fileValues[column] =
                    `trainer-reports/${req.files[field][0].filename}`;
                deleteOldImage(oldReport[column]);
            }
        });

        // =================================================
        // UPDATE DATABASE
        // =================================================

        await db.query(
            `
            UPDATE trainer_reports
            SET
                user_id = COALESCE(user_id, ?),
                name = ?,
                designation = ?,
                taluka = ?,
                district = ?,
                mobile_number = ?,
                report_date = ?,

                total_shops_visited_today = ?,
                total_panel_registration_amount = ?,
                payment_mode = ?,
                shop_photo = ?,
                shopkeeper_registration_photo = ?,
                work_photo_video = ?,

                status = ?

            WHERE id = ?
            `,
            [
                submittedUserId,
                String(name).trim(),

                String(designation).trim(),

                String(taluka).trim(),

                String(district).trim(),

                mobile_number
                    ? String(mobile_number).trim()
                    : null,

                report_date,

                shops,
                amount,
                cleanPaymentMode,
                fileValues.shop_photo,
                fileValues.shopkeeper_registration_photo,
                fileValues.work_photo_video,

                status ||
                    oldReport.status ||
                    "active",

                id,
            ]
        );

        // =================================================
        // GET UPDATED REPORT
        // =================================================

        const [updatedRows] = await db.query(
            `
            SELECT *
            FROM trainer_reports
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message:
                "Trainer report updated successfully",
            report: updatedRows[0],
            data: updatedRows[0],
        });
    } catch (error) {
        console.error(
            "UPDATE TRAINER REPORT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update trainer report",
        });
    }
};

// =====================================================
// DELETE TRAINER REPORT
// DELETE /api/trainer-reports/:id
// =====================================================

const deleteTrainerReport = async (req, res) => {
    try {
        const { id } = req.params;

        // =================================================
        // GET OLD PHOTOS
        // =================================================

        const [rows] = await db.query(
            `
            SELECT
                shop_photo,
                shopkeeper_registration_photo,
                work_photo_video
            FROM trainer_reports
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer report not found",
            });
        }

        // =================================================
        // DELETE DATABASE RECORD
        // =================================================

        await db.query(
            `
            DELETE FROM trainer_reports
            WHERE id = ?
            `,
            [id]
        );
                // =================================================
        [
            rows[0].shop_photo,
            rows[0].shopkeeper_registration_photo,
            rows[0].work_photo_video,
        ].forEach(deleteOldImage);

        return res.status(200).json({
            success: true,
            message:
                "Trainer report deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE TRAINER REPORT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete trainer report",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createTrainerReport,
    getTrainerReports,
    getTrainerReportById,
    updateTrainerReport,
    deleteTrainerReport,
};