"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FoodForm() {
  const [food, setFood] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [allergyTags, setAllergyTags] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [showIngredients, setShowIngredients] = useState(false); // Manage visibility of ingredients panel
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Selected ingredients
  const [ingredients, setIngredients] = useState([]); // State for ingredients

  const router = useRouter();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setDietaryRestrictions((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleAllergySubmit = (event) => {
    if (event.key === 'Enter' && allergyInput.trim()) {
      event.preventDefault();
      setAllergyTags((prevTags) => [...prevTags, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const handleTagClick = (tag) => {
    setAllergyTags((prevTags) => prevTags.filter((item) => item !== tag));
  };

  const handleSubmit = (event) => {
    const payload = {
      recipe_name: food,
      allergies: allergyTags.join(","),
      restrictions: dietaryRestrictions.join(","),
    };

    //fetch_price_stores -> recipe name. same format as previous output
    fetch('http://localhost:8000/smart-delivery/fetch_ingredients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        // console.log("API Response:", data); // Debugging API response

        // console.log(data.ingredients.map(ingredient => ingredient.item))
        setIngredients(data.ingredients.map(ingredient => ingredient.item)); // Assuming each ingredient is inside the 'item' key


        setShowIngredients(true); // Show ingredients panel after fetching ingredients
      })
      .catch(error => {
        console.error('Error fetching ingredients:', error);
      });

    event.preventDefault();
  };
  const handleSelectionConfirmation = (event) => {
    event.preventDefault();  // Prevent the default form submission behavior if needed
    
    // Prepare the payload by including only selected ingredients
    const selectedIngredientsPayload = selectedIngredients.map(ingredient => ({ ingredient }));
  
    // Define the API endpoint and request body
    const payload = {
      food_name: food,
      selected_ingredients: selectedIngredientsPayload,  // Send only selected ingredients
    };
  
    // Make the API request to fetch price stores
    fetch('http://localhost:8000/smart-delivery/fetch_price_stores/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // console.log('Price stores response:', data);
      // You can handle the response as needed (e.g., redirect to a results page)
      router.push(`/results?food=${food}&ingredients=${selectedIngredients.join(",")}`);
    })
    .catch(error => {
      console.error('Error fetching price stores:', error);
    });
  };

  const handleIngredientChange = (event) => {
    const { value, checked } = event.target;
    setSelectedIngredients((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
        justifyContent: 'center'
      }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '20px' }}>Input your food:</h2>
        <input
          type="text"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', width: '80%', maxWidth: '400px', marginBottom: '20px' }}
          placeholder="Enter food name"
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {allergyTags.map((tag, index) => (
            <span
              key={index}
              style={{ backgroundColor: '#e0e0e0', borderRadius: '16px', padding: '8px 16px', cursor: 'pointer' }}
              onClick={() => handleTagClick(tag)}
            >
              {tag} ✖
            </span>
          ))}
        </div>

        <input
          type="text"
          value={allergyInput}
          onChange={(e) => setAllergyInput(e.target.value)}
          onKeyDown={handleAllergySubmit}
          style={{ padding: '10px', borderRadius: '8px', width: '80%', maxWidth: '400px', marginBottom: '20px' }}
          placeholder="Enter allergy and press Enter"
        />

        <div>
          <label>
            <input type="checkbox" value="Vegetarian" onChange={handleCheckboxChange} /> Vegetarian
          </label>
          <label>
            <input type="checkbox" value="Vegan" onChange={handleCheckboxChange} /> Vegan
          </label>
          <label>
            <input type="checkbox" value="Gluten-Free" onChange={handleCheckboxChange} /> Gluten-Free
          </label>
        </div>

        <button
          onClick={handleSubmit}
          style={{ backgroundColor: '#007bff', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Go!
        </button>
      </div>

      {/* Ingredients Sidebar */}
      {showIngredients && (
        <div style={{
          width: '250px',
          backgroundColor: '#fff',
          padding: '20px',
          boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '1.2em', marginBottom: '10px' }}>Select Ingredients:</h3>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <label key={index} style={{ marginBottom: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  value={ingredient}
                  onChange={handleIngredientChange}
                />
                {ingredient}
              </label>
            ))
          ) : (
            <p>No ingredients found</p>
          )}

          <button
            style={{
              marginTop: '20px',
              backgroundColor: '#28a745',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => 

              
              handleSelectionConfirmation()            
            
            }
          >
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
}
