import "./globals.css";


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
