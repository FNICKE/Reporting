import React, { useEffect, useState } from "react";
import { Alert, Button, Spinner, Modal } from "react-bootstrap";
import * as XLSX from "xlsx";
import { API_BASE_URL as ROOT_API_URL, BACKEND_ROOT_URL } from "../../../config/api";

// =========================================================
// API CONFIG
// =========================================================

const API_BASE_URL = `${ROOT_API_URL}/district-reports`;
const API_ORIGIN = BACKEND_ROOT_URL;

// =========================================================
// IMAGE URL
// =========================================================

const getImageUrl = (image) => {
  if (!image) return null;

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

// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (date) => {
  if (!date) return "-";
  const value = String(date).split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  return value;
};

// =========================================================
// GET VALUE HELPER
// =========================================================

const getValue = (report, camelCase, snakeCase, defaultValue = "-") => {
  const value = report?.[camelCase] ?? report?.[snakeCase];
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }
  return value;
};

const getReportDateValue = (report) => {
  const value = getValue(report, "reportDate", "report_date", "");
  if (!value) return "";
  return String(value).split("T")[0];
};

const DistrictReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nameFilter, setNameFilter] = useState("");
  const [talukaFilter, setTalukaFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load District reports");
      }

      const rows = Array.isArray(data.reports)
        ? data.reports
        : Array.isArray(data.data)
        ? data.data
        : [];

      setReports(rows);
    } catch (err) {
      console.error("DISTRICT REPORT ERROR:", err);
      setError(err.message || "Unable to load District reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleRefresh = async () => {
    setError("");
    setSuccess("");
    await fetchReports();
    setCurrentPage(1);
    setSuccess("District reports refreshed successfully.");
  };

  const filteredReports = reports.filter((report) => {
    const name = String(getValue(report, "name", "name", "")).toLowerCase();
    const taluka = String(getValue(report, "taluka", "taluka", "")).toLowerCase();
    const district = String(getValue(report, "district", "district", "")).toLowerCase();
    const reportDate = getReportDateValue(report);

    const matchesName = !nameFilter.trim() || name.includes(nameFilter.trim().toLowerCase());
    const matchesTaluka = !talukaFilter.trim() || taluka.includes(talukaFilter.trim().toLowerCase());
    const matchesDistrict = !districtFilter.trim() || district.includes(districtFilter.trim().toLowerCase());
    const matchesDate = !dateFilter || reportDate === dateFilter;

    return matchesName && matchesTaluka && matchesDistrict && matchesDate;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [nameFilter, talukaFilter, districtFilter, dateFilter]);

  const totalRecords = filteredReports.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const clearFilters = () => {
    setNameFilter("");
    setTalukaFilter("");
    setDistrictFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  const isFilterActive =
    nameFilter.trim() !== "" ||
    talukaFilter.trim() !== "" ||
    districtFilter.trim() !== "" ||
    dateFilter !== "";

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleDownloadExcel = () => {
    if (filteredReports.length === 0) {
      setError("Download करण्यासाठी कोणताही report उपलब्ध नाही.");
      return;
    }

    setError("");
    setSuccess("");

    const headers = [
      "SR",
      "Name (नाव)",
      "Designation ( पद)",
      "Taluka (तालुका)",
      "District (जिल्हा)",
      "Mobile Number (मोबाईल क्रमांक)",
      "Report Date (अहवालाची तारीख)",
      "Total authourised center Head -10(अधिकृत केंद्र प्रमुखांची एकूण संख्या -10)",
      "Total Active center Head (सक्रिय केंद्र प्रमुखांची एकूण संख्या)",
      "Today Visited Centers (आज भेट दिलेली केंद्रे)",
      "Visited Center Head Name (केंद्र प्रमुख यांची नावे )",
      "New Members Added Today(आज नव्याने जोडलेले सदस्य )",
      "Sanitary Pad box Sales (पॅड बॉक्स विक्री)",
      "Today’s health ATM Machine details (एटीएम मशीन बुकिंग)",
      "Birth (Baby Girls)  (जन्मलेल्या मुलींची संख्या)",
      "Death Count  (मृत्यू संख्या)",
      "Accident Count (अपघात संख्या)",
      "UTR Number",
      "Any Other Information(इतर माहिती)",
      "Meeting Photo 1",
      "Meeting Photo 2",
      "Status",
    ];

    const rows = filteredReports.map((report, index) => [
      index + 1,
      getValue(report, "name", "name", ""),
      getValue(report, "designation", "designation", ""),
      getValue(report, "taluka", "taluka", ""),
      getValue(report, "district", "district", ""),
      getValue(report, "mobileNumber", "mobile_number", ""),
      formatDate(getReportDateValue(report)),
      getValue(report, "totalAuthorisedCenterHeads", "total_authorised_center_heads", "0"),
      getValue(report, "totalActiveCenterHeads", "total_active_center_heads", "0"),
      getValue(report, "todayVisitedCenters", "today_visited_centers", "0"),
      getValue(report, "visitedCenterHeadName", "visited_center_head_name", ""),
      getValue(report, "newMembersAddedToday", "new_members_added_today", "0"),
      getValue(report, "sanitaryPadBoxSales", "sanitary_pad_box_sales", "0"),
      getValue(report, "healthAtmMachineDetails", "health_atm_machine_details", ""),
      getValue(report, "birthBabyGirls", "birth_baby_girls", "0"),
      getValue(report, "deathCount", "death_count", "0"),
      getValue(report, "accidentCount", "accident_count", "0"),
      getValue(report, "utrNumber", "utr_number", ""),
      getValue(report, "anyOtherInformation", "any_other_information", getValue(report, "additionalRemarks", "additional_remarks", "")),
      getImageUrl(getValue(report, "meetingPhoto1", "meeting_photo_1", getValue(report, "machine1CampPhoto", "machine1_camp_photo", ""))) || "",
      getImageUrl(getValue(report, "meetingPhoto2", "meeting_photo_2", getValue(report, "machine2CampPhoto", "machine2_camp_photo", ""))) || "",
      getValue(report, "status", "status", "active"),
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "District Reports");
    XLSX.writeFile(workbook, `District_Reports_${new Date().toISOString().split("T")[0]}.xlsx`);

    setSuccess("District reports exported to Excel successfully.");
  };

  return (
    <div className="district-report-page">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">District Reports (जिल्हा अहवाल)</h4>
          <p className="text-muted mb-0">View, search, and manage all district reports</p>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-dark" onClick={handleRefresh} disabled={loading}>
            Refresh
          </Button>

          <Button variant="success" onClick={handleDownloadExcel} disabled={loading || totalRecords === 0}>
            Download Excel
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")} className="mb-4">
          {success}
        </Alert>
      )}

      {/* TOTAL COUNTER */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "56px", height: "56px", fontSize: "20px" }}
            >
              {loading ? "..." : totalRecords}
            </div>

            <div>
              <small className="text-muted">Total Filtered District Reports</small>
              <h4 className="fw-bold mb-0">{loading ? "Loading..." : `${totalRecords} Records`}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label fw-semibold">Name (नाव)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search Name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label fw-semibold">Taluka (तालुका)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search Taluka..."
                value={talukaFilter}
                onChange={(e) => setTalukaFilter(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label fw-semibold">District (जिल्हा)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search District..."
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <label className="form-label fw-semibold">Report Date (अहवालाची तारीख)</label>
              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {isFilterActive && (
              <div className="col-12">
                <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">District Report List</h6>
          <small className="text-muted">
            Showing {totalRecords === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, totalRecords)} of {totalRecords} reports
          </small>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0" style={{ minWidth: "3200px" }}>
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{ width: "60px" }}>SR</th>
                  <th style={{ minWidth: "180px" }}>Name (नाव)</th>
                  <th style={{ minWidth: "150px" }}>Designation ( पद)</th>
                  <th style={{ minWidth: "130px" }}>Taluka (तालुका)</th>
                  <th style={{ minWidth: "130px" }}>District (जिल्हा)</th>
                  <th style={{ minWidth: "150px" }}>Mobile Number (मोबाईल क्रमांक)</th>
                  <th style={{ minWidth: "140px" }}>Report Date (अहवालाची तारीख)</th>
                  <th className="text-center" style={{ minWidth: "220px" }}>
                    Total authourised center Head -10(अधिकृत केंद्र प्रमुखांची एकूण संख्या -10)
                  </th>
                  <th className="text-center" style={{ minWidth: "180px" }}>
                    Total Active center Head (सक्रिय केंद्र प्रमुखांची एकूण संख्या)
                  </th>
                  <th className="text-center" style={{ minWidth: "160px" }}>
                    Today Visited Centers (आज भेट दिलेली केंद्रे)
                  </th>
                  <th style={{ minWidth: "200px" }}>
                    Visited Center Head Name (केंद्र प्रमुख यांची नावे )
                  </th>
                  <th className="text-center" style={{ minWidth: "180px" }}>
                    New Members Added Today(आज नव्याने जोडलेले सदस्य )
                  </th>
                  <th className="text-center" style={{ minWidth: "160px" }}>
                    Sanitary Pad box Sales (पॅड बॉक्स विक्री)
                  </th>
                  <th style={{ minWidth: "260px" }}>
                    Today’s health ATM Machine details (एटीएम मशीन बुकिंग)
                  </th>
                  <th className="text-center" style={{ minWidth: "150px" }}>
                    Birth (Baby Girls)  (जन्मलेल्या मुलींची संख्या)
                  </th>
                  <th className="text-center" style={{ minWidth: "130px" }}>
                    Death Count  (मृत्यू संख्या)
                  </th>
                  <th className="text-center" style={{ minWidth: "140px" }}>
                    Accident Count (अपघात संख्या)
                  </th>
                  <th style={{ minWidth: "160px" }}>UTR Number</th>
                  <th style={{ minWidth: "260px" }}>
                    Any Other Information(इतर माहिती)
                  </th>
                  <th className="text-center" style={{ minWidth: "140px" }}>
                    Meeting Photo 1 (बैठकीचे फोटो १)
                  </th>
                  <th className="text-center" style={{ minWidth: "140px" }}>
                    Meeting Photo 2 (बैठकीचे फोटो २ )
                  </th>
                  <th className="text-center" style={{ minWidth: "100px" }}>Status</th>
                  <th className="text-center" style={{ minWidth: "100px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="23" className="text-center py-5">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading district reports...
                    </td>
                  </tr>
                ) : totalRecords === 0 ? (
                  <tr>
                    <td colSpan="23" className="text-center py-5 text-muted">
                      No district reports found.
                    </td>
                  </tr>
                ) : (
                  currentReports.map((report, index) => {
                    const photo1 = getImageUrl(
                      getValue(report, "meetingPhoto1", "meeting_photo_1", getValue(report, "machine1CampPhoto", "machine1_camp_photo", ""))
                    );
                    const photo2 = getImageUrl(
                      getValue(report, "meetingPhoto2", "meeting_photo_2", getValue(report, "machine2CampPhoto", "machine2_camp_photo", ""))
                    );

                    return (
                      <tr key={report.id || index}>
                        <td className="text-center">{startIndex + index + 1}</td>
                        <td className="fw-semibold">{getValue(report, "name", "name")}</td>
                        <td>{getValue(report, "designation", "designation")}</td>
                        <td>{getValue(report, "taluka", "taluka")}</td>
                        <td>{getValue(report, "district", "district")}</td>
                        <td>{getValue(report, "mobileNumber", "mobile_number")}</td>
                        <td>{formatDate(getReportDateValue(report))}</td>
                        <td className="text-center">
                          {getValue(report, "totalAuthorisedCenterHeads", "total_authorised_center_heads", getValue(report, "totalAuthorisedCenterHeads300To500", "total_authorised_center_heads_300_to_500", "0"))}
                        </td>
                        <td className="text-center">
                          {getValue(report, "totalActiveCenterHeads", "total_active_center_heads", "0")}
                        </td>
                        <td className="text-center">
                          {getValue(report, "todayVisitedCenters", "today_visited_centers", "0")}
                        </td>
                        <td>{getValue(report, "visitedCenterHeadName", "visited_center_head_name")}</td>
                        <td className="text-center">
                          {getValue(report, "newMembersAddedToday", "new_members_added_today", "0")}
                        </td>
                        <td className="text-center">
                          {getValue(report, "sanitaryPadBoxSales", "sanitary_pad_box_sales", "0")}
                        </td>
                        <td>{getValue(report, "healthAtmMachineDetails", "health_atm_machine_details")}</td>
                        <td className="text-center">{getValue(report, "birthBabyGirls", "birth_baby_girls", "0")}</td>
                        <td className="text-center">{getValue(report, "deathCount", "death_count", "0")}</td>
                        <td className="text-center">{getValue(report, "accidentCount", "accident_count", "0")}</td>
                        <td>{getValue(report, "utrNumber", "utr_number")}</td>
                        <td>
                          {getValue(report, "anyOtherInformation", "any_other_information", getValue(report, "additionalRemarks", "additional_remarks", "-"))}
                        </td>
                        <td className="text-center">
                          {photo1 ? (
                            <a href={photo1} target="_blank" rel="noreferrer">
                              <img
                                src={photo1}
                                alt="Photo 1"
                                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                              />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center">
                          {photo2 ? (
                            <a href={photo2} target="_blank" rel="noreferrer">
                              <img
                                src={photo2}
                                alt="Photo 2"
                                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                              />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-success-subtle text-success">
                            {getValue(report, "status", "status", "active")}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button size="sm" variant="dark" onClick={() => handleViewReport(report)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-muted small">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* DETAIL MODAL WITH MARATHI LABELS */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">District Report Details (तपशील)</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "75vh", overflowY: "auto" }}>
          {selectedReport && (
            <div className="row g-3">
              <div className="col-md-6">
                <strong>Name (नाव):</strong>
                <div>{getValue(selectedReport, "name", "name")}</div>
              </div>
              <div className="col-md-6">
                <strong>Designation ( पद):</strong>
                <div>{getValue(selectedReport, "designation", "designation")}</div>
              </div>
              <div className="col-md-6">
                <strong>Taluka (तालुका):</strong>
                <div>{getValue(selectedReport, "taluka", "taluka")}</div>
              </div>
              <div className="col-md-6">
                <strong>District (जिल्हा):</strong>
                <div>{getValue(selectedReport, "district", "district")}</div>
              </div>
              <div className="col-md-6">
                <strong>Mobile Number (मोबाईल क्रमांक):</strong>
                <div>{getValue(selectedReport, "mobileNumber", "mobile_number")}</div>
              </div>
              <div className="col-md-6">
                <strong>Report Date (अहवालाची तारीख):</strong>
                <div>{formatDate(getReportDateValue(selectedReport))}</div>
              </div>
              <div className="col-md-6">
                <strong>Total authourised center Head -10(अधिकृत केंद्र प्रमुखांची एकूण संख्या -10):</strong>
                <div>{getValue(selectedReport, "totalAuthorisedCenterHeads", "total_authorised_center_heads", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Total Active center Head (सक्रिय केंद्र प्रमुखांची एकूण संख्या):</strong>
                <div>{getValue(selectedReport, "totalActiveCenterHeads", "total_active_center_heads", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Today Visited Centers (आज भेट दिलेली केंद्रे):</strong>
                <div>{getValue(selectedReport, "todayVisitedCenters", "today_visited_centers", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Visited Center Head Name (केंद्र प्रमुख यांची नावे ):</strong>
                <div>{getValue(selectedReport, "visitedCenterHeadName", "visited_center_head_name")}</div>
              </div>
              <div className="col-md-6">
                <strong>New Members Added Today(आज नव्याने जोडलेले सदस्य ):</strong>
                <div>{getValue(selectedReport, "newMembersAddedToday", "new_members_added_today", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Sanitary Pad box Sales (पॅड बॉक्स विक्री):</strong>
                <div>{getValue(selectedReport, "sanitaryPadBoxSales", "sanitary_pad_box_sales", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Today’s health ATM Machine details (एटीएम मशीन बुकिंग):</strong>
                <div>{getValue(selectedReport, "healthAtmMachineDetails", "health_atm_machine_details")}</div>
              </div>
              <div className="col-md-6">
                <strong>Birth (Baby Girls)  (जन्मलेल्या मुलींची संख्या):</strong>
                <div>{getValue(selectedReport, "birthBabyGirls", "birth_baby_girls", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Death Count  (मृत्यू संख्या):</strong>
                <div>{getValue(selectedReport, "deathCount", "death_count", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>Accident Count (अपघात संख्या):</strong>
                <div>{getValue(selectedReport, "accidentCount", "accident_count", "0")}</div>
              </div>
              <div className="col-md-6">
                <strong>UTR Number:</strong>
                <div>{getValue(selectedReport, "utrNumber", "utr_number")}</div>
              </div>
              <div className="col-12">
                <strong>Any Other Information(इतर माहिती):</strong>
                <div>{getValue(selectedReport, "anyOtherInformation", "any_other_information", getValue(selectedReport, "additionalRemarks", "additional_remarks", "-"))}</div>
              </div>
              <div className="col-md-6">
                <strong>Meeting Photo 1 (बैठकीचे फोटो १):</strong>
                <div>
                  {getImageUrl(getValue(selectedReport, "meetingPhoto1", "meeting_photo_1", getValue(selectedReport, "machine1CampPhoto", "machine1_camp_photo", ""))) ? (
                    <a
                      href={getImageUrl(getValue(selectedReport, "meetingPhoto1", "meeting_photo_1", getValue(selectedReport, "machine1CampPhoto", "machine1_camp_photo", "")))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={getImageUrl(getValue(selectedReport, "meetingPhoto1", "meeting_photo_1", getValue(selectedReport, "machine1CampPhoto", "machine1_camp_photo", "")))}
                        alt="Photo 1"
                        style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    </a>
                  ) : (
                    "No photo uploaded"
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <strong>Meeting Photo 2 (बैठकीचे फोटो २ ):</strong>
                <div>
                  {getImageUrl(getValue(selectedReport, "meetingPhoto2", "meeting_photo_2", getValue(selectedReport, "machine2CampPhoto", "machine2_camp_photo", ""))) ? (
                    <a
                      href={getImageUrl(getValue(selectedReport, "meetingPhoto2", "meeting_photo_2", getValue(selectedReport, "machine2CampPhoto", "machine2_camp_photo", "")))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={getImageUrl(getValue(selectedReport, "meetingPhoto2", "meeting_photo_2", getValue(selectedReport, "machine2CampPhoto", "machine2_camp_photo", "")))}
                        alt="Photo 2"
                        style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    </a>
                  ) : (
                    "No photo uploaded"
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DistrictReport;