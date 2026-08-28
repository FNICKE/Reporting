import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Spinner,
    Modal,
    Form,
    Row,
    Col,
} from "react-bootstrap";
import { API_BASE_URL as ROOT_API_URL, BACKEND_ROOT_URL } from "../../../config/api";

// =====================================================
// API
// =====================================================

const API_BASE_URL =
    `${ROOT_API_URL}/taluka-reports`;

const BACKEND_URL =
    `${BACKEND_ROOT_URL}/`;

// =====================================================
// DATE FORMAT FOR DISPLAY
// =====================================================

const formatDate = (date) => {
    if (!date) return "-";

    const value = String(date);

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-");
        return `${day}-${month}-${year}`;
    }

    // YYYY-MM-DDTHH...
    if (value.includes("T")) {
        const datePart = value.split("T")[0];

        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            const [year, month, day] = datePart.split("-");
            return `${day}-${month}-${year}`;
        }
    }

    return value;
};

// =====================================================
// DATE FORMAT FOR INPUT
// =====================================================

const formatDateForInput = (date) => {
    if (!date) return "";

    const value = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    if (value.includes("T")) {
        return value.split("T")[0];
    }

    return "";
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

    return (
        value !== null &&
        value !== undefined &&
        value !== ""
    )
        ? value
        : defaultValue;
};

// =====================================================
// IMAGE URL
// =====================================================

