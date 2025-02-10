import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { RecipeContextProvider } from "./context/WorkoutContext"; // ✅ Ensure correct import

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecipeContextProvider> {/* ✅ Wrap the entire app */}
        <App />
      </RecipeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
