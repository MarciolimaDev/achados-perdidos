from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .forms import CustomUserCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    
    # Layout da página de EDIÇÃO (quando você clica num usuário já criado)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Layout da página de CRIAÇÃO (Add User) - AQUI ESTAVA O ERRO
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # Mudamos de 'confirm_password' para 'password2'
            'fields': ('email', 'first_name', 'last_name', 'is_staff','password1', 'password2'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)