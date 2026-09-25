-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 23, 2026 at 10:01 AM
-- Server version: 10.6.28-MariaDB
-- PHP Version: 8.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sainikshetkari_reporting`
--

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `report_date` date NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `contact_number` varchar(20) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `district_name` varchar(150) DEFAULT NULL,
  `district_code` varchar(100) DEFAULT NULL,
  `taluka` varchar(150) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `account_number` varchar(64) DEFAULT NULL,
  `ifsc_code` varchar(32) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `user_id` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `report_date`, `status`, `contact_number`, `designation`, `district_name`, `district_code`, `taluka`, `joining_date`, `account_number`, `ifsc_code`, `bank_name`, `user_id`, `email`, `password`, `created_at`, `updated_at`) VALUES
(15, 'dcds', '2026-08-20', 'active', '9324278202', 'cccsd', 'cscdcsc', 'sdsc', 'cdscdsc', '2026-08-22', 'csc', 'CDSC', 'sdcsd', 'cscs', 'cscsd@gmail.com', 'cscs', '2026-08-20 20:11:45', '2026-08-21 05:10:12'),
(16, 'ashish kharatDistrict', '2026-08-22', 'active', '9324278202', 'District', 'District', 'District', 'District', '2026-08-23', 'District32', '32SCDS', 'scscs', 'ashish kharatDistrict', 'kharatashish986323@gmail.com', 'ashish kharatDistrict', '2026-08-22 12:59:41', '2026-08-22 12:59:41');

-- --------------------------------------------------------

--
-- Table structure for table `district_reports`
--

CREATE TABLE `district_reports` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `taluka` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `report_date` date NOT NULL,
  `total_authorised_center_heads_300_to_500` int(11) DEFAULT 0,
  `total_center_heads` int(11) DEFAULT 0,
  `total_active_center_heads` int(11) DEFAULT 0,
  `machine1_camp_name` varchar(255) DEFAULT NULL,
  `machine1_test_amount` decimal(12,2) DEFAULT 0.00,
  `machine1_medicine_amount` decimal(12,2) DEFAULT 0.00,
  `machine1_total_amount` decimal(12,2) DEFAULT 0.00,
  `machine2_camp_name` varchar(255) DEFAULT NULL,
  `machine2_test_amount` decimal(12,2) DEFAULT 0.00,
  `machine2_medicine_amount` decimal(12,2) DEFAULT 0.00,
  `machine2_total_amount` decimal(12,2) DEFAULT 0.00,
  `utr_number` varchar(255) DEFAULT NULL,
  `additional_remarks` text DEFAULT NULL,
  `machine1_camp_photo` varchar(500) DEFAULT NULL,
  `machine2_camp_photo` varchar(500) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `district_reports`
--

INSERT INTO `district_reports` (`id`, `user_id`, `name`, `designation`, `taluka`, `district`, `mobile_number`, `report_date`, `total_authorised_center_heads_300_to_500`, `total_center_heads`, `total_active_center_heads`, `machine1_camp_name`, `machine1_test_amount`, `machine1_medicine_amount`, `machine1_total_amount`, `machine2_camp_name`, `machine2_test_amount`, `machine2_medicine_amount`, `machine2_total_amount`, `utr_number`, `additional_remarks`, `machine1_camp_photo`, `machine2_camp_photo`, `status`, `created_at`, `updated_at`) VALUES
(9, 'kharatashish9862@gmail.com', 'sas', 'sas', 'sas', 'sas', '9324278202', '2026-08-20', 0, 0, 323, '323', 323.00, 323.00, 323.00, '323', 3233.00, 233.00, 323.00, '32323', '323', 'district-1787219176235-346547214.png', 'district-1787219176237-8179990.png', 'active', '2026-08-20 09:46:16', '2026-08-20 09:46:16'),
(10, 'ashish kharatDistrict234', 'dsd', 'ddsd', 'dsd', 'dsd', '9324278202', '2026-08-20', 0, 0, 3330, '323', 3233.00, 32.00, 323.00, '323', 323.00, 3233.00, 33232.00, '323', '323', 'district-1787223941749-798730020.png', 'district-1787223941757-210967583.png', 'active', '2026-08-20 11:05:41', '2026-08-20 11:05:41'),
(11, 'cscs', 'sdsd', 'dsdds', 'dsd', 'sds', '9324278202', '2026-08-21', 0, 0, 3228, '323', 323.00, 323.00, 323.00, '323', 323.00, 232.00, 323.00, '232', 'dsd', 'district-1787289226779-39690580.jpg', 'district-1787289226786-928714469.png', 'active', '2026-08-21 05:13:46', '2026-08-21 05:13:46');

-- --------------------------------------------------------

--
-- Table structure for table `talukas`
--

CREATE TABLE `talukas` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `district_id` int(11) DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `talukas`
--

INSERT INTO `talukas` (`id`, `name`, `district_id`, `contact_number`, `user_id`, `email`, `password`, `address`, `status`, `created_at`, `updated_at`) VALUES
(40, 'TalukaName32', 16, '9324278202', 'TalukaName32', 'TalukaName3232@gmail.com', 'TalukaName32', 'TalukaName32', 'active', '2026-08-21 05:08:10', '2026-08-22 13:18:48');

-- --------------------------------------------------------

--
-- Table structure for table `taluka_reports`
--

CREATE TABLE `taluka_reports` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `taluka` varchar(150) DEFAULT NULL,
  `district` varchar(150) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `report_date` date NOT NULL,
  `total_authorised_center_heads` int(11) DEFAULT 0,
  `total_active_center_heads` int(11) DEFAULT 0,
  `visited_center_heads_names` text DEFAULT NULL,
  `sanitary_pads_boxes_sold` int(11) DEFAULT 0,
  `sanitary_pads_sales_amount` decimal(12,2) DEFAULT 0.00,
  `utr_number` varchar(100) DEFAULT NULL,
  `additional_remarks` text DEFAULT NULL,
  `meeting_photo_1` varchar(255) DEFAULT NULL,
  `meeting_photo_2` varchar(255) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taluka_reports`
