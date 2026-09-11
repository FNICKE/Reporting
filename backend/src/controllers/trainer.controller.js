const db = require("../config/db");


// =====================================================
// GET ALL TRAINERS
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
                d.name AS district_name,

                tr.taluka_id,
                t.name AS taluka_name,

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

            LEFT JOIN districts d
                ON tr.district_id = d.id

            LEFT JOIN talukas t
                ON tr.taluka_id = t.id

            LEFT JOIN vibhags v
                ON tr.vibhag_id = v.id

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

        console.error(
            "GET TRAINERS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch trainers",

        });

    }

};


// =====================================================
// GET SINGLE TRAINER
// GET /api/trainer/:id
// =====================================================

const getTrainerById = async (
    req,
    res
) => {

    try {

        const [rows] = await db.query(`

            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,

                tr.district_id,
                d.name AS district_name,

                tr.taluka_id,
                t.name AS taluka_name,

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

            LEFT JOIN districts d
                ON tr.district_id = d.id

            LEFT JOIN talukas t
                ON tr.taluka_id = t.id

            LEFT JOIN vibhags v
                ON tr.vibhag_id = v.id

            WHERE tr.id = ?

            LIMIT 1

        `, [

            req.params.id

        ]);


        if (
            rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Trainer not found",

            });

        }


        return res.status(200).json({

            success: true,

            data:
                rows[0],

            trainer:
                rows[0],

        });

    } catch (error) {

        console.error(
            "GET TRAINER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch trainer",

        });

    }

};


// =====================================================
// GET TRAINERS BY DISTRICT
// GET /api/trainer/district/:districtId
// =====================================================

const getTrainersByDistrict = async (
    req,
    res
) => {

    try {

        const districtId =
            req.params.districtId;


        const [rows] = await db.query(`

            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,

                tr.district_id,
                d.name AS district_name,

                tr.taluka_id,
                t.name AS taluka_name,

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

            LEFT JOIN districts d
                ON tr.district_id = d.id

            LEFT JOIN talukas t
                ON tr.taluka_id = t.id

            LEFT JOIN vibhags v
                ON tr.vibhag_id = v.id

            WHERE tr.district_id = ?

            ORDER BY tr.id DESC

        `, [

            districtId

        ]);


        return res.status(200).json({

            success: true,

            data: rows,

            trainers: rows,

            total: rows.length,

            count: rows.length,

        });

    } catch (error) {

        console.error(
            "GET TRAINERS BY DISTRICT ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch trainers",

        });

    }

};


// =====================================================
// GET TRAINERS BY TALUKA
// GET /api/trainer/taluka/:talukaId
// =====================================================

const getTrainersByTaluka = async (
    req,
    res
) => {

    try {

        const talukaId =
            req.params.talukaId;


        const [rows] = await db.query(`

            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,

                tr.district_id,
                d.name AS district_name,

                tr.taluka_id,
                t.name AS taluka_name,

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

            LEFT JOIN districts d
                ON tr.district_id = d.id

            LEFT JOIN talukas t
                ON tr.taluka_id = t.id

            LEFT JOIN vibhags v
                ON tr.vibhag_id = v.id

            WHERE tr.taluka_id = ?

            ORDER BY tr.id DESC

        `, [

            talukaId

        ]);


        return res.status(200).json({

            success: true,

            data: rows,

            trainers: rows,

            total: rows.length,

            count: rows.length,

        });

    } catch (error) {

        console.error(
            "GET TRAINERS BY TALUKA ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch trainers",

        });

    }

};


// =====================================================
// GET TRAINERS BY VIBHAG
// GET /api/trainer/vibhag/:vibhagId
// =====================================================

const getTrainersByVibhag = async (
    req,
    res
) => {

    try {

        const vibhagId =
            req.params.vibhagId;


        const [rows] = await db.query(`

            SELECT
                tr.id,
                tr.trainer_name,
                tr.trainer_code,

                tr.district_id,
                d.name AS district_name,

                tr.taluka_id,
                t.name AS taluka_name,

                tr.vibhag_id,
                v.vibhag AS vibhag_name,

                tr.contact_number,
                tr.user_id,
                tr.email,
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

            LEFT JOIN districts d
                ON tr.district_id = d.id

            LEFT JOIN talukas t
                ON tr.taluka_id = t.id

            LEFT JOIN vibhags v
                ON tr.vibhag_id = v.id

            WHERE tr.vibhag_id = ?

            ORDER BY tr.id DESC

        `, [

            vibhagId

        ]);


        return res.status(200).json({

            success: true,

            data: rows,

            trainers: rows,

            total: rows.length,

            count: rows.length,

        });

    } catch (error) {

        console.error(
            "GET TRAINERS BY VIBHAG ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch trainers",

        });

    }

};


// =====================================================
// CREATE TRAINER
// POST /api/trainer
// =====================================================

