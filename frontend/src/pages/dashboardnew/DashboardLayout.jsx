import React, { useState } from "react";
import {
  NavLink,
  Outlet,
} from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
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
                District
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
                Taluka
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
                Vibhag
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
            SIDEBAR FOOTER
        ================================================= */}

        <div className="sidebar-footer">

          <div className="footer-avatar">
            A
          </div>

          <div>
            <div className="footer-name">
              Administrator
            </div>

            <div className="footer-role">
              Admin Management
            </div>
          </div>

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
              RIGHT SIDE
          ================================================= */}

          <div className="navbar-right">

            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div className="admin-info">

                <div className="admin-name">
                  Admin
                </div>

                <div className="admin-role">
                  Administrator
                </div>

              </div>

            </div>

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

          z-index: 1100;

          box-shadow:
            4px 0 20px
            rgba(0, 0, 0, 0.08);

          transition:
            transform 0.3s ease;
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
           SIDEBAR FOOTER
        ================================================= */

        .sidebar-footer {
          display: flex;
          align-items: center;

          gap: 10px;

          padding: 15px 17px;

          border-top:
            1px solid
            rgba(255,255,255,0.08);

          flex-shrink: 0;
        }


        .footer-avatar {
          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #ffffff;
          color: #111827;

          font-size: 13px;
          font-weight: 800;
        }


        .footer-name {
          color: #e2e8f0;

          font-size: 12px;
          font-weight: 700;
        }


        .footer-role {
          margin-top: 2px;

          color: #64748b;

          font-size: 10px;
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
           ADMIN PROFILE
        ================================================= */

        .navbar-right {
          display: flex;
          align-items: center;
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

          font-size: 12px;
          font-weight: 700;
        }


        .admin-role {
          margin-top: 2px;

          color: #94a3b8;

          font-size: 10px;
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

            transform:
              translateX(-100%);

            box-shadow:
              10px 0 35px
              rgba(0,0,0,0.2);
          }


          .dashboard-sidebar.sidebar-open {
            transform:
              translateX(0);
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

            z-index: 1050;
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

        }

      `}</style>

    </div>
  );
};

export default DashboardLayout;