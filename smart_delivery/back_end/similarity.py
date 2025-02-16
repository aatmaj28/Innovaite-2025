# import json
# from difflib import SequenceMatcher
# import pandas as pd

# def load_json_file(filename):
#     """Load and parse a JSON file"""
#     with open(filename, 'r') as file:
#         return json.load(file)

# def calculate_similarity(a, b):
#     """Calculate string similarity between two strings"""
#     return SequenceMatcher(None, a.lower(), b.lower()).ratio()

# def find_matches(ingredient, store_data):
#     """Find all matching store items for a recipe ingredient"""
#     matches = []
    
#     for store_name, store_items in store_data.items():
#         for item in store_items:
#             similarity = calculate_similarity(ingredient, item["Item Name"])
#             if similarity > 0.8:  # Threshold of 0.8
#                 matches.append({
#                     "Store": store_name,
#                     "Store Item": item["Item Name"],
#                     "Price": item["Item Price ($)"],
#                     "Quantity": item["Quantity"],
#                     "Similarity": similarity
#                 })
    
#     # Sort matches by price
#     matches.sort(key=lambda x: x["Price"])
#     return matches

# def analyze_recipe_ingredients(recipe_data, store_data):
#     """Analyze all options for recipe ingredients across stores"""
#     all_results = []
#     best_options = []
    
#     # Process each recipe ingredient
#     for ingredient in recipe_data["ingredients"]:
#         ingredient_name = ingredient["item"]
#         matches = find_matches(ingredient_name, store_data)
        
#         if matches:
#             # Store all matches for this ingredient
#             all_results.append({
#                 "Recipe Ingredient": ingredient_name,
#                 "Matches": matches
#             })
            
#             # Store the best (cheapest) match
#             best_options.append({
#                 "Recipe Ingredient": ingredient_name,
#                 "Store": matches[0]["Store"],
#                 "Store Item": matches[0]["Store Item"],
#                 "Price": matches[0]["Price"],
#                 "Quantity": matches[0]["Quantity"]
#             })
    
#     return all_results, best_options

# def display_results(all_results, best_options):
#     """Display all results in a formatted way"""
#     print("\n=== All Available Options ===")
#     for result in all_results:
#         print(f"\nIngredient: {result['Recipe Ingredient']}")
#         matches_df = pd.DataFrame(result['Matches'])
#         matches_df = matches_df.drop('Similarity', axis=1)
#         print(matches_df.to_string(index=False))
#         print("-" * 80)
    
#     print("\n=== Best (Cheapest) Options ===")
#     best_df = pd.DataFrame(best_options)
#     print(best_df.to_string(index=False))
    
#     # Calculate total cost per store using best options
#     total_by_store = best_df.groupby('Store')['Price'].sum()
#     print("\nTotal cost by store (using cheapest options):")
#     print(total_by_store)
    
#     # Find the overall cheapest store
#     cheapest_store = total_by_store.idxmin()
#     print(f"\nCheapest store overall: {cheapest_store}")
#     print(f"Total cost at {cheapest_store}: ${total_by_store[cheapest_store]:.2f}")

# # Main execution
# if __name__ == "__main__":
#     # Load the data
#     recipe_data = load_json_file("ingredients.json")
#     store_data = load_json_file("shopping.json")
    
#     # Analyze ingredients
#     all_results, best_options = analyze_recipe_ingredients(recipe_data, store_data)
    
#     # Display results
#     display_results(all_results, best_options)



import json
from difflib import SequenceMatcher
import pandas as pd
def load_json_file(filename):
    """Load and parse a JSON file"""
    with open(filename, 'r') as file:
        return json.load(file)

def calculate_similarity(a, b):
    """Calculate string similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def find_matches(ingredient, store_data):
    """Find all matching store items for a recipe ingredient"""
    matches = []
    
    for store_name, store_items in store_data.items():
        for item in store_items:
            similarity = calculate_similarity(ingredient, item["Item Name"])
            if similarity > 0.5:  # Threshold of 0.8
                matches.append({
                    "Store": store_name,
                    "Store Item": item["Item Name"],
                    "Price": item["Item Price ($)"],
                    "Quantity": item["Quantity"],
                    "Similarity": similarity
                })
            else:
                print(ingredient,"not found")
    
    # Sort matches by price
    matches.sort(key=lambda x: x["Price"])
    return matches

def analyze_recipe_ingredients(recipe_data, store_data):
    """Analyze all options for recipe ingredients across stores"""
    all_results = []
    best_options = []
    
    # Process each recipe ingredient
    for ingredient in recipe_data["ingredients"]:
        print("ingredient",ingredient)
        ingredient_name = ingredient["item"]
        matches = find_matches(ingredient_name, store_data)
        
        if matches:
            # Store all matches for this ingredient
            all_results.append({
                "Recipe Ingredient": ingredient_name,
                "Matches": matches
            })
            
            # Store the best (cheapest) match
            best_options.append({
                "Recipe Ingredient": ingredient_name,
                "Store": matches[0]["Store"],
                "Store Item": matches[0]["Store Item"],
                "Price": matches[0]["Price"],
                "Quantity": matches[0]["Quantity"]
            })
    
    return all_results, best_options

def calculate_store_totals(all_results):
    """Calculate total basket value for each store"""
    store_totals = {}
    store_items = {}
    
    for result in all_results:
        ingredient = result["Recipe Ingredient"]
        for match in result["Matches"]:
            store = match["Store"]
            price = match["Price"]
            
            if store not in store_totals:
                store_totals[store] = 0
                store_items[store] = []
            
            # Only add the price if we haven't counted this ingredient for this store yet
            if ingredient not in store_items[store]:
                store_totals[store] += price
                store_items[store].append(ingredient)
    
    return store_totals, store_items


