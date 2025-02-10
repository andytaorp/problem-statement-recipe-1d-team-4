import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

function WorkoutDetails() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecipe();
    }
  }, [id, user]);

  if (!user) {
    return <p>You must be logged in to view this recipe.</p>;
  }

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recipe-details">
      <h2>{recipe.name}</h2>
      <p><strong>Preparation Time:</strong> {recipe.prepTime} minutes</p>
      <p><strong>Difficulty:</strong> {recipe.difficulty}</p>

      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h3>Instructions:</h3>
      <p>{recipe.instructions}</p>
    </div>
  );
}

export default WorkoutDetails;
