"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import carbonaraImage from "./carbonara.jpg"; // Local image import
import saladImage from "./greeksalad.jpg"; // Local image import
import avocadoImage from "./avocadotoast.jpg";
import catGif from "./cat.gif";



export default function FoodForm() {
  const router = useRouter();

  // State variables for user input and API responses
  const [food, setFood] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [allergyTags, setAllergyTags] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredients, setIngredients] = useState([]); // List of ingredient names (for checklist)
  const [ingredientsData, setIngredientsData] = useState(null); // Full response data
  const [priceStoresData, setPriceStoresData] = useState(null);
  const [cheapestStoreIngredients, setCheapestStoreIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  


  // Preset dishes to display as clickable boxes
  const presetDishes = [
    {
      name: "Carbonara",
      image: carbonaraImage, // Using the imported image
      ingredients: ["Pasta", "Eggs", "Bacon", "Parmesan"],
    },
    {
      name: "Greek Salad",
      image: saladImage, // Assumes file is in public folder
      ingredients: ["Lettuce", "Tomato", "Feta", "Olives"],
    },
    {
      name: "Avocado Toast",
      image: avocadoImage, // Assumes file is in public folder
      ingredients: ["Bread", "Avocado", "Egg", "Lemon"],
    },
  ];

  // Styles object (inspired by your integrated version)
  const styles = {
    loadingBarContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      backgroundColor: '#f0f0f0',
      zIndex: 9999,
    },
    loadingBar: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #007bff 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loadingAnimation 2s linear infinite',
    },
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#E0EEDE",
      fontFamily: "Inter, sans-serif",
      minHeight: "100vh",
      position: "relative",
    },
    logo: {
      position: "absolute",
      top: "2rem",
      left: "3rem",
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: "#5F6780",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "80%",
      margin: "0 auto",
      padding: "2rem",
      background: "#eef2eb",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      marginTop: "12rem",
      flexGrow: 1,
    },
    heading: {
      fontSize: "1.5em",
      marginBottom: "20px",
      color: "#333",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      width: "80%",
      maxWidth: "400px",
      marginBottom: "20px",
      border: "1px solid #ccc",
    },
    allergyTag: {
      backgroundColor: "#e0e0e0",
      borderRadius: "16px",
      padding: "8px 16px",
      cursor: "pointer",
      marginRight: "5px",
      marginBottom: "10px",
    },
    dietaryCheckboxContainer: {
      marginBottom: "20px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
    },
    presetDishesContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
      marginTop: "2rem",
    },
    loadingOverlayStyle: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10000,
    },
    presetDish: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      padding: "10px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      transition: "transform 0.2s ease",
    },
    presetDishImage: {
      width: "120px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "0.5rem",
    },
    presetDishName: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#2c3e50",
    },
    ingredientsSidebar: {
      width: "250px",
      backgroundColor: "#fff",
      padding: "20px",
      boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      right: 0,
      top: 0,
      height: "100vh",
      overflowY: "auto",
    },
    ingredientsTitle: {
      fontSize: "1.2em",
      marginBottom: "10px",
      fontWeight: "bold",
      color: "#2c3e50",
    },
    ingredientLabel: {
      marginBottom: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "#f8f9fa",
      padding: "8px",
      borderRadius: "6px",
    },
    confirmButton: {
      marginTop: "20px",
      backgroundColor: "#28a745",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease, transform 0.2s",
    },
    footer: {
      width: "100%",
      textAlign: "center",
      padding: "1rem",
      background: "#dfe4ee",
      fontSize: "0.9rem",
      color: "#36405e",
      marginTop: "auto", // This pushes the footer to the bottom
    },
  };

  // --- Event Handlers ---

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setDietaryRestrictions((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleAllergySubmit = (event) => {
    if (event.key === "Enter" && allergyInput.trim()) {
      event.preventDefault();
      setAllergyTags((prevTags) => [...prevTags, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const handleTagClick = (tag) => {
    setAllergyTags((prevTags) => prevTags.filter((item) => item !== tag));
  };

  const handleIngredientChange = (event) => {
    const { value, checked } = event.target;
    const ingredient =
      ingredientsData &&
      ingredientsData.ingredients.find((ing) => ing.item === value);
    setSelectedIngredients((prev) => {
      const updated = checked
        ? [...prev, ingredient]
        : prev.filter((item) => item.item !== value);
      console.log("Selected Ingredients:", updated);
      return updated;
    });
  };

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const payload = {
      recipe_name: food,
      allergies: allergyTags.join(","),
      restrictions: dietaryRestrictions.join(","),
    };

    fetch("http://localhost:8000/smart-delivery/fetch_ingredients/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setIngredients(data.ingredients.map((ingredient) => ingredient.item));
        setIngredientsData(data);
        setShowIngredients(true);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching ingredients:", error);
      });
  };

  const handleSelectionConfirmation = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    console.log("Before delay");

    await new Promise(resolve => setTimeout(resolve, Math.random() * (6000 - 4000) + 4000));

    console.log("After delay");

    if (!ingredientsData) {
        console.error("No ingredients data available.");
        setIsLoading(false);
        return;
    }

    const filteredIngredients = ingredientsData.ingredients.filter(ingredient =>
        selectedIngredients.some(selected => selected.item === ingredient.item)
    );

    const result = {
        recipe_name: ingredientsData.recipe_name,
        ingredients: filteredIngredients,
    };

    console.log("Filtered ingredients:", JSON.stringify(result));

    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

    try {
        const response = await fetch("http://localhost:8000/smart-delivery/fetch_price_stores/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
        });

        const data = await response.json();
        console.log("Response data:", data);

        // Convert data to query parameters
        const query = new URLSearchParams({
            ingredients: JSON.stringify(data.cheapest_store_ingredients),
            store_totals: JSON.stringify(data.store_totals), // Include store_totals
        }).toString();

        setIsLoading(false);
        router.push(`/results?${query}`);
    } catch (error) {
        setIsLoading(false);
        console.error("Error fetching price stores:", error);
    }
};


  
  const handlePresetClick = (dish) => {
    setFood(dish.name);
    const pseudoData = {
      recipe_name: dish.name,
      ingredients: dish.ingredients.map((ing) => ({ item: ing })),
    };
    setIngredientsData(pseudoData);
    setIngredients(dish.ingredients);
    setSelectedIngredients(pseudoData.ingredients);
    setShowIngredients(true);
  };

  return (
    
    
    <div style={styles.pageContainer}>
      {/* Add loading overlay */}
      {isLoading && (
        <div style={styles.loadingOverlayStyle}>
          <Image
            src={catGif}
            alt="Loading..."
            width={450}
            height={450}
            style={{ borderRadius: "8px" }}
          />
        </div>
      )}
      <div style={styles.logo}>SmartCart</div>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Search for a dish:</h2>
        <input
          type="text"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          style={styles.input}
          placeholder="Search for a dish..."
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {allergyTags.map((tag, index) => (
            <span
              key={index}
              style={styles.allergyTag}
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
          style={styles.input}
          placeholder="Enter allergy and press Enter"
        />
        <div style={styles.dietaryCheckboxContainer}>
          <label style={{ marginRight: "10px" }}>
            <input type="checkbox" value="Vegetarian" onChange={handleCheckboxChange} />{" "}
            Vegetarian
          </label>
          <label style={{ marginRight: "10px" }}>
            <input type="checkbox" value="Vegan" onChange={handleCheckboxChange} /> Vegan
          </label>
          <label>
            <input type="checkbox" value="Gluten-Free" onChange={handleCheckboxChange} /> Gluten-Free
          </label>
        </div>
        <button onClick={handleSubmit} style={styles.button}>
          Go!
        </button>
        
        {/* Preset Dishes Section */}
        <div style={styles.presetDishesContainer}>
          {presetDishes.map((dish, index) => (
            <div
              key={index}
              style={styles.presetDish}
              onClick={() => handlePresetClick(dish)}
            >
              {/* Use Next.js Image for better optimization */}
              <Image
                src={dish.image}
                alt={dish.name}
                width={120}
                height={120}
                style={styles.presetDishImage}
              />
              <p style={styles.presetDishName}>{dish.name}</p>
            </div>
          ))}
        </div>
      </div>

      {showIngredients && (
        <div style={styles.ingredientsSidebar}>
          <h3 style={styles.ingredientsTitle}>Select Ingredients:</h3>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <label key={index} style={styles.ingredientLabel}>
                <input
                  type="checkbox"
                  value={ingredient}
                  onChange={handleIngredientChange}
                  checked={selectedIngredients.some(
                    (sel) => sel.item === ingredient
                  )}
                />
                {ingredient}
              </label>
            ))
          ) : (
            <p>No ingredients found</p>
          )}
          <button
            style={styles.confirmButton}
            onClick={handleSelectionConfirmation}
          >
            Go Shopping
          </button>
        </div>
      )}

      <footer style={styles.footer}>
        © 2025 MyFoodApp. All rights reserved.
      </footer>
    </div>
  );
}
