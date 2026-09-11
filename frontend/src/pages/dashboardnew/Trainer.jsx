import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Button,
    Form,
    Modal,
    Alert,
} from "react-bootstrap";

import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../config/api";


// =====================================================
// API
// =====================================================

const TRAINER_API =
    `${API_BASE_URL}/trainer`;

const DISTRICT_API =
    `${API_BASE_URL}/district`;

const TALUKA_API =
    `${API_BASE_URL}/taluka`;

const VIBHAG_API =
    `${API_BASE_URL}/vibhag`;


// =====================================================
// EMPTY FORM
// =====================================================

const EMPTY_FORM = {
    name: "",
    trainerId: "",
    districtId: "",
    district: "",
    talukaId: "",
    taluka: "",
    vibhagId: "",
    vibhag: "",
    contactNumber: "",
    designation: "",
    joiningDate: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    status: "active",
    email: "",
    userId: "admin",
    password: "",
};


// =====================================================
// SAFE API RESPONSE
// =====================================================

const getResponseData = (response) => {

    if (!response) {
        return [];
    }


    // Direct array

    if (Array.isArray(response)) {
        return response;
    }


    // { data: [] }

    if (Array.isArray(response.data)) {
        return response.data;
    }


    // { data: { data: [] } }

    if (
        response.data &&
        Array.isArray(response.data.data)
    ) {
        return response.data.data;
    }


    // { trainers: [] }

    if (Array.isArray(response.trainers)) {
        return response.trainers;
    }


    // { districts: [] }

    if (Array.isArray(response.districts)) {
        return response.districts;
    }


    // { talukas: [] }

    if (Array.isArray(response.talukas)) {
        return response.talukas;
    }


    // { vibhags: [] }

    if (Array.isArray(response.vibhags)) {
        return response.vibhags;
    }


    // { rows: [] }

    if (Array.isArray(response.rows)) {
        return response.rows;
    }


    return [];
};


// =====================================================
// NAME HELPERS
// =====================================================

const getDistrictName = (item) => {

    return (
        item?.district_name ||
        item?.districtName ||
        item?.district?.name ||
        (
            typeof item?.district === "string"
                ? item.district
                : ""
        ) ||
        item?.name ||
        ""
    );

};


const getTalukaName = (item) => {

    return (
        item?.taluka_name ||
        item?.talukaName ||
        item?.taluka?.name ||
        (
            typeof item?.taluka === "string"
                ? item.taluka
                : ""
        ) ||
        item?.name ||
        ""
    );

};


const getVibhagName = (item) => {

    return (
        item?.vibhag_name ||
        item?.vibhagName ||
        item?.vibhag?.name ||
        (
            typeof item?.vibhag === "string"
                ? item.vibhag
                : ""
        ) ||
        item?.head ||
        item?.name ||
        ""
    );

};


// =====================================================
// COMPONENT
// =====================================================

