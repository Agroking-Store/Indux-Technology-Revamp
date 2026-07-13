import multer from "multer";

// Store the uploaded file in memory instead of uploading to Cloudinary
const storage = multer.memoryStorage();

const uploadImageInstance = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed") as any, false);
    }
  },
});

// Middleware for single image upload (field name: "featuredImage")
export const uploadBlogImage = uploadImageInstance.single("featuredImage");

// Middleware for single event image upload (field name: "image")
export const uploadEventImage = uploadImageInstance.single("image");

// Middleware for single PDF resume upload (field name: "resume")
export const uploadResume = uploadResumeInstance.single("resume");