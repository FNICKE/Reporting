const db = require("../config/db");

/*
=====================================================
HELPER
=====================================================

Gets the District user ID.

Priority:
1. Authenticated user (if auth middleware is available)
2. req.query.user_id
3. req.body.user_id

IMPORTANT:
For proper security, your login/auth middleware should set
req.user.user_id. The frontend user_id is kept as a fallback
so the current frontend can work with this controller.
*/

const getCurrentUserId = (req) => {
    const authUser =
        req.user ||
        req.userData ||
        req.authUser ||
        null;

    const userId =
        authUser?.user_id ??
        authUser?.userId ??
        authUser?.username ??
        req.query?.user_id ??
        req.body?.user_id ??
        "";

    const value = String(userId).trim();

    return value || null;
};


// =====================================================
// CREATE DISTRICT REPORT
// POST /api/district-reports
// =====================================================

const createDistrictReport = async (req, res) => {

    try {

        console.log(
            "CREATE REPORT BODY:",
            req.body
        );

        console.log(
            "CREATE REPORT FILES:",
            req.files
        );

        const {

            user_id,

            name,
            designation,
            taluka,
            district,
            mobile_number,
            report_date,

            // CENTER HEAD DETAILS
            total_authorised_center_heads_300_to_500,
            total_active_center_heads,

            // MACHINE 1
            machine1_camp_name,
            machine1_test_amount,
            machine1_medicine_amount,
            machine1_total_amount,

            // MACHINE 2
            machine2_camp_name,
            machine2_test_amount,
            machine2_medicine_amount,
            machine2_total_amount,

            utr_number,
            additional_remarks

        } = req.body;


        // =================================================
        // CURRENT DISTRICT USER
        // =================================================

        const currentUserId =
            getCurrentUserId(req) ||
            (user_id
                ? String(user_id).trim()
                : null);


        if (!currentUserId) {

            return res.status(400).json({

                success: false,

                message:
                    "District user ID is required"

            });

        }


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
                    "Name is required"

            });

        }


        if (!report_date) {

            return res.status(400).json({

                success: false,

                message:
                    "Report date is required"

            });

        }


        // =================================================
        // PHOTO FILES
        // =================================================

        let machine1Photo = null;

        let machine2Photo = null;


        if (req.files) {

            if (
                req.files.machine1_camp_photo &&
                req.files.machine1_camp_photo.length > 0
            ) {

                machine1Photo =
                    req.files
                        .machine1_camp_photo[0]
                        .filename;

            }


            if (
                req.files.machine2_camp_photo &&
                req.files.machine2_camp_photo.length > 0
            ) {

                machine2Photo =
                    req.files
                        .machine2_camp_photo[0]
                        .filename;

            }

        }


        // =================================================
        // INSERT
        // =================================================

        const [result] =
            await db.query(

                `
                INSERT INTO district_reports
                (
                    user_id,

                    name,
                    designation,
                    taluka,
                    district,
                    mobile_number,
                    report_date,

                    total_authorised_center_heads_300_to_500,
                    total_active_center_heads,

                    machine1_camp_name,
                    machine1_test_amount,
                    machine1_medicine_amount,
                    machine1_total_amount,

                    machine2_camp_name,
                    machine2_test_amount,
                    machine2_medicine_amount,
                    machine2_total_amount,

                    utr_number,
                    additional_remarks,

                    machine1_camp_photo,
                    machine2_camp_photo,

                    status
                )

                VALUES
                (
                    ?,

                    ?, ?, ?, ?, ?, ?,

                    ?, ?,

                    ?, ?, ?, ?,

                    ?, ?, ?, ?,

                    ?, ?,

                    ?, ?,

                    ?
                )
                `,

                [

                    currentUserId,

                    name,

                    designation || null,

                    taluka || null,

                    district || null,

                    mobile_number || null,

                    report_date,


                    Number(
                        total_authorised_center_heads_300_to_500
                    ) || 0,


                    Number(
                        total_active_center_heads
                    ) || 0,


                    machine1_camp_name ||
                        null,

                    Number(
                        machine1_test_amount
                    ) || 0,

                    Number(
                        machine1_medicine_amount
                    ) || 0,

                    Number(
                        machine1_total_amount
                    ) || 0,


                    machine2_camp_name ||
                        null,

                    Number(
                        machine2_test_amount
                    ) || 0,

                    Number(
                        machine2_medicine_amount
                    ) || 0,

                    Number(
                        machine2_total_amount
                    ) || 0,


                    utr_number ||
                        null,

                    additional_remarks ||
                        null,


                    machine1Photo,

                    machine2Photo,


                    "active"

                ]

            );


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "District report created successfully",

            report: {

                id:
                    result.insertId,

                user_id:
                    currentUserId,

                name,

                designation,

                taluka,

                district,

                mobile_number,

                report_date,


                total_authorised_center_heads_300_to_500:
                    Number(
                        total_authorised_center_heads_300_to_500
                    ) || 0,


                total_active_center_heads:
                    Number(
                        total_active_center_heads
                    ) || 0,


                machine1_camp_name,

                machine1_test_amount:
                    Number(
                        machine1_test_amount
                    ) || 0,

                machine1_medicine_amount:
                    Number(
                        machine1_medicine_amount
                    ) || 0,

                machine1_total_amount:
                    Number(
                        machine1_total_amount
                    ) || 0,


                machine2_camp_name,

                machine2_test_amount:
                    Number(
                        machine2_test_amount
                    ) || 0,

                machine2_medicine_amount:
                    Number(
                        machine2_medicine_amount
                    ) || 0,

                machine2_total_amount:
                    Number(
                        machine2_total_amount
                    ) || 0,


                utr_number,

                additional_remarks,


                machine1_camp_photo:
                    machine1Photo,

                machine2_camp_photo:
                    machine2Photo,


                status:
                    "active"

            }

        });


    } catch (error) {

        console.error(
            "CREATE DISTRICT REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create district report",

            error:
                error.message

        });

    }

};
// =====================================================
// GET DISTRICT REPORTS - USER WISE
// GET /api/district-reports
// GET /api/district-reports?user_id=USER_ID
// =====================================================

