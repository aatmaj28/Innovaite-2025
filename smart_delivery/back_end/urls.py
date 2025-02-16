from django.urls import path
from .views import *
from .views2 import *

urlpatterns = [
    path('sample/', sample_api),
    path('fetch_ingredients/', fetch_ingredients),
    path('fetch_price_stores/', fetch_price_stores),
    path('fetch_price_stores_llm/', fetch_price_stores_llm),

    
]
                                                                                                                                                                                                                                                                                                                                                                            