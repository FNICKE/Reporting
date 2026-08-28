const db = require("../config/db");


// =====================================================
// GET ALL VIBHAGS
// GET /api/vibhag
// =====================================================

const getVibhags = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
SELECT
    vibhags.id,
    vibhags.head,
    vibhags.district_id,
    districts.name AS district_name,
    vibhags.taluka_id,
    talukas.name AS taluka_name,
    vibhags.contact_number,
    vibhags.user_id,
    vibhags.email,
    vibhags.password,
    vibhags.vibhag,
    vibhags.address,
    vibhags.status,
    vibhags.created_at,
    vibhags.updated_at
FROM vibhags

            LEFT JOIN districts
                ON vibhags.district_id = districts.id

            LEFT JOIN talukas
                ON vibhags.taluka_id = talukas.id

            ORDER BY vibhags.id DESC
            `
        );

        return res.status(200).json({

            success: true,

            data: rows,

            vibhags: rows,

            total: rows.length,

            count: rows.length,

        });

    } catch (error) {

        console.error(
            "GET VIBHAGS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch vibhags",

        });

    }

};


// =====================================================
// GET SINGLE VIBHAG
// GET /api/vibhag/:id
// =====================================================

const getVibhagById = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;

        const [rows] = await db.query(

            `
            SELECT
                vibhags.id,
                vibhags.head,
                vibhags.district_id,
                districts.name AS district_name,
                vibhags.taluka_id,
                talukas.name AS taluka_name,
                vibhags.contact_number,
                vibhags.user_id,
                vibhags.email,
                vibhags.vibhag,
                vibhags.address,
                vibhags.status,
                vibhags.created_at,
                vibhags.updated_at

            FROM vibhags

            LEFT JOIN districts
                ON vibhags.district_id = districts.id

            LEFT JOIN talukas
                ON vibhags.taluka_id = talukas.id

            WHERE vibhags.id = ?

            LIMIT 1
            `,

            [
                id
            ]

        );

        if (
            rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Vibhag not found",

            });

        }

        return res.status(200).json({

            success: true,

            data:
                rows[0],

            vibhag:
                rows[0],

        });

    } catch (error) {

        console.error(
            "GET VIBHAG ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch Vibhag",

        });

    }

};


// =====================================================
// CREATE VIBHAG
// POST /api/vibhag
// =====================================================

const createVibhag = async (
    req,
    res
) => {

    try {

        const {

            head,
            district_id,
            taluka_id,
            contact_number,
            user_id,
            email,
            password,
            vibhag,
            address,
            status,

        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !head ||
            !district_id ||
            !taluka_id ||
            !user_id ||
            !password ||
            !email ||
            !vibhag
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing",

            });

        }


        // =================================================
        // CHECK DISTRICT
        // =================================================

        const [districtRows] =
            await db.query(

                `
                SELECT id
                FROM districts
                WHERE id = ?
                LIMIT 1
                `,

                [
                    district_id
                ]

            );


        if (
            districtRows.length === 0
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

        const [talukaRows] =
            await db.query(

                `
                SELECT id
                FROM talukas
                WHERE id = ?
                AND district_id = ?
                LIMIT 1
                `,

                [

                    taluka_id,

                    district_id,

                ]

            );


        if (
            talukaRows.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected taluka does not belong to selected district",

            });

        }


        // =================================================
        // CHECK USER ID IN USERS
        // =================================================

        const [existingUser] =
            await db.query(

                `
                SELECT id
                FROM users
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    user_id
                ]

            );


        if (
            existingUser.length > 0
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "User ID already exists",

            });

        }


        // =================================================
        // CHECK USER ID IN VIBHAGS
        // =================================================

        const [existingVibhag] =
            await db.query(

                `
                SELECT id
                FROM vibhags
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    user_id
                ]

            );


        if (
            existingVibhag.length > 0
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Vibhag User ID already exists",

            });

        }


        // =================================================
        // GET SINGLE DATABASE CONNECTION
        // NO POOL
        // =================================================

        const connection =
            await db.connectDatabase();


        try {

            // =================================================
            // START TRANSACTION
            // =================================================

            await connection.beginTransaction();


            // =================================================
            // INSERT VIBHAG
            // =================================================

            const [vibhagResult] =
                await connection.query(

                    `
                    INSERT INTO vibhags
                    (
                        head,
                        district_id,
                        taluka_id,
                        contact_number,
                        user_id,
                        email,
                        password,
                        vibhag,
                        address,
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
                        ?
                    )
                    `,

                    [

                        head,

                        district_id,

                        taluka_id,

                        contact_number ||
                            null,

                        user_id,

                        email,

                        password,

                        vibhag,

                        address ||
                            null,

                        status ||
                            "active",

                    ]

                );


            // =================================================
            // INSERT USER
            // =================================================

            await connection.query(

                `
                INSERT INTO users
                (
                    user_id,
                    password,
                    name,
                    role,
                    status
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,

                [

                    user_id,

                    password,

                    head,

                    "vibhag",

                    status ||
                        "active",

                ]

            );


            // =================================================
            // COMMIT
            // =================================================

            await connection.commit();


            // =================================================
            // SUCCESS
            // =================================================

            return res.status(201).json({

                success: true,

                message:
                    "Vibhag and user created successfully",

                data: {

                    id:
                        vibhagResult.insertId,

                    user_id:
                        user_id,

                    role:
                        "vibhag",

                },

                vibhag: {

                    id:
                        vibhagResult.insertId,

                    user_id:
                        user_id,

                    role:
                        "vibhag",

                },

            });


        } catch (transactionError) {

            // =================================================
            // ROLLBACK
            // =================================================

            await connection.rollback();

            throw transactionError;

        }

        // =================================================
        // IMPORTANT
        // NO connection.release()
        // BECAUSE THIS IS NOT A POOL
        // =================================================


    } catch (error) {

        console.error(
            "CREATE VIBHAG ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create Vibhag",

        });

    }

};


