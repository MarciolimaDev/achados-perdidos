from django.urls import path
from .views import CustomTokenObtainPairView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Rota de Login (recebe email/senha -> retorna tokens + dados user)
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Rota para renovar o token (quando o login expira)
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rota de Logout
    path('logout/', LogoutView.as_view(), name='logout'),
]