interface Dados {
  start_date: string;
  end_date: string;
}

export async function fetchAnaliseClientes({ start_date, end_date }: Dados) {
  const baseUrl = process.env.NEXT_PUBLIC_LOCAL_API_URL?.trim();
  const apiToken = process.env.NEXT_PUBLIC_API_TOKEN?.trim();

  if (!baseUrl || !apiToken) {
    throw new Error(
      "Variáveis de ambiente faltando: verifique URL e API_TOKEN."
    );
  }

  const url = `${baseUrl}/main/cliente`;

  const body = {
    api_token: apiToken,
    start_date,
    end_date,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  return await response.json();
}
