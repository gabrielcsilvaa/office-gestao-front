import { NextResponse } from "next/server";

export async function POST() {
  try {
    const baseUrl = process.env.LOCAL_API_URL?.trim(); // ex: http://localhost:8000
    if (!baseUrl) {
      return NextResponse.json({ error: "LOCAL_API_URL não configurada" }, { status: 500 });
    }

    // >>> MUITO IMPORTANTE: barra final para o Django não redirecionar
    const url = `${baseUrl.replace(/\/+$/, "")}/api/calcular/`;

    const controller = new AbortController();

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // sem body; sua view não usa
      redirect: "error",           // impede POST -> GET em 301/302
      signal: controller.signal,
    });

    const text = await resp.text().catch(() => "");
    if (!resp.ok) {
      return NextResponse.json({ error: text || resp.statusText }, { status: resp.status });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 });
  }
}
