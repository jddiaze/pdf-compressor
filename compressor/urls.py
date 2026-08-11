from django.urls import path
from . import views

app_name = "compressor"

urlpatterns = [
    path("", views.home, name="home"),
    path("health/", views.health, name="health"),
    path("compress/", views.compress, name="compress"),
]
