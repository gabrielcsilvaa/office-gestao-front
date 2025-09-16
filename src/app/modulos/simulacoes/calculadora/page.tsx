"use client";

import { useEffect, useState } from "react";

export default function CalculadoraPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/simulacoes", { method: "POST" });

        if (!r.ok) {
          const txt = await r.text().catch(() => "");
          throw new Error(`Falha ao iniciar (${r.status}). ${txt}`);
        }

        // já ligada: porta 80
        setSrc("http://localhost");
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Erro desconhecido");
      }
    })();
  }, []);

  if (erro) {
    return (
      <main className="p-4">
        <h1>Não foi possível abrir a calculadora</h1>
        <p className="opacity-70">{erro}</p>

        <div className="mt-3 flex gap-3">
          <button
            className="border px-3 py-2"
            onClick={() => location.reload()}
          >
            Tentar novamente
          </button>

          <a
            className="border px-3 py-2"
            href="http://localhost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir manualmente
          </a>
        </div>
      </main>
    );
  }

  return src ? (
    <iframe
      src={src}
      className="w-full h-[calc(100vh-48px)] border-0"
    />
  ) : (
    <main className="p-4">Preparando a calculadora…</main>
  );
}
