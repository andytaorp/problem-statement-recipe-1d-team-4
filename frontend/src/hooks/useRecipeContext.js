import { RecipeContext } from "../context/RecipeContext";
import { useContext } from "react";

// Custom hook
export const useRecipeContext = () => {
  const context = useContext(RecipeContext); // Use the value passed in the provider

  if (!context) {
    throw Error(
      "useRecipeContext must be used inside a RecipeContextProvider"
    );
  }

  return context;
};
