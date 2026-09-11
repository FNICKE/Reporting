import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Button,
    Modal,
    Form,
    Spinner,
    Alert,
    Row,
    Col,
} from "react-bootstrap";


// =====================================================
// API CONFIGURATION
// =====================================================
//
// Local:
//   VITE_API_BASE_URL=http://localhost:5000
//
// Production:
//   VITE_API_BASE_URL=https://reportbackend.sainikshetkari.org
//

// =====================================================
// SMART BACKEND URL
// =====================================================
// Live website:
//   https://reporting.sainikshetkari.org
// Backend:
//   https://reportbackend.sainikshetkari.org
//
// Local development:
//   http://localhost:5000
//
// IMPORTANT:
// A live browser must never try to call localhost:5000.
// =====================================================

const PRODUCTION_BACKEND_URL =
    "https://reportbackend.sainikshetkari.org";

const LOCAL_BACKEND_URL =
    "http://localhost:5000";

const currentHostname =
    typeof window !== "undefined"
        ? window.location.hostname
        : "";

const isLocalFrontend =
    currentHostname === "localhost" ||
    currentHostname === "127.0.0.1" ||
    currentHostname === "0.0.0.0";

const configuredBackendUrl =
    import.meta.env.VITE_API_BASE_URL?.trim();

const resolvedBackendUrl =
    isLocalFrontend
        ? (configuredBackendUrl || LOCAL_BACKEND_URL)
        : PRODUCTION_BACKEND_URL;

const BACKEND_BASE_URL =
    resolvedBackendUrl.replace(/\/$/, "");

const API_BASE_URL =
    `${BACKEND_BASE_URL}/api`;

const TRAINER_REPORTS_API =
    `${API_BASE_URL}/trainer-reports`;

const TRAINER_UPLOAD_URL =
    `${BACKEND_BASE_URL}/uploads/trainer-reports`;

console.log(
    "TRAINER DASHBOARD API:",
    TRAINER_REPORTS_API
);

// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {

    name: "",

    designation: "",

    taluka: "",

    district: "",

    mobileNumber: "",

    reportDate: "",

    totalAuthorisedCenterHeads: "",

    totalActiveCenterHeads: "",

    todayVisitedCenterHeadsNames: "",

    totalSanitaryPadBoxesSoldToday: "",

    totalAmountFromSanitaryPadSalesToday: "",

    utrNumber: "",

    totalCenterHeadsVisitedToday: "",

    todaysNewMembers: "",

    additionalRemarks: "",

    meetingPhoto1: null,

    meetingPhoto2: null,

};


// =====================================================
// NORMALIZE
// =====================================================

const normalize = (value) => {

    return String(value ?? "")
        .trim()
        .toLowerCase();

};


// =====================================================
// DATE FOR INPUT
// =====================================================

const getInputDate = (value) => {

    if (!value) {
        return "";
    }

    const text =
        String(value);

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {
        return text;
    }

    if (
        text.includes("T")
    ) {
        return text.split("T")[0];
    }

    return "";
};


// =====================================================
// DATE DISPLAY
// =====================================================

const formatDisplayDate = (value) => {

    const date =
        getInputDate(value);

    if (!date) {
        return "-";
    }

    const [
        year,
        month,
        day,
    ] = date.split("-");

    return `${day}-${month}-${year}`;
};


// =====================================================
// GET PHOTO 1
// =====================================================

const getPhoto1 = (report) => {

    return (

        report?.meeting_photo_1 ||

        report?.meetingPhoto1 ||

        report?.meeting_photo1 ||

        report?.photo_1 ||

        report?.photo1 ||

        ""

    );
};


// =====================================================
// GET PHOTO 2
// =====================================================

const getPhoto2 = (report) => {

    return (

        report?.meeting_photo_2 ||

        report?.meetingPhoto2 ||

        report?.meeting_photo2 ||

        report?.photo_2 ||

        report?.photo2 ||

        ""

    );
};


// =====================================================
// IMAGE URL
// =====================================================

const getImageUrl = (imagePath) => {

    if (!imagePath) {
        return "";
    }

    let value =
        String(imagePath).trim();

    if (!value) {
        return "";
    }


    // Full URL

    if (
        value.startsWith(
            "http://"
        ) ||
        value.startsWith(
            "https://"
        )
    ) {

        return value;

    }


    // /uploads/...

    if (
        value.startsWith(
            "/uploads/"
        )
    ) {

        return (
            BACKEND_BASE_URL +
            value
        );

    }


    // uploads/...

    if (
        value.startsWith(
            "uploads/"
        )
    ) {

        return (
            BACKEND_BASE_URL +
            "/" +
            value
        );

    }


    // trainer-reports/...

    if (
        value.startsWith(
            "trainer-reports/"
        )
    ) {

        return (
            BACKEND_BASE_URL +
            "/uploads/" +
            value
        );

    }


    // Only filename

    return (
        TRAINER_UPLOAD_URL +
        "/" +
        value
    );

};


// =====================================================
// GET CURRENT TRAINER
// =====================================================

const getCurrentTrainerUser = () => {

    try {

        const directUser = {

            id:
                localStorage.getItem(
                    "logged_in_user_id"
                ) || "",

            userId:
                localStorage.getItem(
                    "logged_in_user_id"
                ) || "",

            trainerId:
                localStorage.getItem(
                    "logged_in_trainer_id"
                ) || "",

            trainerName:
                localStorage.getItem(
                    "logged_in_trainer_name"
                ) || "",

            name:
                localStorage.getItem(
                    "logged_in_name"
                ) || "",

            taluka:
                localStorage.getItem(
                    "logged_in_taluka_name"
                ) || "",

            district:
                localStorage.getItem(
                    "logged_in_district_name"
                ) || "",

        };


        if (
            directUser.name ||
            directUser.trainerName
        ) {

            return directUser;

        }


        const usersRaw =
            localStorage.getItem(
                "users"
            );

        if (!usersRaw) {
            return {};
        }


        const users =
            JSON.parse(
                usersRaw
            );


        if (
            !Array.isArray(users)
        ) {
            return {};
        }


        const userId =
            localStorage.getItem(
                "logged_in_user_id"
            );

        const trainerId =
            localStorage.getItem(
                "logged_in_trainer_id"
            );


        const found =
            users.find(
                (user) => {

                    if (!user) {
                        return false;
                    }


                    const storedUserId =
                        String(
                            user.id ??
                            user.userId ??
                            user.email ??
                            user.username ??
                            user.loginId ??
                            ""
                        ).trim();


                    const storedTrainerId =
                        String(
                            user.trainerId ??
                            user.trainerID ??
                            user.trainer_id ??
                            ""
                        );


                    return (

                        storedUserId ===
                        String(
                            userId ?? ""
                        ).trim()

                        ||

                        (
                            trainerId &&
                            storedTrainerId ===
                            String(
                                trainerId
                            )
                        )

                    );

                }
            );


        return found || {};

    } catch (error) {

        console.error(
            "GET TRAINER USER ERROR:",
            error
        );

        return {};

    }

};


