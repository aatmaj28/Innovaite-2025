from google import genai
import json
import os

def generate_recipe_ingredients(recipe_name: str):
    """Generate ingredients list for a recipe using Gemini API"""
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
    client = genai.Client(api_key=api_key)
    
    prompt = f"""Generate a list of ingredients needed to make {recipe_name}.
    Please format the response as a JSON object with the following structure:
    {{
        "recipe_name": "name of the dish",
        "ingredients": [
            {{
                "item": "ingredient name",
                "amount": "quantity",
                "unit": "measurement unit"
            }}
        ]
    }}
    Only return the JSON object, no additional text."""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt])
    
    return response.text

def main():
    recipe_name = input("What would you like to make? ")
    result = generate_recipe_ingredients(recipe_name)
    print(result)

# if __name__ == "__main__":
#     main()
