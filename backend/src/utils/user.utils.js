const { pool } = require("../config/db");

const createSystemUser = async ({
    user_id,
    password,
    name,
    role,
    status = "active",
}) => {
    if (!user_id || !password || !role) {
        throw new Error(
            "user_id, password and role are required"
        );
    }

    const [existing] = await pool.query(
        `
        SELECT id
        FROM users
        WHERE user_id = ?
        LIMIT 1
        `,
        [user_id]
    );

    if (existing.length > 0) {
        throw new Error("User ID already exists");
    }

    const [result] = await pool.query(
        `
        INSERT INTO users
        (
            user_id,
            password,
            name,
            role,
            status
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            user_id,
            password,
            name || user_id,
            role,
            status,
        ]
    );

    return result.insertId;
};

module.exports = {
    createSystemUser,
};