const getDistrictReports = async (
    req,
    res
) => {

    try {

        const currentUserId =
            getCurrentUserId(req);


        let reports;


        /*
         * If a logged-in/current user is available,
         * return ONLY that user's reports.
         *
         * If no user_id is supplied, this keeps the
         * existing admin behaviour and returns all reports.
         */

        if (currentUserId) {

            [
                reports
            ] = await db.query(

                `
                SELECT *

                FROM district_reports

                WHERE user_id = ?

                ORDER BY id DESC
                `,

                [
                    currentUserId
                ]

            );

        } else {

            [
                reports
            ] = await db.query(

                `
                SELECT *

                FROM district_reports

                ORDER BY id DESC
                `

            );

        }


        return res.status(200).json({

            success: true,

            count:
                reports.length,

            total:
                reports.length,

            reports,

            data:
                reports

        });


    } catch (error) {

        console.error(
            "GET DISTRICT REPORTS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch district reports",

            error:
                error.message

        });

    }

};


// =====================================================
// GET SINGLE REPORT
// GET /api/district-reports/:id
// =====================================================

const getDistrictReportById = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const currentUserId =
            getCurrentUserId(req);


        let reports;


        /*
         * User-wise access:
         * If user_id is available, the report must
         * belong to that user.
         *
         * Without user_id, admin/legacy access remains.
         */

        if (currentUserId) {

            [
                reports
            ] = await db.query(

                `
                SELECT *

                FROM district_reports

                WHERE id = ?

                AND user_id = ?

                LIMIT 1
                `,

                [
                    id,
                    currentUserId
                ]

            );

        } else {

            [
                reports
            ] = await db.query(

                `
                SELECT *

                FROM district_reports

                WHERE id = ?

                LIMIT 1
                `,

                [
                    id
                ]

            );

        }


        if (
            reports.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "District report not found"

            });

        }


        return res.status(200).json({

            success: true,

            report:
                reports[0],

            data:
                reports[0]

        });


    } catch (error) {

        console.error(
            "GET SINGLE DISTRICT REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch district report",

            error:
                error.message

        });

    }

};
// =====================================================
// UPDATE DISTRICT REPORT
// PUT /api/district-reports/:id
// =====================================================

