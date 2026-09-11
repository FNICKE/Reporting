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

    const API_URL = `${API_BASE_URL}/district`;


    /* =========================================================
      EMPTY FORM
    ========================================================= */

    const EMPTY_FORM = {
      name: "",
      contactNumber: "",
      reportDate: new Date().toISOString().split("T")[0],
      designation: "",
      districtName: "",
      districtCode: "",
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

    const MAHARASHTRA_DISTRICTS = [
      "Ahmednagar",
      "Akola",
      "Amravati",
      "Chhatrapati Sambhajinagar",
      "Beed",
      "Bhandara",
      "Buldhana",
      "Chandrapur",
      "Dhule",
      "Gadchiroli",
      "Gondia",
      "Hingoli",
      "Jalgaon",
      "Jalna",
      "Kolhapur",
      "Latur",
      "Mumbai City",
      "Mumbai Suburban",
      "Nagpur",
      "Nanded",
      "Nandurbar",
      "Nashik",
      "Dharashiv",
      "Palghar",
      "Parbhani",
      "Pune",
      "Raigad",
      "Ratnagiri",
      "Sangli",
      "Satara",
      "Sindhudurg",
      "Solapur",
      "Thane",
      "Wardha",
      "Washim",
      "Yavatmal",
    ];

    const DESIGNATION_OPTIONS = [
      "District Head (जिल्हा प्रमुख)",
      "District Officer (जिल्हा अधिकारी)",
      "District Coordinator (जिल्हा समन्वयक)",
      "Business Development Officer (BDO)",
      "District In-Charge (जिल्हा प्रभारी)",
      "Trainer (प्रशिक्षक)",
      "Center Head (केंद्र प्रमुख)",
    ];

    const BANK_OPTIONS = [
      "State Bank of India",
      "Bank of Maharashtra",
      "HDFC Bank",
      "ICICI Bank",
      "Bank of Baroda",
      "Axis Bank",
      "Punjab National Bank",
      "Canara Bank",
      "Union Bank of India",
      "Kotak Mahindra Bank",
      "IDBI Bank",
      "Central Bank of India",
      "Indian Bank",
      "IndusInd Bank",
      "Yes Bank",
      "Maharashtra Gramin Bank",
      "Vidarbha Konkan Gramin Bank",
    ];


    /* =========================================================
      COMPONENT
    ========================================================= */

    const District = () => {

      const [districts, setDistricts] =
        useState([]);

      const [showModal, setShowModal] =
        useState(false);

      const [formData, setFormData] =
        useState(EMPTY_FORM);

      const [editingId, setEditingId] =
        useState(null);

      const [loading, setLoading] =
        useState(false);

      const [showPasswords, setShowPasswords] =
        useState({});

      /* =======================================================
        SEARCH STATES
      ======================================================= */

      const [headIdSearch, setHeadIdSearch] = useState("");
      const [nameSearch, setNameSearch] = useState("");
      const [userIdSearch, setUserIdSearch] = useState("");


      /* =======================================================
        LOAD DATA
      ======================================================= */

      useEffect(() => {

        loadDistricts();

      }, []);


      /* =======================================================
        AUTH HEADER
      ======================================================= */

      const getHeaders = () => {

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("accessToken");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization =
            `Bearer ${token}`;
        }

        return headers;
      };


      /* =======================================================
        LOAD DISTRICTS
      ======================================================= */

      const loadDistricts = async () => {

        try {

          setLoading(true);

          const response =
            await fetch(API_URL, {
              method: "GET",
              headers: getHeaders(),
            });


          const result =
            await response.json();


          if (!response.ok) {

            throw new Error(
              result.message ||
              "Failed to fetch districts"
            );

          }


          if (
            result.success &&
            Array.isArray(result.data)
          ) {

            const formattedData =
              result.data.map(
                (item) => ({

                  ...item,

                  /* ================================
                    BASIC / COMMON FIELDS
                  ================================= */

                  id:
                    item.id ||
                    item.district_id ||
                    item.districtId ||
                    "",

                  name:
                    item.name ||
                    item.full_name ||
                    item.fullName ||
                    "",

                  /* ================================
                    REPORT DATE
                  ================================= */

                  reportDate:
                    item.reportDate ||
                    item.report_date
                      ? formatDate(
                          item.reportDate ||
                          item.report_date
                        )
                      : "",

                  /* ================================
                    CONTACT NUMBER
                  ================================= */

                  contactNumber:
                    item.contactNumber ||
                    item.contact_number ||
                    item.mobileNumber ||
                    item.mobile_number ||
                    item.mobile ||
                    "",

                  /* ================================
                    DESIGNATION
                  ================================= */

                  designation:
                    item.designation ||
                    item.designation_name ||
                    "",

                  /* ================================
                    DISTRICT
                  ================================= */

                  districtName:
                    item.districtName ||
                    item.district_name ||
                    item.district ||
                    "",

                  /* ================================
                    DISTRICT ID / CODE
                  ================================= */

                  districtCode:
                    item.districtCode ||
                    item.district_code ||
                    item.districtId ||
                    item.district_id ||
                    "",

                  /* ================================
                    TALUKA
                  ================================= */

                  taluka:
                    item.taluka ||
                    item.talukaName ||
                    item.taluka_name ||
                    "",

                  /* ================================
                    JOINING DATE
                  ================================= */

                  joiningDate:
                    item.joiningDate ||
                    item.joining_date
                      ? formatDate(
                          item.joiningDate ||
                          item.joining_date
                        )
                      : "",

                  /* ================================
                    ACCOUNT / BANK
                  ================================= */

                  accountNumber:
                    item.accountNumber ||
                    item.account_number ||
                    item.accountNo ||
                    item.account_no ||
                    "",

                  ifscCode:
                    item.ifscCode ||
                    item.ifsc_code ||
                    item.ifsc ||
                    "",

                  bankName:
                    item.bankName ||
                    item.bank_name ||
                    "",

                  /* ================================
                    STATUS
                  ================================= */

                  status:
                    item.status
                      ? capitalizeStatus(
                          String(item.status)
                        )
                      : "Active",

                  /* ================================
                    LOGIN FIELDS
                  ================================= */

                  email:
                    item.email ||
                    item.emailAddress ||
                    item.email_address ||
                    "",

                  userId:
                    item.userId ||
                    item.user_id ||
                    item.username ||
                    "",

                  password:
                    item.password ||
                    "",

                  /* ================================
                    DISTRICT HEAD ID
                  ================================= */

                  districtHeadId:
                    item.districtHeadId ||
                    item.district_head_id ||
                    item.headId ||
                    item.head_id ||
                    "",

                })
              );


            setDistricts(
              formattedData
            );

          } else {

            setDistricts([]);

          }

        } catch (error) {

          console.error(
            "District loading error:",
            error
          );

          alert(
            error.message ||
            "Failed to load District data"
          );

          setDistricts([]);

        } finally {

          setLoading(false);

        }

      };


      /* =======================================================
        DATE FORMAT
      ======================================================= */

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

          return dateValue;

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


      /* =======================================================
        STATUS FORMAT
      ======================================================= */

      const capitalizeStatus = (
        status
      ) => {

        if (!status) {
          return "Active";
        }

        return (
          status.charAt(0).toUpperCase() +
          status.slice(1)
        );

      };


      /* =======================================================
        INPUT CHANGE
      ======================================================= */

    /* =======================================================
        AUTO DISTRICT HEAD ID
      ======================================================= */

    const getDistrictHeadId = (district, index = 0) => {

      const existingId =
        district?.districtHeadId ||
        district?.district_head_id ||
        district?.headId ||
        district?.head_id;

      if (existingId) {
        return existingId;
      }

      const numericId = Number(district?.id);

      if (Number.isFinite(numericId) && numericId > 0) {
        return `DH-${String(numericId).padStart(4, "0")}`;
      }

      return `DH-${String(index + 1).padStart(4, "0")}`;
    };



      const handleChange = (
        e
      ) => {

        const {
          name,
          value,
        } = e.target;


        setFormData(
          (prev) => ({
            ...prev,
            [name]: value,
          })
        );

      };


      /* =======================================================
        OPEN ADD
      ======================================================= */

      const handleAdd = () => {

        setEditingId(null);

        setFormData({
          ...EMPTY_FORM,
        });

        setShowModal(true);

      };


      /* =======================================================
        OPEN EDIT
      ======================================================= */

      const handleEdit = (
        district
      ) => {

        setEditingId(
          district.id
        );


        setFormData({

          name:
            district.name || "",

          contactNumber:
            district.contactNumber ||
            district.contact_number ||
            "",

          reportDate:
            String(district.report_date || district.reportDate || "").split("T")[0],

          designation: district.designation || "",
          districtName: district.district_name || district.districtName || "",
          districtCode: district.district_code || district.districtCode || "",
          taluka: district.taluka || "",
          joiningDate:
            String(district.joining_date || district.joiningDate || "").split("T")[0],
          accountNumber: district.account_number || district.accountNumber || "",
          ifscCode: district.ifsc_code || district.ifscCode || "",
          bankName: district.bank_name || district.bankName || "",
          status: String(district.status || "active").toLowerCase(),

          email:
            district.email || "",

          userId:
            district.userId ||
            district.user_id ||
            "",

          password:
            district.password || "",

        });


        setShowModal(true);

      };


      /* =======================================================
        CLOSE MODAL
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
        TOGGLE PASSWORD
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
        SUBMIT FORM
      ======================================================= */

      const handleSubmit = async (
        e
      ) => {

        e.preventDefault();


        /* =====================================================
          VALIDATION
        ===================================================== */

        if (
          !formData.name.trim()
        ) {

          alert(
            "Please enter Name"
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

        const requiredFields = [
          ["reportDate", "Report Date"],
          ["designation", "Designation"],
          ["districtName", "District"],
          ["districtCode", "District ID"],
          ["joiningDate", "Joining Date"],
          ["accountNumber", "Account Number"],
          ["ifscCode", "IFSC Code"],
          ["bankName", "Bank Name"],
        ];

        for (const [field, label] of requiredFields) {
          if (!String(formData[field] || "").trim()) {
            alert(`Please enter ${label}`);
            return;
          }
        }





        if (
          !formData.userId.trim()
        ) {

          alert(
            "Please enter User ID"
          );

          return;

        }


        /* ================================================
          PASSWORD REQUIRED ONLY ON ADD
        ================================================ */

        if (
          !editingId &&
          !formData.password.trim()
        ) {

          alert(
            "Please enter Password"
          );

          return;

        }


        try {

          setLoading(true);


          /* =================================================
            ADD DISTRICT
          ================================================= */

          if (!editingId) {

            const payload = {

              name:
                formData.name.trim(),

              report_date:
                formData.reportDate,

              status:
                formData.status,

              designation: formData.designation.trim(),
              district_name: formData.districtName.trim(),
              district_code: formData.districtCode.trim(),
              taluka: formData.taluka.trim(),
              joining_date: formData.joiningDate,
              account_number: formData.accountNumber.trim(),
              ifsc_code: formData.ifscCode.trim().toUpperCase(),
              bank_name: formData.bankName.trim(),

              contact_number:
                formData.contactNumber.trim(),

              user_id:
                formData.userId.trim(),

              email:
                formData.email.trim(),

              password:
                formData.password.trim(),

            };


            const response =
              await fetch(
                API_URL,
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


            if (!response.ok) {

              throw new Error(
                result.message ||
                "Failed to add District"
              );

            }


            if (
              !result.success
            ) {

              throw new Error(
                result.message ||
                "Failed to add District"
              );

            }


            alert(
              "District added successfully"
            );


            handleClose();


            await loadDistricts();


            return;

          }


          /* =================================================
            UPDATE DISTRICT
          ================================================= */

          const payload = {

            name:
              formData.name.trim(),

            report_date: formData.reportDate,

            contact_number:
              formData.contactNumber.trim(),

            designation: formData.designation.trim(),
            district_name: formData.districtName.trim(),
            district_code: formData.districtCode.trim(),
            taluka: formData.taluka.trim(),
            joining_date: formData.joiningDate,
            account_number: formData.accountNumber.trim(),
            ifsc_code: formData.ifscCode.trim().toUpperCase(),
            bank_name: formData.bankName.trim(),

            user_id:
              formData.userId.trim(),

            email:
              formData.email.trim(),

            status:
              formData.status,

          };


          /*
          * Password entered असेल तरच
          * update करणार.
          */

          if (
            formData.password.trim()
          ) {

            payload.password =
              formData.password.trim();

          }


          const response =
            await fetch(
              `${API_URL}/${editingId}`,
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


          if (!response.ok) {

            throw new Error(
              result.message ||
              "Failed to update District"
            );

          }


          if (
            !result.success
          ) {

            throw new Error(
              result.message ||
              "Failed to update District"
            );

          }


          alert(
            "District updated successfully"
          );


          handleClose();


          await loadDistricts();

        } catch (error) {

          console.error(
            "District save error:",
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

    const handleDelete = async (id) => {
    if (!id) {
      alert("District ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this District?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoading(true);

      console.log("DELETE DISTRICT ID:", id);
      console.log(
        "DELETE URL:",
        `${API_URL}/${id}`
      );

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      console.log(
        "DELETE RESPONSE STATUS:",
        response.status
      );

      console.log(
        "DELETE RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
          `Delete failed (${response.status})`
        );
      }

      if (!result.success) {
        throw new Error(
          result.message ||
          "Failed to delete District"
        );
      }

      alert(
        "District deleted successfully"
      );

      await loadDistricts();

    } catch (error) {

      console.error(
        "District delete error:",
        error
      );

      alert(
        error.message ||
        "Failed to delete District"
      );

    } finally {

      setLoading(false);

    }
  };


      /* =======================================================
        DOWNLOAD EXCEL
      ======================================================= */

      const handleDownloadExcel = () => {
        try {
          if (!filteredDistricts.length) {
            alert("No District records available to download.");
            return;
          }

          const excelData = filteredDistricts.map(
            (district, index) => ({
              SR: index + 1,

              "Full Name":
                district.name || "",

              "Mobile Number":
                district.contactNumber || "",

              "Report Date":
                district.reportDate || "",

              Designation:
                district.designation || "",

              District:
                district.districtName || "",

              "District ID":
                district.districtCode || "",

              Taluka:
                district.taluka || "",

              "Joining Date":
                district.joiningDate || "",

              "Account No.":
                district.accountNumber || "",

              "IFSC Code":
                district.ifscCode || "",

              "Bank Name":
                district.bankName || "",

              Email:
                district.email || "",

              "User ID":
                district.userId || "",

              Password:
                district.password || "",

              Status:
                district.status || "",
            })
          );

          const worksheet =
            XLSX.utils.json_to_sheet(excelData);

          worksheet["!cols"] = [
            { wch: 8 },
            { wch: 25 },
            { wch: 18 },
            { wch: 15 },
            { wch: 22 },
            { wch: 20 },
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
            "District Report"
          );

          const today =
            new Date()
              .toISOString()
              .split("T")[0];

          XLSX.writeFile(
            workbook,
            `District_Report_${today}.xlsx`
          );

        } catch (error) {
          console.error(
            "District Excel download error:",
            error
          );

          alert(
            "Unable to download District Excel file."
          );
        }
      };


      /* =======================================================
        FILTERED DISTRICTS
      ======================================================= */

      const filteredDistricts = districts.filter(
        (district, index) => {
          const headId =
            district.districtCode ||
            district.district_code ||
            getDistrictHeadId(district, index);

          const headKeyword =
            headIdSearch.trim().toLowerCase();

          const nameKeyword =
            nameSearch.trim().toLowerCase();

          const userKeyword =
            userIdSearch.trim().toLowerCase();

          return (
            (!headKeyword ||
              String(headId)
                .toLowerCase()
                .includes(headKeyword)) &&
            (!nameKeyword ||
              String(district?.name || "")
                .toLowerCase()
                .includes(nameKeyword)) &&
            (!userKeyword ||
              String(
                district?.userId ||
                district?.user_id ||
                district?.username ||
                ""
              )
                .toLowerCase()
                .includes(userKeyword))
          );
        }
      );


      /* =======================================================
        JSX
      ======================================================= */

      return (

        <div>

          {/* =================================================
              PAGE HEADER
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
                District
              </h3>

              <p
                className="text-muted mb-0"
              >
                Manage district records
              </p>

            </div>


            <Button
              variant="dark"
              onClick={handleAdd}
              disabled={loading}
            >

              <span
                className="fw-bold me-2"
              >
                +
              </span>

              Add District

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

                  {loading
                    ? "..."
                    : filteredDistricts.length}

                </div>


                <div>

                  <small
                    className="text-muted"
                  >
                    Total Districts
                  </small>

                  <h4
                    className="fw-bold mb-0"
                  >
                    {loading
                      ? "..."
                      : filteredDistricts.length}
                  </h4>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">

                {/* DISTRICT ID */}

                <div className="col-md-3">
                  <Form.Label className="fw-semibold mb-2">
                    District ID
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Search District ID..."
                    value={headIdSearch}
                    onChange={(event) =>
                      setHeadIdSearch(event.target.value)
                    }
                  />
                </div>

                {/* NAME */}

                <div className="col-md-3">
                  <Form.Label className="fw-semibold mb-2">
                    Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Search Name..."
                    value={nameSearch}
                    onChange={(event) =>
                      setNameSearch(event.target.value)
                    }
                  />
                </div>

                {/* USER ID */}

                <div className="col-md-3">
                  <Form.Label className="fw-semibold mb-2">
                    User ID
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Search User ID..."
                    value={userIdSearch}
                    onChange={(event) =>
                      setUserIdSearch(event.target.value)
                    }
                  />
                </div>

                {/* CLEAR */}

                <div className="col-md-3">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => {
                      setHeadIdSearch("");
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
                  District List
                </h6>

                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={handleDownloadExcel}
                  disabled={
                    loading ||
                    filteredDistricts.length === 0
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

                      <th>Full Name</th>
                      <th>Mobile Number</th>
                      <th>Report Date</th>
                      <th>Designation</th>
                      <th>District</th>
                      <th>District ID</th>
                      <th>Taluka</th>
                      <th>Joining Date</th>
                      <th>Account No.</th>
                      <th>IFSC Code</th>
                      <th>Bank Name</th>
                      <th>Email</th>
                      <th>User ID</th>
                      <th>Password</th>
                      <th>Status</th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {loading && (

                      <tr>

                        <td
                          colSpan="16"
                          className="
                            text-center
                            py-5
                          "
                        >

                          Loading districts...

                        </td>

                      </tr>

                    )}


                    {!loading &&
                      filteredDistricts.length === 0 && (

                        <tr>

                          <td
                          colSpan="16"
                            className="
                              text-center
                              py-5
                              text-muted
                            "
                          >

                            No districts found.

                          </td>

                        </tr>

                      )}


                    {!loading &&
                      filteredDistricts.map(
                        (district, index) => (

                          <tr
                            key={
                              district.id
                            }
                          >

                            {/* SR */}

                            <td>

                              {index + 1}

                            </td>


                            <td>{district.name || "-"}</td>
                            <td>{district.contactNumber || "-"}</td>
                            <td>{district.reportDate || "-"}</td>
                            <td>{district.designation || "-"}</td>
                            <td>{district.districtName || "-"}</td>
                            <td>{district.districtCode || "-"}</td>
                            <td>{district.taluka || "-"}</td>
                            <td>{district.joiningDate || "-"}</td>
                            <td>{district.accountNumber || "-"}</td>
                            <td>{district.ifscCode || "-"}</td>
                            <td>{district.bankName || "-"}</td>
                            <td>{district.email || "-"}</td>
                            <td>{district.userId || "-"}</td>
                            <td>
                              {district.password
                                ? (showPasswords[district.id]
                                    ? district.password
                                    : "••••••••")
                                : "-"}
                              {district.password && (
                                <Button
                                  type="button"
                                  variant="link"
                                  size="sm"
                                  className="p-0 ms-2 text-decoration-none"
                                  onClick={() =>
                                    togglePassword(district.id)
                                  }
                                  disabled={loading}
                                >
                                  {showPasswords[district.id]
                                    ? "Hide"
                                    : "Show"}
                                </Button>
                              )}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  district.status === "Inactive"
                                    ? "bg-danger-subtle text-danger"
                                    : "bg-success-subtle text-success"
                                }`}
                              >
                                {district.status}
                              </span>
                            </td>

                            {/* ACTION */}

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
                                      district
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
                                      district.id
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
            show={showModal}
            onHide={handleClose}
            centered
            size="lg"
            backdrop="static"
          >

            <Form
              onSubmit={handleSubmit}
            >

              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                  {editingId ? "Edit District (जिल्हा संपादित करा)" : "Add District (जिल्हा जोडा)"}
                </Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ maxHeight: "65vh", overflowY: "auto" }}>
                <div className="row g-3">

                  {/* NAME */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Full Name (पूर्ण नाव) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="पूर्ण नाव प्रविष्ट करा"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* CONTACT */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Mobile Number (मोबाईल क्रमांक)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="१० अंकी मोबाईल क्रमांक"
                        maxLength="10"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* REPORT DATE */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Report Date (अहवालाची तारीख)
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="reportDate"
                        value={formData.reportDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* DESIGNATION */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Designation (पद) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        list="designationList"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Select or type Designation (पद निवडा किंवा टाईप करा)"
                        disabled={loading}
                      />
                      <datalist id="designationList">
                        {DESIGNATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </Form.Group>
                  </div>

                  {/* DISTRICT */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        District (जिल्हा) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        list="districtList"
                        name="districtName"
                        value={formData.districtName}
                        onChange={handleChange}
                        placeholder="Select or type District (जिल्हा निवडा किंवा टाईप करा)"
                        disabled={loading}
                      />
                      <datalist id="districtList">
                        {MAHARASHTRA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist} />
                        ))}
                      </datalist>
                    </Form.Group>
                  </div>

                  {/* DISTRICT ID */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        District ID (जिल्हा क्रमांक) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="districtCode"
                        value={formData.districtCode}
                        onChange={handleChange}
                        placeholder="जिल्हा क्रमांक प्रविष्ट करा"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* TALUKA (OPTIONAL) */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Taluka (तालुका) <span className="text-muted fw-normal">(Optional / पर्यायी)</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="taluka"
                        value={formData.taluka}
                        onChange={handleChange}
                        placeholder="तालुका प्रविष्ट करा (पर्यायी)"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* JOINING DATE */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Joining Date (रुजू तारीख) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* ACCOUNT NUMBER */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Account No. (खाते क्रमांक) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="बँक खाते क्रमांक"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* IFSC */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        IFSC Code (आयएफएससी कोड) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="IFSC कोड प्रविष्ट करा"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* BANK NAME */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Bank Name (बँकेचे नाव) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        list="bankList"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="Select or type Bank (बँकेचे नाव निवडा किंवा टाईप करा)"
                        disabled={loading}
                      />
                      <datalist id="bankList">
                        {BANK_OPTIONS.map((bank) => (
                          <option key={bank} value={bank} />
                        ))}
                      </datalist>
                    </Form.Group>
                  </div>

                  {/* STATUS */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Status (स्थिती)
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="active">Active (सक्रिय)</option>
                        <option value="inactive">Inactive (निष्क्रिय)</option>
                      </Form.Select>
                    </Form.Group>
                  </div>



                  {/* USER ID */}
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
                        autoComplete="username"
                        disabled={loading}
                      />
                    </Form.Group>
                  </div>

                  {/* PASSWORD */}
                  <div className="col-md-6">
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Password (पासवर्ड)
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="पासवर्ड प्रविष्ट करा"
                        autoComplete="new-password"
                        disabled={loading}
                      />
                      {editingId && (
                        <Form.Text className="text-muted">
                          Password बदलायचा नसेल तर existing password तसाच राहील.
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
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel (रद्द करा)
                </Button>

                <Button
                  variant="dark"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : editingId
                    ? "Update District (अद्यतनित करा)"
                    : "Add District (जोडा)"}
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

            .district-head-id {
              font-weight: 700;
              color: #212529;
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


    export default District;
