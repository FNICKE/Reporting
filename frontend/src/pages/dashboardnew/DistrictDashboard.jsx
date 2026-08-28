import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL as ROOT_API_URL, BACKEND_ROOT_URL } from "../../config/api";

const API_BASE_URL = `${ROOT_API_URL}/district-reports`;

const API_ORIGIN = BACKEND_ROOT_URL;

const FILE_PREVIEW_URLS = new WeakMap();

const EMPTY_FORM = {
  name: "",
  designation: "",
  taluka: "",
  district: "",
  mobileNumber: "",
  reportDate: "",
  totalCenterHeads: "",
  totalAuthorisedCenterHeads: "",
  totalActiveCenterHeads: "",
  additionalRemarks: "",
  machine1TestAmount: "",
  machine1MedicineAmount: "",
  machine1TotalAmount: "",
  machine1CampName: "",
  machine2TestAmount: "",
  machine2MedicineAmount: "",
  machine2TotalAmount: "",
  machine2CampName: "",
  utrNumber: "",
  machine1CampPhoto: null,
  machine2CampPhoto: null,
};

const getTodayForInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDateForTable = (date) => {
  if (!date) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  }
  return date;
};

const formatDateForInput = (date) => {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [d, m, y] = date.split("/");
    return `${y}-${m}-${d}`;
  }
  return "";
};

const fileName = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    return value.split("/").pop().split("\\").pop();
  }

  return value.name || "";
};

