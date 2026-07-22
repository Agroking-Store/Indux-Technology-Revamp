import multer from "multer";

// Store the uploaded file in memory instead of uploading to Cloudinary
const storage = multer.memoryStorage();

const uploadImageInstance = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed") as any, false);
    }
  },
});

const uploadResumeInstance = multer({
  storage,
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
export const uploadBlogImage = uploadImageInstance.single("featuredImage");

// Middleware for single event image upload (field name: "image")
export const uploadEventImage = uploadImageInstance.single("image");

// Middleware for multiple event images upload (field names: "coverImage", "bannerImage")
export const uploadEventImages = uploadImageInstance.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

// Middleware for single PDF resume upload (field name: "resume")
export const uploadResume = uploadResumeInstance.single("resume");

// Middleware for single registration dynamic file upload (field name: "file")
export const uploadRegistrationFile = uploadRegistrationFileInstance.single("file");