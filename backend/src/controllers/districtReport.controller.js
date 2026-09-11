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
        console.log("CREATE REPORT BODY:", req.body);
        console.log("CREATE REPORT FILES:", req.files);

        const {
            user_id,
            name,
            designation,
            taluka,
            district,
            mobile_number,
            mobileNumber,
            report_date,
            reportDate,

            // CENTER HEAD DETAILS
            total_authorised_center_heads,
            total_authorised_center_heads_300_to_500,
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
            additional_remarks,

            // LEGACY MACHINE FIELDS
            machine1_camp_name,
            machine1_test_amount,
            machine1_medicine_amount,
            machine1_total_amount,
            machine2_camp_name,
            machine2_test_amount,
            machine2_medicine_amount,
            machine2_total_amount,
            status,
        } = req.body;

        const currentUserId =
            getCurrentUserId(req) ||
            (user_id ? String(user_id).trim() : null);

        if (!currentUserId) {
            return res.status(400).json({
                success: false,
                message: "District user ID is required",
            });
        }

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        const finalReportDate = report_date || reportDate;
        if (!finalReportDate) {
            return res.status(400).json({
                success: false,
                message: "Report date is required",
            });
        }

        // PHOTO FILES
        let photo1 = null;
        let photo2 = null;

        if (req.files) {
            if (req.files.meeting_photo_1 && req.files.meeting_photo_1.length > 0) {
                photo1 = req.files.meeting_photo_1[0].filename;
            } else if (req.files.machine1_camp_photo && req.files.machine1_camp_photo.length > 0) {
                photo1 = req.files.machine1_camp_photo[0].filename;
            }

            if (req.files.meeting_photo_2 && req.files.meeting_photo_2.length > 0) {
                photo2 = req.files.meeting_photo_2[0].filename;
            } else if (req.files.machine2_camp_photo && req.files.machine2_camp_photo.length > 0) {
                photo2 = req.files.machine2_camp_photo[0].filename;
            }
        }

        const authCount = Number(total_authorised_center_heads ?? total_authorised_center_heads_300_to_500) || 0;
        const activeCount = Number(total_active_center_heads) || 0;
        const visitedCenters = Number(today_visited_centers) || 0;
        const newMembers = Number(new_members_added_today) || 0;
        const padSales = Number(sanitary_pad_box_sales) || 0;
        const birthCount = Number(birth_baby_girls) || 0;
        const deathCountVal = Number(death_count) || 0;
        const accidentCountVal = Number(accident_count) || 0;
        const otherInfo = any_other_information || additional_remarks || null;

        const [result] = await db.query(
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

                total_authorised_center_heads,
                total_authorised_center_heads_300_to_500,
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
                additional_remarks,

                machine1_camp_name,
                machine1_test_amount,
                machine1_medicine_amount,
                machine1_total_amount,
                machine2_camp_name,
                machine2_test_amount,
                machine2_medicine_amount,
                machine2_total_amount,

                meeting_photo_1,
                meeting_photo_2,
                machine1_camp_photo,
                machine2_camp_photo,

                status
            )
            VALUES
            (
                ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?
            )
            `,
            [
                currentUserId,
                name,
                designation || null,
                taluka || null,
                district || null,
                mobile_number || mobileNumber || null,
                finalReportDate,

                authCount,
                authCount,
                activeCount,
                visitedCenters,
                visited_center_head_name || null,
                newMembers,
                padSales,
                health_atm_machine_details || null,
                birthCount,
                deathCountVal,
                accidentCountVal,
                utr_number || null,
                otherInfo,
                otherInfo,

                machine1_camp_name || null,
                Number(machine1_test_amount) || 0,
                Number(machine1_medicine_amount) || 0,
                Number(machine1_total_amount) || 0,
                machine2_camp_name || null,
                Number(machine2_test_amount) || 0,
                Number(machine2_medicine_amount) || 0,
                Number(machine2_total_amount) || 0,

                photo1,
                photo2,
                photo1,
                photo2,

                status || "active",
            ]
        );

        return res.status(201).json({
            success: true,
            message: "District report created successfully",
            id: result.insertId,
        });
    } catch (error) {
        console.error("CREATE DISTRICT REPORT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create district report",
            error: error.message,
        });
    }
};

// =====================================================
// GET DISTRICT REPORTS - USER WISE / ALL
// GET /api/district-reports
// =====================================================

const getDistrictReports = async (req, res) => {
    try {
        const currentUserId = getCurrentUserId(req);
        let reports;

        if (currentUserId) {
            [reports] = await db.query(
                `SELECT * FROM district_reports WHERE user_id = ? ORDER BY id DESC`,
                [currentUserId]
            );
        } else {
            [reports] = await db.query(
                `SELECT * FROM district_reports ORDER BY id DESC`
            );
        }

        return res.status(200).json({
            success: true,
            count: reports.length,
            total: reports.length,
            reports,
            data: reports,
        });
    } catch (error) {
        console.error("GET DISTRICT REPORTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch district reports",
            error: error.message,
        });
    }
};

// =====================================================
// GET SINGLE REPORT
// GET /api/district-reports/:id
// =====================================================

const getDistrictReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = getCurrentUserId(req);
        let reports;

        if (currentUserId) {
            [reports] = await db.query(
                `SELECT * FROM district_reports WHERE id = ? AND user_id = ? LIMIT 1`,
                [id, currentUserId]
            );
        } else {
            [reports] = await db.query(
                `SELECT * FROM district_reports WHERE id = ? LIMIT 1`,
                [id]
            );
        }

        if (reports.length === 0) {
            return res.status(404).json({
                success: false,
                message: "District report not found",
            });
        }

        return res.status(200).json({
            success: true,
            report: reports[0],
            data: reports[0],
        });
    } catch (error) {
        console.error("GET SINGLE DISTRICT REPORT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch district report",
            error: error.message,
        });
    }
};

// =====================================================
// UPDATE DISTRICT REPORT
// PUT /api/district-reports/:id
// =====================================================

const updateDistrictReport = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = getCurrentUserId(req) || (req.body.user_id ? String(req.body.user_id).trim() : null);

        let existing;
        if (currentUserId) {
            [existing] = await db.query(
                `SELECT * FROM district_reports WHERE id = ? AND user_id = ? LIMIT 1`,
                [id, currentUserId]
            );
        } else {
            [existing] = await db.query(
                `SELECT * FROM district_reports WHERE id = ? LIMIT 1`,
                [id]
            );
        }

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "District report not found or does not belong to this user",
            });
        }

        const old = existing[0];
        const {
            name,
            designation,
            taluka,
            district,
            mobile_number,
            mobileNumber,
            report_date,
            reportDate,
            total_authorised_center_heads,
            total_authorised_center_heads_300_to_500,
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
            additional_remarks,
            machine1_camp_name,
            machine1_test_amount,
            machine1_medicine_amount,
            machine1_total_amount,
            machine2_camp_name,
            machine2_test_amount,
            machine2_medicine_amount,
            machine2_total_amount,
            status,
        } = req.body;

        let photo1 = old.meeting_photo_1 || old.machine1_camp_photo || null;
        let photo2 = old.meeting_photo_2 || old.machine2_camp_photo || null;

        if (req.files) {
            if (req.files.meeting_photo_1 && req.files.meeting_photo_1.length > 0) {
                photo1 = req.files.meeting_photo_1[0].filename;
            } else if (req.files.machine1_camp_photo && req.files.machine1_camp_photo.length > 0) {
                photo1 = req.files.machine1_camp_photo[0].filename;
            }

            if (req.files.meeting_photo_2 && req.files.meeting_photo_2.length > 0) {
                photo2 = req.files.meeting_photo_2[0].filename;
            } else if (req.files.machine2_camp_photo && req.files.machine2_camp_photo.length > 0) {
                photo2 = req.files.machine2_camp_photo[0].filename;
            }
        }

        const authCount = total_authorised_center_heads !== undefined
            ? (Number(total_authorised_center_heads) || 0)
            : total_authorised_center_heads_300_to_500 !== undefined
            ? (Number(total_authorised_center_heads_300_to_500) || 0)
            : (old.total_authorised_center_heads || old.total_authorised_center_heads_300_to_500 || 0);

        const activeCount = total_active_center_heads !== undefined
            ? (Number(total_active_center_heads) || 0)
            : (old.total_active_center_heads || 0);

        const visitedCenters = today_visited_centers !== undefined
            ? (Number(today_visited_centers) || 0)
            : (old.today_visited_centers || 0);

        const newMembers = new_members_added_today !== undefined
            ? (Number(new_members_added_today) || 0)
            : (old.new_members_added_today || 0);

        const padSales = sanitary_pad_box_sales !== undefined
            ? (Number(sanitary_pad_box_sales) || 0)
            : (old.sanitary_pad_box_sales || 0);

        const birthCount = birth_baby_girls !== undefined
            ? (Number(birth_baby_girls) || 0)
            : (old.birth_baby_girls || 0);

        const deathCountVal = death_count !== undefined
            ? (Number(death_count) || 0)
            : (old.death_count || 0);

        const accidentCountVal = accident_count !== undefined
            ? (Number(accident_count) || 0)
            : (old.accident_count || 0);

        const otherInfo = any_other_information ?? additional_remarks ?? old.any_other_information ?? old.additional_remarks ?? null;

        let updateQuery = `
            UPDATE district_reports
            SET
                name = ?,
                designation = ?,
                taluka = ?,
                district = ?,
                mobile_number = ?,
                report_date = ?,

                total_authorised_center_heads = ?,
                total_authorised_center_heads_300_to_500 = ?,
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
                additional_remarks = ?,

                machine1_camp_name = ?,
                machine1_test_amount = ?,
                machine1_medicine_amount = ?,
                machine1_total_amount = ?,
                machine2_camp_name = ?,
                machine2_test_amount = ?,
                machine2_medicine_amount = ?,
                machine2_total_amount = ?,

                meeting_photo_1 = ?,
                meeting_photo_2 = ?,
                machine1_camp_photo = ?,
                machine2_camp_photo = ?,

                status = ?
            WHERE id = ?
        `;

        const updateValues = [
            name ?? old.name,
            designation ?? old.designation,
            taluka ?? old.taluka,
            district ?? old.district,
            mobile_number ?? mobileNumber ?? old.mobile_number,
            report_date ?? reportDate ?? old.report_date,

            authCount,
            authCount,
            activeCount,
            visitedCenters,
            visited_center_head_name ?? old.visited_center_head_name,
            newMembers,
            padSales,
            health_atm_machine_details ?? old.health_atm_machine_details,
            birthCount,
            deathCountVal,
            accidentCountVal,
            utr_number ?? old.utr_number,
            otherInfo,
            otherInfo,

            machine1_camp_name ?? old.machine1_camp_name,
            machine1_test_amount !== undefined ? (Number(machine1_test_amount) || 0) : old.machine1_test_amount,
            machine1_medicine_amount !== undefined ? (Number(machine1_medicine_amount) || 0) : old.machine1_medicine_amount,
            machine1_total_amount !== undefined ? (Number(machine1_total_amount) || 0) : old.machine1_total_amount,
            machine2_camp_name ?? old.machine2_camp_name,
            machine2_test_amount !== undefined ? (Number(machine2_test_amount) || 0) : old.machine2_test_amount,
            machine2_medicine_amount !== undefined ? (Number(machine2_medicine_amount) || 0) : old.machine2_medicine_amount,
            machine2_total_amount !== undefined ? (Number(machine2_total_amount) || 0) : old.machine2_total_amount,

            photo1,
            photo2,
            photo1,
            photo2,

            status || old.status || "active",
            id,
        ];

        if (currentUserId) {
            updateQuery = `${updateQuery} AND user_id = ?`;
            updateValues.push(currentUserId);
        }

        const [updateResult] = await db.query(updateQuery, updateValues);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "District report not found or does not belong to this user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "District report updated successfully",
        });
    } catch (error) {
        console.error("UPDATE DISTRICT REPORT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update district report",
            error: error.message,
        });
    }
};

// =====================================================
// DELETE DISTRICT REPORT
// DELETE /api/district-reports/:id
// =====================================================

const deleteDistrictReport = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = getCurrentUserId(req);
        let result;

        if (currentUserId) {
            [result] = await db.query(
                `DELETE FROM district_reports WHERE id = ? AND user_id = ?`,
                [id, currentUserId]
            );
        } else {
            [result] = await db.query(
                `DELETE FROM district_reports WHERE id = ?`,
                [id]
            );
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "District report not found or does not belong to this user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "District report deleted successfully",
        });
    } catch (error) {
        console.error("DELETE DISTRICT REPORT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete district report",
            error: error.message,
        });
    }
};

module.exports = {
    createDistrictReport,
    getDistrictReports,
    getDistrictReportById,
    updateDistrictReport,
    deleteDistrictReport,
};