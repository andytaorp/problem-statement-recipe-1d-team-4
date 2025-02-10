import { useEffect } from "react";
import WorkoutDetails from "../components/WorkoutDetails"; // ✅ Ensure correct import
import WorkoutForm from "../components/WorkoutForm"; // ✅ Ensure correct import
import { useWorkoutContext } from "../hooks/useWorkoutContext"; // ✅ Ensure correct import
import { useAuthContext } from "../hooks/useAuthContext"; // ✅ Ensure correct import

function Home() {
  const { workouts, dispatch } = useWorkoutContext(); // ✅ Use global context
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
          throw new Error("Failed to fetch workouts");
        }

        const json = await response.json();
        dispatch({ type: "SET_WORKOUTS", payload: json });
      } catch (error) {
        console.error("Error fetching workouts:", error);
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

export default Home; // ✅ Only one export default