const updateDistrictReport = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {

            user_id,

            name,
            designation,
            taluka,
            district,
            mobile_number,
            report_date,

            // CENTER HEAD DETAILS
            total_authorised_center_heads_300_to_500,
            total_active_center_heads,

            // MACHINE 1
            machine1_camp_name,
            machine1_test_amount,
            machine1_medicine_amount,
            machine1_total_amount,

            // MACHINE 2
            machine2_camp_name,
            machine2_test_amount,
            machine2_medicine_amount,
            machine2_total_amount,

            utr_number,
            additional_remarks,

            status

        } = req.body;


        const currentUserId =
            getCurrentUserId(req) ||
            (user_id
                ? String(user_id).trim()
                : null);


        // =================================================
        // CHECK REPORT
        // =================================================

        let existing;


        if (currentUserId) {

            [
                existing
            ] = await db.query(

                `
                SELECT *

                FROM district_reports

                WHERE id = ?

                AND user_id = ?

                LIMIT 1
                `,

                [
                    id,
                    currentUserId
                ]

            );

        } else {

            [
                existing
            ] = await db.query(

                `
                SELECT *

                FROM district_reports

                WHERE id = ?

                LIMIT 1
                `,

                [
                    id
                ]

            );

        }


        if (
            existing.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "District report not found or does not belong to this user"

            });

        }


        // =================================================
        // OLD PHOTOS
        // =================================================

        let machine1Photo =
            existing[0]
                .machine1_camp_photo;


        let machine2Photo =
            existing[0]
                .machine2_camp_photo;


        // =================================================
        // NEW PHOTOS
        // =================================================

        if (req.files) {

            if (
                req.files.machine1_camp_photo &&
                req.files.machine1_camp_photo.length > 0
            ) {

                machine1Photo =
                    req.files
                        .machine1_camp_photo[0]
                        .filename;

            }


            if (
                req.files.machine2_camp_photo &&
                req.files.machine2_camp_photo.length > 0
            ) {

                machine2Photo =
                    req.files
                        .machine2_camp_photo[0]
                        .filename;

            }

        }


        // =================================================
        // UPDATE
        // =================================================

        let updateQuery = `
            UPDATE district_reports

            SET

                name = ?,

                designation = ?,

                taluka = ?,

                district = ?,

                mobile_number = ?,

                report_date = ?,


                total_authorised_center_heads_300_to_500 = ?,

                total_active_center_heads = ?,


                machine1_camp_name = ?,

                machine1_test_amount = ?,

                machine1_medicine_amount = ?,

                machine1_total_amount = ?,


                machine2_camp_name = ?,

                machine2_test_amount = ?,

                machine2_medicine_amount = ?,

                machine2_total_amount = ?,


                utr_number = ?,

                additional_remarks = ?,


                machine1_camp_photo = ?,

                machine2_camp_photo = ?,


                status = ?

            WHERE id = ?
        `;


        const updateValues = [

            name,

            designation || null,

            taluka || null,

            district || null,

            mobile_number || null,

            report_date,


            Number(
                total_authorised_center_heads_300_to_500
            ) || 0,


            Number(
                total_active_center_heads
            ) || 0,


            machine1_camp_name ||
                null,

            Number(
                machine1_test_amount
            ) || 0,

            Number(
                machine1_medicine_amount
            ) || 0,

            Number(
                machine1_total_amount
            ) || 0,


            machine2_camp_name ||
                null,

            Number(
                machine2_test_amount
            ) || 0,

            Number(
                machine2_medicine_amount
            ) || 0,

            Number(
                machine2_total_amount
            ) || 0,


            utr_number ||
                null,

            additional_remarks ||
                null,


            machine1Photo,

            machine2Photo,


            status ||
                "active",


            id

        ];


        /*
         * IMPORTANT:
         * User ID is NOT changed during edit.
         * It stays attached to the original owner.
         */

        if (currentUserId) {

            updateQuery = `
                ${updateQuery}
                AND user_id = ?
            `;

            updateValues.push(
                currentUserId
            );

        }


        const [
            updateResult
        ] = await db.query(
            updateQuery,
            updateValues
        );


        if (
            updateResult.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "District report not found or does not belong to this user"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "District report updated successfully"

        });


    } catch (error) {

        console.error(
            "UPDATE DISTRICT REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to update district report",

            error:
                error.message

        });

    }

};
// =====================================================
// DELETE DISTRICT REPORT
// DELETE /api/district-reports/:id
// =====================================================

const deleteDistrictReport = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const currentUserId =
            getCurrentUserId(req);


        let result;


        if (currentUserId) {

            [
                result
            ] = await db.query(

                `
                DELETE FROM district_reports

                WHERE id = ?

                AND user_id = ?
                `,

                [
                    id,
                    currentUserId
                ]

            );

        } else {

            [
                result
            ] = await db.query(

                `
                DELETE FROM district_reports

                WHERE id = ?
                `,

                [
                    id
                ]

            );

        }


        if (
            result.affectedRows === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "District report not found or does not belong to this user"

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "District report deleted successfully"

        });

    } catch (error) {

        console.error(
            "DELETE DISTRICT REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to delete district report",

            error:
                error.message

        });

    }

};
// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createDistrictReport,

    getDistrictReports,

    getDistrictReportById,

    updateDistrictReport,

    deleteDistrictReport

};