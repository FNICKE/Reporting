// const db = require("../config/db");


// // =====================================================
// // GET ALL TALUKAS
// // GET /api/taluka
// // =====================================================

// const getTalukas = async (req, res) => {

//     try {

//         const [rows] = await db.query(`
//             SELECT
//                 t.id,
//                 t.name,
//                 t.district_id,
//                 d.name AS district_name,
//                 t.contact_number,
//                 t.user_id,
//                 t.email,
//                 t.password,
//                 t.address,
//                 t.status,
//                 t.created_at,
//                 t.updated_at

//             FROM talukas t

//             LEFT JOIN districts d
//                 ON d.id = t.district_id

//             ORDER BY t.id DESC
//         `);


//         return res.status(200).json({

//             success: true,

//             data: rows,

//             talukas: rows,

//             count: rows.length,

//             total: rows.length,

//         });


//     } catch (error) {

//         console.error(
//             "GET TALUKAS ERROR:",
//             error
//         );


//         return res.status(500).json({

//             success: false,

//             message:
//                 error.message ||
//                 "Failed to fetch Talukas",

//         });

//     }

// };


// // =====================================================
// // GET TALUKAS BY DISTRICT
// // GET /api/taluka/district/:districtId
// // =====================================================

// const getTalukasByDistrict = async (
//     req,
//     res
// ) => {

//     try {

//         const {
//             districtId
//         } = req.params;


//         const [rows] = await db.query(`
//             SELECT
//                 t.id,
//                 t.name,
//                 t.district_id,
//                 d.name AS district_name,
//                 t.contact_number,
//                 t.user_id,
//                 t.email,
//                 t.password,
//                 t.address,
//                 t.status,
//                 t.created_at,
//                 t.updated_at

//             FROM talukas t

//             LEFT JOIN districts d
//                 ON d.id = t.district_id

//             WHERE t.district_id = ?

//             ORDER BY t.id DESC
//         `, [

//             districtId

//         ]);


//         return res.status(200).json({

//             success: true,

//             data: rows,

//             talukas: rows,

//             count: rows.length,

//             total: rows.length,

//         });


//     } catch (error) {

//         console.error(
//             "GET TALUKAS BY DISTRICT ERROR:",
//             error
//         );


//         return res.status(500).json({

//             success: false,

//             message:
//                 error.message ||
//                 "Failed to fetch Talukas",

//         });

//     }

// };


// // =====================================================
// // GET SINGLE TALUKA
// // GET /api/taluka/:id
// // =====================================================

// const getTalukaById = async (
//     req,
//     res
// ) => {

//     try {

//         const {
//             id
//         } = req.params;


//         const [rows] = await db.query(`
//             SELECT
//                 t.id,
//                 t.name,
//                 t.district_id,
//                 d.name AS district_name,
//                 t.contact_number,
//                 t.user_id,
//                 t.email,
//                 t.password,
//                 t.address,
//                 t.status,
//                 t.created_at,
//                 t.updated_at

//             FROM talukas t

//             LEFT JOIN districts d
//                 ON d.id = t.district_id

//             WHERE t.id = ?

//             LIMIT 1
//         `, [

//             id

//         ]);


//         if (
//             rows.length === 0
//         ) {

//             return res.status(404).json({

//                 success: false,

//                 message:
//                     "Taluka not found",

//             });

//         }


//         return res.status(200).json({

//             success: true,

//             data: rows[0],

//             taluka: rows[0],

//         });


//     } catch (error) {

//         console.error(
//             "GET TALUKA BY ID ERROR:",
//             error
//         );


//         return res.status(500).json({

//             success: false,

//             message:
//                 error.message ||
//                 "Failed to fetch Taluka",

//         });

//     }

// };


// // =====================================================
// // CREATE TALUKA
// // POST /api/taluka
// // =====================================================

// const createTaluka = async (
//     req,
//     res
// ) => {

//     try {

//         const {

//             name,

//             district_id,

//             contact_number,

//             user_id,

//             email,

//             password,

//             address,

//         } = req.body;


//         // =================================================
//         // VALIDATION
//         // =================================================

//         if (
//             !name ||
//             !String(name).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Taluka name is required",

//             });

//         }


//         if (
//             !district_id
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "District is required",

//             });

//         }


//         if (
//             !contact_number ||
//             !String(contact_number).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Contact number is required",

//             });

//         }


//         if (
//             !user_id ||
//             !String(user_id).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "User ID is required",

//             });

//         }


//         if (
//             !email ||
//             !String(email).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Email is required",

//             });

