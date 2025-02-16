from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import json
import google.generativeai as genai  # Correct import
from difflib import SequenceMatcher
from .similarity import load_json_file,calculate_similarity,find_matches,analyze_recipe_ingredients,calculate_store_totals
def sample_api(request):
    return JsonResponse({"message": "Hello, API!"})

@api_view(["POST"])
def fetch_ingredients(request):
    recipe_name = request.data.get("recipe_name")  
    print("Recipe Name:", recipe_name)
    
    if not recipe_name:
        return Response({"error": "Recipe name is required"}, status=400)
    
    api_key = os.getenv("GOOGLE_API_KEY")
    api_key = "AIzaSyCn81NFyqRBDT-8qR0kyOSbsTwoFS8dZCw"  # Replace with secure storage in production
    if not api_key:
        return Response({"error": "GOOGLE_API_KEY not found"}, status=500)

    # Configure Google Generative AI
    genai.configure(api_key=api_key)

    prompt = f"""
    Generate a list of ingredients needed to make {recipe_name}.
    I want to make a shopping list.
    Ensure the response follows this structure:
    {{
        "recipe_name": "{recipe_name}",
        "ingredients": [
            {{
                "item": "ingredient name",
                "amount": "numeric value",
                "unit": "measurement unit"
            }}
        ]
    }}

    Rules:
    - Do NOT return values like "to taste", "as needed", "pinch". Always provide a numeric quantity.
    - Convert fractions (e.g., 1/4) into decimal format.
    - Use standard measurement units (e.g., grams, cups, tablespoons).
    - If an ingredient is optional, include a field: "optional": true.
    - Do not include any extra text, only return JSON.
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    # Extract AI response
    if not response or not response.candidates:
        return Response({"error": "Failed to generate ingredients"}, status=500)

    raw_text = response.candidates[0].content.parts[0].text  
    print("Raw Response:", raw_text)  

    # Remove unwanted formatting
    if raw_text.startswith("```json"):
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        # Convert AI response to JSON
        ingredients_data = json.loads(raw_text)

        # Validate & clean response
        for ingredient in ingredients_data["ingredients"]:
            amount = ingredient["amount"]

            # Convert fractions to decimal values
            if isinstance(amount, str) and "/" in amount:
                try:
                    ingredient["amount"] = str(eval(amount))  # Convert fraction to decimal
                except Exception as e:
                    print(f"Error converting fraction {amount}: {e}")
                    ingredient["amount"] = "1"  # Default to 1 if conversion fails

            # Ensure amount is a string for consistency
            ingredient["amount"] = str(ingredient["amount"])

            # Replace vague measurements
            if ingredient["amount"] in ["to taste", "as needed", "pinch"]:
                ingredient["amount"] = "1"

            # Ensure unit is always present
            ingredient["unit"] = ingredient.get("unit", "teaspoon")  # Default to teaspoon

        return Response(ingredients_data)

    except json.JSONDecodeError:
        return Response({"error": "Invalid response format from AI"}, status=500)


@api_view(["POST"])
def fetch_price_stores(request):
    """API to fetch ingredient prices from stores"""
    
    # Load recipe data from request body
    try:
        recipe_data = request.data
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=400)

    # Load store data (You can replace this with a database call)
    store_file = os.path.join(os.path.dirname(__file__), "shopping.json")
    try:
        store_data = load_json_file(store_file)
    except FileNotFoundError:
        return JsonResponse({"error": "Store data not found"}, status=500)

    # Analyze ingredients
    all_results, best_options = analyze_recipe_ingredients(recipe_data, store_data)
    
    # Calculate total cost per store
    store_totals, store_items = calculate_store_totals(all_results)

    # Find the cheapest store
    cheapest_store = min(store_totals.items(), key=lambda x: x[1]) if store_totals else None

    # Gather all ingredients & prices specifically for the cheapest store
    cheapest_store_ingredients = []
    if cheapest_store:
        cheapest_store_name = cheapest_store[0]
        # Loop through each ingredient's match list to find matches for the cheapest store
        for result in all_results:
            # Each `result` has {"Recipe Ingredient": ..., "Matches": [...]}
            matches_for_that_store = [
                m for m in result["Matches"]
                if m["Store"] == cheapest_store_name
            ]
            # If there's at least one match for this ingredient in the cheapest store
            if matches_for_that_store:
                # The matches are already sorted by price ascending in `find_matches`
                # so the first match is the cheapest for that store. 
                # You could keep them all if you want, but typically you’d pick the first.
                best_match = matches_for_that_store[0]
                cheapest_store_ingredients.append({
                    "Recipe Ingredient": result["Recipe Ingredient"],
                    "Store": best_match["Store"],
                    "Store Item": best_match["Store Item"],
                    "Price": best_match["Price"],
                    "Quantity": best_match["Quantity"],
                })

    response_data = {
        "all_options": all_results,
        "best_options": best_options,
        "store_totals": store_totals,
        "cheapest_store": (
            {
                "name": cheapest_store[0],
                "total_price": cheapest_store[1],
            }
            if cheapest_store
            else "No matches found"
        ),
        # NEW key containing all cheapest store items
        "cheapest_store_ingredients": cheapest_store_ingredients,
    }

    # response_data = {
    #     "all_options": all_results,
    #     "best_options": best_options,
    #     "store_totals": store_totals,
    #     "cheapest_store": {
    #         "name": cheapest_store[0],
    #         "total_price": cheapest_store[1]
    #     } if cheapest_store else "No matches found"
    # }

    return JsonResponse(response_data, safe=False)