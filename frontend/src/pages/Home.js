import { useEffect, useState } from "react";
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";
import { useRecipeContext } from "../hooks/useRecipeContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { recipes, dispatch } = useRecipeContext(); // ✅ Changed workouts to recipes
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState(""); // Search filter

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes`, // ✅ Changed /api/workouts to /api/recipes
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch recipes");
        return;
      }

      const json = await response.json(); // Parse JSON response
      dispatch({ type: "SET_RECIPES", payload: json }); // ✅ Changed SET_WORKOUTS to SET_RECIPES
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]);

  // Filter recipes based on search term
  const filteredRecipes = recipes
    ? recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ Changed title to name
      )
    : [];

  return (
    <div className="home">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="recipes">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeDetails key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>

      <RecipeForm />
    </div>
  );
}

export default Home;
