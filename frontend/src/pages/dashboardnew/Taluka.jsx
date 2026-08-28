import React, {
  useEffect,
  useState,
} from "react";

import {
  Button,
  Form,
  Modal,
} from "react-bootstrap";

import * as XLSX from "xlsx";
import { API_BASE_URL } from "../../config/api";


/* =========================================================
   API
========================================================= */

const TALUKA_API_URL =
  `${API_BASE_URL}/taluka`;

const DISTRICT_API_URL =
  `${API_BASE_URL}/district`;


/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
  name: "",

  contactNumber: "",

  reportDate:
    new Date()
      .toISOString()
      .split("T")[0],

  designation: "",

  districtId: "",

  districtName: "",

  taluka: "",

  joiningDate: "",

  accountNumber: "",

  ifscCode: "",

  bankName: "",

  status: "active",

  email: "",

  userId: "",

  password: "",
};


/* =========================================================
   SAFE STRING
========================================================= */

const safeString = (value) => {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value);
};


/* =========================================================
   DATE FORMAT FOR TABLE
========================================================= */

const formatDate = (
  dateValue
) => {

  if (!dateValue) {
    return "";
  }

  if (
    typeof dateValue === "string" &&
    /^\d{2}\/\d{2}\/\d{4}$/.test(
      dateValue
    )
  ) {
    return dateValue;
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return safeString(
      dateValue
    );
  }

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const year =
    date.getFullYear();

  return `${day}/${month}/${year}`;
};


/* =========================================================
   COMPONENT
========================================================= */

