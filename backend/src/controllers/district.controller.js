const db = require("../config/db");
const { syncSystemUser, deleteSystemUser } = require("../utils/user.utils");

// ========================================
// GET ALL DISTRICTS
// GET /api/district
// ========================================

const getDistricts = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                name,
                report_date,
                status,
                contact_number,
                designation,
                district_name,
                district_code,
                taluka,
                joining_date,
                account_number,
                ifsc_code,
                bank_name,
                user_id,
                email,
                password,
                created_at,
                updated_at
            FROM districts
            ORDER BY id ASC
        `);

        return res.status(200).json({
            success: true,
            data: rows,
            total: rows.length,
        });

    } catch (error) {
        console.error("GET DISTRICTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch districts",
        });
    }
};


// ========================================
// GET SINGLE DISTRICT
// GET /api/district/:id
// ========================================

const getDistrictById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                id,
                name,
                report_date,
                status,
                contact_number,
                designation,
                district_name,
                district_code,
                taluka,
                joining_date,
                account_number,
                ifsc_code,
                bank_name,
                user_id,
                email,
                password,
                created_at,
                updated_at
            FROM districts
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
        });

    } catch (error) {
        console.error("GET DISTRICT BY ID ERROR:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch district",
        });
    }
};


// ========================================
// CREATE DISTRICT
// POST /api/district
// ========================================

const createDistrict = async (req, res) => {
    try {
        const {
            name,
            report_date,
            status = "active",
            contact_number,
            designation,
            district_name,
            district_code,
            taluka,
            joining_date,
            account_number,
            ifsc_code,
            bank_name,
            user_id,
            email,
            password,
        } = req.body;

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Full Name is required",
            });
        }

        if (!contact_number || !String(contact_number).trim()) {
            return res.status(400).json({
                success: false,
                message: "Mobile Number is required",
            });
        }

        if (!user_id || !String(user_id).trim()) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        if (!password || !String(password).trim()) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }

        const normalizedStatus =
            String(status || "active").toLowerCase() === "inactive"
                ? "inactive"
                : "active";

        const cleanUserId = String(user_id).trim();

        // Check duplicate user_id
        const [userExists] = await db.query(
            "SELECT id FROM districts WHERE user_id = ? LIMIT 1",
            [cleanUserId]
        );

        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User ID already exists in districts",
            });
        }

        // Auto district code if missing
        let finalDistrictCode = district_code ? String(district_code).trim() : "";
        if (!finalDistrictCode) {
            const [maxRows] = await db.query("SELECT MAX(id) as maxId FROM districts");
            const nextNum = (maxRows[0]?.maxId || 0) + 1;
            finalDistrictCode = `DH-${String(nextNum).padStart(4, "0")}`;
        }

        const finalReportDate = report_date || new Date().toISOString().split("T")[0];

        const [result] = await db.query(
            `
            INSERT INTO districts
            (
                name,
                report_date,
                status,
                contact_number,
                designation,
                district_name,
                district_code,
                taluka,
                joining_date,
                account_number,
                ifsc_code,
                bank_name,
                user_id,
                email,
                password
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                String(name).trim(),
                finalReportDate,
                normalizedStatus,
                String(contact_number).trim(),
                designation ? String(designation).trim() : null,
                district_name ? String(district_name).trim() : null,
                finalDistrictCode,
                taluka ? String(taluka).trim() : null,
                joining_date || null,
                account_number ? String(account_number).trim() : null,
                ifsc_code ? String(ifsc_code).trim().toUpperCase() : null,
                bank_name ? String(bank_name).trim() : null,
                cleanUserId,
                email ? String(email).trim() : null,
                String(password).trim(),
            ]
        );

        // Sync with users table for authentication
        await syncSystemUser({
            user_id: cleanUserId,
            password: String(password).trim(),
            name: String(name).trim(),
            role: "district",
            status: normalizedStatus,
        });

        return res.status(201).json({
            success: true,
            message: "District added successfully",
            id: result.insertId,
            district_code: finalDistrictCode,
        });

    } catch (error) {
        console.error("CREATE DISTRICT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create district",
        });
    }
};


