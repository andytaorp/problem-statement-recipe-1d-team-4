import { useEffect, useState } from "react";
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";
import { useRecipeContext } from "../hooks/useRecipeContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { recipes, dispatch } = useRecipeContext(); // ✅ Global recipe context
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search filter

  // ✅ Fetch recipes on page load
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const json = await response.json();
        dispatch({ type: "SET_RECIPES", payload: json }); // ✅ Store in context
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, [dispatch, user]);

  // ✅ Filter recipes by search term
  const filteredRecipes = recipes
    ? recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="home">
      <div className="recipes-container">
        {/* ✅ Left side: Recipes list */}
        <div className="recipes">
          <h2>Recipes</h2>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />

          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => <RecipeDetails key={recipe._id} recipe={recipe} />)
          ) : (
            <p>No recipes found</p>
          )}
        </div>

        {/* ✅ Right side: Recipe Form */}
        <div className="form-container">
          <h2>Add a Recipe</h2>
          <RecipeForm />
        </div>
      </div>
    </div>
  );
}

export default Home;
