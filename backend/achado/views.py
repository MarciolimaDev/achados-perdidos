from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from .models import Item, Categorie
from .serializers import ItemSerializer, CategorieSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('-created_at')
    serializer_class = ItemSerializer
    filter_backends = [SearchFilter]
    search_fields = ['codigo_do_item', 'titulo', 'descricao']

    def get_queryset(self):
        """
        Permite filtrar por código exato usando ?codigo=XXXXX
        e também mantém a busca geral com ?search=XXXXX
        """
        queryset = super().get_queryset()
        
        # Filtro exato por código do item
        codigo = self.request.query_params.get('codigo', None)
        if codigo:
            queryset = queryset.filter(codigo_do_item=codigo)
        
        return queryset

    @action(detail=False, methods=['patch'], url_path='atualizar-status')
    def atualizar_status(self, request):
        """
        Atualiza o status de um item pelo código.
        Endpoint: PATCH /api/itens/itens/atualizar-status/?codigo=XXXXX
        Body: {"status": "RESGATADO"} ou {"status": "DISPONIVEL"}
        """
        codigo = request.query_params.get('codigo', None)
        if not codigo:
            return Response(
                {'erro': 'O parâmetro "codigo" é obrigatório.'},
                status=400
            )
        
        try:
            item = Item.objects.get(codigo_do_item=codigo)
        except Item.DoesNotExist:
            return Response(
                {'erro': f'Item com código "{codigo}" não encontrado.'},
                status=404
            )
        
        # Atualiza apenas o status
        novo_status = request.data.get('status')
        if novo_status not in dict(Item.STATUS_CHOICES).keys():
            return Response(
                {'erro': f'Status inválido. Use: {", ".join(dict(Item.STATUS_CHOICES).keys())}'},
                status=400
            )
        
        item.status = novo_status
        item.save()
        
        serializer = self.get_serializer(item)
        return Response(serializer.data)

    # Dica para o futuro: Aqui você poderá configurar permissões.
    # Por enquanto, deixaremos aberto para facilitar seu desenvolvimento inicial.


class CategorieViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para listar categorias.
    Permite apenas leitura (list e retrieve) para uso no frontend.
    """
    queryset = Categorie.objects.all().order_by('nome')
    serializer_class = CategorieSerializer

