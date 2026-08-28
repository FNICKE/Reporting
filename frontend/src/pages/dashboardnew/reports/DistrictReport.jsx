import React, { useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
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

  value = value
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  value = value.replace(/^api\//i, "");

  if (value.toLowerCase().startsWith("uploads/")) {
    return `${API_ORIGIN}/${value}`;
  }

  if (
    value
      .toLowerCase()
      .startsWith("district-reports/")
  ) {
    return `${API_ORIGIN}/uploads/${value}`;
  }

  return `${API_ORIGIN}/uploads/district-reports/${encodeURIComponent(
    value
  )}`;
};

// =========================================================
// DATE FORMAT
// =========================================================

const formatDate = (date) => {
  if (!date) return "-";

  const value = String(date);

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");

    return `${day}/${month}/${year}`;
  }

  if (value.includes("T")) {
    const datePart = value.split("T")[0];

    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [year, month, day] =
        datePart.split("-");

      return `${day}/${month}/${year}`;
    }
  }

  return value;
};

// =========================================================
// GET VALUE
// =========================================================

const getValue = (
  report,
  camelCase,
  snakeCase,
  defaultValue = "-"
) => {
  const value =
    report?.[camelCase] ??
    report?.[snakeCase];

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return defaultValue;
  }

  return value;
};

// =========================================================
// GET REPORT DATE
// =========================================================

const getReportDateValue = (report) => {
  const value = getValue(
    report,
    "reportDate",
    "report_date",
    ""
  );

  if (!value) return "";

  return String(value).split("T")[0];
};

// =========================================================
// COMPONENT
// =========================================================

