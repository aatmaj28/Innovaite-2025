from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

def sample_api(request):
    return JsonResponse({"message": "Hello, API!"})

def fetch_ingredients(request):
    return JsonResponse({"message": "Hello, API!"})
# fetch_ingredients
def fetch_price_stores(request):
    return JsonResponse({"message": "Hello, API!"})
# fetch_ingredients