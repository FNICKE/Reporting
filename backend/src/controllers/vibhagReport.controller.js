const db = require("../config/db");


// =====================================================
// HELPER - GET FILE NAME
// multer.fields() returns OBJECT
// multer.array() returns ARRAY
// This helper supports BOTH
// =====================================================

const getFileName = (files, possibleNames) => {

    if (!files) {
        return null;
    }

    // =================================================
    // multer.fields()
    // req.files = {
    //   meeting_photo_1: [file],
    //   meeting_photo_2: [file]
    // }
    // =================================================

    if (
        !Array.isArray(files) &&
        typeof files === "object"
    ) {

        for (const fieldName of possibleNames) {

            if (
                files[fieldName] &&
                Array.isArray(files[fieldName]) &&
                files[fieldName].length > 0
            ) {

                return files[fieldName][0].filename;

            }

        }

    }


    // =================================================
    // multer.array()
    // =================================================

    if (Array.isArray(files)) {

        const file = files.find(
            (item) =>
                possibleNames.includes(
                    item.fieldname
                )
        );

        return file
            ? file.filename
            : null;

    }


    return null;

};


// =====================================================
// CREATE VIBHAG REPORT
// POST /api/vibhag-reports
// =====================================================

const createVibhagReport = async (
    req,
    res
) => {

    try {

        console.log(
            "================================="
        );

        console.log(
            "CREATE VIBHAG REPORT"
        );

        console.log(
            "BODY:",
            req.body
        );

        console.log(
            "FILES:",
            req.files
        );

        console.log(
            "================================="
        );


        const {

            name,
            designation,
            taluka,
            district,
            mobile_number,
            report_date,

            total_authorised_center_heads,
            total_active_center_heads,

            today_visited_centers,
            visited_center_head_name,

            new_members_added_today,

            sanitary_pad_box_sales,

            health_atm_machine_details,

            birth_baby_girls,
            death_count,
            accident_count,

            utr_number,

            any_other_information,

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
                    "Name is required",

            });

        }


        if (!report_date) {

            return res.status(400).json({

                success: false,

                message:
                    "Report date is required",

            });

        }


        // =================================================
        // GET PHOTOS
        // =================================================

        const meetingPhoto1 =
            getFileName(
                req.files,
                [
                    "meeting_photo_1",
                    "meetingPhoto1",
                    "meeting1Photo",
                    "meeting_photo1",
                ]
            );


        const meetingPhoto2 =
            getFileName(
                req.files,
                [
                    "meeting_photo_2",
                    "meetingPhoto2",
                    "meeting2Photo",
                    "meeting_photo2",
                ]
            );


        console.log(
            "MEETING PHOTO 1:",
            meetingPhoto1
        );

        console.log(
            "MEETING PHOTO 2:",
            meetingPhoto2
        );


        // =================================================
        // INSERT
        // =================================================

        const [result] =
            await db.query(

                `
                INSERT INTO vibhag_reports
                (
                    name,
                    designation,
                    taluka,
                    district,
                    mobile_number,
                    report_date,

                    total_authorised_center_heads,
                    total_active_center_heads,

                    today_visited_centers,
                    visited_center_head_name,

                    new_members_added_today,

                    sanitary_pad_box_sales,

                    health_atm_machine_details,

                    birth_baby_girls,
                    death_count,
                    accident_count,

                    utr_number,

                    any_other_information,

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

                    ?,

                    ?, ?, ?,

                    ?,

                    ?,

                    ?, ?,

                    ?
                )
                `,

                [

                    String(name).trim(),

                    designation
                        ? String(designation).trim()
                        : null,

                    taluka
                        ? String(taluka).trim()
                        : null,

                    district
                        ? String(district).trim()
                        : null,

                    mobile_number
                        ? String(mobile_number).trim()
                        : null,

                    report_date,


                    Number(
                        total_authorised_center_heads
                    ) || 0,

                    Number(
                        total_active_center_heads
                    ) || 0,


                    Number(
                        today_visited_centers
                    ) || 0,

                    visited_center_head_name
                        ? String(
                            visited_center_head_name
                          ).trim()
                        : null,


                    Number(
                        new_members_added_today
                    ) || 0,


                    Number(
                        sanitary_pad_box_sales
                    ) || 0,


                    health_atm_machine_details
                        ? String(
                            health_atm_machine_details
                          ).trim()
                        : null,


                    Number(
                        birth_baby_girls
                    ) || 0,

                    Number(
                        death_count
                    ) || 0,

                    Number(
                        accident_count
                    ) || 0,


                    utr_number
                        ? String(utr_number).trim()
                        : null,


                    any_other_information
                        ? String(
                            any_other_information
                          ).trim()
                        : null,


                    meetingPhoto1,

                    meetingPhoto2,


                    "active",

                ]

            );


        // =================================================
        // GET CREATED REPORT
        // =================================================

        const [rows] =
            await db.query(

                `
                SELECT *

                FROM vibhag_reports

                WHERE id = ?

                LIMIT 1
                `,

                [
                    result.insertId
                ]

            );


        return res.status(201).json({

            success: true,

            message:
                "Vibhag report created successfully",

            report:
                rows[0],

            data:
                rows[0],

        });


    } catch (error) {

        console.error(
            "CREATE VIBHAG REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create Vibhag report",

        });

    }

};


