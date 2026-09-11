
import React, { useEffect, useMemo, useState } from "react";
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
// API CONFIGURATION
// =====================================================

const BACKEND_BASE_URL = BACKEND_ROOT_URL;

const API_BASE_URL = ROOT_API_URL;

const TRAINER_REPORTS_API =
    `${API_BASE_URL}/trainer-reports`;

const TRAINER_UPLOAD_URL =
    `${BACKEND_BASE_URL}/uploads/trainer-reports`;

const API_URL = TRAINER_REPORTS_API;

// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {
    name: "",
    designation: "",
    taluka: "",
    district: "",
    mobile_number: "",
    report_date: "",
    total_authorised_center_heads: "",
    total_active_center_heads: "",
    today_visited_center_heads_names: "",
    total_sanitary_pad_boxes_sold_today: "",
    total_amount_from_sanitary_pad_sales_today: "",
    utr_number: "",
    total_center_heads_visited_today: "",
    todays_new_members: "",
    additional_remarks: "",
    meeting_photo_1: null,
    meeting_photo_2: null,
};

// =====================================================
// DATE FORMAT
// =====================================================

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
            const [year, month, day] = datePart.split("-");

            return `${day}/${month}/${year}`;
        }
    }

    return value;
};

// =====================================================
// DATE INPUT
// =====================================================

const formatDateInput = (date) => {
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

const getPhotoUrl = (photo) => {
    if (!photo) return "";

    const value = String(photo).trim();

    if (!value) return "";

    // Already complete URL
    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("data:")
    ) {
        return value;
    }

    // /uploads/...
    if (value.startsWith("/uploads/")) {
        return BACKEND_BASE_URL + value;
    }

    // uploads/...
    if (value.startsWith("uploads/")) {
        return BACKEND_BASE_URL + "/" + value;
    }

    // trainer-reports/...
    if (value.startsWith("trainer-reports/")) {
        return (
            BACKEND_BASE_URL +
            "/uploads/" +
            value
        );
    }

    // filename only
    return (
        BACKEND_BASE_URL +
        "/uploads/trainer-reports/" +
        value
    );
};

// =====================================================
// COMPONENT
// =====================================================