//         }


//         if (
//             !password ||
//             !String(password).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Password is required",

//             });

//         }


//         if (
//             !address ||
//             !String(address).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Address is required",

//             });

//         }


//         // =================================================
//         // CHECK DISTRICT
//         // =================================================

//         const [
//             districtRows
//         ] = await db.query(`
//             SELECT
//                 id,
//                 name
//             FROM districts
//             WHERE id = ?
//             LIMIT 1
//         `, [

//             district_id

//         ]);


//         if (
//             districtRows.length === 0
//         ) {

//             return res.status(404).json({

//                 success: false,

//                 message:
//                     "Selected district not found",

//             });

//         }


//         // =================================================
//         // CHECK DUPLICATE TALUKA
//         // =================================================

//         const [
//             existingRows
//         ] = await db.query(`
//             SELECT
//                 id
//             FROM talukas
//             WHERE name = ?
//             AND district_id = ?
//             LIMIT 1
//         `, [

//             String(name).trim(),

//             district_id

//         ]);


//         if (
//             existingRows.length > 0
//         ) {

//             return res.status(409).json({

//                 success: false,

//                 message:
//                     "Taluka already exists in this district",

//             });

//         }


//         // =================================================
//         // INSERT TALUKA
//         // =================================================

//         const [
//             result
//         ] = await db.query(`
//             INSERT INTO talukas
//             (
//                 name,
//                 district_id,
//                 contact_number,
//                 user_id,
//                 email,
//                 password,
//                 address,
//                 status
//             )

//             VALUES
//             (
//                 ?,
//                 ?,
//                 ?,
//                 ?,
//                 ?,
//                 ?,
//                 ?,
//                 'active'
//             )
//         `, [

//             String(name).trim(),

//             district_id,

//             String(
//                 contact_number
//             ).trim(),

//             String(
//                 user_id
//             ).trim(),

//             String(
//                 email
//             ).trim(),

//             String(
//                 password
//             ).trim(),

//             String(
//                 address
//             ).trim(),

//         ]);


//         // =================================================
//         // GET CREATED TALUKA
//         // =================================================

//         const [
//             rows
//         ] = await db.query(`
//             SELECT
//                 t.id,
//                 t.name,
//                 t.district_id,
//                 d.name AS district_name,
//                 t.contact_number,
//                 t.user_id,
//                 t.email,
//                 t.password,
//                 t.address,
//                 t.status,
//                 t.created_at,
//                 t.updated_at

//             FROM talukas t

//             LEFT JOIN districts d
//                 ON d.id = t.district_id

//             WHERE t.id = ?

//             LIMIT 1
//         `, [

//             result.insertId

//         ]);


//         return res.status(201).json({

//             success: true,

//             message:
//                 "Taluka created successfully",

//             data:
//                 rows[0],

//             taluka:
//                 rows[0],

//         });


//     } catch (error) {

//         console.error(
//             "CREATE TALUKA ERROR:",
//             error
//         );


//         if (
//             error.code ===
//             "ER_DUP_ENTRY"
//         ) {

//             return res.status(409).json({

//                 success: false,

//                 message:
//                     "Taluka already exists",

//             });

//         }


//         return res.status(500).json({

//             success: false,

//             message:
//                 error.message ||
//                 "Failed to create Taluka",

//         });

//     }

// };


// // =====================================================
// // UPDATE TALUKA
// // PUT /api/taluka/:id
// // =====================================================

// const updateTaluka = async (
//     req,
//     res
// ) => {

//     try {

//         const {
//             id
//         } = req.params;


//         const {

//             name,

//             district_id,

//             contact_number,

//             user_id,

//             email,

//             password,

//             address,

//             status,

//         } = req.body;


//         // =================================================
//         // VALIDATION
//         // =================================================

//         if (
//             !name ||
//             !String(name).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Taluka name is required",

//             });

//         }


//         if (
//             !district_id
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "District is required",

//             });

//         }


//         if (
//             !contact_number ||
//             !String(contact_number).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Contact number is required",

//             });

//         }


//         if (
//             !user_id ||
//             !String(user_id).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "User ID is required",

//             });

//         }


//         if (
//             !email ||
//             !String(email).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Email is required",

//             });

//         }


//         if (
//             !address ||
//             !String(address).trim()
//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message:
//                     "Address is required",

//             });

//         }


//         // =================================================
//         // CHECK TALUKA
//         // =================================================

//         const [
//             existingRows
//         ] = await db.query(`
//             SELECT
//                 id
//             FROM talukas
//             WHERE id = ?
//             LIMIT 1
//         `, [

