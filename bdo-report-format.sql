-- BDO report format migration.
-- Run once against an existing database before deploying the updated BDO form.
ALTER TABLE trainer_reports
    ADD COLUMN total_shops_visited_today INT NOT NULL DEFAULT 0 AFTER report_date,
    ADD COLUMN total_panel_registration_amount DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER total_shops_visited_today,
    ADD COLUMN payment_mode ENUM('Cash','UPI','Online','Bank Transfer') DEFAULT NULL AFTER total_panel_registration_amount,
    ADD COLUMN shop_photo VARCHAR(500) DEFAULT NULL AFTER payment_mode,
    ADD COLUMN shopkeeper_registration_photo VARCHAR(500) DEFAULT NULL AFTER shop_photo,
    ADD COLUMN work_photo_video VARCHAR(500) DEFAULT NULL AFTER shopkeeper_registration_photo;