// =====================================================
// GET ALL VIBHAG REPORTS
// GET /api/vibhag-reports
// =====================================================

const getVibhagReports = async (
    req,
    res
) => {

    try {

        const [rows] =
            await db.query(

                `
                SELECT *

                FROM vibhag_reports

                ORDER BY id DESC
                `

            );


        return res.status(200).json({

            success: true,

            count:
                rows.length,

            total:
                rows.length,

            reports:
                rows,

            data:
                rows,

        });


    } catch (error) {

        console.error(
            "GET VIBHAG REPORTS ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch Vibhag reports",

        });

    }

};


// =====================================================
// GET SINGLE VIBHAG REPORT
// GET /api/vibhag-reports/:id
// =====================================================

const getVibhagReportById = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const [rows] =
            await db.query(

                `
                SELECT *

                FROM vibhag_reports

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
                    "Vibhag report not found",

            });

        }


        return res.status(200).json({

            success: true,

            report:
                rows[0],

            data:
                rows[0],

        });


    } catch (error) {

        console.error(
            "GET VIBHAG REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch Vibhag report",

        });

    }

};


// =====================================================
// UPDATE VIBHAG REPORT
// PUT /api/vibhag-reports/:id
// =====================================================

const updateVibhagReport = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {

            name,
            designation,
            taluka,
            district,
            mobile_number,
            report_date,

            total_authorised_center_heads,
            total_active_center_heads,

            today_visited_centers,
            visited_center_head_name,

            new_members_added_today,

            sanitary_pad_box_sales,

            health_atm_machine_details,

            birth_baby_girls,
            death_count,
            accident_count,

            utr_number,

            any_other_information,

            status,

        } = req.body;


        // =================================================
        // CHECK EXISTING REPORT
        // =================================================

        const [existing] =
            await db.query(

                `
                SELECT *

                FROM vibhag_reports

                WHERE id = ?

                LIMIT 1
                `,

                [
                    id
                ]

            );


        if (
            existing.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Vibhag report not found",

            });

        }


        // =================================================
        // KEEP OLD PHOTOS
        // =================================================

        let meetingPhoto1 =
            existing[0].meeting_photo_1 ||
            null;


        let meetingPhoto2 =
            existing[0].meeting_photo_2 ||
            null;


        // =================================================
        // GET NEW PHOTOS
        // =================================================

        const newPhoto1 =
            getFileName(
                req.files,
                [
                    "meeting_photo_1",
                    "meetingPhoto1",
                    "meeting1Photo",
                    "meeting_photo1",
                ]
            );


        const newPhoto2 =
            getFileName(
                req.files,
                [
                    "meeting_photo_2",
                    "meetingPhoto2",
                    "meeting2Photo",
                    "meeting_photo2",
                ]
            );


        // =================================================
        // REPLACE ONLY IF NEW PHOTO SELECTED
        // =================================================

        if (newPhoto1) {

            meetingPhoto1 =
                newPhoto1;

        }


        if (newPhoto2) {

            meetingPhoto2 =
                newPhoto2;

        }


        console.log(
            "UPDATED PHOTO 1:",
            meetingPhoto1
        );

        console.log(
            "UPDATED PHOTO 2:",
            meetingPhoto2
        );


        // =================================================
        // UPDATE DATABASE
        // =================================================

        await db.query(

            `
            UPDATE vibhag_reports

            SET

                name = ?,
                designation = ?,
                taluka = ?,
                district = ?,
                mobile_number = ?,
                report_date = ?,

                total_authorised_center_heads = ?,
                total_active_center_heads = ?,

                today_visited_centers = ?,
                visited_center_head_name = ?,

                new_members_added_today = ?,

                sanitary_pad_box_sales = ?,

                health_atm_machine_details = ?,

                birth_baby_girls = ?,
                death_count = ?,
                accident_count = ?,

                utr_number = ?,

                any_other_information = ?,

                meeting_photo_1 = ?,
                meeting_photo_2 = ?,

                status = ?

            WHERE id = ?
            `,

            [

                name
                    ? String(name).trim()
                    : null,

                designation
                    ? String(designation).trim()
                    : null,

                taluka
                    ? String(taluka).trim()
                    : null,

                district
                    ? String(district).trim()
                    : null,

                mobile_number
                    ? String(mobile_number).trim()
                    : null,

                report_date,


                Number(
                    total_authorised_center_heads
                ) || 0,

                Number(
                    total_active_center_heads
                ) || 0,


                Number(
                    today_visited_centers
                ) || 0,

                visited_center_head_name
                    ? String(
                        visited_center_head_name
                      ).trim()
                    : null,


                Number(
                    new_members_added_today
                ) || 0,


                Number(
                    sanitary_pad_box_sales
                ) || 0,


                health_atm_machine_details
                    ? String(
                        health_atm_machine_details
                      ).trim()
                    : null,


                Number(
                    birth_baby_girls
                ) || 0,

                Number(
                    death_count
                ) || 0,

                Number(
                    accident_count
                ) || 0,


                utr_number
                    ? String(utr_number).trim()
                    : null,


                any_other_information
                    ? String(
                        any_other_information
                      ).trim()
                    : null,


                meetingPhoto1,

                meetingPhoto2,


                status ||
                    "active",


                id,

            ]

        );


        // =================================================
        // GET UPDATED REPORT
        // =================================================

        const [updatedRows] =
            await db.query(

                `
                SELECT *

                FROM vibhag_reports

                WHERE id = ?

                LIMIT 1
                `,

                [
                    id
                ]

            );


        return res.status(200).json({

            success: true,

            message:
                "Vibhag report updated successfully",

            report:
                updatedRows[0],

            data:
                updatedRows[0],

        });


    } catch (error) {

        console.error(
            "UPDATE VIBHAG REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update Vibhag report",

        });

    }

};


// =====================================================
// DELETE VIBHAG REPORT
// DELETE /api/vibhag-reports/:id
// =====================================================

const deleteVibhagReport = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const [rows] =
            await db.query(

                `
                SELECT
                    meeting_photo_1,
                    meeting_photo_2

                FROM vibhag_reports

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
                    "Vibhag report not found",

            });

        }


        await db.query(

            `
            DELETE FROM vibhag_reports

            WHERE id = ?
            `,

            [
                id
            ]

        );


        return res.status(200).json({

            success: true,

            message:
                "Vibhag report deleted successfully",

        });


    } catch (error) {

        console.error(
            "DELETE VIBHAG REPORT ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete Vibhag report",

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createVibhagReport,

    getVibhagReports,

    getVibhagReportById,

    updateVibhagReport,

    deleteVibhagReport,

};