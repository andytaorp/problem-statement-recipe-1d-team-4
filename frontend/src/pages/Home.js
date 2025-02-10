import { useEffect } from "react";
import WorkoutDetails from "../components/RecipeDetails"; // ✅ Uses RecipeDetails instead of WorkoutDetails
import WorkoutForm from "../components/RecipeForm"; // ✅ Uses RecipeForm instead of WorkoutForm
import { useRecipeContext } from "../hooks/useRecipeContext"; // ✅ Corrected context import
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { workouts, dispatch } = useRecipeContext(); // ✅ Uses RecipeContext instead
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user || !user.token) return; // ✅ Prevents request if user is not logged in

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/workouts`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const json = await response.json();
        dispatch({ type: "SET_WORKOUTS", payload: json });
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchWorkouts();
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.length > 0 ? (
          workouts.map((workout) => (
            workout ? <WorkoutDetails key={workout._id} workout={workout} /> : null
          ))
        ) : (
          <p>Loading recipes...</p> // ✅ Prevents crashing when `workouts` is undefined
        )}
      </div>
      <WorkoutForm />
    </div>
  );
}

export default Home;
