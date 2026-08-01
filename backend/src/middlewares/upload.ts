import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.memoryStorage();

// Disk storage for blog images
const blogUploadDir = path.join(__dirname, "../../uploads/blogs");
if (!fs.existsSync(blogUploadDir)) {
  fs.mkdirSync(blogUploadDir, { recursive: true });
}

// Disk storage for resumes
const resumeUploadDir = path.join(__dirname, "../../uploads/resumes");
if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

// Disk storage for events
const eventUploadDir = path.join(__dirname, "../../uploads/events");
if (!fs.existsSync(eventUploadDir)) {
  fs.mkdirSync(eventUploadDir, { recursive: true });
}

const blogDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, blogUploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const resumeDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, resumeUploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const eventDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, eventUploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadBlogDiskInstance = multer({
  storage: blogDiskStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed") as any, false);
    }
  },
});

const uploadEventDiskInstance = multer({
  storage: eventDiskStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed") as any, false);
    }
  },
});

const uploadResumeDiskInstance = multer({
  storage: resumeDiskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed") as any, false);
    }
  },
});

const uploadRegistrationFileInstance = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, or Word documents are allowed") as any, false);
    }
  },
});

// Middleware for single image upload (field name: "featuredImage")
export const uploadBlogImage = uploadBlogDiskInstance.single("featuredImage");

// Middleware for single event image upload (field name: "image")
export const uploadEventImage = uploadEventDiskInstance.single("image");

// Middleware for multiple event images upload (field names: "coverImage", "bannerImage")
export const uploadEventImages = uploadEventDiskInstance.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

// Middleware for single PDF resume upload (field name: "resume")
export const uploadResume = uploadResumeDiskInstance.single("resume");

// Middleware for single registration dynamic file upload (field name: "file")
export const uploadRegistrationFile = uploadRegistrationFileInstance.single("file");