// ========================================
// UPDATE DISTRICT
// PUT /api/district/:id
// ========================================

const updateDistrict = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            report_date,
            status,
            contact_number,
            designation,
            district_name,
            district_code,
            taluka,
            joining_date,
            account_number,
            ifsc_code,
            bank_name,
            user_id,
            email,
            password,
        } = req.body;

        const [existing] = await db.query(
            "SELECT * FROM districts WHERE id = ? LIMIT 1",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }

        const oldRecord = existing[0];
        const finalName = name !== undefined ? String(name).trim() : oldRecord.name;
        const finalUserId = user_id !== undefined ? String(user_id).trim() : oldRecord.user_id;
        const normalizedStatus = status !== undefined
            ? (String(status).toLowerCase() === "inactive" ? "inactive" : "active")
            : oldRecord.status;

        // Check duplicate user_id if changed
        if (finalUserId !== oldRecord.user_id) {
            const [duplicateUser] = await db.query(
                "SELECT id FROM districts WHERE user_id = ? AND id != ?",
                [finalUserId, id]
            );
            if (duplicateUser.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "User ID already exists",
                });
            }
        }

        const finalPassword = password && String(password).trim() ? String(password).trim() : oldRecord.password;

        await db.query(
            `
            UPDATE districts
            SET
                name = ?,
                report_date = COALESCE(?, report_date),
                status = ?,
                contact_number = COALESCE(?, contact_number),
                designation = COALESCE(?, designation),
                district_name = COALESCE(?, district_name),
                district_code = COALESCE(?, district_code),
                taluka = COALESCE(?, taluka),
                joining_date = COALESCE(?, joining_date),
                account_number = COALESCE(?, account_number),
                ifsc_code = COALESCE(?, ifsc_code),
                bank_name = COALESCE(?, bank_name),
                user_id = ?,
                email = COALESCE(?, email),
                password = ?
            WHERE id = ?
            `,
            [
                finalName,
                report_date || null,
                normalizedStatus,
                contact_number ? String(contact_number).trim() : null,
                designation ? String(designation).trim() : null,
                district_name ? String(district_name).trim() : null,
                district_code ? String(district_code).trim() : null,
                taluka ? String(taluka).trim() : null,
                joining_date || null,
                account_number ? String(account_number).trim() : null,
                ifsc_code ? String(ifsc_code).trim().toUpperCase() : null,
                bank_name ? String(bank_name).trim() : null,
                finalUserId,
                email ? String(email).trim() : null,
                finalPassword,
                id,
            ]
        );

        // Sync with users table
        await syncSystemUser({
            user_id: finalUserId,
            password: finalPassword,
            name: finalName,
            role: "district",
            status: normalizedStatus,
            old_user_id: oldRecord.user_id,
        });

        return res.status(200).json({
            success: true,
            message: "District updated successfully",
        });

    } catch (error) {
        console.error("UPDATE DISTRICT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update district",
        });
    }
};


// ========================================
// DELETE DISTRICT
// DELETE /api/district/:id
// ========================================

const deleteDistrict = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT user_id FROM districts WHERE id = ? LIMIT 1",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }

        const [result] = await db.query("DELETE FROM districts WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "District not found",
            });
        }

        if (existing[0].user_id) {
            await deleteSystemUser(existing[0].user_id);
        }

        return res.status(200).json({
            success: true,
            message: "District deleted successfully",
        });

    } catch (error) {
        console.error("DELETE DISTRICT ERROR:", error);

        if (
            error.code === "ER_ROW_IS_REFERENCED_2" ||
            error.code === "ER_ROW_IS_REFERENCED"
        ) {
            return res.status(409).json({
                success: false,
                message: "District cannot be deleted because it is being used",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete district",
        });
    }
};

module.exports = {
    getDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deleteDistrict,
};