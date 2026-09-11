import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Spinner, Modal } from "react-bootstrap";
import { API_BASE_URL as ROOT_API_URL, BACKEND_ROOT_URL } from "../../../config/api";

// =====================================================
// API
// =====================================================

const BACKEND_BASE_URL = BACKEND_ROOT_URL;

const API_BASE_URL =
    `${ROOT_API_URL}/vibhag-reports`;

// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (date) => {
    if (!date) return "-";

    const value = String(date).substring(0, 10);

    const parts = value.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

// =====================================================
// GET VALUE
// =====================================================

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

// =====================================================
// PHOTO URL
// =====================================================

const getPhotoUrl = (photo) => {
    if (!photo) {
        return "";
    }

    const photoString = String(photo).trim();

    if (!photoString) {
        return "";
    }

    if (
        photoString.startsWith("http://") ||
        photoString.startsWith("https://")
    ) {
        return photoString;
    }

    if (
        photoString.startsWith("/uploads/")
    ) {
        return `${BACKEND_BASE_URL}${photoString}`;
    }

    if (
        photoString.includes("vibhag-reports/")
    ) {
        return `${BACKEND_BASE_URL}/uploads/${photoString.replace(
            /^\/+/,
            ""
        )}`;
    }

    return `${BACKEND_BASE_URL}/uploads/vibhag-reports/${encodeURIComponent(
        photoString
    )}`;
};

// =====================================================
// COMPONENT
// =====================================================

