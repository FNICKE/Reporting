const multer = require("multer");
const path = require("path");
const fs = require("fs");

const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

const allowedTrainerMediaTypes = [
    ...allowedImageTypes,
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const imageFileFilter = (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    return cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
};

const trainerMediaFilter = (req, file, cb) => {
    if (allowedTrainerMediaTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    return cb(new Error("Only JPG, JPEG, PNG, WEBP, MP4, WEBM and MOV files are allowed"));
};

const createUploadFolder = (folderName) => {
    const uploadPath = path.join(__dirname, "..", "uploads", folderName);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    return uploadPath;
};

const createStorage = (folderName, prefix) => {
    const uploadPath = createUploadFolder(folderName);

    return multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadPath),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const fileName = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            cb(null, fileName);
        },
    });
};

const createUpload = (folderName, prefix, options = {}) => multer({
    storage: createStorage(folderName, prefix),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: options.maxFiles || 2,
    },
    fileFilter: options.fileFilter || imageFileFilter,
});

const districtUpload = createUpload("district-reports", "district");
const talukaUpload = createUpload("taluka-reports", "taluka");
const vibhagUpload = createUpload("vibhag-reports", "vibhag");
const trainerUpload = createUpload("trainer-reports", "trainer", {
    fileFilter: trainerMediaFilter,
    maxFiles: 3,
});

module.exports = {
    districtUpload,
    talukaUpload,
    vibhagUpload,
    trainerUpload,
};
