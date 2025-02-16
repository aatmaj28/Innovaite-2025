"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ingredientsData, setIngredientsData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const ingredientsParam = searchParams.get("ingredients");
    if (ingredientsParam) {
      try {
        const parsedData = JSON.parse(ingredientsParam);
        setIngredientsData(parsedData);
      } catch (error) {
        console.error("Error parsing ingredients:", error);
      }
    }
  }, [searchParams]);

  // Updated styles to match original app
  const styles = {
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#E0EEDE",
      fontFamily: "Inter, sans-serif",
      minHeight: "100vh",
      position: "relative",
      paddingTop: "100px",
    },
    logo: {
      position: "absolute",
      top: "2rem",
      left: "3rem",
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#5F6780",
    },
    title: {
      fontSize: "2em",
      marginBottom: "40px",
      color: "#2c3e50",
      fontWeight: "600",
    },
    ingredientList: {
      listStyleType: "none",
      padding: "0",
      width: "80%",
      margin: "0 auto 2rem",
      flexGrow: 1,
    },
    ingredientItem: {
      backgroundColor: "#fff",
      margin: "10px 0",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    ingredientName: {
      fontWeight: "600",
      fontSize: "1.1em",
      color: "#2c3e50",
      flex: 1,
    },
    ingredientDetails: {
      fontSize: "0.95em",
      color: "#7f8c8d",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "4px",
    },
    buttonContainer: {
      width: "80%",
      margin: "2rem auto",
      display: "flex",
      justifyContent: "flex-start",
    },
    returnButton: {
      padding: "12px 24px",
      backgroundColor: isHovered ? "#0069d9" : "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    totalPriceBlock: {
      width: "80%",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#eef2eb",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      textAlign: "right",
      fontSize: "1.2em",
      fontWeight: "600",
      color: "#2c3e50",
    },
    footer: {
      width: "100%",
      textAlign: "center",
      padding: "1rem",
      background: "#dfe4ee",
      fontSize: "0.9rem",
      color: "#36405e",
      marginTop: "auto",
    },
  };

  const totalPrice = ingredientsData.reduce(
    (sum, ingredient) => sum + parseFloat(ingredient.Price),
    0
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.logo}>SmartCart</div>
      
      <h1 style={styles.title}>Your Grocery List</h1>

      {ingredientsData?.length > 0 ? (
        <ul style={styles.ingredientList}>
          {ingredientsData.map((ingredient, index) => (
            <li
              key={index}
              style={styles.ingredientItem}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={styles.ingredientName}>
                {ingredient["Recipe Ingredient"] &&
                  ingredient["Recipe Ingredient"].charAt(0).toUpperCase() +
                    ingredient["Recipe Ingredient"].slice(1)}
              </div>
              <div style={styles.ingredientDetails}>
                <span>Quantity: {ingredient.Quantity}</span>
                <span>Price: ${parseFloat(ingredient.Price).toFixed(2)}</span>
                <span>Store: {ingredient.Store}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients found</p>
      )}

      <div style={styles.totalPriceBlock}>
        Total Estimated Price: ${totalPrice.toFixed(2)}
      </div>

      <div style={styles.buttonContainer}>
        <button
          style={styles.returnButton}
          onClick={() => router.push("/food-form")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          ← Return to Search
        </button>
      </div>

      <footer style={styles.footer}>
        © 2025 SmartCart. All rights reserved.
      </footer>
    </div>
  );
}