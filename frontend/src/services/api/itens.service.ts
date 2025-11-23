import { apiGet, apiPost } from "./api";

// ==================== GET ====================

// Listar Itens
export async function listarItens() {
  return apiGet("itens/");
}

export async function listarItensPaginado(page = 1) {
  return apiGet(`/itens/?page=${page}`);
}


// Listar Categorias
export async function listarCategorias() {
  return apiGet("categories/");  // ajuste conforme seu backend
}

// ==================== POST ====================

// Adicionar Item (com formulário)
export async function adicionarItem(formData: FormData, token: string) {
  const res = await fetch(`http://localhost:8000/api/itens/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // NÃO adicionar Content-Type aqui
    },
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
}

// ==================== PATCH ====================

// Atualizar status do item
export async function atualizarStatusItem(itemId: number, token: string) {
  const res = await fetch(`http://localhost:8000/api/itens/${itemId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "RESGATADO" }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
}
