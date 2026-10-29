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

// Disk storage for case studies
const caseStudyUploadDir = path.join(__dirname, "../../uploads/case-studies");
if (!fs.existsSync(caseStudyUploadDir)) {
  fs.mkdirSync(caseStudyUploadDir, { recursive: true });
}

// Disk storage for products
const productUploadDir = path.join(__dirname, "../../uploads/products");
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

// Disk storage for recent works
const recentWorkUploadDir = path.join(__dirname, "../../uploads/recent-works");
if (!fs.existsSync(recentWorkUploadDir)) {
  fs.mkdirSync(recentWorkUploadDir, { recursive: true });
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

const caseStudyDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, caseStudyUploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const productDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, productUploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "product-" + uniqueSuffix + ext);
  },
});

const recentWorkDiskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, recentWorkUploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "work-" + uniqueSuffix + ext);
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

const uploadCaseStudyDiskInstance = multer({
  storage: caseStudyDiskStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed") as any, false);
    }
  },
});

const uploadProductDiskInstance = multer({
  storage: productDiskStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed") as any, false);
    }
  },
});

const uploadRecentWorkDiskInstance = multer({
  storage: recentWorkDiskStorage,
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

// Helper to automatically convert any uploaded image to .webp and remove original non-webp file
const convertFileToWebp = async (file?: Express.Multer.File) => {
  if (!file || !file.path) return;
  const ext = path.extname(file.path).toLowerCase();
  if (ext === ".webp") return;

  const originalPath = file.path;
  const newFilename = file.filename.slice(0, -ext.length) + ".webp";
  const newPath = path.join(file.destination, newFilename);

  try {
    const sharp = require(path.resolve(__dirname, "../../../frontend/node_modules/sharp"));
    await sharp(originalPath).webp({ quality: 85 }).toFile(newPath);

    if (fs.existsSync(newPath) && fs.statSync(newPath).size > 0) {
      fs.unlinkSync(originalPath);
      file.filename = newFilename;
      file.path = newPath;
      file.mimetype = "image/webp";
    }
  } catch (err) {
    console.error("Error converting uploaded image to WebP:", err);
  }
};

// Middleware for single image upload (field name: "featuredImage")
export const uploadBlogImage = (req: any, res: any, next: any) => {
  uploadBlogDiskInstance.single("featuredImage")(req, res, async (err: any) => {
    if (err) return next(err);
    if (req.file) await convertFileToWebp(req.file);
    next();
  });
};

// Middleware for single event image upload (field name: "image")
export const uploadEventImage = (req: any, res: any, next: any) => {
  uploadEventDiskInstance.single("image")(req, res, async (err: any) => {
    if (err) return next(err);
    if (req.file) await convertFileToWebp(req.file);
    next();
  });
};

// Middleware for single product image upload (field name: "image")
export const uploadProductImage = (req: any, res: any, next: any) => {
  uploadProductDiskInstance.single("image")(req, res, async (err: any) => {
    if (err) return next(err);
    if (req.file) await convertFileToWebp(req.file);
    next();
  });
};

// Middleware for single recent work image upload (field name: "image")
export const uploadRecentWorkImage = (req: any, res: any, next: any) => {
  uploadRecentWorkDiskInstance.single("image")(req, res, async (err: any) => {
    if (err) return next(err);
    if (req.file) await convertFileToWebp(req.file);
    next();
  });
};

// Middleware for multiple event images upload (field names: "coverImage", "bannerImage")
export const uploadEventImages = uploadEventDiskInstance.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

// Middleware for single PDF resume upload (field name: "resume")
export const uploadResume = uploadResumeDiskInstance.single("resume");

// Middleware for single registration dynamic file upload (field name: "file")
export const uploadRegistrationFile = uploadRegistrationFileInstance.single("file");
// Middleware for single case study image upload (field name: "image")
export const uploadCaseStudyImage = uploadCaseStudyDiskInstance.single("image");
