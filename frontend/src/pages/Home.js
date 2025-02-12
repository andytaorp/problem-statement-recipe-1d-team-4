import { useEffect, useState } from "react";
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";
import { useRecipeContext } from "../hooks/useRecipeContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { recipes, dispatch } = useRecipeContext();
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch recipes when user logs in
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const json = await response.json();
        dispatch({ type: "SET_RECIPES", payload: json });
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]);

  // Filter recipes based on search term
  const filteredRecipes = recipes
    ? recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="home">
      {/* Search Bar */}
      

      <div className="content">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
        {/* Recipes List */}
        <div className="recipes">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeDetails key={recipe._id} recipe={recipe} />
            ))
          ) : (
            <p>No recipes found</p>
          )}
        </div>

        {/* Recipe Form */}
        
      </div>
      <RecipeForm />
    </div>
  );
}

export default Home;
