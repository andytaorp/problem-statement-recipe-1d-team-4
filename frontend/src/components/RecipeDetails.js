import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function RecipeDetails() {
  const { user } = useAuthContext();

  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data); // ✅ Store all recipes in state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRecipes();
  }, [user]); // ✅ Fetch only when the user changes

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== id)); // ✅ Remove deleted recipe
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

              <button onClick={() => handleDelete(recipe._id)}>Delete</button>
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
