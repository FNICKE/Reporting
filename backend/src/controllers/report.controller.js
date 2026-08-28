const { pool } = require("../config/db");

// =====================================================
// GET ALL REPORTS
// =====================================================

const getReports = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM reports
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("GET REPORTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE REPORT
// =====================================================

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM reports
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET REPORT BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE REPORT
// =====================================================

const createReport = async (req, res) => {
  try {
    console.log("========== CREATE REPORT ==========");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      name,
      designation,
      taluka,
      district,
      mobileNumber,
      reportDate,
      totalCenterHeads,

      machine1TestAmount,
      machine1MedicineAmount,
      machine1TotalAmount,
      machine1CampName,

      machine2TestAmount,
      machine2MedicineAmount,
      machine2TotalAmount,
      machine2CampName,

      utrNumber,
    } = req.body;

    // =================================================
    // REQUIRED VALIDATION
    // =================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation is required",
      });
    }

    if (!taluka || !taluka.trim()) {
      return res.status(400).json({
        success: false,
        message: "Taluka is required",
      });
    }

    if (!district || !district.trim()) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: "Mobile Number must be exactly 10 digits",
      });
    }

    if (!reportDate) {
      return res.status(400).json({
        success: false,
        message: "Report Date is required",
      });
    }

    // =================================================
    // GET UPLOADED FILES
    // =================================================

    const machine1CampPhoto =
      req.files?.machine1CampPhoto?.[0]?.filename || null;

    const machine2CampPhoto =
      req.files?.machine2CampPhoto?.[0]?.filename || null;

    // =================================================
    // MACHINE 1 PHOTO REQUIRED
    // =================================================

    if (!machine1CampPhoto) {
      return res.status(400).json({
        success: false,
        message: "Machine 1 Camp Photo is required",
      });
    }

    // =================================================
    // INSERT REPORT
    // =================================================

    const [result] = await pool.query(
      `
      INSERT INTO reports
      (
        name,
        designation,
        taluka,
        district,
        mobile_number,
        report_date,
        total_center_heads,

        machine1_test_amount,
        machine1_medicine_amount,
        machine1_total_amount,
        machine1_camp_name,

        machine2_test_amount,
        machine2_medicine_amount,
        machine2_total_amount,
        machine2_camp_name,

        utr_number,

        machine1_camp_photo,
        machine2_camp_photo,

        status,
        created_by
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?,
        ?, ?,
        ?,
        ?
      )
      `,
      [
        name.trim(),
        designation.trim(),
        taluka.trim(),
        district.trim(),
        mobileNumber.trim(),
        reportDate,
        totalCenterHeads || 0,

        machine1TestAmount || 0,
        machine1MedicineAmount || 0,
        machine1TotalAmount || 0,
        machine1CampName || null,

        machine2TestAmount || 0,
        machine2MedicineAmount || 0,
        machine2TotalAmount || 0,
        machine2CampName || null,

        utrNumber || null,

        machine1CampPhoto,
        machine2CampPhoto,

        "active",
        req.user?.id || null,
      ]
    );

    console.log(
      "Machine 1 Photo:",
      machine1CampPhoto
    );

    console.log(
      "Machine 2 Photo:",
      machine2CampPhoto
    );

    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      id: result.insertId,
      machine1CampPhoto,
      machine2CampPhoto,
    });

  } catch (error) {
    console.error("CREATE REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create report",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE REPORT
// =====================================================

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("========== UPDATE REPORT ==========");
    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      name,
      designation,
      taluka,
      district,
      mobileNumber,
      reportDate,
      totalCenterHeads,

      machine1TestAmount,
      machine1MedicineAmount,
      machine1TotalAmount,
      machine1CampName,

      machine2TestAmount,
      machine2MedicineAmount,
      machine2TotalAmount,
      machine2CampName,

      utrNumber,
    } = req.body;

    // =================================================
    // CHECK EXISTING REPORT
    // =================================================

    const [existingRows] = await pool.query(
      `
      SELECT *
      FROM reports
      WHERE id = ?
      `,
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const existingReport = existingRows[0];

    // =================================================
    // REQUIRED VALIDATION
    // =================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!designation || !designation.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation is required",
      });
    }

    if (!taluka || !taluka.trim()) {
      return res.status(400).json({
        success: false,
        message: "Taluka is required",
      });
    }

    if (!district || !district.trim()) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber.trim())) {
      return res.status(400).json({
        success: false,
        message: "Mobile Number must be exactly 10 digits",
      });
    }

    if (!reportDate) {
      return res.status(400).json({
        success: false,
        message: "Report Date is required",
      });
    }

    // =================================================
    // NEW FILES
    // =================================================

    const newMachine1Photo =
      req.files?.machine1CampPhoto?.[0]?.filename || null;

    const newMachine2Photo =
      req.files?.machine2CampPhoto?.[0]?.filename || null;

    // =================================================
    // KEEP OLD PHOTO IF NEW PHOTO NOT SELECTED
    // =================================================

    const machine1CampPhoto =
      newMachine1Photo ||
      existingReport.machine1_camp_photo ||
      null;

    const machine2CampPhoto =
      newMachine2Photo ||
      existingReport.machine2_camp_photo ||
      null;

    // =================================================
    // UPDATE
    // =================================================

    const [result] = await pool.query(
      `
      UPDATE reports
      SET
        name = ?,
        designation = ?,
        taluka = ?,
        district = ?,
        mobile_number = ?,
        report_date = ?,
        total_center_heads = ?,

        machine1_test_amount = ?,
        machine1_medicine_amount = ?,
        machine1_total_amount = ?,
        machine1_camp_name = ?,

        machine2_test_amount = ?,
        machine2_medicine_amount = ?,
        machine2_total_amount = ?,
        machine2_camp_name = ?,

        utr_number = ?,

        machine1_camp_photo = ?,
        machine2_camp_photo = ?

      WHERE id = ?
      `,
      [
        name.trim(),
        designation.trim(),
        taluka.trim(),
        district.trim(),
        mobileNumber.trim(),
        reportDate,
        totalCenterHeads || 0,

        machine1TestAmount || 0,
        machine1MedicineAmount || 0,
        machine1TotalAmount || 0,
        machine1CampName || null,

        machine2TestAmount || 0,
        machine2MedicineAmount || 0,
        machine2TotalAmount || 0,
        machine2CampName || null,

        utrNumber || null,

        machine1CampPhoto,
        machine2CampPhoto,

        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      affectedRows: result.affectedRows,
      machine1CampPhoto,
      machine2CampPhoto,
    });

  } catch (error) {
    console.error("UPDATE REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE REPORT
// =====================================================

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `
      DELETE FROM reports
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });

  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};