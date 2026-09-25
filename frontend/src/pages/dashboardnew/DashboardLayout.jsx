import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Swal from "sweetalert2";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const adminName = localStorage.getItem("logged_in_name") || "Admin";
  const adminInitial = (adminName.trim().charAt(0) || "A").toUpperCase();

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout from Admin Dashboard?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111827",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const keys = [
          "admin_logged_in",
          "logged_in_user",
          "logged_in_user_id",
          "logged_in_name",
          "logged_in_role",
          "logged_in_status",
          "logged_in_district_id",
          "logged_in_district_name",
          "logged_in_taluka_id",
          "logged_in_taluka_name",
          "logged_in_vibhag_id",
          "logged_in_vibhag_name",
          "logged_in_trainer_id",
          "logged_in_trainer_name",
        ];
        keys.forEach((key) => localStorage.removeItem(key));
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    });
  };

  return (
    <div className="dashboard-wrapper">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="sidebar-brand">

          <div className="brand-icon">
            A
          </div>

          <div className="brand-content">
            <h5>Admin Panel</h5>
            <span>Management System</span>
          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>

        </div>


        {/* =================================================
            SIDEBAR MENU
        ================================================= */}

        <div className="sidebar-scroll">

          {/* =================================================
              MAIN MENU
          ================================================= */}

          <div className="menu-section">

            <div className="menu-section-title">
              MAIN MENU
            </div>

            <NavLink
              to="/dashboard"
              end
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ▣
              </span>

              <span className="sidebar-text">
                Dashboard
              </span>

            </NavLink>

          </div>


          {/* =================================================
              MASTER
          ================================================= */}

          <div className="menu-section">

            <div className="menu-section-title">
              MASTER
            </div>


            {/* DISTRICT */}

            <NavLink
              to="/dashboard/district"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ◈
              </span>

              <span className="sidebar-text">
                District Head
              </span>

            </NavLink>


            {/* TALUKA */}

            <NavLink
              to="/dashboard/taluka"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ◇
              </span>

              <span className="sidebar-text">
                Taluka Head
              </span>

            </NavLink>


            {/* VIBHAG */}

            <NavLink
              to="/dashboard/vibhag"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ◫
              </span>

              <span className="sidebar-text">
                Vibhag Head
              </span>

            </NavLink>


            {/* TRAINER */}

            <NavLink
              to="/dashboard/trainer"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ◉
              </span>

              <span className="sidebar-text">
                BDO (business development officers)
              </span>

            </NavLink>

          </div>


          {/* =================================================
              REPORTS
          ================================================= */}

          <div className="menu-section">

            <div className="menu-section-title">
              REPORTS
            </div>


            {/* DISTRICT REPORT */}

            <NavLink
              to="/dashboard/reports/district"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ▤
              </span>

              <span className="sidebar-text">
                District Reports
              </span>

            </NavLink>


            {/* TALUKA REPORT */}

            <NavLink
              to="/dashboard/reports/taluka"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ▥
              </span>

              <span className="sidebar-text">
                Taluka Reports
              </span>

            </NavLink>


            {/* VIBHAG REPORT */}

            <NavLink
              to="/dashboard/reports/vibhag"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ▦
              </span>

              <span className="sidebar-text">
                Vibhag Reports
              </span>

            </NavLink>


            {/* TRAINER REPORT */}

            <NavLink
              to="/dashboard/reports/trainer"
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">
                ▧
              </span>

              <span className="sidebar-text">
                BDO (business development officers) Reports
              </span>

            </NavLink>

          </div>

        </div>


        {/* =================================================
            SIDEBAR FOOTER WITH LOGOUT BUTTON
        ================================================= */}

        <div className="sidebar-footer">

          <div className="sidebar-footer-user">

            <div className="footer-avatar">
              {adminInitial}
            </div>

            <div className="footer-info">
              <div className="footer-name">
                {adminName}
              </div>

              <div className="footer-role">
                Administrator
              </div>
            </div>

          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout from Admin Panel"
          >
            <svg
              className="sidebar-logout-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="sidebar-logout-text">
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="dashboard-main">


        {/* =================================================
            TOP NAVBAR
        ================================================= */}

        <header className="dashboard-navbar">

          <div className="navbar-left">

            {/* MENU BUTTON */}

            <button
              type="button"
              className="sidebar-toggle"
              onClick={() =>
                setSidebarOpen(!sidebarOpen)
              }
              title="Toggle Menu"
            >
              ☰
            </button>


            {/* TITLE */}

            <div className="navbar-title">

              <h6>
                Admin Dashboard
              </h6>

              <span>
                Management System
              </span>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE (ADMIN PROFILE + NAVBAR LOGOUT)
          ================================================= */}

          <div className="navbar-right">

            <div className="admin-profile">

              <div className="admin-avatar">
                {adminInitial}
              </div>

              <div className="admin-info">

                <div className="admin-name">
                  {adminName}
                </div>

                <div className="admin-role">
                  Administrator
                </div>

              </div>

            </div>

            <div className="navbar-divider" />

            {/* NAVBAR LOGOUT BUTTON */}

            <button
              type="button"
              className="navbar-logout-btn"
              onClick={handleLogout}
              title="Logout from Admin Panel"
            >
              <svg
                className="navbar-logout-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="navbar-logout-text">
                Logout
              </span>
            </button>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="dashboard-content">

          <Outlet />

        </main>

      </div>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        /* =================================================
           GLOBAL
        ================================================= */

        * {
          box-sizing: border-box;
        }


        .dashboard-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #f5f7fb;
          overflow-x: hidden;
        }


        /* =================================================
           SIDEBAR
        ================================================= */

        .dashboard-sidebar {
          width: 260px;
          min-width: 260px;
          height: 100vh;

          position: fixed;
          left: 0;
          top: 0;

          display: flex;
          flex-direction: column;

          background:
            linear-gradient(
              180deg,
              #111827 0%,
              #172033 100%
            );

          color: #ffffff;

          z-index: 1000;

          box-shadow:
            4px 0 20px
            rgba(0, 0, 0, 0.08);

          transition:
            transform 0.3s ease;
        }

        /* Ensure Bootstrap Modals appear above sidebar and header */
        .modal-backdrop {
          z-index: 1050 !important;
        }

        .modal {
          z-index: 1055 !important;
        }


        /* =================================================
           BRAND
        ================================================= */

        .sidebar-brand {
          height: 78px;

          display: flex;
          align-items: center;

          padding: 0 20px;

          border-bottom:
            1px solid
            rgba(255,255,255,0.08);

          flex-shrink: 0;
        }


        .brand-icon {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #ffffff;
          color: #111827;

          font-size: 17px;
          font-weight: 800;

          margin-right: 12px;

          box-shadow:
            0 5px 15px
            rgba(0,0,0,0.15);
        }


        .brand-content {
          min-width: 0;
        }


        .brand-content h5 {
          margin: 0;

          font-size: 16px;
          font-weight: 700;

          color: #ffffff;
        }


        .brand-content span {
          display: block;

          margin-top: 3px;

          color: #94a3b8;

          font-size: 11px;
          font-weight: 500;
        }


        .mobile-close-btn {
          display: none;

          margin-left: auto;

          border: 0;
          background: transparent;

          color: #ffffff;

          font-size: 27px;

          cursor: pointer;
        }


        /* =================================================
           SIDEBAR SCROLL
        ================================================= */

        .sidebar-scroll {
          flex: 1;

          overflow-y: auto;
          overflow-x: hidden;

          padding: 20px 14px;
        }


        .sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }


        .sidebar-scroll::-webkit-scrollbar-thumb {
          background:
            rgba(255,255,255,0.15);

          border-radius: 10px;
        }


        /* =================================================
           MENU SECTION
        ================================================= */

        .menu-section {
          margin-bottom: 28px;
        }


        .menu-section-title {
          padding: 0 12px;

          margin-bottom: 9px;

          color: #64748b;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1px;
        }


        /* =================================================
           SIDEBAR LINK
        ================================================= */

        .sidebar-link {
          position: relative;

          display: flex;
          align-items: center;

          width: 100%;

          min-height: 45px;

          padding: 10px 12px;
          margin-bottom: 5px;

          border-radius: 10px;

          text-decoration: none;

          color: #a8b3c7;

          font-size: 13px;
          font-weight: 500;

          transition:
            all 0.2s ease;
        }


        .sidebar-link:hover {
          color: #ffffff;

          background:
            rgba(255,255,255,0.07);

          transform: translateX(2px);
        }


        .sidebar-link.active {
          color: #111827;

          background: #ffffff;

          font-weight: 700;

          box-shadow:
            0 6px 16px
            rgba(0,0,0,0.15);
        }


        .sidebar-link.active::before {
          content: "";

          position: absolute;

          left: 0;
          top: 8px;
          bottom: 8px;

          width: 3px;

          border-radius: 0 4px 4px 0;

          background: #111827;
        }


        /* =================================================
           ICON
        ================================================= */

        .sidebar-icon {
          width: 34px;
          height: 34px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-right: 9px;

          border-radius: 8px;

          background:
            rgba(255,255,255,0.06);

          color: #cbd5e1;

          font-size: 13px;
          font-weight: 700;

          transition:
            all 0.2s ease;
        }


        .sidebar-link:hover
        .sidebar-icon {
          background:
            rgba(255,255,255,0.12);

          color: #ffffff;
        }


        .sidebar-link.active
        .sidebar-icon {
          background: #f1f5f9;

          color: #111827;
        }


        .sidebar-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        /* =================================================
           SIDEBAR FOOTER & LOGOUT
        ================================================= */

        .sidebar-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;

          padding: 16px 16px;

          border-top:
            1px solid
            rgba(255,255,255,0.08);

          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.15);
        }

        .sidebar-footer-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }


        .footer-avatar {
          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #ffffff;
          color: #111827;

          font-size: 14px;
          font-weight: 800;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .footer-info {
          min-width: 0;
          flex: 1;
        }


        .footer-name {
          color: #f1f5f9;

          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        .footer-role {
          margin-top: 1px;

          color: #94a3b8;

          font-size: 11px;
          font-weight: 500;
        }

        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          width: 100%;
          height: 38px;

          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;

          font-size: 13px;
          font-weight: 600;
          cursor: pointer;

          transition: all 0.2s ease;
        }

        .sidebar-logout-btn:hover {
          background: #dc2626;
          border-color: #dc2626;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
          transform: translateY(-1px);
        }

        .sidebar-logout-icon {
          flex-shrink: 0;
        }


        /* =================================================
           MAIN
        ================================================= */

        .dashboard-main {
          width: calc(100% - 260px);

          margin-left: 260px;

          min-height: 100vh;

          display: flex;
          flex-direction: column;
        }


        /* =================================================
           NAVBAR
        ================================================= */

        .dashboard-navbar {
          height: 78px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 28px;

          background: #ffffff;

          border-bottom:
            1px solid #e5e7eb;

          position: sticky;
          top: 0;

          z-index: 900;
        }


        .navbar-left {
          display: flex;
          align-items: center;

          gap: 14px;
        }


        .sidebar-toggle {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #e2e8f0;

          border-radius: 9px;

          background: #ffffff;

          color: #334155;

          font-size: 18px;

          cursor: pointer;

          transition:
            all 0.2s ease;
        }


        .sidebar-toggle:hover {
          background: #f8fafc;

          border-color: #cbd5e1;

          transform: translateY(-1px);
        }


        .navbar-title h6 {
          margin: 0;

          color: #111827;

          font-size: 15px;
          font-weight: 700;
        }


        .navbar-title span {
          display: block;

          margin-top: 2px;

          color: #94a3b8;

          font-size: 11px;
        }


        /* =================================================
           ADMIN PROFILE & NAVBAR LOGOUT
        ================================================= */

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }


        .admin-profile {
          display: flex;
          align-items: center;

          gap: 10px;
        }


        .admin-avatar {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #111827;

          color: #ffffff;

          font-size: 14px;
          font-weight: 700;
        }


        .admin-name {
          color: #111827;

          font-size: 13px;
          font-weight: 700;
        }


        .admin-role {
          margin-top: 1px;

          color: #94a3b8;

          font-size: 11px;
        }

        .navbar-divider {
          width: 1px;
          height: 32px;
          background: #e2e8f0;
        }

        .navbar-logout-btn {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 8px 15px;
          height: 38px;

          border-radius: 9px;
          border: 1px solid #fee2e2;
          background: #fef2f2;
          color: #dc2626;

          font-size: 13px;
          font-weight: 600;
          cursor: pointer;

          transition: all 0.2s ease;
        }

        .navbar-logout-btn:hover {
          background: #dc2626;
          border-color: #dc2626;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
          transform: translateY(-1px);
        }

        .navbar-logout-icon {
          flex-shrink: 0;
        }


        /* =================================================
           CONTENT
        ================================================= */

        .dashboard-content {
          flex: 1;

          padding: 26px;

          min-width: 0;
        }


        /* =================================================
           MOBILE OVERLAY
        ================================================= */

        .sidebar-overlay {
          display: none;
        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 992px) {

          .dashboard-sidebar {
            width: 240px;
            min-width: 240px;
          }

          .dashboard-main {
            width: calc(100% - 240px);
            margin-left: 240px;
          }

          .dashboard-navbar {
            padding: 0 20px;
          }

          .dashboard-content {
            padding: 20px;
          }

        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 768px) {

          .dashboard-sidebar {
            width: 270px;
            min-width: 270px;
            z-index: 1035;

            transform:
              translateX(-100%);

            box-shadow:
              10px 0 35px
              rgba(0,0,0,0.2);
          }


          .dashboard-sidebar.sidebar-open {
            transform:
              translateX(0);
            z-index: 1035;
          }


          .dashboard-main {
            width: 100%;
            margin-left: 0;
          }


          .dashboard-navbar {
            height: 68px;

            padding: 0 14px;
          }


          .dashboard-content {
            padding: 15px;
          }


          .mobile-close-btn {
            display: block;
          }


          .sidebar-overlay {
            display: block;

            position: fixed;

            inset: 0;

            background:
              rgba(15,23,42,0.45);

            backdrop-filter:
              blur(2px);

            z-index: 1030;
          }


          .admin-info {
            display: none;
          }


          .navbar-title span {
            display: none;
          }


          .navbar-title h6 {
            font-size: 14px;
          }

          .navbar-divider {
            display: none;
          }

          .navbar-logout-btn {
            padding: 7px 10px;
          }

        }


        /* =================================================
           SMALL MOBILE
        ================================================= */

        @media (max-width: 480px) {

          .dashboard-content {
            padding: 12px;
          }


          .sidebar-toggle {
            width: 37px;
            height: 37px;
          }


          .admin-avatar {
            width: 36px;
            height: 36px;
          }

          .navbar-logout-text {
            display: none;
          }

          .navbar-logout-btn {
            padding: 8px;
            width: 36px;
            height: 36px;
            justify-content: center;
          }

        }

      `}</style>

    </div>
  );
};

export default DashboardLayout;