from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, CategorieViewSet

router = DefaultRouter()
router.register(r'itens', ItemViewSet)
router.register(r'categories', CategorieViewSet)

urlpatterns = router.urls
