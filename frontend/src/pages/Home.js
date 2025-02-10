import { useEffect, useState } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { workouts, dispatch } = useWorkoutContext(); // global context state
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState(""); // State for search filter

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/workouts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json(); // parse JSON response body as JS array of objects
      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  // Filter workouts based on search term
  const filteredWorkouts = workouts
    ? workouts.filter((workout) =>
        workout.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="home">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search workouts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="workouts">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))
        ) : (
          <p>No workouts found</p>
        )}
      </div>

      <WorkoutForm />
    </div>
  );
}

export default Home;
