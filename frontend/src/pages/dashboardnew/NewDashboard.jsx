    import React, {
        useEffect,
        useState,
    } from "react";

    import {
        Link,
    } from "react-router-dom";

    import { API_BASE_URL } from "../../config/api";


    // =====================================================
    // NEW DASHBOARD
    // =====================================================

    const NewDashboard = () => {

        // =================================================
        // MASTER COUNTS
        // =================================================

        const [
            districtCount,
            setDistrictCount
        ] = useState(0);


        const [
            talukaCount,
            setTalukaCount
        ] = useState(0);


        const [
            vibhagCount,
            setVibhagCount
        ] = useState(0);


        const [
            trainerCount,
            setTrainerCount
        ] = useState(0);


        // =================================================
        // REPORT COUNTS
        // =================================================

        const [
            districtReportCount,
            setDistrictReportCount
        ] = useState(0);


        const [
            talukaReportCount,
            setTalukaReportCount
        ] = useState(0);


        const [
            vibhagReportCount,
            setVibhagReportCount
        ] = useState(0);


        const [
            trainerReportCount,
            setTrainerReportCount
        ] = useState(0);


        // =================================================
        // LOADING
        // =================================================

        const [
            loading,
            setLoading
        ] = useState(true);


        // =================================================
        // FETCH JSON
        // =================================================

        const fetchData = async (
            endpoint
        ) => {

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/${endpoint}`
                    );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        `HTTP Error ${response.status}`
                    );

                }


                const result =
                    await response.json();


                return result;

            } catch (error) {

                console.error(
                    `API ERROR ${endpoint}:`,
                    error
                );


                return null;

            }

        };


        // =================================================
        // GET COUNT FROM RESPONSE
        // =================================================

        const getCount = (
            response,
            possibleKeys = []
        ) => {

            if (!response) {
                return 0;
            }

            const countKeys = [
                "count",
                "total",
                "totalCount",
                "total_count",
            ];

            for (const key of countKeys) {
                if (typeof response[key] === "number") {
                    return response[key];
                }
            }

            for (const key of possibleKeys) {
                if (Array.isArray(response[key])) {
                    return response[key].length;
                }
            }

            if (Array.isArray(response.data)) {
                return response.data.length;
            }

            if (response.data && typeof response.data === "object") {
                for (const key of [...countKeys, ...possibleKeys]) {
                    if (typeof response.data[key] === "number") {
                        return response.data[key];
                    }
                    if (Array.isArray(response.data[key])) {
                        return response.data[key].length;
                    }
                }
                if (Array.isArray(response.data.rows)) {
                    return response.data.rows.length;
                }
                if (Array.isArray(response.data.results)) {
                    return response.data.results.length;
                }
            }

            if (Array.isArray(response.rows)) {
                return response.rows.length;
            }

            if (Array.isArray(response.results)) {
                return response.results.length;
            }

            return 0;
        };

        // =================================================
        // LOAD DASHBOARD DATA
        // =================================================

        useEffect(() => {

            const loadDashboard =
                async () => {

                    setLoading(true);


                    try {

                        // =================================
                        // MASTER APIs
                        // =================================

                        const [

                            districtResult,

                            talukaResult,

                            vibhagResult,

                            trainerResult,

                        ] = await Promise.all([

                            fetchData(
                                "district"
                            ),

                            fetchData(
                                "taluka"
                            ),

                            fetchData(
                                "vibhag"
                            ),

                            fetchData(
                                "trainer"
                            ),

                        ]);


                        // =================================
                        // REPORT APIs
                        // =================================

                        const [

                            districtReportResult,

                            talukaReportResult,

                            vibhagReportResult,

                            trainerReportResult,

                        ] = await Promise.all([

                            fetchData(
                                "district-reports"
                            ),

                            fetchData(
                                "taluka-reports"
                            ),

                            fetchData(
                                "vibhag-reports"
                            ),

                            fetchData(
                                "trainer-reports"
                            ),

                        ]);


                        // =================================
                        // SET MASTER COUNTS
                        // =================================

                        setDistrictCount(
                            getCount(
                                districtResult,
                                [
                                    "districts"
                                ]
                            )
                        );


                        setTalukaCount(
                            getCount(
                                talukaResult,
                                [
                                    "talukas"
                                ]
                            )
                        );


                        setVibhagCount(
                            getCount(
                                vibhagResult,
                                [
                                    "vibhags"
                                ]
                            )
                        );


                        setTrainerCount(
                            getCount(
                                trainerResult,
                                [
                                    "trainers"
                                ]
                            )
                        );


                        // =================================
                        // SET REPORT COUNTS
                        // =================================

                        setDistrictReportCount(
                            getCount(
                                districtReportResult,
                                [
                                    "reports"
                                ]
                            )
                        );


                        setTalukaReportCount(
                            getCount(
                                talukaReportResult,
                                [
                                    "reports"
                                ]
                            )
                        );


                        setVibhagReportCount(
                            getCount(
                                vibhagReportResult,
                                [
                                    "reports"
                                ]
                            )
                        );


                        setTrainerReportCount(
                            getCount(
                                trainerReportResult,
                                [
                                    "reports"
                                ]
                            )
                        );


                    } catch (error) {

                        console.error(
                            "DASHBOARD LOAD ERROR:",
                            error
                        );

                    } finally {

                        setLoading(false);

                    }

                };


            loadDashboard();


        }, []);


        // =================================================
        // TOTALS
        // =================================================

        const totalMasters =

            districtCount +

            talukaCount +

            vibhagCount +

            trainerCount;


        const totalReports =

            districtReportCount +

            talukaReportCount +

            vibhagReportCount +

            trainerReportCount;


        // =================================================
        // MASTER CARDS
        // =================================================

        const masterCards = [

            {
                title: "District",
                count: districtCount,
                reports: districtReportCount,
                link: "/dashboard/district",
                reportLink: "/dashboard/reports/district",
                icon: "D",
            },

            {
                title: "Taluka",
                count: talukaCount,
                reports: talukaReportCount,
                link: "/dashboard/taluka",
                reportLink: "/dashboard/reports/taluka",
                icon: "T",
            },

            {
                title: "Vibhag",
                count: vibhagCount,
                reports: vibhagReportCount,
                link: "/dashboard/vibhag",
                reportLink: "/dashboard/reports/vibhag",
                icon: "V",
            },

            {
                title: "BDO (business development officers) Reports",
                count: trainerCount,
                reports: trainerReportCount,
                link: "/dashboard/trainer",
                reportLink: "/dashboard/reports/trainer",
                icon: "TR",
            },

        ];


        // =================================================
        // RETURN
        // =================================================

        return (

            <div>


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h3 className="fw-bold mb-1">
                            Dashboard
                        </h3>

                        <p className="text-muted mb-0">
                            Overview of your management system
                        </p>

                    </div>


                    {loading && (

                        <div className="text-muted small">

                            Loading...

                        </div>

                    )}

                </div>


                {/* =================================================
                    TOP TOTAL COUNTERS
                ================================================= */}

                <div className="row g-3 mb-4">


                    {/* TOTAL MASTER */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            Total Masters
                                        </small>

                                        <h2 className="fw-bold mb-0 mt-1">
                                            {loading
                                                ? "..."
                                                : totalMasters}
                                        </h2>

                                    </div>


                                    <div
                                        className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                        }}
                                    >
                                        M
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* TOTAL REPORTS */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            Total Reports
                                        </small>

                                        <h2 className="fw-bold mb-0 mt-1">
                                            {loading
                                                ? "..."
                                                : totalReports}
                                        </h2>

                                    </div>


                                    <div
                                        className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                        }}
                                    >
                                        R
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ACTIVE REPORT TYPES */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            Report Types
                                        </small>

                                        <h2 className="fw-bold mb-0 mt-1">
                                            4
                                        </h2>

                                    </div>


                                    <div
                                        className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                        }}
                                    >
                                        4
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="col-xl-3 col-md-6">

                        <div className="card border-0 shadow-sm h-100">

                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <small className="text-muted">
                                            System Status
                                        </small>

                                        <h6 className="fw-bold mb-0 mt-2">
                                            {loading
                                                ? "Loading"
                                                : "Connected"}
                                        </h6>

                                    </div>


                                    <div
                                        className="rounded-circle bg-success"
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    MASTER + REPORT COUNTERS
                ================================================= */}

                <div className="row g-4">


                    {masterCards.map(
                        (card) => (

                            <div
                                className="col-xl-3 col-lg-6 col-md-6"
                                key={card.title}
                            >

                                <div className="card border-0 shadow-sm h-100">


                                    {/* CARD BODY */}

                                    <div className="card-body">


                                        {/* HEADER */}

                                        <div className="d-flex justify-content-between align-items-start">

                                            <div>

                                                <p className="text-muted mb-1">
                                                    {card.title}
                                                </p>

                                                <h2 className="fw-bold mb-0">
                                                    {loading
                                                        ? "..."
                                                        : card.count}
                                                </h2>

                                                <small className="text-muted">
                                                    Total {card.title}
                                                </small>

                                            </div>


                                            <div
                                                className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                                                style={{
                                                    width: "52px",
                                                    height: "52px",
                                                }}
                                            >
                                                {card.icon}
                                            </div>

                                        </div>


                                        {/* DIVIDER */}

                                        <hr className="my-3" />


                                        {/* REPORT COUNT */}

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>

                                                <small className="text-muted">
                                                    Reports
                                                </small>

                                                <div className="fw-bold fs-5">
                                                    {loading
                                                        ? "..."
                                                        : card.reports}
                                                </div>

                                            </div>


                                            <span className="badge text-bg-light border">
                                                {card.reports} Reports
                                            </span>

                                        </div>


                                        {/* LINKS */}

                                        <div className="d-flex justify-content-between align-items-center mt-4">

                                            <Link
                                                to={card.link}
                                                className="text-decoration-none small fw-semibold text-dark"
                                            >
                                                Master
                                                <span className="ms-1">
                                                    →
                                                </span>
                                            </Link>


                                            <Link
                                                to={card.reportLink}
                                                className="text-decoration-none small fw-semibold text-dark"
                                            >
                                                Report
                                                <span className="ms-1">
                                                    →
                                                </span>
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* =================================================
                    REPORT SUMMARY TABLE
                ================================================= */}

                <div className="card border-0 shadow-sm mt-4">

                    <div className="card-body">


                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <div>

                                <h5 className="fw-bold mb-1">
                                    Report Summary
                                </h5>

                                <p className="text-muted small mb-0">
                                    Total reports submitted by each level.
                                </p>

                            </div>


                            <span className="badge text-bg-dark px-3 py-2">
                                Total: {loading
                                    ? "..."
                                    : totalReports}
                            </span>

                        </div>


                        {/* RESPONSIVE TABLE */}

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Level
                                        </th>

                                        <th className="text-center">
                                            Master Count
                                        </th>

                                        <th className="text-center">
                                            Report Count
                                        </th>

                                        <th className="text-end">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {masterCards.map(
                                        (card, index) => (

                                            <tr
                                                key={
                                                    card.title
                                                }
                                            >

                                                <td>
                                                    {index + 1}
                                                </td>


                                                <td>

                                                    <div className="d-flex align-items-center gap-2">

                                                        <div
                                                            className="bg-dark text-white rounded d-flex align-items-center justify-content-center fw-bold"
                                                            style={{
                                                                width: "34px",
                                                                height: "34px",
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            {
                                                                card.icon
                                                            }
                                                        </div>


                                                        <span className="fw-semibold">
                                                            {
                                                                card.title
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                <td className="text-center">

                                                    <span className="badge text-bg-light border fs-6">

                                                        {loading
                                                            ? "..."
                                                            : card.count}

                                                    </span>

                                                </td>


                                                <td className="text-center">

                                                    <span className="badge text-bg-dark fs-6">

                                                        {loading
                                                            ? "..."
                                                            : card.reports}

                                                    </span>

                                                </td>


                                                <td className="text-end">

                                                    <Link
                                                        to={
                                                            card.reportLink
                                                        }
                                                        className="btn btn-sm btn-dark"
                                                    >
                                                        View Report
                                                    </Link>

                                                </td>

                                            </tr>

                                        )
                                    )}


                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>


            </div>

        );

    };


    export default NewDashboard;