const createTrainer = async (
    req,
    res
) => {

    try {

        const {

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
            bank_name

        } = req.body;


        // =================================================
        // REQUIRED FIELD CHECK
        // =================================================

        if (

            !trainer_name ||

            !trainer_code ||

            !district_id ||

            !taluka_id ||

            !vibhag_id ||

            !contact_number ||

            !user_id ||

            !email ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All required fields are required",

            });

        }


        // =================================================
        // CHECK DISTRICT
        // =================================================

        const [district] =
            await db.query(`

                SELECT id

                FROM districts

                WHERE id = ?

                LIMIT 1

            `, [

                district_id

            ]);


        if (
            district.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid district",

            });

        }


        // =================================================
        // CHECK TALUKA
        // =================================================

        const [taluka] =
            await db.query(`

                SELECT id

                FROM talukas

                WHERE id = ?

                AND district_id = ?

                LIMIT 1

            `, [

                taluka_id,

                district_id

            ]);


        if (
            taluka.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected taluka does not belong to selected district",

            });

        }


        // =================================================
        // CHECK VIBHAG
        // =================================================

        const [vibhag] =
            await db.query(`

                SELECT id

                FROM vibhags

                WHERE id = ?

                AND district_id = ?

                AND taluka_id = ?

                LIMIT 1

            `, [

                vibhag_id,

                district_id,

                taluka_id

            ]);


        if (
            vibhag.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected Vibhag does not belong to selected district and taluka",

            });

        }


        // =================================================
        // CHECK DUPLICATE TRAINER CODE
        // =================================================

        const [existingTrainer] =
            await db.query(`

                SELECT id

                FROM trainers

                WHERE trainer_code = ?

                LIMIT 1

            `, [

                trainer_code

            ]);


        if (
            existingTrainer.length > 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Trainer ID already exists",

            });

        }


        // =================================================
        // CHECK DUPLICATE USER ID
        // =================================================

        const [existingUser] =
            await db.query(`

                SELECT id

                FROM trainers

                WHERE user_id = ?

                LIMIT 1

            `, [

                user_id

            ]);


        if (
            existingUser.length > 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID already exists",

            });

        }


        // =================================================
        // INSERT TRAINER
        // =================================================

        const [result] =
            await db.query(`

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

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )

            `, [

                trainer_name,

                trainer_code,

                district_id,

                taluka_id,

                vibhag_id,

                contact_number,

                user_id,

                email,

                password,

                address || null,

                designation || null,

                joining_date || null,

                account_number || null,

                ifsc_code || null,

                bank_name || null,

                "active"

            ]);


        // =================================================
        // GET CREATED TRAINER
        // =================================================

        const [rows] =
            await db.query(`

                SELECT
                    tr.id,
                    tr.trainer_name,
                    tr.trainer_code,

                    tr.district_id,
                    d.name AS district_name,

                    tr.taluka_id,
                    t.name AS taluka_name,

                    tr.vibhag_id,
                    v.vibhag AS vibhag_name,

                    tr.contact_number,
                    tr.user_id,
                    tr.email,
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

                LEFT JOIN districts d
                    ON tr.district_id = d.id

                LEFT JOIN talukas t
                    ON tr.taluka_id = t.id

                LEFT JOIN vibhags v
                    ON tr.vibhag_id = v.id

                WHERE tr.id = ?

                LIMIT 1

            `, [

                result.insertId

            ]);


        return res.status(201).json({

            success: true,

            message:
                "Trainer added successfully",

            data:
                rows[0],

            trainer:
                rows[0],

        });

    } catch (error) {

        console.error(
            "CREATE TRAINER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create Trainer",

        });

    }

};


// =====================================================
// UPDATE TRAINER
// PUT /api/trainer/:id
// =====================================================

