CREATE DATABASE IF NOT EXISTS dashboard_system;

USE dashboard_system;

-- =========================================
-- ROLES
-- =========================================

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- USERS
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    role_id INT NOT NULL,

    name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    mobile VARCHAR(20),

    password VARCHAR(255) NOT NULL,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================================
-- DISTRICTS
-- =========================================

CREATE TABLE IF NOT EXISTS districts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- TALUKAS
-- =========================================

CREATE TABLE IF NOT EXISTS talukas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    district_id INT NOT NULL,

    name VARCHAR(150) NOT NULL,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_taluka_district
        FOREIGN KEY (district_id)
        REFERENCES districts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY unique_taluka_district (district_id, name)
);

-- =========================================
-- VIBHAGS
-- =========================================

CREATE TABLE IF NOT EXISTS vibhags (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL UNIQUE,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- TRAINERS
-- =========================================

CREATE TABLE IF NOT EXISTS trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NULL,

    name VARCHAR(150) NOT NULL,

    mobile VARCHAR(20),

    email VARCHAR(150),

    district_id INT NULL,

    taluka_id INT NULL,

    vibhag_id INT NULL,

    designation VARCHAR(150),

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_trainer_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_trainer_district
        FOREIGN KEY (district_id)
        REFERENCES districts(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_trainer_taluka
        FOREIGN KEY (taluka_id)
        REFERENCES talukas(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_trainer_vibhag
        FOREIGN KEY (vibhag_id)
        REFERENCES vibhags(id)
        ON DELETE SET NULL
);

-- =========================================
-- REPORTS
-- =========================================

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    trainer_id INT NULL,

    district_id INT NULL,

    taluka_id INT NULL,

    vibhag_id INT NULL,

    report_date DATE,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_by INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_report_trainer
        FOREIGN KEY (trainer_id)
        REFERENCES trainers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_report_district
        FOREIGN KEY (district_id)
        REFERENCES districts(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_report_taluka
        FOREIGN KEY (taluka_id)
        REFERENCES talukas(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_report_vibhag
        FOREIGN KEY (vibhag_id)
        REFERENCES vibhags(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_report_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);