// =====================================================
// REPORT / CURRENT TRAINER MATCHING
// =====================================================

const getReportTrainerId = (report) => {
    return String(
        report?.trainer_id ??
        report?.trainerId ??
        report?.trainerID ??
        report?.trainer_user_id ??
        report?.trainerUserId ??
        report?.user_id ??
        report?.userId ??
        ""
    ).trim();
};

const getReportTrainerName = (report) => {
    return (
        report?.trainer_name ??
        report?.trainerName ??
        report?.trainer ??
        report?.name ??
        ""
    );
};

const getReportTaluka = (report) => {
    return (
        report?.taluka ??
        report?.taluka_name ??
        report?.talukaName ??
        ""
    );
};

const getReportDistrict = (report) => {
    return (
        report?.district ??
        report?.district_name ??
        report?.districtName ??
        ""
    );
};

const isReportForCurrentTrainer = (report, user) => {
    const currentTrainerId = String(
        user?.trainerId ??
        user?.trainerID ??
        user?.trainer_id ??
        localStorage.getItem("logged_in_trainer_id") ??
        ""
    ).trim();

    const currentUserId = String(
        user?.id ??
        user?.userId ??
        user?.user_id ??
        localStorage.getItem("logged_in_user_id") ??
        ""
    ).trim();

    const currentTrainerName = normalize(
        user?.trainerName ||
        user?.trainer ||
        user?.name ||
        user?.fullName ||
        localStorage.getItem("logged_in_trainer_name") ||
        localStorage.getItem("logged_in_name") ||
        ""
    );

    const currentTaluka = normalize(
        user?.taluka ||
        user?.talukaName ||
        localStorage.getItem("logged_in_taluka_name") ||
        ""
    );

    const currentDistrict = normalize(
        user?.district ||
        user?.districtName ||
        localStorage.getItem("logged_in_district_name") ||
        ""
    );

    const reportTrainerId = getReportTrainerId(report);
    const reportTrainerName = normalize(
        getReportTrainerName(report)
    );

    // Prefer stable IDs whenever the API provides them.
    if (reportTrainerId) {
        return (
            (!!currentTrainerId &&
                reportTrainerId === currentTrainerId) ||
            (!!currentUserId &&
                reportTrainerId === currentUserId)
        );
    }

    // Existing trainer-reports data stores the trainer in "name".
    if (currentTrainerName && reportTrainerName) {
        return reportTrainerName === currentTrainerName;
    }

    // Last fallback for legacy rows without trainer name.
    const reportTaluka = normalize(
        getReportTaluka(report)
    );

    const reportDistrict = normalize(
        getReportDistrict(report)
    );

    if (currentTaluka && currentDistrict) {
        return (
            reportTaluka === currentTaluka &&
            reportDistrict === currentDistrict
        );
    }

    return false;
};


// =====================================================
// COMPONENT
// =====================================================

