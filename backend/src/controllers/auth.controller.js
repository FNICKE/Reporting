const db = require("../config/db");


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

    try {

        const {
            user_id,
            password
        } = req.body;


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            !user_id ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "User ID and password are required"

            });

        }


        const cleanUserId =
            String(user_id).trim();

        const cleanPassword =
            String(password).trim();


        // =================================================
        // USERS TABLE
        // =================================================

        const [users] =
            await db.query(

                `
                SELECT
                    id,
                    user_id,
                    password,
                    name,
                    role,
                    status
                FROM users
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    cleanUserId
                ]

            );


        if (
            users.length > 0
        ) {

            const user =
                users[0];


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            if (
                String(
                    user.status || ""
                ).toLowerCase() !== "active"
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Account is inactive"

                });

            }


            // ---------------------------------------------
            // PASSWORD
            // ---------------------------------------------

            if (
                String(user.password) !==
                cleanPassword
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid User ID or Password"

                });

            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Login successful",

                user: {

                    id:
                        user.id,

                    user_id:
                        user.user_id,

                    name:
                        user.name,

                    role:
                        user.role,

                    status:
                        user.status

                }

            });

        }


        // =================================================
        // DISTRICT
        // =================================================

        const [districts] =
            await db.query(

                `
                SELECT
                    id,
                    name,
                    user_id,
                    password,
                    email,
                    contact_number,
                    status
                FROM districts
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    cleanUserId
                ]

            );


        if (
            districts.length > 0
        ) {

            const district =
                districts[0];


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            if (
                String(
                    district.status || ""
                ).toLowerCase() !== "active"
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "District account is inactive"

                });

            }


            // ---------------------------------------------
            // PASSWORD
            // ---------------------------------------------

            if (
                String(
                    district.password
                ) !== cleanPassword
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid User ID or Password"

                });

            }


            // ---------------------------------------------
            // CHECK USERS TABLE
            // ---------------------------------------------

            const [existingDistrictUser] =
                await db.query(

                    `
                    SELECT id
                    FROM users
                    WHERE user_id = ?
                    LIMIT 1
                    `,

                    [
                        district.user_id
                    ]

                );


            // ---------------------------------------------
            // CREATE USER
            // ---------------------------------------------

            if (
                existingDistrictUser.length === 0
            ) {

                await db.query(

                    `
                    INSERT INTO users
                    (
                        user_id,
                        password,
                        name,
                        role,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,

                    [

                        district.user_id,

                        district.password,

                        district.name,

                        "district",

                        district.status

                    ]

                );

            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "District login successful",

                user: {

                    id:
                        district.id,

                    user_id:
                        district.user_id,

                    name:
                        district.name,

                    role:
                        "district",

                    status:
                        district.status,

                    district_id:
                        district.id,

                    district_name:
                        district.name,

                    email:
                        district.email,

                    contact_number:
                        district.contact_number

                }

            });

        }


        // =================================================
        // TALUKA
        // =================================================

        const [talukas] =
            await db.query(

                `
                SELECT
                    id,
                    name,
                    district_id,
                    contact_number,
                    user_id,
                    email,
                    password,
                    address,
                    status
                FROM talukas
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    cleanUserId
                ]

            );


        if (
            talukas.length > 0
        ) {

            const taluka =
                talukas[0];


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            if (
                String(
                    taluka.status || ""
                ).toLowerCase() !== "active"
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Taluka account is inactive"

                });

            }


            // ---------------------------------------------
            // PASSWORD
            // ---------------------------------------------

            if (
                String(
                    taluka.password
                ) !== cleanPassword
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid User ID or Password"

                });

            }


            // ---------------------------------------------
            // CHECK USERS TABLE
            // ---------------------------------------------

            const [existingTalukaUser] =
                await db.query(

                    `
                    SELECT id
                    FROM users
                    WHERE user_id = ?
                    LIMIT 1
                    `,

                    [
                        taluka.user_id
                    ]

                );


            // ---------------------------------------------
            // CREATE USER
            // ---------------------------------------------

            if (
                existingTalukaUser.length === 0
            ) {

                await db.query(

                    `
                    INSERT INTO users
                    (
                        user_id,
                        password,
                        name,
                        role,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,

                    [

                        taluka.user_id,

                        taluka.password,

                        taluka.name,

                        "taluka",

                        taluka.status

                    ]

                );

            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Taluka login successful",

                user: {

                    id:
                        taluka.id,

                    user_id:
                        taluka.user_id,

                    name:
                        taluka.name,

                    role:
                        "taluka",

                    status:
                        taluka.status,

                    district_id:
                        taluka.district_id,

                    taluka_id:
                        taluka.id,

                    taluka_name:
                        taluka.name,

                    email:
                        taluka.email,

                    contact_number:
                        taluka.contact_number

                }

            });

        }


        // =================================================
        // VIBHAG
        // =================================================

        const [vibhags] =
            await db.query(

                `
                SELECT
                    id,
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
                FROM vibhags
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    cleanUserId
                ]

            );


        if (
            vibhags.length > 0
        ) {

            const vibhag =
                vibhags[0];


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            if (
                String(
                    vibhag.status || ""
                ).toLowerCase() !== "active"
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Vibhag account is inactive"

                });

            }


            // ---------------------------------------------
            // PASSWORD
            // ---------------------------------------------

            if (
                String(
                    vibhag.password
                ) !== cleanPassword
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid User ID or Password"

                });

            }


            // ---------------------------------------------
            // CHECK USERS TABLE
            // ---------------------------------------------

            const [existingVibhagUser] =
                await db.query(

                    `
                    SELECT id
                    FROM users
                    WHERE user_id = ?
                    LIMIT 1
                    `,

                    [
                        vibhag.user_id
                    ]

                );


            // ---------------------------------------------
            // CREATE USER
            // ---------------------------------------------

            if (
                existingVibhagUser.length === 0
            ) {

                await db.query(

                    `
                    INSERT INTO users
                    (
                        user_id,
                        password,
                        name,
                        role,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,

                    [

                        vibhag.user_id,

                        vibhag.password,

                        vibhag.head,

                        "vibhag",

                        vibhag.status

                    ]

                );

            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Vibhag login successful",

                user: {

                    id:
                        vibhag.id,

                    user_id:
                        vibhag.user_id,

                    name:
                        vibhag.head,

                    role:
                        "vibhag",

                    status:
                        vibhag.status,

                    district_id:
                        vibhag.district_id,

                    taluka_id:
                        vibhag.taluka_id,

                    vibhag_id:
                        vibhag.id,

                    vibhag_name:
                        vibhag.vibhag,

                    email:
                        vibhag.email,

                    contact_number:
                        vibhag.contact_number

                }

            });

        }


        // =================================================
        // TRAINER
        // =================================================

        const [trainers] =
            await db.query(

                `
                SELECT *
                FROM trainers
                WHERE user_id = ?
                LIMIT 1
                `,

                [
                    cleanUserId
                ]

            );


        if (
            trainers.length > 0
        ) {

            const trainer =
                trainers[0];


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            if (
                String(
                    trainer.status || ""
                ).toLowerCase() !== "active"
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Trainer account is inactive"

                });

            }


            // ---------------------------------------------
            // PASSWORD
            // ---------------------------------------------

            if (
                String(
                    trainer.password || ""
                ) !== cleanPassword
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid User ID or Password"

                });

            }


            // ---------------------------------------------
            // TRAINER NAME
            // ---------------------------------------------

            const trainerName =
                trainer.name ||
                trainer.head ||
                trainer.trainer_name ||
                "Trainer";


            // ---------------------------------------------
            // CHECK USERS TABLE
            // ---------------------------------------------

            const [existingTrainerUser] =
                await db.query(

                    `
                    SELECT id
                    FROM users
                    WHERE user_id = ?
                    LIMIT 1
                    `,

                    [
                        trainer.user_id
                    ]

                );


            // ---------------------------------------------
            // CREATE USER
            // ---------------------------------------------

            if (
                existingTrainerUser.length === 0
            ) {

                await db.query(

                    `
                    INSERT INTO users
                    (
                        user_id,
                        password,
                        name,
                        role,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,

                    [

                        trainer.user_id,

                        trainer.password,

                        trainerName,

                        "trainer",

                        trainer.status

                    ]

                );

            }


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            return res.status(200).json({

                success: true,

                message:
                    "Trainer login successful",

                user: {

                    id:
                        trainer.id,

                    user_id:
                        trainer.user_id,

                    name:
                        trainerName,

                    role:
                        "trainer",

                    status:
                        trainer.status,

                    trainer_id:
                        trainer.id,

                    district_id:
                        trainer.district_id ||
                        null,

                    taluka_id:
                        trainer.taluka_id ||
                        null,

                    email:
                        trainer.email ||
                        "",

                    contact_number:
                        trainer.contact_number ||
                        "",

                    address:
                        trainer.address ||
                        ""

                }

            });

        }


        // =================================================
        // INVALID LOGIN
        // =================================================

        return res.status(401).json({

            success: false,

            message:
                "Invalid User ID or Password"

        });


    } catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "LOGIN ERROR:",
            error
        );

        console.error(
            "================================="
        );


        return res.status(500).json({

            success: false,

            message:
                "Login failed",

            error:
                error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    login
};