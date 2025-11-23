# Generated manually

from django.db import migrations, models
import django.db.models.deletion
import random
import string


def gerar_codigo_unico():
    """Gera um código único de 8 caracteres com letras maiúsculas e números"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


def preencher_codigos_existentes(apps, schema_editor):
    """Preenche códigos para todos os itens existentes"""
    Item = apps.get_model('achado', 'Item')
    for item in Item.objects.filter(codigo_do_item__isnull=True):
        # Gera códigos até encontrar um único
        while True:
            codigo = gerar_codigo_unico()
            if not Item.objects.filter(codigo_do_item=codigo).exists():
                item.codigo_do_item = codigo
                item.save()
                break


class Migration(migrations.Migration):

    dependencies = [
        ('achado', '0001_initial'),
    ]

    operations = [
        # Passo 1: Adiciona o campo codigo_do_item como nullable
        migrations.AddField(
            model_name='item',
            name='codigo_do_item',
            field=models.CharField(
                blank=True,
                editable=False,
                help_text='Código único de 8 caracteres gerado automaticamente',
                max_length=8,
                null=True,
                unique=True,
                verbose_name='Código do Item'
            ),
        ),
        # Passo 2: Cria a tabela Categorie
        migrations.CreateModel(
            name='Categorie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255, verbose_name='Nome Categoria')),
            ],
        ),
        # Passo 3: Adiciona o campo categoria como nullable
        migrations.AddField(
            model_name='item',
            name='categoria',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='achado.categorie',
                verbose_name='Categoria'
            ),
        ),
        # Passo 4: Preenche os códigos dos registros existentes
        migrations.RunPython(preencher_codigos_existentes, migrations.RunPython.noop),
        # Passo 5: Torna o campo codigo_do_item obrigatório
        migrations.AlterField(
            model_name='item',
            name='codigo_do_item',
            field=models.CharField(
                editable=False,
                help_text='Código único de 8 caracteres gerado automaticamente',
                max_length=8,
                unique=True,
                verbose_name='Código do Item'
            ),
        ),
    ]



