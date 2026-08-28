const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadPath = path.join(
    __dirname,
    "..",
    "uploads",
    "trainer-reports"
);

// =====================================================
// CREATE DIRECTORY
// =====================================================

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(
        uploadPath,
        {
            recursive: true,
        }
    );
}

// =====================================================
// ALLOWED FILE TYPES
// =====================================================

const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

// =====================================================
// FILE FILTER
// =====================================================

const imageFileFilter = (
    req,
    file,
    cb
) => {

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            )
        );
    }
};

// =====================================================
// STORAGE
// =====================================================

const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                uploadPath
            );
        },

        filename: (
            req,
            file,
            cb
        ) => {

            const ext =
                path.extname(
                    file.originalname
                );

            const fileName =
                "trainer-" +
                Date.now() +
                "-" +
                Math.round(
                    Math.random() * 1e9
                ) +
                ext;

            cb(
                null,
                fileName
            );
        },
    });

// =====================================================
// MULTER
// =====================================================

const trainerUpload =
    multer({

        storage,

        limits: {

            fileSize:
                10 * 1024 * 1024,
        },

        fileFilter:
            imageFileFilter,
    });

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    trainerUpload,
};