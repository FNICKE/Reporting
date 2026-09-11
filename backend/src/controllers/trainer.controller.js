const db = require("../config/db");
const { syncSystemUser, deleteSystemUser } = require("../utils/user.utils");

// =====================================================
// GET ALL TRAINERS / BDOS
// GET /api/trainer
// =====================================================

const getTrainers = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            ORDER BY tr.id DESC
        `);

        return res.status(200).json({
            success: true,
            data: rows,
            trainers: rows,
            total: rows.length,
            count: rows.length,
        });

    } catch (error) {
        console.error("GET TRAINERS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trainers",
        });
    }
};


// =====================================================
// GET TRAINERS BY DISTRICT
// GET /api/trainer/district/:districtId
// =====================================================

const getTrainersByDistrict = async (req, res) => {
    try {
        const { districtId } = req.params;

        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            WHERE tr.district_id = ?
            ORDER BY tr.id DESC
        `, [districtId]);

        return res.status(200).json({
            success: true,
            data: rows,
            trainers: rows,
            total: rows.length,
        });

    } catch (error) {
        console.error("GET TRAINERS BY DISTRICT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trainers",
        });
    }
};


// =====================================================
// GET TRAINERS BY TALUKA
// GET /api/trainer/taluka/:talukaId
// =====================================================

const getTrainersByTaluka = async (req, res) => {
    try {
        const { talukaId } = req.params;

        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            WHERE tr.taluka_id = ?
            ORDER BY tr.id DESC
        `, [talukaId]);

        return res.status(200).json({
            success: true,
            data: rows,
            trainers: rows,
            total: rows.length,
        });

    } catch (error) {
        console.error("GET TRAINERS BY TALUKA ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trainers",
        });
    }
};


// =====================================================
// GET TRAINERS BY VIBHAG
// GET /api/trainer/vibhag/:vibhagId
// =====================================================

const getTrainersByVibhag = async (req, res) => {
    try {
        const { vibhagId } = req.params;

        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            WHERE tr.vibhag_id = ?
            ORDER BY tr.id DESC
        `, [vibhagId]);

        return res.status(200).json({
            success: true,
            data: rows,
            trainers: rows,
            total: rows.length,
        });

    } catch (error) {
        console.error("GET TRAINERS BY VIBHAG ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trainers",
        });
    }
};


// =====================================================
// GET SINGLE TRAINER
// GET /api/trainer/:id
// =====================================================

const getTrainerById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            WHERE tr.id = ?
            LIMIT 1
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
            trainer: rows[0],
        });

    } catch (error) {
        console.error("GET TRAINER BY ID ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch trainer",
        });
    }
};


// =====================================================
// CREATE TRAINER / BDO
// POST /api/trainer
// =====================================================

const createTrainer = async (req, res) => {
    try {
        const {
            trainer_name,
            name,
            trainer_code,
            district_id,
            taluka_id,
            vibhag_id,
            contact_number,
            user_id,
            email,
            password,
            address,
            designation,
            joining_date,
            account_number,
            ifsc_code,
            bank_name,
            status = "active",
        } = req.body;

        const finalName = trainer_name || name;
        if (!finalName || !String(finalName).trim()) {
            return res.status(400).json({
                success: false,
                message: "Full Name is required",
            });
        }

        if (!district_id) {
            return res.status(400).json({
                success: false,
                message: "District is required",
            });
        }

        if (!taluka_id) {
            return res.status(400).json({
                success: false,
                message: "Taluka is required",
            });
        }

        const cleanUserId = user_id && String(user_id).trim()
            ? String(user_id).trim()
            : String(finalName).trim();

        const cleanPassword = password && String(password).trim()
            ? String(password).trim()
            : "123456";

        // Check duplicate user_id
        const [userExists] = await db.query(
            "SELECT id FROM trainers WHERE user_id = ? LIMIT 1",
            [cleanUserId]
        );

        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User ID already exists in Trainers/BDOs",
            });
        }

        // Auto generate trainer_code / BDO ID if missing
        let finalCode = trainer_code ? String(trainer_code).trim() : "";
        if (!finalCode) {
            const [maxRows] = await db.query("SELECT MAX(id) as maxId FROM trainers");
            const nextNum = (maxRows[0]?.maxId || 0) + 1;
            finalCode = `BDO-${String(nextNum).padStart(4, "0")}`;
        }

        const normalizedStatus =
            String(status || "active").toLowerCase() === "inactive"
                ? "inactive"
                : "active";

        const [result] = await db.query(`
            INSERT INTO trainers
            (
                trainer_name,
                trainer_code,
                district_id,
                taluka_id,
                vibhag_id,
                contact_number,
                user_id,
                email,
                password,
                address,
                designation,
                joining_date,
                account_number,
                ifsc_code,
                bank_name,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            String(finalName).trim(),
            finalCode,
            district_id,
            taluka_id,
            vibhag_id || null,
            contact_number ? String(contact_number).trim() : null,
            cleanUserId,
            email ? String(email).trim() : null,
            cleanPassword,
            address ? String(address).trim() : null,
            designation ? String(designation).trim() : null,
            joining_date || null,
            account_number ? String(account_number).trim() : null,
            ifsc_code ? String(ifsc_code).trim().toUpperCase() : null,
            bank_name ? String(bank_name).trim() : null,
            normalizedStatus,
        ]);

        // Sync with users table for authentication
        await syncSystemUser({
            user_id: cleanUserId,
            password: cleanPassword,
            name: String(finalName).trim(),
            role: "trainer",
            status: normalizedStatus,
        });

        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            WHERE tr.id = ?
            LIMIT 1
        `, [result.insertId]);

        return res.status(201).json({
            success: true,
            message: "BDO/Trainer created successfully",
            data: rows[0],
            trainer: rows[0],
            trainer_code: finalCode,
        });

    } catch (error) {
        console.error("CREATE TRAINER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create trainer",
        });
    }
};


