"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ingredientsData, setIngredientsData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [storeTotals, setStoreTotals] = useState({});

  useEffect(() => {
    try {
      const ingredientsParam = searchParams.get("ingredients");
      const storeTotalsParam = searchParams.get("store_totals");

      if (ingredientsParam) {
        const ingredients = JSON.parse(ingredientsParam || "[]");
        setIngredientsData(ingredients);
      }

      if (storeTotalsParam) {
        const parsedStoreTotals = JSON.parse(storeTotalsParam || "{}");
        setStoreTotals(parsedStoreTotals);
      }
    } catch (error) {
      console.error("Error parsing query params:", error);
    }
  }, [searchParams]);

  // Styles
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

    // ---------- NEW: Table for store totals
    storeTableContainer: {
      width: "80%",
      margin: "0 auto 2rem",
      backgroundColor: "#eef2eb",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      padding: "1.5rem",
      textAlign: "center",
    },
    storeTableTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "1rem",
      color: "#2c3e50",
    },
    storeTable: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
    },
    storeTableHeaderCell: {
      fontWeight: "bold",
      fontSize: "1rem",
      borderBottom: "2px solid #ccc",
      padding: "0.75rem",
      color: "#2c3e50",
    },
    storeTableCell: {
      padding: "0.75rem",
      borderBottom: "1px solid #ccc",
      color: "#2c3e50",
    },
    // ---------- END: Table for store totals

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
    darkText: {
      fontWeight: "bold",
      color: "#1a1a1a", // Darker color for Price and Store
    },
  };

  // Compute total price for all ingredients
  const totalPrice = ingredientsData.reduce(
    (sum, ingredient) => sum + parseFloat(ingredient.Price || 0),
    0
  );

  // Convert storeTotals object into arrays
  const storeNames = Object.keys(storeTotals); // e.g. ["Walmart", "Trader Joe's", ...]
  // storeTotals = { "Walmart": 10.5, "Trader Joe's": 8.0 }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.logo}>SmartCart</div>
      
      <h1 style={styles.title}>Your Grocery List</h1>

      {/* ---------- 1) Store Totals Table ---------- */}
      {storeNames.length > 0 && (
        <div style={styles.storeTableContainer}>
          <div style={styles.storeTableTitle}>Compare Store Prices</div>
          <table style={styles.storeTable}>
            <thead>
              <tr>
                {storeNames.map((store, idx) => (
                  <th key={idx} style={styles.storeTableHeaderCell}>
                    {store}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {storeNames.map((store, idx) => (
                  <td key={idx} style={styles.storeTableCell}>
                    ${parseFloat(storeTotals[store]).toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* ---------- END Table ---------- */}

      {/* ---------- 2) Ingredient List ---------- */}
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
                <span>
                  Price: <strong style={styles.darkText}>${parseFloat(ingredient.Price).toFixed(2)}</strong>
                </span>
                <span>Store: <strong style={styles.darkText}>{ingredient.Store}</strong></span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients found</p>
      )}

      {/* ---------- 3) Total Price Block ---------- */}
      <div style={styles.totalPriceBlock}>
        Total Estimated Price: ${totalPrice.toFixed(2)}
      </div>

      {/* ---------- 4) Return Button ---------- */}
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

      {/* ---------- 5) Footer ---------- */}
      <footer style={styles.footer}>
        © 2025 SmartCart. All rights reserved.
      </footer>
    </div>
  );
}