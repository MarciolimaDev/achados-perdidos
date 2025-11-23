from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    """Gerenciador para usar o email como identificador único"""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter "is_staff=True".')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter "is_superuser=True".')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None # Removendo o campo username
    email = models.EmailField(verbose_name='Endereço de email', unique=True)
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
