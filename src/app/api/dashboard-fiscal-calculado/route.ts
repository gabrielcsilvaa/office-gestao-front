import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { start_date, end_date, kpi_type, cliente_selecionado } = await req.json();

    const baseUrl = process.env.LOCAL_API_URL?.trim();
    const apiToken = process.env.API_TOKEN?.trim();

    if (!baseUrl || !apiToken) {
      return NextResponse.json(
        { error: "Variáveis de ambiente faltando." },
        { status: 500 }
      );
    }

    // Nova rota do backend que retorna dados agregados
    const response = await fetch(`${baseUrl}/main/fiscal/aggregated`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_token: apiToken,
        start_date,
        end_date,
        kpi_type, // Indica qual KPI está sendo visualizado
        cliente_selecionado, // Para filtros
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: `Erro do backend: ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Erro interno: ${errorMessage}` },
      { status: 500 }
    );
  }
}
