import { createContext, useReducer, useContext } from "react";

// Create Context
export const RecipeContext = createContext();

// Reducer function
export const recipeReducer = (state, action) => {
  switch (action.type) {
    case "SET_RECIPES":
      return { recipes: action.payload };
    case "CREATE_RECIPE":
      return { recipes: [action.payload, ...state.recipes] };
    case "DELETE_RECIPE":
      return { recipes: state.recipes.filter(r => r._id !== action.payload._id) };
    default:
      return state;
  }
};

// Context Provider
export const RecipeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, { recipes: [] });

  return (
    <RecipeContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom Hook for easy access
export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipeContext must be used inside a RecipeContextProvider");
  }
  return context;
};
