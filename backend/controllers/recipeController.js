const Recipe = require("../models/recipeModel");
const mongoose = require("mongoose");

// Get all recipes
const getRecipes = async (req, res) => {
  const user_id = req.user._id; // Get user id from request (set in requireAuth middleware)
  try {
    const recipes = await Recipe.find({ user_id }).sort({ createdAt: -1 }); // Descending order
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// Get a single recipe
const getRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve recipe" });
  }
};

// Create a new recipe
const createRecipe = async (req, res) => {
  const { name, ingredients, instructions, prepTime, difficulty } = req.body;

  let emptyFields = [];
  if (!name) emptyFields.push("name");
  if (!ingredients || ingredients.length === 0) emptyFields.push("ingredients");
  if (!instructions) emptyFields.push("instructions");
  if (!prepTime) emptyFields.push("prepTime");
  if (!difficulty) emptyFields.push("difficulty");

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all fields", emptyFields });
  }

  try {
    const user_id = req.user._id; // Get user ID from request
    const recipe = await Recipe.create({ name, ingredients, instructions, prepTime, difficulty, user_id });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const recipe = await Recipe.findOneAndDelete({ _id: id });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true } // Returns updated document
    );
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
};