const updateTrainer = async (
    req,
    res
) => {

    try {

        const {

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
            status,
            designation,
            joining_date,
            account_number,
            ifsc_code,
            bank_name

        } = req.body;


        const trainerId =
            req.params.id;


        // =================================================
        // CHECK TRAINER
        // =================================================

        const [existingTrainerRows] =
            await db.query(`

                SELECT *

                FROM trainers

                WHERE id = ?

                LIMIT 1

            `, [

                trainerId

            ]);


        if (
            existingTrainerRows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Trainer not found",

            });

        }


        const oldTrainer =
            existingTrainerRows[0];


        // =================================================
        // CHECK DISTRICT
        // =================================================

        const [district] =
            await db.query(`

                SELECT id

                FROM districts

                WHERE id = ?

                LIMIT 1

            `, [

                district_id

            ]);


        if (
            district.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid district",

            });

        }


        // =================================================
        // CHECK TALUKA
        // =================================================

        const [taluka] =
            await db.query(`

                SELECT id

                FROM talukas

                WHERE id = ?

                AND district_id = ?

                LIMIT 1

            `, [

                taluka_id,

                district_id

            ]);


        if (
            taluka.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected taluka does not belong to selected district",

            });

        }


        // =================================================
        // CHECK VIBHAG
        // =================================================

        const [vibhag] =
            await db.query(`

                SELECT id

                FROM vibhags

                WHERE id = ?

                AND district_id = ?

                AND taluka_id = ?

                LIMIT 1

            `, [

                vibhag_id,

                district_id,

                taluka_id

            ]);


        if (
            vibhag.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected Vibhag does not belong to selected district and taluka",

            });

        }


        // =================================================
        // CHECK DUPLICATE TRAINER CODE
        // =================================================

        const [duplicateCode] =
            await db.query(`

                SELECT id

                FROM trainers

                WHERE trainer_code = ?

                AND id != ?

                LIMIT 1

            `, [

                trainer_code,

                trainerId

            ]);


        if (
            duplicateCode.length > 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Trainer ID already exists",

            });

        }


        // =================================================
        // CHECK DUPLICATE USER ID
        // =================================================

        const [duplicateUser] =
            await db.query(`

                SELECT id

                FROM trainers

                WHERE user_id = ?

                AND id != ?

                LIMIT 1

            `, [

                user_id,

                trainerId

            ]);


        if (
            duplicateUser.length > 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID already exists",

            });

        }


        // =================================================
        // UPDATE WITH PASSWORD
        // =================================================

        if (
            password &&
            String(password).trim() !== ""
        ) {

            await db.query(`

                UPDATE trainers

                SET

                    trainer_name = ?,

                    trainer_code = ?,

                    district_id = ?,

                    taluka_id = ?,

                    vibhag_id = ?,

                    contact_number = ?,

                    user_id = ?,

                    email = ?,

                    password = ?,

                    address = ?,

                    designation = ?,

                    joining_date = ?,

                    account_number = ?,

                    ifsc_code = ?,

                    bank_name = ?,

                    status = ?

                WHERE id = ?

            `, [

                trainer_name,

                trainer_code,

                district_id,

                taluka_id,

                vibhag_id,

                contact_number,

                user_id,

                email,

                password,

                address || null,

                designation || null,

                joining_date || null,

                account_number || null,

                ifsc_code || null,

                bank_name || null,

                status || "active",

                trainerId

            ]);

        } else {

            // =================================================
            // UPDATE WITHOUT PASSWORD
            // =================================================

            await db.query(`

                UPDATE trainers

                SET

                    trainer_name = ?,

                    trainer_code = ?,

                    district_id = ?,

                    taluka_id = ?,

                    vibhag_id = ?,

                    contact_number = ?,

                    user_id = ?,

                    email = ?,

                    address = ?,

                    designation = ?,

                    joining_date = ?,

                    account_number = ?,

                    ifsc_code = ?,

                    bank_name = ?,

                    status = ?

                WHERE id = ?

            `, [

                trainer_name,

                trainer_code,

                district_id,

                taluka_id,

                vibhag_id,

                contact_number,

                user_id,

                email,

                address || null,

                designation || null,

                joining_date || null,

                account_number || null,

                ifsc_code || null,

                bank_name || null,

                status || "active",

                trainerId

            ]);

        }


        // =================================================
        // GET UPDATED TRAINER
        // =================================================

        const [rows] =
            await db.query(`

                SELECT
                    tr.id,
                    tr.trainer_name,
                    tr.trainer_code,

                    tr.district_id,
                    d.name AS district_name,

                    tr.taluka_id,
                    t.name AS taluka_name,

                    tr.vibhag_id,
                    v.vibhag AS vibhag_name,

                    tr.contact_number,
                    tr.user_id,
                    tr.email,
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

                LEFT JOIN districts d
                    ON tr.district_id = d.id

                LEFT JOIN talukas t
                    ON tr.taluka_id = t.id

                LEFT JOIN vibhags v
                    ON tr.vibhag_id = v.id

                WHERE tr.id = ?

                LIMIT 1

            `, [

                trainerId

            ]);


        return res.status(200).json({

            success: true,

            message:
                "Trainer updated successfully",

            data:
                rows[0],

            trainer:
                rows[0],

        });

    } catch (error) {

        console.error(
            "UPDATE TRAINER ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update Trainer",

        });

    }

};


// =====================================================
// DELETE TRAINER
// DELETE /api/trainer/:id
// =====================================================

const deleteTrainer = async (
    req,
    res
) => {

    try {

        const trainerId =
            req.params.id;


        const [result] =
            await db.query(`

                DELETE FROM trainers

                WHERE id = ?

            `, [

                trainerId

            ]);


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Trainer not found",

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Trainer deleted successfully",

        });

    } catch (error) {

        console.error(
            "DELETE TRAINER ERROR:",
            error
        );


        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2"
            ||
            error.code ===
            "ER_ROW_IS_REFERENCED"
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Trainer cannot be deleted because it is being used",

            });

        }


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete Trainer",

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

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