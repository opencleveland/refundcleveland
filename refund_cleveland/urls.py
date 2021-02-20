"""refund_cleveland URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from peoples_budget import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('change-the-budget/', views.change_budget, name='change_budget'),
    path('submit/', views.submit_budget, name='submit_budget'),
    path('store-data/', views.store_data, name='store_data'),
    path('<budget_id>/view/', views.view_budget, name='view_budget'),
    path('lookup_address', views.lookup_address, name='lookup_address'),
    path('privacy-policy', views.privacy_policy, name='privacy_policy')
]
