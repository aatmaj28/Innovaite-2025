from django.urls import path
from .views import *

urlpatterns = [
    path('sample/', sample_api),
    path('fetch_ingredients/', fetch_ingredients),
    path('fetch_price_stores/', fetch_price_stores),
    
]
                                                                                                                                                                                                                                                                                                                                                                            