-- =========================================================================
-- COMPLETE MIGRATION SCRIPT FOR INDEPENDENT DISTRICT & TALUKA MANAGEMENT
-- Run this SQL on your MySQL database (e.g., in phpMyAdmin on reporting.sainikshetkari.org)
-- =========================================================================

-- 1. DROP FOREIGN KEY CONSTRAINTS (prevents "foreign key constraint fails" errors)
ALTER TABLE `vibhags` DROP FOREIGN KEY `fk_vibhag_district`;
ALTER TABLE `vibhags` DROP FOREIGN KEY `fk_vibhag_taluka`;

ALTER TABLE `trainers` DROP FOREIGN KEY `fk_trainer_district`;
ALTER TABLE `trainers` DROP FOREIGN KEY `fk_trainer_taluka`;
ALTER TABLE `trainers` DROP FOREIGN KEY `fk_trainer_vibhag`;

ALTER TABLE `talukas` DROP FOREIGN KEY `fk_taluka_district`;

-- 2. MAKE FOREIGN KEY COLUMNS NULLABLE
ALTER TABLE `talukas` MODIFY COLUMN `district_id` INT(11) NULL;
ALTER TABLE `vibhags` MODIFY COLUMN `district_id` INT(11) NULL, MODIFY COLUMN `taluka_id` INT(11) NULL;
ALTER TABLE `trainers` MODIFY COLUMN `district_id` INT(11) NULL, MODIFY COLUMN `taluka_id` INT(11) NULL, MODIFY COLUMN `vibhag_id` INT(11) NULL;

-- 3. ADD DISTRICT_NAME AND TALUKA_NAME TO VIBHAGS
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `district_name` VARCHAR(255) NULL AFTER `taluka_id`;
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `taluka_name` VARCHAR(255) NULL AFTER `district_name`;

-- 4. ADD DISTRICT_NAME AND TALUKA_NAME TO TRAINERS (BDO)
ALTER TABLE `trainers` ADD COLUMN IF NOT EXISTS `district_name` VARCHAR(255) NULL AFTER `taluka_id`;
ALTER TABLE `trainers` ADD COLUMN IF NOT EXISTS `taluka_name` VARCHAR(255) NULL AFTER `district_name`;

-- 5. ADD DISTRICT_NAME TO TALUKAS
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `district_name` VARCHAR(255) NULL AFTER `bank_name`;

-- 6. BACKFILL EXISTING NAMES FROM RELATIONAL TABLES
UPDATE `vibhags` v
LEFT JOIN `districts` d ON d.id = v.district_id
LEFT JOIN `talukas` t ON t.id = v.taluka_id
SET 
  v.district_name = COALESCE(NULLIF(v.district_name, ''), d.district_name, d.name),
  v.taluka_name = COALESCE(NULLIF(v.taluka_name, ''), t.taluka_name, t.name);

UPDATE `trainers` tr
LEFT JOIN `districts` d ON d.id = tr.district_id
LEFT JOIN `talukas` t ON t.id = tr.taluka_id
SET 
  tr.district_name = COALESCE(NULLIF(tr.district_name, ''), d.district_name, d.name),
  tr.taluka_name = COALESCE(NULLIF(tr.taluka_name, ''), t.taluka_name, t.name);

UPDATE `talukas` t
LEFT JOIN `districts` d ON d.id = t.district_id
SET 
  t.district_name = COALESCE(NULLIF(t.district_name, ''), d.district_name, d.name);

-- 7. FIX DISTRICTS WITH BLANK user_id (prevents "Duplicate entry '' for key 'user_id'" on new inserts)
UPDATE `districts`
SET 
  user_id = CONCAT('dist_', LOWER(REPLACE(COALESCE(NULLIF(district_name,''), name, 'unknown'), ' ', '_')), '_', id),
  district_code = CONCAT('DH-', LPAD(id, 4, '0'))
WHERE (user_id = '' OR user_id IS NULL)
  AND NOT EXISTS (
    SELECT 1 FROM (
      SELECT CONCAT('dist_', LOWER(REPLACE(COALESCE(NULLIF(district_name,''), name, 'unknown'), ' ', '_')), '_', id) AS new_uid
      FROM `districts` d2 WHERE d2.id = `districts`.id
    ) tmp
    WHERE tmp.new_uid IN (SELECT user_id FROM `districts` WHERE user_id != '' AND user_id IS NOT NULL)
  );

-- 8. ADD vibhag_code to vibhags IF NOT EXISTS
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `vibhag_code` VARCHAR(50) NULL AFTER `id`;

-- 9. ADD taluka_code to talukas IF NOT EXISTS
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `taluka_code` VARCHAR(50) NULL AFTER `id`;

-- 10. ADD designation, joining_date, account_number, ifsc_code, bank_name to talukas IF NOT EXISTS
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `designation` VARCHAR(150) NULL AFTER `taluka_code`;
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `joining_date` DATE NULL;
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `account_number` VARCHAR(100) NULL;
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `ifsc_code` VARCHAR(50) NULL;
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `bank_name` VARCHAR(150) NULL;
ALTER TABLE `talukas` ADD COLUMN IF NOT EXISTS `taluka_name` VARCHAR(255) NULL;

-- 11. ADD designation, joining_date, account_number, ifsc_code, bank_name to vibhags IF NOT EXISTS
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `designation` VARCHAR(150) NULL;
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `joining_date` DATE NULL;
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `account_number` VARCHAR(100) NULL;
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `ifsc_code` VARCHAR(50) NULL;
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `bank_name` VARCHAR(150) NULL;
ALTER TABLE `vibhags` ADD COLUMN IF NOT EXISTS `address` TEXT NULL;

-- END OF MIGRATION

