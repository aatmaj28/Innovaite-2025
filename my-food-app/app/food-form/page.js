"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FoodForm() {
  const [food, setFood] = useState("");
  const [allergies, setAllergies] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const router = useRouter();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setDietaryRestrictions((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams({
      food,
      allergies,
      restrictions: dietaryRestrictions.join(","),
    }).toString();
    router.push(`/results?${queryParams}`);
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    justifyContent: 'center', // Center vertically
  };

  const inputStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    width: '80%', // Make input fields responsive
    maxWidth: '400px', // Limit max width for input fields
  };

  const textareaStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '20px',
    width: '80%',
    maxWidth: '400px',
    minHeight: '100px',
  };

  const checkboxContainerStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    marginRight: '15px',
    fontSize: '1em',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={formContainerStyle}>
      <div
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          marginBottom: '20px',
        }}
      >
        Mascot
      </div>
      <h2 style={{ fontSize: '1.5em', marginBottom: '20px' }}>Input your food:</h2>
      <input
        type="text"
        value={food}
        onChange={(e) => setFood(e.target.value)}
        style={inputStyle}
        placeholder="Enter food name"
      />
      <textarea
        value={allergies}
        onChange={(e) => setAllergies(e.target.value)}
        style={textareaStyle}
        placeholder="Insert allergies"
      />
      <div style={checkboxContainerStyle}>
        <label style={labelStyle}>
          <input
            type="checkbox"
            value="Vegetarian"
            onChange={handleCheckboxChange}
          />
          Vegetarian
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            value="Vegan"
            onChange={handleCheckboxChange}
          />
          Vegan
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            value="Gluten-Free"
            onChange={handleCheckboxChange}
          />
          Gluten-Free
        </label>
      </div>
      <button
        onClick={handleSubmit}
        style={buttonStyle}
        onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
      >
        Go!
      </button>
    </div>
  );
}
