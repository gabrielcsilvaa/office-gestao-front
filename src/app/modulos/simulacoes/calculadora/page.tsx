"use client";
import { useEffect, useState } from "react";

export default function CalculadoraPage() {
  const [src, setSrc] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Enviar a requisição POST para o backend
        const response = await fetch("/api/calcular/", { method: "POST" });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
          const txt = await response.text();
          throw new Error(`Falha ao iniciar a calculadora: ${txt}`);
        }

        setSrc("http://localhost"); // ou a URL correta do servidor da calculadora

      } catch (e) {
        // Caso ocorra erro, define o erro
        setErro(e instanceof Error ? e.message : "Erro desconhecido");
      }
    })();
  }, []); // A dependência vazia garante que o efeito rode apenas uma vez quando o componente for montado

  if (erro) {
    return (
      <main className="p-4">
        <h1>Não foi possível abrir a calculadora</h1>
        <p className="opacity-70">{erro}</p>
        <div className="mt-3 flex gap-3">
          <button className="border px-3 py-2" onClick={() => location.reload()}>Tentar novamente</button>
          <a className="border px-3 py-2" href="http://localhost" target="_blank" rel="noopener noreferrer">Abrir manualmente</a>
        </div>
      </main>
    );
  }

  return src ? (    
    <iframe src={src} className="w-full h-[calc(100vh-48px)] border-0" />
  ) : (
    <main className="p-4">Preparando a calculadora…</main>
  );
}
