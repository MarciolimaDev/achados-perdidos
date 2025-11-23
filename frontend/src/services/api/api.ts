export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Normaliza endpoint (remove barra extra)
function normalize(endpoint: string) {
  return endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
}

export async function apiGet(endpoint: string) {
  const res = await fetch(`${API_URL}/${normalize(endpoint)}`);
  
  if (!res.ok) {
    throw new Error(`Erro GET: ${res.status} - ${res.statusText}`);
  }

  return res.json();
}

export async function apiPost(endpoint: string, data: any) {
  const res = await fetch(`${API_URL}/${normalize(endpoint)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = "Erro na requisição";

    try {
      const errorData = await res.json();

      // Se o backend enviou a chave "detail", usamos ela
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } 
      // Caso tenha erros de validação
      else if (typeof errorData === "object") {
        errorMessage = Object.values(errorData)[0] as string;
      }
    } catch {
      // fallback: pega o statusText
      errorMessage = res.statusText;
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

