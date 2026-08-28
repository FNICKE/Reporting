const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// ALLOWED IMAGE TYPES
// =====================================================

const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

// =====================================================
// MAX FILE SIZE
// 10 MB
// =====================================================

const MAX_FILE_SIZE =
    10 * 1024 * 1024;

// =====================================================
// IMAGE FILE FILTER
// =====================================================

const imageFileFilter = (
    req,
    file,
    cb
) => {

    if (
        allowedImageTypes.includes(
            file.mimetype
        )
    ) {

        return cb(
            null,
            true
        );

    }

    return cb(
        new Error(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
    );

};

// =====================================================
// CREATE UPLOAD FOLDER
// =====================================================

const createUploadFolder = (
    folderName
) => {

    const uploadPath =
        path.join(
            __dirname,
            "..",
            "uploads",
            folderName
        );

    // Create folder if not exists

    if (
        !fs.existsSync(
            uploadPath
        )
    ) {

        fs.mkdirSync(
            uploadPath,
            {
                recursive: true,
            }
        );

    }

    return uploadPath;

};

// =====================================================
// CREATE STORAGE
// =====================================================

const createStorage = (
    folderName,
    prefix
) => {

    const uploadPath =
        createUploadFolder(
            folderName
        );

    return multer.diskStorage({

        // =================================================
        // DESTINATION
        // =================================================

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

        // =================================================
        // FILE NAME
        // =================================================

        filename: (
            req,
            file,
            cb
        ) => {

            const ext =
                path.extname(
                    file.originalname
                ).toLowerCase();

            const fileName =
                `${prefix}-${Date.now()}-${Math.round(
                    Math.random() * 1e9
                )}${ext}`;

            cb(
                null,
                fileName
            );

        },

    });

};

// =====================================================
// CREATE MULTER UPLOAD
// =====================================================

const createUpload = (
    folderName,
    prefix
) => {

    return multer({

        storage:
            createStorage(
                folderName,
                prefix
            ),

        limits: {

            fileSize:
                MAX_FILE_SIZE,

            files: 2,

        },

        fileFilter:
            imageFileFilter,

    });

};

// =====================================================
// DISTRICT REPORT UPLOAD
// =====================================================

const districtUpload =
    createUpload(
        "district-reports",
        "district"
    );

// =====================================================
// TALUKA REPORT UPLOAD
// =====================================================

const talukaUpload =
    createUpload(
        "taluka-reports",
        "taluka"
    );

// =====================================================
// VIBHAG REPORT UPLOAD
// =====================================================

const vibhagUpload =
    createUpload(
        "vibhag-reports",
        "vibhag"
    );

// =====================================================
// TRAINER REPORT UPLOAD
// =====================================================

const trainerUpload =
    createUpload(
        "trainer-reports",
        "trainer"
    );

// =====================================================
// EXPORT
// =====================================================

module.exports = {

    districtUpload,

    talukaUpload,

    vibhagUpload,

    trainerUpload,

};