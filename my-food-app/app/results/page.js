"use client";

import { useSearchParams } from "next/navigation";

export default function Results() {
  const data = {
    "carrot": ["0.5lb", "2.0", "Target"],
    "lettuce": ["2pc", "3.0", "Stop&Shop"],
    "apple": ["1lb", "1.5", "Walmart"],
    "banana": ["6pc", "1.2", "Whole Foods"],
    "tomato": ["1lb", "2.5", "Trader Joe's"]
  };

  const appContainerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center everything horizontally
    alignItems: 'flex-start', // Align items to the top
    height: '100vh',
    backgroundColor: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
    flexDirection: 'column', // Stack the items vertically
    paddingTop: '20px', // Add some space at the top
  };

  const titleStyle = {
    fontSize: '2.5em',
    marginBottom: '20px',
    color: '#333',
    width: '100%', // Ensure it spans the full width
    textAlign: 'center', // Center the text
  };

  const groceryListStyle = {
    listStyleType: 'none',
    padding: '0',
    width: '80%', // Adjust width to make the list not too wide
    margin: '0 auto', // Center the list horizontally
  };

  const groceryItemStyle = {
    backgroundColor: '#fff',
    margin: '10px 0',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    display: 'flex', // Make the items horizontal
    justifyContent: 'space-between', // Space out the content horizontally
    alignItems: 'center',
    paddingRight: '20px', // Add padding to the right for spacing
  };

  const groceryItemHoverStyle = {
    transform: 'translateY(-5px)',
  };

  const itemNameStyle = {
    fontWeight: 'bold',
    fontSize: '1.5em', // Slightly larger font for item names
    color: '#2c3e50',
    flex: '1', // Allow the name to take up available space
  };

  const itemDetailsStyle = {
    marginTop: '10px',
    fontSize: '1em',
    color: '#7f8c8d',
    display: 'flex', // Display details in a row
    flexDirection: 'row', // Align them horizontally
    justifyContent: 'space-between', // Distribute space between details
    width: '50%', // Limit width of details to make it more compact
  };

  const detailLabelStyle = {
    fontWeight: 'bold',
    color: '#2c3e50',
  };

  return (
    <div style={appContainerStyle}>
      <h1 style={titleStyle}>Grocery List</h1>
      <ul style={groceryListStyle}>
        {Object.entries(data).map(([item, details]) => (
          <li
            style={groceryItemStyle}
            key={item}
            onMouseEnter={(e) => (e.target.style.transform = 'translateY(-5px)')}
            onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            <div style={itemNameStyle}>
              {item.charAt(0).toUpperCase() + item.slice(1)}:
            </div>
            <div style={itemDetailsStyle}>
              <span><span style={detailLabelStyle}>Quantity:</span> {details[0]}</span>
              <span><span style={detailLabelStyle}>Price:</span> ${details[1]}</span>
              <span><span style={detailLabelStyle}>Store:</span> {details[2]}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