//             id

//         ]);


//         if (
//             existingRows.length === 0
//         ) {

//             return res.status(404).json({

//                 success: false,

//                 message:
//                     "Taluka not found",

//             });

//         }


//         // =================================================
//         // CHECK DISTRICT
//         // =================================================

//         const [
//             districtRows
//         ] = await db.query(`
//             SELECT
//                 id
//             FROM districts
//             WHERE id = ?
//             LIMIT 1
//         `, [

//             district_id

//         ]);


//         if (
//             districtRows.length === 0
//         ) {

//             return res.status(404).json({

//                 success: false,

//                 message:
//                     "Selected district not found",

//             });

//         }


//         // =================================================
//         // CHECK DUPLICATE
//         // =================================================

//         const [
//             duplicateRows
//         ] = await db.query(`
//             SELECT
//                 id
//             FROM talukas
//             WHERE name = ?
//             AND district_id = ?
//             AND id != ?
//             LIMIT 1
//         `, [

//             String(name).trim(),

//             district_id,

//             id,

//         ]);


//         if (
//             duplicateRows.length > 0
//         ) {

//             return res.status(409).json({

//                 success: false,

//                 message:
//                     "Taluka already exists in this district",

//             });

//         }


//         // =================================================
//         // UPDATE WITH PASSWORD
//         // =================================================

//         if (
//             password &&
//             String(password).trim()
//         ) {

//             await db.query(`
//                 UPDATE talukas

//                 SET
//                     name = ?,
//                     district_id = ?,
//                     contact_number = ?,
//                     user_id = ?,
//                     email = ?,
//                     password = ?,
//                     address = ?,
//                     status = COALESCE(?, status)

//                 WHERE id = ?
//             `, [

//                 String(name).trim(),

//                 district_id,

//                 String(
//                     contact_number
//                 ).trim(),

//                 String(
//                     user_id
//                 ).trim(),

//                 String(
//                     email
//                 ).trim(),

//                 String(
//                     password
//                 ).trim(),

//                 String(
//                     address
//                 ).trim(),

//                 status || null,

//                 id,

//             ]);

//         }


//         // =================================================
//         // UPDATE WITHOUT PASSWORD
//         // =================================================

//         else {

//             await db.query(`
//                 UPDATE talukas

//                 SET
//                     name = ?,
//                     district_id = ?,
//                     contact_number = ?,
//                     user_id = ?,
//                     email = ?,
//                     address = ?,
//                     status = COALESCE(?, status)

//                 WHERE id = ?
//             `, [

//                 String(name).trim(),

//                 district_id,

//                 String(
//                     contact_number
//                 ).trim(),

//                 String(
//                     user_id
//                 ).trim(),

//                 String(
//                     email
//                 ).trim(),

//                 String(
//                     address
//                 ).trim(),

//                 status || null,

//                 id,

//             ]);

//         }


//         // =================================================
//         // GET UPDATED TALUKA
//         // =================================================

//         const [
//             rows
//         ] = await db.query(`
//             SELECT
//                 t.id,
//                 t.name,
//                 t.district_id,
//                 d.name AS district_name,
//                 t.contact_number,
//                 t.user_id,
//                 t.email,
//                 t.password,
//                 t.address,
//                 t.status,
//                 t.created_at,
//                 t.updated_at

//             FROM talukas t

//             LEFT JOIN districts d
//                 ON d.id = t.district_id

//             WHERE t.id = ?

//             LIMIT 1
//         `, [

//             id

//         ]);


//         return res.status(200).json({

//             success: true,

//             message:
//                 "Taluka updated successfully",

//             data:
//                 rows[0],

//             taluka:
//                 rows[0],

//         });


//     } catch (error) {

//         console.error(
//             "UPDATE TALUKA ERROR:",
//             error
//         );


//         if (
//             error.code ===
//             "ER_DUP_ENTRY"
//         ) {

//             return res.status(409).json({

//                 success: false,

//                 message:
//                     "Taluka already exists",

//             });

//         }


//         return res.status(500).json({

//             success: false,

//             message:
//                 error.message ||
//                 "Failed to update Taluka",

//         });

//     }

// };


// // =====================================================
// // DELETE TALUKA
// // DELETE /api/taluka/:id
// // =====================================================

// const deleteTaluka = async (
//     req,
//     res
// ) => {

//     try {

//         const {
//             id
//         } = req.params;


//         // =================================================
//         // CHECK TALUKA
//         // =================================================