const getImageUrl = (image) => {
  if (!image) return null;

  // Local File selected in Add/Edit form
  if (image instanceof File) {
    const cached = FILE_PREVIEW_URLS.get(image);

    if (cached) return cached;

    const url = URL.createObjectURL(image);
    FILE_PREVIEW_URLS.set(image, url);

    return url;
  }

  let value = String(image).trim();

  if (!value) return null;

  // Already a complete URL
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Normalize Windows / URL slashes
  value = value
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  // Database may contain /api/uploads/...
  value = value.replace(/^api\//i, "");

  // uploads/district-reports/file.jpg
  if (value.toLowerCase().startsWith("uploads/")) {
    return `${API_ORIGIN}/${value}`;
  }

  // district-reports/file.jpg
  if (
    value
      .toLowerCase()
      .startsWith("district-reports/")
  ) {
    return `${API_ORIGIN}/uploads/${value}`;
  }

  // Filename only
  return `${API_ORIGIN}/uploads/district-reports/${encodeURIComponent(
    value
  )}`;
};

const DistrictDashboard = () => {
  const navigate = useNavigate();

  const revokePreviewUrl = (value) => {
    if (!(value instanceof File)) return;

    const url = FILE_PREVIEW_URLS.get(value);

    if (url) {
      URL.revokeObjectURL(url);
      FILE_PREVIEW_URLS.delete(value);
    }
  };

  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  // =====================================================
  // FILTERS
  // =====================================================

  const [filters, setFilters] = useState({
    name: "",
    taluka: "",
    district: "",
    report_date: "",
  });

  // =====================================================
  // CURRENT LOGGED-IN DISTRICT USER
  // =====================================================
  // Uses the EXISTING login session already used by the
  // live application. No new localStorage key is created.
  const getLoggedInDistrictUserId = () => {
    const userId =
      localStorage.getItem("logged_in_user_id") ||
      "";

    return String(userId).trim();
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getLoggedInDistrictUserId();

      if (!userId) {
        throw new Error(
          "District user ID not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}?user_id=${encodeURIComponent(userId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load reports");
      }

      const rows = data.reports || data.data || [];
      setReports(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Report loading error:", err);
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const newFile = files?.[0] || null;

      setFormData((prev) => {
        revokePreviewUrl(prev[name]);

        return {
          ...prev,
          [name]: newFile,
        };
      });

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReport = () => {
    setError("");
    setSuccess("");
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      reportDate: getTodayForInput(),
    });
    setShowModal(true);
  };

  const handleEdit = (report) => {
    setError("");
    setSuccess("");
    setEditingId(report.id);

    setFormData({
      name: report.name || "",
      designation: report.designation || "",
      taluka: report.taluka || "",
      district: report.district || "",
      mobileNumber: report.mobileNumber ?? report.mobile_number ?? "",
      reportDate: formatDateForInput(report.reportDate ?? report.report_date),
      totalCenterHeads: report.totalCenterHeads ?? report.total_center_heads ?? "",
      totalAuthorisedCenterHeads:
        report.totalAuthorisedCenterHeads ??
        report.total_authorised_center_heads ??
        "",
      totalActiveCenterHeads:
        report.totalActiveCenterHeads ??
        report.total_active_center_heads ??
        "",
      additionalRemarks:
        report.additionalRemarks ??
        report.additional_remarks ??
        "",
      machine1TestAmount: report.machine1TestAmount ?? report.machine1_test_amount ?? "",
      machine1MedicineAmount: report.machine1MedicineAmount ?? report.machine1_medicine_amount ?? "",
      machine1TotalAmount: report.machine1TotalAmount ?? report.machine1_total_amount ?? "",
      machine1CampName: report.machine1CampName ?? report.machine1_camp_name ?? "",
      machine2TestAmount: report.machine2TestAmount ?? report.machine2_test_amount ?? "",
      machine2MedicineAmount: report.machine2MedicineAmount ?? report.machine2_medicine_amount ?? "",
      machine2TotalAmount: report.machine2TotalAmount ?? report.machine2_total_amount ?? "",
      machine2CampName: report.machine2CampName ?? report.machine2_camp_name ?? "",
      utrNumber: report.utrNumber ?? report.utr_number ?? "",
      machine1CampPhoto: report.machine1CampPhoto ?? report.machine1_camp_photo ?? null,
      machine2CampPhoto: report.machine2CampPhoto ?? report.machine2_camp_photo ?? null,
    });

    setShowModal(true);
  };

  const handleClose = () => {
    if (saving) return;

    revokePreviewUrl(formData.machine1CampPhoto);
    revokePreviewUrl(formData.machine2CampPhoto);

    setShowModal(false);
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
  };

  const buildBody = () => {
    const body = new FormData();

    // =====================================================
    // TEXT FIELD NAMES MUST MATCH BACKEND / DATABASE NAMES
    // =====================================================

    const fields = {
      name: formData.name,
      designation: formData.designation,
      taluka: formData.taluka,
      district: formData.district,
      mobile_number: formData.mobileNumber,
      report_date: formData.reportDate,

      total_center_heads: formData.totalCenterHeads,
      total_authorised_center_heads:
        formData.totalAuthorisedCenterHeads,
      total_active_center_heads:
        formData.totalActiveCenterHeads,
      additional_remarks:
        formData.additionalRemarks,

      machine1_camp_name: formData.machine1CampName,
      machine1_test_amount: formData.machine1TestAmount,
      machine1_medicine_amount: formData.machine1MedicineAmount,
      machine1_total_amount: formData.machine1TotalAmount,

      machine2_camp_name: formData.machine2CampName,
      machine2_test_amount: formData.machine2TestAmount,
      machine2_medicine_amount: formData.machine2MedicineAmount,
      machine2_total_amount: formData.machine2TotalAmount,

      utr_number: formData.utrNumber,
    };

    Object.entries(fields).forEach(([key, value]) => {
      body.append(key, value ?? "");
    });

    // =====================================================
    // CURRENT LOGGED-IN DISTRICT USER ID
    // =====================================================

    const userId = getLoggedInDistrictUserId();

    if (!userId) {
      throw new Error(
        "District user ID not found. Please login again."
      );
    }

    body.append("user_id", userId);

    // =====================================================
    // IMPORTANT:
    // MULTER ROUTE EXPECTS THESE EXACT FILE FIELD NAMES
    // =====================================================

    if (formData.machine1CampPhoto instanceof File) {
      body.append(
        "machine1_camp_photo",
        formData.machine1CampPhoto
      );
    }

    if (formData.machine2CampPhoto instanceof File) {
      body.append(
        "machine2_camp_photo",
        formData.machine2CampPhoto
      );
    }

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) return setError("Please enter Name");
    if (!formData.designation.trim()) return setError("Please enter Designation");
    if (!formData.taluka.trim()) return setError("Please enter Taluka");
    if (!formData.district.trim()) return setError("Please enter District");
    if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      return setError("Mobile Number must be exactly 10 digits");
    }
    if (!formData.reportDate) return setError("Please select Report Date");

    if (
      editingId === null &&
      !(formData.machine1CampPhoto instanceof File)
    ) {
      return setError("Please attach Machine 1 Camp Photo");
    }

    if (
      editingId === null &&
      !(formData.machine2CampPhoto instanceof File)
    ) {
      return setError("Please attach Machine 2 Camp Photo");
    }

    try {
      setSaving(true);

      const url = editingId !== null
        ? `${API_BASE_URL}/${editingId}`
        : API_BASE_URL;

      const response = await fetch(url, {
        method: editingId !== null ? "PUT" : "POST",
        body: buildBody(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save report");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData({ ...EMPTY_FORM });
      setSuccess(
        editingId !== null
          ? "Report updated successfully."
          : "Report added successfully."
      );

      await loadReports();
    } catch (err) {
      console.error("Report save error:", err);
      setError(err.message || "Unable to save report.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      setError("");
      setSuccess("");

      const userId = getLoggedInDistrictUserId();

      if (!userId) {
        throw new Error(
          "District user ID not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/${id}?user_id=${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete report");
      }

      setSuccess("Report deleted successfully.");
      await loadReports();
    } catch (err) {
      console.error("Report delete error:", err);
      setError(err.message || "Unable to delete report.");
    }
  };

  // =====================================================
  // SEARCH + FILTERS
  // =====================================================

  const normalize = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const filteredReports = reports.filter((report) => {

    const globalKeyword = normalize(search);

    const nameKeyword = normalize(filters.name);
    const talukaKeyword = normalize(filters.taluka);
    const districtKeyword = normalize(filters.district);
    const dateKeyword = String(
      filters.report_date || ""
    ).trim();

    const matchesGlobal =
      !globalKeyword ||
      [
        report?.name,
        report?.designation,
        report?.taluka,
        report?.district,
        report?.mobileNumber,
        report?.mobile_number,
        report?.reportDate,
        report?.report_date,
        report?.utrNumber,
        report?.utr_number,
        report?.machine1CampName,
        report?.machine1_camp_name,
        report?.machine2CampName,
        report?.machine2_camp_name,
        report?.status,
      ].some((value) =>
        normalize(value).includes(globalKeyword)
      );

    const matchesName =
      !nameKeyword ||
      normalize(report?.name).includes(nameKeyword);

    const matchesTaluka =
      !talukaKeyword ||
      normalize(report?.taluka).includes(talukaKeyword);

    const matchesDistrict =
      !districtKeyword ||
      normalize(report?.district).includes(districtKeyword);

    const rawDate =
      report?.reportDate ??
      report?.report_date ??
      "";

    const reportDate =
      String(rawDate).split("T")[0];

    const matchesDate =
      !dateKeyword ||
      reportDate === dateKeyword;

    return (
      matchesGlobal &&
      matchesName &&
      matchesTaluka &&
      matchesDistrict &&
      matchesDate
    );
  });

  const handleFilterChange = (e) => {

    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {

    setSearch("");

    setFilters({
      name: "",
      taluka: "",
      district: "",
      report_date: "",
    });
  };

  // =====================================================
  // EXCEL DOWNLOAD
  // =====================================================

  const escapeExcel = (value) => {

    const stringValue =
      value === null ||
      value === undefined
        ? ""
        : String(value);

    return stringValue
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  const downloadExcel = () => {

    if (!filteredReports.length) {

      setError(
        "Download करण्यासाठी कोणताही report उपलब्ध नाही."
      );

      return;
    }

    const headers = [
      "SR",
      "Name",
      "Designation",
      "Taluka",
      "District",
      "Mobile Number",
      "Report Date",
      "Total Center Heads",
      "Total Authorised Center Heads (300 to 500)",
      "Total Active Center Heads",
      "Additional Remarks",
      "Machine 1 Test Amount (₹)",
      "Machine 1 Medicine Amount (₹)",
      "Machine 1 Total Amount (₹)",
      "Machine 1 Camp Name",
      "Machine 2 Test Amount (₹)",
      "Machine 2 Medicine Amount (₹)",
      "Machine 2 Total Amount (₹)",
      "Machine 2 Camp Name",
      "UTR Number",
      "Machine 1 Camp Photo",
      "Machine 2 Camp Photo",
      "Status",
    ];

    const rows = filteredReports.map(
      (report, index) => [

        index + 1,

        report?.name || "",

        report?.designation || "",

        report?.taluka || "",

        report?.district || "",

        report?.mobileNumber ??
        report?.mobile_number ??
        "",

        formatDateForTable(
          report?.reportDate ??
          report?.report_date
        ),

        report?.totalCenterHeads ??
        report?.total_center_heads ??
        0,

        report?.totalAuthorisedCenterHeads ??
        report?.total_authorised_center_heads ??
        0,

        report?.totalActiveCenterHeads ??
        report?.total_active_center_heads ??
        0,

        report?.additionalRemarks ??
        report?.additional_remarks ??
        "",

        report?.machine1TestAmount ??
        report?.machine1_test_amount ??
        0,

        report?.machine1MedicineAmount ??
        report?.machine1_medicine_amount ??
        0,

        report?.machine1TotalAmount ??
        report?.machine1_total_amount ??
        0,

        report?.machine1CampName ??
        report?.machine1_camp_name ??
        "",

        report?.machine2TestAmount ??
        report?.machine2_test_amount ??
        0,

        report?.machine2MedicineAmount ??
        report?.machine2_medicine_amount ??
        0,

        report?.machine2TotalAmount ??
        report?.machine2_total_amount ??
        0,

        report?.machine2CampName ??
        report?.machine2_camp_name ??
        "",

        report?.utrNumber ??
        report?.utr_number ??
        "",

        getImageUrl(
          report?.machine1CampPhoto ??
          report?.machine1_camp_photo
        ) || "",

        getImageUrl(
          report?.machine2CampPhoto ??
          report?.machine2_camp_photo
        ) || "",

        report?.status || "Active",
      ]
    );

    const headerHtml = headers
      .map(
        (header) =>
          `<th>${escapeExcel(header)}</th>`
      )
      .join("");

    const bodyHtml = rows
      .map(
        (row) =>
          `<tr>${row
            .map(
              (cell) =>
                `<td>${escapeExcel(cell)}</td>`
            )
            .join("")}</tr>`
      )
      .join("");

    const workbookHtml = `
      <html
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40"
      >
        <head>
          <meta
            http-equiv="Content-Type"
            content="text/html; charset=UTF-8"
          />

          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>District Reports</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->

          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }

            th {
              background: #212529;
              color: #ffffff;
              font-weight: bold;
              border: 1px solid #000000;
              padding: 8px;
            }

            td {
              border: 1px solid #cccccc;
              padding: 8px;
              vertical-align: top;
            }
          </style>
        </head>

        <body>
          <table>
            <thead>
              <tr>${headerHtml}</tr>
            </thead>

            <tbody>
              ${bodyHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob(
      ["\ufeff", workbookHtml],
      {
        type:
          "application/vnd.ms-excel;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const datePart =
      new Date()
        .toISOString()
        .substring(0, 10);

    link.href = url;

    link.download =
      `District_Reports_${datePart}.xls`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setSuccess(
      `${filteredReports.length} report(s) Excel मध्ये download झाले.`
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("logged_in_role");
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("logged_in_user_id");
    localStorage.removeItem("logged_in_user");
    localStorage.removeItem("logged_in_name");
    localStorage.removeItem("logged_in_role");
    localStorage.removeItem("logged_in_status");
    localStorage.removeItem("logged_in_district_id");
    localStorage.removeItem("logged_in_district_name");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-vh-100 bg-light district-dashboard">

      <nav className="navbar bg-white border-bottom px-4 py-3">
        <div className="container-fluid p-0">
          <div>
            <h5 className="fw-bold mb-0">District Dashboard</h5>
            <small className="text-muted">District Management System</small>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "40px", height: "40px" }}
              >
                D
              </div>
              <div>
                <div className="fw-semibold">District</div>
                <small className="text-muted">District Head</small>
              </div>
            </div>

            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container-fluid p-4">

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Reports</h3>
            <p className="text-muted mb-0">Manage district reports</p>
          </div>

          <Button variant="dark" onClick={handleAddReport}>
            <span className="fw-bold me-2" style={{ fontSize: "18px" }}>+</span>
            Add Report
          </Button>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "60px", height: "60px", fontSize: "20px" }}
              >
                {reports.length}
              </div>
              <div>
                <small className="text-muted">Total Reports</small>
                <h4 className="fw-bold mb-0">
                  {reports.length}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">

            <div className="row g-3">

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">
                  Name
                </Form.Label>

                <Form.Control
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search Name..."
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">
                  Taluka
                </Form.Label>

                <Form.Control
                  type="text"
                  name="taluka"
                  value={filters.taluka}
                  onChange={handleFilterChange}
                  placeholder="Search Taluka..."
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">
                  District
                </Form.Label>

                <Form.Control
                  type="text"
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  placeholder="Search District..."
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">
                  Report Date
                </Form.Label>

                <Form.Control
                  type="date"
                  name="report_date"
                  value={filters.report_date}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="col-12">

                <Form.Label className="fw-semibold">
                  Search
                </Form.Label>

                <div className="row g-2">

                  <div className="col-12 col-lg">
                    <Form.Control
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                      placeholder="Search Name, Taluka, District, Mobile, UTR..."
                    />
                  </div>

                  <div className="col-12 col-sm-auto">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      className="w-100"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                  </div>

                  <div className="col-12 col-sm-auto">
                    <Button
                      type="button"
                      variant="success"
                      className="w-100"
                      onClick={downloadExcel}
                      disabled={!filteredReports.length}
                    >
                      Download Excel
                    </Button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table
                className="table table-hover align-middle mb-0"
                style={{ minWidth: "2700px" }}
              >
                <thead className="table-light">
                  <tr>
                    <th>SR</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Taluka</th>
                    <th>District</th>
                    <th>Mobile Number</th>
                    <th>Report Date</th>
                    <th>Total Center Heads</th>
                    <th>Total Authorised Center Heads (300 to 500)</th>
                    <th>Total Active Center Heads</th>
                    <th>Additional Remarks</th>
                    <th>Machine 1 Test Amount (₹)</th>
                    <th>Machine 1 Medicine Amount (₹)</th>
                    <th>Machine 1 Total Amount (₹)</th>
                    <th>Machine 1 Camp Name</th>
                    <th>Machine 2 Test Amount (₹)</th>
                    <th>Machine 2 Medicine Amount (₹)</th>
                    <th>Machine 2 Total Amount (₹)</th>
                    <th>Machine 2 Camp Name</th>
                    <th>UTR Number</th>
                    <th>Machine 1 Camp Photo</th>
                    <th>Machine 2 Camp Photo</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="24" className="text-center py-5">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading reports...
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="24" className="text-center py-5 text-muted">
                        No reports found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report, index) => (
                      <tr key={report.id}>
                        <td>{index + 1}</td>
                        <td>{report.name || "-"}</td>
                        <td>{report.designation || "-"}</td>
                        <td>{report.taluka || "-"}</td>
                        <td>{report.district || "-"}</td>
                        <td>
                          {report.mobileNumber ??
                            report.mobile_number ??
                            "-"}
                        </td>
                        <td>
                          {formatDateForTable(
                            report.reportDate ??
                              report.report_date
                          )}
                        </td>
                        <td>{report.totalCenterHeads ?? report.total_center_heads ?? "0"}</td>
                        <td>{report.totalAuthorisedCenterHeads ?? report.total_authorised_center_heads ?? "0"}</td>
                        <td>{report.totalActiveCenterHeads ?? report.total_active_center_heads ?? "0"}</td>
                        <td
                          style={{
                            whiteSpace: "normal",
                            minWidth: "280px",
                            maxWidth: "360px",
                          }}
                        >
                          {report.additionalRemarks ?? report.additional_remarks ?? "-"}
                        </td>
                        <td>₹ {report.machine1TestAmount ?? report.machine1_test_amount ?? "0"}</td>
                        <td>₹ {report.machine1MedicineAmount ?? report.machine1_medicine_amount ?? "0"}</td>
                        <td>₹ {report.machine1TotalAmount ?? report.machine1_total_amount ?? "0"}</td>
                        <td>{report.machine1CampName ?? report.machine1_camp_name ?? "-"}</td>
                        <td>₹ {report.machine2TestAmount ?? report.machine2_test_amount ?? "0"}</td>
                        <td>₹ {report.machine2MedicineAmount ?? report.machine2_medicine_amount ?? "0"}</td>
                        <td>₹ {report.machine2TotalAmount ?? report.machine2_total_amount ?? "0"}</td>
                        <td>{report.machine2CampName ?? report.machine2_camp_name ?? "-"}</td>
                        <td>{report.utrNumber ?? report.utr_number ?? "-"}</td>
                        <td>
                          {getImageUrl(
                            report.machine1CampPhoto ??
                            report.machine1_camp_photo
                          ) ? (
                            <>
                              <a
                                href={getImageUrl(
                                  report.machine1CampPhoto ??
                                  report.machine1_camp_photo
                                )}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={getImageUrl(
                                    report.machine1CampPhoto ??
                                    report.machine1_camp_photo
                                  )}
                                alt="Machine 1 Camp"
                                loading="lazy"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  maxWidth: "60px",
                                  maxHeight: "60px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #dee2e6",
                                  display: "block",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";

                                  const next =
                                    e.currentTarget.nextElementSibling;

                                  if (next) {
                                    next.style.display = "inline";
                                  }
                                }}
                                />
                              </a>

                              <span
                                className="text-muted small"
                                style={{
                                  display: "none",
                                }}
                              >
                                Image unavailable
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          {getImageUrl(
                            report.machine2CampPhoto ??
                            report.machine2_camp_photo
                          ) ? (
                            <>
                              <a
                                href={getImageUrl(
                                  report.machine2CampPhoto ??
                                    report.machine2_camp_photo
                                )}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={getImageUrl(
                                    report.machine2CampPhoto ??
                                      report.machine2_camp_photo
                                  )}
                                alt="Machine 2 Camp"
                                loading="lazy"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  maxWidth: "60px",
                                  maxHeight: "60px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #dee2e6",
                                  display: "block",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";

                                  const next =
                                    e.currentTarget.nextElementSibling;

                                  if (next) {
                                    next.style.display = "inline";
                                  }
                                }}
                                />
                              </a>

                              <span
                                className="text-muted small"
                                style={{
                                  display: "none",
                                }}
                              >
                                Image unavailable
                              </span>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success">
                            {report.status || "Active"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="outline-dark"
                              onClick={() => handleEdit(report)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDelete(report.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="xl"
        backdrop="static"
        dialogClassName="district-report-modal"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {editingId !== null ? "Edit Report" : "Add Report"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="district-report-modal-body">

            <div className="mb-4">
              <h5 className="fw-bold border-bottom pb-2">Basic Information</h5>
            </div>

            <div className="row g-3">

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Name (नाव) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Designation (पद)</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">Taluka (तालुका)</Form.Label>
                  <Form.Control
                    type="text"
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleChange}
                    placeholder="Enter taluka"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">District (जिल्हा)</Form.Label>
                  <Form.Control
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter district"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Mobile Number (मोबाईल क्रमांक)
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter 10 digit mobile number"
                    maxLength="10"
                    inputMode="numeric"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Report Date (अहवालाची तारीख)
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="reportDate"
                    value={formData.reportDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Total Center Heads (केंद्र प्रमुखांची एकूण संख्या)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="totalCenterHeads"
                    value={formData.totalCenterHeads}
                    onChange={handleChange}
                    placeholder="Enter total center heads"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Total Authorised Center Head 300 to 500
                    <small className="text-muted d-block">
                      अधिकृत केंद्र प्रमुखांची एकूण संख्या (300 ते 500)
                    </small>
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="totalAuthorisedCenterHeads"
                    value={formData.totalAuthorisedCenterHeads}
                    onChange={handleChange}
                    placeholder="Enter authorised center heads"
                    min="300"
                    max="500"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Total Active Center Head
                    <small className="text-muted d-block">
                      सक्रिय केंद्र प्रमुखांची एकूण संख्या
                    </small>
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="totalActiveCenterHeads"
                    value={formData.totalActiveCenterHeads}
                    onChange={handleChange}
                    placeholder="Enter active center heads"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-12">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Additional Remarks (इतर माहिती)
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="additionalRemarks"
                    value={formData.additionalRemarks}
                    onChange={handleChange}
                    placeholder="Enter additional remarks / other information"
                  />
                </Form.Group>
              </div>

            </div>

            <div className="mt-5 mb-3">
              <h5 className="fw-bold border-bottom pb-2">
                Today's Machine 1 (आजची मशीन 1)
              </h5>
            </div>

            <div className="row g-3">

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 1 Total Test Amount (₹)
                    <small className="text-muted d-block">
                      आजची मशीन 1 तपासणीची एकूण रक्कम (₹)
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="machine1TestAmount"
                    value={formData.machine1TestAmount}
                    onChange={handleChange}
                    placeholder="Enter test amount"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 1 Total Medicine Amount (₹)
                    <small className="text-muted d-block">
                      आजची मशीन 1 औषधांची एकूण रक्कम (₹)
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="machine1MedicineAmount"
                    value={formData.machine1MedicineAmount}
                    onChange={handleChange}
                    placeholder="Enter medicine amount"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 1 Total Amount (₹)
                    <small className="text-muted d-block">
                      आजची मशीन 1 एकूण रक्कम (₹)
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="machine1TotalAmount"
                    value={formData.machine1TotalAmount}
                    onChange={handleChange}
                    placeholder="Enter total amount"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 1 Camp Name
                    <small className="text-muted d-block">
                      आजच्या मशीन 1 शिबिराचे नाव
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="machine1CampName"
                    value={formData.machine1CampName}
                    onChange={handleChange}
                    placeholder="Enter camp name"
                  />
                </Form.Group>
              </div>

            </div>

            <div className="mt-5 mb-3">
              <h5 className="fw-bold border-bottom pb-2">
                Today's Machine 2 (आजची मशीन 2)
              </h5>
            </div>

            <div className="row g-3">

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 2 Total Test Amount (₹)
                    <small className="text-muted d-block">
                      आजची मशीन 2 तपासणीची एकूण रक्कम (₹)
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="machine2TestAmount"
                    value={formData.machine2TestAmount}
                    onChange={handleChange}
                    placeholder="Enter test amount"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 2 Total Medicine Amount (₹)
                    <small className="text-muted d-block">
                      आजची मशीन 2 औषधांची एकूण रक्कम (₹)
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="machine2MedicineAmount"
                    value={formData.machine2MedicineAmount}
                    onChange={handleChange}
                    placeholder="Enter medicine amount"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 2 Total Amount (₹)
                    <small className="text-muted d-block">
                      आजची मशीन 2 एकूण रक्कम (₹)
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="machine2TotalAmount"
                    value={formData.machine2TotalAmount}
                    onChange={handleChange}
                    placeholder="Enter total amount"
                    min="0"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today's Machine 2 Camp Name
                    <small className="text-muted d-block">
                      आजच्या मशीन 2 शिबिराचे नाव
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="machine2CampName"
                    value={formData.machine2CampName}
                    onChange={handleChange}
                    placeholder="Enter camp name"
                  />
                </Form.Group>
              </div>

            </div>

            <div className="mt-5 mb-3">
              <h5 className="fw-bold border-bottom pb-2">
                Transaction Details (व्यवहाराची माहिती)
              </h5>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Machine 1 and Machine 2 UTR Number
                    <small className="text-muted d-block">
                      मशीन 1 आणि मशीन 2 च्या व्यवहारांचे UTR क्रमांक
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleChange}
                    placeholder="Enter UTR number"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="mt-5 mb-3">
              <h5 className="fw-bold border-bottom pb-2">
                Camp Photos (शिबिराचे फोटो)
              </h5>
            </div>

            <div className="row g-3 pb-3">

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Machine 1 Camp Photo
                    <span className="text-danger">*</span>
                    <small className="text-muted d-block">
                      मशीन 1 च्या शिबिराचा फोटो
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="machine1CampPhoto"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                  />
                  {formData.machine1CampPhoto && (
                    <>
                      <div className="text-success small mt-2">
                        {formData.machine1CampPhoto instanceof File
                          ? `Selected: ${fileName(formData.machine1CampPhoto)}`
                          : `Current: ${fileName(formData.machine1CampPhoto)}`}
                      </div>

                      {getImageUrl(formData.machine1CampPhoto) && (
                        <img
                          src={getImageUrl(formData.machine1CampPhoto)}
                          alt="Machine 1 Camp Preview"
                          className="mt-2"
                          style={{
                            width: "110px",
                            height: "85px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #dee2e6",
                            display: "block",
                          }}
                        />
                      )}
                    </>
                  )}
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Machine 2 Camp Photo
                    <small className="text-muted d-block">
                      मशीन 2 च्या शिबिराचा फोटो
                    </small>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="machine2CampPhoto"
                    onChange={handleChange}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                  />
                  {formData.machine2CampPhoto && (
                    <>
                      <div className="text-success small mt-2">
                        {formData.machine2CampPhoto instanceof File
                          ? `Selected: ${fileName(formData.machine2CampPhoto)}`
                          : `Current: ${fileName(formData.machine2CampPhoto)}`}
                      </div>

                      {getImageUrl(formData.machine2CampPhoto) && (
                        <img
                          src={getImageUrl(formData.machine2CampPhoto)}
                          alt="Machine 2 Camp Preview"
                          className="mt-2"
                          style={{
                            width: "110px",
                            height: "85px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid #dee2e6",
                            display: "block",
                          }}
                        />
                      )}
                    </>
                  )}
                </Form.Group>
              </div>

            </div>

          </Modal.Body>

          <Modal.Footer className="district-report-modal-footer">
            <Button
              variant="secondary"
              type="button"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              variant="dark"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                editingId !== null ? "Update Report" : "Add Report"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        .district-dashboard .table-responsive {
          -webkit-overflow-scrolling: touch;
        }

        .district-dashboard .table th,
        .district-dashboard .table td {
          white-space: nowrap;
        }

        .district-dashboard .table th,
        .district-dashboard .table td {
          font-size: 13px;
          vertical-align: middle;
        }

        .district-dashboard .table th {
          white-space: nowrap;
        }

        .district-dashboard .table td {
          white-space: nowrap;
        }

        @media (max-width: 767.98px) {

          .district-dashboard main.container-fluid {
            padding: 12px !important;
          }

          .district-dashboard .navbar {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }

          .district-dashboard .navbar .d-flex.align-items-center.gap-3 {
            gap: 8px !important;
          }

          .district-dashboard .navbar small {
            display: none;
          }

          .district-dashboard h3 {
            font-size: 1.5rem;
          }

          .district-dashboard .table-responsive {
            overflow-x: auto;
          }

          .district-dashboard .district-report-modal {
            width: calc(100% - 16px) !important;
            margin: 8px auto !important;
          }

          .district-dashboard .district-report-modal-body {
            max-height: 72vh !important;
            padding: 16px !important;
          }

          .district-dashboard .district-report-modal-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .district-dashboard .district-report-modal-footer > button {
            width: 100%;
            margin: 0 !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1199.98px) {

          .district-dashboard .table-responsive {
            overflow-x: auto;
          }

        }

        .table th,
        .table td {
          white-space: nowrap;
          font-size: 13px;
          vertical-align: middle;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .district-report-modal {
          max-width: 1200px;
          width: 95%;
        }

        .district-report-modal .modal-content {
          max-height: 90vh;
          border: none;
          border-radius: 12px;
          overflow: hidden;
        }

        .district-report-modal .modal-header {
          flex-shrink: 0;
          background: #fff;
          padding: 20px 30px;
          border-bottom: 1px solid #dee2e6;
        }

        .district-report-modal .modal-header .modal-title {
          font-size: 30px;
          font-weight: 700;
        }

        .district-report-modal-body {
          max-height: calc(90vh - 145px);
          overflow-y: auto;
          overflow-x: hidden;
          padding: 28px 30px;
        }

        .district-report-modal-body::-webkit-scrollbar {
          width: 8px;
        }

        .district-report-modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .district-report-modal-body::-webkit-scrollbar-thumb {
          background: #adb5bd;
          border-radius: 10px;
        }

        .district-report-modal-footer {
          flex-shrink: 0;
          background: #fff;
          border-top: 1px solid #dee2e6;
          padding: 14px 30px;
        }

        .district-report-modal .form-control {
          min-height: 46px;
          border-radius: 7px;
        }

        .district-report-modal .form-label {
          margin-bottom: 7px;
        }

        @media (max-width: 768px) {
          .district-report-modal {
            width: 96%;
            margin: 0 auto;
          }

          .district-report-modal .modal-content {
            max-height: 94vh;
          }

          .district-report-modal-body {
            max-height: calc(94vh - 145px);
            padding: 20px;
          }

          .district-report-modal .modal-header {
            padding: 16px 20px;
          }

          .district-report-modal .modal-header .modal-title {
            font-size: 24px;
          }

          .district-report-modal-footer {
            padding: 12px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default DistrictDashboard;