// =====================================================
// UPDATE VIBHAG
// PUT /api/vibhag/:id
// =====================================================

const updateVibhag = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {

            head,
            district_id,
            taluka_id,
            contact_number,
            user_id,
            email,
            password,
            vibhag,
            address,
            status,

        } = req.body;


        // =================================================
        // CHECK VIBHAG
        // =================================================

        const [existingRows] =
            await db.query(

                `
                SELECT *
                FROM vibhags
                WHERE id = ?
                LIMIT 1
                `,

                [
                    id
                ]

            );


        if (
            existingRows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Vibhag not found",

            });

        }


        const oldVibhag =
            existingRows[0];


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !head ||
            !district_id ||
            !taluka_id ||
            !user_id ||
            !email ||
            !vibhag
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing",

            });

        }


        // =================================================
        // CHECK DISTRICT
        // =================================================

        const [districtRows] =
            await db.query(

                `
                SELECT id
                FROM districts
                WHERE id = ?
                LIMIT 1
                `,

                [
                    district_id
                ]

            );


        if (
            districtRows.length === 0
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

        const [talukaRows] =
            await db.query(

                `
                SELECT id
                FROM talukas
                WHERE id = ?
                AND district_id = ?
                LIMIT 1
                `,

                [

                    taluka_id,

                    district_id,

                ]

            );


        if (
            talukaRows.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Selected taluka does not belong to selected district",

            });

        }


        // =================================================
        // PASSWORD
        // =================================================

        const finalPassword =

            password &&
            String(password).trim()

                ? String(password).trim()

                : oldVibhag.password;


        // =================================================
        // GET SINGLE DATABASE CONNECTION
        // NO POOL
        // =================================================

        const connection =
            await db.connectDatabase();


        try {

            // =================================================
            // START TRANSACTION
            // =================================================

            await connection.beginTransaction();


            // =================================================
            // UPDATE VIBHAGS
            // =================================================

            await connection.query(

                `
                UPDATE vibhags

                SET

                    head = ?,

                    district_id = ?,

                    taluka_id = ?,

                    contact_number = ?,

                    user_id = ?,

                    email = ?,

                    password = ?,

                    vibhag = ?,

                    address = ?,

                    status = ?

                WHERE id = ?
                `,

                [

                    head,

                    district_id,

                    taluka_id,

                    contact_number ||
                        null,

                    user_id,

                    email,

                    finalPassword,

                    vibhag,

                    address ||
                        null,

                    status ||
                        "active",

                    id,

                ]

            );


            // =================================================
            // UPDATE USERS
            // =================================================

            await connection.query(

                `
                UPDATE users

                SET

                    user_id = ?,

                    password = ?,

                    name = ?,

                    status = ?

                WHERE user_id = ?

                AND role = 'vibhag'
                `,

                [

                    user_id,

                    finalPassword,

                    head,

                    status ||
                        "active",

                    oldVibhag.user_id,

                ]

            );


            // =================================================
            // COMMIT
            // =================================================

            await connection.commit();


        } catch (transactionError) {

            // =================================================
            // ROLLBACK
            // =================================================

            await connection.rollback();

            throw transactionError;

        }


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Vibhag updated successfully",

        });


    } catch (error) {

        console.error(
            "UPDATE VIBHAG ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update Vibhag",

        });

    }

};


// =====================================================
// DELETE VIBHAG
// DELETE /api/vibhag/:id
// =====================================================

const deleteVibhag = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        // =================================================
        // GET USER ID
        // =================================================

        const [rows] =
            await db.query(

                `
                SELECT user_id
                FROM vibhags
                WHERE id = ?
                LIMIT 1
                `,

                [
                    id
                ]

            );


        if (
            rows.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Vibhag not found",

            });

        }


        const userId =
            rows[0].user_id;


        // =================================================
        // GET SINGLE DATABASE CONNECTION
        // NO POOL
        // =================================================

        const connection =
            await db.connectDatabase();


        try {

            // =================================================
            // START TRANSACTION
            // =================================================

            await connection.beginTransaction();


            // =================================================
            // DELETE USER
            // =================================================

            await connection.query(

                `
                DELETE FROM users

                WHERE user_id = ?

                AND role = 'vibhag'
                `,

                [
                    userId
                ]

            );


            // =================================================
            // DELETE VIBHAG
            // =================================================

            await connection.query(

                `
                DELETE FROM vibhags

                WHERE id = ?
                `,

                [
                    id
                ]

            );


            // =================================================
            // COMMIT
            // =================================================

            await connection.commit();


        } catch (transactionError) {

            // =================================================
            // ROLLBACK
            // =================================================

            await connection.rollback();

            throw transactionError;

        }


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Vibhag and user deleted successfully",

        });


    } catch (error) {

        console.error(
            "DELETE VIBHAG ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete Vibhag",

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getVibhags,

    getVibhagById,

    createVibhag,

    updateVibhag,

    deleteVibhag,

};