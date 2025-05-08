import "./globals.css";
import { Header, Header2 } from "../components/header/index";
import { Cairo } from "next/font/google";

// Configurando a fonte Cairo
const cairo = Cairo({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Defina os pesos que você vai usar
  variable: "--font-cairo", // Define uma variável CSS para Tailwind
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <head>
        <style>{`:root { font-family: var(--font-cairo), sans-serif; }`}</style>
      </head>
      <body className={`antialiased ${cairo.variable} bg-gray-100`}>
        <div className="flex h-screen">
          <div>
            <Header />
          </div>
          <div className="w-full">
            <Header2 />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
