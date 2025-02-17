import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function RecipeDetails() {
  const { user } = useAuthContext();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRecipes();
  }, [user]);

  const startEditing = (recipe) => {
    setIsEditing(recipe._id);
    setEditRecipe({ ...recipe });
  };

  const handleUpdate = async (id) => {
    try {
      const updatedData = { ...editRecipe }; // Ensure latest state is used

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      // Refetch recipes to get the latest data
      await fetchRecipes();

      setIsEditing(null);
      setEditRecipe(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      // Ensure new reference to trigger re-render
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) return <p>You must be logged in to view your recipes.</p>;
  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recipes-container">
      <div className="recipes">
        <h2>Your Recipes</h2>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-item">
              {isEditing === recipe._id ? (
                <div className="edit-form">
                  <label>Recipe Name:</label>
                  <input
                    type="text"
                    value={editRecipe.name}
                    onChange={(e) => setEditRecipe((prev) => ({ ...prev, name: e.target.value }))}
                  />

                  <label>Preparation Time (in minutes):</label>
                  <input
                    type="number"
                    value={editRecipe.prepTime}
                    onChange={(e) => setEditRecipe((prev) => ({ ...prev, prepTime: e.target.value }))}
                  />

                  <label>Difficulty Level:</label>
                  <select
                    value={editRecipe.difficulty}
                    onChange={(e) => setEditRecipe((prev) => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <label>Ingredients:</label>
                  {editRecipe.ingredients.map((ingredient, index) => (
                    <input
                      key={index}
                      type="text"
                      value={ingredient}
                      onChange={(e) => {
                        setEditRecipe((prev) => {
                          const newIngredients = [...prev.ingredients];
                          newIngredients[index] = e.target.value;
                          return { ...prev, ingredients: newIngredients };
                        });
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditRecipe((prev) => ({
                      ...prev,
                      ingredients: [...prev.ingredients, ""]
                    }))}
                  >
                    + Add Ingredient
                  </button>

                  <label>Cooking Instructions:</label>
                  <textarea
                    value={editRecipe.instructions}
                    onChange={(e) => setEditRecipe((prev) => ({ ...prev, instructions: e.target.value }))}
                  ></textarea>

                  <button onClick={() => handleUpdate(recipe._id)}>Save</button>
                  <button onClick={() => setIsEditing(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <h3>{recipe.name}</h3>
                  <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
                  <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>

                  <h4>Instructions:</h4>
                  <p>{recipe.instructions}</p>

                  <button className="edit-button" onClick={() => startEditing(recipe)}>Edit</button>
                  <button onClick={() => handleDelete(recipe._id)}>Delete</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No recipes found. Add a new recipe!</p>
        )}
      </div>
    </div>
  );
}

export default RecipeDetails;
