const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const recipeRoutes = require("./routes/recipeRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ FIX: Allow both `http://localhost:3000` and `http://localhost:4001`
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:4001"], // Allow multiple frontend URLs
    credentials: true, // Allow authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes); // Ensure correct API routes

// Database Connection
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}, connected to MongoDB`)))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
