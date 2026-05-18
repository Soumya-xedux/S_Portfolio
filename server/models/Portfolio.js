const mongoose = require("mongoose");

const portfolioSchema =
  new mongoose.Schema(
    {
      section: {
        type: String,
        required: true,
        unique: true,
      },

      data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Portfolio",
  portfolioSchema
);