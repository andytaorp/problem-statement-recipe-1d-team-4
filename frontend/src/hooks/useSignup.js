import { useState } from "react";
import { useAuthContext } from "./useAuthContext"; // Ensure Auth Context is imported

export const useSignup = () => {
  const [error, setError] = useState(null); // ✅ Define state for error
  const [isLoading, setIsLoading] = useState(false); // ✅ Define state for loading
  const { dispatch } = useAuthContext(); // ✅ Get dispatch from Auth Context

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Signing up with:", email, password);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected response format from server.");
      }

      const json = await response.json();
      console.log("Parsed JSON response:", json);

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || "Signup failed. Please try again.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });

      setIsLoading(false);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to connect to the server. Please check your internet or try again later.");
      setIsLoading(false);
    }
  };

  return { signup, error, isLoading }; // ✅ Ensure `signup` is returned
};