const DistrictReport = () => {

  // =======================================================
  // STATE
  // =======================================================

  const [reports, setReports] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =======================================================
  // FILTERS
  // =======================================================

  const [nameFilter, setNameFilter] =
    useState("");

  const [talukaFilter, setTalukaFilter] =
    useState("");

  const [districtFilter, setDistrictFilter] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  // =======================================================
  // PAGINATION
  // =======================================================

  const RECORDS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] =
    useState(1);

  // =======================================================
  // LOAD REPORTS
  // =======================================================

  const loadReports = async () => {
    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(API_BASE_URL);

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load district reports"
        );
      }

      const rows =
        data.reports ||
        data.data ||
        [];

      setReports(
        Array.isArray(rows)
          ? rows
          : []
      );

    } catch (err) {

      console.error(
        "District reports error:",
        err
      );

      setError(
        err.message ||
        "Unable to load district reports."
      );

    } finally {

      setLoading(false);

    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadReports();
  }, []);

  // =======================================================
  // REFRESH
  // =======================================================

  const handleRefresh = async () => {

    setError("");
    setSuccess("");

    await loadReports();

    setCurrentPage(1);

    setSuccess(
      "Reports refreshed successfully."
    );
  };

  // =======================================================
  // FILTER REPORTS
  // =======================================================

  const filteredReports =
    reports.filter((report) => {

      // ===================================================
      // NAME
      // ===================================================

      const name =
        String(
          getValue(
            report,
            "name",
            "name",
            ""
          )
        ).toLowerCase();

      // ===================================================
      // TALUKA
      // ===================================================

      const taluka =
        String(
          getValue(
            report,
            "taluka",
            "taluka",
            ""
          )
        ).toLowerCase();

      // ===================================================
      // DISTRICT
      // ===================================================

      const district =
        String(
          getValue(
            report,
            "district",
            "district",
            ""
          )
        ).toLowerCase();

      // ===================================================
      // REPORT DATE
      // ===================================================

      const reportDate =
        getReportDateValue(report);

      // ===================================================
      // SEARCH VALUES
      // ===================================================

      const nameSearch =
        nameFilter
          .trim()
          .toLowerCase();

      const talukaSearch =
        talukaFilter
          .trim()
          .toLowerCase();

      const districtSearch =
        districtFilter
          .trim()
          .toLowerCase();

      // ===================================================
      // MATCH
      // ===================================================

      const nameMatch =
        !nameSearch ||
        name.includes(nameSearch);

      const talukaMatch =
        !talukaSearch ||
        taluka.includes(talukaSearch);

      const districtMatch =
        !districtSearch ||
        district.includes(districtSearch);

      const dateMatch =
        !dateFilter ||
        reportDate === dateFilter;

      return (
        nameMatch &&
        talukaMatch &&
        districtMatch &&
        dateMatch
      );
    });

  // =======================================================
  // CLEAR FILTERS
  // =======================================================

  const clearFilters = () => {

    setNameFilter("");
    setTalukaFilter("");
    setDistrictFilter("");
    setDateFilter("");

    setCurrentPage(1);

    setError("");
    setSuccess("");
  };

  // =======================================================
  // FILTER ACTIVE
  // =======================================================

  const isFilterActive =
    nameFilter.trim() !== "" ||
    talukaFilter.trim() !== "" ||
    districtFilter.trim() !== "" ||
    dateFilter !== "";

  // =======================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =======================================================

  useEffect(() => {

    setCurrentPage(1);

  }, [
    nameFilter,
    talukaFilter,
    districtFilter,
    dateFilter
  ]);

  // =======================================================
  // PAGINATION
  // =======================================================

  const totalRecords =
    filteredReports.length;

  const totalPages =
    Math.ceil(
      totalRecords /
      RECORDS_PER_PAGE
    );

  const startIndex =
    (currentPage - 1) *
    RECORDS_PER_PAGE;

  const endIndex =
    startIndex +
    RECORDS_PER_PAGE;

  const currentReports =
    filteredReports.slice(
      startIndex,
      endIndex
    );

  // =======================================================
  // FIX CURRENT PAGE
  // =======================================================

  useEffect(() => {

    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }

  }, [
    totalPages,
    currentPage
  ]);

  // =======================================================
  // PAGE CHANGE
  // =======================================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =======================================================
  // PAGE NUMBERS
  // =======================================================

  const getPageNumbers = () => {

    const pages = [];

    if (totalPages <= 7) {

      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start =
      Math.max(
        2,
        currentPage - 1
      );

    const end =
      Math.min(
        totalPages - 1,
        currentPage + 1
      );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      currentPage <
      totalPages - 3
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // =======================================================
  // EXCEL DOWNLOAD
  // =======================================================

  const handleDownloadExcel = () => {

    try {

      setError("");
      setSuccess("");

      if (!filteredReports.length) {

        setError(
          "No reports available to download."
        );

        return;
      }

      const excelData =
        filteredReports.map(
          (report, index) => ({

            SR:
              index + 1,

            Name:
              getValue(
                report,
                "name",
                "name"
              ),

            Designation:
              getValue(
                report,
                "designation",
                "designation"
              ),

            Taluka:
              getValue(
                report,
                "taluka",
                "taluka"
              ),

            District:
              getValue(
                report,
                "district",
                "district"
              ),

            "Mobile Number":
              getValue(
                report,
                "mobileNumber",
                "mobile_number"
              ),

            "Report Date":
              formatDate(
                getValue(
                  report,
                  "reportDate",
                  "report_date",
                  ""
                )
              ),

            // =============================================
            // CENTER HEAD DETAILS
            // =============================================

            "Total Authorised Center Head 300 to 500":
              getValue(
                report,
                "totalAuthorisedCenterHeads300To500",
                "total_authorised_center_heads_300_to_500",
                "0"
              ),

            "Total Active Center Head":
              getValue(
                report,
                "totalActiveCenterHeads",
                "total_active_center_heads",
                "0"
              ),

            // =============================================
            // MACHINE 1
            // =============================================

            "Machine 1 Test Amount":
              getValue(
                report,
                "machine1TestAmount",
                "machine1_test_amount",
                "0"
              ),

            "Machine 1 Medicine Amount":
              getValue(
                report,
                "machine1MedicineAmount",
                "machine1_medicine_amount",
                "0"
              ),

            "Machine 1 Total Amount":
              getValue(
                report,
                "machine1TotalAmount",
                "machine1_total_amount",
                "0"
              ),

            "Machine 1 Camp Name":
              getValue(
                report,
                "machine1CampName",
                "machine1_camp_name"
              ),

            // =============================================
            // MACHINE 2
            // =============================================

            "Machine 2 Test Amount":
              getValue(
                report,
                "machine2TestAmount",
                "machine2_test_amount",
                "0"
              ),

            "Machine 2 Medicine Amount":
              getValue(
                report,
                "machine2MedicineAmount",
                "machine2_medicine_amount",
                "0"
              ),

            "Machine 2 Total Amount":
              getValue(
                report,
                "machine2TotalAmount",
                "machine2_total_amount",
                "0"
              ),

            "Machine 2 Camp Name":
              getValue(
                report,
                "machine2CampName",
                "machine2_camp_name"
              ),

            // =============================================
            // OTHER
            // =============================================

            "UTR Number":
              getValue(
                report,
                "utrNumber",
                "utr_number"
              ),

            "Additional Remarks":
              getValue(
                report,
                "additionalRemarks",
                "additional_remarks"
              ),

            // =============================================
            // PHOTOS
            // =============================================

            "Machine 1 Camp Photo":
              getImageUrl(
                getValue(
                  report,
                  "machine1CampPhoto",
                  "machine1_camp_photo",
                  ""
                )
              ) || "",

            "Machine 2 Camp Photo":
              getImageUrl(
                getValue(
                  report,
                  "machine2CampPhoto",
                  "machine2_camp_photo",
                  ""
                )
              ) || "",

            // =============================================
            // STATUS
            // =============================================

            Status:
              getValue(
                report,
                "status",
                "status",
                "Active"
              )

          })
        );

      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );

      // ===============================================
      // EXCEL COLUMN WIDTHS
      // ===============================================

      worksheet["!cols"] = [

        { wch: 8 },

        { wch: 25 },

        { wch: 22 },

        { wch: 20 },

        { wch: 20 },

        { wch: 18 },

        { wch: 18 },

        { wch: 38 },

        { wch: 30 },

        { wch: 25 },

        { wch: 28 },

        { wch: 25 },

        { wch: 25 },

        { wch: 28 },

        { wch: 25 },

        { wch: 25 },

        { wch: 25 },

        { wch: 35 },

        { wch: 40 },

        { wch: 35 },

        { wch: 35 },

        { wch: 18 }

      ];

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "District Reports"
      );

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      XLSX.writeFile(
        workbook,
        `District_Reports_${today}.xlsx`
      );

      setSuccess(
        `${filteredReports.length} report(s) downloaded successfully.`
      );

    } catch (err) {

      console.error(
        "Excel error:",
        err
      );

      setError(
        "Unable to download Excel file."
      );
    }
  };

  // =======================================================
  // CSV DOWNLOAD
  // =======================================================

  const handleDownloadCSV = () => {

    try {

      setError("");
      setSuccess("");

      if (!filteredReports.length) {

        setError(
          "No reports available to download."
        );

        return;
      }

      // ===============================================
      // CSV HEADERS
      // ===============================================

      const headers = [

        "SR",

        "Name",

        "Designation",

        "Taluka",

        "District",

        "Mobile Number",

        "Report Date",

        "Total Authorised Center Head 300 to 500",

        "Total Active Center Head",

        "Machine 1 Test Amount",

        "Machine 1 Medicine Amount",

        "Machine 1 Total Amount",

        "Machine 1 Camp Name",

        "Machine 2 Test Amount",

        "Machine 2 Medicine Amount",

        "Machine 2 Total Amount",

        "Machine 2 Camp Name",

        "UTR Number",

        "Additional Remarks",

        "Machine 1 Camp Photo",

        "Machine 2 Camp Photo",

        "Status"

      ];

      // ===============================================
      // CSV DATA
      // ===============================================

      const rows =
        filteredReports.map(
          (report, index) => [

            index + 1,

            getValue(
              report,
              "name",
              "name",
              ""
            ),

            getValue(
              report,
              "designation",
              "designation",
              ""
            ),

            getValue(
              report,
              "taluka",
              "taluka",
              ""
            ),

            getValue(
              report,
              "district",
              "district",
              ""
            ),

            getValue(
              report,
              "mobileNumber",
              "mobile_number",
              ""
            ),

            formatDate(
              getValue(
                report,
                "reportDate",
                "report_date",
                ""
              )
            ),

            getValue(
              report,
              "totalAuthorisedCenterHeads300To500",
              "total_authorised_center_heads_300_to_500",
              "0"
            ),

            getValue(
              report,
              "totalActiveCenterHeads",
              "total_active_center_heads",
              "0"
            ),

            getValue(
              report,
              "machine1TestAmount",
              "machine1_test_amount",
              "0"
            ),

            getValue(
              report,
              "machine1MedicineAmount",
              "machine1_medicine_amount",
              "0"
            ),

            getValue(
              report,
              "machine1TotalAmount",
              "machine1_total_amount",
              "0"
            ),

            getValue(
              report,
              "machine1CampName",
              "machine1_camp_name",
              ""
            ),

            getValue(
              report,
              "machine2TestAmount",
              "machine2_test_amount",
              "0"
            ),

            getValue(
              report,
              "machine2MedicineAmount",
              "machine2_medicine_amount",
              "0"
            ),

            getValue(
              report,
              "machine2TotalAmount",
              "machine2_total_amount",
              "0"
            ),

            getValue(
              report,
              "machine2CampName",
              "machine2_camp_name",
              ""
            ),

            getValue(
              report,
              "utrNumber",
              "utr_number",
              ""
            ),

            getValue(
              report,
              "additionalRemarks",
              "additional_remarks",
              ""
            ),

            getImageUrl(
              getValue(
                report,
                "machine1CampPhoto",
                "machine1_camp_photo",
                ""
              )
            ) || "",

            getImageUrl(
              getValue(
                report,
                "machine2CampPhoto",
                "machine2_camp_photo",
                ""
              )
            ) || "",

            getValue(
              report,
              "status",
              "status",
              "Active"
            )

          ]
        );

      // ===============================================
      // ESCAPE CSV VALUE
      // ===============================================

      const escapeCSV = (value) => {

        const text =
          String(value ?? "");

        if (
          text.includes(",") ||
          text.includes('"') ||
          text.includes("\n") ||
          text.includes("\r")
        ) {

          return `"${text.replace(
            /"/g,
            '""'
          )}"`;

        }

        return text;
      };

      // ===============================================
      // CREATE CSV CONTENT
      // ===============================================

      const csvContent = [

        headers
          .map(escapeCSV)
          .join(","),

        ...rows.map(
          (row) =>
            row
              .map(escapeCSV)
              .join(",")
        )

      ].join("\r\n");

      // ===============================================
      // UTF-8 BOM
      // ===============================================

      const blob =
        new Blob(
          [
            "\uFEFF" +
            csvContent
          ],
          {
            type:
              "text/csv;charset=utf-8;"
          }
        );

      // ===============================================
      // CREATE DOWNLOAD URL
      // ===============================================

      const url =
        URL.createObjectURL(blob);

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `District_Reports_${today}.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setSuccess(
        `${filteredReports.length} report(s) downloaded successfully.`
      );

    } catch (err) {

      console.error(
        "CSV download error:",
        err
      );

      setError(
        "Unable to download CSV file."
      );
    }
  };

  // =======================================================
  // RETURN
  // =======================================================

  return (

    <div className="district-report-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          d-flex
          flex-column
          flex-md-row
          justify-content-between
          align-items-start
          align-items-md-center
          gap-3
          mb-4
        "
      >

        <div>

          <h3 className="fw-bold mb-1">
            District Reports
          </h3>

          <p className="text-muted mb-0">
            Manage and view all district reports
          </p>

        </div>

        <div className="d-flex gap-2 flex-wrap">

          {/* =================================================
              DOWNLOAD CSV
          ================================================= */}



          {/* =================================================
              DOWNLOAD EXCEL
          ================================================= */}

          <Button
            variant="dark"
            onClick={
              handleDownloadExcel
            }
            disabled={
              loading ||
              filteredReports.length === 0
            }
          >
            ↓&nbsp; Download Excel
          </Button>

          {/* =================================================
              REFRESH
          ================================================= */}

          <Button
            variant="dark"
            onClick={handleRefresh}
            disabled={loading}
          >

            {loading ? (

              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                />

                Loading...
              </>

            ) : (

              <>↻&nbsp; Refresh</>

            )}

          </Button>

        </div>

      </div>

      {/* =================================================
          ALERTS
      ================================================= */}

      {error && (

        <Alert
          variant="danger"
          dismissible
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>

      )}

      {success && (

        <Alert
          variant="success"
          dismissible
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>

      )}

      {/* =================================================
          TOTAL
      ================================================= */}

      <div className="card border-0 shadow-sm mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="d-flex align-items-center gap-3">

            <div
              className="
                bg-dark
                text-white
                rounded
                d-flex
                align-items-center
                justify-content-center
                fw-bold
              "
              style={{
                width: "60px",
                height: "60px",
                fontSize: "20px"
              }}
            >

              {loading
                ? "..."
                : filteredReports.length}

            </div>

            <div>

              <small className="text-muted">

                {isFilterActive
                  ? "Filtered District Reports"
                  : "Total District Reports"}

              </small>

              <h4 className="fw-bold mb-0">

                {loading
                  ? "..."
                  : filteredReports.length}

              </h4>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="card border-0 shadow-sm mb-3">

        <div className="card-body p-3 p-md-4">

          <div className="row g-3">

            {/* NAME */}

            <div className="col-12 col-md-6 col-xl-3">

              <label className="form-label fw-semibold">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search Name..."
                value={nameFilter}
                onChange={(e) =>
                  setNameFilter(
                    e.target.value
                  )
                }
              />

            </div>

            {/* TALUKA */}

            <div className="col-12 col-md-6 col-xl-3">

              <label className="form-label fw-semibold">
                Taluka
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search Taluka..."
                value={talukaFilter}
                onChange={(e) =>
                  setTalukaFilter(
                    e.target.value
                  )
                }
              />

            </div>

            {/* DISTRICT */}

            <div className="col-12 col-md-6 col-xl-3">

              <label className="form-label fw-semibold">
                District
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search District..."
                value={districtFilter}
                onChange={(e) =>
                  setDistrictFilter(
                    e.target.value
                  )
                }
              />

            </div>

            {/* DATE */}

            <div className="col-12 col-md-6 col-xl-3">

              <label className="form-label fw-semibold">
                Report Date
              </label>

              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(
                    e.target.value
                  )
                }
              />

            </div>

            {/* CLEAR */}

            <div className="col-12">

              <Button
                variant="dark"
                className="w-100"
                onClick={clearFilters}
                disabled={!isFilterActive}
              >
                Clear
              </Button>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div className="card border-0 shadow-sm">

        {/* TABLE HEADER */}

        <div
          className="
            card-header
            bg-white
            border-bottom
            py-3
            px-3
            px-md-4
          "
        >

          <div
            className="
              d-flex
              justify-content-between
              align-items-center
              flex-wrap
              gap-2
            "
          >

            <h6 className="fw-bold mb-0">
              District Report List
            </h6>

            <small className="text-muted">

              Showing{" "}

              <strong>

                {loading
                  ? "..."
                  : totalRecords === 0
                  ? 0
                  : startIndex + 1}

              </strong>

              {" - "}

              <strong>

                {loading
                  ? "..."
                  : Math.min(
                      endIndex,
                      totalRecords
                    )}

              </strong>

              {" "}of{" "}

              <strong>

                {loading
                  ? "..."
                  : totalRecords}

              </strong>

              {" "}reports

            </small>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="card-body p-0">

          <div className="district-report-table">

            <table
              className="
                table
                table-hover
                table-bordered
                align-middle
                mb-0
              "
            >

              <thead>

                <tr>

                  <th>SR</th>

                  <th>Name</th>

                  <th>Designation</th>

                  <th>Taluka</th>

                  <th>District</th>

                  <th>Mobile Number</th>

                  <th>Report Date</th>

                  {/* CENTER HEADS */}

                  <th>
                    Total Authorised Center Head
                    300 to 500
                  </th>

                  <th>
                    Total Active Center Head
                  </th>

                  {/* MACHINE 1 */}

                  <th>
                    Machine 1 Test Amount (₹)
                  </th>

                  <th>
                    Machine 1 Medicine Amount (₹)
                  </th>

                  <th>
                    Machine 1 Total Amount (₹)
                  </th>

                  <th>
                    Machine 1 Camp Name
                  </th>

                  {/* MACHINE 2 */}

                  <th>
                    Machine 2 Test Amount (₹)
                  </th>

                  <th>
                    Machine 2 Medicine Amount (₹)
                  </th>

                  <th>
                    Machine 2 Total Amount (₹)
                  </th>

                  <th>
                    Machine 2 Camp Name
                  </th>

                  {/* OTHER */}

                  <th>UTR Number</th>

                  <th>
                    Additional Remarks
                  </th>

                  {/* PHOTOS */}

                  <th>
                    Machine 1 Camp Photo
                  </th>

                  <th>
                    Machine 2 Camp Photo
                  </th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                  <tr>

                    <td
                      colSpan="22"
                      className="
                        text-center
                        py-5
                      "
                    >

                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                      />

                      Loading district reports...

                    </td>

                  </tr>

                )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                  totalRecords === 0 && (

                    <tr>

                      <td
                        colSpan="22"
                        className="
                          text-center
                          py-5
                          text-muted
                        "
                      >

                        <div className="fs-2">
                          🔍
                        </div>

                        <div className="fw-semibold">
                          No reports found
                        </div>

                        {isFilterActive && (

                          <Button
                            variant="dark"
                            size="sm"
                            className="mt-2"
                            onClick={
                              clearFilters
                            }
                          >
                            Clear Filters
                          </Button>

                        )}

                      </td>

                    </tr>

                  )}

                {/* =================================================
                    DATA
                ================================================= */}

                {!loading &&
                  currentReports.map(
                    (report, index) => {

                      const machine1Photo =
                        getImageUrl(
                          getValue(
                            report,
                            "machine1CampPhoto",
                            "machine1_camp_photo",
                            ""
                          )
                        );

                      const machine2Photo =
                        getImageUrl(
                          getValue(
                            report,
                            "machine2CampPhoto",
                            "machine2_camp_photo",
                            ""
                          )
                        );

                      return (

                        <tr
                          key={
                            report.id ||
                            index
                          }
                        >

                          {/* SR */}

                          <td className="text-center">
                            {startIndex +
                              index +
                              1}
                          </td>

                          {/* NAME */}

                          <td className="fw-semibold">

                            {getValue(
                              report,
                              "name",
                              "name"
                            )}

                          </td>

                          {/* DESIGNATION */}

                          <td>

                            {getValue(
                              report,
                              "designation",
                              "designation"
                            )}

                          </td>

                          {/* TALUKA */}

                          <td>

                            {getValue(
                              report,
                              "taluka",
                              "taluka"
                            )}

                          </td>

                          {/* DISTRICT */}

                          <td>

                            {getValue(
                              report,
                              "district",
                              "district"
                            )}

                          </td>

                          {/* MOBILE */}

                          <td>

                            {getValue(
                              report,
                              "mobileNumber",
                              "mobile_number"
                            )}

                          </td>

                          {/* DATE */}

                          <td>

                            {formatDate(
                              getValue(
                                report,
                                "reportDate",
                                "report_date",
                                ""
                              )
                            )}

                          </td>

                          {/* TOTAL AUTHORISED CENTER HEAD */}

                          <td className="text-center fw-semibold">

                            {getValue(
                              report,
                              "totalAuthorisedCenterHeads300To500",
                              "total_authorised_center_heads_300_to_500",
                              "0"
                            )}

                          </td>

                          {/* TOTAL ACTIVE CENTER HEAD */}

                          <td className="text-center fw-semibold">

                            {getValue(
                              report,
                              "totalActiveCenterHeads",
                              "total_active_center_heads",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 1 TEST */}

                          <td className="text-end fw-semibold">

                            ₹{" "}

                            {getValue(
                              report,
                              "machine1TestAmount",
                              "machine1_test_amount",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 1 MEDICINE */}

                          <td className="text-end fw-semibold">

                            ₹{" "}

                            {getValue(
                              report,
                              "machine1MedicineAmount",
                              "machine1_medicine_amount",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 1 TOTAL */}

                          <td className="text-end fw-bold">

                            ₹{" "}

                            {getValue(
                              report,
                              "machine1TotalAmount",
                              "machine1_total_amount",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 1 CAMP */}

                          <td>

                            {getValue(
                              report,
                              "machine1CampName",
                              "machine1_camp_name"
                            )}

                          </td>

                          {/* MACHINE 2 TEST */}

                          <td className="text-end fw-semibold">

                            ₹{" "}

                            {getValue(
                              report,
                              "machine2TestAmount",
                              "machine2_test_amount",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 2 MEDICINE */}

                          <td className="text-end fw-semibold">

                            ₹{" "}

                            {getValue(
                              report,
                              "machine2MedicineAmount",
                              "machine2_medicine_amount",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 2 TOTAL */}

                          <td className="text-end fw-bold">

                            ₹{" "}

                            {getValue(
                              report,
                              "machine2TotalAmount",
                              "machine2_total_amount",
                              "0"
                            )}

                          </td>

                          {/* MACHINE 2 CAMP */}

                          <td>

                            {getValue(
                              report,
                              "machine2CampName",
                              "machine2_camp_name"
                            )}

                          </td>

                          {/* UTR */}

                          <td>

                            {getValue(
                              report,
                              "utrNumber",
                              "utr_number"
                            )}

                          </td>

                          {/* ADDITIONAL REMARKS */}

                          <td
                            style={{
                              whiteSpace:
                                "normal",
                              minWidth:
                                "250px",
                              maxWidth:
                                "400px"
                            }}
                          >

                            {getValue(
                              report,
                              "additionalRemarks",
                              "additional_remarks"
                            )}

                          </td>

                          {/* MACHINE 1 PHOTO */}

                          <td className="text-center">

                            {machine1Photo ? (

                              <a
                                href={
                                  machine1Photo
                                }
                                target="_blank"
                                rel="noreferrer"
                              >

                                <img
                                  src={
                                    machine1Photo
                                  }
                                  alt="Machine 1 Camp"
                                  loading="lazy"
                                  className="report-photo"
                                  onError={(e) => {

                                    e.currentTarget.style.display =
                                      "none";

                                  }}
                                />

                              </a>

                            ) : (

                              "-"

                            )}

                          </td>

                          {/* MACHINE 2 PHOTO */}

                          <td className="text-center">

                            {machine2Photo ? (

                              <a
                                href={
                                  machine2Photo
                                }
                                target="_blank"
                                rel="noreferrer"
                              >

                                <img
                                  src={
                                    machine2Photo
                                  }
                                  alt="Machine 2 Camp"
                                  loading="lazy"
                                  className="report-photo"
                                  onError={(e) => {

                                    e.currentTarget.style.display =
                                      "none";

                                  }}
                                />

                              </a>

                            ) : (

                              "-"

                            )}

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className="
                                badge
                                bg-success-subtle
                                text-success
                              "
                            >

                              {getValue(
                                report,
                                "status",
                                "status",
                                "Active"
                              )}

                            </span>

                          </td>

                        </tr>

                      );

                    }
                  )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          totalPages > 1 && (

            <div
              className="
                card-footer
                bg-white
                border-top
                py-3
              "
            >

              <div
                className="
                  d-flex
                  justify-content-between
                  align-items-center
                  flex-wrap
                  gap-3
                "
              >

                <small className="text-muted">

                  Page{" "}

                  <strong>
                    {currentPage}
                  </strong>

                  {" "}of{" "}

                  <strong>
                    {totalPages}
                  </strong>

                </small>

                <ul
                  className="
                    pagination
                    pagination-sm
                    mb-0
                  "
                >

                  {/* PREVIOUS */}

                  <li
                    className={`
                      page-item
                      ${
                        currentPage === 1
                          ? "disabled"
                          : ""
                      }
                    `}
                  >

                    <button
                      className="page-link"
                      onClick={() =>
                        goToPage(
                          currentPage - 1
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                    >
                      Previous
                    </button>

                  </li>

                  {/* PAGE NUMBERS */}

                  {getPageNumbers().map(
                    (page, index) => {

                      if (
                        page === "..."
                      ) {

                        return (

                          <li
                            key={
                              `dots-${index}`
                            }
                            className="
                              page-item
                              disabled
                            "
                          >

                            <span className="page-link">
                              ...
                            </span>

                          </li>

                        );

                      }

                      return (

                        <li
                          key={page}
                          className={`
                            page-item
                            ${
                              currentPage ===
                              page
                                ? "active"
                                : ""
                            }
                          `}
                        >

                          <button
                            className="page-link"
                            onClick={() =>
                              goToPage(page)
                            }
                          >
                            {page}
                          </button>

                        </li>

                      );

                    }
                  )}

                  {/* NEXT */}

                  <li
                    className={`
                      page-item
                      ${
                        currentPage ===
                        totalPages
                          ? "disabled"
                          : ""
                      }
                    `}
                  >

                    <button
                      className="page-link"
                      onClick={() =>
                        goToPage(
                          currentPage + 1
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                    >
                      Next
                    </button>

                  </li>

                </ul>

              </div>

            </div>

          )}

      </div>

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        /* ================================================
           PAGE
        ================================================ */

        .district-report-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }

        /* ================================================
           TABLE SCROLL
        ================================================ */

        .district-report-table {
          width: 100%;
          max-width: 100%;

          overflow-x: auto;
          overflow-y: auto;

          max-height:
            calc(100vh - 360px);

          -webkit-overflow-scrolling:
            touch;
        }

        /* ================================================
           TABLE WIDTH
        ================================================ */

        .district-report-table table {

          width: max-content;

          min-width:
            3500px;

          margin: 0;

          table-layout:
            auto;
        }

        /* ================================================
           TABLE CELLS
        ================================================ */

        .district-report-table th,
        .district-report-table td {

          white-space:
            nowrap;

          font-size:
            13px;

          padding:
            10px 14px;

          vertical-align:
            middle;
        }

        /* ================================================
           HEADER
        ================================================ */

        .district-report-table thead th {

          position:
            sticky;

          top:
            0;

          z-index:
            10;

          background:
            #f8f9fa;

          font-weight:
            700;

          border-bottom:
            2px solid #dee2e6;
        }

        /* ================================================
           ROW
        ================================================ */

        .district-report-table tbody tr {

          min-height:
            75px;
        }

        /* ================================================
           PHOTOS
        ================================================ */

        .report-photo {

          width:
            65px;

          height:
            65px;

          object-fit:
            cover;

          border-radius:
            7px;

          border:
            1px solid #dee2e6;

          display:
            block;

          margin:
            auto;
        }

        /* ================================================
           HORIZONTAL SCROLLBAR
        ================================================ */

        .district-report-table::-webkit-scrollbar {

          width:
            10px;

          height:
            13px;
        }

        .district-report-table::-webkit-scrollbar-track {

          background:
            #f1f3f5;
        }

        .district-report-table::-webkit-scrollbar-thumb {

          background:
            #6c757d;

          border-radius:
            10px;
        }

        .district-report-table::-webkit-scrollbar-thumb:hover {

          background:
            #343a40;
        }

        /* ================================================
           PAGINATION
        ================================================ */

        .pagination {

          gap:
            3px;
        }

        .pagination .page-link {

          min-width:
            35px;

          height:
            35px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          font-size:
            12px;

          color:
            #212529;

          border-radius:
            5px !important;
        }

        .pagination .page-item.active .page-link {

          background:
            #212529;

          border-color:
            #212529;

          color:
            #fff;
        }

        .pagination .page-link:hover {

          background:
            #e9ecef;

          color:
            #212529;
        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 767px) {

          .district-report-table {

            max-height:
              calc(100vh - 420px);
          }

          .district-report-table table {

            min-width:
              3500px;
          }

          .district-report-table th,
          .district-report-table td {

            font-size:
              12px;

            padding:
              8px 10px;
          }

          .report-photo {

            width:
              55px;

            height:
              55px;
          }

        }

      `}</style>

    </div>
  );
};

// =========================================================
// EXPORT
// =========================================================

export default DistrictReport;