const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String], // Array of strings
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    prepTime: {
      type: Number, // Time in minutes
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"], // Restrict values to these options
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt & updatedAt fields
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);

