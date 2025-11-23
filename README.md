# Achados & Perdidos

> Monorepo com backend em Django (API REST) e frontend em Next.js (TypeScript).

Este repositório contém duas aplicações:

- `backend/` — API REST construída com Django + Django REST Framework.
- `frontend/` — interface em Next.js (TypeScript, Tailwind, componentes UI).

Este README reúne instruções de configuração, execução e um resumo das funcionalidades.

**Estrutura principal**

- `backend/` — Django project (`core`) e apps: `achado`, `account`.
- `frontend/` — Next.js app (TypeScript, Tailwind, Sonner, SweetAlert2).

**Resumo das funcionalidades**

- Cadastro de itens encontrados com foto, descrição, categoria e data.
- Geração automática de um código único (8 caracteres) para cada item.
- Listagem pública de itens disponíveis (paginada).
- Busca por código e confirmação de resgate (marcar item como `RESGATADO`).
- Autenticação via JWT (login/refresh/logout). O login retorna `access`, `refresh` e dados básicos do usuário.
- Áreas administrativas via Django Admin (registrar categorias, usuários etc.).


## Backend (Django)

Tecnologias e bibliotecas esperadas:

- Python 3.10+
- Django (5.x conforme settings)
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers
- python-dotenv
- Pillow (necessário para `ImageField`)

Observação: não há `requirements.txt` no repositório; você pode instalar as dependências abaixo diretamente.

Configuração e execução (PowerShell)

1) Criar e ativar um virtualenv e instalar dependências:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install django djangorestframework djangorestframework-simplejwt python-dotenv django-cors-headers Pillow
```

2) Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com pelo menos:

```
SECRET_KEY=alguma_chave_secreta_dificil_de_adivinhar
DEBUG=True
```

3) Migrar base de dados e criar superuser:

```powershell
# no diretório backend com venv ativado
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput   # somente se for rodar em produção
```

4) Rodar servidor de desenvolvimento:

```powershell
python manage.py runserver 0.0.0.0:8000
```

Arquivos estáticos e mídia

- `MEDIA_ROOT` está configurado para `backend/media` e `MEDIA_URL` é `/media/`.
- Em `DEBUG=True` o Django serve arquivos de mídia automaticamente (já configurado em `core/urls.py`).

Configurações importantes

- O projeto lê variáveis via `python-dotenv` (veja `core/settings.py`).
- `AUTH_USER_MODEL` é `account.CustomUser` (login por email).
- CORS liberado para `http://localhost:3000` (veja `CORS_ALLOWED_ORIGINS`).

Endpoints principais da API

Base: `http://localhost:8000/api/`

- `GET /api/itens/` — lista paginada de itens (query `?page=` suportado).
- `GET /api/itens/?codigo=XXXX` — busca exata por código (ou `?search=` para busca por texto).
- `POST /api/itens/` — criar item (multipart/form-data para upload de imagem). Campos esperados: `titulo`, `descricao`, `categoria` (id), `data_encontrado` (YYYY-MM-DD), `status` (ex: `DISPONIVEL`), `foto` (file).
- `PATCH /api/itens/{id}/` — atualizar campos (requer autenticação para endpoints que necessitem — atualmente permissões estão abertas no settings de dev).
- `PATCH /api/itens/atualizar-status/?codigo=XXXXX` — ação custom que atualiza somente o `status` do item usando o `codigo` como query param. Body: `{ "status": "RESGATADO" }`.
- `GET /api/categories/` — lista categorias.

Autenticação

- `POST /api/auth/login/` — body `{ "email": "...", "password": "..." }` retorna `access`, `refresh` e alguns dados do usuário (`email`, `name`, `is_staff`).
- `POST /api/auth/login/refresh/` — renova token.
- `POST /api/auth/logout/` — rota de logout (a implementação atual apenas confirma; a blacklist de tokens não está implementada).

Exemplo rápido de login (curl):

```bash
curl -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"senha"}'
```

Exemplo de criação de item (curl multipart):

```bash
curl -X POST http://localhost:8000/api/itens/ \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "titulo=Garrafa Azul" \
  -F "descricao=Garrafa plástica azul com adesivo" \
  -F "categoria=1" \
  -F "data_encontrado=2025-11-22" \
  -F "foto=@/caminho/para/foto.jpg"
```

Observações de segurança / produção

- Não habilite `DEBUG=True` em produção.
- Configure `ALLOWED_HOSTS` e use um `SECRET_KEY` seguro.
- Considere ativar blacklist/rotina de revogação de tokens se houver logout crítico.

## Frontend (Next.js)

Stack e libs principais

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Sonner (toasts), SweetAlert2 (popups), lucide-react (ícones)

Instalação e execução

```bash
cd frontend
npm install
# dev
npm run dev
# build
npm run build
npm start
```

Variáveis de ambiente

- Crie `frontend/.env.local` com a variável que aponta para a API do backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

- O frontend usa `NEXT_PUBLIC_API_URL` para formar as chamadas HTTP (veja `src/services/api/api.ts`).

Fluxo e funcionalidades do frontend

- Página pública com listagem de itens disponíveis (`PublicItemsList`).
- Dashboard com: criação de novos itens (`NewItemForm`), busca por código e dar baixa no item (`ClaimItemSearch`), listagem de itens (`ItemsList`).
- O formulário de novo item envia `FormData` e exibe o `codigo_do_item` gerado pelo backend.
- Autenticação: o fluxo usa JWT guardado em `localStorage` (`access` e `refresh`) e envia `Authorization: Bearer <token>` para endpoints protegidos.

Observações de desenvolvimento

- Ao trabalhar com upload de imagens do frontend, não defina o header `Content-Type` manualmente quando enviar `FormData` (o código já trata isso).
- Alguns serviços do frontend usam `apiGet`, `apiPost` utilitários em `src/services/api/`.

**Créditos**

Desenvolvido por Marcio Lima — https://github.com/MarciolimaDev