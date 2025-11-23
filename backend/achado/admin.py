from django.contrib import admin

# Register your models here.
from .models import Item, Categorie

# Uma configuração simples para melhorar a visualização dos itens
class ItemAdmin(admin.ModelAdmin):
    list_display = ('codigo_do_item', 'titulo', 'categoria', 'status', 'data_encontrado')
    list_filter = ('status', 'categoria', 'data_encontrado')
    search_fields = ('codigo_do_item', 'titulo', 'descricao')
    readonly_fields = ('codigo_do_item',)


class CategorieAdmin(admin.ModelAdmin):
    list_display = ('nome',)
    search_fields = ('nome',)


admin.site.register(Item, ItemAdmin)
admin.site.register(Categorie, CategorieAdmin)