const Taluka = () => {

  /* =======================================================
     DATA
  ======================================================= */

  const [talukas, setTalukas] =
    useState([]);

  const [districts, setDistricts] =
    useState([]);


  /* =======================================================
     MODAL
  ======================================================= */

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);


  /* =======================================================
     FORM
  ======================================================= */

  const [formData, setFormData] =
    useState({
      ...EMPTY_FORM,
    });


  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] =
    useState(false);


  /* =======================================================
     PASSWORD
  ======================================================= */

  const [showPasswords, setShowPasswords] =
    useState({});


  /* =======================================================
     SEARCH
  ======================================================= */

  const [talukaIdSearch, setTalukaIdSearch] =
    useState("");

  const [nameSearch, setNameSearch] =
    useState("");

  const [userIdSearch, setUserIdSearch] =
    useState("");


  /* =======================================================
     AUTH HEADER
  ======================================================= */

  const getHeaders = () => {

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("accessToken");

    const headers = {
      "Content-Type":
        "application/json",
    };

    if (token) {

      headers.Authorization =
        `Bearer ${token}`;

    }

    return headers;
  };


  /* =======================================================
     LOAD DISTRICTS
     
     हे District page मधील records
     dropdown मध्ये आणण्यासाठी आहे.
  ======================================================= */

  const loadDistricts = async () => {

    try {

      const response =
        await fetch(
          DISTRICT_API_URL,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );


      const result =
        await response.json();


      console.log(
        "DISTRICT API RESPONSE:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result?.message ||
          "Failed to fetch districts"
        );

      }


      let districtData = [];


      if (
        result?.success &&
        Array.isArray(
          result?.data
        )
      ) {

        districtData =
          result.data;

      } else if (
        Array.isArray(
          result?.districts
        )
      ) {

        districtData =
          result.districts;

      } else if (
        Array.isArray(
          result
        )
      ) {

        districtData =
          result;

      }


      const formattedDistricts =
        districtData.map(
          (item) => {

            const id =
              item?.id ??
              item?.district_id ??
              item?.districtId ??
              "";


            const name =
              item?.name ??
              item?.district_name ??
              item?.districtName ??
              item?.district ??
              "";


            return {
              ...item,

              id,

              name,
            };

          }
        );


      console.log(
        "DISTRICTS FOR DROPDOWN:",
        formattedDistricts
      );


      setDistricts(
        formattedDistricts
      );

    } catch (error) {

      console.error(
        "LOAD DISTRICTS ERROR:",
        error
      );

      setDistricts([]);

      alert(
        error.message ||
        "Failed to load Districts"
      );

    }

  };


  /* =======================================================
     LOAD TALUKAS
  ======================================================= */

  const loadTalukas = async () => {

    try {

      setLoading(true);


      const response =
        await fetch(
          TALUKA_API_URL,
          {
            method: "GET",
            headers: getHeaders(),
          }
        );


      const result =
        await response.json();


      console.log(
        "TALUKA API RESPONSE:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result?.message ||
          "Failed to fetch Talukas"
        );

      }


      let data = [];


      if (
        result?.success &&
        Array.isArray(
          result?.data
        )
      ) {

        data =
          result.data;

      } else if (
        Array.isArray(
          result?.talukas
        )
      ) {

        data =
          result.talukas;

      } else if (
        Array.isArray(
          result
        )
      ) {

        data =
          result;

      }


      const formattedData =
        data.map(
          (item) => {

            return {

              ...item,

              id:
                item?.id ??
                item?.taluka_id ??
                "",


              name:
                item?.name ??
                "",


              contactNumber:
                item?.contact_number ??
                item?.contactNumber ??
                item?.mobile_number ??
                item?.mobileNumber ??
                "",


              reportDate:
                item?.report_date ??
                item?.reportDate ??
                "",


              designation:
                item?.designation ??
                "",


              districtId:
                item?.district_id ??
                item?.districtId ??
                "",


              districtName:
                item?.district_name ??
                item?.districtName ??
                item?.district ??
                "",


              taluka:
                item?.taluka ??
                item?.taluka_name ??
                item?.talukaName ??
                item?.name ??
                "",


              joiningDate:
                item?.joining_date ??
                item?.joiningDate ??
                "",


              accountNumber:
                item?.account_number ??
                item?.accountNumber ??
                "",


              ifscCode:
                item?.ifsc_code ??
                item?.ifscCode ??
                "",


              bankName:
                item?.bank_name ??
                item?.bankName ??
                "",


              status:
                item?.status ??
                "active",


              email:
                item?.email ??
                "",


              userId:
                item?.user_id ??
                item?.userId ??
                "",


              password:
                item?.password ??
                "",

            };

          }
        );


      setTalukas(
        formattedData
      );


    } catch (error) {

      console.error(
        "LOAD TALUKAS ERROR:",
        error
      );

      setTalukas([]);

      alert(
        error.message ||
        "Failed to load Taluka data"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    loadDistricts();

    loadTalukas();

  }, []);


  /* =======================================================
     GET TALUKA ID
  ======================================================= */

  const getTalukaHeadId = (
    taluka,
    index = 0
  ) => {

    const existing =
      taluka?.talukaHeadId ||
      taluka?.taluka_head_id ||
      taluka?.headId ||
      taluka?.head_id;


    if (existing) {

      return safeString(
        existing
      );

    }


    const numericId =
      Number(
        taluka?.id
      );


    if (
      Number.isFinite(
        numericId
      ) &&
      numericId > 0
    ) {

      return `TH-${String(
        numericId
      ).padStart(4, "0")}`;

    }


    return `TH-${String(
      index + 1
    ).padStart(4, "0")}`;

  };


  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (
    e
  ) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );

  };


  /* =======================================================
     DISTRICT DROPDOWN CHANGE
     
     District select केल्यावर:
     districtId
     districtName

     दोन्ही automatically save होतील.
  ======================================================= */

  const handleDistrictChange = (
    e
  ) => {

    const selectedId =
      e.target.value;


    const selectedDistrict =
      districts.find(
        (district) =>
          safeString(
            district?.id
          ) ===
          safeString(
            selectedId
          )
      );


    if (!selectedDistrict) {

      setFormData(
        (previous) => ({
          ...previous,

          districtId:
            selectedId,

          districtName:
            "",
        })
      );

      return;
    }


    setFormData(
      (previous) => ({
        ...previous,

        districtId:
          safeString(
            selectedDistrict.id
          ),

        districtName:
          safeString(
            selectedDistrict.name
          ),
      })
    );

  };


  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = async () => {

    setEditingId(null);


    setFormData({
      ...EMPTY_FORM,

      reportDate:
        new Date()
          .toISOString()
          .split("T")[0],
    });


    /* latest District records */

    await loadDistricts();


    setShowModal(true);

  };


  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = async (
    taluka
  ) => {

    await loadDistricts();


    setEditingId(
      taluka?.id
    );


    setFormData({

      name:
        safeString(
          taluka?.name
        ),


      contactNumber:
        safeString(
          taluka?.contactNumber
        ),


      reportDate:
        safeString(
          taluka?.reportDate
        ).split("T")[0],


      designation:
        safeString(
          taluka?.designation
        ),


      districtId:
        safeString(
          taluka?.districtId
        ),


      districtName:
        safeString(
          taluka?.districtName
        ),


      taluka:
        safeString(
          taluka?.taluka
        ),


      joiningDate:
        safeString(
          taluka?.joiningDate
        ).split("T")[0],


      accountNumber:
        safeString(
          taluka?.accountNumber
        ),


      ifscCode:
        safeString(
          taluka?.ifscCode
        ),


      bankName:
        safeString(
          taluka?.bankName
        ),


      status:
        safeString(
          taluka?.status ||
          "active"
        ).toLowerCase(),


      email:
        safeString(
          taluka?.email
        ),


      userId:
        safeString(
          taluka?.userId
        ),


      password:
        safeString(
          taluka?.password
        ),

    });


    setShowModal(true);

  };


  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {

    if (loading) {
      return;
    }


    setShowModal(false);

    setEditingId(null);


    setFormData({
      ...EMPTY_FORM,
    });

  };


  /* =======================================================
     PASSWORD TOGGLE
  ======================================================= */

  const togglePassword = (
    id
  ) => {

    setShowPasswords(
      (previous) => ({
        ...previous,

        [id]:
          !previous[id],
      })
    );

  };


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !safeString(
        formData.name
      ).trim()
    ) {

      alert(
        "Please enter Full Name"
      );

      return;
    }


    if (
      !safeString(
        formData.contactNumber
      ).trim()
    ) {

      alert(
        "Please enter Mobile Number"
      );

      return;
    }


    if (
      !/^[0-9]{10}$/.test(
        safeString(
          formData.contactNumber
        ).trim()
      )
    ) {

      alert(
        "Mobile Number must contain 10 digits"
      );

      return;
    }


    if (
      !safeString(
        formData.reportDate
      ).trim()
    ) {

      alert(
        "Please enter Report Date"
      );

      return;
    }


    if (
      !safeString(
        formData.designation
      ).trim()
    ) {

      alert(
        "Please enter Designation"
      );

      return;
    }


    /* =====================================================
       DISTRICT REQUIRED
    ===================================================== */

    if (
      !safeString(
        formData.districtId
      ).trim()
    ) {

      alert(
        "Please select District"
      );

      return;
    }


    if (
      !safeString(
        formData.taluka
      ).trim()
    ) {

      alert(
        "Please enter Taluka"
      );

      return;
    }


    if (
      !safeString(
        formData.joiningDate
      ).trim()
    ) {

      alert(
        "Please enter Joining Date"
      );

      return;
    }


    if (
      !safeString(
        formData.accountNumber
      ).trim()
    ) {

      alert(
        "Please enter Account Number"
      );

      return;
    }


    if (
      !safeString(
        formData.ifscCode
      ).trim()
    ) {

      alert(
        "Please enter IFSC Code"
      );

      return;
    }


    if (
      !safeString(
        formData.bankName
      ).trim()
    ) {

      alert(
        "Please enter Bank Name"
      );

      return;
    }


    if (
      !safeString(
        formData.email
      ).trim()
    ) {

      alert(
        "Please enter Email"
      );

      return;
    }


    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        safeString(
          formData.email
        ).trim()
      )
    ) {

      alert(
        "Please enter valid Email"
      );

      return;
    }


    if (
      !safeString(
        formData.userId
      ).trim()
    ) {

      alert(
        "Please enter User ID"
      );

      return;
    }


    if (
      !editingId &&
      !safeString(
        formData.password
      ).trim()
    ) {

      alert(
        "Please enter Password"
      );

      return;
    }


    try {

      setLoading(true);


      /* =================================================
         IMPORTANT

         districtId number/string दोन्ही safe.
      ================================================= */

      const districtIdValue =
        safeString(
          formData.districtId
        ).trim();


      /* =================================================
         PAYLOAD
      ================================================= */

      const payload = {

        name:
          safeString(
            formData.name
          ).trim(),


        /* backend ला district_id */

        district_id:
          Number(
            districtIdValue
          ),


        contact_number:
          safeString(
            formData.contactNumber
          ).trim(),


        user_id:
          safeString(
            formData.userId
          ).trim(),


        email:
          safeString(
            formData.email
          ).trim(),


        address:
          safeString(
            formData.taluka
          ).trim(),

      };


      /* =================================================
         PASSWORD
      ================================================= */

      if (
        safeString(
          formData.password
        ).trim()
      ) {

        payload.password =
          safeString(
            formData.password
          ).trim();

      }


      console.log(
        "FINAL TALUKA PAYLOAD:",
        payload
      );


      /* =================================================
         ADD
      ================================================= */

      if (!editingId) {

        const response =
          await fetch(
            TALUKA_API_URL,
            {
              method: "POST",

              headers:
                getHeaders(),

              body:
                JSON.stringify(
                  payload
                ),
            }
          );


        const result =
          await response.json();


        console.log(
          "ADD TALUKA RESPONSE:",
          result
        );


        if (!response.ok) {

          throw new Error(
            result?.message ||
            "Failed to add Taluka"
          );

        }


        if (
          result?.success === false
        ) {

          throw new Error(
            result?.message ||
            "Failed to add Taluka"
          );

        }


        alert(
          "Taluka added successfully"
        );


        handleClose();


        await loadTalukas();


        return;

      }


      /* =================================================
         UPDATE
      ================================================= */

      const response =
        await fetch(
          `${TALUKA_API_URL}/${editingId}`,
          {
            method: "PUT",

            headers:
              getHeaders(),

            body:
              JSON.stringify(
                payload
              ),
          }
        );


      const result =
        await response.json();


      console.log(
        "UPDATE TALUKA RESPONSE:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result?.message ||
          "Failed to update Taluka"
        );

      }


      if (
        result?.success === false
      ) {

        throw new Error(
          result?.message ||
          "Failed to update Taluka"
        );

      }


      alert(
        "Taluka updated successfully"
      );


      handleClose();


      await loadTalukas();


    } catch (error) {

      console.error(
        "TALUKA SAVE ERROR:",
        error
      );


      alert(
        error.message ||
        "Something went wrong"
      );


    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (
    id
  ) => {

    if (!id) {

      alert(
        "Taluka ID not found"
      );

      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to delete this Taluka?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setLoading(true);


      const response =
        await fetch(
          `${TALUKA_API_URL}/${id}`,
          {
            method: "DELETE",

            headers:
              getHeaders(),
          }
        );


      const result =
        await response.json();


      console.log(
        "DELETE TALUKA:",
        result
      );


      if (!response.ok) {

        throw new Error(
          result?.message ||
          "Failed to delete Taluka"
        );

      }


      if (
        result?.success === false
      ) {

        throw new Error(
          result?.message ||
          "Failed to delete Taluka"
        );

      }


      alert(
        "Taluka deleted successfully"
      );


      await loadTalukas();


    } catch (error) {

      console.error(
        "DELETE TALUKA ERROR:",
        error
      );


      alert(
        error.message ||
        "Failed to delete Taluka"
      );


    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredTalukas =
    talukas.filter(
      (item, index) => {

        const talukaId =
          getTalukaHeadId(
            item,
            index
          );


        const idKeyword =
          safeString(
            talukaIdSearch
          )
            .toLowerCase()
            .trim();


        const nameKeyword =
          safeString(
            nameSearch
          )
            .toLowerCase()
            .trim();


        const userKeyword =
          safeString(
            userIdSearch
          )
            .toLowerCase()
            .trim();


        return (

          (
            !idKeyword ||
            safeString(
              talukaId
            )
              .toLowerCase()
              .includes(
                idKeyword
              )
          )

          &&

          (
            !nameKeyword ||
            safeString(
              item?.name
            )
              .toLowerCase()
              .includes(
                nameKeyword
              )
          )

          &&

          (
            !userKeyword ||
            safeString(
              item?.userId
            )
              .toLowerCase()
              .includes(
                userKeyword
              )
          )

        );

      }
    );


  /* =======================================================
     EXCEL
  ======================================================= */

  const handleDownloadExcel =
    () => {

      if (
        filteredTalukas.length ===
        0
      ) {

        alert(
          "No Taluka records available to download."
        );

        return;
      }


      const excelData =
        filteredTalukas.map(
          (
            item,
            index
          ) => ({

            SR:
              index + 1,

            "Full Name":
              item.name || "",

            "Mobile Number":
              item.contactNumber ||
              "",

            "Report Date":
              formatDate(
                item.reportDate
              ),

            Designation:
              item.designation ||
              "",

            District:
              item.districtName ||
              "",

            "District ID":
              item.districtId ||
              "",

            Taluka:
              item.taluka ||
              "",

            "Joining Date":
              formatDate(
                item.joiningDate
              ),

            "Account No.":
              item.accountNumber ||
              "",

            "IFSC Code":
              item.ifscCode ||
              "",

            "Bank Name":
              item.bankName ||
              "",

            Email:
              item.email ||
              "",

            "User ID":
              item.userId ||
              "",

            Password:
              item.password ||
              "",

            Status:
              item.status ||
              "",

          })
        );


      const worksheet =
        XLSX.utils.json_to_sheet(
          excelData
        );


      worksheet["!cols"] = [

        { wch: 8 },

        { wch: 25 },

        { wch: 18 },

        { wch: 15 },

        { wch: 22 },

        { wch: 25 },

        { wch: 15 },

        { wch: 20 },

        { wch: 15 },

        { wch: 22 },

        { wch: 16 },

        { wch: 22 },

        { wch: 30 },

        { wch: 20 },

        { wch: 20 },

        { wch: 15 },

      ];


      const workbook =
        XLSX.utils.book_new();


      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Taluka Report"
      );


      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      XLSX.writeFile(
        workbook,
        `Taluka_Report_${today}.xlsx`
      );

    };


  /* =======================================================
     JSX
  ======================================================= */

  return (

    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          d-flex
          justify-content-between
          align-items-center
          mb-4
        "
      >

        <div>

          <h3
            className="fw-bold mb-1"
          >
            Taluka
          </h3>

          <p
            className="text-muted mb-0"
          >
            Manage taluka records
          </p>

        </div>


        <Button
          variant="dark"
          onClick={
            handleAdd
          }
          disabled={
            loading
          }
        >

          <span
            className="fw-bold me-2"
          >
            +
          </span>

          Add Taluka

        </Button>

      </div>


      {/* =================================================
          COUNTER
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
                width: "60px",
                height: "60px",
                fontSize: "20px",
              }}
            >

              {
                loading
                  ? "..."
                  : filteredTalukas.length
              }

            </div>


            <div>

              <small
                className="text-muted"
              >
                Total Talukas
              </small>

              <h4
                className="fw-bold mb-0"
              >

                {
                  loading
                    ? "..."
                    : filteredTalukas.length
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

            <div
              className="col-md-3"
            >

              <Form.Label
                className="fw-semibold mb-2"
              >
                Taluka ID
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Search Taluka ID..."
                value={
                  talukaIdSearch
                }
                onChange={
                  (e) =>
                    setTalukaIdSearch(
                      e.target.value
                    )
                }
              />

            </div>


            <div
              className="col-md-3"
            >

              <Form.Label
                className="fw-semibold mb-2"
              >
                Name
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Search Name..."
                value={
                  nameSearch
                }
                onChange={
                  (e) =>
                    setNameSearch(
                      e.target.value
                    )
                }
              />

            </div>


            <div
              className="col-md-3"
            >

              <Form.Label
                className="fw-semibold mb-2"
              >
                User ID
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Search User ID..."
                value={
                  userIdSearch
                }
                onChange={
                  (e) =>
                    setUserIdSearch(
                      e.target.value
                    )
                }
              />

            </div>


            <div
              className="col-md-3"
            >

              <Button
                type="button"
                variant="outline-secondary"
                className="w-100"
                onClick={() => {

                  setTalukaIdSearch("");

                  setNameSearch("");

                  setUserIdSearch("");

                }}
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
            border-bottom
            py-3
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

            <h6
              className="fw-bold mb-0"
            >
              Taluka List
            </h6>


            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={
                handleDownloadExcel
              }
              disabled={
                loading ||
                filteredTalukas.length ===
                  0
              }
            >
              ↓&nbsp; Download Excel
            </Button>

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
                    Full Name
                  </th>

                  <th>
                    Mobile Number
                  </th>

                  <th>
                    Report Date
                  </th>

                  <th>
                    Designation
                  </th>

                  <th>
                    District
                  </th>

                  <th>
                    Taluka ID
                  </th>

                  <th>
                    Taluka
                  </th>

                  <th>
                    Joining Date
                  </th>

                  <th>
                    Account No.
                  </th>

                  <th>
                    IFSC Code
                  </th>

                  <th>
                    Bank Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    User ID
                  </th>

                  <th>
                    Password
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading && (

                  <tr>

                    <td
                      colSpan="17"
                      className="
                        text-center
                        py-5
                      "
                    >
                      Loading Talukas...
                    </td>

                  </tr>

                )}


                {!loading &&
                  filteredTalukas.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan="17"
                        className="
                          text-center
                          py-5
                          text-muted
                        "
                      >
                        No Talukas found.
                      </td>

                    </tr>

                  )}


                {!loading &&
                  filteredTalukas.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>
                          {
                            index + 1
                          }
                        </td>


                        <td>
                          {
                            item.name ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.contactNumber ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            formatDate(
                              item.reportDate
                            ) ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.designation ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.districtName ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.districtId ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.taluka ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            formatDate(
                              item.joiningDate
                            ) ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.accountNumber ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.ifscCode ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.bankName ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.email ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            item.userId ||
                            "-"
                          }
                        </td>


                        <td>

                          {
                            item.password
                              ? (
                                <>
                                  {
                                    showPasswords[
                                      item.id
                                    ]
                                      ? item.password
                                      : "••••••••"
                                  }


                                  <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    className="
                                      p-0
                                      ms-2
                                      text-decoration-none
                                    "
                                    onClick={() =>
                                      togglePassword(
                                        item.id
                                      )
                                    }
                                  >

                                    {
                                      showPasswords[
                                        item.id
                                      ]
                                        ? "Hide"
                                        : "Show"
                                    }

                                  </Button>

                                </>
                              )
                              : "-"
                          }

                        </td>


                        <td>

                          <span
                            className={`badge ${
                              safeString(
                                item.status
                              ).toLowerCase() ===
                              "inactive"
                                ? "bg-danger-subtle text-danger"
                                : "bg-success-subtle text-success"
                            }`}
                          >

                            {
                              item.status ||
                              "Active"
                            }

                          </span>

                        </td>


                        <td>

                          <div
                            className="
                              d-flex
                              gap-2
                            "
                          >

                            <Button
                              size="sm"
                              variant="outline-dark"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              Edit
                            </Button>


                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              disabled={
                                loading
                              }
                            >
                              Delete
                            </Button>

                          </div>

                        </td>

                      </tr>

                    )
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
        show={
          showModal
        }
        onHide={
          handleClose
        }
        centered
        size="lg"
        backdrop="static"
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

              {
                editingId
                  ? "Edit Taluka"
                  : "Add Taluka"
              }

            </Modal.Title>

          </Modal.Header>


          <Modal.Body
            style={{
              maxHeight:
                "65vh",

              overflowY:
                "auto",
            }}
          >

            <div
              className="row g-3"
            >

              {/* FULL NAME */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Full Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* MOBILE */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Mobile Number
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="contactNumber"
                    value={
                      formData.contactNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter 10 digit mobile number"
                    maxLength="10"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* REPORT DATE */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Report Date
                  </Form.Label>

                  <Form.Control
                    type="date"
                    name="reportDate"
                    value={
                      formData.reportDate
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* DESIGNATION */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Designation
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="designation"
                    value={
                      formData.designation
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter designation"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* =================================================
                  DISTRICT DROPDOWN
              ================================================= */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    District
                  </Form.Label>

                  <Form.Select
                    name="districtId"
                    value={
                      safeString(
                        formData.districtId
                      )
                    }
                    onChange={
                      handleDistrictChange
                    }
                    disabled={
                      loading
                    }
                  >

                    <option value="">
                      Select District
                    </option>


                    {districts.length > 0 ? (

                      districts.map(
                        (
                          district
                        ) => (

                          <option
                            key={
                              district.id
                            }
                            value={
                              district.id
                            }
                          >

                            {
                              district.name
                            }

                          </option>

                        )
                      )

                    ) : (

                      <option
                        value=""
                        disabled
                      >
                        No District Found
                      </option>

                    )}

                  </Form.Select>

                </Form.Group>

              </div>


              {/* DISTRICT ID */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    District ID
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={
                      safeString(
                        formData.districtId
                      )
                    }
                    readOnly
                    placeholder="Select District"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* TALUKA */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Taluka
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="taluka"
                    value={
                      formData.taluka
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter taluka"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* JOINING DATE */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Joining Date
                  </Form.Label>

                  <Form.Control
                    type="date"
                    name="joiningDate"
                    value={
                      formData.joiningDate
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* ACCOUNT */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Account No.
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="accountNumber"
                    value={
                      formData.accountNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter account number"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* IFSC */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    IFSC Code
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="ifscCode"
                    value={
                      formData.ifscCode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter IFSC code"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* BANK */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Bank Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="bankName"
                    value={
                      formData.bankName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter bank name"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* STATUS */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Status
                  </Form.Label>

                  <Form.Select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      loading
                    }
                  >

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                  </Form.Select>

                </Form.Group>

              </div>


              {/* EMAIL */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Email
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter Email"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* USER ID */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    User ID
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="userId"
                    value={
                      formData.userId
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter User ID"
                    autoComplete="username"
                    disabled={
                      loading
                    }
                  />

                </Form.Group>

              </div>


              {/* PASSWORD */}

              <div
                className="col-md-6"
              >

                <Form.Group>

                  <Form.Label>
                    Password
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    disabled={
                      loading
                    }
                  />

                  {editingId && (

                    <Form.Text
                      className="text-muted"
                    >
                      Password बदलायचा नसेल तर
                      existing password तसाच राहील.
                    </Form.Text>

                  )}

                </Form.Group>

              </div>

            </div>

          </Modal.Body>


          {/* FOOTER */}

          <Modal.Footer>

            <Button
              variant="secondary"
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
            >
              Cancel
            </Button>


            <Button
              variant="dark"
              type="submit"
              disabled={
                loading
              }
            >

              {
                loading
                  ? "Please wait..."
                  : editingId
                  ? "Update Taluka"
                  : "Add Taluka"
              }

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>


      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        .table th,
        .table td {
          white-space: nowrap;
          font-size: 13px;
          vertical-align: middle;
        }

        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .table {
          min-width: 1800px;
        }

        @media (max-width: 768px) {

          .table th,
          .table td {
            font-size: 12px;
            padding: 8px 10px;
          }

        }

      `}</style>

    </div>

  );
};


export default Taluka;