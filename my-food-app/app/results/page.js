"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Results() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState([]); // Stores API response

  // Extract API data from URL parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const dataString = urlParams.get("data");

      if (dataString) {
        try {
          const apiData = JSON.parse(dataString); // Convert back to JSON
          console.log("Fetched Data:", apiData);
          setIngredients(apiData.ingredients || []); // Store in state
        } catch (error) {
          console.error("Error parsing API data:", error);
        }
      }
    }
  }, []);

  const appContainerStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    fontFamily: "Arial, sans-serif",
    alignItems: "center",
    paddingTop: "20px",
  };

  const listStyle = {
    listStyleType: "none",
    padding: "0",
    width: "80%",
    margin: "0 auto",
    fontSize: "1.2em",
    color: "#2c3e50",
  };

  const listItemStyle = {
    backgroundColor: "#fff",
    margin: "10px 0",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "20px",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
    transition: "background-color 0.3s ease",
  };

  return (
    <div style={appContainerStyle}>
      <h1>Grocery List</h1>
      <ul style={listStyle}>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <li key={index} style={listItemStyle}>
              {ingredient.item}: {ingredient.amount} {ingredient.unit}
            </li>
          ))
        ) : (
          <p>No ingredients found.</p>
        )}
      </ul>
      <button style={buttonStyle} onClick={() => router.push("/food-form")}>
        Return
      </button>
    </div>
  );
}
