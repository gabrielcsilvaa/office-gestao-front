import "./globals.css";
import { Header, Header2 } from "../components/header/index";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`antialiased`}>
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