const getImageUrl = (fileName) => {
    if (!fileName) {
        return "";
    }

    const value =
        String(fileName).trim();

    if (!value) {
        return "";
    }

    // Already full URL
    if (
        value.startsWith("http://") ||
        value.startsWith("https://")
    ) {
        return value;
    }

    // /uploads/...
    if (value.startsWith("/uploads/")) {
        return `${BACKEND_URL}${value}`;
    }

    // /...
    if (value.startsWith("/")) {
        return `${BACKEND_URL}${value}`;
    }

    // Normal file name
    return `${BACKEND_URL}/uploads/taluka-reports/${value}`;
};

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
        name: "",
        designation: "",
        taluka: "",
        district: "",
        mobile_number: "",
        report_date: "",
        total_authorised_center_heads: "",
        total_active_center_heads: "",
        visited_center_heads_names: "",
        sanitary_pads_boxes_sold: "",
        sanitary_pads_sales_amount: "",
        utr_number: "",
        additional_remarks: "",
        meeting_photo_1: null,
        meeting_photo_2: null,
    };

    // =====================================================
    // COMPONENT
    // =====================================================

    const TalukaReport = () => {

        // =================================================
        // STATES
        // =================================================

        const [reports, setReports] =
            useState([]);

        const [loading, setLoading] =
            useState(true);

        const [saving, setSaving] =
            useState(false);

        const [deletingId, setDeletingId] =
            useState(null);

        const [error, setError] =
            useState("");

        const [success, setSuccess] =
            useState("");

        // =================================================
        // SEARCH FILTERS
        // =================================================

        const [nameFilter, setNameFilter] =
            useState("");

        const [dateFilter, setDateFilter] =
            useState("");

        const [talukaFilter, setTalukaFilter] =
            useState("");

        const [districtFilter, setDistrictFilter] =
            useState("");

        // =================================================
        // PAGINATION
        // =================================================

        const RECORDS_PER_PAGE = 20;

        const [currentPage, setCurrentPage] =
            useState(1);

        // =================================================
        // MODAL
        // =================================================

        const [showModal, setShowModal] =
            useState(false);

        const [editingId, setEditingId] =
            useState(null);

        const [form, setForm] =
            useState(emptyForm);

        const [existingPhoto1, setExistingPhoto1] =
            useState("");

        const [existingPhoto2, setExistingPhoto2] =
            useState("");

        const [photoPreview1, setPhotoPreview1] =
            useState("");

        const [photoPreview2, setPhotoPreview2] =
            useState("");

        // =================================================
        // LOAD REPORTS
        // =================================================

        const loadReports = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(API_BASE_URL);

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    data.success === false
                ) {
                    throw new Error(
                        data.message ||
                        "Failed to load Taluka reports"
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
                    "Taluka report loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load Taluka reports."
                );

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
        // FORM CHANGE
        // =================================================

        const handleChange = (e) => {

            const {
                name,
                value,
                files,
            } = e.target;

            // FILE
            if (files) {

                const file =
                    files[0] || null;

                setForm((prev) => ({
                    ...prev,
                    [name]: file,
                }));

                // PHOTO PREVIEW
                if (file) {

                    const preview =
                        URL.createObjectURL(
                            file
                        );

                    if (
                        name ===
                        "meeting_photo_1"
                    ) {
                        setPhotoPreview1(
                            preview
                        );
                    }

                    if (
                        name ===
                        "meeting_photo_2"
                    ) {
                        setPhotoPreview2(
                            preview
                        );
                    }
                }

                return;
            }

            // NORMAL INPUT
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        // =================================================
        // OPEN ADD MODAL
        // =================================================

        const handleAdd = () => {

            setEditingId(null);

            setForm({
                ...emptyForm,
            });

            setExistingPhoto1("");
            setExistingPhoto2("");

            setPhotoPreview1("");
            setPhotoPreview2("");

            setError("");

            setShowModal(true);
        };

        // =================================================
        // OPEN EDIT MODAL
        // =================================================

        const handleEdit = (report) => {

            const id =
                report.id;

            setEditingId(id);

            setForm({

                name:
                    report.name || "",

                designation:
                    report.designation || "",

                taluka:
                    report.taluka || "",

                district:
                    report.district || "",

                mobile_number:
                    report.mobile_number ||
                    report.mobileNumber ||
                    "",

                report_date:
                    formatDateForInput(
                        report.report_date ||
                        report.reportDate
                    ),

                total_authorised_center_heads:
                    report.total_authorised_center_heads ??
                    report.totalCenterHeads ??
                    "",

                total_active_center_heads:
                    report.total_active_center_heads ??
                    report.totalActiveCenterHeads ??
                    report.activeCenterHeads ??
                    "",

                visited_center_heads_names:
                    report.visited_center_heads_names ||
                    report.namesOfCenterHeadsVisitedToday ||
                    "",

                sanitary_pads_boxes_sold:
                    report.sanitary_pads_boxes_sold ??
                    report.totalSanitaryPadsBoxSoldToday ??
                    "",

                sanitary_pads_sales_amount:
                    report.sanitary_pads_sales_amount ??
                    report.totalAmountFromSanitaryPadBoxSalesToday ??
                    "",

                utr_number:
                    report.utr_number ||
                    report.utrNumber ||
                    "",

                additional_remarks:
                    report.additional_remarks ||
                    report.additionalRemarks ||
                    "",

                meeting_photo_1: null,

                meeting_photo_2: null,
            });

            // EXISTING PHOTO 1
            const photo1 =
                report.meeting_photo_1 ||
                report.meetingPhoto1 ||
                "";

            // EXISTING PHOTO 2
            const photo2 =
                report.meeting_photo_2 ||
                report.meetingPhoto2 ||
                "";

            setExistingPhoto1(
                getImageUrl(photo1)
            );

            setExistingPhoto2(
                getImageUrl(photo2)
            );

            setPhotoPreview1("");
            setPhotoPreview2("");

            setError("");

            setShowModal(true);
        };

        // =================================================
        // CLOSE MODAL
        // =================================================

        const handleCloseModal = () => {

            if (saving) {
                return;
            }

            setShowModal(false);

            setEditingId(null);

            setForm({
                ...emptyForm,
            });

            setExistingPhoto1("");
            setExistingPhoto2("");

            setPhotoPreview1("");
            setPhotoPreview2("");
        };

        // =================================================
        // SUBMIT
        // =================================================

        const handleSubmit = async (e) => {

            e.preventDefault();

            try {

                setSaving(true);
                setError("");
                setSuccess("");

                // BASIC VALIDATION

                if (!form.name.trim()) {
                    throw new Error(
                        "Name is required"
                    );
                }

                if (!form.designation.trim()) {
                    throw new Error(
                        "Designation is required"
                    );
                }

                if (!form.taluka.trim()) {
                    throw new Error(
                        "Taluka is required"
                    );
                }

                if (!form.district.trim()) {
                    throw new Error(
                        "District is required"
                    );
                }

                if (!form.mobile_number.trim()) {
                    throw new Error(
                        "Mobile number is required"
                    );
                }

                if (!form.report_date) {
                    throw new Error(
                        "Report date is required"
                    );
                }

                // FORMDATA

                const formData =
                    new FormData();

                formData.append(
                    "name",
                    form.name.trim()
                );

                formData.append(
                    "designation",
                    form.designation.trim()
                );

                formData.append(
                    "taluka",
                    form.taluka.trim()
                );

                formData.append(
                    "district",
                    form.district.trim()
                );

                formData.append(
                    "mobile_number",
                    form.mobile_number.trim()
                );

                formData.append(
                    "report_date",
                    form.report_date
                );

                formData.append(
                    "total_authorised_center_heads",
                    form.total_authorised_center_heads ||
                    "0"
                );

                formData.append(
                    "total_active_center_heads",
                    form.total_active_center_heads ||
                    "0"
                );

                formData.append(
                    "visited_center_heads_names",
                    form.visited_center_heads_names ||
                    ""
                );

                formData.append(
                    "sanitary_pads_boxes_sold",
                    form.sanitary_pads_boxes_sold ||
                    "0"
                );

                formData.append(
                    "sanitary_pads_sales_amount",
                    form.sanitary_pads_sales_amount ||
                    "0"
                );

                formData.append(
                    "utr_number",
                    form.utr_number ||
                    ""
                );

                formData.append(
                    "additional_remarks",
                    form.additional_remarks ||
                    ""
                );

                // IMAGE 1

                if (
                    form.meeting_photo_1
                ) {

                    formData.append(
                        "meeting_photo_1",
                        form.meeting_photo_1
                    );
                }

                // IMAGE 2

                if (
                    form.meeting_photo_2
                ) {

                    formData.append(
                        "meeting_photo_2",
                        form.meeting_photo_2
                    );
                }

                // URL

                const url = editingId
                    ? `${API_BASE_URL}/${editingId}`
                    : API_BASE_URL;

                const method = editingId
                    ? "PUT"
                    : "POST";

                const response =
                    await fetch(
                        url,
                        {
                            method,
                            body: formData,
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    data.success === false
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to save Taluka report"
                    );
                }

                setSuccess(
                    editingId
                        ? "Taluka report updated successfully."
                        : "Taluka report added successfully."
                );

                handleCloseModal();

                await loadReports();

            } catch (err) {

                console.error(
                    "SAVE TALUKA REPORT ERROR:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to save Taluka report."
                );

            } finally {
                setSaving(false);
            }
        };

        // =================================================
        // DELETE
        // =================================================

        const handleDelete = async (id) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this Taluka report?"
                );

            if (!confirmed) {
                return;
            }

            try {

                setDeletingId(id);
                setError("");
                setSuccess("");

                const response =
                    await fetch(
                        `${API_BASE_URL}/${id}`,
                        {
                            method: "DELETE",
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    data.success === false
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to delete report"
                    );
                }

                setSuccess(
                    "Taluka report deleted successfully."
                );

                await loadReports();

            } catch (err) {

                console.error(
                    "DELETE TALUKA REPORT ERROR:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to delete Taluka report."
                );

            } finally {
                setDeletingId(null);
            }
        };

        // =================================================
        // DOWNLOAD COMPLETE REPORT - NO PACKAGE REQUIRED
        // =================================================

        const handleDownloadExcel = () => {
            try {
                setError("");
                setSuccess("");

                if (!filteredReports || filteredReports.length === 0) {
                    setError("No Taluka reports available to download.");
                    return;
                }

                const headers = [
                    "SR",
                    "Name",
                    "Report Date",
                    "Total Authorised Center Heads",
                    "Total Active Center Heads",
                    "Center Head Visitor Today",
                    "Total Sanitary Pads Box Sold Today",
                    "Total Sanitary Pads Sales Amount",
                    "UTR Number",
                    "Additional Remarks",
                ];

                const rows = filteredReports.map((report, index) => {
                    const values = [
                        index + 1,
                        getValue(report, "name", "name", "-"),
                        formatDate(report.report_date || report.reportDate),
                        getValue(
                            report,
                            "totalCenterHeads",
                            "total_authorised_center_heads",
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
                            "namesOfCenterHeadsVisitedToday",
                            "visited_center_heads_names",
                            "-"
                        ),
                        getValue(
                            report,
                            "totalSanitaryPadsBoxSoldToday",
                            "sanitary_pads_boxes_sold",
                            "0"
                        ),
                        getValue(
                            report,
                            "totalAmountFromSanitaryPadBoxSalesToday",
                            "sanitary_pads_sales_amount",
                            "0"
                        ),
                        getValue(report, "utrNumber", "utr_number", "-"),
                        getValue(
                            report,
                            "additionalRemarks",
                            "additional_remarks",
                            "-"
                        ),
                    ];

                    return values.map((value) => {
                        const text = String(value ?? "");
                        return `"${text.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
                    }).join(",");
                });

                const csvContent = [
                    headers.join(","),
                    ...rows,
                ].join("\r\n");

                const blob = new Blob(
                    ["\uFEFF" + csvContent],
                    { type: "text/csv;charset=utf-8;" }
                );

                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;

                const today = new Date().toISOString().split("T")[0];
                link.download = `Taluka_Reports_${today}.csv`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(url);

                setSuccess(
                    `${filteredReports.length} Taluka report(s) downloaded successfully.`
                );
            } catch (err) {
                console.error("Download Report Error:", err);
                setError("Unable to download report.");
            }
        };

        // =================================================
        // FILTER
        // =================================================

        const filteredReports =
            reports.filter((report) => {

                // NAME
                const name =
                    String(
                        getValue(
                            report,
                            "name",
                            "name",
                            ""
                        )
                    ).toLowerCase();

                // REPORT DATE
                const reportDate =
                    report.report_date ||
                    report.reportDate ||
                    "";

                const normalizedDate =
                    String(reportDate)
                        .split("T")[0];

                // SEARCH NAME
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

                const taluka = String(
                    getValue(report, "taluka", "taluka", "")
                ).toLowerCase();

                const district = String(
                    getValue(report, "district", "district", "")
                ).toLowerCase();

                // NAME MATCH
                const nameMatch =
                    nameSearch === "" ||
                    name.includes(nameSearch);

                // DATE MATCH
                const dateMatch =
                    dateFilter === "" ||
                    normalizedDate === dateFilter;

                const talukaMatch =
                    talukaSearch === "" ||
                    taluka.includes(talukaSearch);

                const districtMatch =
                    districtSearch === "" ||
                    district.includes(districtSearch);

                return (
                    nameMatch &&
                    talukaMatch &&
                    districtMatch &&
                    dateMatch
                );
            });

        // =================================================
        // RESET PAGE WHEN FILTER CHANGES
        // =================================================

        useEffect(() => {
            setCurrentPage(1);
        }, [
            nameFilter,
            talukaFilter,
            districtFilter,
            dateFilter,
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
        // FIX CURRENT PAGE
        // =================================================

        useEffect(() => {

            if (
                totalPages > 0 &&
                currentPage > totalPages
            ) {
                setCurrentPage(
                    totalPages
                );
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
        // PAGE CHANGE
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
        // CLEAR FILTERS
        // =================================================

        const clearFilters = () => {

            setNameFilter("");
            setTalukaFilter("");
            setDistrictFilter("");
            setDateFilter("");
            setCurrentPage(1);
        };

        // =================================================
        // FILTER ACTIVE
        // =================================================

        const isFilterActive =
            nameFilter.trim() !== "" ||
            talukaFilter.trim() !== "" ||
            districtFilter.trim() !== "" ||
            dateFilter !== "";

        // =================================================
        // RENDER
        // =================================================

        return (

            <div
                className="container-fluid px-0"
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
                            Taluka Reports
                        </h3>

                        <p className="text-muted mb-0">
                            Manage and view all Taluka reports
                        </p>

                    </div>

                    <div
                        className="
                            d-flex
                            gap-2
                            flex-wrap
                        "
                    >

                        {/* DOWNLOAD EXCEL */}

                        <Button
                            variant="dark"
                            onClick={handleDownloadExcel}
                            disabled={
                                loading ||
                                filteredReports.length === 0
                            }
                        >
                            ↓ Download Excel
                        </Button>

                        {/* ADD */}

                        <Button
                            variant="dark"
                            onClick={handleAdd}
                        >
                            + Add Report
                        </Button>

                        {/* REFRESH */}

                        <Button
                            variant="outline-dark"
                            onClick={loadReports}
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />

                                    Loading
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
                    TOTAL CARD
                ================================================= */}

                <div
                    className="
                        card
                        border-0
                        shadow-sm
                        mb-4
                    "
                >

                    <div className="card-body p-4">

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
                                "
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    fontSize: "22px",
                                }}
                            >
                                {loading
                                    ? "..."
                                    : totalRecords}
                            </div>

                            <div>

                                <div className="text-muted">

                                    {isFilterActive
                                        ? "Filtered Taluka Reports"
                                        : "Total Taluka Reports"}

                                </div>

                                <h4 className="fw-bold mb-0">

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

                                <Form.Label
                                    className="
                                        fw-semibold
                                        mb-1
                                    "
                                >
                                    Name
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Search name..."
                                    value={nameFilter}
                                    onChange={(e) =>
                                        setNameFilter(
                                            e.target.value
                                        )
                                    }
                                    className="py-2"
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

                                <Form.Label
                                    className="
                                        fw-semibold
                                        mb-1
                                    "
                                >
                                    Taluka
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Search Taluka..."
                                    value={talukaFilter}
                                    onChange={(e) =>
                                        setTalukaFilter(
                                            e.target.value
                                        )
                                    }
                                    className="py-2"
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

                                <Form.Label
                                    className="
                                        fw-semibold
                                        mb-1
                                    "
                                >
                                    District
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="District..."
                                    value={districtFilter}
                                    onChange={(e) =>
                                        setDistrictFilter(
                                            e.target.value
                                        )
                                    }
                                    className="py-2"
                                />

                            </div>

                            {/* REPORT DATE */}

                            <div
                                className="
                                    col-xl-2
                                    col-lg-2
                                    col-md-6
                                    col-12
                                "
                            >

                                <Form.Label
                                    className="
                                        fw-semibold
                                        mb-1
                                    "
                                >
                                    Report Date
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(
                                            e.target.value
                                        )
                                    }
                                    className="py-2"
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

                                <Button
                                    variant="dark"
                                    className="w-100"
                                    onClick={
                                        clearFilters
                                    }
                                    disabled={
                                        !isFilterActive
                                    }
                                >
                                    Clear
                                </Button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="card border-0 shadow-sm">

                    {/* TABLE HEADER */}
                    <div className="card-header bg-white border-bottom py-3 px-3 px-md-4">

                        <div className="
                            d-flex
                            flex-column
                            flex-md-row
                            justify-content-between
                            align-items-start
                            align-items-md-center
                            gap-2
                        ">

                            <div>
                                <h6 className="fw-bold mb-1">
                                    Taluka Report List
                                </h6>

                                <small className="text-muted">
                                    Showing{" "}
                                    <strong>
                                        {totalRecords === 0 ? 0 : startIndex + 1}
                                    </strong>
                                    {" - "}
                                    <strong>
                                        {Math.min(endIndex, totalRecords)}
                                    </strong>
                                    {" "}of{" "}
                                    <strong>{totalRecords}</strong>
                                    {" "}records
                                </small>
                            </div>

                            <span className="badge bg-dark px-3 py-2">
                                {totalRecords} Records
                            </span>

                        </div>

                    </div>

                    {/* TABLE */}
                    <div className="card-body p-0">

                        <div className="taluka-report-table-wrapper">

                            <table className="
                                table
                                table-bordered
                                table-hover
                                align-middle
                                mb-0
                            ">

                                <thead>
                                    <tr>

                                        <th className="text-center">SR</th>

                                        <th>Name</th>

                                        <th>Designation</th>

                                        <th>Taluka</th>

                                        <th>District</th>

                                        <th>Mobile Number</th>

                                        <th>Report Date</th>

                                        <th className="text-center">
                                            Total Authorised Center Heads
                                        </th>

                                        <th className="text-center">
                                            Total Active Center Heads
                                        </th>

                                        <th>
                                            Today's Visited Center Heads Names
                                        </th>

                                        <th className="text-center">
                                            Sanitary Pads Boxes Sold Today
                                        </th>

                                        <th className="text-center">
                                            Sanitary Pads Sales Amount
                                        </th>

                                        <th>UTR Number</th>

                                        <th>Additional Remarks</th>

                                        <th className="text-center">
                                            Meeting Photo 1
                                        </th>

                                        <th className="text-center">
                                            Meeting Photo 2
                                        </th>

                                        <th className="text-center">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {/* LOADING */}
                                    {loading && (
                                        <tr>
                                            <td colSpan="17" className="text-center py-5">
                                                <Spinner
                                                    animation="border"
                                                    size="sm"
                                                    className="me-2"
                                                />
                                                Loading reports...
                                            </td>
                                        </tr>
                                    )}

                                    {/* NO DATA */}
                                    {!loading && totalRecords === 0 && (
                                        <tr>
                                            <td colSpan="17" className="text-center text-muted py-5">

                                                <div className="fs-2">
                                                    🔍
                                                </div>

                                                <div className="fw-semibold mt-2">
                                                    No Taluka reports found.
                                                </div>

                                                {isFilterActive && (
                                                    <Button
                                                        size="sm"
                                                        variant="dark"
                                                        className="mt-2"
                                                        onClick={clearFilters}
                                                    >
                                                        Clear Filters
                                                    </Button>
                                                )}

                                            </td>
                                        </tr>
                                    )}

                                    {/* DATA */}
                                    {!loading &&
                                        currentReports.length > 0 &&
                                        currentReports.map((report, index) => {

                                            const photo1 = getImageUrl(
                                                report.meeting_photo_1 ||
                                                report.meetingPhoto1 ||
                                                ""
                                            );

                                            const photo2 = getImageUrl(
                                                report.meeting_photo_2 ||
                                                report.meetingPhoto2 ||
                                                ""
                                            );

                                            return (
                                                <tr
                                                    key={
                                                        report.id ||
                                                        index
                                                    }
                                                >

                                                    {/* SR */}
                                                    <td className="text-center fw-semibold">
                                                        {startIndex + index + 1}
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
                                                            report.report_date ||
                                                            report.reportDate
                                                        )}
                                                    </td>

                                                    {/* TOTAL AUTHORISED CENTER HEADS */}
                                                    <td className="text-center fw-semibold">
                                                        {getValue(
                                                            report,
                                                            "totalCenterHeads",
                                                            "total_authorised_center_heads",
                                                            "0"
                                                        )}
                                                    </td>

                                                    {/* TOTAL ACTIVE CENTER HEADS */}
                                                    <td className="text-center fw-semibold">
                                                        {getValue(
                                                            report,
                                                            "totalActiveCenterHeads",
                                                            "total_active_center_heads",
                                                            "0"
                                                        )}
                                                    </td>

                                                    {/* VISITED CENTER HEADS */}
                                                    <td className="report-text-cell">
                                                        {getValue(
                                                            report,
                                                            "namesOfCenterHeadsVisitedToday",
                                                            "visited_center_heads_names",
                                                            "-"
                                                        )}
                                                    </td>

                                                    {/* BOXES SOLD */}
                                                    <td className="text-center fw-semibold">
                                                        {getValue(
                                                            report,
                                                            "totalSanitaryPadsBoxSoldToday",
                                                            "sanitary_pads_boxes_sold",
                                                            "0"
                                                        )}
                                                    </td>

                                                    {/* SALES AMOUNT */}
                                                    <td className="text-center fw-semibold">
                                                        {getValue(
                                                            report,
                                                            "totalAmountFromSanitaryPadBoxSalesToday",
                                                            "sanitary_pads_sales_amount",
                                                            "0"
                                                        )}
                                                    </td>

                                                    {/* UTR */}
                                                    <td>
                                                        {getValue(
                                                            report,
                                                            "utrNumber",
                                                            "utr_number",
                                                            "-"
                                                        )}
                                                    </td>

                                                    {/* REMARKS */}
                                                    <td className="report-text-cell">
                                                        {getValue(
                                                            report,
                                                            "additionalRemarks",
                                                            "additional_remarks",
                                                            "-"
                                                        )}
                                                    </td>

                                                    {/* PHOTO 1 */}
                                                    <td className="text-center">
                                                        {photo1 ? (
                                                            <img
                                                                src={photo1}
                                                                alt="Meeting 1"
                                                                className="taluka-report-photo"
                                                                onClick={() =>
                                                                    window.open(
                                                                        photo1,
                                                                        "_blank",
                                                                        "noopener,noreferrer"
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <span className="text-muted">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* PHOTO 2 */}
                                                    <td className="text-center">
                                                        {photo2 ? (
                                                            <img
                                                                src={photo2}
                                                                alt="Meeting 2"
                                                                className="taluka-report-photo"
                                                                onClick={() =>
                                                                    window.open(
                                                                        photo2,
                                                                        "_blank",
                                                                        "noopener,noreferrer"
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <span className="text-muted">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td className="text-center">

                                                        <div className="
                                                            d-flex
                                                            justify-content-center
                                                            align-items-center
                                                            gap-2
                                                        ">

                                                            <Button
                                                                size="sm"
                                                                variant="outline-dark"
                                                                onClick={() =>
                                                                    handleEdit(report)
                                                                }
                                                            >
                                                                Edit
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        report.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    report.id
                                                                }
                                                            >
                                                                {deletingId === report.id ? (
                                                                    <Spinner
                                                                        animation="border"
                                                                        size="sm"
                                                                    />
                                                                ) : (
                                                                    "Delete"
                                                                )}
                                                            </Button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        })}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* PAGINATION */}
                    {!loading && totalPages > 1 && (
                        <div className="
                            card-footer
                            bg-white
                            border-top
                            px-3
                            py-3
                        ">

                            <div className="
                                d-flex
                                flex-column
                                flex-md-row
                                justify-content-between
                                align-items-center
                                gap-3
                            ">

                                <div>
                                    <small className="text-muted">
                                        Page{" "}
                                        <strong>{currentPage}</strong>
                                        {" "}of{" "}
                                        <strong>{totalPages}</strong>
                                    </small>
                                </div>

                                <nav aria-label="Taluka report pagination">

                                    <ul className="
                                        pagination
                                        pagination-sm
                                        mb-0
                                    ">

                                        <li className={`
                                            page-item
                                            ${currentPage === 1 ? "disabled" : ""}
                                        `}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() =>
                                                    goToPage(currentPage - 1)
                                                }
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                        </li>

                                        {getPageNumbers().map(
                                            (page, index) => {

                                                if (page === "...") {
                                                    return (
                                                        <li
                                                            key={`dots-${index}`}
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
                                                                currentPage === page
                                                                    ? "active"
                                                                    : ""
                                                            }
                                                        `}
                                                    >
                                                        <button
                                                            type="button"
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

                                        <li className={`
                                            page-item
                                            ${
                                                currentPage === totalPages
                                                    ? "disabled"
                                                    : ""
                                            }
                                        `}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() =>
                                                    goToPage(currentPage + 1)
                                                }
                                                disabled={
                                                    currentPage === totalPages
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
                    ADD / EDIT MODAL
                ================================================= */}

                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    size="xl"
                    centered
                    scrollable
                    backdrop="static"
                    dialogClassName="
                        taluka-report-modal
                    "
                >

                    <Form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* MODAL HEADER */}

                        <Modal.Header
                            closeButton
                        >

                            <Modal.Title
                                className="
                                    fw-bold
                                "
                            >
                                {editingId
                                    ? "Edit Taluka Report"
                                    : "Add Taluka Report"}
                            </Modal.Title>

                        </Modal.Header>

                        {/* MODAL BODY */}

                        <Modal.Body
                            style={{
                                maxHeight:
                                    "calc(100vh - 180px)",
                                overflowY:
                                    "auto",
                            }}
                        >

                            {/* BASIC INFORMATION */}

                            <h5
                                className="
                                    fw-bold
                                    mb-3
                                "
                            >
                                Basic Information
                            </h5>

                            <Row className="g-3">

                                {/* NAME */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Name *
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter name
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* DESIGNATION */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Designation *
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="designation"
                                            value={
                                                form.designation
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter designation
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* TALUKA */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Taluka *
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="taluka"
                                            value={
                                                form.taluka
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter taluka
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* DISTRICT */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            District *
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="district"
                                            value={
                                                form.district
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter district
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* MOBILE */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Mobile Number *
                                        </Form.Label>

                                        <Form.Control
                                            type="tel"
                                            name="mobile_number"
                                            value={
                                                form.mobile_number
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter mobile number
                                            "
                                            maxLength={10}
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* DATE */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Report Date *
                                        </Form.Label>

                                        <Form.Control
                                            type="date"
                                            name="report_date"
                                            value={
                                                form.report_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                            </Row>

                            <hr className="my-4" />

                            {/* REPORT DETAILS */}

                            <h5
                                className="
                                    fw-bold
                                    mb-3
                                "
                            >
                                Report Details
                            </h5>

                            <Row className="g-3">

                                {/* TOTAL CENTER HEADS */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Total Authorised Center Heads *
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            min="0"
                                            name="
                                                total_authorised_center_heads
                                            "
                                            value={
                                                form.total_authorised_center_heads
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter total center heads
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* TOTAL ACTIVE CENTER HEADS */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Total Active Center Heads *
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            min="0"
                                            name="total_active_center_heads"
                                            value={
                                                form.total_active_center_heads
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter total active center heads
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* VISITED */}

                                <Col xs={12}>

                                    <Form.Group>

                                        <Form.Label>
                                            Today's Visited Center Heads Names *
                                        </Form.Label>

                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="
                                                visited_center_heads_names
                                            "
                                            value={
                                                form.visited_center_heads_names
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter names of center heads visited today
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* SANITARY BOXES */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Total Sanitary Pads Box Sold Today *
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            min="0"
                                            name="
                                                sanitary_pads_boxes_sold
                                            "
                                            value={
                                                form.sanitary_pads_boxes_sold
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter boxes sold
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* SALES AMOUNT */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Total Amount From Sanitary Pad Box Sales Today *
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="
                                                sanitary_pads_sales_amount
                                            "
                                            value={
                                                form.sanitary_pads_sales_amount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter sales amount
                                            "
                                            required
                                        />

                                    </Form.Group>

                                </Col>

                                {/* UTR */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            UTR Number
                                        </Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="utr_number"
                                            value={
                                                form.utr_number
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter UTR number
                                            "
                                        />

                                    </Form.Group>

                                </Col>

                                {/* REMARKS */}

                                <Col xs={12}>

                                    <Form.Group>

                                        <Form.Label>
                                            Additional Remarks
                                        </Form.Label>

                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="additional_remarks"
                                            value={
                                                form.additional_remarks
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="
                                                Enter additional remarks
                                            "
                                        />

                                    </Form.Group>

                                </Col>

                            </Row>

                            <hr className="my-4" />

                            {/* PHOTOS */}

                            <h5
                                className="
                                    fw-bold
                                    mb-3
                                "
                            >
                                Meeting Photos
                            </h5>

                            <Row className="g-4">

                                {/* PHOTO 1 */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Meeting Photo 1
                                        </Form.Label>

                                        <Form.Control
                                            type="file"
                                            name="meeting_photo_1"
                                            accept="
                                                image/jpeg,
                                                image/jpg,
                                                image/png,
                                                image/webp
                                            "
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <div
                                            className="mt-3"
                                        >

                                            {photoPreview1 ? (

                                                <img
                                                    src={
                                                        photoPreview1
                                                    }
                                                    alt="
                                                        Preview 1
                                                    "
                                                    className="
                                                        img-thumbnail
                                                    "
                                                    style={{
                                                        width:
                                                            "180px",
                                                        height:
                                                            "130px",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />

                                            ) : existingPhoto1 ? (

                                                <img
                                                    src={
                                                        existingPhoto1
                                                    }
                                                    alt="
                                                        Existing Photo 1
                                                    "
                                                    className="
                                                        img-thumbnail
                                                    "
                                                    style={{
                                                        width:
                                                            "180px",
                                                        height:
                                                            "130px",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="
                                                        text-muted
                                                    "
                                                >
                                                    No image selected
                                                </div>

                                            )}

                                        </div>

                                    </Form.Group>

                                </Col>

                                {/* PHOTO 2 */}

                                <Col
                                    xs={12}
                                    md={6}
                                >

                                    <Form.Group>

                                        <Form.Label>
                                            Meeting Photo 2
                                        </Form.Label>

                                        <Form.Control
                                            type="file"
                                            name="meeting_photo_2"
                                            accept="
                                                image/jpeg,
                                                image/jpg,
                                                image/png,
                                                image/webp
                                            "
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <div
                                            className="mt-3"
                                        >

                                            {photoPreview2 ? (

                                                <img
                                                    src={
                                                        photoPreview2
                                                    }
                                                    alt="
                                                        Preview 2
                                                    "
                                                    className="
                                                        img-thumbnail
                                                    "
                                                    style={{
                                                        width:
                                                            "180px",
                                                        height:
                                                            "130px",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />

                                            ) : existingPhoto2 ? (

                                                <img
                                                    src={
                                                        existingPhoto2
                                                    }
                                                    alt="
                                                        Existing Photo 2
                                                    "
                                                    className="
                                                        img-thumbnail
                                                    "
                                                    style={{
                                                        width:
                                                            "180px",
                                                        height:
                                                            "130px",
                                                        objectFit:
                                                            "cover",
                                                    }}
                                                />

                                            ) : (

                                                <div
                                                    className="
                                                        text-muted
                                                    "
                                                >
                                                    No image selected
                                                </div>

                                            )}

                                        </div>

                                    </Form.Group>

                                </Col>

                            </Row>

                        </Modal.Body>

                        {/* MODAL FOOTER */}

                        <Modal.Footer>

                            <Button
                                variant="secondary"
                                onClick={
                                    handleCloseModal
                                }
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
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className="me-2"
                                        />

                                        Saving...
                                    </>

                                ) : (

                                    editingId
                                        ? "Update Report"
                                        : "Add Report"

                                )}

                            </Button>

                        </Modal.Footer>

                    </Form>

                </Modal>

                {/* =================================================
                    CSS
                ================================================= */}

                <style>{`

                    /* =====================================================
                    GENERAL
                    ===================================================== */

                    .form-control {
                        font-size: 13px;
                    }

                    .form-control:focus {
                        border-color: #212529;

                        box-shadow:
                            0 0 0 0.15rem
                            rgba(33, 37, 41, 0.12);
                    }


                    /* =====================================================
                    TALUKA REPORT TABLE WRAPPER
                    ===================================================== */

                    .taluka-report-table-wrapper {
                        width: 100%;
                        max-width: 100%;

                        max-height:
                            calc(100vh - 390px);

                        overflow-x: auto !important;
                        overflow-y: auto !important;

                        -webkit-overflow-scrolling: touch;

                        position: relative;

                        scrollbar-width: auto;
                    }


                    /* =====================================================
                    TABLE
                    ===================================================== */

                    .taluka-report-table-wrapper table {
                        width: max-content !important;

                        min-width: 3000px !important;

                        margin: 0 !important;

                        border-collapse: collapse;

                        table-layout: auto;
                    }


                    /* =====================================================
                    CELLS
                    ===================================================== */

                    .taluka-report-table-wrapper th,
                    .taluka-report-table-wrapper td {
                        white-space: nowrap !important;

                        font-size: 12px !important;

                        padding: 9px 10px !important;

                        vertical-align: middle !important;

                        border: 1px solid #dee2e6 !important;

                        line-height: 1.4;
                    }


                    /* =====================================================
                    HEADER
                    ===================================================== */

                    .taluka-report-table-wrapper thead th {
                        position: sticky !important;

                        top: 0 !important;

                        z-index: 20 !important;

                        background: #f8f9fa !important;

                        color: #212529 !important;

                        font-weight: 700 !important;

                        line-height: 1.35;

                        box-shadow:
                            inset 0 -1px 0 #dee2e6;
                    }


                    /* =====================================================
                    BODY
                    ===================================================== */

                    .taluka-report-table-wrapper tbody td {
                        background: #ffffff;
                    }


                    .taluka-report-table-wrapper tbody tr:hover td {
                        background: #f8f9fa !important;
                    }


                    /* =====================================================
                    COLUMN WIDTHS
                    ===================================================== */

                    .taluka-report-table-wrapper th:nth-child(1),
                    .taluka-report-table-wrapper td:nth-child(1) {
                        width: 60px;
                        min-width: 60px;
                        text-align: center;
                    }

                    .taluka-report-table-wrapper th:nth-child(2),
                    .taluka-report-table-wrapper td:nth-child(2) {
                        min-width: 220px;
                    }

                    .taluka-report-table-wrapper th:nth-child(3),
                    .taluka-report-table-wrapper td:nth-child(3) {
                        min-width: 170px;
                    }

                    .taluka-report-table-wrapper th:nth-child(4),
                    .taluka-report-table-wrapper td:nth-child(4) {
                        min-width: 150px;
                    }

                    .taluka-report-table-wrapper th:nth-child(5),
                    .taluka-report-table-wrapper td:nth-child(5) {
                        min-width: 150px;
                    }

                    .taluka-report-table-wrapper th:nth-child(6),
                    .taluka-report-table-wrapper td:nth-child(6) {
                        min-width: 160px;
                    }

                    .taluka-report-table-wrapper th:nth-child(7),
                    .taluka-report-table-wrapper td:nth-child(7) {
                        min-width: 150px;
                    }

                    .taluka-report-table-wrapper th:nth-child(8),
                    .taluka-report-table-wrapper td:nth-child(8) {
                        min-width: 210px;
                        text-align: center;
                    }

                    .taluka-report-table-wrapper th:nth-child(9),
                    .taluka-report-table-wrapper td:nth-child(9) {
                        min-width: 210px;
                        text-align: center;
                    }

                    .taluka-report-table-wrapper th:nth-child(10),
                    .taluka-report-table-wrapper td:nth-child(10) {
                        min-width: 360px;
                    }

                    .taluka-report-table-wrapper th:nth-child(11),
                    .taluka-report-table-wrapper td:nth-child(11) {
                        min-width: 220px;
                        text-align: center;
                    }

                    .taluka-report-table-wrapper th:nth-child(12),
                    .taluka-report-table-wrapper td:nth-child(12) {
                        min-width: 230px;
                        text-align: center;
                    }

                    .taluka-report-table-wrapper th:nth-child(13),
                    .taluka-report-table-wrapper td:nth-child(13) {
                        min-width: 200px;
                    }

                    .taluka-report-table-wrapper th:nth-child(14),
                    .taluka-report-table-wrapper td:nth-child(14) {
                        min-width: 320px;
                    }

                    .taluka-report-table-wrapper th:nth-child(15),
                    .taluka-report-table-wrapper td:nth-child(15),
                    .taluka-report-table-wrapper th:nth-child(16),
                    .taluka-report-table-wrapper td:nth-child(16) {
                        min-width: 150px;
                        width: 150px;
                        text-align: center;
                    }

                    .taluka-report-table-wrapper th:nth-child(17),
                    .taluka-report-table-wrapper td:nth-child(17) {
                        min-width: 180px;
                        text-align: center;
                    }


                    /* =====================================================
                    LONG TEXT
                    ===================================================== */

                    .report-text-cell {
                        white-space: normal !important;

                        min-width: 320px;

                        max-width: 550px;

                        line-height: 1.5 !important;

                        word-break: break-word;
                    }


                    /* =====================================================
                    PHOTO
                    ===================================================== */

                    .taluka-report-photo {
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


                    .taluka-report-photo:hover {
                        transform: scale(1.04);

                        box-shadow:
                            0 3px 10px
                            rgba(0, 0, 0, 0.18);
                    }


                    /* =====================================================
                    TABLE SCROLLBAR
                    ===================================================== */

                    .taluka-report-table-wrapper::-webkit-scrollbar {
                        width: 8px;

                        height: 10px;
                    }

                    .taluka-report-table-wrapper::-webkit-scrollbar-track {
                        background: #f1f3f5;

                        border-radius: 10px;
                    }

                    .taluka-report-table-wrapper::-webkit-scrollbar-thumb {
                        background: #adb5bd;

                        border-radius: 10px;

                        border: 2px solid #f1f3f5;
                    }

                    .taluka-report-table-wrapper::-webkit-scrollbar-thumb:hover {
                        background: #6c757d;
                    }


                    /* =====================================================
                    PAGINATION
                    ===================================================== */

                    .pagination {
                        gap: 3px;
                    }

                    .pagination .page-link {
                        min-width: 35px;

                        height: 35px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        font-size: 12px;

                        color: #212529;

                        border-radius: 5px !important;
                    }

                    .pagination .page-item.active .page-link {
                        background: #212529;

                        border-color: #212529;

                        color: #fff;
                    }

                    .pagination .page-link:hover {
                        background: #e9ecef;

                        color: #212529;
                    }

                    .pagination .page-item.active .page-link:hover {
                        background: #212529;

                        border-color: #212529;

                        color: #fff;
                    }


                    /* =====================================================
                    MODAL
                    ===================================================== */

                    .modal-dialog {
                        max-width: 1200px;
                    }

                    .modal-content {
                        border: 0;

                        border-radius: 12px;

                        overflow: hidden;
                    }

                    .modal-header {
                        background: #fff;
                    }

                    .modal-footer {
                        background: #fff;

                        border-top:
                            1px solid #dee2e6;
                    }

                    .modal-body {
                        background: #fff;
                    }


                    /* =====================================================
                    TABLET
                    ===================================================== */

                    @media (max-width: 992px) {

                        .taluka-report-table-wrapper {
                            max-height:
                                calc(100vh - 410px);
                        }

                        .taluka-report-table-wrapper th,
                        .taluka-report-table-wrapper td {
                            font-size: 11.5px !important;

                            padding: 8px 9px !important;
                        }

                        .card-header {
                            padding: 12px !important;
                        }
                    }


                    /* =====================================================
                    MOBILE
                    ===================================================== */

                    @media (max-width: 768px) {

                        .taluka-report-table-wrapper {
                            max-height:
                                calc(100vh - 430px);

                            overflow-x: auto !important;

                            overflow-y: auto !important;

                            -webkit-overflow-scrolling: touch;
                        }

                        .taluka-report-table-wrapper table {
                            min-width:
                                3000px !important;
                        }

                        .taluka-report-table-wrapper th,
                        .taluka-report-table-wrapper td {
                            font-size: 11px !important;

                            padding: 8px !important;
                        }

                        .taluka-report-photo {
                            width: 80px;

                            height: 65px;
                        }

                        .modal-dialog {
                            margin: 0.5rem;
                        }

                        .modal-body {
                            padding: 16px;
                        }

                        .modal-title {
                            font-size: 20px;
                        }

                        .pagination .page-link {
                            min-width: 32px;

                            height: 32px;

                            font-size: 11px;
                        }
                    }


                    /* =====================================================
                    SMALL MOBILE
                    ===================================================== */

                    @media (max-width: 576px) {

                        .taluka-report-table-wrapper {
                            max-height:
                                calc(100vh - 460px);
                        }

                        .taluka-report-table-wrapper table {
                            min-width:
                                3000px !important;
                        }

                        .taluka-report-table-wrapper th,
                        .taluka-report-table-wrapper td {
                            font-size: 10.5px !important;

                            padding: 7px 8px !important;
                        }

                        .taluka-report-table-wrapper thead th {
                            font-size: 10.5px !important;
                        }

                        .pagination {
                            flex-wrap: wrap;

                            justify-content: center;
                        }
                    }

                `}</style>

            </div>
        );
    };

    export default TalukaReport;    
