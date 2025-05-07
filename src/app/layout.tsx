import "./globals.css";
import { Header } from "../components/header/index";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="flex h-screen">
          <div className="w-1/3">
            <Header />
          </div>
          <div className="w-2/3  p-8">{children} </div>
        </div>
      </body>
    </html>
  );
}
