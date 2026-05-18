require("dotenv").config();

const mongoose = require("mongoose");

const fs = require("fs");

const Portfolio = require(
  "./models/Portfolio"
);

const migrate = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected"
    );

    // Read local data.json
    const rawData = fs.readFileSync(
      "./data.json",
      "utf-8"
    );

    const data = JSON.parse(rawData);

    // Insert each section
    for (const section of Object.keys(
      data
    )) {
      await Portfolio.findOneAndUpdate(
        { section },

        {
          section,

          data: data[section],
        },

        {
          upsert: true,
          returnDocument: "after"
        }
      );

      console.log(
        `Migrated: ${section}`
      );
    }

    console.log(
      "Migration Completed"
    );

    process.exit();
  } catch (err) {
    console.error(
      "Migration Failed:",
      err
    );

    process.exit(1);
  }
};

migrate();