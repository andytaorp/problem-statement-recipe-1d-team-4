import { useAuthContext } from "./useAuthContext";
import { useRecipeContext } from "./useRecipeContext"; // Ensure correct import

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchRecipes } = useRecipeContext(); // Correct dispatch for recipes

  const logout = () => {
    // Remove user from local storage
    localStorage.removeItem("user");

    // Dispatch logout action, remove user from auth context
    dispatch({ type: "LOGOUT" });

    // Remove recipes from context
    dispatchRecipes({ type: "SET_RECIPES", payload: [] }); // Updated to an empty array instead of null
  };

  return { logout };
};
