const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDir('uploads/documents');
ensureDir('uploads/assessments');
ensureDir('uploads/avatars');

// Storage for standard documents
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documents');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage for PCP assessment files
const assessmentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/assessments');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage for User Avatars
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter: allow PDF, DOCX, JPG, PNG
const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed: PDF, DOCX, JPG, PNG'));
    }
};

const uploadDocument = multer({
    storage: documentStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

const uploadAssessment = multer({
    storage: assessmentStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB max for profile pics
});

module.exports = { uploadDocument, uploadAssessment, uploadAvatar };
