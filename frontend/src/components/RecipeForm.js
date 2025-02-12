import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useRecipeContext } from "../hooks/useRecipeContext"; // ✅ Import global recipe context

function RecipeForm() {
  const { user } = useAuthContext();
  const { dispatch } = useRecipeContext(); // ✅ Get dispatch from context

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, ""]); // Add empty ingredient field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const recipe = { name, ingredients, instructions, prepTime, difficulty };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        const json = await response.json();
        setError(json.error || "Failed to add recipe.");
        setEmptyFields(json.emptyFields || []);
        return;
      }

      const newRecipe = await response.json();

      // ✅ Add recipe to global state so it appears immediately
      dispatch({ type: "CREATE_RECIPE", payload: newRecipe });

      console.log("New recipe added and dispatched", newRecipe);

      // ✅ Clear form fields after successful submission
      setName("");
      setIngredients([""]);
      setInstructions("");
      setPrepTime("");
      setDifficulty("easy");
      setError(null);
      setEmptyFields([]);
    } catch (err) {
      console.error("Recipe submission error:", err);
      setError("Failed to add recipe. Please check the server.");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Recipe</h3>

      <label>Recipe Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Ingredients:</label>
      {ingredients.map((ingredient, index) => (
        <input
          key={index}
          type="text"
          value={ingredient}
          onChange={(e) => handleIngredientChange(index, e.target.value)}
          className={emptyFields.includes("ingredients") ? "error" : ""}
        />
      ))}
      <button type="button" onClick={addIngredientField}>+ Add Ingredient</button>

      <label>Cooking Instructions:</label>
      <textarea
        onChange={(e) => setInstructions(e.target.value)}
        value={instructions}
        className={emptyFields.includes("instructions") ? "error" : ""}
      ></textarea>

      <label>Preparation Time (in minutes):</label>
      <input
        type="number"
        onChange={(e) => setPrepTime(e.target.value)}
        value={prepTime}
        className={emptyFields.includes("prepTime") ? "error" : ""}
      />

      <label>Difficulty Level:</label>
      <select
        onChange={(e) => setDifficulty(e.target.value)}
        value={difficulty}
        className={emptyFields.includes("difficulty") ? "error" : ""}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button>Add Recipe</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default RecipeForm;