//         const [
//             rows
//         ] = await db.query(`
//             SELECT
//                 id
//             FROM talukas
//             WHERE id = ?
//             LIMIT 1
//         `, [

//             id

//         ]);


//         if (
//             rows.length === 0
//         ) {

//             return res.status(404).json({

//                 success: false,

//                 message:
//                     "Taluka not found",

//             });

//         }


//         // =================================================
//         // DELETE
//         // =================================================

//         await db.query(`
//             DELETE FROM talukas
//             WHERE id = ?
//         `, [

//             id

//         ]);


//         return res.status(200).json({

//             success: true,

//             message:
//                 "Taluka deleted successfully",

//         });


//     } catch (error) {

//         console.error(
//             "DELETE TALUKA ERROR:",
//             error
//         );


//         // =================================================
//         // FOREIGN KEY ERROR
//         // =================================================

//         if (

//             error.code ===
//             "ER_ROW_IS_REFERENCED_2"

//             ||

//             error.code ===
//             "ER_ROW_IS_REFERENCED"

//         ) {

//             return res.status(409).json({

//                 success: false,

//                 message:
//                     "Taluka cannot be deleted because it is being used",

//             });

//         }


//         return res.status(500).json({

//             success: false,

//             message:
//                 error.message ||
//                 "Failed to delete Taluka",

//         });

//     }

// };


// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {

//     getTalukas,

//     getTalukasByDistrict,

//     getTalukaById,

//     createTaluka,

//     updateTaluka,

//     deleteTaluka,

// };
const db = require("../config/db");


// =====================================================
// GET ALL TALUKAS
// GET /api/taluka
// =====================================================

const getTalukas = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.name,
                t.district_id,
                d.name AS district_name,
                t.status,
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

        console.error(
            "GET TALUKAS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch Talukas",
        });
    }
};


// =====================================================
// GET TALUKAS BY DISTRICT
// GET /api/taluka/district/:districtId
// =====================================================

