import { useAuthContext } from "./useAuthContext";
import { useRecipeContext } from "./useRecipeContext"; // Updated to use RecipeContext

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchRecipes } = useRecipeContext(); // Updated dispatch for recipes

  const logout = () => {
    // Remove user from local storage
    localStorage.removeItem("user");

    // Dispatch logout action, remove user from auth context
    dispatch({ type: "LOGOUT" });

    // Remove recipes from context
    dispatchRecipes({ type: "SET_RECIPES", payload: null }); // Updated action type
  };

  return { logout };
};