--

INSERT INTO `taluka_reports` (`id`, `name`, `designation`, `taluka`, `district`, `mobile_number`, `report_date`, `total_authorised_center_heads`, `total_active_center_heads`, `visited_center_heads_names`, `sanitary_pads_boxes_sold`, `sanitary_pads_sales_amount`, `utr_number`, `additional_remarks`, `meeting_photo_1`, `meeting_photo_2`, `status`, `created_at`, `updated_at`) VALUES
(3, 'Ashish Kharat', 'Taluka Head', 'Panvel', 'Raigad', '9276543210', '2026-08-13', 10, 0, 'Rahul Patil, Amit Jadhav, Suresh More', 25, 12500.00, 'UTR123456789', 'Today\'s taluka meeting completed successfully', 'taluka-1786601078414-24875392.png', 'taluka-1786601078448-993874322.png', 'active', '2026-08-13 06:00:51', '2026-08-13 06:04:38');

-- --------------------------------------------------------

--
-- Table structure for table `trainers`
--

CREATE TABLE `trainers` (
  `id` int(11) NOT NULL,
  `trainer_name` varchar(100) NOT NULL,
  `trainer_code` varchar(100) NOT NULL,
  `district_id` int(11) DEFAULT NULL,
  `taluka_id` int(11) DEFAULT NULL,
  `vibhag_id` int(11) DEFAULT NULL,
  `contact_number` varchar(15) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainers`
--

INSERT INTO `trainers` (`id`, `trainer_name`, `trainer_code`, `district_id`, `taluka_id`, `vibhag_id`, `contact_number`, `user_id`, `email`, `password`, `address`, `status`, `created_at`, `updated_at`) VALUES
(8, 'BDOName32', '01', 15, 40, 11, '9324278202', 'BDOName32', 'BDOName32@gmail.com', 'BDOName32', NULL, 'active', '2026-08-21 05:09:18', '2026-08-21 05:09:18');

-- --------------------------------------------------------

--
-- Table structure for table `trainer_reports`
--

CREATE TABLE `trainer_reports` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `taluka` varchar(150) DEFAULT NULL,
  `district` varchar(150) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `report_date` date NOT NULL,
  `total_shops_visited_today` int(11) NOT NULL DEFAULT 0,
  `total_panel_registration_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_mode` enum('Cash','UPI','Online','Bank Transfer') DEFAULT NULL,
  `shop_photo` varchar(500) DEFAULT NULL,
  `shopkeeper_registration_photo` varchar(500) DEFAULT NULL,
  `work_photo_video` varchar(500) DEFAULT NULL,
  `total_authorised_center_heads` int(11) DEFAULT 0,
  `total_active_center_heads` int(11) DEFAULT 0,
  `today_visited_center_heads_names` text DEFAULT NULL,
  `total_center_heads_visited_today` int(11) DEFAULT 0,
  `todays_new_members` int(11) DEFAULT 0,
  `additional_remarks` text DEFAULT NULL,
  `meeting_photo_1` varchar(500) DEFAULT NULL,
  `meeting_photo_2` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainer_reports`
--

INSERT INTO `trainer_reports` (`id`, `name`, `designation`, `taluka`, `district`, `mobile_number`, `report_date`, `total_authorised_center_heads`, `total_active_center_heads`, `today_visited_center_heads_names`, `total_center_heads_visited_today`, `todays_new_members`, `additional_remarks`, `meeting_photo_1`, `meeting_photo_2`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Rahul Patil', 'Trainer', 'Panvel', 'Mumbai', '1524278202', '2026-08-11', 12, 8, 'Amit Shinde, Sagar More', 7, 8, 'Trainer meeting completed successfully', 'trainer-reports/trainer-1786600397627-318678128.png', NULL, 'active', '2026-08-12 10:23:03', '2026-08-13 05:53:17'),
(2, 'Trainernew', 'Trainernew', 'Trainernew', 'Trainernew', '9324278202', '2026-08-12', 11, 7, 'sass', 7, 8, 'sas', 'trainer-reports/trainer-1786531768614-283260323.png', 'trainer-reports/trainer-1786531768703-671471184.png', 'active', '2026-08-12 10:49:28', '2026-08-12 10:49:28'),
(3, 'Ashish kharat', 'Trainer', 'Panvel', 'Raigad', '9876543210', '2026-08-13', 10, 8, 'Amit, Suresh, Mahesh', 5, 3, 'Today\'s training completed successfully', NULL, NULL, 'active', '2026-08-13 05:54:42', '2026-08-13 05:54:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `role` varchar(50) NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_id`, `password`, `name`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', '12345678', 'Admin', 'admin', 'active', '2026-08-12 06:45:36', '2026-08-12 06:45:36'),
(2, 'ashishD', '12345678', 'ashishD', 'district', 'active', '2026-08-12 07:12:15', '2026-08-12 07:12:15'),
(3, 'Taluka Head', '123456', 'sangli', 'taluka', 'active', '2026-08-12 07:33:24', '2026-08-12 07:33:24'),
(4, 'VibhagHeadnew', '123456', 'VibhagHead', 'vibhag', 'active', '2026-08-12 07:49:49', '2026-08-12 07:49:49'),
(5, 'Trainer', '123456', 'Trainer', 'trainer', 'active', '2026-08-12 07:55:23', '2026-08-12 07:55:23'),
(6, 'TalukaHeadAshish', '123456', 'TalukaHeadAshish', 'taluka', 'active', '2026-08-17 06:43:10', '2026-08-17 06:43:10'),
(7, 'kharatTalukanew', '123456', 'kharatTalukanew', 'taluka', 'active', '2026-08-18 08:03:35', '2026-08-18 08:03:35'),
(8, 'Vibhag Head new', '123456', 'Vibhag Head new', 'vibhag', 'active', '2026-08-18 09:44:37', '2026-08-18 09:44:37'),
(9, 'ashish kharat Taluka new', '123456', 'ashish kharat Taluka new', 'taluka', 'active', '2026-08-19 09:20:34', '2026-08-19 09:20:34'),
(10, 'sswftalukahead12', '1234567', 'udhdbe', 'taluka', 'active', '2026-08-19 09:35:34', '2026-08-19 09:35:34'),
(11, 'VibhagHead212', '123456', 'VibhagHead212', 'vibhag', 'active', '2026-08-19 17:28:23', '2026-08-19 17:28:23'),
(12, 'Vibhagashish', '12345678', 'Vibhagashish', 'vibhag', 'active', '2026-08-20 04:54:07', '2026-08-20 04:54:07'),
(13, 'Talukanew32', 'Talukanew32', 'Talukanew32', 'taluka', 'active', '2026-08-20 05:02:05', '2026-08-20 05:02:05'),
(14, 'ashish kharatDistrict234', '12345678', 'ashish kharatDistrict234', 'district', 'active', '2026-08-20 05:12:00', '2026-08-20 05:12:00'),
(15, 'sswfdistricthead', '1234567', 'mudhita', 'district', 'active', '2026-08-20 05:12:37', '2026-08-20 05:12:37'),
(16, 'Vibhag Headnew23', '123456', 'Vibhag Headnew23', 'vibhag', 'active', '2026-08-20 08:53:49', '2026-08-20 08:53:49'),
(17, 'Vibhag Trainer213', 'Vibhag Trainer213', 'Vibhag Trainer213', 'trainer', 'active', '2026-08-20 08:54:51', '2026-08-20 08:54:51'),
(18, 'Vibhag Headnew2321', 'Vibhag Headnew2321', 'Vibhag Headnew2321', 'vibhag', 'active', '2026-08-20 08:56:21', '2026-08-20 08:56:21'),
(19, 'TalukaAshishk21', 'TalukaAshishk21', 'TalukaAshishk21', 'taluka', 'active', '2026-08-20 09:09:16', '2026-08-20 09:09:16'),
(20, 'kharatashish9862@gmail.com', '123456', 'ashish kharatDistrict22', 'district', 'active', '2026-08-20 09:44:37', '2026-08-20 09:44:37'),
(21, 'Vibhag Headnew233232', '12345678', 'Vibhag Headnew233232', 'vibhag', 'active', '2026-08-20 09:53:44', '2026-08-20 09:53:44'),
(22, 'sswfomkar', '123456', 'omkar', 'district', 'active', '2026-08-20 10:23:36', '2026-08-20 10:23:36'),
(23, 'Vibhag Name32', 'Vibhag Name32', 'Vibhag Name32', 'vibhag', 'active', '2026-08-21 05:08:51', '2026-08-21 05:08:51'),
(24, 'cscs', 'cscs', 'dcds', 'district', 'active', '2026-08-21 05:11:07', '2026-08-21 05:11:07');

-- --------------------------------------------------------

--
-- Table structure for table `vibhags`
--

CREATE TABLE `vibhags` (
  `id` int(11) NOT NULL,
  `head` varchar(100) NOT NULL,
  `district_id` int(11) DEFAULT NULL,
  `taluka_id` int(11) DEFAULT NULL,
  `contact_number` varchar(15) NOT NULL,
  `user_id` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `vibhag` varchar(100) NOT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vibhags`
--

INSERT INTO `vibhags` (`id`, `head`, `district_id`, `taluka_id`, `contact_number`, `user_id`, `email`, `password`, `vibhag`, `address`, `status`, `created_at`, `updated_at`) VALUES
(11, 'Vibhag Name32', 15, 40, '9324278202', 'Vibhag Name32', 'VibhagName32@gmail.com', 'Vibhag Name32', 'Vibhag Name32', 'kamothe,panvel', 'active', '2026-08-21 05:08:51', '2026-08-21 05:08:51');

-- --------------------------------------------------------

--
-- Table structure for table `vibhag_reports`
--

CREATE TABLE `vibhag_reports` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `taluka` varchar(150) DEFAULT NULL,
  `district` varchar(150) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `report_date` date NOT NULL,
  `total_authorised_center_heads` int(11) DEFAULT 0,
  `total_active_center_heads` int(11) DEFAULT 0,
  `today_visited_centers` int(11) DEFAULT 0,
  `visited_center_head_name` text DEFAULT NULL,
  `new_members_added_today` int(11) DEFAULT 0,
  `sanitary_pad_box_sales` int(11) DEFAULT 0,
  `health_atm_machine_details` text DEFAULT NULL,
  `birth_baby_girls` int(11) DEFAULT 0,
  `death_count` int(11) DEFAULT 0,
  `accident_count` int(11) DEFAULT 0,
  `utr_number` varchar(100) DEFAULT NULL,
  `any_other_information` text DEFAULT NULL,
  `meeting_photo_1` varchar(255) DEFAULT NULL,
  `meeting_photo_2` varchar(255) DEFAULT NULL,
  `status` varchar(30) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vibhag_reports`
--

INSERT INTO `vibhag_reports` (`id`, `name`, `designation`, `taluka`, `district`, `mobile_number`, `report_date`, `total_authorised_center_heads`, `total_active_center_heads`, `today_visited_centers`, `visited_center_head_name`, `new_members_added_today`, `sanitary_pad_box_sales`, `health_atm_machine_details`, `birth_baby_girls`, `death_count`, `accident_count`, `utr_number`, `any_other_information`, `meeting_photo_1`, `meeting_photo_2`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Rahul Patil', 'Vibhag Head', 'Panvel', 'Mumbai', '9324278202', '2026-08-12', 10, 8, 7, 'Amit Shinde, Sagar More', 8, 12, '2 Health ATM Machines', 0, 1, 2, 'UTR123456789', 'Vibhag meeting completed successfully', NULL, NULL, 'active', '2026-08-12 09:55:50', '2026-08-12 09:55:50'),
(2, 'sas', 'Vibhag sas', 'saas', 'sas', '9224278202', '2026-08-11', 323, 3232, 323, '323', 3223, 323, '2323', 332, 322, 3232, '323', '3232', 'vibhag-1786598354932-936504652.png', 'vibhag-1786598506898-44502381.png', 'active', '2026-08-12 14:26:03', '2026-08-13 05:24:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `district_reports`
--
ALTER TABLE `district_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `talukas`
--
ALTER TABLE `talukas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_taluka_district` (`district_id`);

--
-- Indexes for table `taluka_reports`
--
ALTER TABLE `taluka_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trainers`
--
ALTER TABLE `trainers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_trainer_code` (`trainer_code`),
  ADD KEY `fk_trainer_district` (`district_id`),
  ADD KEY `fk_trainer_taluka` (`taluka_id`),
  ADD KEY `fk_trainer_vibhag` (`vibhag_id`);

--
-- Indexes for table `trainer_reports`
--
ALTER TABLE `trainer_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `vibhags`
--
ALTER TABLE `vibhags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_vibhag_district` (`district_id`),
  ADD KEY `fk_vibhag_taluka` (`taluka_id`);

--
-- Indexes for table `vibhag_reports`
--
ALTER TABLE `vibhag_reports`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `district_reports`
--
ALTER TABLE `district_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `talukas`
--
ALTER TABLE `talukas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `taluka_reports`
--
ALTER TABLE `taluka_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trainers`
--
ALTER TABLE `trainers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `trainer_reports`
--
ALTER TABLE `trainer_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `vibhags`
--
ALTER TABLE `vibhags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `vibhag_reports`
--
ALTER TABLE `vibhag_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Foreign key constraints removed for independent master management
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