const TrainerReport = () => {

    // =================================================
    // REPORTS
    // =================================================

    const [reports, setReports] = useState([]);

    // =================================================
    // LOADING
    // =================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    // =================================================
    // ALERT
    // =================================================

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    // =================================================
    // SEARCH
    // =================================================

    const [nameSearch, setNameSearch] = useState("");

    const [dateSearch, setDateSearch] = useState("");

    const [talukaSearch, setTalukaSearch] = useState("");

    const [districtSearch, setDistrictSearch] = useState("");

    // =================================================
    // PAGINATION
    // =================================================

    const RECORDS_PER_PAGE = 20;

    const [currentPage, setCurrentPage] = useState(1);

    // =================================================
    // MODAL
    // =================================================

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        ...EMPTY_FORM,
    });

    // =================================================
    // OLD PHOTOS
    // =================================================

    const [oldPhoto1, setOldPhoto1] = useState("");

    const [oldPhoto2, setOldPhoto2] = useState("");

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

            console.log(
                "TRAINER REPORT API URL:",
                API_URL
            );

            const response = await fetch(
                `${API_URL}?_t=${Date.now()}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            );

            const data = await response.json();

            console.log(
                "TRAINER REPORT API RESPONSE:",
                data
            );

            if (
                !response.ok ||
                data.success === false
            ) {
                throw new Error(
                    data.message ||
                    "Failed to load Trainer reports"
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
                "TRAINER REPORT ERROR:",
                err
            );

            setError(
                err.message ||
                "Unable to load Trainer reports."
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
    // SEARCH + DATE FILTER
    // =================================================

    const filteredReports = useMemo(() => {

        const nameKeyword =
            nameSearch.trim().toLowerCase();

        const talukaKeyword =
            talukaSearch.trim().toLowerCase();

        const districtKeyword =
            districtSearch.trim().toLowerCase();

        return reports.filter((report) => {

            // =========================================
            // NAME
            // =========================================

            const name = String(
                report?.name ?? ""
            ).toLowerCase();

            const taluka = String(
                report?.taluka ?? ""
            ).toLowerCase();

            const district = String(
                report?.district ?? ""
            ).toLowerCase();

            // =========================================
            // REPORT DATE
            // =========================================

            const reportDate =
                report?.report_date ||
                report?.reportDate ||
                "";

            const normalizedDate =
                String(reportDate)
                    .split("T")[0];

            // =========================================
            // NAME MATCH
            // =========================================

            const nameMatch =
                nameKeyword === "" ||
                name.includes(nameKeyword);

            // =========================================
            // DATE MATCH
            // =========================================

            const dateMatch =
                dateSearch === "" ||
                normalizedDate === dateSearch;

            const talukaMatch =
                talukaKeyword === "" ||
                taluka.includes(talukaKeyword);

            const districtMatch =
                districtKeyword === "" ||
                district.includes(districtKeyword);

            return (
                nameMatch &&
                talukaMatch &&
                districtMatch &&
                dateMatch
            );
        });

    }, [
        reports,
        nameSearch,
        talukaSearch,
        districtSearch,
        dateSearch,
    ]);

    // =================================================
    // RESET PAGE WHEN FILTER CHANGES
    // =================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [
        nameSearch,
        talukaSearch,
        districtSearch,
        dateSearch,
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
    // PAGE NUMBER LOGIC
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

        const start = Math.max(
            2,
            currentPage - 1
        );

        const end = Math.min(
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
    // CLEAR FILTER
    // =================================================

    const clearFilters = () => {
        setNameSearch("");
        setTalukaSearch("");
        setDistrictSearch("");
        setDateSearch("");
        setCurrentPage(1);
    };

    // =================================================
    // EXCEL / CSV DOWNLOAD
    // =================================================

    const downloadCSV = () => {
        if (filteredReports.length === 0) {
            setError("Download करण्यासाठी कोणताही report उपलब्ध नाही.");
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
            "Total Authorised Center Heads",
            "Total Active Center Heads",
            "Today's Visited Center Heads Names",
            "Total Sanitary Pads Box Sold Today",
            "Total Amount from Sanitary Pad Box Sales Today",
            "UTR Number",
            "Total Center Heads Visited Today",
            "Today's New Members",
            "Additional Remarks",
            "Meeting Photo 1",
            "Meeting Photo 2",
            "Status",
        ];

        const getField = (report, ...keys) => {
            for (const key of keys) {
                const value = report?.[key];

                if (value !== null && value !== undefined && value !== "") {
                    return value;
                }
            }

            return "";
        };

        const rows = filteredReports.map((report, index) => [
            index + 1,
            getField(report, "name"),
            getField(report, "designation"),
            getField(report, "taluka"),
            getField(report, "district"),
            getField(report, "mobile_number", "mobileNumber"),
            formatDate(getField(report, "report_date", "reportDate")),
            getField(report, "total_authorised_center_heads", "totalAuthorisedCenterHeads"),
            getField(report, "total_active_center_heads", "totalActiveCenterHeads"),
            getField(report, "today_visited_center_heads_names", "todayVisitedCenterHeadsNames"),
            getField(report, "total_sanitary_pad_boxes_sold_today", "totalSanitaryPadBoxesSoldToday"),
            getField(report, "total_amount_from_sanitary_pad_sales_today", "totalAmountFromSanitaryPadSalesToday"),
            getField(report, "utr_number", "utrNumber"),
            getField(report, "total_center_heads_visited_today", "totalCenterHeadsVisitedToday"),
            getField(report, "todays_new_members", "todaysNewMembers"),
            getField(report, "additional_remarks", "additionalRemarks"),
            getPhotoUrl(getField(report, "meeting_photo_1", "meetingPhoto1")),
            getPhotoUrl(getField(report, "meeting_photo_2", "meetingPhoto2")),
            getField(report, "status") || "active",
        ]);

        const escapeCSV = (value) => {
            const text = String(value ?? "");

            return /[",\r\n]/.test(text)
                ? `"${text.replace(/"/g, '""')}"`
                : text;
        };

        const csvContent = [
            headers.map(escapeCSV).join(","),
            ...rows.map((row) => row.map(escapeCSV).join(",")),
        ].join("\r\n");

        const blob = new Blob(["\uFEFF", csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const today = new Date().toISOString().split("T")[0];

        link.href = url;
        link.download = `bdo-reports-${today}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setError("");
        setSuccess(`${filteredReports.length} records downloaded successfully.`);
    };

    // =================================================
    // ADD REPORT
    // =================================================

    const handleAdd = () => {

        setEditingId(null);

        setOldPhoto1("");
        setOldPhoto2("");

        setForm({
            ...EMPTY_FORM,
        });

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    // =================================================
    // EDIT REPORT
    // =================================================

    const handleEdit = (report) => {

        setEditingId(report.id);

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
                formatDateInput(
                    report.report_date ||
                    report.reportDate
                ),

            total_authorised_center_heads:
                report.total_authorised_center_heads ??
                report.totalAuthorisedCenterHeads ??
                "",

            total_active_center_heads:
                report.total_active_center_heads ??
                report.totalActiveCenterHeads ??
                "",

            today_visited_center_heads_names:
                report.today_visited_center_heads_names ??
                report.todayVisitedCenterHeadsNames ??
                "",

            total_sanitary_pad_boxes_sold_today:
                report.total_sanitary_pad_boxes_sold_today ??
                report.totalSanitaryPadBoxesSoldToday ??
                "",

            total_amount_from_sanitary_pad_sales_today:
                report.total_amount_from_sanitary_pad_sales_today ??
                report.totalAmountFromSanitaryPadSalesToday ??
                "",

            utr_number:
                report.utr_number ??
                report.utrNumber ??
                "",

            total_center_heads_visited_today:
                report.total_center_heads_visited_today ??
                report.totalCenterHeadsVisitedToday ??
                "",

            todays_new_members:
                report.todays_new_members ??
                report.todaysNewMembers ??
                "",

            additional_remarks:
                report.additional_remarks ??
                report.additionalRemarks ??
                "",

            meeting_photo_1: null,

            meeting_photo_2: null,
        });

        setOldPhoto1(
            report.meeting_photo_1 ||
            report.meetingPhoto1 ||
            ""
        );

        setOldPhoto2(
            report.meeting_photo_2 ||
            report.meetingPhoto2 ||
            ""
        );

        setError("");
        setSuccess("");

        setShowModal(true);
    };

    // =================================================
    // CLOSE MODAL
    // =================================================

    const handleClose = () => {

        if (saving) return;

        setShowModal(false);

        setEditingId(null);

        setOldPhoto1("");
        setOldPhoto2("");

        setForm({
            ...EMPTY_FORM,
        });
    };

    // =================================================
    // INPUT CHANGE
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            files,
        } = e.target;

        if (files) {

            const file =
                files[0] || null;

            if (!file) return;

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];

            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                setError(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                );

                e.target.value = "";

                return;
            }

            if (
                file.size >
                10 * 1024 * 1024
            ) {

                setError(
                    "Image size must be less than 10MB."
                );

                e.target.value = "";

                return;
            }

            setForm((prev) => ({
                ...prev,
                [name]: file,
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =================================================
    // VIEW IMAGE
    // =================================================

    const viewImage = (
        image,
        title
    ) => {

        const url =
            getPhotoUrl(image);

        if (!url) return;

        setSelectedImage(url);

        setSelectedImageTitle(title);

        setShowImageModal(true);
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

            // =========================================
            // VALIDATION
            // =========================================

            if (!form.name.trim()) {
                throw new Error(
                    "Name is required."
                );
            }

            if (!form.designation.trim()) {
                throw new Error(
                    "Designation is required."
                );
            }

            if (!form.taluka.trim()) {
                throw new Error(
                    "Taluka is required."
                );
            }

            if (!form.district.trim()) {
                throw new Error(
                    "District is required."
                );
            }

            if (
                !/^[0-9]{10}$/.test(
                    form.mobile_number.trim()
                )
            ) {
                throw new Error(
                    "Mobile number must be exactly 10 digits."
                );
            }

            if (!form.report_date) {
                throw new Error(
                    "Report date is required."
                );
            }

            // =========================================
            // FORM DATA
            // =========================================

            const data = new FormData();

            data.append(
                "name",
                form.name.trim()
            );

            data.append(
                "designation",
                form.designation.trim()
            );

            data.append(
                "taluka",
                form.taluka.trim()
            );

            data.append(
                "district",
                form.district.trim()
            );

            data.append(
                "mobile_number",
                form.mobile_number.trim()
            );

            data.append(
                "report_date",
                form.report_date
            );

            data.append(
                "total_authorised_center_heads",
                form.total_authorised_center_heads ||
                "0"
            );

            data.append(
                "total_active_center_heads",
                form.total_active_center_heads ||
                "0"
            );

            data.append(
                "today_visited_center_heads_names",
                form.today_visited_center_heads_names ||
                ""
            );

            data.append(
                "total_sanitary_pad_boxes_sold_today",
                form.total_sanitary_pad_boxes_sold_today ||
                "0"
            );

            data.append(
                "total_amount_from_sanitary_pad_sales_today",
                form.total_amount_from_sanitary_pad_sales_today ||
                "0"
            );

            data.append(
                "utr_number",
                form.utr_number?.trim() ||
                ""
            );

            data.append(
                "total_center_heads_visited_today",
                form.total_center_heads_visited_today ||
                "0"
            );

            data.append(
                "todays_new_members",
                form.todays_new_members ||
                "0"
            );

            data.append(
                "additional_remarks",
                form.additional_remarks ||
                ""
            );

            if (form.meeting_photo_1) {
                data.append(
                    "meeting_photo_1",
                    form.meeting_photo_1
                );
            }

            if (form.meeting_photo_2) {
                data.append(
                    "meeting_photo_2",
                    form.meeting_photo_2
                );
            }

            // =========================================
            // URL
            // =========================================

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const method = editingId
                ? "PUT"
                : "POST";

            console.log(
                "TRAINER SAVE URL:",
                url
            );

            // =========================================
            // REQUEST
            // =========================================

            const response = await fetch(
                url,
                {
                    method,
                    credentials: "include",
                    body: data,
                }
            );

            const result =
                await response.json();

            console.log(
                "TRAINER SAVE RESPONSE:",
                result
            );

            if (
                !response.ok ||
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Failed to save Trainer report."
                );
            }

            setSuccess(
                editingId
                    ? "Trainer report updated successfully."
                    : "Trainer report added successfully."
            );

            handleClose();

            await loadReports();

        } catch (err) {

            console.error(
                "TRAINER SAVE ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to save Trainer report."
            );

        } finally {

            setSaving(false);
        }
    };

    // =================================================
    // DELETE
    // =================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this Trainer report?"
            );

        if (!confirmDelete) return;

        try {

            setDeletingId(id);

            setError("");
            setSuccess("");

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE",
                        credentials: "include",
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Failed to delete Trainer report."
                );
            }

            setSuccess(
                "Trainer report deleted successfully."
            );

            await loadReports();

        } catch (err) {

            console.error(
                "DELETE ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to delete Trainer report."
            );

        } finally {

            setDeletingId(null);
        }
    };

    // =================================================
    // RETURN
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

                    <h3 className="fw-bold mb-1">
                        BDO (business development officers) Reports
                    </h3>

                    <p className="text-muted mb-0">
                        Manage and view all BDO (business development officers) reports
                    </p>

                </div>

                <div className="d-flex gap-2">

                    <Button
                        variant="success"
                        onClick={downloadCSV}
                        disabled={loading || filteredReports.length === 0}
                    >
                        ⬇ Download Excel
                    </Button>

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

                                Loading...
                            </>
                        ) : (
                            <>↻ Refresh</>
                        )}

                    </Button>

                </div>

            </div>

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
                TOTAL COUNT
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
                                width: 60,
                                height: 60,
                                fontSize: 20,
                            }}
                        >
                            {loading
                                ? "..."
                                : filteredReports.length}
                        </div>

                        <div>

                            <small className="text-muted">
                                Total BDO (business development officers) Reports
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
                SEARCH / FILTER
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
                                col-12
                                col-md-6
                                col-lg-3
                            "
                        >

                            <Form.Label className="fw-semibold">
                                Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Search by name..."
                                value={nameSearch}
                                onChange={(e) =>
                                    setNameSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* TALUKA */}

                        <div
                            className="
                                col-12
                                col-md-6
                                col-lg-3
                            "
                        >

                            <Form.Label className="fw-semibold">
                                Taluka
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Search Taluka..."
                                value={talukaSearch}
                                onChange={(e) =>
                                    setTalukaSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* DISTRICT */}

                        <div
                            className="
                                col-12
                                col-md-6
                                col-lg-2
                            "
                        >

                            <Form.Label className="fw-semibold">
                                District
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="District..."
                                value={districtSearch}
                                onChange={(e) =>
                                    setDistrictSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* REPORT DATE */}

                        <div
                            className="
                                col-12
                                col-md-6
                                col-lg-2
                            "
                        >

                            <Form.Label className="fw-semibold">
                                Report Date
                            </Form.Label>

                            <Form.Control
                                type="date"
                                value={dateSearch}
                                onChange={(e) =>
                                    setDateSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* CLEAR */}

                        <div
                            className="
                                col-12
                                col-md-12
                                col-lg-2
                            "
                        >

                            <Button
                                variant="outline-secondary"
                                className="w-100"
                                onClick={
                                    clearFilters
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
                                BDO (business development officers) Report List
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

                <div className="card-body p-0">

                    <div className="trainer-table-scroll">

                        <table className="
                            table
                            table-bordered
                            table-hover
                            align-middle
                            mb-0
                            trainer-report-table
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
                                        Total Sanitary Pads Box Sold Today
                                    </th>
                                    <th className="text-center">
                                        Total Amount from Sanitary Pad Box Sales Today
                                    </th>
                                    <th>
                                        UTR Number
                                    </th>
                                    <th className="text-center">
                                        Total Center Heads Visited Today
                                    </th>
                                    <th className="text-center">
                                        Today's New Members
                                    </th>
                                    <th>
                                        Additional Remarks
                                    </th>
                                    <th className="text-center">
                                        Meeting Photo 1
                                    </th>
                                    <th className="text-center">
                                        Meeting Photo 2
                                    </th>
                                    <th className="text-center">
                                        Status
                                    </th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading && (
                                    <tr>
                                        <td
                                            colSpan="20"
                                            className="text-center py-5"
                                        >
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="me-2"
                                            />
                                            Loading BDO (business development officers) reports...
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    filteredReports.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="20"
                                                className="
                                                    text-center
                                                    text-muted
                                                    py-5
                                                "
                                            >
                                                <div className="fs-2">
                                                    🔍
                                                </div>
                                                <div className="fw-semibold mt-2">
                                                    No BDO (business development officers) reports found.
                                                </div>
                                                <small>
                                                    Try changing your search
                                                    or date filter.
                                                </small>
                                            </td>
                                        </tr>
                                    )}

                                {!loading &&
                                    filteredReports.map(
                                        (report, index) => {

                                            const photo1 =
                                                report.meeting_photo_1 ||
                                                report.meetingPhoto1 ||
                                                "";

                                            const photo2 =
                                                report.meeting_photo_2 ||
                                                report.meetingPhoto2 ||
                                                "";

                                            const image1 =
                                                getPhotoUrl(photo1);

                                            const image2 =
                                                getPhotoUrl(photo2);

                                            return (
                                                <tr
                                                    key={
                                                        report.id ??
                                                        index
                                                    }
                                                >

                                                    <td className="text-center fw-semibold">
                                                        {index + 1}
                                                    </td>

                                                    <td className="fw-semibold">
                                                        {report.name || "-"}
                                                    </td>

                                                    <td>
                                                        {report.designation || "-"}
                                                    </td>

                                                    <td>
                                                        {report.taluka || "-"}
                                                    </td>

                                                    <td>
                                                        {report.district || "-"}
                                                    </td>

                                                    <td>
                                                        {report.mobile_number || "-"}
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            report.report_date
                                                        )}
                                                    </td>

                                                    <td className="text-center fw-semibold">
                                                        {
                                                            report.total_authorised_center_heads ??
                                                            0
                                                        }
                                                    </td>

                                                    <td className="text-center fw-semibold">
                                                        {
                                                            report.total_active_center_heads ??
                                                            0
                                                        }
                                                    </td>

                                                    <td className="report-long-text">
                                                        {
                                                            report.today_visited_center_heads_names ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="text-center fw-semibold">
                                                        {
                                                            report.total_sanitary_pad_boxes_sold_today ??
                                                            report.totalSanitaryPadBoxesSoldToday ??
                                                            0
                                                        }
                                                    </td>

                                                    <td className="text-center fw-semibold">
                                                        {
                                                            report.total_amount_from_sanitary_pad_sales_today ??
                                                            report.totalAmountFromSanitaryPadSalesToday ??
                                                            0
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            report.utr_number ??
                                                            report.utrNumber ??
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="text-center fw-semibold">
                                                        {
                                                            report.total_center_heads_visited_today ??
                                                            0
                                                        }
                                                    </td>

                                                    <td className="text-center fw-semibold">
                                                        {
                                                            report.todays_new_members ??
                                                            0
                                                        }
                                                    </td>

                                                    <td className="report-long-text">
                                                        {
                                                            report.additional_remarks ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td className="text-center">

                                                        {image1 ? (
                                                            <div>
                                                                <img
                                                                    src={image1}
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

                                                    <td className="text-center">

                                                        {image2 ? (
                                                            <div>
                                                                <img
                                                                    src={image2}
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

                                                    <td className="text-center">
                                                        <span className="badge bg-success">
                                                            {
                                                                report.status ||
                                                                "active"
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="text-center">

                                                        <div className="
                                                            d-flex
                                                            justify-content-center
                                                            align-items-center
                                                            gap-2
                                                        ">

                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        report
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>

                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                disabled={
                                                                    deletingId ===
                                                                    report.id
                                                                }
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        report.id
                                                                    )
                                                                }
                                                            >
                                                                {deletingId ===
                                                                report.id
                                                                    ? "Deleting..."
                                                                    : "Delete"}
                                                            </Button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            <Modal
                show={showModal}
                onHide={handleClose}
                size="xl"
                centered
                scrollable
                backdrop="static"
            >

                <Form
                    onSubmit={handleSubmit}
                >

                    <Modal.Header closeButton>

                        <Modal.Title className="fw-bold">

                            {editingId
                                ? "Edit Trainer Report"
                                : "BDO Report format"}

                        </Modal.Title>

                    </Modal.Header>

                    <Modal.Body
                        style={{
                            maxHeight:
                                "calc(100vh - 180px)",
                            overflowY:
                                "auto",
                        }}
                    >

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <h5 className="fw-bold mb-3">
                            Basic Information
                        </h5>

                        <Row className="g-3">

                            <Col xs={12} md={6}>

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
                                        required
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={6}>

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
                                        required
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={6}>

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
                                        required
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={6}>

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
                                        required
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={6}>

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
                                        maxLength={10}
                                        required
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={6}>

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

                        {/* =================================================
                            CENTER HEAD DETAILS
                        ================================================= */}

                        <h5 className="fw-bold mb-3">
                            Center Head Details
                        </h5>

                        <Row className="g-3">

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label>
                                        Total Authorised Center Heads
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="total_authorised_center_heads"
                                        value={
                                            form.total_authorised_center_heads
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label>
                                        Total Active Center Heads
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
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label>
                                        Total Center Heads Visited Today
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="total_center_heads_visited_today"
                                        value={
                                            form.total_center_heads_visited_today
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12}>

                                <Form.Group>

                                    <Form.Label>
                                        Today's Visited Center Heads Names
                                    </Form.Label>

                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="today_visited_center_heads_names"
                                        value={
                                            form.today_visited_center_heads_names
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label>
                                        Total Sanitary Pads Box Sold Today
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="total_sanitary_pad_boxes_sold_today"
                                        value={
                                            form.total_sanitary_pad_boxes_sold_today
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label>
                                        Total Amount from Sanitary Pad Box Sales Today
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="total_amount_from_sanitary_pad_sales_today"
                                        value={
                                            form.total_amount_from_sanitary_pad_sales_today
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={4}>

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
                                        placeholder="Enter UTR Number"
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label>
                                        Total Center Heads Visited Today
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="total_center_heads_visited_today"
                                        value={
                                            form.total_center_heads_visited_today
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label>
                                        Today's New Members
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="todays_new_members"
                                        value={
                                            form.todays_new_members
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </Form.Group>

                            </Col>

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
                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        <hr className="my-4" />

                        {/* =================================================
                            PHOTOS
                        ================================================= */}

                        <h5 className="fw-bold mb-3">
                            Meeting Photos
                        </h5>

                        <Row className="g-4">

                            {/* PHOTO 1 */}

                            <Col xs={12} md={6}>

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

                                    {oldPhoto1 &&
                                        !form.meeting_photo_1 && (

                                            <div className="mt-3">

                                                <small
                                                    className="
                                                        text-muted
                                                        d-block
                                                        mb-2
                                                    "
                                                >
                                                    Current Photo 1
                                                </small>

                                                <img
                                                    src={
                                                        getPhotoUrl(
                                                            oldPhoto1
                                                        )
                                                    }
                                                    alt="Current Photo 1"
                                                    style={{
                                                        width: 180,
                                                        height: 130,
                                                        objectFit:
                                                            "cover",
                                                        borderRadius: 8,
                                                        border:
                                                            "1px solid #ddd",
                                                    }}
                                                />

                                            </div>

                                        )}

                                    {form.meeting_photo_1 && (

                                        <div className="mt-3">

                                            <small
                                                className="
                                                    text-success
                                                    d-block
                                                    mb-2
                                                "
                                            >
                                                New Photo 1
                                            </small>

                                            <img
                                                src={
                                                    URL.createObjectURL(
                                                        form.meeting_photo_1
                                                    )
                                                }
                                                alt="New Photo 1"
                                                style={{
                                                    width: 180,
                                                    height: 130,
                                                    objectFit:
                                                        "cover",
                                                    borderRadius: 8,
                                                }}
                                            />

                                        </div>

                                    )}

                                </Form.Group>

                            </Col>

                            {/* PHOTO 2 */}

                            <Col xs={12} md={6}>

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

                                    {oldPhoto2 &&
                                        !form.meeting_photo_2 && (

                                            <div className="mt-3">

                                                <small
                                                    className="
                                                        text-muted
                                                        d-block
                                                        mb-2
                                                    "
                                                >
                                                    Current Photo 2
                                                </small>

                                                <img
                                                    src={
                                                        getPhotoUrl(
                                                            oldPhoto2
                                                        )
                                                    }
                                                    alt="Current Photo 2"
                                                    style={{
                                                        width: 180,
                                                        height: 130,
                                                        objectFit:
                                                            "cover",
                                                        borderRadius: 8,
                                                        border:
                                                            "1px solid #ddd",
                                                    }}
                                                />

                                            </div>

                                        )}

                                    {form.meeting_photo_2 && (

                                        <div className="mt-3">

                                            <small
                                                className="
                                                    text-success
                                                    d-block
                                                    mb-2
                                                "
                                            >
                                                New Photo 2
                                            </small>

                                            <img
                                                src={
                                                    URL.createObjectURL(
                                                        form.meeting_photo_2
                                                    )
                                                }
                                                alt="New Photo 2"
                                                style={{
                                                    width: 180,
                                                    height: 130,
                                                    objectFit:
                                                        "cover",
                                                    borderRadius: 8,
                                                }}
                                            />

                                        </div>

                                    )}

                                </Form.Group>

                            </Col>

                        </Row>

                    </Modal.Body>

                    {/* =================================================
                        MODAL FOOTER
                    ================================================= */}

                    <Modal.Footer>

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

            {/* =================================================
                CSS
            ================================================= */}

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
                    min-width: 3000px !important;
                    margin: 0 !important;
                    border-collapse: collapse;
                    table-layout: auto;
                }

                .trainer-report-table th,
                .trainer-report-table td {
                    white-space: nowrap !important;
                    font-size: 12px !important;
                    font-size: 12px !important;Trainer
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
                    min-width: 220px;
                }

                .trainer-report-table th:nth-child(3),
                .trainer-report-table td:nth-child(3) {
                    min-width: 170px;
                }

                .trainer-report-table th:nth-child(4),
                .trainer-report-table td:nth-child(4) {
                    min-width: 150px;
                }

                .trainer-report-table th:nth-child(5),
                .trainer-report-table td:nth-child(5) {
                    min-width: 150px;
                }

                .trainer-report-table th:nth-child(6),
                .trainer-report-table td:nth-child(6) {
                    min-width: 160px;
                }

                .trainer-report-table th:nth-child(7),
                .trainer-report-table td:nth-child(7) {
                    min-width: 150px;
                }

                .trainer-report-table th:nth-child(8),
                .trainer-report-table td:nth-child(8) {
                    min-width: 230px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(9),
                .trainer-report-table td:nth-child(9) {
                    min-width: 220px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(10),
                .trainer-report-table td:nth-child(10) {
                    min-width: 360px;
                }

                .trainer-report-table th:nth-child(11),
                .trainer-report-table td:nth-child(11) {
                    min-width: 230px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(12),
                .trainer-report-table td:nth-child(12) {
                    min-width: 260px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(13),
                .trainer-report-table td:nth-child(13) {
                    min-width: 180px;
                }

                .trainer-report-table th:nth-child(14),
                .trainer-report-table td:nth-child(14) {
                    min-width: 250px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(15),
                .trainer-report-table td:nth-child(15) {
                    min-width: 190px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(16),
                .trainer-report-table td:nth-child(16) {
                    min-width: 320px;
                }

                .trainer-report-table th:nth-child(17),
                .trainer-report-table td:nth-child(17),
                .trainer-report-table th:nth-child(18),
                .trainer-report-table td:nth-child(18) {
                    min-width: 150px;
                    width: 150px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(19),
                .trainer-report-table td:nth-child(19) {
                    min-width: 120px;
                    text-align: center;
                }

                .trainer-report-table th:nth-child(20),
                .trainer-report-table td:nth-child(20) {
                    min-width: 180px;
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
                        min-width: 3000px !important;
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
                        min-width: 3000px !important;
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

export default TrainerReport;
