// src/services/analiseApi.ts

interface DateRange {
  start_date: string | null;
  end_date: string | null;
}

async function postJSON(url: string, body?: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchUserList() {
  return postJSON("/api/analise-usuario/listar");
}
export async function fetchCompanyList() {
  return postJSON("/api/analise-carteira");
}

export async function fetchUserData(dateRange: DateRange) {
  return postJSON("/api/analise-usuario", dateRange);
}

export async function fetchUserActivities(dateRange: DateRange) {
  return postJSON("/api/analise-usuario/atividades-total", dateRange);
}

export async function fetchModuleActivities(dateRange: DateRange) {
  return postJSON("/api/analise-usuario/modulos", dateRange);
}