const getTalukasByDistrict = async (
    req,
    res
) => {

    try {

        const { districtId } =
            req.params;

        if (!districtId) {

            return res.status(400).json({
                success: false,
                message:
                    "District ID is required",
            });
        }

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.name,
                t.district_id,
                d.name AS district_name,
                t.status,
                t.created_at,
                t.updated_at

            FROM talukas t

            LEFT JOIN districts d
                ON d.id = t.district_id

            WHERE t.district_id = ?

            ORDER BY t.id DESC
        `, [
            districtId
        ]);

        return res.status(200).json({
            success: true,
            data: rows,
            talukas: rows,
            count: rows.length,
            total: rows.length,
        });

    } catch (error) {

        console.error(
            "GET TALUKAS BY DISTRICT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch Talukas",
        });
    }
};


// =====================================================
// GET SINGLE TALUKA
// GET /api/taluka/:id
// =====================================================

const getTalukaById = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;

        const [rows] = await db.query(`
            SELECT
                t.id,
                t.name,
                t.district_id,
                d.name AS district_name,
                t.status,
                t.created_at,
                t.updated_at

            FROM talukas t

            LEFT JOIN districts d
                ON d.id = t.district_id

            WHERE t.id = ?

            LIMIT 1
        `, [
            id
        ]);

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Taluka not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0],
            taluka: rows[0],
        });

    } catch (error) {

        console.error(
            "GET TALUKA BY ID ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch Taluka",
        });
    }
};


// =====================================================
// CREATE TALUKA
// POST /api/taluka
// =====================================================

const createTaluka = async (
    req,
    res
) => {

    try {

        const {
            name,
            district_id,
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !name ||
            !String(name).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Taluka name is required",
            });
        }


        if (
            !district_id
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "District is required",
            });
        }


        // =================================================
        // CHECK DISTRICT
        // =================================================

        const [
            districtRows
        ] = await db.query(`
            SELECT
                id,
                name

            FROM districts

            WHERE id = ?

            LIMIT 1
        `, [
            district_id
        ]);


        if (
            districtRows.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Selected district not found",
            });
        }


        // =================================================
        // CHECK DUPLICATE TALUKA
        // =================================================

        const [
            existingRows
        ] = await db.query(`
            SELECT
                id

            FROM talukas

            WHERE name = ?

            AND district_id = ?

            LIMIT 1
        `, [
            String(name).trim(),
            district_id
        ]);


        if (
            existingRows.length > 0
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Taluka already exists in this district",
            });
        }


        // =================================================
        // INSERT
        // =================================================

        const [
            result
        ] = await db.query(`
            INSERT INTO talukas
            (
                name,
                district_id,
                status
            )

            VALUES
            (
                ?,
                ?,
                'active'
            )
        `, [

            String(name).trim(),

            district_id,

        ]);


        // =================================================
        // GET CREATED TALUKA
        // =================================================

        const [
            rows
        ] = await db.query(`
            SELECT
                t.id,
                t.name,
                t.district_id,
                d.name AS district_name,
                t.status,
                t.created_at,
                t.updated_at

            FROM talukas t

            LEFT JOIN districts d
                ON d.id = t.district_id

            WHERE t.id = ?

            LIMIT 1
        `, [
            result.insertId
        ]);


        return res.status(201).json({

            success: true,

            message:
                "Taluka created successfully",

            data:
                rows[0],

            taluka:
                rows[0],
        });


    } catch (error) {

        console.error(
            "CREATE TALUKA ERROR:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Taluka already exists",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create Taluka",
        });
    }
};


// =====================================================
// UPDATE TALUKA
// PUT /api/taluka/:id
// =====================================================

const updateTaluka = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;

        const {
            name,
            district_id,
            status,
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !name ||
            !String(name).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Taluka name is required",
            });
        }


        if (
            !district_id
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "District is required",
            });
        }


        // =================================================
        // CHECK TALUKA
        // =================================================

        const [
            existingRows
        ] = await db.query(`
            SELECT
                id

            FROM talukas

            WHERE id = ?

            LIMIT 1
        `, [
            id
        ]);


        if (
            existingRows.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Taluka not found",
            });
        }


        // =================================================
        // CHECK DISTRICT
        // =================================================

        const [
            districtRows
        ] = await db.query(`
            SELECT
                id

            FROM districts

            WHERE id = ?

            LIMIT 1
        `, [
            district_id
        ]);


        if (
            districtRows.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Selected district not found",
            });
        }


        // =================================================
        // CHECK DUPLICATE
        // =================================================

        const [
            duplicateRows
        ] = await db.query(`
            SELECT
                id

            FROM talukas

            WHERE name = ?

            AND district_id = ?

            AND id != ?

            LIMIT 1
        `, [
            String(name).trim(),
            district_id,
            id,
        ]);


        if (
            duplicateRows.length > 0
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Taluka already exists in this district",
            });
        }


        // =================================================
        // UPDATE
        // =================================================

        await db.query(`
            UPDATE talukas

            SET
                name = ?,
                district_id = ?,
                status = COALESCE(?, status)

            WHERE id = ?
        `, [

            String(name).trim(),

            district_id,

            status || null,

            id,
        ]);


        // =================================================
        // GET UPDATED TALUKA
        // =================================================

        const [
            rows
        ] = await db.query(`
            SELECT
                t.id,
                t.name,
                t.district_id,
                d.name AS district_name,
                t.status,
                t.created_at,
                t.updated_at

            FROM talukas t

            LEFT JOIN districts d
                ON d.id = t.district_id

            WHERE t.id = ?

            LIMIT 1
        `, [
            id
        ]);


        return res.status(200).json({

            success: true,

            message:
                "Taluka updated successfully",

            data:
                rows[0],

            taluka:
                rows[0],
        });


    } catch (error) {

        console.error(
            "UPDATE TALUKA ERROR:",
            error
        );


        if (
            error.code ===
            "ER_DUP_ENTRY"
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Taluka already exists",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update Taluka",
        });
    }
};


// =====================================================
// DELETE TALUKA
// DELETE /api/taluka/:id
// =====================================================

const deleteTaluka = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        // =================================================
        // CHECK TALUKA
        // =================================================

        const [
            rows
        ] = await db.query(`
            SELECT
                id

            FROM talukas

            WHERE id = ?

            LIMIT 1
        `, [
            id
        ]);


        if (
            rows.length === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "Taluka not found",
            });
        }


        // =================================================
        // DELETE
        // =================================================

        await db.query(`
            DELETE FROM talukas
            WHERE id = ?
        `, [
            id
        ]);


        return res.status(200).json({

            success: true,

            message:
                "Taluka deleted successfully",
        });


    } catch (error) {

        console.error(
            "DELETE TALUKA ERROR:",
            error
        );


        if (
            error.code ===
            "ER_ROW_IS_REFERENCED_2" ||
            error.code ===
            "ER_ROW_IS_REFERENCED"
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "Taluka cannot be deleted because it is being used",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete Taluka",
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getTalukas,

    getTalukasByDistrict,

    getTalukaById,

    createTaluka,

    updateTaluka,

    deleteTaluka,

};