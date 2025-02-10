import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Import createRoot
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { RecipeContextProvider } from "./context/WorkoutContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecipeContextProvider> {/* ✅ Ensure App is wrapped */}
        <App />
      </RecipeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
