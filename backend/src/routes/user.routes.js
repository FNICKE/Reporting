const express = require("express");
const router = express.Router();

const { pool } = require("../config/db");

// =====================================================
// GET ALL USERS
// GET /api/users
// =====================================================
router.get("/", async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT
        id,
        user_id,
        password,
        name,
        role,
        status,
        created_at,
        updated_at
      FROM users
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      data: users,
      total: users.length,
    });

  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});


// =====================================================
// LOGIN
// POST /api/users/login
// =====================================================
router.post("/login", async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Validation
    if (!user_id || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and Password are required",
      });
    }

    // Find user
    const [users] = await pool.query(
      `
      SELECT
        id,
        user_id,
        password,
        name,
        role,
        status
      FROM users
      WHERE user_id = ?
      LIMIT 1
      `,
      [user_id]
    );

    // User not found
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid User ID or Password",
      });
    }

    const user = users[0];

    // Check status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "User account is inactive",
      });
    }

    // Normal password comparison
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid User ID or Password",
      });
    }

    // Login success
    res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});


module.exports = router;