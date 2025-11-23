from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Endpoint de login que usa nosso serializer customizado.
    """
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(APIView):
    """
    Endpoint de logout.
    Requer autenticação e retorna sucesso.
    O frontend deve remover o token do armazenamento local após receber esta resposta.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Processa o logout do usuário.
        Em uma implementação futura com blacklist, aqui adicionaríamos o token à blacklist.
        """
        return Response(
            {'message': 'Logout realizado com sucesso.'},
            status=status.HTTP_200_OK
        )