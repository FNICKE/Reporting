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
            total_authorised_center_heads,
            total_active_center_heads,
            today_visited_center_heads_names,
            total_center_heads_visited_today,
            todays_new_members,
            additional_remarks,
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

        // =================================================
        // NUMBER VALUES
        // =================================================

        const authorised =
            Number(total_authorised_center_heads) || 0;

        const active =
            Number(total_active_center_heads) || 0;

        const visited =
            Number(total_center_heads_visited_today) || 0;

        const newMembers =
            Number(todays_new_members) || 0;

        // =================================================
        // NUMBER VALIDATION
        // =================================================

        if (authorised < 300 || authorised > 500) {
            return res.status(400).json({
                success: false,
                message:
                    "Total Authorised Center Heads must be between 300 and 500",
            });
        }

        if (active < 0 || active > authorised) {
            return res.status(400).json({
                success: false,
                message:
                    "Active Center Heads cannot be greater than Authorised Center Heads.",
            });
        }

        if (visited < 0 || visited > active) {
            return res.status(400).json({
                success: false,
                message:
                    "Total Center Heads Visited Today cannot be greater than Active Center Heads.",
            });
        }

        if (newMembers < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Today's New Members cannot be negative.",
            });
        }

        // =================================================
        // PHOTO 1
        // =================================================

        let meetingPhoto1 = null;

        if (
            req.files &&
            req.files.meeting_photo_1 &&
            req.files.meeting_photo_1.length > 0
        ) {
            meetingPhoto1 =
                `trainer-reports/${req.files.meeting_photo_1[0].filename}`;
        }

        // =================================================
        // PHOTO 2
        // =================================================

        let meetingPhoto2 = null;

        if (
            req.files &&
            req.files.meeting_photo_2 &&
            req.files.meeting_photo_2.length > 0
        ) {
            meetingPhoto2 =
                `trainer-reports/${req.files.meeting_photo_2[0].filename}`;
        }

        // =================================================
        // INSERT
        // =================================================

        const [result] = await db.query(
            `
            INSERT INTO trainer_reports
            (
                name,
                designation,
                taluka,
                district,
                mobile_number,
                report_date,

                total_authorised_center_heads,
                total_active_center_heads,

                today_visited_center_heads_names,
                total_center_heads_visited_today,

                todays_new_members,

                additional_remarks,

                meeting_photo_1,
                meeting_photo_2,

                status
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?,
                ?, ?,
                ?, ?,
                ?,
                ?,
                ?, ?,
                'active'
            )
            `,
            [
                String(name).trim(),
                String(designation).trim(),
                String(taluka).trim(),
                String(district).trim(),

                mobile_number
                    ? String(mobile_number).trim()
                    : null,

                report_date,

                authorised,
                active,

                today_visited_center_heads_names
                    ? String(
                        today_visited_center_heads_names
                    ).trim()
                    : null,

                visited,
                newMembers,

                additional_remarks
                    ? String(additional_remarks).trim()
                    : null,

                meetingPhoto1,
                meetingPhoto2,
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
        const [rows] = await db.query(
            `
            SELECT *
            FROM trainer_reports
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            success: true,
            count: rows.length,
            total: rows.length,
            reports: rows,
            data: rows,
        });
    } catch (error) {
        console.error(
            "GET TRAINER REPORTS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch trainer reports",
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
            total_authorised_center_heads,
            total_active_center_heads,
            today_visited_center_heads_names,
            total_center_heads_visited_today,
            todays_new_members,
            additional_remarks,
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

        // =================================================
        // NUMBER VALUES
        // =================================================

        const authorised =
            Number(total_authorised_center_heads) || 0;

        const active =
            Number(total_active_center_heads) || 0;

        const visited =
            Number(total_center_heads_visited_today) || 0;

        const newMembers =
            Number(todays_new_members) || 0;

        // =================================================
        // NUMBER VALIDATION
        // =================================================

        if (authorised < 300 || authorised > 500) {
            return res.status(400).json({
                success: false,
                message:
                    "Total Authorised Center Heads must be between 300 and 500",
            });
        }

        if (active < 0 || active > authorised) {
            return res.status(400).json({
                success: false,
                message:
                    "Active Center Heads cannot be greater than Authorised Center Heads.",
            });
        }

        if (visited < 0 || visited > active) {
            return res.status(400).json({
                success: false,
                message:
                    "Total Center Heads Visited Today cannot be greater than Active Center Heads.",
            });
        }

        if (newMembers < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Today's New Members cannot be negative.",
            });
        }

        // =================================================
        // OLD PHOTOS
        // =================================================

        let meetingPhoto1 =
            oldReport.meeting_photo_1;

        let meetingPhoto2 =
            oldReport.meeting_photo_2;
                    // =================================================
        // NEW PHOTO 1
        // =================================================

        if (
            req.files &&
            req.files.meeting_photo_1 &&
            req.files.meeting_photo_1.length > 0
        ) {
            meetingPhoto1 =
                `trainer-reports/${req.files.meeting_photo_1[0].filename}`;

            if (oldReport.meeting_photo_1) {
                deleteOldImage(
                    oldReport.meeting_photo_1
                );
            }
        }

        // =================================================
        // NEW PHOTO 2
        // =================================================

        if (
            req.files &&
            req.files.meeting_photo_2 &&
            req.files.meeting_photo_2.length > 0
        ) {
            meetingPhoto2 =
                `trainer-reports/${req.files.meeting_photo_2[0].filename}`;

            if (oldReport.meeting_photo_2) {
                deleteOldImage(
                    oldReport.meeting_photo_2
                );
            }
        }

        // =================================================
        // UPDATE DATABASE
        // =================================================

        await db.query(
            `
            UPDATE trainer_reports
            SET
                name = ?,
                designation = ?,
                taluka = ?,
                district = ?,
                mobile_number = ?,
                report_date = ?,

                total_authorised_center_heads = ?,
                total_active_center_heads = ?,

                today_visited_center_heads_names = ?,
                total_center_heads_visited_today = ?,

                todays_new_members = ?,

                additional_remarks = ?,

                meeting_photo_1 = ?,
                meeting_photo_2 = ?,

                status = ?

            WHERE id = ?
            `,
            [
                String(name).trim(),

                String(designation).trim(),

                String(taluka).trim(),

                String(district).trim(),

                mobile_number
                    ? String(mobile_number).trim()
                    : null,

                report_date,

                authorised,

                active,

                today_visited_center_heads_names
                    ? String(
                        today_visited_center_heads_names
                    ).trim()
                    : null,

                visited,

                newMembers,

                additional_remarks
                    ? String(additional_remarks).trim()
                    : null,

                meetingPhoto1,

                meetingPhoto2,

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
                meeting_photo_1,
                meeting_photo_2
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
        // DELETE PHOTO 1
        // =================================================

        if (rows[0].meeting_photo_1) {
            deleteOldImage(
                rows[0].meeting_photo_1
            );
        }

        // =================================================
        // DELETE PHOTO 2
        // =================================================

        if (rows[0].meeting_photo_2) {
            deleteOldImage(
                rows[0].meeting_photo_2
            );
        }

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