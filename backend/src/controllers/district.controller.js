const db = require("../config/db");

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
        console.error(
            "GET DISTRICT ERROR:",
            error
        );

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


        // ========================================
        // VALIDATION
        // ========================================

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "District name is required",
            });
        }


        if (!report_date) {
            return res.status(400).json({
                success: false,
                message: "Report date is required",
            });
        }


        if (
            !contact_number ||
            !String(contact_number).trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Contact number is required",
            });
        }


        if (
            !/^\d{10}$/.test(
                String(contact_number).trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Contact number must contain exactly 10 digits",
            });
        }


        // ========================================
        // REQUIRED DISTRICT DETAILS
        // ========================================

        const requiredFields = [
            ["designation", designation],
            ["district_name", district_name],
            ["district_code", district_code],
            ["taluka", taluka],
            ["joining_date", joining_date],
            ["account_number", account_number],
            ["ifsc_code", ifsc_code],
            ["bank_name", bank_name],
        ];


        const missingField =
            requiredFields.find(
                ([, value]) =>
                    !value ||
                    !String(value).trim()
            );


        if (missingField) {
            return res.status(400).json({
                success: false,
                message:
                    `${missingField[0]} is required`,
            });
        }


        // ========================================
        // STATUS
        // ========================================

        const normalizedStatus =
            String(
                status || "active"
            ).toLowerCase();


        if (
            !["active", "inactive"].includes(
                normalizedStatus
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be active or inactive",
            });
        }


        // ========================================
        // USER ID
        // ========================================

        if (
            !user_id ||
            !String(user_id).trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "User ID is required",
            });
        }


        // ========================================
        // EMAIL
        // ========================================

        if (
            !email ||
            !String(email).trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email is required",
            });
        }


        // ========================================
        // PASSWORD
        // ========================================

        if (
            !password ||
            !String(password).trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Password is required",
            });
        }


        // ========================================
        // CHECK DUPLICATE NAME
        // ========================================

        const [nameExists] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE name = ?
                `,
                [
                    String(name).trim(),
                ]
            );


        if (nameExists.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "District name already exists",
            });
        }


        // ========================================
        // CHECK DUPLICATE USER ID
        // ========================================

        const [userExists] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE user_id = ?
                `,
                [
                    String(user_id).trim(),
                ]
            );


        if (userExists.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "User ID already exists",
            });
        }


        // ========================================
        // CHECK DUPLICATE EMAIL
        // ========================================

        const [emailExists] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE email = ?
                `,
                [
                    String(email).trim(),
                ]
            );


        if (emailExists.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "Email already exists",
            });
        }


        // ========================================
        // INSERT DISTRICT
        // ========================================

        const [result] =
            await db.query(
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

                    report_date,

                    normalizedStatus,

                    String(
                        contact_number
                    ).trim(),

                    String(
                        designation
                    ).trim(),

                    String(
                        district_name
                    ).trim(),

                    String(
                        district_code
                    ).trim(),

                    String(
                        taluka
                    ).trim(),

                    joining_date,

                    String(
                        account_number
                    ).trim(),

                    String(
                        ifsc_code
                    )
                        .trim()
                        .toUpperCase(),

                    String(
                        bank_name
                    ).trim(),

                    String(
                        user_id
                    ).trim(),

                    String(
                        email
                    ).trim(),

                    String(
                        password
                    ).trim(),
                ]
            );


        return res.status(201).json({
            success: true,
            message:
                "District added successfully",
            id: result.insertId,
        });

    } catch (error) {

        console.error(
            "CREATE DISTRICT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create district",
        });
    }
};
// ========================================
// UPDATE DISTRICT
// PUT /api/district/:id
// ========================================

const updateDistrict = async (
    req,
    res
) => {

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


        // ========================================
        // CHECK DISTRICT
        // ========================================

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE id = ?
                `,
                [id]
            );


        if (existing.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "District not found",
            });

        }


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !name ||
            !String(name).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "District name is required",
            });

        }


        if (!report_date) {

            return res.status(400).json({
                success: false,
                message:
                    "Report date is required",
            });

        }


        if (
            !contact_number ||
            !String(contact_number).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Contact number is required",
            });

        }


        if (
            !/^\d{10}$/.test(
                String(contact_number).trim()
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Contact number must contain exactly 10 digits",
            });

        }


        // ========================================
        // REQUIRED DISTRICT DETAILS
        // ========================================

        const requiredFields = [
            ["designation", designation],
            ["district_name", district_name],
            ["district_code", district_code],
            ["taluka", taluka],
            ["joining_date", joining_date],
            ["account_number", account_number],
            ["ifsc_code", ifsc_code],
            ["bank_name", bank_name],
        ];


        const missingField =
            requiredFields.find(
                ([, value]) =>
                    !value ||
                    !String(value).trim()
            );


        if (missingField) {

            return res.status(400).json({
                success: false,
                message:
                    `${missingField[0]} is required`,
            });

        }


        // ========================================
        // STATUS
        // ========================================

        const normalizedStatus =
            String(
                status || "active"
            ).toLowerCase();


        if (
            !["active", "inactive"].includes(
                normalizedStatus
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Status must be active or inactive",
            });

        }


        // ========================================
        // USER ID
        // ========================================

        if (
            !user_id ||
            !String(user_id).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "User ID is required",
            });

        }


        // ========================================
        // EMAIL
        // ========================================

        if (
            !email ||
            !String(email).trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Email is required",
            });

        }


        // ========================================
        // CHECK DUPLICATE NAME
        // ========================================

        const [duplicateName] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE name = ?
                AND id != ?
                `,
                [
                    String(name).trim(),
                    id,
                ]
            );


        if (duplicateName.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "District name already exists",
            });

        }


        // ========================================
        // CHECK DUPLICATE USER ID
        // ========================================

        const [duplicateUser] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE user_id = ?
                AND id != ?
                `,
                [
                    String(user_id).trim(),
                    id,
                ]
            );


        if (duplicateUser.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "User ID already exists",
            });

        }


        // ========================================
        // CHECK DUPLICATE EMAIL
        // ========================================

        const [duplicateEmail] =
            await db.query(
                `
                SELECT id
                FROM districts
                WHERE email = ?
                AND id != ?
                `,
                [
                    String(email).trim(),
                    id,
                ]
            );


        if (duplicateEmail.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "Email already exists",
            });

        }


        // ========================================
        // UPDATE WITH PASSWORD
        // ========================================

        if (
            password &&
            String(password).trim()
        ) {

            await db.query(
                `
                UPDATE districts
                SET
                    name = ?,
                    report_date = ?,
                    status = ?,
                    contact_number = ?,
                    designation = ?,
                    district_name = ?,
                    district_code = ?,
                    taluka = ?,
                    joining_date = ?,
                    account_number = ?,
                    ifsc_code = ?,
                    bank_name = ?,
                    user_id = ?,
                    email = ?,
                    password = ?
                WHERE id = ?
                `,
                [
                    String(
                        name
                    ).trim(),

                    report_date,

                    normalizedStatus,

                    String(
                        contact_number
                    ).trim(),

                    String(
                        designation
                    ).trim(),

                    String(
                        district_name
                    ).trim(),

                    String(
                        district_code
                    ).trim(),

                    String(
                        taluka
                    ).trim(),

                    joining_date,

                    String(
                        account_number
                    ).trim(),

                    String(
                        ifsc_code
                    )
                        .trim()
                        .toUpperCase(),

                    String(
                        bank_name
                    ).trim(),

                    String(
                        user_id
                    ).trim(),

                    String(
                        email
                    ).trim(),

                    String(
                        password
                    ).trim(),

                    id,
                ]
            );

        } else {

            // ========================================
            // UPDATE WITHOUT PASSWORD
            // ========================================

            await db.query(
                `
                UPDATE districts
                SET
                    name = ?,
                    report_date = ?,
                    status = ?,
                    contact_number = ?,
                    designation = ?,
                    district_name = ?,
                    district_code = ?,
                    taluka = ?,
                    joining_date = ?,
                    account_number = ?,
                    ifsc_code = ?,
                    bank_name = ?,
                    user_id = ?,
                    email = ?
                WHERE id = ?
                `,
                [
                    String(
                        name
                    ).trim(),

                    report_date,

                    normalizedStatus,

                    String(
                        contact_number
                    ).trim(),

                    String(
                        designation
                    ).trim(),

                    String(
                        district_name
                    ).trim(),

                    String(
                        district_code
                    ).trim(),

                    String(
                        taluka
                    ).trim(),

                    joining_date,

                    String(
                        account_number
                    ).trim(),

                    String(
                        ifsc_code
                    )
                        .trim()
                        .toUpperCase(),

                    String(
                        bank_name
                    ).trim(),

                    String(
                        user_id
                    ).trim(),

                    String(
                        email
                    ).trim(),

                    id,
                ]
            );
        }


        return res.status(200).json({
            success: true,
            message:
                "District updated successfully",
        });

    } catch (error) {

        console.error(
            "UPDATE DISTRICT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update district",
        });
    }
};
// ========================================
// DELETE DISTRICT
// DELETE /api/district/:id
// ========================================

const deleteDistrict = async (
    req,
    res
) => {

    try {

        const { id } = req.params;


        const [result] =
            await db.query(
                `
                DELETE FROM districts
                WHERE id = ?
                `,
                [id]
            );


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({
                success: false,
                message:
                    "District not found",
            });

        }


        return res.status(200).json({
            success: true,
            message:
                "District deleted successfully",
        });

    } catch (error) {

        console.error(
            "DELETE DISTRICT ERROR:",
            error
        );


        // ========================================
        // FOREIGN KEY ERROR
        // ========================================

        if (
            error.code ===
                "ER_ROW_IS_REFERENCED_2" ||
            error.code ===
                "ER_ROW_IS_REFERENCED"
        ) {

            return res.status(409).json({
                success: false,
                message:
                    "District cannot be deleted because it is being used",
            });

        }


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to delete district",
        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    getDistricts,
    getDistrictById,
    createDistrict,
    updateDistrict,
    deleteDistrict,
};