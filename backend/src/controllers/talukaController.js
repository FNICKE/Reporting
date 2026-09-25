const db = require("../config/db");
const { syncSystemUser, deleteSystemUser } = require("../utils/userUtils");

// GET ALL TALUKAS
// GET /api/taluka

const getTalukas = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                t.id,
                t.taluka_code,
                t.name,
                t.contact_number,
                t.designation,
                t.district_id,
                COALESCE(NULLIF(t.district_name, ''), NULLIF(d.district_name, ''), d.name, '') AS district_name,
                d.name AS district_head_name,
                t.taluka_name,
                t.joining_date,
                t.status,
                t.account_number,
                t.ifsc_code,
                t.bank_name,
                t.user_id,
                t.email,
                t.password,
                t.created_at,
                t.updated_at
            FROM talukas t
            LEFT JOIN districts d
                ON d.id = t.district_id
            ORDER BY t.id DESC
        `);

        return res.status(200).json({
            success: true,
            data: rows,
            talukas: rows,
            count: rows.length,
            total: rows.length,
        });

    } catch (error) {
        console.error("GET TALUKAS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch Talukas",
        });
    }
};


// GET TALUKAS BY DISTRICT
// GET /api/taluka/district/:districtId

const getTalukasByDistrict = async (req, res) => {
    try {
        const { districtId } = req.params;

        if (!districtId) {
            return res.status(400).json({
                success: false,
                message: "District ID is required",
            });
        }

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.taluka_code,
                t.name,
                t.contact_number,
                t.designation,
                t.district_id,
                COALESCE(NULLIF(t.district_name, ''), NULLIF(d.district_name, ''), d.name, '') AS district_name,
                d.name AS district_head_name,
                t.taluka_name,
                t.joining_date,
                t.status,
                t.account_number,
                t.ifsc_code,
                t.bank_name,
                t.user_id,
                t.email,
                t.password,
                t.created_at,
                t.updated_at
            FROM talukas t
            LEFT JOIN districts d
                ON d.id = t.district_id
            WHERE t.district_id = ?
            ORDER BY t.id DESC
        `, [districtId]);

        return res.status(200).json({
            success: true,
            data: rows,
            talukas: rows,
            count: rows.length,
            total: rows.length,
        });

    } catch (error) {
        console.error("GET TALUKAS BY DISTRICT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch Talukas for district",
        });
    }
};


// GET SINGLE TALUKA
// GET /api/taluka/:id

const getTalukaById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.taluka_code,
                t.name,
                t.contact_number,
                t.designation,
                t.district_id,
                COALESCE(NULLIF(t.district_name, ''), NULLIF(d.district_name, ''), d.name, '') AS district_name,
                d.name AS district_head_name,
                t.taluka_name,
                t.joining_date,
                t.status,
                t.account_number,
                t.ifsc_code,
                t.bank_name,
                t.user_id,
                t.email,
                t.password,
                t.created_at,
                t.updated_at
            FROM talukas t
            LEFT JOIN districts d
                ON d.id = t.district_id
            WHERE t.id = ?
            LIMIT 1
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Taluka not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
            taluka: rows[0],
        });

    } catch (error) {
        console.error("GET TALUKA BY ID ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch Taluka",
        });
    }
};


// CREATE TALUKA
// POST /api/taluka

