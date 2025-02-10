import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RecipeContextProvider } from "./context/WorkoutContext"; // Updated to use RecipeContext
import { AuthContextProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecipeContextProvider> {/* Replaced WorkoutContextProvider with RecipeContextProvider */}
        <App />
      </RecipeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