// =====================================================
// UPDATE TRAINER / BDO
// PUT /api/trainer/:id
// =====================================================

const updateTrainer = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            trainer_name,
            name,
            trainer_code,
            district_id,
            taluka_id,
            vibhag_id,
            contact_number,
            user_id,
            email,
            password,
            address,
            designation,
            joining_date,
            account_number,
            ifsc_code,
            bank_name,
            status,
        } = req.body;

        const [existing] = await db.query(
            "SELECT * FROM trainers WHERE id = ? LIMIT 1",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        const oldRecord = existing[0];
        const finalName = (trainer_name || name) !== undefined ? String(trainer_name || name).trim() : oldRecord.trainer_name;
        const finalUserId = user_id !== undefined ? String(user_id).trim() : oldRecord.user_id;
        const finalDistrictId = district_id !== undefined ? district_id : oldRecord.district_id;
        const finalTalukaId = taluka_id !== undefined ? taluka_id : oldRecord.taluka_id;
        const normalizedStatus = status !== undefined
            ? (String(status).toLowerCase() === "inactive" ? "inactive" : "active")
            : oldRecord.status;

        // Check duplicate user_id if changed
        if (finalUserId && finalUserId !== oldRecord.user_id) {
            const [duplicateUser] = await db.query(
                "SELECT id FROM trainers WHERE user_id = ? AND id != ?",
                [finalUserId, id]
            );
            if (duplicateUser.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "User ID already exists in Trainers/BDOs",
                });
            }
        }

        const finalPassword = password && String(password).trim()
            ? String(password).trim()
            : oldRecord.password;

        await db.query(`
            UPDATE trainers
            SET
                trainer_name = ?,
                trainer_code = COALESCE(?, trainer_code),
                district_id = ?,
                taluka_id = ?,
                vibhag_id = COALESCE(?, vibhag_id),
                contact_number = COALESCE(?, contact_number),
                user_id = ?,
                email = COALESCE(?, email),
                password = ?,
                address = COALESCE(?, address),
                designation = COALESCE(?, designation),
                joining_date = COALESCE(?, joining_date),
                account_number = COALESCE(?, account_number),
                ifsc_code = COALESCE(?, ifsc_code),
                bank_name = COALESCE(?, bank_name),
                status = ?
            WHERE id = ?
        `, [
            finalName,
            trainer_code ? String(trainer_code).trim() : null,
            finalDistrictId,
            finalTalukaId,
            vibhag_id || null,
            contact_number ? String(contact_number).trim() : null,
            finalUserId,
            email ? String(email).trim() : null,
            finalPassword,
            address ? String(address).trim() : null,
            designation ? String(designation).trim() : null,
            joining_date || null,
            account_number ? String(account_number).trim() : null,
            ifsc_code ? String(ifsc_code).trim().toUpperCase() : null,
            bank_name ? String(bank_name).trim() : null,
            normalizedStatus,
            id,
        ]);

        // Sync with users table
        await syncSystemUser({
            user_id: finalUserId,
            password: finalPassword,
            name: finalName,
            role: "trainer",
            status: normalizedStatus,
            old_user_id: oldRecord.user_id,
        });

        const [rows] = await db.query(`
            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,
                tr.district_id,
                d.district_name,
                d.name AS district_head_name,
                tr.taluka_id,
                t.taluka_name,
                t.name AS taluka_head_name,
                tr.vibhag_id,
                v.vibhag AS vibhag_name,
                tr.contact_number,
                tr.user_id,
                tr.email,
                tr.password,
                tr.address,
                tr.designation,
                tr.joining_date,
                tr.account_number,
                tr.ifsc_code,
                tr.bank_name,
                tr.status,
                tr.created_at,
                tr.updated_at
            FROM trainers tr
            LEFT JOIN districts d ON tr.district_id = d.id
            LEFT JOIN talukas t ON tr.taluka_id = t.id
            LEFT JOIN vibhags v ON tr.vibhag_id = v.id
            WHERE tr.id = ?
            LIMIT 1
        `, [id]);

        return res.status(200).json({
            success: true,
            message: "Trainer updated successfully",
            data: rows[0],
            trainer: rows[0],
        });

    } catch (error) {
        console.error("UPDATE TRAINER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update trainer",
        });
    }
};


// =====================================================
// DELETE TRAINER / BDO
// DELETE /api/trainer/:id
// =====================================================

const deleteTrainer = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT user_id FROM trainers WHERE id = ? LIMIT 1",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        const [result] = await db.query("DELETE FROM trainers WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Trainer not found",
            });
        }

        if (existing[0].user_id) {
            await deleteSystemUser(existing[0].user_id);
        }

        return res.status(200).json({
            success: true,
            message: "Trainer deleted successfully",
        });

    } catch (error) {
        console.error("DELETE TRAINER ERROR:", error);

        if (
            error.code === "ER_ROW_IS_REFERENCED_2" ||
            error.code === "ER_ROW_IS_REFERENCED"
        ) {
            return res.status(409).json({
                success: false,
                message: "Trainer cannot be deleted because it is being used",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete trainer",
        });
    }
};

module.exports = {
    getTrainers,
    getTrainerById,
    getTrainersByDistrict,
    getTrainersByTaluka,
    getTrainersByVibhag,
    createTrainer,
    updateTrainer,
    deleteTrainer,
};