from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # chama o handle padrão do DRF primeiro para obter a resposta padrão
    response = exception_handler(exc, context)

    # Se houver uma resposta (ou seja, um erro conhecido pelo DRF)
    if response is not None:

        #Dicionario de tradução (De: Inglês -> Para: Português)
        # Voce pode adicionar quantas frases quiser aqui
        traducoes = {
            "Token is invalid or expired": "O token de acesso é inválido ou expirou. Faça login novamente.",
            "Authentication credentials were not provided.": "Credenciais de autenticação não foram fornecidas.",
            "Given token not valid for any token type": "O token fornecido não é válido.",
            "No active account found with the given credentials": "Nenhuma conta ativa encontrada com esses dados.",
            "User is inactive": "Este usuário está inativo.",
        }

        # Verifica se o erro vem no campo 'detail' (padrão do SimpleJWT)
        if 'detail' in response.data:
            mensagem_original = str(response.data['detail'])
            
            # Se a mensagem estiver no nosso dicionário, substitui
            if mensagem_original in traducoes:
                response.data['detail'] = traducoes[mensagem_original]
        
        # Verifica erros de validação comuns (ex: campo faltando)
        # O DRF às vezes retorna listas ou dicionários, então é bom manter genérico
        # Mas o 'detail' cobre 90% dos erros do JWT.

        return response