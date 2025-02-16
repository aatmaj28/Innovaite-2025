"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Results() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const data = {
    carrot: ["0.5lb", "2.0", "Target"],
    lettuce: ["2pc", "3.0", "Stop&Shop"],
    apple: ["1lb", "1.5", "Walmart"],
    banana: ["6pc", "1.2", "Whole Foods"],
    tomato: ["1lb", "2.5", "Trader Joe's"],
  };//fetch

  const totalPrice = Object.values(data).reduce(
    (sum, details) => sum + parseFloat(details[1]),
    0
  );

  const appContainerStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    fontFamily: "Arial, sans-serif",
    alignItems: "center",
    paddingTop: "20px",
  };

  const titleStyle = {
    fontSize: "2.5em",
    marginBottom: "40px",
    color: "#333",
    textAlign: "center",
  };

  const groceryListStyle = {
    listStyleType: "none",
    padding: "0",
    width: "80%",
    margin: "0 auto",
    flexGrow: 1, // Allows the list to push footer down
  };

  const groceryItemStyle = {
    backgroundColor: "#fff",
    margin: "10px 0",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: "20px",
    transition: "transform 0.3s ease",
  };

  const itemNameStyle = {
    fontWeight: "bold",
    fontSize: "1.5em",
    color: "#2c3e50",
    flex: 1,
  };

  const itemDetailsStyle = {
    fontSize: "1em",
    color: "#7f8c8d",
    display: "flex",
    justifyContent: "space-between",
    width: "50%",
  };

  const detailLabelStyle = {
    fontWeight: "bold",
    color: "#2c3e50",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    paddingLeft: "145px",
    paddingBottom: "20px", // Adds space above the footer
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: isHovered ? "#ccc" : "#ddd",
    color: "#333",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.3s ease",
  };

  const footerStyle = {
    width: "100%",
    backgroundColor: "#3498db",
    color: "#fff",
    textAlign: "left",
    padding: "20px",
    fontSize: "1.2em",
    marginTop: "auto", // Ensures footer is always at the bottom
  };

  return (
    <div style={appContainerStyle}>
      <h1 style={titleStyle}>Grocery List</h1>
      <ul style={groceryListStyle}>
        {Object.entries(data).map(([item, details]) => (
          <li
            style={groceryItemStyle}
            key={item}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div style={itemNameStyle}>{item.charAt(0).toUpperCase() + item.slice(1)}:</div>
            <div style={itemDetailsStyle}>
              <span>
                <span style={detailLabelStyle}>Quantity:</span> {details[0]}
              </span>
              <span>
                <span style={detailLabelStyle}>Price:</span> ${details[1]}
              </span>
              <span>
                <span style={detailLabelStyle}>Store:</span> {details[2]}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div style={buttonContainerStyle}>
        <button
          style={buttonStyle}
          onClick={() => router.push("/food-form")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span>←</span> Return
        </button>
      </div>

      <div style={footerStyle}>Total Price: ${totalPrice.toFixed(2)}</div>
    </div>
  );
}
