import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_BASE_URL as ROOT_API_URL, BACKEND_ROOT_URL } from "../../config/api";

const API_BASE_URL = `${ROOT_API_URL}/district-reports`;
const API_ORIGIN = BACKEND_ROOT_URL;

const FILE_PREVIEW_URLS = new WeakMap();

const EMPTY_FORM = {
  name: "",
  designation: "",
  taluka: "",
  district: "",
  mobile_number: "",
  report_date: "",
  total_authorised_center_heads: "",
  total_active_center_heads: "",
  today_visited_centers: "",
  visited_center_head_name: "",
  new_members_added_today: "",
  sanitary_pad_box_sales: "",
  health_atm_machine_details: "",
  birth_baby_girls: "",
  death_count: "",
  accident_count: "",
  utr_number: "",
  any_other_information: "",
  meeting_photo_1: null,
  meeting_photo_2: null,
};

const getTodayForInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDateForTable = (date) => {
  if (!date) return "-";
  const str = String(date).split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-");
    return `${d}/${m}/${y}`;
  }
  return date;
};

const formatDateForInput = (date) => {
  if (!date) return "";
  const str = String(date).split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [d, m, y] = str.split("/");
    return `${y}-${m}-${d}`;
  }
  return "";
};

const getImageUrl = (image) => {
  if (!image) return null;

  if (image instanceof File) {
    const cached = FILE_PREVIEW_URLS.get(image);
    if (cached) return cached;
    const url = URL.createObjectURL(image);
    FILE_PREVIEW_URLS.set(image, url);
    return url;
  }

  let value = String(image).trim();
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  value = value.replace(/\\/g, "/").replace(/^\/+/, "");
  value = value.replace(/^api\//i, "");

  if (value.toLowerCase().startsWith("uploads/")) {
    return `${API_ORIGIN}/${value}`;
  }

  if (value.toLowerCase().startsWith("district-reports/")) {
    return `${API_ORIGIN}/uploads/${value}`;
  }

  return `${API_ORIGIN}/uploads/district-reports/${encodeURIComponent(value)}`;
};

const DistrictDashboard = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    taluka: "",
    district: "",
    report_date: "",
  });

  const loggedInDistrictName =
    localStorage.getItem("logged_in_district_name") ||
    localStorage.getItem("logged_in_name") ||
    "District User";

  const getDistrictUserId = () => {
    return (
      localStorage.getItem("logged_in_user_id") ||
      localStorage.getItem("logged_in_district_id") ||
      ""
    );
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = getDistrictUserId();
      const url = userId
        ? `${API_BASE_URL}?user_id=${encodeURIComponent(userId)}`
        : API_BASE_URL;

      const response = await fetch(url);
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
      setFormData((prev) => ({
        ...prev,
        [name]: newFile,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReport = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      report_date: getTodayForInput(),
      name: localStorage.getItem("logged_in_name") || "",
      district: localStorage.getItem("logged_in_district_name") || "",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleEdit = (report) => {
    setEditingId(report.id);
    setFormData({
      name: report.name || "",
      designation: report.designation || "",
      taluka: report.taluka || "",
      district: report.district || "",
      mobile_number: report.mobile_number || report.mobileNumber || "",
      report_date: formatDateForInput(report.report_date || report.reportDate),
      total_authorised_center_heads:
        report.total_authorised_center_heads ??
        report.total_authorised_center_heads_300_to_500 ??
        report.totalAuthorisedCenterHeads ??
        "",
      total_active_center_heads:
        report.total_active_center_heads ??
        report.totalActiveCenterHeads ??
        "",
      today_visited_centers:
        report.today_visited_centers ??
        report.todayVisitedCenters ??
        "",
      visited_center_head_name:
        report.visited_center_head_name ??
        report.visitedCenterHeadName ??
        "",
      new_members_added_today:
        report.new_members_added_today ??
        report.newMembersAddedToday ??
        "",
      sanitary_pad_box_sales:
        report.sanitary_pad_box_sales ??
        report.sanitaryPadBoxSales ??
        "",
      health_atm_machine_details:
        report.health_atm_machine_details ??
        report.healthAtmMachineDetails ??
        "",
      birth_baby_girls:
        report.birth_baby_girls ??
        report.birthBabyGirls ??
        "",
      death_count:
        report.death_count ??
        report.deathCount ??
        "",
      accident_count:
        report.accident_count ??
        report.accidentCount ??
        "",
      utr_number: report.utr_number || report.utrNumber || "",
      any_other_information:
        report.any_other_information ||
        report.anyOtherInformation ||
        report.additional_remarks ||
        report.additionalRemarks ||
        "",
      meeting_photo_1:
        report.meeting_photo_1 ||
        report.machine1_camp_photo ||
        null,
      meeting_photo_2:
        report.meeting_photo_2 ||
        report.machine2_camp_photo ||
        null,
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("नाव (Name) आवश्यक आहे.");
      return;
    }

    if (!formData.report_date) {
      setError("अहवालाची तारीख (Report Date) आवश्यक आहे.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const userId = getDistrictUserId();
      const formPayload = new FormData();

      if (userId) {
        formPayload.append("user_id", userId);
      }

      formPayload.append("name", formData.name.trim());
      formPayload.append("designation", formData.designation.trim());
      formPayload.append("taluka", formData.taluka.trim());
      formPayload.append("district", formData.district.trim());
      formPayload.append("mobile_number", formData.mobile_number.trim());
      formPayload.append("report_date", formData.report_date);

      formPayload.append(
        "total_authorised_center_heads",
        formData.total_authorised_center_heads || "0"
      );
      formPayload.append(
        "total_active_center_heads",
        formData.total_active_center_heads || "0"
      );
      formPayload.append(
        "today_visited_centers",
        formData.today_visited_centers || "0"
      );
      formPayload.append(
        "visited_center_head_name",
        formData.visited_center_head_name || ""
      );
      formPayload.append(
        "new_members_added_today",
        formData.new_members_added_today || "0"
      );
      formPayload.append(
        "sanitary_pad_box_sales",
        formData.sanitary_pad_box_sales || "0"
      );
      formPayload.append(
        "health_atm_machine_details",
        formData.health_atm_machine_details || ""
      );
      formPayload.append(
        "birth_baby_girls",
        formData.birth_baby_girls || "0"
      );
      formPayload.append(
        "death_count",
        formData.death_count || "0"
      );
      formPayload.append(
        "accident_count",
        formData.accident_count || "0"
      );
      formPayload.append("utr_number", formData.utr_number || "");
      formPayload.append(
        "any_other_information",
        formData.any_other_information || ""
      );

      // Photos
      if (formData.meeting_photo_1 instanceof File) {
        formPayload.append("meeting_photo_1", formData.meeting_photo_1);
      }
      if (formData.meeting_photo_2 instanceof File) {
        formPayload.append("meeting_photo_2", formData.meeting_photo_2);
      }

      const url = editingId
        ? `${API_BASE_URL}/${editingId}`
        : API_BASE_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save district report");
      }

      setSuccess(
        editingId
          ? "District report updated successfully!"
          : "District report added successfully!"
      );

      handleClose();
      await loadReports();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save district report.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Confirmation",
      text: "Are you sure you want to delete this district report?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const userId = getDistrictUserId();
          const url = userId
            ? `${API_BASE_URL}/${id}?user_id=${encodeURIComponent(userId)}`
            : `${API_BASE_URL}/${id}`;

          const response = await fetch(url, {
            method: "DELETE",
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to delete report");
          }

          setSuccess("District report deleted successfully!");
          await loadReports();
        } catch (err) {
          console.error("Delete error:", err);
          setError(err.message || "Failed to delete report.");
        }
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#111827",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    });
  };

  const normalize = (value) =>
    value === null || value === undefined
      ? ""
      : String(value).trim().toLowerCase();

  const filteredReports = reports.filter((report) => {
    const globalKeyword = normalize(search);
    const nameKeyword = normalize(filters.name);
    const talukaKeyword = normalize(filters.taluka);
    const districtKeyword = normalize(filters.district);
    const dateKeyword = filters.report_date.trim();

    const matchesGlobal =
      !globalKeyword ||
      [
        report?.name,
        report?.designation,
        report?.taluka,
        report?.district,
        report?.mobile_number,
        report?.mobileNumber,
        report?.utr_number,
        report?.utrNumber,
        report?.visited_center_head_name,
        report?.health_atm_machine_details,
      ].some((val) => normalize(val).includes(globalKeyword));

    const matchesName = !nameKeyword || normalize(report?.name).includes(nameKeyword);
    const matchesTaluka = !talukaKeyword || normalize(report?.taluka).includes(talukaKeyword);
    const matchesDistrict = !districtKeyword || normalize(report?.district).includes(districtKeyword);

    const rawDate = report?.report_date ?? report?.reportDate ?? "";
    const reportDate = String(rawDate).split("T")[0];
    const matchesDate = !dateKeyword || reportDate === dateKeyword;

    return matchesGlobal && matchesName && matchesTaluka && matchesDistrict && matchesDate;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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

  const downloadExcel = () => {
    if (!filteredReports.length) {
      setError("Download करण्यासाठी कोणताही report उपलब्ध नाही.");
      return;
    }

    const headers = [
      "SR",
      "Name (नाव)",
      "Designation (पद)",
      "Taluka (तालुका)",
      "District (जिल्हा)",
      "Mobile Number (मोबाईल क्रमांक)",
      "Report Date (अहवालाची तारीख)",
      "Total Authorised Center Head -10",
      "Total Active Center Head",
      "Today Visited Centers (आज भेट दिलेली केंद्रे)",
      "Visited Center Head Name (केंद्र प्रमुख यांची नावे)",
      "New Members Added Today (आज नव्याने जोडलेले सदस्य)",
      "Sanitary Pad Box Sales (पॅड बॉक्स विक्री)",
      "Today's Health ATM Machine Details",
      "Birth (Baby Girls)",
      "Death Count",
      "Accident Count",
      "UTR Number",
      "Any Other Information (इतर माहिती)",
      "Status",
    ];

    const rows = filteredReports.map((r, idx) => [
      idx + 1,
      r.name || "-",
      r.designation || "-",
      r.taluka || "-",
      r.district || "-",
      r.mobile_number || r.mobileNumber || "-",
      formatDateForTable(r.report_date || r.reportDate),
      r.total_authorised_center_heads ?? r.total_authorised_center_heads_300_to_500 ?? "0",
      r.total_active_center_heads ?? "0",
      r.today_visited_centers ?? "0",
      r.visited_center_head_name || "-",
      r.new_members_added_today ?? "0",
      r.sanitary_pad_box_sales ?? "0",
      r.health_atm_machine_details || "-",
      r.birth_baby_girls ?? "0",
      r.death_count ?? "0",
      r.accident_count ?? "0",
      r.utr_number || r.utrNumber || "-",
      r.any_other_information || r.additional_remarks || "-",
      r.status || "active",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((v) => `"${String(v).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`)
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `District_Reports_${getTodayForInput()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess("District reports downloaded successfully.");
  };

  return (
    <div className="district-dashboard-wrapper">
      {/* HEADER NAVBAR */}
      <header className="district-navbar bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center sticky-top shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
            style={{ width: "42px", height: "42px", fontSize: "16px" }}
          >
            D
          </div>
          <div>
            <h5 className="fw-bold mb-0">District Dashboard</h5>
            <small className="text-muted">{loggedInDistrictName}</small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Button variant="dark" onClick={handleAddReport} className="fw-semibold shadow-sm">
            <span className="me-1">+</span> Add District
          </Button>

          <button
            type="button"
            className="btn btn-outline-danger d-flex align-items-center gap-2 fw-semibold"
            onClick={handleLogout}
            title="Logout"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="p-4" style={{ background: "#f8fafc", minHeight: "calc(100vh - 78px)" }}>
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

        {/* COUNTER CARD */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "56px", height: "56px", fontSize: "20px" }}
              >
                {reports.length}
              </div>
              <div>
                <small className="text-muted">Total District Reports</small>
                <h4 className="fw-bold mb-0">{reports.length}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-3">
              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">Name (नाव)</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search Name..."
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">Taluka (तालुका)</Form.Label>
                <Form.Control
                  type="text"
                  name="taluka"
                  value={filters.taluka}
                  onChange={handleFilterChange}
                  placeholder="Search Taluka..."
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">District (जिल्हा)</Form.Label>
                <Form.Control
                  type="text"
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  placeholder="Search District..."
                />
              </div>

              <div className="col-12 col-md-6 col-xl-3">
                <Form.Label className="fw-semibold">Report Date (अहवालाची तारीख)</Form.Label>
                <Form.Control
                  type="date"
                  name="report_date"
                  value={filters.report_date}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="col-12">
                <div className="row g-2 align-items-end">
                  <div className="col-12 col-lg">
                    <Form.Label className="fw-semibold">Search</Form.Label>
                    <Form.Control
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by Name, Taluka, District, Mobile, UTR, Center Name..."
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
                      className="w-100 fw-semibold"
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

        {/* TABLE */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0" style={{ minWidth: "3000px" }}>
                <thead className="table-light">
                  <tr>
                    <th className="text-center" style={{ width: "60px" }}>SR</th>
                    <th style={{ minWidth: "180px" }}>Name (नाव)</th>
                    <th style={{ minWidth: "150px" }}>Designation (पद)</th>
                    <th style={{ minWidth: "130px" }}>Taluka (तालुका)</th>
                    <th style={{ minWidth: "130px" }}>District (जिल्हा)</th>
                    <th style={{ minWidth: "150px" }}>Mobile Number (मोबाईल क्रमांक)</th>
                    <th style={{ minWidth: "140px" }}>Report Date (अहवालाची तारीख)</th>
                    <th className="text-center" style={{ minWidth: "220px" }}>Total authourised center Head -10</th>
                    <th className="text-center" style={{ minWidth: "180px" }}>Total Active center Head</th>
                    <th className="text-center" style={{ minWidth: "160px" }}>Today Visited Centers</th>
                    <th style={{ minWidth: "200px" }}>Visited Center Head Name</th>
                    <th className="text-center" style={{ minWidth: "180px" }}>New Members Added Today</th>
                    <th className="text-center" style={{ minWidth: "160px" }}>Sanitary Pad box Sales</th>
                    <th style={{ minWidth: "260px" }}>Today's health ATM Machine details</th>
                    <th className="text-center" style={{ minWidth: "150px" }}>Birth (Baby Girls)</th>
                    <th className="text-center" style={{ minWidth: "130px" }}>Death Count</th>
                    <th className="text-center" style={{ minWidth: "140px" }}>Accident Count</th>
                    <th style={{ minWidth: "160px" }}>UTR Number</th>
                    <th style={{ minWidth: "260px" }}>Any Other Information (इतर माहिती)</th>
                    <th className="text-center" style={{ minWidth: "140px" }}>Meeting Photo 1</th>
                    <th className="text-center" style={{ minWidth: "140px" }}>Meeting Photo 2</th>
                    <th className="text-center" style={{ minWidth: "100px" }}>Status</th>
                    <th className="text-center" style={{ minWidth: "140px" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="23" className="text-center py-5">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading reports...
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="23" className="text-center py-5 text-muted">
                        No district reports found.
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report, index) => {
                      const photo1 = report.meeting_photo_1 || report.machine1_camp_photo;
                      const photo2 = report.meeting_photo_2 || report.machine2_camp_photo;

                      return (
                        <tr key={report.id}>
                          <td className="text-center">{index + 1}</td>
                          <td>{report.name || "-"}</td>
                          <td>{report.designation || "-"}</td>
                          <td>{report.taluka || "-"}</td>
                          <td>{report.district || "-"}</td>
                          <td>{report.mobile_number || report.mobileNumber || "-"}</td>
                          <td>{formatDateForTable(report.report_date || report.reportDate)}</td>
                          <td className="text-center">
                            {report.total_authorised_center_heads ??
                              report.total_authorised_center_heads_300_to_500 ??
                              "0"}
                          </td>
                          <td className="text-center">{report.total_active_center_heads ?? "0"}</td>
                          <td className="text-center">{report.today_visited_centers ?? "0"}</td>
                          <td>{report.visited_center_head_name || "-"}</td>
                          <td className="text-center">{report.new_members_added_today ?? "0"}</td>
                          <td className="text-center">{report.sanitary_pad_box_sales ?? "0"}</td>
                          <td>{report.health_atm_machine_details || "-"}</td>
                          <td className="text-center">{report.birth_baby_girls ?? "0"}</td>
                          <td className="text-center">{report.death_count ?? "0"}</td>
                          <td className="text-center">{report.accident_count ?? "0"}</td>
                          <td>{report.utr_number || report.utrNumber || "-"}</td>
                          <td>{report.any_other_information || report.additional_remarks || "-"}</td>
                          <td className="text-center">
                            {photo1 ? (
                              <a href={getImageUrl(photo1)} target="_blank" rel="noreferrer">
                                <img
                                  src={getImageUrl(photo1)}
                                  alt="Photo 1"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                />
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-center">
                            {photo2 ? (
                              <a href={getImageUrl(photo2)} target="_blank" rel="noreferrer">
                                <img
                                  src={getImageUrl(photo2)}
                                  alt="Photo 2"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                />
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success-subtle text-success">
                              {report.status || "active"}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-2 justify-content-center">
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* ADD / EDIT DISTRICT REPORT MODAL WITH EXACT MARATHI LABELS */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        size="xl"
        backdrop="static"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {editingId !== null ? "Edit District Report" : "Add District Report (अहवाल जोडा)"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
            <div className="row g-3">
              {/* 1. Name (नाव) */}
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
                    placeholder="नाव प्रविष्ट करा"
                    required
                  />
                </Form.Group>
              </div>

              {/* 2. Designation ( पद) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Designation ( पद)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="पद प्रविष्ट करा"
                  />
                </Form.Group>
              </div>

              {/* 3. Taluka (तालुका) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Taluka (तालुका)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="taluka"
                    value={formData.taluka}
                    onChange={handleChange}
                    placeholder="तालुका प्रविष्ट करा"
                  />
                </Form.Group>
              </div>

              {/* 4. District (जिल्हा) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    District (जिल्हा)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="जिल्हा प्रविष्ट करा"
                  />
                </Form.Group>
              </div>

              {/* 5. Mobile Number (मोबाईल क्रमांक) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Mobile Number (मोबाईल क्रमांक)
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="१० अंकी मोबाईल क्रमांक प्रविष्ट करा"
                    maxLength="10"
                  />
                </Form.Group>
              </div>

              {/* 6. Report Date (अहवालाची तारीख) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Report Date (अहवालाची तारीख) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="report_date"
                    value={formData.report_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              {/* 7. Total authourised center Head -10(अधिकृत केंद्र प्रमुखांची एकूण संख्या -10) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Total authourised center Head -10(अधिकृत केंद्र प्रमुखांची एकूण संख्या -10)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="total_authorised_center_heads"
                    value={formData.total_authorised_center_heads}
                    onChange={handleChange}
                    placeholder="संख्या प्रविष्ट करा"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 8. Total Active center Head (सक्रिय केंद्र प्रमुखांची एकूण संख्या) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Total Active center Head (सक्रिय केंद्र प्रमुखांची एकूण संख्या)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="total_active_center_heads"
                    value={formData.total_active_center_heads}
                    onChange={handleChange}
                    placeholder="संख्या प्रविष्ट करा"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 9. Today Visited Centers (आज भेट दिलेली केंद्रे) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today Visited Centers (आज भेट दिलेली केंद्रे)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="today_visited_centers"
                    value={formData.today_visited_centers}
                    onChange={handleChange}
                    placeholder="केंद्रांची संख्या"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 10. Visited Center Head Name (केंद्र प्रमुख यांची नावे ) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Visited Center Head Name (केंद्र प्रमुख यांची नावे )
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="visited_center_head_name"
                    value={formData.visited_center_head_name}
                    onChange={handleChange}
                    placeholder="केंद्र प्रमुखांची नावे"
                  />
                </Form.Group>
              </div>

              {/* 11. New Members Added Today(आज नव्याने जोडलेले सदस्य ) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    New Members Added Today(आज नव्याने जोडलेले सदस्य )
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="new_members_added_today"
                    value={formData.new_members_added_today}
                    onChange={handleChange}
                    placeholder="सदस्यांची संख्या"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 12. Sanitary Pad box Sales (पॅड बॉक्स विक्री) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Sanitary Pad box Sales (पॅड बॉक्स विक्री)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="sanitary_pad_box_sales"
                    value={formData.sanitary_pad_box_sales}
                    onChange={handleChange}
                    placeholder="पॅड बॉक्स विक्री संख्या"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 13. Today’s health ATM Machine details (एटीएम मशीन बुकिंग) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Today’s health ATM Machine details (एटीएम मशीन बुकिंग)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="health_atm_machine_details"
                    value={formData.health_atm_machine_details}
                    onChange={handleChange}
                    placeholder="एटीएम मशीन माहिती / बुकिंग"
                  />
                </Form.Group>
              </div>

              {/* 14. Birth (Baby Girls)  (जन्मलेल्या मुलींची संख्या) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Birth (Baby Girls)  (जन्मलेल्या मुलींची संख्या)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="birth_baby_girls"
                    value={formData.birth_baby_girls}
                    onChange={handleChange}
                    placeholder="मुलींची संख्या"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 15. Death Count  (मृत्यू संख्या) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Death Count  (मृत्यू संख्या)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="death_count"
                    value={formData.death_count}
                    onChange={handleChange}
                    placeholder="मृत्यू संख्या"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 16. Accident Count (अपघात संख्या) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Accident Count (अपघात संख्या)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="accident_count"
                    value={formData.accident_count}
                    onChange={handleChange}
                    placeholder="अपघात संख्या"
                    min="0"
                  />
                </Form.Group>
              </div>

              {/* 17. UTR Number */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    UTR Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="utr_number"
                    value={formData.utr_number}
                    onChange={handleChange}
                    placeholder="UTR क्रमांक प्रविष्ट करा"
                  />
                </Form.Group>
              </div>

              {/* 18. Any Other Information(इतर माहिती) */}
              <div className="col-12">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Any Other Information(इतर माहिती)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="any_other_information"
                    value={formData.any_other_information}
                    onChange={handleChange}
                    placeholder="इतर कोणतीही माहिती असल्यास येथे लिहा"
                  />
                </Form.Group>
              </div>

              {/* 19. Meeting Photo 1 (बैठकीचे फोटो १) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Meeting Photo 1 (बैठकीचे फोटो १)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="meeting_photo_1"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {formData.meeting_photo_1 && (
                    <small className="text-muted d-block mt-1">
                      Selected: {formData.meeting_photo_1 instanceof File ? formData.meeting_photo_1.name : "Existing Photo 1"}
                    </small>
                  )}
                </Form.Group>
              </div>

              {/* 20. Meeting Photo 2 (बैठकीचे फोटो २ ) */}
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Meeting Photo 2 (बैठकीचे फोटो २ )
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="meeting_photo_2"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {formData.meeting_photo_2 && (
                    <small className="text-muted d-block mt-1">
                      Selected: {formData.meeting_photo_2 instanceof File ? formData.meeting_photo_2.name : "Existing Photo 2"}
                    </small>
                  )}
                </Form.Group>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button variant="dark" type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Report" : "Save Report"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DistrictDashboard;
