const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const fs = require("fs");
const multer = require("multer");
const connectDB = require("./config/db");
const Portfolio = require("./models/Portfolio");
// const path = require("path");
dotenv.config();



const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin: ["http://localhost:3000", "https://s-portfolio-neon.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== process.env.ADMIN_SECRET) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
};

// const DB_FILE = "./data.json";

// Helper: Logging Middleware to see every request
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} to ${req.url}`);
  next();
});

/* ---------- Helpers ---------- */
// const readDB = () => {
//   try {
//     return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
//   } catch (err) {
//     return {
//       about: {},

//       projects: [],

//       experience: [],

//       education: [],

//       certifications: [],

//       skills: [],
//     };
//   }
// };

// const writeDB = (data) => {
//   fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
// };

/* ---------- Disk Storage Image Upload Configuration ---------- */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Multer parses query params before destination is called
//     const section = req.query.section || "misc";
//     const dir = `uploads/${section}`;

//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (_, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// ------------- Image Upload with Cloudinary --------
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  api_key: process.env.CLOUDINARY_API_KEY,

  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: req.query.section || "portfolio",

    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }),
});
// -----------------------------------------------------

// const upload = multer({ storage });

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only images allowed"));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// app.use("/uploads", express.static("uploads"));

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API Running",
  });
});

// app.get("/data", (req, res) => {
//   const db = readDB();
//   res.json(db);
// });
app.get("/data", async (req, res) => {
  try {
    const sections =
      await Portfolio.find();

    const formatted = {};

    sections.forEach((item) => {
      formatted[item.section] =
        item.data;
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch data",
    });
  }
});

// app.get("/about", (req, res) => {
//   const db = readDB();
//   res.json(db.about || {});
// });
app.get("/about", async (req, res) => {
  try {
    const about =
      await Portfolio.findOne({
        section: "about",
      });

    res.json(about?.data || {});
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch about",
    });
  }
});

// app.put("/about", verifyAdmin, (req, res) => {
//   const db = readDB();
//   db.about = req.body;
//   writeDB(db);
//   res.json({ success: true });
// });
app.put(
  "/about",
  verifyAdmin,
  async (req, res) => {
    try {
      await Portfolio.findOneAndUpdate(
        {
          section: "about",
        },
        {
          data: req.body,
        },
        {
          upsert: true,
          returnDocument: "after"
        }
      );

      res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to update about",
      });
    }
  }
);

/* ---------- The Fixed Upload Route ---------- */
app.post("/upload", verifyAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    // Multer-specific errors
    if (err instanceof multer.MulterError) {
      console.error("Multer Error:", err);

      let message = err.message;

      if (err.code === "LIMIT_FILE_SIZE") {
        message = "Image size must be less than 5MB";
      }

      return res.status(400).json({
        success: false,
        error: message,
      });
    }

    // Custom / unknown upload errors
    if (err) {
      console.error("Upload Error:", err);

      return res.status(400).json({
        success: false,
        error: err.message || "Image upload failed",
      });
    }

    // No file uploaded
    if (!req.file) {
      console.error("No file found in request");

      return res.status(400).json({
        success: false,
        error: "No image uploaded",
      });
    }

    console.log("File Saved Successfully:", req.file.path);

    return res.status(200).json({
      success: true,

      path: req.file.path,

      filename: req.file.filename || req.file.public_id,
    });
  });
});

app.delete("/delete-image", verifyAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: "Image URL required",
      });
    }

    // extract public_id
    const parts = imageUrl.split("/");

    const fileName = parts[parts.length - 1];

    const folder = parts[parts.length - 2];

    const publicId =
      `${folder}/${fileName.split(".")[0]}`;

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Image delete failed",
    });
  }
});



// Generic CRUD
// app.get("/:section", (req, res) => {
//   const db = readDB();
//   const { section } = req.params;
//   if (!(section in db))
//     return res.status(404).json({ error: "Invalid section" });
//   res.json(db[section]);
// });
app.get("/:section", async (req, res) => {
  try {
    const { section } = req.params;

    const item =
      await Portfolio.findOne({
        section,
      });

    res.json(item?.data || []);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Fetch failed",
    });
  }
});

// app.post("/:section", verifyAdmin, (req, res) => {
//   const db = readDB();
//   const { section } = req.params;
//   if (!Array.isArray(db[section]))
//     return res.status(400).json({ error: "Not a list" });

//   const newItem = { id: `${section}-${Date.now()}`, ...req.body };
//   db[section].unshift(newItem);
//   writeDB(db);
//   res.json({ success: true, data: newItem });
// });
app.post(
  "/:section",
  verifyAdmin,
  async (req, res) => {
    try {
      const { section } = req.params;

      const existing =
        await Portfolio.findOne({
          section,
        });

      const newItem = {
        id: `${section}-${Date.now()}`,
        ...req.body,
      };

      if (!existing) {
        await Portfolio.create({
          section,
          data: [newItem],
        });
      } else {
        existing.data.unshift(newItem);

        await existing.save();
      }

      res.json({
        success: true,
        data: newItem,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Create failed",
      });
    }
  }
);

// app.put("/:section/:id", verifyAdmin, (req, res) => {
//   const db = readDB();
//   const { section, id } = req.params;
//   let updated = false;
//   if (!Array.isArray(db[section]))
//     return res.status(400).json({ error: "Not a list" });

//   db[section] = db[section].map((item) => {
//     if (item.id === id) {
//       updated = true;
//       return { ...item, ...req.body };
//     }
//     return item;
//   });

//   if (!updated) return res.status(404).json({ error: "Not found" });
//   writeDB(db);
//   res.json({ success: true });
// });
app.put(
  "/:section/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { section, id } =
        req.params;

      const existing =
        await Portfolio.findOne({
          section,
        });

      if (!existing) {
        return res.status(404).json({
          error: "Section not found",
        });
      }

      existing.data =
        existing.data.map((item) =>
          item.id === id
            ? {
                ...item,
                ...req.body,
              }
            : item
        );

      await existing.save();

      res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Update failed",
      });
    }
  }
);

// app.delete("/:section/:id", verifyAdmin, (req, res) => {
//   const db = readDB();
//   const { section, id } = req.params;
//   if (!Array.isArray(db[section]))
//     return res.status(400).json({ error: "Not a list" });
//   db[section] = db[section].filter((item) => item.id !== id);
//   writeDB(db);
//   res.json({ success: true });
// });
app.delete(
  "/:section/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const { section, id } =
        req.params;

      const existing =
        await Portfolio.findOne({
          section,
        });

      if (!existing) {
        return res.status(404).json({
          error: "Section not found",
        });
      }

      existing.data =
        existing.data.filter(
          (item) => item.id !== id
        );

      await existing.save();

      res.json({
        success: true,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Delete failed",
      });
    }
  }
);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
};

startServer();