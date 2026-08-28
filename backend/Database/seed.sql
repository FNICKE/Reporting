USE dashboard_system;

-- =========================================
-- ROLES
-- =========================================

INSERT INTO roles (name)
VALUES
('admin'),
('district'),
('taluka'),
('vibhag'),
('trainer')
ON DUPLICATE KEY UPDATE name = VALUES(name);


-- =========================================
-- MAHARASHTRA DISTRICTS
-- =========================================

INSERT INTO districts (name)
VALUES
('Ahmednagar'),
('Akola'),
('Amravati'),
('Aurangabad'),
('Beed'),
('Bhandara'),
('Buldhana'),
('Chandrapur'),
('Dhule'),
('Gadchiroli'),
('Gondia'),
('Hingoli'),
('Jalgaon'),
('Jalna'),
('Kolhapur'),
('Latur'),
('Mumbai'),
('Mumbai Suburban'),
('Nagpur'),
('Nanded'),
('Nandurbar'),
('Nashik'),
('Osmanabad'),
('Palghar'),
('Parbhani'),
('Pune'),
('Raigad'),
('Ratnagiri'),
('Sangli'),
('Satara'),
('Sindhudurg'),
('Solapur'),
('Thane'),
('Wardha'),
('Washim'),
('Yavatmal')
ON DUPLICATE KEY UPDATE name = VALUES(name);