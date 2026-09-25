require("dotenv").config();

const app = require("./src/app");

const {
    testDatabaseConnection,
} = require("./src/config/db");

const PORT =
    process.env.PORT || 5000;


// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log("");
            console.log("=================================");
            console.log(`🚀 Server running on port ${PORT}`);
            console.log("=================================");
            console.log("");
        });

        // Test DB connection non-critically
        try {
            await testDatabaseConnection();
            console.log("✅ MySQL Database Connected successfully");
        } catch (dbError) {
            console.error("⚠️ MySQL Database connection warning:", dbError.message);
            console.error("Check your DB credentials in .env");
        }
    } catch (error) {
        console.error("❌ Server startup error:", error.message);
    }
};


// =====================================================
// RUN SERVER
// =====================================================

startServer();