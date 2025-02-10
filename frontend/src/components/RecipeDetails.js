import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

function WorkoutDetails() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");

  const navigate = useNavigate();

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
        setName(data.name);
        setPrepTime(data.prepTime);
        setDifficulty(data.difficulty);
        setIngredients(data.ingredients);
        setInstructions(data.instructions);
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to update a recipe");
      return;
    }

    const updatedRecipe = { name, prepTime, difficulty, ingredients, instructions };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      const data = await response.json();
      setRecipe(data);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setError("You must be logged in to delete a recipe");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      navigate("/"); // Redirect to home page after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) {
    return <p>You must be logged in to view this recipe.</p>;
  }

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recipe-details">
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <label>Recipe Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Preparation Time (in minutes):</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />

          <label>Difficulty Level:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label>Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index] = e.target.value;
                setIngredients(newIngredients);
              }}
            />
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ""])}>Add Ingredient</button>

          <label>Cooking Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          ></textarea>

          <button type="submit">Update Recipe</button>
        </form>
      ) : (
        <>
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

          <button onClick={() => setIsEditing(true)}>Edit Recipe</button>
          <button onClick={handleDelete}>Delete Recipe</button>
        </>
      )}
    </div>
  );
}

export default WorkoutDetails;