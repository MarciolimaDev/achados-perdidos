from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customiza o retorno do login para incluir dados do usuário além do token.
    """
    #traduções de mensagens
    default_error_messages = {
        'no_active_account': 'Nenhuma conta ativa encontrada com as credenciais informadas.'
    }


    def validate(self, attrs):
        
        # Gera o token padrão (access e refresh)
        data = super().validate(attrs)

        # Adiciona dados extras na resposta do JSON (como o email do usuário)
        data['email'] = self.user.email
        data['name'] = self.user.first_name
        data['is_staff'] = self.user.is_staff

        return data