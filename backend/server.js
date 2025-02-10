const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Fix CORS issue
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4001"], // Allow both frontend ports
    credentials: true, // Allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: Missing MONGO_URI in .env file");
  process.exit(1); // Prevent the app from running without a database connection
}

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}, connected to MongoDB`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
