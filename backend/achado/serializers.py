from rest_framework import serializers
from .models import Item, Categorie

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'nome']

class ItemSerializer(serializers.ModelSerializer):
    codigo_do_item = serializers.CharField(read_only=True)
    categoria = serializers.StringRelatedField(read_only=True, required=False, allow_null=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all(),
        source='categoria',
        required=False,
        allow_null=True,
        write_only=True
    )
    
    class Meta:
        model = Item
        fields = '__all__'