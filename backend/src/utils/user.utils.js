const db = require("../config/db");

/**
 * Upsert / sync user credentials into the `users` table
 * so the user can log into the system with their role.
 */
const syncSystemUser = async ({
    user_id,
    password,
    name,
    role,
    status = "active",
    old_user_id = null,
}) => {
    if (!user_id) return null;

    const cleanUserId = String(user_id).trim();
    const cleanPassword = password !== undefined && password !== null ? String(password).trim() : "";
    const cleanName = name ? String(name).trim() : cleanUserId;
    const cleanRole = String(role || "user").trim();
    const cleanStatus = String(status || "active").toLowerCase() === "inactive" ? "inactive" : "active";

    try {
        // If old_user_id was provided and differs, update the user_id
        if (old_user_id && String(old_user_id).trim() !== cleanUserId) {
            const cleanOldId = String(old_user_id).trim();
            const [existing] = await db.query(
                "SELECT id FROM users WHERE user_id = ? LIMIT 1",
                [cleanOldId]
            );
            if (existing.length > 0) {
                if (cleanPassword) {
                    await db.query(
                        "UPDATE users SET user_id = ?, password = ?, name = ?, role = ?, status = ? WHERE user_id = ?",
                        [cleanUserId, cleanPassword, cleanName, cleanRole, cleanStatus, cleanOldId]
                    );
                } else {
                    await db.query(
                        "UPDATE users SET user_id = ?, name = ?, role = ?, status = ? WHERE user_id = ?",
                        [cleanUserId, cleanName, cleanRole, cleanStatus, cleanOldId]
                    );
                }
                return;
            }
        }

        // Upsert by user_id
        const [existing] = await db.query(
            "SELECT id FROM users WHERE user_id = ? LIMIT 1",
            [cleanUserId]
        );

        if (existing.length > 0) {
            if (cleanPassword) {
                await db.query(
                    "UPDATE users SET password = ?, name = ?, role = ?, status = ? WHERE user_id = ?",
                    [cleanPassword, cleanName, cleanRole, cleanStatus, cleanUserId]
                );
            } else {
                await db.query(
                    "UPDATE users SET name = ?, role = ?, status = ? WHERE user_id = ?",
                    [cleanName, cleanRole, cleanStatus, cleanUserId]
                );
            }
        } else {
            await db.query(
                `INSERT INTO users (user_id, password, name, role, status)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                 password = VALUES(password),
                 name = VALUES(name),
                 role = VALUES(role),
                 status = VALUES(status)`,
                [cleanUserId, cleanPassword || "123456", cleanName, cleanRole, cleanStatus]
            );
        }
    } catch (err) {
        console.error("SYNC SYSTEM USER ERROR:", err);
    }
};

const createSystemUser = async (userData) => {
    return syncSystemUser(userData);
};

const deleteSystemUser = async (user_id) => {
    if (!user_id) return;
    try {
        await db.query("DELETE FROM users WHERE user_id = ?", [String(user_id).trim()]);
    } catch (err) {
        console.error("DELETE SYSTEM USER ERROR:", err);
    }
};

module.exports = {
    syncSystemUser,
    createSystemUser,
    deleteSystemUser,
};