const createTaluka = async (req, res) => {
    try {
        const {
            taluka_code,
            name,
            contact_number,
            designation,
            district_id,
            district_name,
            district,
            taluka_name,
            taluka,
            joining_date,
            status = "active",
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

        const finalTalukaName = taluka_name || taluka || name;

        const rawDistrictName = district_name || district || null;
        let finalDistrictId = district_id ? Number(district_id) : null;
        let finalDistrictName = rawDistrictName ? String(rawDistrictName).trim() : "";

        if (finalDistrictId) {
            const [dRows] = await db.query(
                "SELECT id, district_name, name FROM districts WHERE id = ? LIMIT 1",
                [finalDistrictId]
            );
            if (dRows.length > 0) {
                finalDistrictId = dRows[0].id;
                if (!finalDistrictName) {
                    finalDistrictName = dRows[0].district_name || dRows[0].name || "";
                }
            } else {
                finalDistrictId = null;
            }
        }

        if (!finalDistrictId && finalDistrictName) {
            const [findD] = await db.query(
                "SELECT id, district_name, name FROM districts WHERE LOWER(TRIM(district_name)) = LOWER(?) OR LOWER(TRIM(name)) = LOWER(?) LIMIT 1",
                [finalDistrictName, finalDistrictName]
            );
            if (findD.length > 0) {
                finalDistrictId = findD[0].id;
                finalDistrictName = findD[0].district_name || findD[0].name || finalDistrictName;
            } else {
                const generatedDistrictUserId = `district_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                const [newD] = await db.query(
                    "INSERT INTO districts (district_name, name, user_id, contact_number, password, status) VALUES (?, ?, ?, '', '123456', 'active')",
                    [finalDistrictName, finalDistrictName, generatedDistrictUserId]
                );
                finalDistrictId = newD.insertId;
            }
        }

        const cleanUserId = String(user_id ?? "").trim() || String(name).trim();

        if (!cleanUserId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const cleanPassword = password && String(password).trim()
            ? String(password).trim()
            : "123456";

        // Check duplicate user_id
        const [userExists] = await db.query(
            "SELECT id FROM talukas WHERE user_id = ? LIMIT 1",
            [cleanUserId]
        );

        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User ID already exists in Talukas",
            });
        }

        // Auto generate taluka_code if missing
        let finalTalukaCode = taluka_code ? String(taluka_code).trim() : "";
        if (!finalTalukaCode) {
            const [maxRows] = await db.query("SELECT MAX(id) as maxId FROM talukas");
            const nextNum = (maxRows[0]?.maxId || 0) + 1;
            finalTalukaCode = `TH-${String(nextNum).padStart(4, "0")}`;
        }

        const normalizedStatus =
            String(status || "active").toLowerCase() === "inactive"
                ? "inactive"
                : "active";

        const [result] = await db.query(`
            INSERT INTO talukas
            (
                taluka_code,
                name,
                district_id,
                district_name,
                taluka_name,
                contact_number,
                designation,
                joining_date,
                status,
                account_number,
                ifsc_code,
                bank_name,
                user_id,
                email,
                password
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            finalTalukaCode,
            String(name).trim(),
            finalDistrictId,
            finalDistrictName || null,
            String(finalTalukaName).trim(),
            contact_number ? String(contact_number).trim() : null,
            designation ? String(designation).trim() : null,
            joining_date || null,
            normalizedStatus,
            account_number ? String(account_number).trim() : null,
            ifsc_code ? String(ifsc_code).trim().toUpperCase() : null,
            bank_name ? String(bank_name).trim() : null,
            cleanUserId,
            email ? String(email).trim() : null,
            cleanPassword,
        ]);

        // Sync with users table for authentication
        await syncSystemUser({
            user_id: cleanUserId,
            password: cleanPassword,
            name: String(name).trim(),
            role: "taluka",
            status: normalizedStatus,
        });

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.taluka_code,
                t.name,
                t.contact_number,
                t.designation,
                t.district_id,
                COALESCE(NULLIF(t.district_name, ''), NULLIF(d.district_name, ''), d.name, '') AS district_name,
                d.name AS district_head_name,
                t.taluka_name,
                t.joining_date,
                t.status,
                t.account_number,
                t.ifsc_code,
                t.bank_name,
                t.user_id,
                t.email,
                t.password,
                t.created_at,
                t.updated_at
            FROM talukas t
            LEFT JOIN districts d ON d.id = t.district_id
            WHERE t.id = ?
            LIMIT 1
        `, [result.insertId]);

        return res.status(201).json({
            success: true,
            message: "Taluka created successfully",
            data: rows[0],
            taluka: rows[0],
            taluka_code: finalTalukaCode,
        });

    } catch (error) {
        console.error("CREATE TALUKA ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create Taluka",
        });
    }
};


// UPDATE TALUKA
// PUT /api/taluka/:id

const updateTaluka = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            taluka_code,
            name,
            contact_number,
            designation,
            district_id,
            district_name,
            district,
            taluka_name,
            taluka,
            joining_date,
            status,
            account_number,
            ifsc_code,
            bank_name,
            user_id,
            email,
            password,
        } = req.body;

        const [existingRows] = await db.query(
            "SELECT * FROM talukas WHERE id = ? LIMIT 1",
            [id]
        );

        if (existingRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Taluka not found",
            });
        }

        const oldRecord = existingRows[0];
        const finalName = name !== undefined ? String(name).trim() : oldRecord.name;
        const finalUserId = user_id !== undefined
            ? (String(user_id).trim() || finalName)
            : oldRecord.user_id;

        const rawDistrictName = district_name !== undefined ? district_name : (district !== undefined ? district : oldRecord.district_name);
        let finalDistrictId = district_id !== undefined ? (district_id ? Number(district_id) : null) : oldRecord.district_id;
        let finalDistrictName = rawDistrictName ? String(rawDistrictName).trim() : "";

        if (finalDistrictId) {
            const [dRows] = await db.query(
                "SELECT id, district_name, name FROM districts WHERE id = ? LIMIT 1",
                [finalDistrictId]
            );
            if (dRows.length > 0) {
                finalDistrictId = dRows[0].id;
                if (!finalDistrictName) {
                    finalDistrictName = dRows[0].district_name || dRows[0].name || "";
                }
            } else {
                finalDistrictId = null;
            }
        }

        if (!finalDistrictId && finalDistrictName) {
            const [findD] = await db.query(
                "SELECT id, district_name, name FROM districts WHERE LOWER(TRIM(district_name)) = LOWER(?) OR LOWER(TRIM(name)) = LOWER(?) LIMIT 1",
                [finalDistrictName, finalDistrictName]
            );
            if (findD.length > 0) {
                finalDistrictId = findD[0].id;
                finalDistrictName = findD[0].district_name || findD[0].name || finalDistrictName;
            } else {
                const generatedDistrictUserId = `district_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                const [newD] = await db.query(
                    "INSERT INTO districts (district_name, name, user_id, contact_number, password, status) VALUES (?, ?, ?, '', '123456', 'active')",
                    [finalDistrictName, finalDistrictName, generatedDistrictUserId]
                );
                finalDistrictId = newD.insertId;
            }
        }

        const finalTalukaName = taluka_name || taluka || oldRecord.taluka_name || finalName;
        const normalizedStatus = status !== undefined
            ? (String(status).toLowerCase() === "inactive" ? "inactive" : "active")
            : oldRecord.status;

        // Check duplicate user_id if changed
        if (finalUserId && finalUserId !== oldRecord.user_id) {
            const [duplicateUser] = await db.query(
                "SELECT id FROM talukas WHERE user_id = ? AND id != ?",
                [finalUserId, id]
            );
            if (duplicateUser.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "User ID already exists in Talukas",
                });
            }
        }

        const finalPassword = password && String(password).trim()
            ? String(password).trim()
            : oldRecord.password;

        await db.query(`
            UPDATE talukas
            SET
                taluka_code = COALESCE(?, taluka_code),
                name = ?,
                district_id = ?,
                district_name = ?,
                taluka_name = ?,
                contact_number = COALESCE(?, contact_number),
                designation = COALESCE(?, designation),
                joining_date = COALESCE(?, joining_date),
                status = ?,
                account_number = COALESCE(?, account_number),
                ifsc_code = COALESCE(?, ifsc_code),
                bank_name = COALESCE(?, bank_name),
                user_id = ?,
                email = COALESCE(?, email),
                password = ?
            WHERE id = ?
        `, [
            taluka_code ? String(taluka_code).trim() : null,
            finalName,
            finalDistrictId,
            finalDistrictName || null,
            String(finalTalukaName).trim(),
            contact_number ? String(contact_number).trim() : null,
            designation ? String(designation).trim() : null,
            joining_date || null,
            normalizedStatus,
            account_number ? String(account_number).trim() : null,
            ifsc_code ? String(ifsc_code).trim().toUpperCase() : null,
            bank_name ? String(bank_name).trim() : null,
            finalUserId,
            email ? String(email).trim() : null,
            finalPassword,
            id,
        ]);

        // Sync with users table
        await syncSystemUser({
            user_id: finalUserId,
            password: finalPassword,
            name: finalName,
            role: "taluka",
            status: normalizedStatus,
            old_user_id: oldRecord.user_id,
        });

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.taluka_code,
                t.name,
                t.contact_number,
                t.designation,
                t.district_id,
                COALESCE(NULLIF(t.district_name, ''), NULLIF(d.district_name, ''), d.name, '') AS district_name,
                d.name AS district_head_name,
                t.taluka_name,
                t.joining_date,
                t.status,
                t.account_number,
                t.ifsc_code,
                t.bank_name,
                t.user_id,
                t.email,
                t.password,
                t.created_at,
                t.updated_at
            FROM talukas t
            LEFT JOIN districts d ON d.id = t.district_id
            WHERE t.id = ?
            LIMIT 1
        `, [id]);

        return res.status(200).json({
            success: true,
            message: "Taluka updated successfully",
            data: rows[0],
            taluka: rows[0],
        });

    } catch (error) {
        console.error("UPDATE TALUKA ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update Taluka",
        });
    }
};


// =====================================================
// DELETE TALUKA
// DELETE /api/taluka/:id
// =====================================================

const deleteTaluka = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT user_id FROM talukas WHERE id = ? LIMIT 1",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Taluka not found",
            });
        }

        const [[referenceCounts]] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM trainers WHERE taluka_id = ?) AS trainer_count,
                (SELECT COUNT(*) FROM vibhags WHERE taluka_id = ?) AS vibhag_count
        `, [id, id]);

        const trainerCount = Number(referenceCounts?.trainer_count || 0);
        const vibhagCount = Number(referenceCounts?.vibhag_count || 0);

        if (trainerCount > 0 || vibhagCount > 0) {
            const references = [];
            if (trainerCount > 0) references.push(`${trainerCount} trainer(s)`);
            if (vibhagCount > 0) references.push(`${vibhagCount} vibhag(s)`);

            return res.status(409).json({
                success: false,
                message: `Taluka cannot be deleted because it is used by ${references.join(" and ")}`,
            });
        }

        const [result] = await db.query("DELETE FROM talukas WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Taluka not found",
            });
        }

        if (existing[0].user_id) {
            await deleteSystemUser(existing[0].user_id);
        }

        return res.status(200).json({
            success: true,
            message: "Taluka deleted successfully",
        });

    } catch (error) {
        console.error("DELETE TALUKA ERROR:", error);

        if (error.code === "ER_DUP_ENTRY" && error.message.includes("user_id")) {
            return res.status(409).json({
                success: false,
                message: "User ID already exists in Talukas",
            });
        }

        if (
            error.code === "ER_ROW_IS_REFERENCED_2" ||
            error.code === "ER_ROW_IS_REFERENCED"
        ) {
            return res.status(409).json({
                success: false,
                message: "Taluka cannot be deleted because it is being used",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete Taluka",
        });
    }
};

module.exports = {
    getTalukas,
    getTalukasByDistrict,
    getTalukaById,
    createTaluka,
    updateTaluka,
    deleteTaluka,
};