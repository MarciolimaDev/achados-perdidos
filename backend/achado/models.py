from django.db import models
import random
import string

class Categorie(models.Model):
    nome = models.CharField(max_length=255, verbose_name='Nome Categoria')

    def __str__(self):
        return f"{self.nome}"

# Create your models here.
class Item(models.Model):
    STATUS_CHOICES = [
        ('DISPONIVEL', 'Disponível'),
        ('RESGATADO', 'Resgatado'),
    ]

    codigo_do_item = models.CharField(
        max_length=8, 
        unique=True, 
        verbose_name='Código do Item',
        editable=False,
        help_text='Código único de 8 caracteres gerado automaticamente'
    )
    titulo = models.CharField(max_length=255, verbose_name='Nome do item')
    categoria = models.ForeignKey(
        Categorie, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name='Categoria'
    )
    descricao = models.TextField(verbose_name='Descrição do item')
    foto = models.ImageField(upload_to='items/', verbose_name='Foto do item', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DISPONIVEL', verbose_name='Status do item')
    data_encontrado = models.DateField(verbose_name='Data Item Encontrado')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de criação')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data de atualização')

    def _gerar_codigo_item(self):
        """Gera um código único de 8 caracteres com letras maiúsculas e números"""
        while True:
            codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not Item.objects.filter(codigo_do_item=codigo).exists():
                return codigo

    def save(self, *args, **kwargs):
        # Gera o código automaticamente apenas na criação (quando não tem pk)
        if not self.pk and not self.codigo_do_item:
            self.codigo_do_item = self._gerar_codigo_item()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titulo} - {self.status}"


