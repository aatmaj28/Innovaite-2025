"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FoodForm() {
  const [food, setFood] = useState("");
  const [allergyInput, setAllergyInput] = useState(""); // Track current allergy input
  const [allergyTags, setAllergyTags] = useState([]); // Store allergy tags here
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const router = useRouter();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setDietaryRestrictions((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleAllergySubmit = (event) => {
    console.log(dietaryRestrictions)
    if (event.key === 'Enter' && allergyInput.trim()) {



      event.preventDefault(); // Prevent the form from submitting
      setAllergyTags((prevTags) => [...prevTags, allergyInput.trim()]); // Add allergy input to the list of tags
      setAllergyInput(""); // Clear the allergy input field
    }
  };

  const handleTagClick = (tag) => {
    setAllergyTags((prevTags) => prevTags.filter((item) => item !== tag)); // Remove tag from list when clicked
  };

  const handleSubmit = (event) => {


    event.preventDefault();

      //send value to another API fetch_ingredients
      /*
      {
        "recipe_name": "thing"
      }
      */

      const payload = {
        recipe_name: food,  // Replace "thing" with the actual recipe name or variable
        allergies: allergyTags.join(","),
        restrictions: dietaryRestrictions.join(","),
      };
      
      // Send POST request to fetch_ingredients endpoint
      fetch('/fetch_ingredients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the API, e.g., navigating to the results page
          console.log(data);
          const queryParams = new URLSearchParams({
            food,
            // allergies: allergyTags.join(","),
            // restrictions: dietaryRestrictions.join(","),
          }).toString();
          router.push(`/results?${queryParams}`);
        })
        .catch(error => {
          console.error('Error fetching ingredients:', error);
        });

    const queryParams = new URLSearchParams({
      food,
      allergies: allergyTags.join(","),
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
      {/* Display allergy tags above the input field */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {allergyTags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '16px',
              padding: '8px 16px',
              fontSize: '1em',
              cursor: 'pointer', // Add pointer cursor for clickability
              position: 'relative', // Position for the X icon
            }}
            onClick={() => handleTagClick(tag)} // Remove tag when clicked
          >
            {tag}
            {/* X icon */}
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-8px', // Shift X to the right
                backgroundColor: '#fff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '16px',
                color: '#888', // Grey color for the X icon
                cursor: 'pointer',
                fontWeight: 'bold', // Make X more prominent
              }}
            >
              X
            </span>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={allergyInput}
        onChange={(e) => setAllergyInput(e.target.value)}
        onKeyDown={handleAllergySubmit} // Listen for 'Enter' key
        style={inputStyle}
        placeholder="Enter allergy and press Enter"
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
