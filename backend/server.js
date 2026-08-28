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

        // =================================================
        // DATABASE CONNECTION
        // =================================================

        await testDatabaseConnection();


        // =================================================
        // START EXPRESS SERVER
        // =================================================

        app.listen(
            PORT,
            () => {

                console.log("");
                console.log(
                    "================================="
                );

                console.log(
                    "✅ MySQL Database Connected"
                );

                console.log(
                    `🚀 Server running on http://localhost:${PORT}`
                );

                console.log(
                    "================================="
                );

                console.log("");

            }
        );

    } catch (error) {

        console.error("");

        console.error(
            "❌ Server failed:",
            error.message
        );

        console.error("");

        process.exit(1);

    }

};


// =====================================================
// RUN SERVER
// =====================================================

startServer();