const TrainerDashboard = () => {


    // =================================================
    // USER
    // =================================================

    const [
        currentUser,
        setCurrentUser,
    ] = useState(
        getCurrentTrainerUser()
    );


    // =================================================
    // REPORTS
    // =================================================

    const [
        reports,
        setReports,
    ] = useState([]);


    // =================================================
    // LOADING
    // =================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    // =================================================
    // SUBMITTING
    // =================================================

    const [
        submitting,
        setSubmitting,
    ] = useState(false);


    // =================================================
    // EXCEL DOWNLOAD
    // =================================================

    const handleDownloadExcel = () => {
        if (!filteredReports.length) {
            setError("No reports available to download.");
            return;
        }

        const escapeHtml = (value) =>
            String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

        const rows = filteredReports.map((report, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(report?.name)}</td>
                <td>${escapeHtml(report?.designation)}</td>
                <td>${escapeHtml(report?.taluka)}</td>
                <td>${escapeHtml(report?.district)}</td>
                <td>${escapeHtml(report?.mobile_number)}</td>
                <td>${escapeHtml(formatDisplayDate(report?.report_date))}</td>
                <td>${escapeHtml(report?.total_authorised_center_heads)}</td>
                <td>${escapeHtml(report?.total_active_center_heads)}</td>
                <td>${escapeHtml(report?.today_visited_center_heads_names)}</td>
                <td>${escapeHtml(report?.total_sanitary_pad_boxes_sold_today ?? report?.totalSanitaryPadBoxesSoldToday)}</td>
                <td>${escapeHtml(report?.total_amount_from_sanitary_pad_sales_today ?? report?.totalAmountFromSanitaryPadSalesToday)}</td>
                <td>${escapeHtml(report?.utr_number ?? report?.utrNumber)}</td>
                <td>${escapeHtml(report?.total_center_heads_visited_today)}</td>
                <td>${escapeHtml(report?.todays_new_members)}</td>
                <td>${escapeHtml(report?.additional_remarks)}</td>
                <td>${escapeHtml(report?.status)}</td>
            </tr>
        `).join("");

        const excelHtml = `
            <html>
                <head>
                    <meta charset="UTF-8" />
                    <style>
                        table { border-collapse: collapse; }
                        th, td { border: 1px solid #999; padding: 6px; }
                        th { font-weight: bold; background: #eeeeee; }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th>SR</th>
                                <th>Name</th>
                                <th>Designation</th>
                                <th>Taluka</th>
                                <th>District</th>
                                <th>Mobile Number</th>
                                <th>Report Date</th>
                                <th>Authorised Center Heads</th>
                                <th>Active Center Heads</th>
                                <th>Today's Visited Center Heads</th>
                                <th>Total Sanitary Pads Box Sold Today</th>
                                <th>Total Amount from Sanitary Pad Box Sales Today</th>
                                <th>UTR Number</th>
                                <th>Total Visited</th>
                                <th>New Members</th>
                                <th>Additional Remarks</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </body>
            </html>
        `;

        const blob = new Blob(["\ufeff", excelHtml], {
            type: "application/vnd.ms-excel;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const today = new Date().toISOString().slice(0, 10);

        link.href = url;
        link.download = `Trainer_Reports_${today}.xls`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };


    // =================================================
    // DELETE
    // =================================================

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);


    // =================================================
    // ERROR
    // =================================================

    const [
        error,
        setError,
    ] = useState("");


    // =================================================
    // SUCCESS
    // =================================================

    const [
        success,
        setSuccess,
    ] = useState("");


    // =================================================
    // ADD / EDIT MODAL
    // =================================================

    const [
        showModal,
        setShowModal,
    ] = useState(false);


    // =================================================
    // IMAGE MODAL
    // =================================================

    const [
        showImageModal,
        setShowImageModal,
    ] = useState(false);


    const [
        selectedImage,
        setSelectedImage,
    ] = useState("");


    const [
        selectedImageTitle,
        setSelectedImageTitle,
    ] = useState("");


    // =================================================
    // SEARCH
    // =================================================

    const [
        search,
        setSearch,
    ] = useState("");

    // Separate Bootstrap-style filters
    const [filterName, setFilterName] = useState("");
    const [filterTaluka, setFilterTaluka] = useState("");
    const [filterDistrict, setFilterDistrict] = useState("");
    const [filterMobile, setFilterMobile] = useState("");
    const [filterDate, setFilterDate] = useState("");


    // =================================================
    // EDIT
    // =================================================

    const [
        editingId,
        setEditingId,
    ] = useState(null);


    // =================================================
    // OLD PHOTO
    // =================================================

    const [
        oldPhoto1,
        setOldPhoto1,
    ] = useState("");


    const [
        oldPhoto2,
        setOldPhoto2,
    ] = useState("");


    // =================================================
    // FORM
    // =================================================

    const [
        formData,
        setFormData,
    ] = useState({
        ...EMPTY_FORM,
    });


    // =================================================
    // USER DETAILS
    // =================================================

    const trainerName =

        currentUser?.trainerName ||

        currentUser?.trainer ||

        currentUser?.name ||

        currentUser?.fullName ||

        "Trainer";


    const talukaName =

        currentUser?.taluka ||

        currentUser?.talukaName ||

        localStorage.getItem(
            "logged_in_taluka_name"
        ) ||

        "";


    const districtName =

        currentUser?.district ||

        currentUser?.districtName ||

        localStorage.getItem(
            "logged_in_district_name"
        ) ||

        "";


    // =================================================
    // LOAD REPORTS
    // =================================================

    const fetchTrainerReports =
        async () => {

            try {

                setLoading(true);

                setError("");


                // =============================================
                // API REQUEST
                // =============================================

                console.log(
                    "FETCHING TRAINER REPORTS:",
                    TRAINER_REPORTS_API
                );

                const response =
                    await fetch(
                        TRAINER_REPORTS_API,
                        {
                            method: "GET",
                            headers: {
                                Accept:
                                    "application/json",
                            },
                            cache: "no-store",
                        }
                    );

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";

                const data =
                    contentType.includes(
                        "application/json"
                    )
                        ? await response.json()
                        : {
                              message:
                                  await response.text(),
                          };

                console.log(
                    "TRAINER REPORTS API STATUS:",
                    response.status,
                    data
                );

                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        data?.error ||
                        `Trainer reports API returned HTTP ${response.status}`
                    );

                }


                const rows =

                    data?.reports ||

                    data?.data ||

                    [];


                const reportRows = Array.isArray(rows)
                    ? rows
                    : [];

                // =====================================================
                // CURRENT TRAINER REPORTS ONLY
                // =====================================================
                // The API can return all trainer reports. This dashboard
                // must show only the reports belonging to the logged-in
                // trainer.
                //
                // Matching priority:
                // 1. trainer_id / user_id when available
                // 2. trainer name for existing legacy rows
                // 3. taluka + district as a last legacy fallback
                // =====================================================

                const activeUser =
                    getCurrentTrainerUser();

                setCurrentUser(activeUser);

                const myTrainerReports =
                    reportRows.filter(
                        (report) =>
                            isReportForCurrentTrainer(
                                report,
                                activeUser
                            )
                    );

                console.log(
                    "ALL TRAINER REPORTS FROM DATABASE:",
                    reportRows
                );

                console.log(
                    "CURRENT TRAINER:",
                    activeUser
                );

                console.log(
                    "MY TRAINER REPORT COUNT:",
                    myTrainerReports.length
                );

                console.log(
                    "MY TRAINER REPORTS:",
                    myTrainerReports
                );

                // Only current trainer records are kept in state.
                setReports(myTrainerReports);


            } catch (err) {

                console.error(
                    "FETCH TRAINER REPORTS ERROR:",
                    err
                );


                let friendlyMessage =
                    err?.message ||
                    "Unable to load Trainer reports.";

                if (
                    err?.message ===
                    "Failed to fetch"
                ) {
                    friendlyMessage =
                        `Unable to connect to Trainer Reports API. Please check backend/CORS. API: ${TRAINER_REPORTS_API}`;
                }

                setError(
                    friendlyMessage
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

        setCurrentUser(
            getCurrentTrainerUser()
        );

        fetchTrainerReports();

    }, []);


    // =================================================
    // SEARCH
    // =================================================

    const filteredReports = useMemo(() => {

        const globalKeyword = normalize(search);
        const nameKeyword = normalize(filterName);
        const talukaKeyword = normalize(filterTaluka);
        const districtKeyword = normalize(filterDistrict);
        const mobileKeyword = normalize(filterMobile);

        return reports.filter((report) => {
            const reportDate = getInputDate(report?.report_date);

            const matchesGlobal = !globalKeyword || [
                report?.name,
                report?.designation,
                report?.taluka,
                report?.district,
                report?.mobile_number,
                report?.report_date,
                report?.total_sanitary_pad_boxes_sold_today,
                report?.totalSanitaryPadBoxesSoldToday,
                report?.total_amount_from_sanitary_pad_sales_today,
                report?.totalAmountFromSanitaryPadSalesToday,
                report?.utr_number,
                report?.utrNumber,
                report?.additional_remarks,
                report?.status,
            ].some((value) =>
                normalize(value).includes(globalKeyword)
            );

            const matchesName = !nameKeyword ||
                normalize(report?.name).includes(nameKeyword);

            const matchesTaluka = !talukaKeyword ||
                normalize(report?.taluka).includes(talukaKeyword);

            const matchesDistrict = !districtKeyword ||
                normalize(report?.district).includes(districtKeyword);

            const matchesMobile = !mobileKeyword ||
                normalize(report?.mobile_number).includes(mobileKeyword);

            const matchesDate = !filterDate ||
                reportDate === filterDate;

            return (
                matchesGlobal &&
                matchesName &&
                matchesTaluka &&
                matchesDistrict &&
                matchesMobile &&
                matchesDate
            );
        });
    }, [
        reports,
        search,
        filterName,
        filterTaluka,
        filterDistrict,
        filterMobile,
        filterDate,
    ]);

    const clearAllFilters = () => {
        setSearch("");
        setFilterName("");
        setFilterTaluka("");
        setFilterDistrict("");
        setFilterMobile("");
        setFilterDate("");
    };


    // =================================================
    // INPUT CHANGE
    // =================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
            files,
            type,
        } = event.target;


        // =============================================
        // FILE
        // =============================================

        if (
            type === "file"
        ) {

            const file =
                files?.[0] ||
                null;


            if (!file) {

                setFormData(
                    (prev) => ({
                        ...prev,
                        [name]: null,
                    })
                );

                return;

            }


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

                alert(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                );

                event.target.value =
                    "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                alert(
                    "Photo size must be less than 10 MB."
                );

                event.target.value =
                    "";

                return;

            }


            setFormData(
                (prev) => ({
                    ...prev,
                    [name]: file,
                })
            );


            return;

        }


        // =============================================
        // NORMAL INPUT
        // =============================================

        setFormData(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );

    };


    // =================================================
    // OPEN ADD MODAL
    // =================================================

    const handleAddReport = () => {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        setEditingId(null);

        setOldPhoto1("");

        setOldPhoto2("");


        setFormData({

            ...EMPTY_FORM,

            name:
                trainerName,

            designation:
                "Trainer",

            taluka:
                talukaName,

            district:
                districtName,

            reportDate:
                today,

        });


        setError("");

        setSuccess("");

        setShowModal(true);

    };


    // =================================================
    // EDIT
    // =================================================

    const handleEdit = (
        report
    ) => {

        setEditingId(
            report.id
        );


        setOldPhoto1(
            getPhoto1(
                report
            )
        );


        setOldPhoto2(
            getPhoto2(
                report
            )
        );


        setFormData({

            name:
                report.name ||
                "",


            designation:
                report.designation ||
                "",


            taluka:
                report.taluka ||
                "",


            district:
                report.district ||
                "",


            mobileNumber:

                report.mobile_number ??

                report.mobileNumber ??

                "",


            reportDate:

                getInputDate(

                    report.report_date ??

                    report.reportDate

                ),


            totalAuthorisedCenterHeads:

                report.total_authorised_center_heads ??

                report.totalAuthorisedCenterHeads ??

                "",


            totalActiveCenterHeads:

                report.total_active_center_heads ??

                report.totalActiveCenterHeads ??

                "",


            todayVisitedCenterHeadsNames:

                report.today_visited_center_heads_names ??

                report.todayVisitedCenterHeadsNames ??

                "",


            totalSanitaryPadBoxesSoldToday:

                report.total_sanitary_pad_boxes_sold_today ??

                report.totalSanitaryPadBoxesSoldToday ??

                "",


            totalAmountFromSanitaryPadSalesToday:

                report.total_amount_from_sanitary_pad_sales_today ??

                report.totalAmountFromSanitaryPadSalesToday ??

                "",


            utrNumber:

                report.utr_number ??

                report.utrNumber ??

                "",


            totalCenterHeadsVisitedToday:

                report.total_center_heads_visited_today ??

                report.totalCenterHeadsVisitedToday ??

                "",


            todaysNewMembers:

                report.todays_new_members ??

                report.todaysNewMembers ??

                "",


            additionalRemarks:

                report.additional_remarks ??

                report.additionalRemarks ??

                "",


            meetingPhoto1:
                null,


            meetingPhoto2:
                null,

        });


        setError("");

        setSuccess("");

        setShowModal(true);

    };


    // =================================================
    // CLOSE MODAL
    // =================================================

    const handleClose = () => {

        if (
            submitting
        ) {
            return;
        }


        setShowModal(false);

        setEditingId(null);

        setOldPhoto1("");

        setOldPhoto2("");


        setFormData({
            ...EMPTY_FORM,
        });

    };


    // =================================================
    // VIEW IMAGE
    // =================================================

    const handleViewImage = (
        image,
        title
    ) => {

        const url =
            getImageUrl(
                image
            );


        if (!url) {
            return;
        }


        setSelectedImage(
            url
        );


        setSelectedImageTitle(
            title ||
            "Meeting Photo"
        );


        setShowImageModal(true);

    };


    // =================================================
    // CLOSE IMAGE
    // =================================================

    const handleCloseImage = () => {

        setShowImageModal(false);

        setSelectedImage("");

        setSelectedImageTitle("");

    };


    // =================================================
    // VALIDATION
    // =================================================

    const validateForm = () => {

        if (
            !formData.name.trim()
        ) {

            return "Please enter Trainer Name.";

        }


        if (
            !formData.designation.trim()
        ) {

            return "Please enter Designation.";

        }


        if (
            !formData.taluka.trim()
        ) {

            return "Please enter Taluka.";

        }


        if (
            !formData.district.trim()
        ) {

            return "Please enter District.";

        }


        if (
            !/^[0-9]{10}$/.test(
                formData.mobileNumber.trim()
            )
        ) {

            return "Mobile Number must be exactly 10 digits.";

        }


        if (
            !formData.reportDate
        ) {

            return "Please select Report Date.";

        }


        const authorised =
            Number(
                formData.totalAuthorisedCenterHeads
            );


        const active =
            Number(
                formData.totalActiveCenterHeads
            );


        const sanitaryPadBoxesSold =
            Number(
                formData.totalSanitaryPadBoxesSoldToday
            );


        const totalSanitaryPadAmount =
            Number(
                formData.totalAmountFromSanitaryPadSalesToday
            );


        const visited =
            Number(
                formData.totalCenterHeadsVisitedToday
            );


        const newMembers =
            Number(
                formData.todaysNewMembers
            );


        if (
            !Number.isFinite(
                authorised
            ) ||
            authorised < 0
        ) {

            return "Total Authorised Center Heads is invalid.";

        }


        if (
            !Number.isFinite(
                active
            ) ||
            active < 0 ||
            active > authorised
        ) {

            return "Active Center Heads cannot be greater than Authorised Center Heads.";

        }


        if (
            !Number.isFinite(
                sanitaryPadBoxesSold
            ) ||
            sanitaryPadBoxesSold < 0
        ) {

            return "Total Sanitary Pads Box Sold Today is invalid.";

        }


        if (
            !Number.isFinite(
                totalSanitaryPadAmount
            ) ||
            totalSanitaryPadAmount < 0
        ) {

            return "Total Amount from Sanitary Pad Box Sales Today is invalid.";

        }


        if (!formData.utrNumber.trim()) {

            return "Please enter UTR Number.";

        }


        if (
            !Number.isFinite(
                visited
            ) ||
            visited < 0 ||
            visited > active
        ) {

            return "Total Center Heads Visited Today cannot be greater than Active Center Heads.";

        }


        if (
            !Number.isFinite(
                newMembers
            ) ||
            newMembers < 0
        ) {

            return "Today's New Members is invalid.";

        }


        return "";

    };


    // =================================================
    // SUBMIT
    // =================================================

    const handleSubmit =
        async (
            event
        ) => {

            event.preventDefault();


            const validationError =
                validateForm();


            if (
                validationError
            ) {

                setError(
                    validationError
                );

                return;

            }


            try {

                setSubmitting(true);

                setError("");

                setSuccess("");


                // =====================================
                // FORMDATA
                // =====================================

                const data =
                    new FormData();


                // =====================================
                // BASIC
                // =====================================

                // Trainer identity is controlled by the logged-in user.
                // Do not allow another trainer/taluka/district to be submitted
                // from this dashboard.
                const lockedTrainerName =
                    trainerName ||
                    formData.name.trim();

                const lockedDesignation =
                    currentUser?.designation ||
                    "Trainer";

                const lockedTaluka =
                    talukaName ||
                    formData.taluka.trim();

                const lockedDistrict =
                    districtName ||
                    formData.district.trim();

                data.append(
                    "name",
                    lockedTrainerName.trim()
                );


                data.append(
                    "designation",
                    lockedDesignation.trim()
                );


                data.append(
                    "taluka",
                    lockedTaluka.trim()
                );


                data.append(
                    "district",
                    lockedDistrict.trim()
                );

                // =====================================================
                // LOGGED-IN TRAINER IDENTITY
                // =====================================================
                // Send stable IDs when available so future reports can
                // always be matched to the correct logged-in trainer.
                const loggedInTrainerId =
                    String(
                        currentUser?.trainerId ??
                        currentUser?.trainerID ??
                        currentUser?.trainer_id ??
                        localStorage.getItem(
                            "logged_in_trainer_id"
                        ) ??
                        ""
                    ).trim();

                const loggedInUserId =
                    String(
                        currentUser?.id ??
                        currentUser?.userId ??
                        currentUser?.user_id ??
                        localStorage.getItem(
                            "logged_in_user_id"
                        ) ??
                        ""
                    ).trim();

                if (loggedInTrainerId) {
                    data.append(
                        "trainer_id",
                        loggedInTrainerId
                    );
                }

                if (loggedInUserId) {
                    data.append(
                        "user_id",
                        loggedInUserId
                    );
                }

                data.append(
                    "mobile_number",
                    formData.mobileNumber.trim()
                );


                data.append(
                    "report_date",
                    formData.reportDate
                );


                // =====================================
                // CENTER HEADS
                // =====================================

                data.append(
                    "total_authorised_center_heads",
                    Number(
                        formData.totalAuthorisedCenterHeads
                    ) || 0
                );


                data.append(
                    "total_active_center_heads",
                    Number(
                        formData.totalActiveCenterHeads
                    ) || 0
                );


                data.append(
                    "today_visited_center_heads_names",
                    formData
                        .todayVisitedCenterHeadsNames
                        .trim()
                );


                data.append(
                    "total_sanitary_pad_boxes_sold_today",
                    Number(
                        formData.totalSanitaryPadBoxesSoldToday
                    ) || 0
                );


                data.append(
                    "total_amount_from_sanitary_pad_sales_today",
                    Number(
                        formData.totalAmountFromSanitaryPadSalesToday
                    ) || 0
                );


                data.append(
                    "utr_number",
                    formData.utrNumber.trim()
                );


                data.append(
                    "total_center_heads_visited_today",
                    Number(
                        formData.totalCenterHeadsVisitedToday
                    ) || 0
                );


                data.append(
                    "todays_new_members",
                    Number(
                        formData.todaysNewMembers
                    ) || 0
                );


                // =====================================
                // REMARKS
                // =====================================

                data.append(
                    "additional_remarks",
                    formData
                        .additionalRemarks
                        .trim()
                );


                // =====================================
                // PHOTO 1
                // =====================================

                if (
                    formData.meetingPhoto1
                ) {

                    data.append(
                        "meeting_photo_1",
                        formData.meetingPhoto1
                    );

                }


                // =====================================
                // PHOTO 2
                // =====================================

                if (
                    formData.meetingPhoto2
                ) {

                    data.append(
                        "meeting_photo_2",
                        formData.meetingPhoto2
                    );

                }


                // =====================================
                // URL
                // =====================================

                const url =
                    editingId
                        ? `${TRAINER_REPORTS_API}/${editingId}`
                        : TRAINER_REPORTS_API;


                // =====================================
                // METHOD
                // =====================================

                const method =
                    editingId
                        ? "PUT"
                        : "POST";


                // =====================================
                // REQUEST
                // =====================================

                const response =
                    await fetch(
                        url,
                        {
                            method,
                            body: data,
                        }
                    );


                const contentType =
                    response.headers.get("content-type") || "";

                const result = contentType.includes("application/json")
                    ? await response.json()
                    : {
                          message:
                              await response.text(),
                      };


                console.log(
                    "TRAINER REPORT RESPONSE:",
                    result
                );


                if (
                    !response.ok ||
                    result?.success === false
                ) {

                    throw new Error(
                        result?.message ||
                        (
                            editingId
                                ? "Failed to update Trainer report."
                                : "Failed to create Trainer report."
                        )
                    );

                }


                // =====================================
                // SUCCESS
                // =====================================

                setSuccess(
                    editingId
                        ? "Trainer Report Updated Successfully."
                        : "Trainer Report Added Successfully."
                );


                setShowModal(false);

                setEditingId(null);

                setOldPhoto1("");

                setOldPhoto2("");

                setFormData({
                    ...EMPTY_FORM,
                });


                await fetchTrainerReports();


            } catch (err) {

                console.error(
                    "TRAINER REPORT SAVE ERROR:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to save Trainer report."
                );

            } finally {

                setSubmitting(false);

            }

        };


    // =================================================
    // DELETE
    // =================================================

    const handleDelete =
        async (
            id
        ) => {

            const confirmDelete =
                window.confirm(
                    "Are you sure you want to delete this Trainer report?"
                );


            if (!confirmDelete) {
                return;
            }


            try {

                setDeletingId(id);

                setError("");

                setSuccess("");


                const response =
                    await fetch(
                        `${TRAINER_REPORTS_API}/${id}`,
                        {
                            method:
                                "DELETE",
                        }
                    );


                const contentType =
                    response.headers.get("content-type") || "";

                const result = contentType.includes("application/json")
                    ? await response.json()
                    : {
                          message:
                              await response.text(),
                      };


                if (
                    !response.ok ||
                    result?.success === false
                ) {

                    throw new Error(
                        result?.message ||
                        "Failed to delete Trainer report."
                    );

                }


                setSuccess(
                    "Trainer Report Deleted Successfully."
                );


                await fetchTrainerReports();


            } catch (err) {

                console.error(
                    "DELETE TRAINER REPORT ERROR:",
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
    // RENDER
    // =================================================

    return (

        <div className="container-fluid px-0 trainer-page">


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
                        Manage BDO (business development officers) reports
                    </p>

                    <div className="d-flex flex-wrap gap-2 mt-2">
                        <span className="badge bg-dark">
                            BDO (business development officers): {trainerName}
                        </span>

                        {talukaName && (
                            <span className="badge bg-secondary">
                                Taluka: {talukaName}
                            </span>
                        )}

                        {districtName && (
                            <span className="badge bg-secondary">
                                District: {districtName}
                            </span>
                        )}
                    </div>

                </div>


                <div className="d-grid d-sm-flex gap-2 w-100 w-md-auto trainer-header-actions">

                    <Button
                        variant="dark"
                        className="px-4"
                        onClick={handleAddReport}
                    >
                        + Add Report (अहवाल जोडा)
                    </Button>

                    <Button
                        variant="outline-success"
                        className="px-4"
                        onClick={handleDownloadExcel}
                        disabled={filteredReports.length === 0}
                    >
                        Download Excel
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
                COUNT CARD
            ================================================= */}

            <div className="card border-0 shadow-sm mb-4 trainer-count-card">

                <div className="card-body">

                    <div className="d-flex align-items-center gap-3">

                        <div
                            className="
                                rounded-circle
                                bg-dark
                                text-white
                                d-flex
                                align-items-center
                                justify-content-center
                                fw-bold
                            "
                            style={{
                                width: 55,
                                height: 55,
                            }}
                        >
                            {reports.length}
                        </div>


                        <div>

                            <div className="text-muted small">
                                My BDO (business development officers) Reports
                            </div>

                            <h5 className="fw-bold mb-0">
                                {reports.length}
                            </h5>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="card border-0 shadow-sm mb-4 trainer-filter-card">
                <div className="card-body">
                    <Row className="g-3">
                        <Col xs={12} md={6} lg={3}>
                            <Form.Label className="fw-semibold">Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search Name..."
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Form.Label className="fw-semibold">Taluka</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search Taluka..."
                                value={filterTaluka}
                                onChange={(e) => setFilterTaluka(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Form.Label className="fw-semibold">District</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search District..."
                                value={filterDistrict}
                                onChange={(e) => setFilterDistrict(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Form.Label className="fw-semibold">Report Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Form.Label className="fw-semibold">Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                inputMode="numeric"
                                placeholder="Search Mobile..."
                                value={filterMobile}
                                onChange={(e) => setFilterMobile(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={6} lg={6}>
                            <Form.Label className="fw-semibold">Search</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search all report fields..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Col>

                        <Col xs={12} md={6} lg={3} className="d-flex align-items-end">
                            <Button
                                variant="outline-secondary"
                                className="w-100"
                                onClick={clearAllFilters}
                            >
                                Clear Filters
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <h6 className="fw-bold mb-0">
                            BDO (business development officers) Report List
                        </h6>

                        <span className="badge bg-dark">
                            {filteredReports.length} Records
                        </span>

                    </div>

                </div>


                <div className="card-body p-0">

                    <div
                        className="table-responsive trainer-table-wrap"
                        style={{
                            maxHeight:
                                "calc(100vh - 330px)",
                            overflowX:
                                "auto",
                            overflowY:
                                "auto",
                        }}
                    >

                        <table
                            className="
                                table
                                table-hover
                                table-bordered
                                align-middle
                                mb-0
                                trainer-table
                            "
                            style={{
                                minWidth:
                                    "3000px",
                            }}
                        >

                            <thead
                                className="table-light"
                                style={{
                                    position:
                                        "sticky",
                                    top: 0,
                                    zIndex: 10,
                                }}
                            >

                                <tr>

                                    <th className="text-center">
                                        SR
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Designation
                                    </th>

                                    <th>
                                        Taluka
                                    </th>

                                    <th>
                                        District
                                    </th>

                                    <th>
                                        Mobile Number
                                    </th>

                                    <th>
                                        Report Date
                                    </th>

                                    <th className="text-center">
                                        Authorised Center Heads
                                    </th>

                                    <th className="text-center">
                                        Active Center Heads
                                    </th>

                                    <th>
                                        Today's Visited Center Heads
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
                                        Total Visited
                                    </th>

                                    <th className="text-center">
                                        New Members
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
                                        Action
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

                                            Loading Trainer reports...

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
                                                No BDO (business development officers) reports found.
                                            </td>

                                        </tr>

                                    )}


                                {!loading &&
                                    filteredReports.map(
                                        (
                                            report,
                                            index
                                        ) => {

                                            const photo1 =
                                                getPhoto1(
                                                    report
                                                );

                                            const photo2 =
                                                getPhoto2(
                                                    report
                                                );


                                            const image1 =
                                                getImageUrl(
                                                    photo1
                                                );

                                            const image2 =
                                                getImageUrl(
                                                    photo2
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        report.id ??
                                                        index
                                                    }
                                                >

                                                    <td className="text-center">
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
                                                        {formatDisplayDate(
                                                            report.report_date
                                                        )}
                                                    </td>


                                                    <td className="text-center">
                                                        {
                                                            report.total_authorised_center_heads ??
                                                            0
                                                        }
                                                    </td>


                                                    <td className="text-center">
                                                        {
                                                            report.total_active_center_heads ??
                                                            0
                                                        }
                                                    </td>


                                                    <td
                                                        style={{
                                                            minWidth:
                                                                "280px",
                                                            whiteSpace:
                                                                "normal",
                                                        }}
                                                    >
                                                        {
                                                            report.today_visited_center_heads_names ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td className="text-center">
                                                        {
                                                            report.total_sanitary_pad_boxes_sold_today ??
                                                            report.totalSanitaryPadBoxesSoldToday ??
                                                            0
                                                        }
                                                    </td>


                                                    <td className="text-center">
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


                                                    <td className="text-center">
                                                        {
                                                            report.total_center_heads_visited_today ??
                                                            0
                                                        }
                                                    </td>


                                                    <td className="text-center">
                                                        {
                                                            report.todays_new_members ??
                                                            0
                                                        }
                                                    </td>


                                                    <td
                                                        style={{
                                                            minWidth:
                                                                "250px",
                                                            whiteSpace:
                                                                "normal",
                                                        }}
                                                    >
                                                        {
                                                            report.additional_remarks ||
                                                            "-"
                                                        }
                                                    </td>


                                                    {/* PHOTO 1 */}

                                                    <td className="text-center">

                                                        {image1 ? (

                                                            <div>

                                                                <img
                                                                    src={
                                                                        image1
                                                                    }
                                                                    alt="Meeting Photo 1"
                                                                    style={{
                                                                        width:
                                                                            75,
                                                                        height:
                                                                            60,
                                                                        objectFit:
                                                                            "cover",
                                                                        borderRadius:
                                                                            6,
                                                                        border:
                                                                            "1px solid #ddd",
                                                                        cursor:
                                                                            "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleViewImage(
                                                                            photo1,
                                                                            "Meeting Photo 1"
                                                                        )
                                                                    }
                                                                    onError={(
                                                                        e
                                                                    ) => {
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
                                                                            handleViewImage(
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

                                                        {image2 ? (

                                                            <div>

                                                                <img
                                                                    src={
                                                                        image2
                                                                    }
                                                                    alt="Meeting Photo 2"
                                                                    style={{
                                                                        width:
                                                                            75,
                                                                        height:
                                                                            60,
                                                                        objectFit:
                                                                            "cover",
                                                                        borderRadius:
                                                                            6,
                                                                        border:
                                                                            "1px solid #ddd",
                                                                        cursor:
                                                                            "pointer",
                                                                    }}
                                                                    onClick={() =>
                                                                        handleViewImage(
                                                                            photo2,
                                                                            "Meeting Photo 2"
                                                                        )
                                                                    }
                                                                    onError={(
                                                                        e
                                                                    ) => {
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
                                                                            handleViewImage(
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

                                                    <td className="text-center">

                                                        <span className="badge bg-success">
                                                            {
                                                                report.status ||
                                                                "active"
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td className="text-center">

                                                        <div
                                                            className="
                                                                d-flex
                                                                gap-2
                                                                justify-content-center
                                                            "
                                                        >

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
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Modal.Header
                        closeButton
                        className="bg-white"
                    >

                        <Modal.Title className="fw-bold">
                            {editingId
                                ? "Edit Trainer Report (प्रशिक्षक अहवाल संपादित करा)"
                                : "BDO Report format (गटविकास अधिकारी (BDO) अहवालाचा नमुना)"}
                        </Modal.Title>

                    </Modal.Header>


                    <Modal.Body
                        style={{
                            maxHeight: "calc(100vh - 180px)",
                            overflowY: "auto",
                        }}
                    >

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                            Basic Information (मूलभूत माहिती)
                        </h5>


                        <Row className="g-3">


                            {/* NAME */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Trainer Name (नाव) *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        readOnly
                                        className="bg-light"
                                        placeholder="नाव"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* DESIGNATION */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Designation (पद) *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        readOnly
                                        className="bg-light"
                                        placeholder="पद"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* TALUKA */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Taluka (तालुका) *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="taluka"
                                        value={formData.taluka}
                                        onChange={handleChange}
                                        readOnly
                                        className="bg-light"
                                        placeholder="तालुका"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* DISTRICT */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        District (जिल्हा) *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        readOnly
                                        className="bg-light"
                                        placeholder="जिल्हा"
                                        required
                                    />

                                    <Form.Text className="text-muted">
                                        BDO (business development officers), Taluka and District are locked to the logged-in account.
                                    </Form.Text>

                                </Form.Group>

                            </Col>


                            {/* MOBILE */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Mobile Number (मोबाईल क्रमांक) *
                                    </Form.Label>

                                    <Form.Control
                                        type="tel"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        maxLength="10"
                                        placeholder="१० अंकी मोबाईल क्रमांक"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* DATE */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Report Date (अहवालाची तारीख) *
                                    </Form.Label>

                                    <Form.Control
                                        type="date"
                                        name="reportDate"
                                        value={formData.reportDate}
                                        onChange={handleChange}
                                        required
                                    />

                                </Form.Group>

                            </Col>

                        </Row>


                        <hr className="my-4" />


                        {/* =================================================
                            CENTER HEADS
                        ================================================= */}

                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                            Center Head Details (केंद्र प्रमुख तपशील)
                        </h5>


                        <Row className="g-3">


                            {/* AUTHORISED CENTER HEADS */}

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Total Authorised Center Heads (अधिकृत केंद्र प्रमुखांची एकूण संख्या) *
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="totalAuthorisedCenterHeads"
                                        value={formData.totalAuthorisedCenterHeads}
                                        onChange={handleChange}
                                        placeholder="अधिकृत केंद्र प्रमुखांची संख्या"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* ACTIVE CENTER HEADS */}

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Total Active Center Heads (सक्रिय केंद्र प्रमुखांची एकूण संख्या) *
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="totalActiveCenterHeads"
                                        value={formData.totalActiveCenterHeads}
                                        onChange={handleChange}
                                        placeholder="सक्रिय केंद्र प्रमुखांची संख्या"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* SANITARY PADS BOX SOLD */}

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Total Sanitary Pads Box Sold Today (आज विकलेले एकूण सॅनिटरी पॅड बॉक्स) *
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="totalSanitaryPadBoxesSoldToday"
                                        value={formData.totalSanitaryPadBoxesSoldToday}
                                        onChange={handleChange}
                                        placeholder="पॅड बॉक्स संख्या"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* SALES AMOUNT */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Total Amount from Sanitary Pad Box Sales Today (आजच्या सॅनिटरी पॅड बॉक्स विक्रीतून एकूण रक्कम) *
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="totalAmountFromSanitaryPadSalesToday"
                                        value={formData.totalAmountFromSanitaryPadSalesToday}
                                        onChange={handleChange}
                                        placeholder="एकूण रक्कम"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* UTR NUMBER */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        UTR Number (युटीआर क्रमांक) *
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="utrNumber"
                                        value={formData.utrNumber}
                                        onChange={handleChange}
                                        placeholder="UTR क्रमांक प्रविष्ट करा"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* VISITED CENTER HEADS COUNT */}

                            <Col xs={12} md={4}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Total Center Heads Visited Today (आज भेट दिलेले एकूण केंद्र प्रमुख) *
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="totalCenterHeadsVisitedToday"
                                        value={formData.totalCenterHeadsVisitedToday}
                                        onChange={handleChange}
                                        placeholder="भेट दिलेले केंद्र प्रमुख संख्या"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* VISITED CENTER HEADS NAMES */}

                            <Col xs={12}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Today's Visited Center Heads Names (आज भेट दिलेल्या केंद्र प्रमुखांची नावे) *
                                    </Form.Label>

                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="todayVisitedCenterHeadsNames"
                                        value={formData.todayVisitedCenterHeadsNames}
                                        onChange={handleChange}
                                        placeholder="आज भेट दिलेल्या केंद्र प्रमुखांची नावे प्रविष्ट करा..."
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* TODAY'S NEW MEMBERS */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Today's New Members (आज जोडलेले नवीन सदस्य) *
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="0"
                                        name="todaysNewMembers"
                                        value={formData.todaysNewMembers}
                                        onChange={handleChange}
                                        placeholder="नवीन सदस्य संख्या"
                                        required
                                    />

                                </Form.Group>

                            </Col>


                            {/* ADDITIONAL REMARKS */}

                            <Col xs={12}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Additional Remarks (इतर माहिती / शेरा)
                                    </Form.Label>

                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="additionalRemarks"
                                        value={formData.additionalRemarks}
                                        onChange={handleChange}
                                        placeholder="इतर माहिती / शेरा प्रविष्ट करा..."
                                    />

                                </Form.Group>

                            </Col>

                        </Row>


                        <hr className="my-4" />


                        {/* =================================================
                            PHOTOS
                        ================================================= */}

                        <h5 className="fw-bold border-bottom pb-2 mb-3">
                            Meeting Photos (बैठकीचे फोटो)
                        </h5>


                        <Row className="g-4">


                            {/* PHOTO 1 */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Meeting Photo 1 (बैठक फोटो १)
                                        {!editingId && " *"}
                                    </Form.Label>

                                    <Form.Control
                                        type="file"
                                        name="meetingPhoto1"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleChange}
                                    />

                                    <Form.Text className="text-muted">
                                        JPG, JPEG, PNG or WEBP — Maximum 10MB
                                    </Form.Text>


                                    {/* OLD */}

                                    {editingId && oldPhoto1 && !formData.meetingPhoto1 && (

                                        <div className="mt-3">

                                            <small className="text-muted d-block fw-bold mb-2">
                                                Current Photo 1 (सध्याचा फोटो १)
                                            </small>

                                            <img
                                                src={getImageUrl(oldPhoto1)}
                                                alt="Current Photo 1"
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                }}
                                            />

                                            <div className="mt-2">

                                                <Button
                                                    size="sm"
                                                    variant="outline-dark"
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewImage(
                                                            oldPhoto1,
                                                            "Current Meeting Photo 1"
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                            </div>

                                        </div>

                                    )}


                                    {/* NEW */}

                                    {formData.meetingPhoto1 && (

                                        <div className="mt-3">

                                            <small className="text-success d-block fw-bold mb-2">
                                                New Photo 1 (नवीन फोटो १)
                                            </small>

                                            <img
                                                src={URL.createObjectURL(formData.meetingPhoto1)}
                                                alt="New Photo 1"
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                }}
                                            />

                                        </div>

                                    )}


                                    {editingId && (

                                        <Form.Text className="text-muted d-block mt-2">
                                            New photo select केली नाही तर जुना photo कायम राहील.
                                        </Form.Text>

                                    )}

                                </Form.Group>

                            </Col>


                            {/* PHOTO 2 */}

                            <Col xs={12} md={6}>

                                <Form.Group>

                                    <Form.Label className="fw-semibold">
                                        Meeting Photo 2 (बैठक फोटो २)
                                        {!editingId && " *"}
                                    </Form.Label>

                                    <Form.Control
                                        type="file"
                                        name="meetingPhoto2"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleChange}
                                    />

                                    <Form.Text className="text-muted">
                                        JPG, JPEG, PNG or WEBP — Maximum 10MB
                                    </Form.Text>


                                    {/* OLD */}

                                    {editingId && oldPhoto2 && !formData.meetingPhoto2 && (

                                        <div className="mt-3">

                                            <small className="text-muted d-block fw-bold mb-2">
                                                Current Photo 2 (सध्याचा फोटो २)
                                            </small>

                                            <img
                                                src={getImageUrl(oldPhoto2)}
                                                alt="Current Photo 2"
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                }}
                                            />

                                            <div className="mt-2">

                                                <Button
                                                    size="sm"
                                                    variant="outline-dark"
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewImage(
                                                            oldPhoto2,
                                                            "Current Meeting Photo 2"
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                            </div>

                                        </div>

                                    )}


                                    {/* NEW */}

                                    {formData.meetingPhoto2 && (

                                        <div className="mt-3">

                                            <small className="text-success d-block fw-bold mb-2">
                                                New Photo 2 (नवीन फोटो २)
                                            </small>

                                            <img
                                                src={URL.createObjectURL(formData.meetingPhoto2)}
                                                alt="New Photo 2"
                                                style={{
                                                    width: 150,
                                                    height: 100,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    border: "1px solid #ddd",
                                                }}
                                            />

                                        </div>

                                    )}


                                    {editingId && (

                                        <Form.Text className="text-muted d-block mt-2">
                                            New photo select केली नाही तर जुना photo कायम राहील.
                                        </Form.Text>

                                    )}

                                </Form.Group>

                            </Col>

                        </Row>

                    </Modal.Body>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <Modal.Footer
                        className="bg-white border-top"
                        style={{
                            position: "sticky",
                            bottom: 0,
                            zIndex: 30,
                        }}
                    >

                        <Button
                            variant="secondary"
                            type="button"
                            onClick={handleClose}
                            disabled={submitting}
                        >
                            Cancel (रद्द करा)
                        </Button>


                        <Button
                            variant="dark"
                            type="submit"
                            disabled={submitting}
                        >

                            {submitting ? (

                                <>
                                    <Spinner
                                        size="sm"
                                        animation="border"
                                        className="me-2"
                                    />

                                    {editingId
                                        ? "Updating..."
                                        : "Saving..."}
                                </>

                            ) : (

                                editingId
                                    ? "Update Report (अद्यतनित करा)"
                                    : "Add Report (जोडा)"

                            )}

                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>


            {/* =================================================
                IMAGE VIEW MODAL
            ================================================= */}

            <Modal
                show={
                    showImageModal
                }
                onHide={
                    handleCloseImage
                }
                centered
                size="lg"
            >

                <Modal.Header
                    closeButton
                >

                    <Modal.Title>
                        {selectedImageTitle}
                    </Modal.Title>

                </Modal.Header>


                <Modal.Body className="text-center p-3">

                    {selectedImage && (

                        <img
                            src={
                                selectedImage
                            }
                            alt={
                                selectedImageTitle
                            }
                            style={{
                                maxWidth:
                                    "100%",
                                maxHeight:
                                    "70vh",
                                objectFit:
                                    "contain",
                                borderRadius:
                                    8,
                            }}
                        />

                    )}

                </Modal.Body>

            </Modal>


            {/* =================================================
                CUSTOM CSS
            ================================================= */}

            <style>{`

                .table-responsive {
                    width: 100%;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    -webkit-overflow-scrolling: touch;
                }

                .table th,
                .table td {
                    font-size: 12px;
                    padding: 9px 10px;
                    vertical-align: middle;
                }

                .table th {
                    white-space: nowrap;
                    font-weight: 700;
                }

                .table td {
                    line-height: 1.4;
                }

                .table-responsive::-webkit-scrollbar {
                    width: 8px;
                    height: 9px;
                }

                .table-responsive::-webkit-scrollbar-track {
                    background: #f1f3f5;
                }

                .table-responsive::-webkit-scrollbar-thumb {
                    background: #adb5bd;
                    border-radius: 10px;
                }

                .table-responsive::-webkit-scrollbar-thumb:hover {
                    background: #6c757d;
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

                @media (max-width: 768px) {

                    .modal-dialog {
                        margin: 8px;
                    }

                    .modal-body {
                        padding: 16px;
                    }

                    .table th,
                    .table td {
                        font-size: 11px;
                    }

                }



                .trainer-page {
                    width: 100%;
                    min-width: 0;
                }

                .trainer-page .trainer-table-wrap {
                    width: 100%;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: thin;
                }

                .trainer-page .trainer-table {
                    min-width: 2100px;
                }

                .trainer-page .trainer-table th,
                .trainer-page .trainer-table td {
                    white-space: nowrap;
                    vertical-align: middle;
                }

                .trainer-page .trainer-filter-card .form-control {
                    min-height: 42px;
                }

                @media (max-width: 991.98px) {
                    .trainer-page .trainer-table-wrap {
                        max-height: 60vh !important;
                    }
                }

                @media (max-width: 767.98px) {
                    .trainer-page {
                        padding-bottom: 20px;
                    }

                    .trainer-page .trainer-header-actions {
                        width: 100%;
                    }

                    .trainer-page .trainer-header-actions .btn {
                        width: 100%;
                    }

                    .trainer-page .trainer-count-card .card-body {
                        padding: 16px;
                    }

                    .trainer-page .trainer-table-wrap {
                        max-height: 55vh !important;
                    }

                    .trainer-page .trainer-table {
                        min-width: 1900px;
                    }
                }
            `}</style>

        </div>

    );

};


export default TrainerDashboard;    