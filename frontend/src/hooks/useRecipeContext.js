import { RecipeContext } from "../context/WorkoutContext"; // ✅ FIXED: Correct import path
import { useContext } from "react";

// Custom hook to use RecipeContext
export const useRecipeContext = () => {
  const context = useContext(RecipeContext); // ✅ Use the RecipeContext

  if (!context) {
    throw Error(
      "useRecipeContext must be used inside a RecipeContextProvider"
    );
  }

  return context;
};