const Trainer = () => {

    // =================================================
    // DATA
    // =================================================

    const [trainers, setTrainers] =
        useState([]);

    const [districts, setDistricts] =
        useState([]);

    const [allTalukas, setAllTalukas] =
        useState([]);

    const [talukas, setTalukas] =
        useState([]);

    const [allVibhags, setAllVibhags] =
        useState([]);

    const [vibhags, setVibhags] =
        useState([]);


    // =================================================
    // LOADING
    // =================================================

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);


    // =================================================
    // MODAL
    // =================================================

    const [showModal, setShowModal] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    // Password visibility in Add/Edit form
    const [showPassword, setShowPassword] =
        useState(false);

    // Password visibility in table rows
    const [visibleTablePasswords, setVisibleTablePasswords] =
        useState({});


    // =================================================
    // FORM
    // =================================================

    const [formData, setFormData] =
        useState({
            ...EMPTY_FORM,
        });


    // =================================================
    // ALERTS
    // =================================================

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =================================================
    // SEARCH
    // =================================================

    const [trainerIdSearch, setTrainerIdSearch] =
        useState("");

    const [nameSearch, setNameSearch] =
        useState("");

    const [userIdSearch, setUserIdSearch] =
        useState("");


    // =================================================
    // EXPAND
    // =================================================

    const [expandedId, setExpandedId] =
        useState(null);


    // =================================================
    // PAGINATION
    // =================================================

    const RECORDS_PER_PAGE = 20;

    const [currentPage, setCurrentPage] =
        useState(1);


    // =====================================================
    // LOAD TRAINERS
    // =====================================================

    const loadTrainers = async () => {

        try {

            setLoading(true);


            const response =
                await fetch(
                    TRAINER_API
                );


            const result =
                await response.json();


            console.log(
                "TRAINER API RESPONSE:",
                result
            );


            if (
                !response.ok ||
                result?.success === false
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to load trainers"
                );

            }


            setTrainers(
                getResponseData(result)
            );


        } catch (err) {

            console.error(
                "TRAINER API ERROR:",
                err
            );


            setTrainers([]);


            setError(
                err.message ||
                "Failed to load trainers"
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD DISTRICTS
    // =====================================================

    const loadDistricts = async () => {

        try {

            const response =
                await fetch(
                    DISTRICT_API
                );


            const result =
                await response.json();


            if (
                !response.ok ||
                result?.success === false
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to load districts"
                );

            }


            const data =
                getResponseData(result);


            setDistricts(
                data
            );


            return data;


        } catch (err) {

            console.error(
                "DISTRICT API ERROR:",
                err
            );


            setDistricts([]);


            return [];

        }

    };


    // =====================================================
    // LOAD TALUKAS
    // =====================================================

    const loadTalukas = async () => {

        try {

            const response =
                await fetch(
                    TALUKA_API
                );


            const result =
                await response.json();


            if (
                !response.ok ||
                result?.success === false
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to load talukas"
                );

            }


            const data =
                getResponseData(result);


            setAllTalukas(
                data
            );


            return data;


        } catch (err) {

            console.error(
                "TALUKA API ERROR:",
                err
            );


            setAllTalukas([]);


            return [];

        }

    };


    // =====================================================
    // LOAD VIBHAGS
    // =====================================================

    const loadVibhags = async () => {

        try {

            const response =
                await fetch(
                    VIBHAG_API
                );


            const result =
                await response.json();


            if (
                !response.ok ||
                result?.success === false
            ) {

                throw new Error(
                    result?.message ||
                    "Failed to load vibhags"
                );

            }


            const data =
                getResponseData(result);


            setAllVibhags(
                data
            );


            return data;


        } catch (err) {

            console.error(
                "VIBHAG API ERROR:",
                err
            );


            setAllVibhags([]);


            return [];

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        const loadAll = async () => {

            await Promise.all([
                loadTrainers(),
                loadDistricts(),
                loadTalukas(),
                loadVibhags(),
            ]);

        };


        loadAll();

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredTrainers =
        useMemo(() => {

            const trainerIdKeyword =
                trainerIdSearch
                    .trim()
                    .toLowerCase();


            const nameKeyword =
                nameSearch
                    .trim()
                    .toLowerCase();


            const userIdKeyword =
                userIdSearch
                    .trim()
                    .toLowerCase();


            return trainers.filter(
                (item) => {

                    const trainerId =
                        String(
                            item?.trainer_code ??
                            item?.trainerId ??
                            item?.trainer_id ??
                            `TR-${String(
                                item?.id ?? ""
                            ).padStart(
                                4,
                                "0"
                            )}`
                        ).toLowerCase();


                    const name =
                        String(
                            item?.trainer_name ??
                            item?.name ??
                            ""
                        ).toLowerCase();


                    const userId =
                        String(
                            item?.user_id ??
                            item?.userId ??
                            ""
                        ).toLowerCase();


                    const trainerMatch =
                        trainerIdKeyword === "" ||
                        trainerId.includes(
                            trainerIdKeyword
                        );


                    const nameMatch =
                        nameKeyword === "" ||
                        name.includes(
                            nameKeyword
                        );


                    const userMatch =
                        userIdKeyword === "" ||
                        userId.includes(
                            userIdKeyword
                        );


                    return (
                        trainerMatch &&
                        nameMatch &&
                        userMatch
                    );

                }
            );

        }, [
            trainers,
            trainerIdSearch,
            nameSearch,
            userIdSearch,
        ]);


    // =====================================================
    // RESET PAGE
    // =====================================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        trainerIdSearch,
        nameSearch,
        userIdSearch,
    ]);


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalRecords =
        filteredTrainers.length;


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


    const currentTrainers =
        filteredTrainers.slice(
            startIndex,
            endIndex
        );


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

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


        pages.push(
            totalPages
        );


        return pages;

    };


    // =====================================================
    // GO PAGE
    // =====================================================

    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {

            return;

        }


        setCurrentPage(
            page
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const clearSearch = () => {

        setTrainerIdSearch("");

        setNameSearch("");

        setUserIdSearch("");

        setCurrentPage(1);

    };


    // =====================================================
    // DISTRICT CHANGE
    // =====================================================

    const handleDistrictChange = (
        event
    ) => {

        const districtId =
            event.target.value;


        const selectedDistrict =
            districts.find(
                (item) =>
                    String(item?.id) ===
                    String(districtId)
            );


        // Filter Talukas

        const filteredTalukas =
            allTalukas.filter(
                (item) => {

                    if (
                        item?.district_id ===
                            undefined ||
                        item?.district_id ===
                            null
                    ) {

                        return false;

                    }


                    return (
                        String(
                            item.district_id
                        ) ===
                        String(districtId)
                    );

                }
            );


        // Filter Vibhags by district

        const filteredVibhags =
            allVibhags.filter(
                (item) => {

                    if (
                        item?.district_id ===
                            undefined ||
                        item?.district_id ===
                            null
                    ) {

                        return false;

                    }


                    return (
                        String(
                            item.district_id
                        ) ===
                        String(districtId)
                    );

                }
            );


        setTalukas(
            filteredTalukas
        );


        setVibhags(
            filteredVibhags
        );


        setFormData(
            (prev) => ({
                ...prev,

                districtId:
                    districtId,

                district:
                    getDistrictName(
                        selectedDistrict
                    ),

                talukaId:
                    "",

                taluka:
                    "",

                vibhagId:
                    "",

                vibhag:
                    "",

            })
        );

    };


    // =====================================================
    // TALUKA CHANGE
    // =====================================================

    const handleTalukaChange = (
        event
    ) => {

        const talukaId =
            event.target.value;


        const selectedTaluka =
            allTalukas.find(
                (item) =>
                    String(item?.id) ===
                    String(talukaId)
            );


        const filteredVibhags =
            allVibhags.filter(
                (item) => {

                    if (
                        item?.taluka_id ===
                            undefined ||
                        item?.taluka_id ===
                            null
                    ) {

                        return false;

                    }


                    return (
                        String(
                            item.taluka_id
                        ) ===
                        String(talukaId)
                    );

                }
            );


        setVibhags(
            filteredVibhags
        );


        setFormData(
            (prev) => ({
                ...prev,

                talukaId:
                    talukaId,

                taluka:
                    getTalukaName(
                        selectedTaluka
                    ),

                vibhagId:
                    "",

                vibhag:
                    "",

            })
        );

    };


    // =====================================================
    // VIBHAG CHANGE
    // =====================================================

    const handleVibhagChange = (
        event
    ) => {

        const vibhagId =
            event.target.value;


        const selectedVibhag =
            allVibhags.find(
                (item) =>
                    String(item?.id) ===
                    String(vibhagId)
            );


        setFormData(
            (prev) => ({
                ...prev,

                vibhagId:
                    vibhagId,

                vibhag:
                    getVibhagName(
                        selectedVibhag
                    ),

            })
        );

    };


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (prev) => ({
                ...prev,

                [name]:
                    value,

            })
        );

    };


    // =====================================================
    // NEXT AUTO BDO OFFICER ID
    // =====================================================

    const getNextTrainerId = () => {
        const ids = trainers
            .map((item) => Number(item?.id))
            .filter(
                (id) =>
                    Number.isFinite(id) &&
                    id > 0
            );

        const nextId =
            ids.length > 0
                ? Math.max(...ids) + 1
                : 1;

        return `${String(nextId).padStart(2, "0")}`;
    };


    // =====================================================
    // OPEN ADD MODAL
    // =====================================================

    const openAddModal = async () => {

        setEditingId(null);


        const [
            districtData,
            talukaData,
            vibhagData,
        ] = await Promise.all([
            loadDistricts(),
            loadTalukas(),
            loadVibhags(),
        ]);


        setTalukas(
            talukaData
        );


        setVibhags(
            vibhagData
        );


        setFormData({
            ...EMPTY_FORM,
            trainerId: getNextTrainerId(),
        });

        setShowPassword(false);

        setError("");

        setSuccess("");


        setShowModal(true);

    };


    // =====================================================
    // OPEN EDIT MODAL
    // =====================================================

    const openEditModal = async (
        item
    ) => {

        try {

            setEditingId(
                item.id
            );


            const [
                districtData,
                talukaData,
                vibhagData,
            ] = await Promise.all([
                loadDistricts(),
                loadTalukas(),
                loadVibhags(),
            ]);


            const districtId =
                item?.district_id ??
                item?.districtId ??
                "";


            const talukaId =
                item?.taluka_id ??
                item?.talukaId ??
                "";


            const vibhagId =
                item?.vibhag_id ??
                item?.vibhagId ??
                "";


            const selectedDistrict =
                districtData.find(
                    (district) =>
                        String(
                            district.id
                        ) ===
                        String(
                            districtId
                        )
                );


            const filteredTalukas =
                talukaData.filter(
                    (taluka) =>
                        String(
                            taluka?.district_id
                        ) ===
                        String(
                            districtId
                        )
                );


            const filteredVibhags =
                vibhagData.filter(
                    (vibhag) => {

                        if (
                            vibhag?.taluka_id !==
                                undefined &&
                            vibhag?.taluka_id !==
                                null
                        ) {

                            return (
                                String(
                                    vibhag.taluka_id
                                ) ===
                                String(
                                    talukaId
                                )
                            );

                        }


                        return (
                            String(
                                vibhag?.district_id
                            ) ===
                            String(
                                districtId
                            )
                        );

                    }
                );


            setTalukas(
                filteredTalukas
            );


            setVibhags(
                filteredVibhags
            );


            const selectedTaluka =
                talukaData.find(
                    (taluka) =>
                        String(
                            taluka.id
                        ) ===
                        String(
                            talukaId
                        )
                );


            const selectedVibhag =
                vibhagData.find(
                    (vibhag) =>
                        String(
                            vibhag.id
                        ) ===
                        String(
                            vibhagId
                        )
                );


            setFormData({

                name:
                    item?.trainer_name ||
                    item?.name ||
                    "",

                trainerId:
                    item?.trainer_code ||
                    item?.trainerId ||
                    item?.trainer_id ||
                    "",

                districtId:
                    districtId,

                district:
                    getDistrictName(
                        selectedDistrict
                    ) ||
                    item?.district_name ||
                    item?.district ||
                    "",

                talukaId:
                    talukaId,

                taluka:
                    getTalukaName(
                        selectedTaluka
                    ) ||
                    item?.taluka_name ||
                    item?.taluka ||
                    "",

                vibhagId:
                    vibhagId,

                vibhag:
                    getVibhagName(
                        selectedVibhag
                    ) ||
                    item?.vibhag_name ||
                    item?.vibhag ||
                    "",

                contactNumber:
                    item?.contact_number ||
                    item?.contactNumber ||
                    "",

                designation:
                    item?.designation ||
                    "",

                joiningDate:
                    item?.joining_date
                        ? String(item.joining_date).split("T")[0]
                        : item?.joiningDate
                        ? String(item.joiningDate).split("T")[0]
                        : "",

                accountNumber:
                    item?.account_number ||
                    item?.accountNumber ||
                    "",

                ifscCode:
                    item?.ifsc_code ||
                    item?.ifscCode ||
                    "",

                bankName:
                    item?.bank_name ||
                    item?.bankName ||
                    "",

                status:
                    item?.status ||
                    "active",

                email:
                    item?.email ||
                    "",

                userId:
                    item?.user_id ||
                    item?.userId ||
                    "",

                password:
                    "",

            });


            setError("");

            setSuccess("");

            setShowPassword(false);


            setShowModal(true);


        } catch (err) {

            console.error(
                "OPEN EDIT ERROR:",
                err
            );


            setError(
                "Unable to open edit form"
            );

        }

    };


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    const closeModal = () => {

        if (saving) {
            return;
        }


        setShowModal(false);

        setShowPassword(false);


        setEditingId(
            null
        );


        setFormData({
            ...EMPTY_FORM,
        });


        setTalukas(
            allTalukas
        );


        setVibhags(
            allVibhags
        );

    };


    // =====================================================
    // SUBMIT ADD / UPDATE
    // =====================================================

    const handleSubmit =
        async (event) => {

            event.preventDefault();


            // =============================================
            // VALIDATION
            // =============================================

            if (
                !formData.name.trim()
            ) {

                alert(
                    "Please enter BDO Officer Name"
                );

                return;

            }


            if (
                !formData.trainerId.trim()
            ) {

                alert(
                    "Please enter BDO Officer ID"
                );

                return;

            }


            if (
                !formData.districtId
            ) {

                alert(
                    "Please select District"
                );

                return;

            }


            if (
                !formData.talukaId
            ) {

                alert(
                    "Please select Taluka"
                );

                return;

            }


            if (
                !formData.vibhagId
            ) {

                alert(
                    "Please select Vibhag"
                );

                return;

            }


            if (
                !formData.contactNumber.trim()
            ) {

                alert(
                    "Please enter Contact Number"
                );

                return;

            }


            if (
                !/^[0-9]{10}$/.test(
                    formData.contactNumber.trim()
                )
            ) {

                alert(
                    "Contact Number must contain 10 digits"
                );

                return;

            }


            if (
                !formData.email.trim()
            ) {

                alert(
                    "Please enter Email"
                );

                return;

            }


            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email.trim()
                )
            ) {

                alert(
                    "Please enter valid Email"
                );

                return;

            }


            if (
                !formData.userId.trim()
            ) {

                alert(
                    "Please enter User ID"
                );

                return;

            }


            if (
                !editingId &&
                !formData.password.trim()
            ) {

                alert(
                    "Please enter Password"
                );

                return;

            }


            // =============================================
            // PAYLOAD
            // =============================================

            const payload = {

                trainer_name:
                    formData.name.trim(),

                trainer_code:
                    formData.trainerId.trim(),

                district_id:
                    Number(
                        formData.districtId
                    ),

                taluka_id:
                    Number(
                        formData.talukaId
                    ),

                vibhag_id:
                    Number(
                        formData.vibhagId
                    ),

                contact_number:
                    formData.contactNumber.trim(),

                designation:
                    formData.designation?.trim() ||
                    null,

                joining_date:
                    formData.joiningDate ||
                    null,

                account_number:
                    formData.accountNumber?.trim() ||
                    null,

                ifsc_code:
                    formData.ifscCode?.trim() ||
                    null,

                bank_name:
                    formData.bankName?.trim() ||
                    null,

                status:
                    formData.status ||
                    "active",

                user_id:
                    formData.userId.trim(),

                email:
                    formData.email.trim(),

            };


            // Password only when supplied

            if (
                formData.password.trim()
            ) {

                payload.password =
                    formData.password.trim();

            }


            try {

                setSaving(true);

                setError("");

                setSuccess("");


                // =========================================
                // URL
                // =========================================

                const url =
                    editingId
                        ? `${TRAINER_API}/${editingId}`
                        : TRAINER_API;


                // =========================================
                // METHOD
                // =========================================

                const method =
                    editingId
                        ? "PUT"
                        : "POST";


                console.log(
                    "TRAINER URL:",
                    url
                );


                console.log(
                    "TRAINER METHOD:",
                    method
                );


                console.log(
                    "TRAINER PAYLOAD:",
                    payload
                );


                // =========================================
                // API
                // =========================================

                const response =
                    await fetch(
                        url,
                        {

                            method,

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body:
                                JSON.stringify(
                                    payload
                                ),

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
                    result?.success === false
                ) {

                    throw new Error(
                        result?.message ||
                        (
                            editingId
                                ? "Failed to update BDO Officer"
                                : "Failed to add BDO Officer"
                        )
                    );

                }


                setSuccess(
                    editingId
                        ? "BDO Officer updated successfully"
                        : "BDO Officer added successfully"
                );


                closeModal();


                await loadTrainers();


            } catch (err) {

                console.error(
                    "SAVE TRAINER ERROR:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to save BDO Officer"
                );


            } finally {

                setSaving(false);

            }

        };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete =
        async (id) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this BDO Officer?"
                );


            if (!confirmed) {
                return;
            }


            try {

                setDeletingId(
                    id
                );

                setError("");

                setSuccess("");


                const response =
                    await fetch(
                        `${TRAINER_API}/${id}`,
                        {
                            method:
                                "DELETE",
                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "DELETE TRAINER RESPONSE:",
                    result
                );


                if (
                    !response.ok ||
                    result?.success === false
                ) {

                    throw new Error(
                        result?.message ||
                        "Failed to delete BDO Officer"
                    );

                }


                setSuccess(
                    "BDO Officer deleted successfully"
                );


                await loadTrainers();


                if (
                    expandedId === id
                ) {

                    setExpandedId(
                        null
                    );

                }


                if (
                    currentPage > 1 &&
                    currentTrainers.length === 1
                ) {

                    setCurrentPage(
                        currentPage - 1
                    );

                }


            } catch (err) {

                console.error(
                    "DELETE TRAINER ERROR:",
                    err
                );


                setError(
                    err.message ||
                    "Failed to delete BDO Officer"
                );


            } finally {

                setDeletingId(
                    null
                );

            }

        };


    // =====================================================
    // EXPAND
    // =====================================================

    const toggleExpand = (
        id
    ) => {

        setExpandedId(
            (previous) =>
                previous === id
                    ? null
                    : id
        );

    };


    // =====================================================
    // TABLE PASSWORD VISIBILITY
    // =====================================================

    const toggleTablePassword = (id) => {

        setVisibleTablePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

    };


    // =====================================================
    // DOWNLOAD EXCEL
    // =====================================================

    const handleDownloadExcel = () => {
        try {
            if (!filteredTrainers.length) {
                alert("No BDO Officer records available to download.");
                return;
            }

            const excelData = filteredTrainers.map((item, index) => ({
                SR: index + 1,

                "BDO Officer ID":
                    item?.trainer_code ||
                    item?.trainerId ||
                    item?.trainer_id ||
                    `TR-${String(item?.id ?? "").padStart(4, "0")}`,

                Name:
                    item?.trainer_name ||
                    item?.name ||
                    "",

                Status:
                    item?.status ||
                    "Active",

                District:
                    item?.district_name ||
                    item?.districtName ||
                    item?.district?.name ||
                    (typeof item?.district === "string"
                        ? item.district
                        : ""),

                Taluka:
                    item?.taluka_name ||
                    item?.talukaName ||
                    item?.taluka?.name ||
                    (typeof item?.taluka === "string"
                        ? item.taluka
                        : ""),

                Vibhag:
                    item?.vibhag_name ||
                    item?.vibhagName ||
                    item?.vibhag?.name ||
                    (typeof item?.vibhag === "string"
                        ? item.vibhag
                        : ""),

                "Contact Number":
                    item?.contact_number ||
                    item?.contactNumber ||
                    "",

                "User ID":
                    item?.user_id ||
                    item?.userId ||
                    "",

                Password:
                    item?.password ||
                    "",

                Email:
                    item?.email ||
                    "",

                Address:
                    item?.address ||
                    "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);

            worksheet["!cols"] = [
                { wch: 8 },
                { wch: 20 },
                { wch: 25 },
                { wch: 15 },
                { wch: 22 },
                { wch: 22 },
                { wch: 22 },
                { wch: 18 },
                { wch: 20 },
                { wch: 22 },
                { wch: 32 },
                { wch: 40 },
            ];

            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "BDO Officer Report"
            );

            const today = new Date()
                .toISOString()
                .split("T")[0];

            XLSX.writeFile(
                workbook,
                `BDO_Officer_Report_${today}.xlsx`
            );
        } catch (error) {
            console.error("BDO OFFICER EXCEL ERROR:", error);
            alert("Unable to download BDO Officer Excel file.");
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="container-fluid px-0"
            style={{
                maxWidth: "100%",
                overflowX: "hidden",
            }}
        >

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
                        BDO Officer
                    </h3>

                    <p className="text-muted mb-0">
                        Manage BDO Officer records
                    </p>

                </div>


                <Button
                    variant="dark"
                    onClick={
                        openAddModal
                    }
                >

                    <span
                        className="fw-bold me-2"
                        style={{
                            fontSize: "18px",
                        }}
                    >
                        +
                    </span>

                    Add BDO Officer

                </Button>

            </div>


            {/* =================================================
                COUNT
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
                    className="card-body"
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
                            "
                            style={{
                                width: "55px",
                                height: "55px",
                                fontSize: "18px",
                            }}
                        >

                            {
                                totalRecords
                            }

                        </div>


                        <div>

                            <small
                                className="text-muted"
                            >
                                Total BDO Officer
                            </small>

                            <h4
                                className="fw-bold mb-0"
                            >
                                {
                                    totalRecords
                                }
                            </h4>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                SEARCH
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
                    className="card-body"
                >

                    <div
                        className="
                            row
                            g-3
                            align-items-end
                        "
                    >

                        {/* BDO Officer ID */}

                        <div
                            className="
                                col-12
                                col-md-4
                            "
                        >

                            <Form.Label
                                className="fw-semibold"
                            >
                                BDO Officer ID
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Search BDO Officer ID..."
                                value={
                                    trainerIdSearch
                                }
                                onChange={(event) =>
                                    setTrainerIdSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Name */}

                        <div
                            className="
                                col-12
                                col-md-4
                            "
                        >

                            <Form.Label
                                className="fw-semibold"
                            >
                                Name
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Search Name..."
                                value={
                                    nameSearch
                                }
                                onChange={(event) =>
                                    setNameSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* User ID */}

                        <div
                            className="
                                col-12
                                col-md-4
                            "
                        >

                            <Form.Label
                                className="fw-semibold"
                            >
                                User ID
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Search User ID..."
                                value={
                                    userIdSearch
                                }
                                onChange={(event) =>
                                    setUserIdSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Clear */}

                        <div
                            className="
                                col-12
                                d-flex
                                justify-content-end
                            "
                        >

                            <Button
                                variant="outline-secondary"
                                onClick={
                                    clearSearch
                                }
                            >
                                Clear Search
                            </Button>

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

                <div
                    className="
                        card-header
                        bg-white
                        py-3
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
                                className="fw-bold mb-0"
                            >
                                BDO Officer List
                            </h6>

                            <small
                                className="text-muted"
                            >

                                Showing{" "}

                                <strong>
                                    {
                                        totalRecords === 0
                                            ? 0
                                            : startIndex + 1
                                    }
                                </strong>

                                {" - "}

                                <strong>
                                    {
                                        Math.min(
                                            endIndex,
                                            totalRecords
                                        )
                                    }
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {totalRecords}
                                </strong>

                                {" "}records

                            </small>

                        </div>


                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <Button
                                type="button"
                                variant="success"
                                size="sm"
                                onClick={handleDownloadExcel}
                                disabled={
                                    loading ||
                                    filteredTrainers.length === 0
                                }
                            >
                                ↓&nbsp; Download Excel
                            </Button>

                            <span
                                className="badge bg-dark"
                            >
                                {totalRecords} Records
                            </span>
                        </div>

                    </div>

                </div>


                <div
                    className="card-body p-0"
                >

                    <div
                        className="table-responsive"
                    >

                        <table
                            className="
                                table
                                table-hover
                                table-bordered
                                align-middle
                                mb-0
                            "
                        >

                            <thead
                                className="table-light"
                            >

                                <tr>

                                    <th>
                                        SR
                                    </th>

                                    <th>
                                        BDO Officer ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        District
                                    </th>

                                    <th>
                                        Taluka
                                    </th>

                                    <th>
                                        Vibhag
                                    </th>

                                    <th>
                                        Contact Number
                                    </th>

                                    <th>
                                        User ID
                                    </th>

                                    <th>
                                        Password
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {/* Loading */}

                                {loading && (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="
                                                text-center
                                                py-5
                                            "
                                        >
                                            Loading BDO Officer data...
                                        </td>

                                    </tr>

                                )}


                                {/* Empty */}

                                {!loading &&
                                    currentTrainers.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan="11"
                                                className="
                                                    text-center
                                                    py-5
                                                    text-muted
                                                "
                                            >

                                                <div
                                                    className="fw-semibold"
                                                >
                                                    No BDO Officer Found
                                                </div>

                                                <small>
                                                    Try changing
                                                    your search
                                                    filters.
                                                </small>

                                            </td>

                                        </tr>

                                    )}


                                {/* Data */}

                                {!loading &&
                                    currentTrainers.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const trainerId =
                                                item?.trainer_code ||
                                                item?.trainerId ||
                                                item?.trainer_id ||
                                                `TR-${String(
                                                    item?.id ?? ""
                                                ).padStart(
                                                    4,
                                                    "0"
                                                )}`;


                                            const trainerName =
                                                item?.trainer_name ||
                                                item?.name ||
                                                "-";


                                            const districtName =
                                                item?.district_name ||
                                                item?.districtName ||
                                                item?.district?.name ||
                                                (
                                                    typeof item?.district ===
                                                    "string"
                                                        ? item.district
                                                        : "-"
                                                );


                                            const talukaName =
                                                item?.taluka_name ||
                                                item?.talukaName ||
                                                item?.taluka?.name ||
                                                (
                                                    typeof item?.taluka ===
                                                    "string"
                                                        ? item.taluka
                                                        : "-"
                                                );


                                            const vibhagName =
                                                item?.vibhag_name ||
                                                item?.vibhagName ||
                                                item?.vibhag?.name ||
                                                (
                                                    typeof item?.vibhag ===
                                                    "string"
                                                        ? item.vibhag
                                                        : "-"
                                                );


                                            const contactNumber =
                                                item?.contact_number ||
                                                item?.contactNumber ||
                                                "-";


                                            const userId =
                                                item?.user_id ||
                                                item?.userId ||
                                                "-";


                                            return (

                                                <React.Fragment
                                                    key={
                                                        item.id
                                                    }
                                                >

                                                    <tr>

                                                        {/* SR */}

                                                        <td>
                                                            {
                                                                startIndex +
                                                                index +
                                                                1
                                                            }
                                                        </td>


                                                        {/* TRAINER ID */}

                                                        <td>

                                                            <span
                                                                className="
                                                                    fw-semibold
                                                                "
                                                            >
                                                                {
                                                                    trainerId
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* NAME */}

                                                        <td
                                                            className="
                                                                fw-semibold
                                                            "
                                                        >
                                                            {
                                                                trainerName
                                                            }
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
                                                                {
                                                                    item?.status ||
                                                                    "Active"
                                                                }
                                                            </span>

                                                        </td>


                                                        {/* DISTRICT */}

                                                        <td>
                                                            {
                                                                districtName
                                                            }
                                                        </td>


                                                        {/* TALUKA */}

                                                        <td>
                                                            {
                                                                talukaName
                                                            }
                                                        </td>


                                                        {/* VIBHAG */}

                                                        <td>
                                                            {
                                                                vibhagName
                                                            }
                                                        </td>


                                                        {/* CONTACT */}

                                                        <td>
                                                            {
                                                                contactNumber
                                                            }
                                                        </td>


                                                        {/* USER ID */}

                                                        <td>
                                                            {
                                                                userId
                                                            }
                                                        </td>


                                                        {/* PASSWORD */}

                                                        <td>

                                                            {item?.password ? (

                                                                <div
                                                                    className="
                                                                        d-flex
                                                                        align-items-center
                                                                        gap-2
                                                                    "
                                                                >

                                                                    <span
                                                                        style={{
                                                                            minWidth: "110px",
                                                                            fontFamily:
                                                                                visibleTablePasswords[item.id]
                                                                                    ? "inherit"
                                                                                    : "monospace",
                                                                        }}
                                                                    >
                                                                        {visibleTablePasswords[item.id]
                                                                            ? item.password
                                                                            : "••••••••"}
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            toggleTablePassword(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        aria-label={
                                                                            visibleTablePasswords[item.id]
                                                                                ? "Hide password"
                                                                                : "Show password"
                                                                        }
                                                                        title={
                                                                            visibleTablePasswords[item.id]
                                                                                ? "Hide password"
                                                                                : "Show password"
                                                                        }
                                                                        style={{
                                                                            border: "none",
                                                                            background:
                                                                                "transparent",
                                                                            padding: "2px 5px",
                                                                            cursor: "pointer",
                                                                            color: "#6c757d",
                                                                            fontSize: "16px",
                                                                            lineHeight: 1,
                                                                        }}
                                                                    >
                                                                        {visibleTablePasswords[item.id]
                                                                            ? "🙈"
                                                                            : "👁️"}
                                                                    </button>

                                                                </div>

                                                            ) : (

                                                                <span className="text-muted">
                                                                    -
                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* ACTION */}

                                                        <td>

                                                            <div
                                                                className="
                                                                    d-flex
                                                                    gap-1
                                                                "
                                                            >

                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    className="
                                                                        border
                                                                        fw-bold
                                                                    "
                                                                    onClick={() =>
                                                                        toggleExpand(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        expandedId ===
                                                                        item.id
                                                                            ? "-"
                                                                            : "+"
                                                                    }
                                                                </Button>


                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-dark"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            item
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
                                                                        item.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >

                                                                    {
                                                                        deletingId ===
                                                                        item.id
                                                                            ? "Deleting..."
                                                                            : "Delete"
                                                                    }

                                                                </Button>

                                                            </div>

                                                        </td>

                                                    </tr>


                                                    {/* Expanded */}

                                                    {expandedId ===
                                                        item.id && (

                                                        <tr>

                                                            <td
                                                                colSpan="11"
                                                                className="
                                                                    bg-light
                                                                "
                                                            >

                                                                <div
                                                                    className="
                                                                        row
                                                                        g-3
                                                                        p-3
                                                                    "
                                                                >

                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            BDO Officer ID
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                trainerId
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            Name
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                trainerName
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            District
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                districtName
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            Taluka
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                talukaName
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            Vibhag
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                vibhagName
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            Contact Number
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                contactNumber
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            User ID
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                userId
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-md-3
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            Email
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                item?.email ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            col-12
                                                                        "
                                                                    >

                                                                        <small
                                                                            className="
                                                                                text-muted
                                                                                d-block
                                                                                mb-1
                                                                            "
                                                                        >
                                                                            Address
                                                                        </small>

                                                                        <strong>
                                                                            {
                                                                                item?.address ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                    </div>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    )}

                                                </React.Fragment>

                                            );

                                        }
                                    )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* Pagination */}

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
                                    flex-column
                                    flex-md-row
                                    justify-content-between
                                    align-items-center
                                    gap-3
                                "
                            >

                                <small
                                    className="text-muted"
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


                                <nav>

                                    <ul
                                        className="
                                            pagination
                                            pagination-sm
                                            mb-0
                                        "
                                    >

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
                                                className="page-link"
                                                disabled={
                                                    currentPage === 1
                                                }
                                                onClick={() =>
                                                    goToPage(
                                                        currentPage - 1
                                                    )
                                                }
                                            >
                                                Previous
                                            </button>

                                        </li>


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
                                                                className="page-link"
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
                                                            className="page-link"
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
                                                className="page-link"
                                                disabled={
                                                    currentPage ===
                                                    totalPages
                                                }
                                                onClick={() =>
                                                    goToPage(
                                                        currentPage + 1
                                                    )
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
                show={
                    showModal
                }
                onHide={
                    closeModal
                }
                centered
                size="lg"
                backdrop="static"
                className="trainer-modal"
            >

                <Form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <Modal.Header
                        closeButton
                    >

                        <Modal.Title
                            className="fw-bold"
                        >

                            {editingId ? "Edit BDO Officer (BDO अधिकारी संपादित करा)" : "Add BDO Officer (BDO अधिकारी जोडा)"}

                        </Modal.Title>

                    </Modal.Header>


                    <Modal.Body className="trainer-modal-body">

                        <div className="row g-3 mx-0">

                            {/* 1. Full Name */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Full Name (पूर्ण नाव)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="पूर्ण नाव प्रविष्ट करा"
                                    />
                                </Form.Group>
                            </div>

                            {/* 2. Head ID / BDO Officer ID */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Head ID (हेड आयडी / BDO अधिकारी क्रमांक)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="trainerId"
                                        value={formData.trainerId}
                                        onChange={handleChange}
                                        readOnly
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            fontWeight: "600",
                                            color: "#212529",
                                        }}
                                        placeholder="हेड आयडी"
                                    />
                                </Form.Group>
                            </div>

                            {/* 3. Designation */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Designation (पद)
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

                            {/* 4. District */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        District (जिल्हा)
                                    </Form.Label>
                                    <Form.Select
                                        name="districtId"
                                        value={formData.districtId}
                                        onChange={handleDistrictChange}
                                    >
                                        <option value="">जिल्हा निवडा</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.id}>
                                                {getDistrictName(district)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* 5. Taluka */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Taluka (तालुका)
                                    </Form.Label>
                                    <Form.Select
                                        name="talukaId"
                                        value={formData.talukaId}
                                        onChange={handleTalukaChange}
                                        disabled={!formData.districtId}
                                    >
                                        <option value="">तालुका निवडा</option>
                                        {talukas.map((taluka) => (
                                            <option key={taluka.id} value={taluka.id}>
                                                {getTalukaName(taluka)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* 6. Vibhag */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Vibhag (विभाग)
                                    </Form.Label>
                                    <Form.Select
                                        name="vibhagId"
                                        value={formData.vibhagId}
                                        onChange={handleVibhagChange}
                                        disabled={!formData.talukaId}
                                    >
                                        <option value="">विभाग निवडा</option>
                                        {vibhags.map((vibhag) => (
                                            <option key={vibhag.id} value={vibhag.id}>
                                                {getVibhagName(vibhag)}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* 7. Mobile Number */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Mobile Number (मोबाईल क्रमांक)
                                    </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        maxLength={10}
                                        placeholder="१० अंकी मोबाईल क्रमांक"
                                    />
                                </Form.Group>
                            </div>

                            {/* 8. Joining Date */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Joining Date (रुजू तारीख)
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </div>

                            {/* 9. Status */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Status (स्थिती)
                                    </Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="active">Active (सक्रिय)</option>
                                        <option value="inactive">Inactive (निष्क्रिय)</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* 10. Account Number */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Account Number (खाते क्रमांक)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        placeholder="बँक खाते क्रमांक प्रविष्ट करा"
                                    />
                                </Form.Group>
                            </div>

                            {/* 11. IFSC Code */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        IFSC Code (आयएफएससी कोड)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleChange}
                                        placeholder="IFSC कोड प्रविष्ट करा"
                                    />
                                </Form.Group>
                            </div>

                            {/* 12. Bank Name */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Bank Name (बँकेचे नाव)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        placeholder="बँकेचे नाव प्रविष्ट करा"
                                    />
                                </Form.Group>
                            </div>

                            {/* 13. Email */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Email (ईमेल)
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="ईमेल पत्ता प्रविष्ट करा"
                                    />
                                </Form.Group>
                            </div>

                            {/* 14. User ID */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        User ID (वापरकर्ता आयडी)
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        placeholder="वापरकर्ता आयडी प्रविष्ट करा"
                                    />
                                </Form.Group>
                            </div>

                            {/* 15. Password */}
                            <div className="col-md-6">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Password (पासवर्ड)
                                        {!editingId && " *"}
                                    </Form.Label>
                                    <div className="password-input-wrapper">
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="पासवर्ड प्रविष्ट करा"
                                            autoComplete="new-password"
                                            className="password-form-control"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                </Form.Group>
                            </div>

                        </div>

                    </Modal.Body>


                    <Modal.Footer>

                        <Button
                            variant="secondary"
                            type="button"
                            onClick={closeModal}
                            disabled={saving}
                        >
                            Cancel (रद्द करा)
                        </Button>


                        <Button
                            variant="dark"
                            type="submit"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update BDO Officer (अद्यतनित करा)"
                                    : "Add BDO Officer (जोडा)"}

                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>


            {/* =================================================
                CSS
            ================================================= */}

            <style>
                {`

                /* =========================================
                   TRAINER POPUP / MODAL ALIGNMENT
                   Keeps long renamed labels inside the popup
                   without changing the existing page/table UI.
                ========================================= */

                .trainer-modal .modal-dialog {
                    width: calc(100% - 24px);
                    max-width: 960px;
                    margin: 1rem auto;
                }

                .trainer-modal .modal-content {
                    width: 100%;
                    max-width: 100%;
                    overflow: hidden;
                    border: 0;
                    border-radius: 12px;
                }

                .trainer-modal .modal-header {
                    padding: 16px 20px;
                    align-items: center;
                }

                .trainer-modal .modal-title {
                    margin: 0;
                    line-height: 1.3;
                    white-space: normal;
                    overflow-wrap: anywhere;
                }

                .trainer-modal .trainer-modal-body {
                    padding: 20px;
                    max-height: 70vh;
                    overflow-x: hidden;
                    overflow-y: auto;
                }

                .trainer-modal .trainer-modal-body > .row {
                    width: 100%;
                    margin-left: 0;
                    margin-right: 0;
                }

                .trainer-modal .trainer-modal-body .col-md-6,
                .trainer-modal .trainer-modal-body .col-12 {
                    min-width: 0;
                }

                .trainer-modal .trainer-modal-body .form-label {
                    display: block;
                    width: 100%;
                    margin-bottom: 6px;
                    line-height: 1.35;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }

                .trainer-modal .trainer-modal-body .form-control,
                .trainer-modal .trainer-modal-body .form-select {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;
                    box-sizing: border-box;
                }

                .trainer-modal .password-input-wrapper {
                    position: relative;
                    width: 100%;
                }

                .trainer-modal .password-form-control {
                    width: 100%;
                    min-height: 46px;
                    padding-right: 48px !important;
                }

                .trainer-modal .password-toggle-button {
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 0;
                    border-radius: 6px;
                    background: transparent;
                    color: #6c757d;
                    cursor: pointer;
                    z-index: 5;
                    padding: 0;
                    line-height: 1;
                    font-size: 17px;
                }

                .trainer-modal .password-toggle-button:hover {
                    background: #f1f3f5;
                    color: #212529;
                }

                .trainer-modal .modal-footer {
                    padding: 12px 20px;
                    gap: 8px;
                }

                @media (max-width: 767.98px) {
                    .trainer-modal .modal-dialog {
                        width: calc(100% - 16px);
                        max-width: none;
                        margin: 0.5rem auto;
                    }

                    .trainer-modal .trainer-modal-body {
                        padding: 16px;
                        max-height: 72vh;
                    }

                    .trainer-modal .modal-header {
                        padding: 14px 16px;
                    }

                    .trainer-modal .modal-footer {
                        padding: 10px 16px;
                    }
                }

                .table-responsive {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: auto !important;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                }


                .table {
                    min-width: 1200px;
                }


                .table th,
                .table td {
                    white-space: nowrap;
                    font-size: 12px;
                    padding: 10px 12px;
                    vertical-align: middle;
                }


                .table thead th {
                    font-weight: 700;
                    background: #f8f9fa;
                    line-height: 1.35;
                }


                .table tbody tr:hover {
                    background-color: #f8f9fa;
                }


                /* =========================================
                   PAGINATION
                ========================================= */

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

                    border-radius: 5px !important;
                }


                .pagination
                .page-item.active
                .page-link {
                    background-color: #212529;
                    border-color: #212529;
                    color: #fff;
                }


                .pagination
                .page-link:hover {
                    background-color: #e9ecef;
                    color: #212529;
                }


                .pagination
                .page-item.active
                .page-link:hover {
                    background-color: #212529;
                    color: #fff;
                }


                /* =========================================
                   SCROLLBAR
                ========================================= */

                .table-responsive::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
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


                /* =========================================
                   MOBILE
                ========================================= */

                @media (max-width: 768px) {

                    .table {
                        min-width: 1200px;
                    }


                    .table th,
                    .table td {
                        font-size: 11px;
                        padding: 8px;
                    }


                    .pagination .page-link {
                        min-width: 30px;
                        height: 30px;
                        font-size: 11px;
                    }

                }

                `}
            </style>

        </div>

    );

};


export default Trainer;
    