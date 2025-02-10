const express = require("express");
const {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} = require("../controllers/recipeController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// ✅ Require authentication for all recipe routes
router.use(requireAuth);

// Routes
router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", createRecipe);
router.delete("/:id", deleteRecipe);
router.patch("/:id", updateRecipe);

module.exports = router;
