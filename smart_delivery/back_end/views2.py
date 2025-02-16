from django.http import JsonResponse
from rest_framework.decorators import api_view
import torch
from torch import nn
from transformers import AutoTokenizer, AutoModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import os

class CategoryAwareTransformerMatcher:
    def __init__(self, model_name="bert-base-uncased"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name).to(self.device)
        self.similarity_threshold = 0.85
        self.cosine_threshold = 0.4
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
        self.categories = {
            "produce": [
                "apple", "orange", "banana", "berry", "grape", "tomato", 
                "lettuce", "spinach", "kale", "carrot", "fruit", "vegetable",
                "produce", "fresh"
            ],
            "meat_seafood": [
                "chicken", "pork", "bacon", "ham", "beef", "turkey", "fish",
                "salmon", "shrimp", "meat", "poultry", "seafood"
            ],
            "dairy_eggs": [
                "milk", "cream", "butter", "egg", "cheese", "yogurt",
                "dairy", "cottage", "mozzarella cheese", "cheddar cheese", "greek"
            ],
            "bakery": [
                "bread", "bun", "tortilla", "pita", "croissant", "muffin",
                "donut", "roll", "bagel", "bakery", "baked", "loaf"
            ],
            "pantry": [
                "rice", "pasta", "flour", "sugar", "baking", "salt", "pepper",
                "oil", "vinegar", "sauce", "spice", "seasoning", "dried",
                "canned", "pantry"
            ],
            "snacks": [
                "chip", "nut", "almond", "peanut", "cashew", "trail mix",
                "snack", "cracker", "popcorn", "pretzel"
            ],
            "beverages": [
                "water", "soda", "juice", "coffee", "tea", "drink",
                "beverage", "smoothie"
            ],
            "frozen": [
                "frozen", "ice cream", "pizza", "freezer"
            ],
            "condiments": [
                "sauce", "dressing", "mayonnaise", "mustard", "ketchup",
                "condiment", "spread", "jam", "jelly"
            ]
        }
        
        self.unit_variations = {
            "pound": ["lb", "lbs", "pound", "pounds"],
            "ounce": ["oz", "ounce", "ounces"],
            "gallon": ["gal", "gallon", "gallons"],
            "quart": ["qt", "quart", "quarts"],
            "pint": ["pt", "pint", "pints"],
            "count": ["ct", "count", "piece", "pieces"],
            "bunch": ["bunch", "bunches"],
            "head": ["head", "heads"]
        }

    def calculate_cosine_similarity(self, text1, text2):
        try:
            tfidf_matrix = self.vectorizer.fit_transform([text1, text2])
            return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        except:
            return 0.0

    def find_matches(self, ingredient, store_data):
        matches = []
        ingredient_emb = self.encode_text(ingredient)
        ingredient_category = self.get_category(ingredient)
        
        for store_name, store_items in store_data.items():
            for item in store_items:
                item_name = item["Item Name"]
                
                if self.get_category(item_name) != ingredient_category:
                    continue
                
                has_exact_match = self.check_exact_match(ingredient, item_name)
                
                if has_exact_match:
                    bert_similarity = 1.0
                else:
                    item_emb = self.encode_text(item_name)
                    bert_similarity = torch.mm(ingredient_emb, item_emb.transpose(0, 1)).item()
                
                if bert_similarity > self.similarity_threshold:
                    cosine_sim = self.calculate_cosine_similarity(ingredient, item_name)
                    
                    if cosine_sim >= self.cosine_threshold:
                        matches.append({
                            "Store": store_name,
                            "Store Item": item_name,
                            "Price": item["Item Price ($)"],
                            "Quantity": item["Quantity"],
                            "BERT_Similarity": float(bert_similarity),  # Convert to float for JSON serialization
                            "Cosine_Similarity": float(cosine_sim),
                            "Combined_Similarity": float((bert_similarity + cosine_sim) / 2)
                        })
        
        matches.sort(key=lambda x: (-x["Combined_Similarity"], x["Price"]))
        return matches

    def normalize_unit(self, quantity_str):
        quantity_lower = quantity_str.lower()
        for standard, variations in self.unit_variations.items():
            for variant in variations:
                if variant in quantity_lower:
                    return standard
        return quantity_str
    
    def get_category(self, item_name):
        item_lower = item_name.lower()
        
        matched_categories = []
        for category, keywords in self.categories.items():
            if any(keyword in item_lower for keyword in keywords):
                matched_categories.append(category)
        
        if len(matched_categories) > 1:
            priority_order = ["meat_seafood", "dairy_eggs", "produce", "bakery", 
                            "snacks", "pantry", "beverages", "frozen", "condiments"]
            for category in priority_order:
                if category in matched_categories:
                    return category
        
        return matched_categories[0] if matched_categories else "other"
    
    def encode_text(self, text):
        inputs = self.tokenizer(
            text,
            padding=True,
            truncation=True,
            max_length=32,
            return_tensors="pt"
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = torch.mean(outputs.last_hidden_state, dim=1)
            embeddings = torch.nn.functional.normalize(embeddings, p=2, dim=1)
        
        return embeddings

    def check_exact_match(self, text1, text2):
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        return bool(words1 & words2)

def analyze_recipe(ingredients_data, store_data, matcher):
    all_results = []
    best_options = []
    store_totals = {store: 0 for store in store_data.keys()}
    store_items = {store: [] for store in store_data.keys()}
    
    # Add a dictionary to track items and prices for each store
    store_item_details = {store: [] for store in store_data.keys()}
    
    for ingredient in ingredients_data["ingredients"]:
        ingredient_name = ingredient["item"]
        matches = matcher.find_matches(ingredient_name, store_data)
        
        if matches:
            all_results.append({
                "Recipe Ingredient": ingredient_name,
                "Matches": matches
            })
            
            best_match = matches[0]
            best_options.append({
                "Recipe Ingredient": ingredient_name,
                "Store": best_match["Store"],
                "Store Item": best_match["Store Item"],
                "Price": best_match["Price"],
                "Quantity": best_match["Quantity"],
                "Combined_Similarity": best_match["Combined_Similarity"]
            })
            
            for store in store_data.keys():
                store_matches = [m for m in matches if m["Store"] == store]
                if store_matches:
                    if ingredient_name not in store_items[store]:
                        store_totals[store] += store_matches[0]["Price"]
                        store_items[store].append(ingredient_name)
                        # Add item details to store_item_details
                        store_item_details[store].append({
                            "ingredient": ingredient_name,
                            "store_item": store_matches[0]["Store Item"],
                            "price": store_matches[0]["Price"],
                            "quantity": store_matches[0]["Quantity"]
                        })
    
    return all_results, best_options, store_totals, store_items, store_item_details

# Initialize the matcher as a global variable to avoid reinitializing for each request
global_matcher = CategoryAwareTransformerMatcher()

@api_view(["POST"])
def fetch_price_stores(request):
    """API endpoint to fetch ingredient prices from stores using transformer-based matching"""
    try:
        recipe_data = request.data
    except Exception as e:
        return JsonResponse({"error": "Invalid request data format"}, status=400)
    
    # Load store data (You should replace this with your database query)
    store_file = os.path.join(os.path.dirname(__file__), "shopping.json")
    try:
        with open(store_file, 'r') as f:
            store_data = json.load(f)
    except FileNotFoundError:
        return JsonResponse({"error": "Store data not found"}, status=500)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid store data format"}, status=500)
    
    # Analyze ingredients using the global matcher
    all_results, best_options, store_totals, store_items, store_item_details = analyze_recipe(recipe_data, store_data, global_matcher)
    
    # Round all price values
    store_totals = {store: round(total, 2) for store, total in store_totals.items()}
    
    # Format all price values in store_item_details to 2 decimal places
    for store in store_item_details:
        for item in store_item_details[store]:
            item['price'] = round(item['price'], 2)
    
    # Find the cheapest store with the most items
    valid_stores = {store: total for store, total in store_totals.items() if total > 0}
    if valid_stores:
        cheapest_store = min(valid_stores.items(), key=lambda x: x[1])
        items_found = len(store_items[cheapest_store[0]])
        total_items = len(recipe_data["ingredients"])
        cheapest_store_items = store_item_details[cheapest_store[0]]
    else:
        cheapest_store = None
        items_found = 0
        total_items = len(recipe_data["ingredients"])
        cheapest_store_items = []
    
    response_data = {
        "all_options": all_results,
        "best_options": best_options,
        "store_totals": store_totals,
        "cheapest_store": {
            "name": cheapest_store[0] if cheapest_store else None,
            "total_price": round(cheapest_store[1], 2) if cheapest_store else 0,
            "items_found": items_found,
            "total_items": total_items,
            "items": cheapest_store_items  # Add the detailed items list for the cheapest store
        }
    }
    
    return JsonResponse(response_data)