const VibhagReport = () => {

    // =================================================
    // STATE
    // =================================================

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =================================================
    // FILTERS
    // =================================================

    const [filters, setFilters] = useState({
        name: "",
        taluka: "",
        district: "",
        report_date: "",
    });

    const [search, setSearch] = useState("");

    // =================================================
    // PAGINATION
    // =================================================

    const RECORDS_PER_PAGE = 20;

    const [currentPage, setCurrentPage] =
        useState(1);

    // =================================================
    // IMAGE MODAL
    // =================================================

    const [showImageModal, setShowImageModal] =
        useState(false);

    const [selectedImage, setSelectedImage] =
        useState("");

    const [selectedImageTitle, setSelectedImageTitle] =
        useState("");

    // =================================================
    // LOAD REPORTS
    // =================================================

    const loadReports = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(API_BASE_URL, {
                    method: "GET",
                    headers: {
                        Accept:
                            "application/json",
                    },
                    cache: "no-store",
                });

            const data =
                await response.json();

            console.log(
                "VIBHAG REPORT API:",
                data
            );

            if (
                !response.ok ||
                data.success === false
            ) {
                throw new Error(
                    data.message ||
                    "Failed to load Vibhag reports"
                );
            }

            const rows =
                Array.isArray(data.reports)
                    ? data.reports
                    : Array.isArray(data.data)
                    ? data.data
                    : [];

            setReports(rows);

        } catch (err) {

            console.error(
                "VIBHAG REPORT ERROR:",
                err
            );

            setError(
                err.message ||
                "Unable to load Vibhag reports."
            );

            setReports([]);

        } finally {

            setLoading(false);

        }
    };

    // =================================================
    // INITIAL LOAD
    // =================================================

    useEffect(() => {
        loadReports();
    }, []);

    // =================================================
    // REFRESH
    // =================================================

    const handleRefresh = async () => {

        setError("");
        setSuccess("");

        await loadReports();

        setCurrentPage(1);

        setSuccess(
            "Vibhag reports refreshed successfully."
        );
    };

    // =================================================
    // FILTER CHANGE
    // =================================================

    const handleFilterChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =================================================
    // FILTER REPORTS
    // =================================================

    const filteredReports = useMemo(() => {

        const globalSearch =
            search
                .trim()
                .toLowerCase();

        const nameSearch =
            filters.name
                .trim()
                .toLowerCase();

        const talukaSearch =
            filters.taluka
                .trim()
                .toLowerCase();

        const districtSearch =
            filters.district
                .trim()
                .toLowerCase();

        const dateSearch =
            filters.report_date.trim();

        return reports.filter((report) => {

            const name =
                String(
                    getValue(
                        report,
                        "name",
                        "name",
                        ""
                    )
                ).toLowerCase();

            const designation =
                String(
                    getValue(
                        report,
                        "designation",
                        "designation",
                        ""
                    )
                ).toLowerCase();

            const taluka =
                String(
                    getValue(
                        report,
                        "taluka",
                        "taluka",
                        ""
                    )
                ).toLowerCase();

            const district =
                String(
                    getValue(
                        report,
                        "district",
                        "district",
                        ""
                    )
                ).toLowerCase();

            const mobile =
                String(
                    getValue(
                        report,
                        "mobileNumber",
                        "mobile_number",
                        ""
                    )
                ).toLowerCase();

            const utr =
                String(
                    getValue(
                        report,
                        "utr_number",
                        "utrNumber",
                        ""
                    )
                ).toLowerCase();

            const reportDate =
                String(
                    getValue(
                        report,
                        "report_date",
                        "reportDate",
                        ""
                    )
                ).substring(0, 10);

            // =========================================
            // GLOBAL SEARCH
            // =========================================

            const globalMatch =
                !globalSearch ||
                name.includes(globalSearch) ||
                designation.includes(globalSearch) ||
                taluka.includes(globalSearch) ||
                district.includes(globalSearch) ||
                mobile.includes(globalSearch) ||
                utr.includes(globalSearch) ||
                reportDate.includes(
                    globalSearch
                );

            // =========================================
            // NAME
            // =========================================

            const nameMatch =
                !nameSearch ||
                name.includes(nameSearch);

            // =========================================
            // TALUKA
            // =========================================

            const talukaMatch =
                !talukaSearch ||
                taluka.includes(talukaSearch);

            // =========================================
            // DISTRICT
            // =========================================

            const districtMatch =
                !districtSearch ||
                district.includes(
                    districtSearch
                );

            // =========================================
            // DATE
            // =========================================

            const dateMatch =
                !dateSearch ||
                reportDate === dateSearch;

            return (
                globalMatch &&
                nameMatch &&
                talukaMatch &&
                districtMatch &&
                dateMatch
            );
        });

    }, [
        reports,
        search,
        filters,
    ]);

    // =================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        filters,
    ]);

    // =================================================
    // PAGINATION
    // =================================================

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

    // =================================================
    // PAGE FIX
    // =================================================

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
        currentPage,
    ]);

    // =================================================
    // PAGE NUMBERS
    // =================================================

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

    // =================================================
    // GO TO PAGE
    // =================================================

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
            behavior: "smooth",
        });
    };

    // =================================================
    // CLEAR FILTERS
    // =================================================

    const clearFilters = () => {

        setSearch("");

        setFilters({
            name: "",
            taluka: "",
            district: "",
            report_date: "",
        });

        setCurrentPage(1);
    };

    // =================================================
    // FILTER ACTIVE
    // =================================================

    const isFilterActive =
        search.trim() !== "" ||
        filters.name.trim() !== "" ||
        filters.taluka.trim() !== "" ||
        filters.district.trim() !== "" ||
        filters.report_date !== "";

    // =================================================
    // EXCEL / CSV DOWNLOAD
    // =================================================

    const downloadCSV = () => {

        if (
            filteredReports.length === 0
        ) {

            setError(
                "Download करण्यासाठी कोणताही report उपलब्ध नाही."
            );

            return;
        }

        setError("");
        setSuccess("");

        const headers = [
            "SR",
            "Name",
            "Designation",
            "Taluka",
            "District",
            "Mobile Number",
            "Report Date",
            "Total Authorised Center Heads",
            "Total Active Center Heads",
            "Today's Visited Center Heads Name",
            "Total Sanitary Pads Box Sold Today",
            "Total Amount From Sanitary Pad Box Sales Today",
            "UTR Number",
            "Additional Remarks",
            "Meeting Photo 1",
            "Meeting Photo 2",
            "Status",
        ];

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
                            "report_date",
                            "reportDate",
                            ""
                        )
                    ),

                    getValue(
                        report,
                        "total_authorised_center_heads",
                        "totalAuthorisedCenterHeads",
                        getValue(
                            report,
                            "total_center_heads",
                            "totalCenterHeads",
                            "0"
                        )
                    ),

                    getValue(
                        report,
                        "total_active_center_heads",
                        "totalActiveCenterHeads",
                        "0"
                    ),

                    getValue(
                        report,
                        "visited_center_heads_names",
                        "names_of_center_heads_visited_today",
                        getValue(
                            report,
                            "visited_center_head_name",
                            "visitedCenterHeadName",
                            ""
                        )
                    ),

                    getValue(
                        report,
                        "total_sanitary_pads_box_sold_today",
                        "sanitary_pads_boxes_sold",
                        getValue(
                            report,
                            "sanitary_pad_box_sales",
                            "sanitaryPadBoxSales",
                            "0"
                        )
                    ),

                    getValue(
                        report,
                        "total_amount_from_sanitary_pad_box_sales_today",
                        "sanitary_pads_sales_amount",
                        getValue(
                            report,
                            "totalAmountFromSanitaryPadBoxSalesToday",
                            "0"
                        )
                    ),

                    getValue(
                        report,
                        "utr_number",
                        "utrNumber",
                        ""
                    ),

                    getValue(
                        report,
                        "additional_remarks",
                        "additionalRemarks",
                        getValue(
                            report,
                            "any_other_information",
                            "anyOtherInformation",
                            ""
                        )
                    ),

                    getPhotoUrl(
                        getValue(
                            report,
                            "meeting_photo_1",
                            "meetingPhoto1",
                            ""
                        )
                    ),

                    getPhotoUrl(
                        getValue(
                            report,
                            "meeting_photo_2",
                            "meetingPhoto2",
                            ""
                        )
                    ),

                    getValue(
                        report,
                        "status",
                        "status",
                        "active"
                    ),
                ]
            );

        const escapeCSV = (value) => {

            const stringValue =
                String(value ?? "");

            if (
                stringValue.includes(",") ||
                stringValue.includes('"') ||
                stringValue.includes("\n") ||
                stringValue.includes("\r")
            ) {
                return `"${stringValue.replace(
                    /"/g,
                    '""'
                )}"`;
            }

            return stringValue;
        };

        const csvContent = [
            headers
                .map(escapeCSV)
                .join(","),

            ...rows.map((row) =>
                row
                    .map(escapeCSV)
                    .join(",")
            ),
        ].join("\r\n");

        const blob = new Blob(
            [
                "\uFEFF",
                csvContent,
            ],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

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
            `vibhag-reports-${today}.csv`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setSuccess(
            `${filteredReports.length} records downloaded successfully.`
        );
    };

    // =================================================
    // VIEW PHOTO
    // =================================================

    const viewImage = (photo, title) => {

        const url = getPhotoUrl(photo);

        if (!url) {
            return;
        }

        setSelectedImage(url);
        setSelectedImageTitle(title);
        setShowImageModal(true);
    };

    // =================================================
    // RETURN
    // =================================================

    return (

        <div
            className="container-fluid px-0 trainer-page"
            style={{
                maxWidth: "100%",
                overflowX: "hidden",
            }}
        >

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

                    <h3
                        className="fw-bold mb-1"
                        style={{
                            fontSize:
                                "clamp(22px, 2vw, 30px)",
                        }}
                    >
                        Vibhag Reports
                    </h3>

                    <p className="text-muted mb-0">
                        Manage and view all Vibhag reports
                    </p>

                </div>

                <div
                    className="
                        d-flex
                        flex-wrap
                        gap-2
                    "
                >

                    <Button
                        variant="success"
                        onClick={downloadCSV}
                        disabled={
                            loading ||
                            filteredReports.length === 0
                        }
                        className="px-3"
                    >
                        ⬇ Download Excel
                    </Button>

                    <Button
                        variant="dark"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="px-3"
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
                            <>
                                ↻ Refresh
                            </>
                        )}

                    </Button>

                </div>

            </div>

            {/* =================================================
                ERROR
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

            {/* =================================================
                SUCCESS
            ================================================= */}

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
                TOTAL REPORT CARD
            ================================================= */}

            <div
                className="
                    card
                    border-0
                    shadow-sm
                    mb-4
                "
            >

                <div
                    className="
                        card-body
                        p-3
                        p-md-4
                    "
                >

                    <div
                        className="
                            d-flex
                            align-items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                bg-dark
                                text-white
                                rounded
                                d-flex
                                align-items-center
                                justify-content-center
                                fw-bold
                                flex-shrink-0
                            "
                            style={{
                                width: "60px",
                                height: "60px",
                                fontSize: "20px",
                            }}
                        >
                            {loading
                                ? "..."
                                : totalRecords}
                        </div>

                        <div>

                            <small
                                className="
                                    text-muted
                                    d-block
                                "
                            >
                                {isFilterActive
                                    ? "Filtered Vibhag Reports"
                                    : "Total Vibhag Reports"}
                            </small>

                            <h4
                                className="
                                    fw-bold
                                    mb-0
                                "
                            >
                                {loading
                                    ? "..."
                                    : totalRecords}
                            </h4>

                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div
                className="
                    card
                    border-0
                    shadow-sm
                    mb-4
                "
            >

                <div className="card-body">

                    <div
                        className="
                            row
                            g-3
                            align-items-end
                        "
                    >

                        {/* NAME */}

                        <div
                            className="
                                col-xl-3
                                col-lg-3
                                col-md-6
                                col-12
                            "
                        >

                            <label
                                className="
                                    form-label
                                    fw-semibold
                                    mb-1
                                "
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="
                                    form-control
                                    form-control-sm
                                "
                                placeholder="Search Name..."
                                value={
                                    filters.name
                                }
                                onChange={
                                    handleFilterChange
                                }
                            />

                        </div>

                        {/* TALUKA */}

                        <div
                            className="
                                col-xl-3
                                col-lg-3
                                col-md-6
                                col-12
                            "
                        >

                            <label
                                className="
                                    form-label
                                    fw-semibold
                                    mb-1
                                "
                            >
                                Taluka
                            </label>

                            <input
                                type="text"
                                name="taluka"
                                className="
                                    form-control
                                    form-control-sm
                                "
                                placeholder="Search Taluka..."
                                value={
                                    filters.taluka
                                }
                                onChange={
                                    handleFilterChange
                                }
                            />

                        </div>

                        {/* DISTRICT */}

                        <div
                            className="
                                col-xl-2
                                col-lg-2
                                col-md-6
                                col-12
                            "
                        >

                            <label
                                className="
                                    form-label
                                    fw-semibold
                                    mb-1
                                "
                            >
                                District
                            </label>

                            <input
                                type="text"
                                name="district"
                                className="
                                    form-control
                                    form-control-sm
                                "
                                placeholder="District..."
                                value={
                                    filters.district
                                }
                                onChange={
                                    handleFilterChange
                                }
                            />

                        </div>

                        {/* DATE */}

                        <div
                            className="
                                col-xl-2
                                col-lg-2
                                col-md-6
                                col-12
                            "
                        >

                            <label
                                className="
                                    form-label
                                    fw-semibold
                                    mb-1
                                "
                            >
                                Report Date
                            </label>

                            <input
                                type="date"
                                name="report_date"
                                className="
                                    form-control
                                    form-control-sm
                                "
                                value={
                                    filters.report_date
                                }
                                onChange={
                                    handleFilterChange
                                }
                            />

                        </div>

                        {/* CLEAR */}

                        <div
                            className="
                                col-xl-2
                                col-lg-2
                                col-md-12
                                col-12
                            "
                        >

                            <button
                                type="button"
                                className="
                                    btn
                                    btn-sm
                                    btn-dark
                                    w-100
                                "
                                onClick={
                                    clearFilters
                                }
                                disabled={
                                    !isFilterActive
                                }
                            >
                                Clear
                            </button>

                        </div>

                    </div>

                    {/* GLOBAL SEARCH */}

                    <div className="row mt-3">

                        <div className="col-12">

                            <label
                                className="
                                    form-label
                                    fw-semibold
                                    mb-1
                                "
                            >
                                Search
                            </label>

                          

                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="
                    card
                    border-0
                    shadow-sm
                "
            >

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
                            flex-column
                            flex-md-row
                            justify-content-between
                            align-items-start
                            align-items-md-center
                            gap-2
                        "
                    >

                        <div>

                            <h6
                                className="
                                    fw-bold
                                    mb-1
                                "
                            >
                                Vibhag Report List
                            </h6>

                            <small className="text-muted">

                                Showing{" "}

                                <strong>
                                    {totalRecords === 0
                                        ? 0
                                        : startIndex + 1}
                                </strong>

                                {" - "}

                                <strong>
                                    {Math.min(
                                        endIndex,
                                        totalRecords
                                    )}
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {totalRecords}
                                </strong>

                                {" "}records

                            </small>

                        </div>

                        <span
                            className="
                                badge
                                bg-dark
                            "
                        >
                            {totalRecords} Records
                        </span>

                    </div>

                </div>

                {/* TABLE */}

                <div className="card-body p-0">

                    <div className="trainer-table-scroll">

                        <table
                            className="
                                table
                                table-hover
                                table-bordered
                                align-middle
                                mb-0
                                trainer-report-table
                            "
                        >

                            {/* =================================================
                                TABLE HEAD
                            ================================================= */}

                            <thead
                                className="table-light"
                                style={{
                                    position:
                                        "sticky",
                                    top: 0,
                                    zIndex: 5,
                                }}
                            >

                                <tr>

                                    <th
                                        className="text-center"
                                        style={{
                                            width: "60px",
                                        }}
                                    >
                                        SR
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "180px",
                                        }}
                                    >
                                        Name (नाव)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "150px",
                                        }}
                                    >
                                        Designation (पद)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "130px",
                                        }}
                                    >
                                        Taluka (तालुका)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "130px",
                                        }}
                                    >
                                        District (जिल्हा)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "150px",
                                        }}
                                    >
                                        Mobile Number (मोबाईल क्रमांक)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "130px",
                                        }}
                                    >
                                        Report Date (अहवालाची तारीख)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "180px",
                                        }}
                                    >
                                        Total Authorised Center Head (अधिकृत केंद्र प्रमुखांची एकूण संख्या)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "170px",
                                        }}
                                    >
                                        Total Active Center Head (सक्रिय केंद्र प्रमुखांची एकूण संख्या)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "250px",
                                        }}
                                    >
                                        Today's Visited Center Heads Name (आज भेट दिलेल्या केंद्र प्रमुखांची नावे)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "180px",
                                        }}
                                    >
                                        Total Sanitary Pads Box Sold Today (आज विकलेले एकूण सॅनिटरी पॅड बॉक्स)
                                    </th>

                                    <th
                                        className="text-end"
                                        style={{
                                            minWidth: "200px",
                                        }}
                                    >
                                        Total Amount From Sanitary Pad Box Sales Today (आजच्या सॅनिटरी पॅड बॉक्स विक्रीतून एकूण रक्कम)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "160px",
                                        }}
                                    >
                                        UTR Number (युटीआर क्रमांक)
                                    </th>

                                    <th
                                        style={{
                                            minWidth: "280px",
                                        }}
                                    >
                                        Additional Remarks (इतर माहिती / शेरा)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "140px",
                                        }}
                                    >
                                        Meeting Photo 1 (बैठक फोटो १)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "140px",
                                        }}
                                    >
                                        Meeting Photo 2 (बैठक फोटो २)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "110px",
                                        }}
                                    >
                                        Status (स्थिती)
                                    </th>

                                    <th
                                        className="text-center"
                                        style={{
                                            minWidth: "120px",
                                        }}
                                    >
                                        Action (कृती)
                                    </th>

                                </tr>

                            </thead>

                            {/* =================================================
                                TABLE BODY
                            ================================================= */}

                            <tbody>

                                {/* LOADING */}

                                {loading && (

                                    <tr>

                                        <td
                                            colSpan="18"
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

                                            Loading Vibhag reports...

                                        </td>

                                    </tr>

                                )}

                                {/* NO DATA */}

                                {!loading &&
                                    filteredReports.length ===
                                        0 && (

                                        <tr>

                                            <td
                                                colSpan="18"
                                                className="
                                                    text-center
                                                    py-5
                                                    text-muted
                                                "
                                            >

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "35px",
                                                    }}
                                                >
                                                    🔍
                                                </div>

                                                <div
                                                    className="
                                                        fw-semibold
                                                        mt-2
                                                    "
                                                >
                                                    No Vibhag
                                                    Reports Found
                                                </div>

                                                <small>
                                                    {reports.length > 0
                                                        ? "No reports match the selected filters."
                                                        : "No reports returned by API."}
                                                </small>

                                                {isFilterActive && (

                                                    <div>

                                                        <Button
                                                            size="sm"
                                                            variant="dark"
                                                            className="mt-3"
                                                            onClick={
                                                                clearFilters
                                                            }
                                                        >
                                                            Clear Filters
                                                        </Button>

                                                    </div>

                                                )}

                                            </td>

                                        </tr>

                                    )}

                                {/* =================================================
                                    REPORT ROWS
                                ================================================= */}

                                {!loading &&
                                    currentReports.length >
                                        0 &&
                                    currentReports.map(
                                        (
                                            report,
                                            index
                                        ) => {

                                            const photo1 =
                                                getValue(
                                                    report,
                                                    "meeting_photo_1",
                                                    "meetingPhoto1",
                                                    ""
                                                );

                                            const photo2 =
                                                getValue(
                                                    report,
                                                    "meeting_photo_2",
                                                    "meetingPhoto2",
                                                    ""
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        report.id ||
                                                        `${index}-${report.name}`
                                                    }
                                                >

                                                    {/* SR */}

                                                    <td
                                                        className="
                                                            text-center
                                                        "
                                                    >
                                                        {startIndex +
                                                            index +
                                                            1}
                                                    </td>

                                                    {/* NAME */}

                                                    <td
                                                        className="
                                                            fw-semibold
                                                        "
                                                    >
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
                                                            "mobile_number",
                                                            "mobileNumber"
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

                                                    {/* AUTHORISED */}

                                                    <td
                                                        className="
                                                            text-center
                                                            fw-semibold
                                                        "
                                                    >
                                                        {getValue(
                                                            report,
                                                            "totalAuthorisedCenterHeads",
                                                            "total_authorised_center_heads",
                                                            getValue(
                                                                report,
                                                                "totalCenterHeads",
                                                                "total_center_heads",
                                                                "0"
                                                            )
                                                        )}
                                                    </td>

                                                    {/* ACTIVE */}

                                                    <td
                                                        className="
                                                            text-center
                                                            fw-semibold
                                                        "
                                                    >
                                                        {getValue(
                                                            report,
                                                            "totalActiveCenterHeads",
                                                            "total_active_center_heads",
                                                            "0"
                                                        )}
                                                    </td>

                                                    {/* TODAY VISITED CENTER HEADS NAME */}

                                                    <td className="report-long-text">
                                                        {getValue(
                                                            report,
                                                            "visited_center_heads_names",
                                                            "names_of_center_heads_visited_today",
                                                            getValue(
                                                                report,
                                                                "visitedCenterHeadName",
                                                                "visited_center_head_name",
                                                                "-"
                                                            )
                                                        )}
                                                    </td>

                                                    {/* SANITARY BOX SOLD */}

                                                    <td
                                                        className="
                                                            text-center
                                                            fw-semibold
                                                        "
                                                    >
                                                        {getValue(
                                                            report,
                                                            "totalSanitaryPadsBoxSoldToday",
                                                            "total_sanitary_pads_box_sold_today",
                                                            getValue(
                                                                report,
                                                                "sanitary_pads_boxes_sold",
                                                                "sanitary_pad_box_sales",
                                                                "0"
                                                            )
                                                        )}
                                                    </td>

                                                    {/* SANITARY SALES AMOUNT */}

                                                    <td className="text-end fw-semibold">
                                                        ₹ {getValue(
                                                            report,
                                                            "totalAmountFromSanitaryPadBoxSalesToday",
                                                            "total_amount_from_sanitary_pad_box_sales_today",
                                                            getValue(
                                                                report,
                                                                "sanitary_pads_sales_amount",
                                                                "0.00"
                                                            )
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

                                                    {/* REMARKS */}

                                                    <td className="report-long-text">
                                                        {getValue(
                                                            report,
                                                            "additionalRemarks",
                                                            "additional_remarks",
                                                            getValue(
                                                                report,
                                                                "anyOtherInformation",
                                                                "any_other_information",
                                                                "-"
                                                            )
                                                        )}
                                                    </td>

                                                    {/* PHOTO 1 */}

                                                    <td className="text-center">

                                                        {getPhotoUrl(photo1) ? (

                                                            <div>

                                                                <img
                                                                    src={getPhotoUrl(photo1)}
                                                                    alt="Meeting Photo 1"
                                                                    className="trainer-report-photo"
                                                                    onClick={() =>
                                                                        viewImage(
                                                                            photo1,
                                                                            "Meeting Photo 1"
                                                                        )
                                                                    }
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                    }}
                                                                />

                                                                <div className="mt-1">

                                                                    <Button
                                                                        size="sm"
                                                                        variant="link"
                                                                        className="p-0"
                                                                        onClick={() =>
                                                                            viewImage(
                                                                                photo1,
                                                                                "Meeting Photo 1"
                                                                            )
                                                                        }
                                                                    >
                                                                        View
                                                                    </Button>

                                                                </div>

                                                            </div>

                                                        ) : (
                                                            <span className="text-muted">
                                                                -
                                                            </span>
                                                        )}

                                                    </td>

                                                    {/* PHOTO 2 */}

                                                    <td className="text-center">

                                                        {getPhotoUrl(photo2) ? (

                                                            <div>

                                                                <img
                                                                    src={getPhotoUrl(photo2)}
                                                                    alt="Meeting Photo 2"
                                                                    className="trainer-report-photo"
                                                                    onClick={() =>
                                                                        viewImage(
                                                                            photo2,
                                                                            "Meeting Photo 2"
                                                                        )
                                                                    }
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                    }}
                                                                />

                                                                <div className="mt-1">

                                                                    <Button
                                                                        size="sm"
                                                                        variant="link"
                                                                        className="p-0"
                                                                        onClick={() =>
                                                                            viewImage(
                                                                                photo2,
                                                                                "Meeting Photo 2"
                                                                            )
                                                                        }
                                                                    >
                                                                        View
                                                                    </Button>

                                                                </div>

                                                            </div>

                                                        ) : (
                                                            <span className="text-muted">
                                                                -
                                                            </span>
                                                        )}

                                                    </td>

                                                    {/* STATUS */}

                                                    <td
                                                        className="
                                                            text-center
                                                        "
                                                    >

                                                        <span
                                                            className="
                                                                badge
                                                                bg-success
                                                            "
                                                        >
                                                            {getValue(
                                                                report,
                                                                "status",
                                                                "status",
                                                                "active"
                                                            )}
                                                        </span>

                                                    </td>

                                                    {/* ACTION */}

                                                    <td
                                                        className="
                                                            text-center
                                                        "
                                                    >

                                                        <Button
                                                            size="sm"
                                                            variant="outline-dark"
                                                            onClick={() =>
                                                                viewImage(
                                                                    photo1,
                                                                    "Meeting Photo 1"
                                                                )
                                                            }
                                                            disabled={!getPhotoUrl(photo1)}
                                                        >
                                                            View
                                                        </Button>

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
                                px-3
                                py-3
                            "
                        >

                            <div
                                className="
                                    d-flex
                                    flex-column
                                    flex-md-row
                                    justify-content-between
                                    align-items-center
                                    gap-3
                                "
                            >

                                <div>

                                    <small
                                        className="
                                            text-muted
                                        "
                                    >

                                        Page{" "}

                                        <strong>
                                            {currentPage}
                                        </strong>

                                        {" "}of{" "}

                                        <strong>
                                            {totalPages}
                                        </strong>

                                    </small>

                                </div>

                                <nav>

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
                                                type="button"
                                                className="
                                                    page-link
                                                "
                                                onClick={() =>
                                                    goToPage(
                                                        currentPage -
                                                            1
                                                    )
                                                }
                                                disabled={
                                                    currentPage ===
                                                    1
                                                }
                                            >
                                                Previous
                                            </button>

                                        </li>

                                        {/* NUMBERS */}

                                        {getPageNumbers().map(
                                            (
                                                page,
                                                index
                                            ) => {

                                                if (
                                                    page ===
                                                    "..."
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

                                                            <span
                                                                className="
                                                                    page-link
                                                                "
                                                            >
                                                                ...
                                                            </span>

                                                        </li>

                                                    );
                                                }

                                                return (

                                                    <li
                                                        key={
                                                            page
                                                        }
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
                                                            type="button"
                                                            className="
                                                                page-link
                                                            "
                                                            onClick={() =>
                                                                goToPage(
                                                                    page
                                                                )
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
                                                type="button"
                                                className="
                                                    page-link
                                                "
                                                onClick={() =>
                                                    goToPage(
                                                        currentPage +
                                                            1
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

                                </nav>

                            </div>

                        </div>

                    )}

            </div>

            {/* =================================================
                CSS
            ================================================= */}

                {/* =================================================
                    IMAGE MODAL
                ================================================= */}

                <Modal
                    show={showImageModal}
                    onHide={() =>
                        setShowImageModal(false)
                    }
                    centered
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {selectedImageTitle}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="text-center">
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt={selectedImageTitle}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "70vh",
                                    objectFit: "contain",
                                }}
                            />
                        )}
                    </Modal.Body>
                </Modal>

            <style>{`
                .trainer-page {
                    width: 100%;
                    min-width: 0;
                }

                .trainer-table-scroll {
                    width: 100%;
                    max-width: 100%;
                    max-height: calc(100vh - 390px);
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    -webkit-overflow-scrolling: touch;
                    position: relative;
                    scrollbar-width: auto;
                }

                .trainer-report-table {
                    width: max-content !important;
                    min-width: 2600px !important;
                    margin: 0 !important;
                    border-collapse: collapse;
                    table-layout: auto;
                }

                .trainer-report-table th,
                .trainer-report-table td {
                    white-space: nowrap !important;
                    font-size: 12px !important;
                    padding: 9px 10px !important;
                    vertical-align: middle !important;
                    border: 1px solid #dee2e6 !important;
                    line-height: 1.4;
                }

                .trainer-report-table thead th {
                    position: sticky !important;
                    top: 0 !important;
                    z-index: 20 !important;
                    background: #f8f9fa !important;
                    color: #212529 !important;
                    font-weight: 700 !important;
                    line-height: 1.35;
                    box-shadow: inset 0 -1px 0 #dee2e6;
                }

                .trainer-report-table tbody td {
                    background: #fff;
                }

                .trainer-report-table tbody tr:hover td {
                    background: #f8f9fa !important;
                }

                .trainer-report-table th:nth-child(1),
                .trainer-report-table td:nth-child(1) {
                    min-width: 60px;
                    width: 60px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(2),
                .trainer-report-table td:nth-child(2) {
                    min-width: 180px;
                }

                .trainer-report-table th:nth-child(3),
                .trainer-report-table td:nth-child(3) {
                    min-width: 150px;
                }

                .trainer-report-table th:nth-child(4),
                .trainer-report-table td:nth-child(4),
                .trainer-report-table th:nth-child(5),
                .trainer-report-table td:nth-child(5) {
                    min-width: 130px;
                }

                .trainer-report-table th:nth-child(6),
                .trainer-report-table td:nth-child(6) {
                    min-width: 150px;
                }

                .trainer-report-table th:nth-child(7),
                .trainer-report-table td:nth-child(7) {
                    min-width: 130px;
                }

                .trainer-report-table th:nth-child(8),
                .trainer-report-table td:nth-child(8) {
                    min-width: 180px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(9),
                .trainer-report-table td:nth-child(9) {
                    min-width: 170px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(10),
                .trainer-report-table td:nth-child(10) {
                    min-width: 250px;
                }

                .trainer-report-table th:nth-child(11),
                .trainer-report-table td:nth-child(11) {
                    min-width: 180px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(12),
                .trainer-report-table td:nth-child(12) {
                    min-width: 200px;
                    text-align: right;
                }

                .trainer-report-table th:nth-child(13),
                .trainer-report-table td:nth-child(13) {
                    min-width: 160px;
                }

                .trainer-report-table th:nth-child(14),
                .trainer-report-table td:nth-child(14) {
                    min-width: 280px;
                }

                .trainer-report-table th:nth-child(15),
                .trainer-report-table td:nth-child(15),
                .trainer-report-table th:nth-child(16),
                .trainer-report-table td:nth-child(16) {
                    min-width: 140px;
                    width: 140px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(17),
                .trainer-report-table td:nth-child(17) {
                    min-width: 110px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(18),
                .trainer-report-table td:nth-child(18) {
                    min-width: 120px;
                    text-align: center;
                }

                .report-long-text {
                    white-space: normal !important;
                    min-width: 320px;
                    max-width: 550px;
                    line-height: 1.5 !important;
                    word-break: break-word;
                }

                .trainer-report-photo {
                    width: 90px;
                    height: 70px;
                    object-fit: cover;
                    display: block;
                    margin: 0 auto;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    background: #f8f9fa;
                    cursor: pointer;
                    transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease;
                }

                .trainer-report-photo:hover {
                    transform: scale(1.04);
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
                }

                .trainer-table-scroll::-webkit-scrollbar {
                    width: 8px;
                    height: 10px;
                }

                .trainer-table-scroll::-webkit-scrollbar-track {
                    background: #f1f3f5;
                    border-radius: 10px;
                }

                .trainer-table-scroll::-webkit-scrollbar-thumb {
                    background: #adb5bd;
                    border-radius: 10px;
                    border: 2px solid #f1f3f5;
                }

                .trainer-table-scroll::-webkit-scrollbar-thumb:hover {
                    background: #6c757d;
                }

                .pagination {
                    gap: 3px;
                }

                .pagination .page-link {
                    min-width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    color: #212529;
                    border-radius: 5px !important;
                }

                .pagination .page-item.active .page-link {
                    background-color: #212529;
                    border-color: #212529;
                    color: #fff;
                }

                .pagination .page-link:hover {
                    background-color: #e9ecef;
                    color: #212529;
                }

                .pagination .page-item.active .page-link:hover {
                    background-color: #212529;
                    border-color: #212529;
                    color: #fff;
                }

                .modal-dialog {
                    max-width: 1200px;
                }

                .modal-content {
                    border: 0;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .modal-body {
                    background: #fff;
                }

                @media (max-width: 992px) {
                    .trainer-table-scroll {
                        max-height: calc(100vh - 410px);
                    }

                    .trainer-report-table th,
                    .trainer-report-table td {
                        font-size: 11.5px !important;
                        padding: 8px 9px !important;
                    }
                }

                @media (max-width: 768px) {
                    .trainer-table-scroll {
                        max-height: calc(100vh - 430px);
                    }

                    .trainer-report-table {
                        min-width: 3300px !important;
                    }

                    .trainer-report-table th,
                    .trainer-report-table td {
                        font-size: 11px !important;
                        padding: 8px !important;
                    }

                    .trainer-report-photo {
                        width: 80px;
                        height: 65px;
                    }

                    .modal-dialog {
                        margin: 8px;
                    }

                    .modal-body {
                        padding: 16px;
                    }
                }

                @media (max-width: 576px) {
                    .trainer-table-scroll {
                        max-height: calc(100vh - 460px);
                    }

                    .trainer-report-table {
                        min-width: 3300px !important;
                    }

                    .trainer-report-table th,
                    .trainer-report-table td {
                        font-size: 10.5px !important;
                        padding: 7px 8px !important;
                    }

                    .trainer-report-table thead th {
                        font-size: 10.5px !important;
                    }
                }
            `}</style>

        </div>
    );
};

export default VibhagReport;