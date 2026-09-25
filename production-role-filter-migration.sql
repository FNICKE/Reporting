-- =========================================================================
-- COMPLETE PRODUCTION SQL MIGRATION SCRIPT
-- Run this in phpMyAdmin on your production database (sainikshetkari_reporting)
-- =========================================================================

-- 1. ADD user_id AND created_by_role TO taluka_reports
ALTER TABLE `taluka_reports` ADD COLUMN IF NOT EXISTS `user_id` VARCHAR(100) NULL AFTER `id`;
ALTER TABLE `taluka_reports` ADD COLUMN IF NOT EXISTS `created_by_role` VARCHAR(50) NULL AFTER `user_id`;

-- 2. ADD user_id AND created_by_role TO vibhag_reports
ALTER TABLE `vibhag_reports` ADD COLUMN IF NOT EXISTS `user_id` VARCHAR(100) NULL AFTER `id`;
ALTER TABLE `vibhag_reports` ADD COLUMN IF NOT EXISTS `created_by_role` VARCHAR(50) NULL AFTER `user_id`;

-- 3. ADD user_id AND created_by_role TO trainer_reports
ALTER TABLE `trainer_reports` ADD COLUMN IF NOT EXISTS `user_id` VARCHAR(100) NULL AFTER `id`;
ALTER TABLE `trainer_reports` ADD COLUMN IF NOT EXISTS `created_by_role` VARCHAR(50) NULL AFTER `user_id`;

-- 4. FIX NULLABILITY & DEFAULTS ON MASTER TABLES (Prevents "Column cannot be null" / "Field doesn't have default value")
ALTER TABLE `talukas` MODIFY COLUMN `district_id` INT(11) NULL;
ALTER TABLE `talukas` MODIFY COLUMN `contact_number` VARCHAR(20) NULL DEFAULT '';
ALTER TABLE `districts` MODIFY COLUMN `contact_number` VARCHAR(20) NULL DEFAULT '';
ALTER TABLE `districts` MODIFY COLUMN `password` VARCHAR(255) NULL DEFAULT '123456';
ALTER TABLE `vibhags` MODIFY COLUMN `contact_number` VARCHAR(20) NULL DEFAULT '';
ALTER TABLE `trainers` MODIFY COLUMN `contact_number` VARCHAR(20) NULL DEFAULT '';

-- 5. BACKFILL EXISTING REPORTS WITH user_id FROM MASTER TABLES
-- (Links legacy reports created before this update to their owners)
UPDATE `taluka_reports` tr
JOIN `talukas` t ON (tr.mobile_number = t.contact_number OR tr.name = t.name)
SET tr.user_id = t.user_id
WHERE tr.user_id IS NULL;

UPDATE `vibhag_reports` vr
JOIN `vibhags` v ON (vr.mobile_number = v.contact_number OR vr.name = v.head)
SET vr.user_id = v.user_id
WHERE vr.user_id IS NULL;

UPDATE `trainer_reports` tr
JOIN `trainers` t ON (tr.mobile_number = t.contact_number OR tr.name = t.trainer_name)
SET tr.user_id = t.user_id
WHERE tr.user_id IS NULL;

-- =========================================================================
-- DONE!
-- =========================================================================
