import { useWorkoutContext } from "../hooks/useWorkoutContext";
// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

function WorkoutDetails({ recipe }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECIPE", payload: json });
    }
  };
  return (
    <div className="recipe-details">
      <h4>{recipe.title}</h4>
      <p>
        <strong>Ingredients: </strong>
        {recipe.ingredients.join(", ")}
      </p>
      <p>
        <strong>Instructions: </strong>
        {recipe.instructions}
      </p>
      <p>
        <strong>Preparation Time: </strong>
        {recipe.prepTime} minutes
      </p>
      <p>
        <strong>Difficulty: </strong>
        {recipe.difficulty}
      </p>
      <p>
        {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
}

export default WorkoutDetails;
